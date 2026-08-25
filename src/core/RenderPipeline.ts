import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { calculateRenderSizing, type RenderSizing } from './renderSizing';
import { CHARACTER_RENDER_LAYER, WORLD_RENDER_LAYER } from './renderLayers';
import { SceneLayerCompositePass } from './SceneLayerCompositePass';

export class RenderPipeline {
  public readonly renderer: THREE.WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly characterComposite: SceneLayerCompositePass;
  private resolutionScale = 1;
  private sizing: RenderSizing | null = null;
  private targetResizeCount = 0;

  public constructor(
    canvas: HTMLCanvasElement,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) {
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
    this.renderer.info.autoReset = true;
    camera.layers.set(WORLD_RENDER_LAYER);

    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      depthBuffer: true,
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

  public render(delta: number): void {
    this.composer.render(delta);
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

  public getSizingDiagnostics() {
    const sizing = this.sizing ?? calculateRenderSizing(1, 1, 1, this.resolutionScale);
    return {
      ...sizing,
      targetResizeCount: this.targetResizeCount,
    };
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
