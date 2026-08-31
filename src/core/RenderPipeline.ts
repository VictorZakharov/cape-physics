import * as THREE from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import type { RendererPreference } from './RendererPreference';
import {
  requestWebGpuDevice,
  type WebGpuBootstrapStage,
} from './WebGpuDeviceBootstrap';
import { WebGlRenderPipeline } from './WebGlRenderPipeline';
import type {
  WebGpuRenderPipeline,
  GpuFrameTime,
  RendererBackendDiagnostics,
} from './WebGpuRenderPipeline';

export type RenderPipelineRenderer = WebGPURenderer | THREE.WebGLRenderer;
export type { GpuFrameTime, RendererBackendDiagnostics };
type BackendPipeline = WebGlRenderPipeline | WebGpuRenderPipeline;

const WEBGPU_REQUIRED_LIMITS = {
  maxStorageBuffersInVertexStage: 1,
  maxStorageBuffersPerShaderStage: 8,
} as const;

export type RendererInitializationStage = WebGpuBootstrapStage
  | 'webgpu-safety-check'
  | 'construct-webgpu-renderer'
  | 'initialize-webgpu-renderer'
  | 'recover-webgl'
  | 'construct-webgl-renderer'
  | 'initialize-webgl-renderer';

export interface RendererInitializationObserver {
  readonly onStage?: (stage: RendererInitializationStage) => void;
  readonly onWebGpuFallback?: (
    error: unknown,
    failedStage: RendererInitializationStage,
  ) => void;
}

/**
 * Backend-neutral facade. Renderer construction stays inside async init() so
 * context errors share one startup boundary. WebGPU imports its TSL render
 * graph only when explicitly requested, keeping the default download and
 * runtime on the known-good production path.
 */
export class RenderPipeline {
  private implementation: BackendPipeline | null;
  private readonly preference: RendererPreference;

  public constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
    preference: RendererPreference,
    private readonly trackTimestamps = false,
    private readonly webGpuBlockReason: string | null = null,
  ) {
    this.preference = preference;
    // Renderer construction is deliberately deferred into async init(). A
    // synchronous WebGL context error must reach the startup promise boundary
    // instead of escaping from CapeDemo's constructor.
    this.implementation = null;
  }

  private get active(): BackendPipeline {
    if (!this.implementation) {
      throw new Error('Render pipeline was used before initialization.');
    }
    return this.implementation;
  }

  public get renderer(): RenderPipelineRenderer {
    return this.active.renderer;
  }

  public usesNodeRenderer(): boolean {
    return !(this.active instanceof WebGlRenderPipeline);
  }

  public getMaxAnisotropy(): number {
    return this.active instanceof WebGlRenderPipeline
      ? this.active.renderer.capabilities.getMaxAnisotropy()
      : this.active.renderer.getMaxAnisotropy();
  }

  public async init(observer: RendererInitializationObserver = {}): Promise<void> {
    if (this.implementation) {
      await this.active.init();
      return;
    }
    if (this.preference === 'webgl') {
      observer.onStage?.('construct-webgl-renderer');
      this.implementation = new WebGlRenderPipeline(this.canvas, this.scene, this.camera);
      observer.onStage?.('initialize-webgl-renderer');
      await this.active.init();
      return;
    }

    let failedStage: RendererInitializationStage = 'webgpu-safety-check';
    let deviceOwnedByRenderer = false;
    let device: GPUDevice | null = null;
    try {
      observer.onStage?.(failedStage);
      if (this.webGpuBlockReason) throw new Error(this.webGpuBlockReason);
      device = await requestWebGpuDevice(navigator.gpu, {
        requiredLimits: WEBGPU_REQUIRED_LIMITS,
        onStage: (stage) => {
          failedStage = stage;
          observer.onStage?.(stage);
        },
      });
      failedStage = 'construct-webgpu-renderer';
      observer.onStage?.(failedStage);
      const { WebGpuRenderPipeline } = await import('./WebGpuRenderPipeline');
      this.implementation = new WebGpuRenderPipeline(
        this.canvas,
        this.scene,
        this.camera,
        this.preference,
        this.trackTimestamps,
        device,
      );
      deviceOwnedByRenderer = true;
      failedStage = 'initialize-webgpu-renderer';
      observer.onStage?.(failedStage);
      await this.active.init();
    } catch (error) {
      observer.onWebGpuFallback?.(error, failedStage);
      if (!deviceOwnedByRenderer) device?.destroy();
      if (this.implementation) {
        try {
          this.implementation.dispose();
        } catch (disposeError) {
          console.warn('Unable to dispose the failed WebGPU renderer.', disposeError);
        }
      }
      this.implementation = null;
      observer.onStage?.('recover-webgl');
      // Let Chrome finish GPU-process cleanup before asking it for a different
      // graphics context on the same canvas.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
      observer.onStage?.('construct-webgl-renderer');
      this.implementation = new WebGlRenderPipeline(this.canvas, this.scene, this.camera);
      observer.onStage?.('initialize-webgl-renderer');
      await this.active.init();
    }
  }

  public render(delta = 0): void {
    this.active.render(delta);
  }

  public renderManual(delta = 0): void {
    this.active.renderManual(delta);
  }

  public getLastFrameRenderStats() {
    return this.active.getLastFrameRenderStats();
  }

  public resize(): void {
    this.active.resize();
  }

  public setResolutionScale(scale: number): void {
    this.active.setResolutionScale(scale);
  }

  public setCharacterOpacity(opacity: number): void {
    this.active.setCharacterOpacity(opacity);
  }

  public getCharacterOpacity(): number {
    return this.active.getCharacterOpacity();
  }

  public getDepthCompositeDiagnostics() {
    return this.active.getDepthCompositeDiagnostics();
  }

  public async readScreenCenterPixel(): Promise<readonly [number, number, number, number]> {
    return await this.active.readScreenCenterPixel();
  }

  public getSizingDiagnostics() {
    return this.active.getSizingDiagnostics();
  }

  public getActualBackend(): RendererPreference {
    return this.active.getActualBackend();
  }

  public getWebGlRenderer(): THREE.WebGLRenderer | null {
    return this.active instanceof WebGlRenderPipeline
      ? this.active.renderer
      : null;
  }

  public getNodeRenderer(): WebGPURenderer | null {
    return this.usesNodeRenderer()
      ? this.active.renderer as WebGPURenderer
      : null;
  }

  public getWebGpuRenderer(): WebGPURenderer | null {
    return this.active.getActualBackend() === 'webgpu'
      ? this.getNodeRenderer()
      : null;
  }

  public onDeviceLost(
    handler: (info: { readonly message?: string; readonly reason?: string }) => void,
  ): () => void {
    return this.active.onDeviceLost(handler);
  }

  public getBackendDiagnostics(): RendererBackendDiagnostics {
    return this.active.getBackendDiagnostics();
  }

  public getProgramCount(): number {
    return this.active.getProgramCount();
  }

  public async synchronizeForLocalProfile(): Promise<void> {
    await this.active.synchronizeForLocalProfile();
  }

  public async resolveGpuFrameTimeForLocalProfile(): Promise<GpuFrameTime | null> {
    return await this.active.resolveGpuFrameTimeForLocalProfile();
  }

  public async compile(scene: THREE.Scene, camera: THREE.Camera): Promise<void> {
    await this.active.compile(scene, camera);
  }

  public dispose(): void {
    const implementation = this.implementation;
    this.implementation = null;
    if (!implementation) return;
    try {
      void implementation.renderer.setAnimationLoop(null);
    } finally {
      implementation.dispose();
    }
  }
}
