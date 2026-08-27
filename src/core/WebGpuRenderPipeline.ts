import * as THREE from 'three/webgpu';
import {
  float,
  oneMinus,
  pass,
  renderOutput,
  uniform,
  vec4,
} from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { selectCharacterRenderMode, type CharacterRenderMode } from './characterRenderMode';
import { LAYER_DEPTH_EPSILON } from './depthComposite';
import { calculateRenderSizing, type RenderSizing } from './renderSizing';
import {
  captureFrameRenderStats,
  EMPTY_FRAME_RENDER_STATS,
  type FrameRenderStats,
} from './frameRenderStats';
import {
  CHARACTER_RENDER_LAYER,
  WORLD_RENDER_LAYER,
} from './renderLayers';
import type { RendererPreference } from './RendererPreference';

interface BackendShape {
  readonly isWebGPUBackend?: boolean;
  readonly isWebGLBackend?: boolean;
  readonly trackTimestamp?: boolean;
  readonly device?: {
    readonly adapterInfo?: AdapterInfoShape;
    readonly lost?: Promise<DeviceLostInfoShape>;
    readonly queue?: {
      onSubmittedWorkDone?: () => Promise<void>;
    };
  };
  readonly getContext?: () => WebGL2RenderingContext;
}

interface DeviceLostInfoShape {
  readonly message?: string;
  readonly reason?: string;
}

interface AdapterInfoShape {
  readonly vendor?: string;
  readonly architecture?: string;
  readonly device?: string;
  readonly description?: string;
}

export interface RendererBackendDiagnostics {
  readonly preference: RendererPreference;
  readonly actual: RendererPreference;
  readonly backend: string;
  readonly vendor: string;
  readonly device: string;
  readonly fallback: boolean;
}

export interface GpuFrameTime {
  readonly renderMilliseconds: number;
  readonly computeMilliseconds: number;
  readonly totalMilliseconds: number;
}

export class WebGpuRenderPipeline {
  public readonly renderer: THREE.WebGPURenderer;
  private readonly renderPipeline: THREE.RenderPipeline;
  private readonly directPass: THREE.PassNode;
  private readonly worldPass: THREE.PassNode;
  private readonly characterPass: THREE.PassNode;
  private readonly directOutput: THREE.Node;
  private readonly isolatedOutput: THREE.Node;
  private readonly opacityNode = uniform(1);
  private readonly readbackTarget = new THREE.RenderTarget(1, 1, {
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false,
  });
  private resolutionScale = 1;
  private sizing: RenderSizing | null = null;
  private targetResizeCount = 0;
  private activeMode: CharacterRenderMode = 'direct-opaque';
  private lastFrameRenderStats: FrameRenderStats = EMPTY_FRAME_RENDER_STATS;

  public constructor(
    canvas: HTMLCanvasElement,
    scene: THREE.Scene,
    camera: THREE.Camera,
    private readonly preference: RendererPreference,
    trackTimestamps = false,
  ) {
    this.renderer = new THREE.WebGPURenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      forceWebGL: preference === 'webgl',
      stencil: false,
      depth: true,
      trackTimestamp: trackTimestamps,
      requiredLimits: preference === 'webgpu'
        ? {
            maxStorageBuffersInVertexStage: 1,
            maxStorageBuffersPerShaderStage: 8,
          }
        : undefined,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.AgXToneMapping;
    this.renderer.toneMappingExposure = 1.24;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.info.autoReset = false;

    const directLayers = new THREE.Layers();
    directLayers.set(WORLD_RENDER_LAYER);
    directLayers.enable(CHARACTER_RENDER_LAYER);
    const worldLayers = new THREE.Layers();
    worldLayers.set(WORLD_RENDER_LAYER);
    const characterLayers = new THREE.Layers();
    characterLayers.set(CHARACTER_RENDER_LAYER);

    this.directPass = pass(scene, camera, {
      depthBuffer: true,
      samples: 2,
    }).setLayers(directLayers);
    this.worldPass = pass(scene, camera, {
      depthBuffer: true,
      samples: 2,
    }).setLayers(worldLayers);
    this.characterPass = pass(scene, camera, {
      depthBuffer: true,
      samples: 2,
    }).setLayers(characterLayers);

    const directColor = this.directPass.getTextureNode();
    const worldColor = this.worldPass.getTextureNode();
    const characterColor = this.characterPass.getTextureNode();
    const worldDepth = this.worldPass.getLinearDepthNode();
    const characterDepth = this.characterPass.getLinearDepthNode();
    const depthVisible = float(
      characterDepth.lessThanEqual(worldDepth.add(LAYER_DEPTH_EPSILON))
        .and(characterDepth.lessThan(0.999_999)),
    );
    const layerAlpha = characterColor.a.mul(this.opacityNode).mul(depthVisible);
    const isolatedColor = vec4(
      worldColor.rgb.mul(oneMinus(layerAlpha)).add(
        characterColor.rgb.mul(this.opacityNode).mul(depthVisible),
      ),
      worldColor.a,
    );

    this.directOutput = this.createBloomOutput(directColor);
    this.isolatedOutput = this.createBloomOutput(isolatedColor);
    this.renderPipeline = new THREE.RenderPipeline(this.renderer, this.directOutput);
    this.renderPipeline.outputColorTransform = false;
    this.resize();
  }

  public async init(): Promise<void> {
    await this.renderer.init();
  }

  public render(_delta = 0): void {
    this.renderer.info.reset();
    this.activateMode(selectCharacterRenderMode(this.opacityNode.value));
    this.renderPipeline.render();
    this.lastFrameRenderStats = captureFrameRenderStats(this.renderer.info.render);
  }

  /** Advances TSL FRAME nodes when rendering outside requestAnimationFrame. */
  public renderManual(delta = 0): void {
    const nodeFrame = this.renderer.inspector.nodeFrame;
    nodeFrame.update();
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
      this.targetResizeCount += 1;
    }
    if (sizeChanged) {
      this.renderer.setSize(next.width, next.height, false);
      this.targetResizeCount += 1;
    }
    this.readbackTarget.setSize(next.drawingBufferWidth, next.drawingBufferHeight);
    this.sizing = next;
  }

  public setResolutionScale(scale: number): void {
    if (Math.abs(scale - this.resolutionScale) < 0.001) return;
    this.resolutionScale = scale;
    this.resize();
  }

  public setCharacterOpacity(opacity: number): void {
    this.opacityNode.value = THREE.MathUtils.clamp(opacity, 0, 1);
  }

  public getCharacterOpacity(): number {
    return this.opacityNode.value;
  }

  public getDepthCompositeDiagnostics() {
    return {
      layerDepthTexture: this.characterPass.renderTarget.depthTexture?.isDepthTexture === true,
      worldDepthConnected: this.worldPass.renderTarget.depthTexture?.isDepthTexture === true,
      renderMode: selectCharacterRenderMode(this.opacityNode.value),
    };
  }

  public async readScreenCenterPixel(): Promise<readonly [number, number, number, number]> {
    const previousTarget = this.renderer.getOutputRenderTarget();
    try {
      const nodeFrame = this.renderer.inspector.nodeFrame;
      nodeFrame.update();
      this.renderer.setOutputRenderTarget(this.readbackTarget);
      this.renderPipeline.render();
    } finally {
      this.renderer.setOutputRenderTarget(previousTarget);
    }
    const width = this.readbackTarget.width;
    const height = this.readbackTarget.height;
    const pixel = await this.renderer.readRenderTargetPixelsAsync(
      this.readbackTarget,
      Math.floor(width * 0.5),
      Math.floor(height * 0.5),
      1,
      1,
    );
    return [
      Number(pixel[0] ?? 0),
      Number(pixel[1] ?? 0),
      Number(pixel[2] ?? 0),
      Number(pixel[3] ?? 0),
    ];
  }

  public getSizingDiagnostics() {
    const sizing = this.sizing ?? calculateRenderSizing(1, 1, 1, this.resolutionScale);
    return {
      ...sizing,
      targetResizeCount: this.targetResizeCount,
    };
  }

  public getActualBackend(): RendererPreference {
    const backend = this.renderer.backend as BackendShape;
    return backend.isWebGPUBackend === true ? 'webgpu' : 'webgl';
  }

  public onDeviceLost(
    handler: (info: DeviceLostInfoShape) => void,
  ): () => void {
    const deviceLost = (this.renderer.backend as BackendShape).device?.lost;
    let active = true;
    if (deviceLost) {
      void deviceLost.then((info) => {
        if (active) handler(info);
      }).catch(() => undefined);
    }
    return () => {
      active = false;
    };
  }

  public getBackendDiagnostics(): RendererBackendDiagnostics {
    const actual = this.getActualBackend();
    if (actual === 'webgpu') {
      const adapter = (this.renderer.backend as BackendShape).device?.adapterInfo;
      const device = [
        adapter?.architecture,
        adapter?.device,
        adapter?.description,
      ].filter((value): value is string => Boolean(value)).join(' | ');
      return {
        preference: this.preference,
        actual,
        backend: 'WebGPU',
        vendor: adapter?.vendor || 'Browser-reported adapter',
        device: device || 'Adapter details unavailable',
        fallback: actual !== this.preference,
      };
    }

    const context = (this.renderer.backend as BackendShape).getContext?.();
    const debugInfo = context?.getExtension('WEBGL_debug_renderer_info');
    return {
      preference: this.preference,
      actual,
      backend: context ? String(context.getParameter(context.VERSION)) : 'WebGL 2',
      vendor: context
        ? String(context.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL ?? context.VENDOR))
        : 'Unavailable',
      device: context
        ? String(context.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL ?? context.RENDERER))
        : 'Unavailable',
      fallback: actual !== this.preference,
    };
  }

  public getProgramCount(): number {
    return this.renderer.info.memory.programs;
  }

  public async synchronizeForLocalProfile(): Promise<void> {
    const backend = this.renderer.backend as BackendShape;
    if (backend.isWebGPUBackend === true) {
      await backend.device?.queue?.onSubmittedWorkDone?.();
      return;
    }
    backend.getContext?.().finish();
  }

  public async resolveGpuFrameTimeForLocalProfile(): Promise<GpuFrameTime | null> {
    const backend = this.renderer.backend as BackendShape;
    if (backend.trackTimestamp !== true) return null;
    const [renderResult, computeResult] = await Promise.all([
      this.renderer.resolveTimestampsAsync(THREE.TimestampQuery.RENDER),
      this.renderer.resolveTimestampsAsync(THREE.TimestampQuery.COMPUTE),
    ]);
    const renderMilliseconds = typeof renderResult === 'number' && Number.isFinite(renderResult)
      ? renderResult
      : null;
    const computeMilliseconds = typeof computeResult === 'number' && Number.isFinite(computeResult)
      ? computeResult
      : null;
    if (renderMilliseconds === null && computeMilliseconds === null) return null;

    const measuredRenderMilliseconds = renderMilliseconds ?? 0;
    const measuredComputeMilliseconds = computeMilliseconds ?? 0;
    return {
      renderMilliseconds: measuredRenderMilliseconds,
      computeMilliseconds: measuredComputeMilliseconds,
      totalMilliseconds: measuredRenderMilliseconds + measuredComputeMilliseconds,
    };
  }

  public async compile(_scene: THREE.Scene, camera: THREE.Camera): Promise<void> {
    const previousLayerMask = camera.layers.mask;
    try {
      camera.layers.enable(CHARACTER_RENDER_LAYER);
      // PassNode.compileAsync() already traverses and compiles the scene for
      // this render target. Compiling the renderer directly first repeated the
      // same traversal, while eagerly compiling both close-camera passes made
      // startup pay for a mode most frames never use.
      await this.directPass.compileAsync(this.renderer);
    } finally {
      camera.layers.mask = previousLayerMask;
    }
  }

  public dispose(): void {
    this.directPass.dispose();
    this.worldPass.dispose();
    this.characterPass.dispose();
    this.renderPipeline.dispose();
    this.readbackTarget.dispose();
    this.renderer.dispose();
  }

  private createBloomOutput(colorNode: THREE.Node<'vec4'>): THREE.Node<'vec4'> {
    return renderOutput(colorNode.add(bloom(colorNode, 0.42, 0.48, 0.88)));
  }

  private activateMode(mode: CharacterRenderMode): void {
    if (mode === this.activeMode && this.renderPipeline.outputNode) return;
    this.activeMode = mode;
    this.renderPipeline.outputNode = mode === 'direct-opaque'
      ? this.directOutput
      : this.isolatedOutput;
    this.renderPipeline.needsUpdate = true;
  }
}
