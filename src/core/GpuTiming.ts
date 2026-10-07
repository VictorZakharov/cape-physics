export interface GpuTimingSnapshot {
  readonly averageMilliseconds: number | null;
  readonly sampleCount: number;
  readonly source: string;
  readonly renderMilliseconds?: number | null;
  readonly computeMilliseconds?: number | null;
}

export class GpuTimingWindow {
  private samples: Array<{ time: number; milliseconds: number }> = [];
  private generation = 0;
  private acceptAfter = 0;
  public constructor(public readonly source: string) {}
  public reset(now = performance.now(), warmup = 3000): void {
    this.samples = []; this.acceptAfter = now + warmup; this.generation++;
  }
  public get epoch(): number { return this.generation; }
  public record(milliseconds: number, epoch = this.generation, now = performance.now()): void {
    if (epoch !== this.generation || now < this.acceptAfter || !Number.isFinite(milliseconds) || milliseconds < 0) return;
    this.samples.push({ time: now, milliseconds });
    this.trim(now);
  }
  private trim(now: number): void { this.samples = this.samples.filter(sample => sample.time >= now - 15000); }
  public getSnapshot(now = performance.now()): GpuTimingSnapshot {
    this.trim(now);
    return { source: this.source, sampleCount: this.samples.length,
      averageMilliseconds: this.samples.length ? this.samples.reduce((sum, sample) => sum + sample.milliseconds, 0) / this.samples.length : null };
  }
}

interface TimerExtension { readonly TIME_ELAPSED_EXT: number; readonly GPU_DISJOINT_EXT: number; }
export class WebGlGpuTimer {
  public readonly window: GpuTimingWindow;
  private readonly extension: TimerExtension | null;
  private readonly pending: Array<{ query: WebGLQuery; epoch: number }> = [];
  private current: { query: WebGLQuery; epoch: number } | null = null;
  public constructor(private readonly gl: WebGL2RenderingContext) {
    this.extension = gl.getExtension('EXT_disjoint_timer_query_webgl2');
    this.window = new GpuTimingWindow(this.extension ? 'EXT_disjoint_timer_query_webgl2 (all render passes)' : 'unavailable');
  }
  public begin(): void {
    if (!this.extension || this.gl.isContextLost()) return;
    const disjoint = this.gl.getParameter(this.extension.GPU_DISJOINT_EXT) === true;
    while (this.pending.length && (disjoint || this.gl.getQueryParameter(this.pending[0]!.query, this.gl.QUERY_RESULT_AVAILABLE))) {
      const sample = this.pending.shift()!;
      if (!disjoint) this.window.record(Number(this.gl.getQueryParameter(sample.query, this.gl.QUERY_RESULT)) / 1e6, sample.epoch);
      this.gl.deleteQuery(sample.query);
    }
    if (disjoint) { this.window.reset(performance.now(), 0); return; }
    if (this.pending.length >= 8) return;
    const query = this.gl.createQuery();
    if (!query) return;
    this.current = { query, epoch: this.window.epoch };
    this.gl.beginQuery(this.extension.TIME_ELAPSED_EXT, query);
  }
  public end(): void {
    if (!this.current || !this.extension) return;
    this.gl.endQuery(this.extension.TIME_ELAPSED_EXT);
    this.pending.push(this.current); this.current = null;
  }
  public dispose(): void { for (const sample of this.pending) this.gl.deleteQuery(sample.query); }
}
