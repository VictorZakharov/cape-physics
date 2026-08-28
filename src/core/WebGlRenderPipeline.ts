import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { selectCharacterRenderMode } from './characterRenderMode';
import { calculateRenderSizing, type RenderSizing } from './renderSizing';
import { createResolvedDepthTexture } from './depthComposite';
import {
  captureFrameRenderStats,
  EMPTY_FRAME_RENDER_STATS,
  type FrameRenderStats,
} from './frameRenderStats';
import { CHARACTER_RENDER_LAYER, WORLD_RENDER_LAYER } from './renderLayers';
import { SceneLayerCompositePass } from './SceneLayerCompositePass';
import type {
  GpuFrameTime,
  RendererBackendDiagnostics,
} from './WebGpuRenderPipeline';
import type { RendererPreference } from './RendererPreference';

export class WebGlRenderPipeline {
  public readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly characterComposite: SceneLayerCompositePass;
  private readonly camera: THREE.Camera;
  private resolutionScale = 1;
  private sizing: RenderSizing | null = null;
  private targetResizeCount = 0;
  private lastFrameRenderStats: FrameRenderStats = EMPTY_FRAME_RENDER_STATS;

  public constructor(
    canvas: HTMLCanvasElement,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) {
    this.camera = camera;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.AgXToneMapping;
    this.renderer.toneMappingExposure = 1.24;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // EffectComposer invokes WebGLRenderer several times. Automatic resets
    // leave only the final fullscreen output pass in renderer.info, which made
    // real scenes look like one draw call and one triangle in reports.
    this.renderer.info.autoReset = false;
    camera.layers.set(WORLD_RENDER_LAYER);

    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      depthBuffer: true,
      depthTexture: createResolvedDepthTexture('World scene depth'),
      stencilBuffer: false,
    });
    renderTarget.samples = 2;
    this.composer = new EffectComposer(this.renderer, renderTarget);
    this.composer.addPass(new RenderPass(scene, camera));
    this.characterComposite = new SceneLayerCompositePass(scene, camera, CHARACTER_RENDER_LAYER);
    this.composer.addPass(this.characterComposite);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.48, 0.88);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.resize();
  }

  public async init(): Promise<void> {}

  public render(delta: number): void {
    this.renderer.info.reset();
    const renderMode = selectCharacterRenderMode(this.characterComposite.getOpacity());
    this.camera.layers.set(WORLD_RENDER_LAYER);
    this.characterComposite.enabled = renderMode === 'isolated-fade';
    if (renderMode === 'direct-opaque') {
      // Opaque world and character samples must share the same multisampled
      // depth/color pass. Resolving their targets separately loses coverage at
      // silhouettes and produces a one-pixel gap around foreground rocks.
      this.camera.layers.enable(CHARACTER_RENDER_LAYER);
    }
    this.composer.render(delta);
    this.lastFrameRenderStats = captureFrameRenderStats(this.renderer.info.render);
  }

  public renderManual(delta = 0): void {
    this.render(delta);
  }

  public getLastFrameRenderStats(): FrameRenderStats {
    return this.lastFrameRenderStats;
  }

  public resize(): void {
    const next = calculateRenderSizing(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio,
      this.resolutionScale,
    );
    const sizeChanged = !this.sizing
      || next.width !== this.sizing.width
      || next.height !== this.sizing.height;
    const ratioChanged = !this.sizing
      || Math.abs(next.pixelRatio - this.sizing.pixelRatio) > 0.000_1;
    if (!sizeChanged && !ratioChanged) return;

    if (ratioChanged) {
      this.renderer.setPixelRatio(next.pixelRatio);
      // EffectComposer.setPixelRatio already resizes every internal target.
      this.composer.setPixelRatio(next.pixelRatio);
      this.targetResizeCount += 1;
    }
    if (sizeChanged) {
      this.renderer.setSize(next.width, next.height, false);
      this.composer.setSize(next.width, next.height);
      this.targetResizeCount += 1;
    }
    this.sizing = next;
  }

  public setResolutionScale(scale: number): void {
    if (Math.abs(scale - this.resolutionScale) < 0.001) return;
    this.resolutionScale = scale;
    this.resize();
  }

  public setCharacterOpacity(opacity: number): void {
    this.characterComposite.setOpacity(opacity);
  }

  public bundleFixedChildren(_group: THREE.Group): void {}

  public getCharacterOpacity(): number {
    return this.characterComposite.getOpacity();
  }

  public getDepthCompositeDiagnostics() {
    return {
      ...this.characterComposite.getDepthDiagnostics(),
      renderMode: selectCharacterRenderMode(this.characterComposite.getOpacity()),
    };
  }

  public readScreenCenterPixel(): readonly [number, number, number, number] {
    const context = this.renderer.getContext();
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const pixel = new Uint8Array(4);
    context.finish();
    context.readPixels(
      Math.floor(size.x * 0.5),
      Math.floor(size.y * 0.5),
      1,
      1,
      context.RGBA,
      context.UNSIGNED_BYTE,
      pixel,
    );
    return [pixel[0]!, pixel[1]!, pixel[2]!, pixel[3]!];
  }

  public getSizingDiagnostics() {
    const sizing = this.sizing ?? calculateRenderSizing(1, 1, 1, this.resolutionScale);
    return {
      ...sizing,
      targetResizeCount: this.targetResizeCount,
    };
  }

  public getActualBackend(): RendererPreference {
    return 'webgl';
  }

  public onDeviceLost(
    _handler: (info: { readonly message?: string; readonly reason?: string }) => void,
  ): () => void {
    return () => undefined;
  }

  public getBackendDiagnostics(): RendererBackendDiagnostics {
    const context = this.renderer.getContext();
    const debugInfo = context.getExtension('WEBGL_debug_renderer_info');
    return {
      preference: 'webgl',
      actual: 'webgl',
      backend: String(context.getParameter(context.VERSION)),
      vendor: String(context.getParameter(
        debugInfo?.UNMASKED_VENDOR_WEBGL ?? context.VENDOR,
      )),
      device: String(context.getParameter(
        debugInfo?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER,
      )),
      fallback: false,
    };
  }

  public getProgramCount(): number {
    return this.renderer.info.programs?.length ?? 0;
  }

  public async synchronizeForLocalProfile(): Promise<void> {
    this.renderer.getContext().finish();
  }

  public async resolveGpuFrameTimeForLocalProfile(): Promise<GpuFrameTime | null> {
    return null;
  }

  public async compile(scene: THREE.Scene, camera: THREE.Camera): Promise<void> {
    const previousLayerMask = camera.layers.mask;
    try {
      camera.layers.enable(CHARACTER_RENDER_LAYER);
      await this.renderer.compileAsync(scene, camera);
    } finally {
      camera.layers.mask = previousLayerMask;
    }
  }

  public dispose(): void {
    this.composer.dispose();
    this.characterComposite.dispose();
    this.renderer.dispose();
  }
}
