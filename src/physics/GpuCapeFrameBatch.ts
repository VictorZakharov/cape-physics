/** Coalesce fixed scene steps without building a backlog of GPU cloth work. */
export class GpuCapeFrameBatch {
  private pending: number | null = null;

  public run<T>(advance: () => T, submit: (step: number) => void): T {
    this.pending = 0;
    try {
      const result = advance();
      if (this.pending > 0) submit(Math.min(this.pending, 1 / 30));
      return result;
    } finally {
      this.pending = null;
    }
  }

  public enqueue(step: number, submit: (step: number) => void): void {
    if (this.pending === null) submit(step); // Deterministic harness steps stay immediate.
    else this.pending += step;
  }
}
