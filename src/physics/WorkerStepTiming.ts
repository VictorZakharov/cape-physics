export const WORKER_PHASES = ['constraints', 'body', 'selfFold', 'worldCave', 'other'] as const;
export type WorkerPhase = typeof WORKER_PHASES[number];
export interface WorkerStepPhases {
  readonly computeMilliseconds: number;
  readonly collisionDetail?: Readonly<Record<'self' | 'fold' | 'world' | 'cave', number>>;
  readonly phases: Readonly<Record<WorkerPhase, number>>;
}
/** Worker-local coarse phase clocks. Never called per particle, pair or collider. */
class WorkerStepTiming {
  public isWorker = false;
  public enabled = false;
  private batches = 0;
  private sampling = false;
  private readonly milliseconds = new Float64Array(9);
  public beginBatch(): void { this.sampling = this.enabled && ++this.batches % 4 === 0; this.milliseconds.fill(0); }
  public start(): number { return this.sampling ? performance.now() : 0; }
  public end(phase: number, start: number, detail?: number): void {
    if (this.sampling) {
      const elapsed = performance.now() - start;
      this.milliseconds[phase] = this.milliseconds[phase]! + elapsed;
      if (detail !== undefined) this.milliseconds[5 + detail] = this.milliseconds[5 + detail]! + elapsed;
    }
  }
  public finishBatch(computeMilliseconds: number, steps = 1): WorkerStepPhases | undefined {
    if (!this.sampling) return undefined;
    for (let index = 0; index < 9; index++) this.milliseconds[index] = this.milliseconds[index]! / Math.max(1, steps);
    this.milliseconds[4] = Math.max(0, computeMilliseconds - this.milliseconds[0]! - this.milliseconds[1]! - this.milliseconds[2]! - this.milliseconds[3]!);
    return { computeMilliseconds, collisionDetail: { self: this.milliseconds[5]!, fold: this.milliseconds[6]!, world: this.milliseconds[7]!, cave: this.milliseconds[8]! }, phases: Object.fromEntries(WORKER_PHASES.map((phase, index) => [phase, this.milliseconds[index]!])) as Record<WorkerPhase, number> };
  }
}
export const workerStepTiming = new WorkerStepTiming();
