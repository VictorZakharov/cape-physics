export const MAIN_THREAD_PHASES = ['player', 'controllers', 'workerInputs', 'workerResults', 'presentation', 'other'] as const;
export type MainThreadPhase = typeof MAIN_THREAD_PHASES[number];
export interface MainThreadPhaseSnapshot {
  readonly sampleCount: number;
  readonly averageMilliseconds: number;
  readonly phases: Readonly<Record<MainThreadPhase, number>>;
}
const CAPACITY = 1024, WIDTH = MAIN_THREAD_PHASES.length + 1;
/** Coarse, disjoint clocks sampled every fourth callback; no particle-loop timers. */
export class MainThreadPhaseTelemetry {
  public enabled = true;
  public sampling = false;
  private frames = 0;
  private acceptAfter = 0;
  private startIndex = 0;
  private count = 0;
  private readonly timestamps = new Float64Array(CAPACITY);
  private readonly values = new Float64Array(CAPACITY * WIDTH);
  private readonly current = new Float64Array(MAIN_THREAD_PHASES.length);
  public reset(now = performance.now(), warmup = 3000): void {
    this.startIndex = this.count = this.frames = 0; this.sampling = false; this.acceptAfter = now + warmup;
  }
  public beginFrame(timestamp: number): void {
    this.sampling = this.enabled && timestamp >= this.acceptAfter && ++this.frames % 4 === 0;
    this.current.fill(0);
  }
  public begin(): number { return this.sampling ? performance.now() : 0; }
  public end(phase: number, start: number): void {
    if (this.sampling) this.current[phase] = this.current[phase]! + performance.now() - start;
  }
  public finishFrame(timestamp: number, total: number): void {
    const sampled = this.sampling; this.sampling = false;
    if (!sampled || !Number.isFinite(total) || total < 0) return;
    const index = (this.startIndex + this.count) % CAPACITY, offset = index * WIDTH;
    this.timestamps[index] = timestamp; this.values[offset] = total;
    let sum = 0;
    for (let phase = 0; phase < MAIN_THREAD_PHASES.length - 1; phase++) { this.values[offset + phase + 1] = this.current[phase]!; sum += this.current[phase]!; }
    this.values[offset + WIDTH - 1] = Math.max(0, total - sum);
    if (this.count < CAPACITY) this.count++; else this.startIndex = (this.startIndex + 1) % CAPACITY;
    this.trim(timestamp);
  }
  private trim(now: number): void {
    while (this.count && this.timestamps[this.startIndex]! < now - 15000) { this.startIndex = (this.startIndex + 1) % CAPACITY; this.count--; }
  }
  public getSnapshot(now = performance.now()): MainThreadPhaseSnapshot | null {
    this.trim(now); if (this.count < 30) return null;
    const totals = new Float64Array(WIDTH);
    for (let sample = 0; sample < this.count; sample++) {
      const offset = ((this.startIndex + sample) % CAPACITY) * WIDTH;
      for (let phase = 0; phase < WIDTH; phase++) totals[phase] = totals[phase]! + this.values[offset + phase]!;
    }
    return { sampleCount: this.count, averageMilliseconds: totals[0]! / this.count,
      phases: Object.fromEntries(MAIN_THREAD_PHASES.map((phase, index) => [phase, totals[index + 1]! / this.count])) as Record<MainThreadPhase, number> };
  }
}
