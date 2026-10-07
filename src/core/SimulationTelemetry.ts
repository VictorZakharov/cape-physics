export class SimulationTelemetry {
  private samples: Array<{ time: number; capes: number; delta: number }> = [];
  private acceptAfter = 0;
  public reset(now = performance.now()): void { this.samples = []; this.acceptAfter = now + 3000; }
  public record(capes: number, delta: number): void {
    const now = performance.now(); if (now < this.acceptAfter) return;
    this.samples.push({ time: now, capes, delta }); this.trim(now);
  }
  private trim(now: number): void { while (this.samples.length && this.samples[0]!.time < now - 15000) this.samples.shift(); }
  public getSnapshot() {
    const now = performance.now();
    this.trim(now);
    const elapsed = this.samples.length > 1 ? now - this.samples[0]!.time : 0;
    return { stepHz: elapsed > 0 ? (this.samples.length - 1) * 1000 / elapsed : null,
      capeStepsPerSecond: elapsed > 0 ? this.samples.slice(1).reduce((sum, item) => sum + item.capes, 0) * 1000 / elapsed : null,
      simulatedStepMilliseconds: this.samples.length ? this.samples.reduce((sum, item) => sum + item.delta * 1000, 0) / this.samples.length : null };
  }
}
