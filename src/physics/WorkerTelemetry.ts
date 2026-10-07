import type { CapePerformanceDiagnostics } from './CapePerformanceProfiler';
export interface WorkerTimingSample {
  time: number; compute: number; latency: number; simulatedStep: number;
  capes: number; profile?: CapePerformanceDiagnostics;
}
export class WorkerTelemetry {
  private samples: WorkerTimingSample[] = [];
  private acceptAfter = 0;
  public reset(now = performance.now(), warmup = 3000): void { this.samples = []; this.acceptAfter = now + warmup; }
  public record(sample: WorkerTimingSample): void {
    if (sample.time < this.acceptAfter || !Number.isFinite(sample.compute)) return;
    this.samples.push(sample); this.trim(sample.time);
  }
  private trim(now: number): void { while (this.samples.length && this.samples[0]!.time < now - 15000) this.samples.shift(); }
  public getSnapshot(now = performance.now()) {
    this.trim(now);
    const count = this.samples.length;
    const elapsed = count > 1 ? now - this.samples[0]!.time : 0;
    const intervals = this.samples.slice(1);
    const computeTotal = intervals.reduce((sum, sample) => sum + sample.compute, 0);
    return { sampleCount: count, windowMilliseconds: elapsed,
      computeMilliseconds: count ? this.samples.reduce((sum, sample) => sum + sample.compute, 0) / count : null,
      simulatedStepMilliseconds: count ? this.samples.reduce((sum, sample) => sum + sample.simulatedStep, 0) / count : null,
      batchLatencyMilliseconds: count ? this.samples.reduce((sum, sample) => sum + sample.latency, 0) / count : null,
      stepHz: elapsed > 0 ? intervals.length * 1000 / elapsed : null,
      utilisationPercent: elapsed > 0 ? computeTotal * 100 / elapsed : null,
      capeStepsPerSecond: elapsed > 0 ? intervals.reduce((sum, sample) => sum + sample.capes, 0) * 1000 / elapsed : null,
      profile: this.samples.at(-1)?.profile };
  }
}
