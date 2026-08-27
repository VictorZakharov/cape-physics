import type {
  PerformanceSnapshot,
  WorkloadSnapshot,
} from './PerformanceMonitor';
import type { CapePerformanceDiagnostics } from '../physics/CapePerformanceProfiler';
import { CAPE, PHYSICS_STEP } from '../config';
import type { RendererPreference } from './RendererPreference';

export interface PerformanceReportDetails {
  readonly renderer: {
    readonly backend: string;
    readonly vendor: string;
    readonly device: string;
    readonly preference: RendererPreference;
    readonly actual: RendererPreference;
    readonly fallback: boolean;
    readonly drawCalls: number;
    readonly triangles: number;
    readonly programs: number;
  };
  readonly canvas: {
    readonly drawingBufferWidth: number;
    readonly drawingBufferHeight: number;
    readonly cssWidth: number;
    readonly cssHeight: number;
  };
  readonly quality: {
    readonly label: string;
    readonly scale: number;
    readonly targetResizes: number;
  };
  readonly workload: WorkloadSnapshot;
  readonly capeSolver: CapePerformanceDiagnostics | null;
  readonly scene: {
    readonly simulationSeconds: number;
    readonly capeSleeping: boolean;
    readonly worldColliders: number;
    readonly activeRipples: number;
  };
  readonly page: {
    readonly visibility: DocumentVisibilityState;
    readonly focused: boolean;
    readonly devicePixelRatio: number;
    readonly multipleScreens: boolean | null;
    readonly url: string;
  };
  readonly runtime: {
    readonly platform: string;
    readonly userAgent: string;
  };
}

export interface PerformanceReportInput extends PerformanceReportDetails {
  readonly capturedAt: string;
  readonly performance: PerformanceSnapshot;
}

function metric(value: number, digits = 2): string {
  return Number.isFinite(value) ? value.toFixed(digits) : 'unavailable';
}

export function formatPerformanceReport(input: PerformanceReportInput): string {
  const {
    performance,
    renderer,
    canvas,
    quality,
    workload,
    capeSolver,
    scene,
    page,
    runtime,
  } = input;
  const displayTopology = page.multipleScreens === true
    ? 'multiple screens reported'
    : page.multipleScreens === false
      ? 'single screen reported'
      : 'screen count unavailable';
  const capeSolverLines = capeSolver
    ? [
      `Cape solver: sequential PBD Gauss-Seidel at ${Math.round(1 / PHYSICS_STEP)} Hz | ${CAPE.solverIterations} projection passes | sampled 1/${capeSolver.sampleIntervalSteps} active steps (${capeSolver.sampledActiveSteps} samples)`,
      `Cape step sampled average: ${metric(capeSolver.averageStepMilliseconds)} ms | prediction ${metric(capeSolver.phases.prediction)} | constraints ${metric(capeSolver.phases.constraints)} | self ${metric(capeSolver.phases.selfCollision)} | fold ${metric(capeSolver.phases.foldGuard)} | body ${metric(capeSolver.phases.bodyCollision)} | world ${metric(capeSolver.phases.worldCollision)} | cave ${metric(capeSolver.phases.caveCollision)} | reconcile ${metric(capeSolver.phases.reconciliation)}`,
    ]
    : [];

  return [
    'Cape Physics performance report',
    `Captured: ${input.capturedAt}`,
    `Window: last ${metric(performance.windowElapsedMilliseconds / 1_000, 2)} s of 15 s | ${performance.sampleCount} frames`,
    `Rendered FPS: ${metric(performance.averageFps)} average | ${metric(performance.onePercentLow)} 1% low | ${metric(performance.refreshEstimate, 0)} callback/s estimate`,
    `Frame interval: ${metric(performance.averageFrameTime)} ms average | p50 ${metric(performance.medianFrameTime)} ms | p95 ${metric(performance.p95FrameTime)} ms | p99 ${metric(performance.p99FrameTime)} ms | worst ${metric(performance.longestFrameTime)} ms`,
    `Long frames: ${performance.longFrameCount} at or above 50 ms`,
    `Renderer: ${renderer.backend} | ${renderer.vendor} | ${renderer.device}`,
    `Renderer selection: requested ${renderer.preference.toUpperCase()} | active ${renderer.actual.toUpperCase()} | ${renderer.fallback ? 'fallback active' : 'no fallback'}`,
    `Canvas: ${canvas.drawingBufferWidth}x${canvas.drawingBufferHeight} drawing buffer / ${canvas.cssWidth}x${canvas.cssHeight} CSS px`,
    `Quality: ${quality.label} | ${metric(quality.scale, 3)} resolution scale | ${quality.targetResizes} render-target resizes`,
    `Main thread: ${metric(workload.averageMainThreadMilliseconds)} ms average | p95 ${metric(workload.p95MainThreadMilliseconds)} ms | physics ${metric(workload.averagePhysicsMilliseconds)} ms | scene ${metric(workload.averageSceneMilliseconds)} ms | render submission ${metric(workload.averageRenderMilliseconds)} ms | ${metric(workload.averagePhysicsSteps)} physics steps/callback average, ${workload.maximumPhysicsSteps} maximum`,
    ...capeSolverLines,
    `Scene: ${metric(scene.simulationSeconds, 2)} s simulated | ${renderer.drawCalls} draw calls | ${renderer.triangles} triangles | ${renderer.programs} programs | ${scene.worldColliders} cape colliders | ${scene.activeRipples} active ripples | cape ${scene.capeSleeping ? 'sleeping' : 'active'}`,
    `Page state: ${page.visibility} | ${page.focused ? 'focused' : 'not focused'} | DPR ${metric(page.devicePixelRatio)} | ${displayTopology}`,
    'Timing caveat: rendered FPS and browser callback cadence are not physical panel measurements; render submission is main-thread time, not GPU completion',
    `Page: ${page.url}`,
    `Runtime: ${runtime.platform}`,
    `User agent (raw): ${runtime.userAgent}`,
  ].join('\n');
}
