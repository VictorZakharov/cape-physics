import { invariant } from '../utils/assert';
import { copyText } from './clipboard';
import {
  formatPerformanceReport,
  type PerformanceReportDetails,
} from './PerformanceReport';

export const PERFORMANCE_WINDOW_MS = 15_000;
const MAXIMUM_FRAME_SAMPLES = 8_192;

export interface PerformanceSnapshot {
  readonly averageFps: number;
  readonly onePercentLow: number;
  readonly averageFrameTime: number;
  readonly medianFrameTime: number;
  readonly p95FrameTime: number;
  readonly p99FrameTime: number;
  readonly refreshEstimate: number;
  readonly longFrameCount: number;
  readonly longestFrameTime: number;
  readonly sampleCount: number;
  readonly windowElapsedMilliseconds: number;
}

export interface FrameWorkloadSample {
  readonly physicsMilliseconds: number;
  readonly sceneMilliseconds: number;
  readonly renderMilliseconds: number;
  readonly physicsSteps: number;
}

export interface WorkloadSnapshot {
  readonly averageMainThreadMilliseconds: number;
  readonly p95MainThreadMilliseconds: number;
  readonly averagePhysicsMilliseconds: number;
  readonly averageSceneMilliseconds: number;
  readonly averageRenderMilliseconds: number;
  readonly averagePhysicsSteps: number;
  readonly maximumPhysicsSteps: number;
  readonly sampleCount: number;
}

export const EMPTY_WORKLOAD_SNAPSHOT: WorkloadSnapshot = Object.freeze({
  averageMainThreadMilliseconds: 0,
  p95MainThreadMilliseconds: 0,
  averagePhysicsMilliseconds: 0,
  averageSceneMilliseconds: 0,
  averageRenderMilliseconds: 0,
  averagePhysicsSteps: 0,
  maximumPhysicsSteps: 0,
  sampleCount: 0,
});

export class PerformanceMonitor {
  private readonly panel: HTMLElement;
  private readonly fpsLabel: HTMLElement;
  private readonly frameTimeLabel: HTMLElement;
  private readonly lowLabel: HTMLElement;
  private readonly historyPath: SVGPathElement;
  private readonly historyGraphic: SVGElement;
  private readonly copyLabel: HTMLElement;
  private readonly sampleTimestamps = new Float64Array(MAXIMUM_FRAME_SAMPLES);
  private readonly sampleDurations = new Float64Array(MAXIMUM_FRAME_SAMPLES);
  private readonly workloadTimestamps = new Float64Array(MAXIMUM_FRAME_SAMPLES);
  private readonly physicsDurations = new Float64Array(MAXIMUM_FRAME_SAMPLES);
  private readonly sceneDurations = new Float64Array(MAXIMUM_FRAME_SAMPLES);
  private readonly renderDurations = new Float64Array(MAXIMUM_FRAME_SAMPLES);
  private readonly physicsStepCounts = new Uint8Array(MAXIMUM_FRAME_SAMPLES);
  private readonly durationScratch: number[] = [];
  private readonly workloadScratch: number[] = [];
  private readonly history: number[] = [];
  private sampleStart = 0;
  private sampleCount = 0;
  private workloadStart = 0;
  private workloadCount = 0;
  private lastTimestamp: number | null = null;
  private lastPaint = 0;
  private copyFeedbackTimer: number | null = null;
  private snapshot: PerformanceSnapshot = {
    averageFps: 0,
    onePercentLow: 0,
    averageFrameTime: 0,
    medianFrameTime: 0,
    p95FrameTime: 0,
    p99FrameTime: 0,
    refreshEstimate: 60,
    longFrameCount: 0,
    longestFrameTime: 0,
    sampleCount: 0,
    windowElapsedMilliseconds: 0,
  };
  private workloadSnapshot: WorkloadSnapshot = EMPTY_WORKLOAD_SNAPSHOT;

  public constructor(
    private readonly getReportDetails: () => PerformanceReportDetails,
    root: ParentNode = document,
  ) {
    this.panel = invariant(root.querySelector<HTMLElement>('[data-performance-panel]'), 'Performance panel is missing.');
    this.fpsLabel = invariant(root.querySelector<HTMLElement>('[data-fps]'), 'FPS label is missing.');
    this.frameTimeLabel = invariant(root.querySelector<HTMLElement>('[data-frame-time]'), 'Frame-time label is missing.');
    this.lowLabel = invariant(root.querySelector<HTMLElement>('[data-fps-low]'), 'Low-FPS label is missing.');
    this.historyPath = invariant(root.querySelector<SVGPathElement>('[data-fps-history-line]'), 'FPS history path is missing.');
    this.historyGraphic = invariant(root.querySelector<SVGElement>('[data-fps-history]'), 'FPS history graphic is missing.');
    this.copyLabel = invariant(root.querySelector<HTMLElement>('[data-performance-copy]'), 'Performance copy label is missing.');
    this.panel.addEventListener('click', this.handleCopy);
  }

  public recordFrame(timestamp: number): void {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
      return;
    }
    const duration = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    if (duration <= 0) return;
    const writeIndex = (this.sampleStart + this.sampleCount) % MAXIMUM_FRAME_SAMPLES;
    this.sampleTimestamps[writeIndex] = timestamp;
    this.sampleDurations[writeIndex] = duration;
    if (this.sampleCount < MAXIMUM_FRAME_SAMPLES) {
      this.sampleCount += 1;
    } else {
      this.sampleStart = (this.sampleStart + 1) % MAXIMUM_FRAME_SAMPLES;
    }

    const cutoff = timestamp - PERFORMANCE_WINDOW_MS;
    while (this.sampleCount > 0 && this.sampleTimestamps[this.sampleStart]! < cutoff) {
      this.sampleStart = (this.sampleStart + 1) % MAXIMUM_FRAME_SAMPLES;
      this.sampleCount -= 1;
    }

    if (timestamp - this.lastPaint >= 250) {
      this.lastPaint = timestamp;
      this.recalculate();
      this.paint();
    }
  }

  public getSnapshot(): PerformanceSnapshot {
    return this.snapshot;
  }

  public recordWorkload(timestamp: number, sample: FrameWorkloadSample): void {
    const writeIndex = (this.workloadStart + this.workloadCount) % MAXIMUM_FRAME_SAMPLES;
    this.workloadTimestamps[writeIndex] = timestamp;
    this.physicsDurations[writeIndex] = Math.max(0, sample.physicsMilliseconds);
    this.sceneDurations[writeIndex] = Math.max(0, sample.sceneMilliseconds);
    this.renderDurations[writeIndex] = Math.max(0, sample.renderMilliseconds);
    this.physicsStepCounts[writeIndex] = Math.max(
      0,
      Math.min(255, Math.floor(sample.physicsSteps)),
    );
    if (this.workloadCount < MAXIMUM_FRAME_SAMPLES) {
      this.workloadCount += 1;
    } else {
      this.workloadStart = (this.workloadStart + 1) % MAXIMUM_FRAME_SAMPLES;
    }
    this.trimWorkload(timestamp - PERFORMANCE_WINDOW_MS);
  }

  public getWorkloadSnapshot(): WorkloadSnapshot {
    return this.workloadSnapshot;
  }

  public resume(timestamp: number): void {
    this.lastTimestamp = timestamp;
  }

  public readonly reset = (): void => {
    this.sampleStart = 0;
    this.sampleCount = 0;
    this.workloadStart = 0;
    this.workloadCount = 0;
    this.workloadSnapshot = EMPTY_WORKLOAD_SNAPSHOT;
    this.history.length = 0;
    this.lastTimestamp = null;
    this.historyPath.setAttribute('d', '');
  };

  public dispose(): void {
    this.panel.removeEventListener('click', this.handleCopy);
    if (this.copyFeedbackTimer !== null) window.clearTimeout(this.copyFeedbackTimer);
  }

  private recalculate(): void {
    this.durationScratch.length = this.sampleCount;
    let totalDuration = 0;
    let longFrameCount = 0;
    let longestFrameTime = 0;
    for (let index = 0; index < this.sampleCount; index += 1) {
      const sampleIndex = (this.sampleStart + index) % MAXIMUM_FRAME_SAMPLES;
      const rawDuration = this.sampleDurations[sampleIndex]!;
      const duration = Math.min(rawDuration, 250);
      this.durationScratch[index] = duration;
      totalDuration += duration;
      if (rawDuration >= 50) longFrameCount += 1;
      longestFrameTime = Math.max(longestFrameTime, rawDuration);
    }
    this.durationScratch.sort((a, b) => a - b);
    const averageFrameTime = this.durationScratch.length > 0 ? totalDuration / this.durationScratch.length : 0;
    const averageFps = averageFrameTime > 0 ? 1_000 / averageFrameTime : 0;
    const medianFrameTime = this.sortedPercentile(0.5);
    const p95FrameTime = this.sortedPercentile(0.95);
    const p99FrameTime = this.sortedPercentile(0.99);
    const onePercentLow = p99FrameTime > 0 ? 1_000 / p99FrameTime : 0;
    const fastFrame = this.sortedPercentile(0.1);
    const rawRefresh = fastFrame > 0 ? 1_000 / fastFrame : 60;
    const commonRefreshRates = [30, 60, 75, 90, 100, 120, 144, 165, 240];
    const refreshEstimate = commonRefreshRates.reduce((closest, candidate) => (
      Math.abs(candidate - rawRefresh) < Math.abs(closest - rawRefresh) ? candidate : closest
    ), 60);
    const firstSampleIndex = this.sampleStart;
    const lastSampleIndex = (this.sampleStart + this.sampleCount - 1 + MAXIMUM_FRAME_SAMPLES)
      % MAXIMUM_FRAME_SAMPLES;
    const windowElapsedMilliseconds = this.sampleCount > 0
      ? Math.min(
        PERFORMANCE_WINDOW_MS,
        this.sampleTimestamps[lastSampleIndex]!
          - this.sampleTimestamps[firstSampleIndex]!
          + this.sampleDurations[firstSampleIndex]!,
      )
      : 0;
    this.snapshot = {
      averageFps,
      onePercentLow,
      averageFrameTime,
      medianFrameTime,
      p95FrameTime,
      p99FrameTime,
      refreshEstimate,
      longFrameCount,
      longestFrameTime,
      sampleCount: this.sampleCount,
      windowElapsedMilliseconds,
    };
    this.recalculateWorkload();
    this.history.push(averageFps);
    if (this.history.length > 78) this.history.shift();
  }

  private recalculateWorkload(): void {
    this.workloadScratch.length = this.workloadCount;
    let physicsTotal = 0;
    let sceneTotal = 0;
    let renderTotal = 0;
    let stepTotal = 0;
    let maximumPhysicsSteps = 0;
    for (let index = 0; index < this.workloadCount; index += 1) {
      const sampleIndex = (this.workloadStart + index) % MAXIMUM_FRAME_SAMPLES;
      const physics = this.physicsDurations[sampleIndex] ?? 0;
      const scene = this.sceneDurations[sampleIndex] ?? 0;
      const render = this.renderDurations[sampleIndex] ?? 0;
      const physicsSteps = this.physicsStepCounts[sampleIndex] ?? 0;
      physicsTotal += physics;
      sceneTotal += scene;
      renderTotal += render;
      stepTotal += physicsSteps;
      maximumPhysicsSteps = Math.max(maximumPhysicsSteps, physicsSteps);
      this.workloadScratch[index] = physics + scene + render;
    }
    this.workloadScratch.sort((first, second) => first - second);
    const count = this.workloadCount;
    const total = physicsTotal + sceneTotal + renderTotal;
    const p95Index = Math.min(
      Math.max(0, count - 1),
      Math.floor(count * 0.95),
    );
    this.workloadSnapshot = {
      averageMainThreadMilliseconds: count > 0 ? total / count : 0,
      p95MainThreadMilliseconds: count > 0 ? this.workloadScratch[p95Index] ?? 0 : 0,
      averagePhysicsMilliseconds: count > 0 ? physicsTotal / count : 0,
      averageSceneMilliseconds: count > 0 ? sceneTotal / count : 0,
      averageRenderMilliseconds: count > 0 ? renderTotal / count : 0,
      averagePhysicsSteps: count > 0 ? stepTotal / count : 0,
      maximumPhysicsSteps,
      sampleCount: count,
    };
  }

  private trimWorkload(cutoff: number): void {
    while (
      this.workloadCount > 0
      && this.workloadTimestamps[this.workloadStart]! < cutoff
    ) {
      this.workloadStart = (this.workloadStart + 1) % MAXIMUM_FRAME_SAMPLES;
      this.workloadCount -= 1;
    }
  }

  private sortedPercentile(ratio: number): number {
    if (this.durationScratch.length === 0) return 0;
    const index = Math.min(
      this.durationScratch.length - 1,
      Math.max(0, Math.floor(ratio * this.durationScratch.length)),
    );
    return this.durationScratch[index] ?? 0;
  }

  private paint(): void {
    const { averageFps, onePercentLow, averageFrameTime, refreshEstimate } = this.snapshot;
    this.fpsLabel.textContent = averageFps > 0 ? Math.round(averageFps).toString() : '--';
    this.frameTimeLabel.textContent = averageFrameTime > 0 ? averageFrameTime.toFixed(1) : '--';
    this.lowLabel.textContent = onePercentLow > 0 ? Math.round(onePercentLow).toString() : '--';
    this.historyGraphic.setAttribute(
      'aria-label',
      `Rendered frame rate over the last ${(this.snapshot.windowElapsedMilliseconds / 1_000).toFixed(1)} seconds: ${Math.round(averageFps)} average, ${Math.round(onePercentLow)} one-percent low`,
    );
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

  private readonly handleCopy = (): void => {
    void this.copyPerformanceReport();
  };

  private async copyPerformanceReport(): Promise<void> {
    try {
      await copyText(formatPerformanceReport({
        capturedAt: new Date().toISOString(),
        performance: this.snapshot,
        ...this.getReportDetails(),
      }));
      this.panel.dataset.copyState = 'copied';
      this.copyLabel.textContent = 'COPIED 15S REPORT';
    } catch (error) {
      console.warn('Unable to copy performance report.', error);
      this.panel.dataset.copyState = 'failed';
      this.copyLabel.textContent = 'COPY FAILED';
    }

    if (this.copyFeedbackTimer !== null) window.clearTimeout(this.copyFeedbackTimer);
    this.copyFeedbackTimer = window.setTimeout(() => {
      delete this.panel.dataset.copyState;
      this.copyLabel.textContent = 'CLICK TO COPY 15S REPORT';
      this.copyFeedbackTimer = null;
    }, 2_000);
  }
}
