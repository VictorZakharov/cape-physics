import type { PerformanceSnapshot, WorkloadSnapshot } from './PerformanceMonitor';
import type { GpuTimingSnapshot } from './GpuTiming';
export interface QualityState { readonly scale: number; readonly label: string; readonly reason: string; }
export class AdaptiveQuality {
  private scale = 1;
  private lastEvaluation = 0;
  private stableSince = 0;
  private lastResize = Number.NEGATIVE_INFINITY;
  private reason = 'warming up';
  public constructor(private readonly apply: (state: QualityState) => void) {}
  public observe(time: number, performance: PerformanceSnapshot, workload?: WorkloadSnapshot, gpu?: GpuTimingSnapshot): void {
    if (time < 4 || time - this.lastEvaluation < 2.5 || performance.sampleCount < 30 || performance.averageFps <= 0) return;
    this.lastEvaluation = time;
    const target = Math.min(138, Math.max(55, performance.refreshEstimate * 0.9));
    const budget = 1000 / target;
    const cpu = workload?.averageMainThreadMilliseconds ?? 0;
    const measured = gpu?.averageMilliseconds != null && gpu.sampleCount >= 8;
    const gpuTime = measured ? gpu!.averageMilliseconds! : null;
    const cpuBound = gpuTime !== null ? cpu > gpuTime && cpu > budget * 0.7 : cpu >= performance.averageFrameTime * 0.7;
    const computeBound = measured && (gpu?.computeMilliseconds ?? 0) > (gpu?.renderMilliseconds ?? Infinity);
    const gpuBound = gpuTime !== null ? gpuTime > budget && gpuTime > cpu && !computeBound : !cpuBound && cpu > 0 && performance.averageFps < target * 0.82;
    const headroom = gpuTime !== null ? gpuTime < budget * 0.8 : cpuBound || performance.averageFps > target * 0.98;
    this.reason = cpuBound ? 'CPU-bound: held' : computeBound && !headroom ? 'GPU compute-bound: held' : gpuBound ? (measured ? 'GPU-bound' : 'GPU-bound: inferred (timer unavailable)') : 'headroom: held';
    if (gpuBound) {
      this.stableSince = 0;
      if (this.scale <= 0.66 || time - this.lastResize < 12) return;
      const severity = gpuTime !== null ? budget / gpuTime : performance.averageFps / target;
      this.scale = Math.max(0.66, Math.round(Math.max(this.scale - (severity < 0.72 ? 0.2 : 0.1), this.scale * Math.sqrt(severity / 0.96)) * 100) / 100);
      this.lastResize = time; this.apply(this.getState()); return;
    }
    if (!headroom) { this.stableSince = time; return; }
    if (this.stableSince === 0) this.stableSince = time;
    if (time - this.stableSince > 18 && time - this.lastResize >= 12 && this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.05); this.stableSince = time; this.lastResize = time;
      this.reason = 'headroom: restored'; this.apply(this.getState());
    }
  }
  public getState(): QualityState { return { scale: this.scale, reason: this.reason,
    label: this.scale >= 0.91 ? 'ADAPTIVE ULTRA' : this.scale >= 0.76 ? 'ADAPTIVE HIGH' : 'ADAPTIVE PERFORMANCE' }; }
}
