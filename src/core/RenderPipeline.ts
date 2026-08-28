import * as THREE from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import type { RendererPreference } from './RendererPreference';
import { WebGlRenderPipeline } from './WebGlRenderPipeline';
import type {
  WebGpuRenderPipeline,
  GpuFrameTime,
  RendererBackendDiagnostics,
} from './WebGpuRenderPipeline';

export type RenderPipelineRenderer = WebGPURenderer | THREE.WebGLRenderer;
export type { GpuFrameTime, RendererBackendDiagnostics };
type BackendPipeline = WebGlRenderPipeline | WebGpuRenderPipeline;

/**
 * Backend-neutral facade. WebGL immediately selects the original
 * WebGLRenderer/composer implementation. WebGPU imports its TSL render graph
 * only when explicitly requested, keeping the default download and runtime on
 * the known-good production path.
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
  ) {
    this.preference = preference;
    this.implementation = preference === 'webgl'
      ? new WebGlRenderPipeline(canvas, scene, camera)
      : null;
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

  public async init(): Promise<void> {
    if (!this.implementation) {
      const { WebGpuRenderPipeline } = await import('./WebGpuRenderPipeline');
      this.implementation = new WebGpuRenderPipeline(
        this.canvas,
        this.scene,
        this.camera,
        this.preference,
        this.trackTimestamps,
      );
    }
    await this.active.init();
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

  public bundleFixedChildren(group: THREE.Group): void {
    this.active.bundleFixedChildren(group);
  }

  public bundleDynamicChildren(group: THREE.Group): void {
    this.active.bundleDynamicChildren(group);
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
    this.implementation?.dispose();
    this.implementation = null;
  }
}
