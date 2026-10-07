import { WORKER_PHASES, type BodyTestCounts, type WorkerStepPhases } from './WorkerStepTiming';
import type { CapePerformanceDiagnostics } from './CapePerformanceProfiler';
export interface WorkerTimingSample {
  time: number; compute: number; latency: number; simulatedStep: number;
  capes: number; stepPhases?: WorkerStepPhases; profile?: CapePerformanceDiagnostics;
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
    const phaseSamples = this.samples.filter(sample => sample.stepPhases !== undefined);
    const averageCompute = count ? this.samples.reduce((sum, sample) => sum + sample.compute, 0) / count : null;
    const sampledCompute = phaseSamples.reduce((sum, sample) => sum + sample.compute, 0) / Math.max(1, phaseSamples.length);
    const normalization = (averageCompute ?? 0) / Math.max(1e-9, sampledCompute);
    const stepPhases = phaseSamples.length >= 8 ? {
      bodyTests: phaseSamples.every(sample => sample.stepPhases!.bodyTests !== undefined)
        ? Object.fromEntries(['particles', 'vertexTests', 'vertexCorrections', 'triangleTests', 'triangleCorrections'].map(key => [key,
          phaseSamples.reduce((sum, sample) => sum + sample.stepPhases!.bodyTests![key as keyof BodyTestCounts], 0) / phaseSamples.length])) as unknown as BodyTestCounts : undefined,
      sampleCount: phaseSamples.length,
      computeMilliseconds: averageCompute!,
      phases: Object.fromEntries(WORKER_PHASES.map(phase => [phase,
        phaseSamples.reduce((sum, sample) => sum + sample.stepPhases!.phases[phase], 0) / phaseSamples.length * normalization])) as WorkerStepPhases['phases'],
    } : null;
    return { stepPhases, sampleCount: count, windowMilliseconds: elapsed,
      computeMilliseconds: averageCompute,
      simulatedStepMilliseconds: count ? this.samples.reduce((sum, sample) => sum + sample.simulatedStep, 0) / count : null,
      batchLatencyMilliseconds: count ? this.samples.reduce((sum, sample) => sum + sample.latency, 0) / count : null,
      stepHz: elapsed > 0 ? intervals.length * 1000 / elapsed : null,
      utilisationPercent: elapsed > 0 ? computeTotal * 100 / elapsed : null,
      capeStepsPerSecond: elapsed > 0 ? intervals.reduce((sum, sample) => sum + sample.capes, 0) * 1000 / elapsed : null,
      profile: this.samples.at(-1)?.profile };
  }
}
