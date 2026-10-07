import { WORKER_PHASES } from '../physics/WorkerStepTiming';
import { CAPE } from '../config';
import { CAPE_DISTANCE_CONSTRAINTS } from '../physics/CapeConstraintTopology';
import { invariant } from '../utils/assert';
import { copyText } from './clipboard';
import {
  formatPerformanceReport,
  type PerformanceReportDetails,
} from './PerformanceReport';

export function formatRendererDevice(device: string): string {
  // ANGLE reports vendor, model, and graphics API in a diagnostic wrapper.
  const angle = /^ANGLE\s*\((.*)\)$/i.exec(device.trim());
  const model = angle ? angle[1]!.split(',')[1]?.trim() ?? device : device;
  const label = model
    .replace(/^ANGLE Metal Renderer:\s*/i, '')
    .replace(/\s*\(0x[\da-f]+\)/gi, '')
    .replace(/\s+(?:Direct3D\d*|D3D\d*|OpenGL(?: ES)?|Vulkan)\b.*$/i, '')
    .trim() || 'GPU unavailable';
  return angle ? `ANGLE / ${label}` : label;
}

export function formatNumericHudText(text: string): string {
  const escaped = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
  return escaped.replace(/\d[\d,]*(?:\.\d+)?/g, '<b>$&</b>');
}

export const PERFORMANCE_WINDOW_MS = 15_000;
const MAXIMUM_FRAME_SAMPLES = 8_192;

export interface PerformanceSnapshot {
  readonly warmupExcludedMilliseconds?: number;
  readonly warmupExcludedFrames?: number;
  readonly warmupReason?: string;
  readonly warmingUp?: boolean;
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
  readonly p95PhysicsMilliseconds: number;
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
  p95PhysicsMilliseconds: 0,
  averageSceneMilliseconds: 0,
  averageRenderMilliseconds: 0,
  averagePhysicsSteps: 0,
  maximumPhysicsSteps: 0,
  sampleCount: 0,
});

export class PerformanceMonitor {
  private readonly panel: HTMLElement;
  private readonly fpsLabel: HTMLElement;
  private readonly fpsCaption: HTMLElement;
  private readonly averageLabel: HTMLElement;
  private readonly frameTimeLabel: HTMLElement;
  private readonly frameP95Label: HTMLElement;
  private readonly mainWorkLabel: HTMLElement;
  private readonly mainP95Label: HTMLElement;
  private readonly lowLabel: HTMLElement;
  private readonly triangleLabel: HTMLElement;
  private readonly particlesLabel: HTMLElement;
  private readonly simulationLabel: HTMLElement;
  private readonly simulationP95Label: HTMLElement;
  private readonly workerCollidersLabel: HTMLElement;
  private readonly workerPhasesLabel: HTMLElement;
  private readonly workersLabel: HTMLElement;
  private readonly scopeLabel: HTMLElement;
  private readonly throughputLabel: HTMLElement;
  private readonly constraintsLabel: HTMLElement;
  private readonly hardwareLabel: HTMLElement;
  private readonly averageHistoryPath: SVGPathElement;
  private readonly lowHistoryPath: SVGPathElement;
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
  private readonly physicsScratch: number[] = [];
  private readonly averageFpsHistory: number[] = [];
  private readonly onePercentLowHistory: number[] = [];
  private sampleStart = 0;
  private sampleCount = 0;
  private workloadStart = 0;
  private workloadCount = 0;
  private retainDisplay = false;
  private hasDisplayedSamples = false;
  private warmupUntil = 0;
  private warmupStarted = 0;
  private excludedFrames = 0;
  private warmupReason = 'none';
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
    this.fpsCaption = invariant(root.querySelector<HTMLElement>('[data-fps-caption]'), 'FPS caption is missing.');
    this.averageLabel = invariant(root.querySelector<HTMLElement>('[data-fps-average]'), 'Average-FPS label is missing.');
    this.frameTimeLabel = invariant(root.querySelector<HTMLElement>('[data-frame-time]'), 'Frame-time label is missing.');
    this.frameP95Label = invariant(root.querySelector<HTMLElement>('[data-frame-p95]'), 'Frame p95 label is missing.');
    this.mainWorkLabel = invariant(root.querySelector<HTMLElement>('[data-main-work]'), 'Main-work label is missing.');
    this.mainP95Label = invariant(root.querySelector<HTMLElement>('[data-main-p95]'), 'Main-work p95 label is missing.');
    this.lowLabel = invariant(root.querySelector<HTMLElement>('[data-fps-low]'), 'Low-FPS label is missing.');
    this.triangleLabel = invariant(root.querySelector<HTMLElement>('[data-triangles]'), 'Triangle label is missing.');
    this.particlesLabel = invariant(root.querySelector<HTMLElement>('[data-sim-particles]'), 'Particle label is missing.');
    this.simulationLabel = invariant(root.querySelector<HTMLElement>('[data-sim-time]'), 'Simulation-time label is missing.');
    this.simulationP95Label = invariant(root.querySelector<HTMLElement>('[data-sim-p95]'), 'Simulation p95 label is missing.');
    this.workerCollidersLabel = invariant(root.querySelector<HTMLElement>('[data-worker-colliders]'), 'Worker collider label is missing.');
    this.workerPhasesLabel = invariant(root.querySelector<HTMLElement>('[data-worker-phases]'), 'Worker phase label is missing.');
    this.workersLabel = invariant(root.querySelector<HTMLElement>('[data-sim-workers]'), 'Worker simulation label is missing.');
    this.scopeLabel = invariant(root.querySelector<HTMLElement>('[data-sim-scope]'), 'Simulation scope label is missing.');
    this.throughputLabel = invariant(root.querySelector<HTMLElement>('[data-sim-throughput]'), 'Simulation throughput label is missing.');
    this.constraintsLabel = invariant(root.querySelector<HTMLElement>('[data-sim-constraints]'), 'Constraint label is missing.');
    this.hardwareLabel = invariant(root.querySelector<HTMLElement>('[data-sim-hardware]'), 'Simulation hardware label is missing.');
    this.averageHistoryPath = invariant(root.querySelector<SVGPathElement>('[data-fps-average-line]'), 'Average-FPS history path is missing.');
    this.lowHistoryPath = invariant(root.querySelector<SVGPathElement>('[data-fps-low-line]'), 'Low-FPS history path is missing.');
    this.historyGraphic = invariant(root.querySelector<SVGElement>('[data-fps-history]'), 'FPS history graphic is missing.');
    this.copyLabel = invariant(root.querySelector<HTMLElement>('[data-performance-copy]'), 'Performance copy label is missing.');
    this.panel.addEventListener('click', this.handleCopy);
  }

  public restartMeasurement(timestamp = performance.now(), reason = 'reset', warmup = 3000): void {
    const retainDisplay = this.retainDisplay || this.hasDisplayedSamples;
    const averagePath = this.averageHistoryPath.getAttribute('d') ?? '';
    const lowPath = this.lowHistoryPath.getAttribute('d') ?? '';
    this.reset();
    this.retainDisplay = retainDisplay;
    if (retainDisplay) {
      this.averageHistoryPath.setAttribute('d', averagePath);
      this.lowHistoryPath.setAttribute('d', lowPath);
    }
    this.warmupStarted = timestamp; this.warmupUntil = timestamp + warmup;
    this.excludedFrames = 0; this.warmupReason = reason; this.paint();
  }

  public recordFrame(timestamp: number): void {
    if (timestamp < this.warmupUntil) {
      this.excludedFrames++; this.lastTimestamp = null;
      if (timestamp - this.lastPaint >= 250) { this.lastPaint = timestamp; this.paint(); }
      return;
    }
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
    return { ...this.snapshot, warmupExcludedMilliseconds: this.warmupUntil > 0
      ? Math.max(0, Math.min(performance.now(), this.warmupUntil) - this.warmupStarted) : 0,
      warmupExcludedFrames: this.excludedFrames, warmupReason: this.warmupReason,
      warmingUp: performance.now() < this.warmupUntil };
  }

  public recordWorkload(timestamp: number, sample: FrameWorkloadSample): void {
    if (timestamp < this.warmupUntil) return;
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
    this.retainDisplay = false;
    this.hasDisplayedSamples = false;
    this.panel.classList.toggle('is-warming-up', false);
    this.warmupUntil = 0; this.warmupStarted = 0; this.excludedFrames = 0; this.warmupReason = 'none';
    this.sampleStart = 0;
    this.sampleCount = 0;
    this.workloadStart = 0;
    this.workloadCount = 0;
    this.workloadSnapshot = EMPTY_WORKLOAD_SNAPSHOT;
    this.averageFpsHistory.length = 0;
    this.onePercentLowHistory.length = 0;
    this.lastTimestamp = null;
    this.lastPaint = 0;
    this.snapshot = { averageFps: 0, onePercentLow: 0, averageFrameTime: 0, medianFrameTime: 0,
      p95FrameTime: 0, p99FrameTime: 0, refreshEstimate: 60, longFrameCount: 0, longestFrameTime: 0,
      sampleCount: 0, windowElapsedMilliseconds: 0 };
    this.averageHistoryPath.setAttribute('d', '');
    this.lowHistoryPath.setAttribute('d', '');
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
      const duration = rawDuration;
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
    // A 1% low is the rate represented by the average of the slowest one
    // percent of frames, not simply the inverse of the p99 boundary sample.
    const slowFrameCount = Math.max(1, Math.ceil(this.durationScratch.length * 0.01));
    let slowFrameTotal = 0;
    for (
      let index = Math.max(0, this.durationScratch.length - slowFrameCount);
      index < this.durationScratch.length;
      index += 1
    ) {
      slowFrameTotal += this.durationScratch[index] ?? 0;
    }
    const slowFrameAverage = slowFrameTotal / slowFrameCount;
    const onePercentLow = slowFrameAverage > 0 ? 1_000 / slowFrameAverage : 0;
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
    this.averageFpsHistory.push(averageFps);
    this.onePercentLowHistory.push(onePercentLow);
    if (this.averageFpsHistory.length > 78) this.averageFpsHistory.shift();
    if (this.onePercentLowHistory.length > 78) this.onePercentLowHistory.shift();
  }

  private recalculateWorkload(): void {
    this.workloadScratch.length = this.workloadCount;
    this.physicsScratch.length = this.workloadCount;
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
      this.physicsScratch[index] = physics;
    }
    this.workloadScratch.sort((first, second) => first - second);
    this.physicsScratch.sort((first, second) => first - second);
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
      p95PhysicsMilliseconds: count > 0 ? this.physicsScratch[p95Index] ?? 0 : 0,
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
    const warmingUp = this.warmupUntil > 0
      && (performance.now() < this.warmupUntil || this.snapshot.sampleCount === 0);
    this.panel.classList.toggle('is-warming-up', warmingUp);
    this.panel.dataset.measurementState = warmingUp ? 'warming-up' : 'measuring';
    if (warmingUp && this.retainDisplay) {
      this.fpsCaption.textContent = 'WARMING UP / PREVIOUS STATS';
      return;
    }
    this.retainDisplay = false;
    this.hasDisplayedSamples = this.snapshot.sampleCount > 0;
    const {
      averageFps,
      onePercentLow,
      averageFrameTime,
      p95FrameTime,
      refreshEstimate,
    } = this.snapshot;
    const {
      averageMainThreadMilliseconds,
      p95MainThreadMilliseconds,
      sampleCount: workloadSampleCount,
    } = this.workloadSnapshot;
    const refreshCapped = this.snapshot.sampleCount >= 30
      && averageFps >= refreshEstimate * 0.97;
    this.fpsLabel.textContent = averageFps > 0 ? averageFps.toFixed(2) : '--';
    this.averageLabel.textContent = averageFps > 0 ? averageFps.toFixed(2) : '--';
    this.lowLabel.textContent = onePercentLow > 0 ? onePercentLow.toFixed(2) : '--';
    this.fpsCaption.textContent = warmingUp ? 'WARMING UP / STATS PAUSED'
      : refreshCapped ? 'DISPLAY FPS / VSYNC-CAPPED' : 'DISPLAY FPS / LAST 15S';
    this.frameTimeLabel.textContent = averageFrameTime > 0
      ? averageFrameTime.toFixed(2)
      : '--';
    this.frameP95Label.textContent = p95FrameTime > 0
      ? p95FrameTime.toFixed(2)
      : '--';
    this.mainWorkLabel.textContent = workloadSampleCount > 0
      ? averageMainThreadMilliseconds.toFixed(2)
      : '--';
    this.mainP95Label.textContent = workloadSampleCount > 0
      ? p95MainThreadMilliseconds.toFixed(2)
      : '--';
    const details = this.getReportDetails();
    const capes = details.scene.simulatedCapes;
    const particlesPerCape = CAPE.columns * CAPE.rows;
    const count = (value: number): string => value.toLocaleString('en-US');
    this.particlesLabel.innerHTML = formatNumericHudText(`${count(capes * particlesPerCape)} SIM PARTICLES (${capes} \u00d7 ${particlesPerCape})`);
    this.constraintsLabel.innerHTML = formatNumericHudText(`${count(capes * CAPE_DISTANCE_CONSTRAINTS.length)} CONSTRAINTS \u00d7 ${CAPE.solverIterations} ITER`);
    this.constraintsLabel.title = 'Distance constraints across all capes per solver iteration; excludes collision and shape guards.';
    this.simulationLabel.textContent = workloadSampleCount > 0
      ? this.workloadSnapshot.averagePhysicsMilliseconds.toFixed(2) : '--';
    this.simulationP95Label.textContent = workloadSampleCount > 0
      ? this.workloadSnapshot.p95PhysicsMilliseconds.toFixed(2) : '--';
    const workers = details.capeWorkers;
    this.workersLabel.hidden = !workers?.active && !workers?.failure;
    this.workerCollidersLabel.hidden = this.workersLabel.hidden;
    this.workerPhasesLabel.hidden = this.workersLabel.hidden;
    this.workerCollidersLabel.innerHTML = formatNumericHudText(`${count(details.scene.worldColliders)} WORLD + ${details.scene.bodyColliders ?? '--'} BODY / CAPE`);
    const split = workers?.stepPhases;
    const phaseLabels = ['CONSTRAINTS', 'BODY', 'SELF + FOLD', 'WORLD + CAVE', 'OTHER'];
    this.workerPhasesLabel.innerHTML = formatNumericHudText(WORKER_PHASES.map((phase, index) => `${phaseLabels[index]} ${split ? split.phases[phase].toFixed(2) : '--'} MS / ${split ? (split.phases[phase] / Math.max(1e-9, split.computeMilliseconds) * 100).toFixed(1) : '--'}%`).join('\n'));
    this.workerPhasesLabel.title = 'Measured inside workers across assigned capes per worker step, including reconciliation collision calls. Other includes input updates, broadphase preparation and sleeping updates. Phase shares sampled every fourth batch and apportioned to all-step compute. Requires 30 samples across workers and at least 8 per worker; phases sum to compute time.';
    const workerTime = workers?.averageStepMilliseconds;
    const workerHz = workers?.workerStepHz ?? workers?.capeResultHz;
    this.workersLabel.innerHTML = formatNumericHudText(workers?.failure
      ? 'SIM WORKERS: FAILED\nMAIN FALLBACK\nDT -- MS / BUSY --%\nCAPES UNAVAILABLE\nPARTICLES UNAVAILABLE'
      : `SIM WORKERS: ${workers?.workers ?? 0} / COMPUTE\n${workerTime != null ? workerTime.toFixed(2) : '--'} MS/STEP @ ${workerHz && workerHz > 0 ? workerHz.toFixed(1) : '--'} HZ\nDT ${workers?.simulatedStepMilliseconds != null ? workers.simulatedStepMilliseconds.toFixed(2) : '--'} MS / ${workers?.utilisationPercent != null ? workers.utilisationPercent.toFixed(1) : '--'}% BUSY\n${this.workerAssignmentSummary(workers?.assignments)}`);
    this.scopeLabel.textContent = details.capeSolver?.implementation === 'webgpu-compute' ? 'MAIN: GPU PREP + CTRL + SYNC' : 'MAIN: PLAYER + CTRL + SYNC';
    this.throughputLabel.innerHTML = formatNumericHudText(this.deliverySummary(details));
    this.triangleLabel.textContent = count(details.renderer.triangles);
    const threads = details.runtime.hardwareThreads;
    const implementation = details.capeSolver?.implementation;
    const backend = implementation ? (implementation === 'webgpu-compute' ? 'GPU' : 'CPU') : '--';
    this.hardwareLabel.innerHTML = formatNumericHudText(`${formatRendererDevice(details.renderer.device)}\n${threads ? count(threads) : '--'} THREADS / SIM: ${backend}`);
    this.hardwareLabel.title = `${details.renderer.device}; hardware logical threads reported by the browser. Cloth workers: ${details.capeWorkers?.active ? details.capeWorkers.workers : 0}.`;

    this.historyGraphic.setAttribute(
      'aria-label',
      `Display cadence over the last ${(this.snapshot.windowElapsedMilliseconds / 1_000).toFixed(1)} seconds: ${averageFps.toFixed(2)} average FPS, ${onePercentLow.toFixed(2)} one-percent low; main-thread work ${averageMainThreadMilliseconds.toFixed(2)} milliseconds average and ${p95MainThreadMilliseconds.toFixed(2)} milliseconds p95`,
    );
    this.panel.classList.toggle('has-frame-drop', averageFps > 0 && averageFps < Math.min(52, refreshEstimate * 0.78));

    const width = 154;
    const height = 31;
    const minimumPlottedFps = refreshEstimate * 0.7;
    const maximumPlottedFps = refreshEstimate * 1.02;
    const fpsPath = (history: readonly number[]) => history.map((fps, index) => {
      const x = history.length <= 1 ? 0 : index / (history.length - 1) * width;
      const normalized = Math.max(
        0,
        Math.min(
          1,
          (fps - minimumPlottedFps) / (maximumPlottedFps - minimumPlottedFps),
        ),
      );
      const y = (1 - normalized) * (height - 1);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    this.averageHistoryPath.setAttribute('d', fpsPath(this.averageFpsHistory));
    this.lowHistoryPath.setAttribute('d', fpsPath(this.onePercentLowHistory));
  }

  private workerAssignmentSummary(assignments: NonNullable<PerformanceReportDetails['capeWorkers']>['assignments']): string {
    if (!assignments?.length) return 'CAPES UNAVAILABLE\nPARTICLES UNAVAILABLE';
    const capes = assignments.map(item => item.capes);
    const particles = assignments.map(item => item.particles);
    const range = (values: number[]) => Math.min(...values) === Math.max(...values) ? values[0]!.toLocaleString('en-US') : `${Math.min(...values).toLocaleString('en-US')}-${Math.max(...values).toLocaleString('en-US')}`;
    return `${range(capes)} CAPES PER WORKER\n${range(particles)} PTCL PER WORKER`;
  }
  private deliverySummary(details: PerformanceReportDetails): string {
    const profile = details.capeSolver;
    const elapsed = profile?.windowElapsedMilliseconds ?? 0;
    const player = elapsed > 0 ? (profile?.windowTotalSteps ?? profile?.windowActiveSteps ?? 0) * 1000 / elapsed : null;
    const bot = details.capeWorkers?.active ? details.capeWorkers.deliveredParticleStepsPerSecond : 0;
    const gpu = details.gpuSimulation?.capeStepsPerSecond;
    const rate = profile?.implementation === 'webgpu-compute' ? (gpu != null ? gpu * CAPE.columns * CAPE.rows : null)
      : player !== null && bot != null ? player * CAPE.columns * CAPE.rows + bot : null;
    return `${rate !== null ? Math.round(rate).toLocaleString('en-US') : '--'} ${profile?.implementation === 'webgpu-compute' ? 'PTCL-STEPS/S SUBMITTED' : 'PARTICLE-STEPS/S'}`;
  }

  private readonly handleCopy = (): void => {
    void this.copyPerformanceReport();
  };

  private async copyPerformanceReport(): Promise<void> {
    try {
      this.recalculate();
      await copyText(formatPerformanceReport({
        capturedAt: new Date().toISOString(),
        performance: this.getSnapshot(),
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
