export const CAPE_PROFILE_PHASES = [
  'prediction',
  'constraints',
  'selfCollision',
  'foldGuard',
  'bodyCollision',
  'worldCollision',
  'caveCollision',
  'reconciliation',
  'anchors',
  'finalization',
] as const;

export type CapeProfilePhase = typeof CAPE_PROFILE_PHASES[number];

export interface CapePerformanceDiagnostics {
  readonly implementation: 'cpu-pbd' | 'webgpu-compute';
  readonly dispatchesPerStep?: number;
  readonly constraintColorBatches?: number;
  readonly windowActiveSteps?: number;
  readonly windowTotalSteps?: number;
  readonly windowElapsedMilliseconds?: number;
  readonly sufficientSamples?: boolean;
  readonly sampleIntervalSteps: number;
  readonly totalSteps: number;
  readonly activeSteps: number;
  readonly sampledActiveSteps: number;
  readonly averageStepMilliseconds: number;
  readonly phases: Readonly<Record<CapeProfilePhase, number>>;
}

const DEFAULT_SAMPLE_INTERVAL_STEPS = 16;

function emptyPhaseRecord(): Record<CapeProfilePhase, number> {
  return {
    prediction: 0,
    constraints: 0,
    selfCollision: 0,
    foldGuard: 0,
    bodyCollision: 0,
    worldCollision: 0,
    caveCollision: 0,
    reconciliation: 0,
    anchors: 0,
    finalization: 0,
  };
}

/**
 * Samples one active simulation step out of every 16. The profiler accepts
 * already-measured durations so the hot solver loop pays no clock cost on the
 * other 15 steps (apart from one step timestamp for delivery accounting).
 */
export class CapePerformanceProfiler {
  private totalSteps = 0;
  private activeSteps = 0;
  private sampling = false;
  private pending = emptyPhaseRecord();
  private steps: Array<{ time: number; active: boolean }> = [];
  private samples: Array<{ time: number; milliseconds: number; phases: Record<CapeProfilePhase, number> }> = [];
  private acceptAfter = 0;
  public constructor(private readonly sampleIntervalSteps = DEFAULT_SAMPLE_INTERVAL_STEPS) {
    if (!Number.isInteger(sampleIntervalSteps) || sampleIntervalSteps < 1) throw new RangeError('Cape profile sample interval must be a positive integer.');
  }
  public restart(now = performance.now(), warmup = 3000): void {
    this.steps = []; this.samples = []; this.sampling = false; this.acceptAfter = now + warmup;
  }
  public beginStep(active: boolean): boolean {
    this.totalSteps++; if (active) this.activeSteps++;
    const now = performance.now();
    if (now >= this.acceptAfter) this.steps.push({ time: now, active });
    this.trim(now);
    this.sampling = active && now >= this.acceptAfter && (this.activeSteps - 1) % this.sampleIntervalSteps === 0;
    if (this.sampling) this.pending = emptyPhaseRecord();
    return this.sampling;
  }
  public record(phase: CapeProfilePhase, milliseconds: number): void {
    if (this.sampling && Number.isFinite(milliseconds)) this.pending[phase] += Math.max(0, milliseconds);
  }
  public endStep(milliseconds: number): void {
    if (!this.sampling) return;
    if (Number.isFinite(milliseconds)) {
      const phaseTotal = Object.values(this.pending).reduce((sum, value) => sum + value, 0);
      this.pending.finalization += Math.max(0, milliseconds - phaseTotal);
      this.samples.push({ time: performance.now(), milliseconds: Object.values(this.pending).reduce((sum, value) => sum + value, 0), phases: this.pending });
    }
    this.sampling = false;
  }
  private trim(now: number): void {
    while (this.steps.length && this.steps[0]!.time < now - 15000) this.steps.shift();
    while (this.samples.length && this.samples[0]!.time < now - 15000) this.samples.shift();
  }
  public getDiagnostics(): CapePerformanceDiagnostics {
    const now = performance.now();
    this.trim(now);
    const phases = emptyPhaseRecord(); const count = this.samples.length;
    for (const sample of this.samples) for (const phase of CAPE_PROFILE_PHASES) phases[phase] += sample.phases[phase] / Math.max(1, count);
    const elapsed = this.steps.length > 1 ? now - this.steps[0]!.time : 0;
    return { implementation: 'cpu-pbd', sampleIntervalSteps: this.sampleIntervalSteps,
      totalSteps: this.totalSteps, activeSteps: this.activeSteps, sampledActiveSteps: count,
      sufficientSamples: count >= 30, windowTotalSteps: this.steps.length,
      windowActiveSteps: this.steps.slice(1).filter(step => step.active).length, windowElapsedMilliseconds: elapsed,
      averageStepMilliseconds: this.samples.reduce((sum, sample) => sum + sample.milliseconds, 0) / Math.max(1, count), phases };
  }
}
