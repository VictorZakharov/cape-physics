import { percentile } from '../utils/math';
import { invariant } from '../utils/assert';

export interface PerformanceSnapshot {
  readonly averageFps: number;
  readonly onePercentLow: number;
  readonly averageFrameTime: number;
  readonly refreshEstimate: number;
}

interface FrameSample {
  readonly timestamp: number;
  readonly duration: number;
}

export class PerformanceMonitor {
  private readonly panel: HTMLElement;
  private readonly fpsLabel: HTMLElement;
  private readonly frameTimeLabel: HTMLElement;
  private readonly lowLabel: HTMLElement;
  private readonly historyPath: SVGPathElement;
  private readonly samples: FrameSample[] = [];
  private readonly history: number[] = [];
  private lastTimestamp: number | null = null;
  private lastPaint = 0;
  private snapshot: PerformanceSnapshot = {
    averageFps: 0,
    onePercentLow: 0,
    averageFrameTime: 0,
    refreshEstimate: 60,
  };

  public constructor(root: ParentNode = document) {
    this.panel = invariant(root.querySelector<HTMLElement>('[data-performance-panel]'), 'Performance panel is missing.');
    this.fpsLabel = invariant(root.querySelector<HTMLElement>('[data-fps]'), 'FPS label is missing.');
    this.frameTimeLabel = invariant(root.querySelector<HTMLElement>('[data-frame-time]'), 'Frame-time label is missing.');
    this.lowLabel = invariant(root.querySelector<HTMLElement>('[data-fps-low]'), 'Low-FPS label is missing.');
    this.historyPath = invariant(root.querySelector<SVGPathElement>('[data-fps-history-line]'), 'FPS history path is missing.');
    this.panel.addEventListener('click', this.reset);
  }

  public recordFrame(timestamp: number): void {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
      return;
    }
    const duration = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    if (duration <= 0 || duration > 250) return;
    this.samples.push({ timestamp, duration });
    const cutoff = timestamp - 5_000;
    while ((this.samples[0]?.timestamp ?? timestamp) < cutoff) this.samples.shift();

    if (timestamp - this.lastPaint >= 250) {
      this.lastPaint = timestamp;
      this.recalculate();
      this.paint();
    }
  }

  public getSnapshot(): PerformanceSnapshot {
    return this.snapshot;
  }

  public readonly reset = (): void => {
    this.samples.length = 0;
    this.history.length = 0;
    this.lastTimestamp = null;
    this.historyPath.setAttribute('d', '');
  };

  private recalculate(): void {
    const durations = this.samples.map((sample) => sample.duration);
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    const averageFrameTime = durations.length > 0 ? totalDuration / durations.length : 0;
    const averageFps = averageFrameTime > 0 ? 1_000 / averageFrameTime : 0;
    const p99FrameTime = percentile(durations, 0.99);
    const onePercentLow = p99FrameTime > 0 ? 1_000 / p99FrameTime : 0;
    const fastFrame = percentile(durations, 0.1);
    const rawRefresh = fastFrame > 0 ? 1_000 / fastFrame : 60;
    const commonRefreshRates = [30, 60, 75, 90, 100, 120, 144, 165, 240];
    const refreshEstimate = commonRefreshRates.reduce((closest, candidate) => (
      Math.abs(candidate - rawRefresh) < Math.abs(closest - rawRefresh) ? candidate : closest
    ), 60);
    this.snapshot = { averageFps, onePercentLow, averageFrameTime, refreshEstimate };
    this.history.push(averageFps);
    if (this.history.length > 78) this.history.shift();
  }

  private paint(): void {
    const { averageFps, onePercentLow, averageFrameTime, refreshEstimate } = this.snapshot;
    this.fpsLabel.textContent = averageFps > 0 ? Math.round(averageFps).toString() : '--';
    this.frameTimeLabel.textContent = averageFrameTime > 0 ? averageFrameTime.toFixed(1) : '--';
    this.lowLabel.textContent = onePercentLow > 0 ? Math.round(onePercentLow).toString() : '--';
    this.panel.classList.toggle('has-frame-drop', averageFps > 0 && averageFps < Math.min(52, refreshEstimate * 0.78));

    const width = 154;
    const height = 31;
    const ceiling = Math.max(60, refreshEstimate);
    const path = this.history.map((fps, index) => {
      const x = this.history.length <= 1 ? 0 : index / (this.history.length - 1) * width;
      const y = height - Math.min(1, fps / ceiling) * (height - 1);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    this.historyPath.setAttribute('d', path);
  }
}
