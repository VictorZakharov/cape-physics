import { MAIN_THREAD_PHASES, type MainThreadPhaseSnapshot } from './MainThreadPhaseTelemetry';
import { WORKER_PHASES } from '../physics/WorkerStepTiming';
import type { GpuTimingSnapshot } from './GpuTiming';
import type { WebGlCapeWorkerDiagnostics } from '../physics/WebGlCapeWorkerPool';
import type {
  PerformanceSnapshot,
  WorkloadSnapshot,
} from './PerformanceMonitor';
import type { CapePerformanceDiagnostics } from '../physics/CapePerformanceProfiler';
import { CAPE, PHYSICS_STEP } from '../config';
import { CAPE_CONSTRAINT_COUNTS, CAPE_DISTANCE_CONSTRAINTS } from '../physics/CapeConstraintTopology';
import type { RendererPreference } from './RendererPreference';
import type { RendererStartupDiagnostics } from './RendererStartupRecovery';

export interface PerformanceReportDetails {
  readonly mainThreadProfilingEnabled?: boolean;
  readonly mainThreadPhases?: MainThreadPhaseSnapshot | null;
  readonly gpu?: GpuTimingSnapshot;
  readonly gpuSimulation?: { stepHz: number | null; capeStepsPerSecond: number | null; simulatedStepMilliseconds: number | null };
  readonly rendererStartup?: RendererStartupDiagnostics;
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
    readonly reason?: string;
    readonly label: string;
    readonly scale: number;
    readonly targetResizes: number;
  };
  readonly workload: WorkloadSnapshot;
  readonly capeSolver: CapePerformanceDiagnostics | null;
  readonly capeWorkers?: {
    readonly logicalCores?: number;
    readonly workerLimit?: number;
    readonly selectionRule?: string;
    readonly overridden?: boolean;
    readonly requestedWorkers?: number | null;
    readonly profilingEnabled?: boolean;
    readonly stepPhases?: WebGlCapeWorkerDiagnostics['stepPhases'];
    readonly simulatedStepMilliseconds?: number | null;
    readonly utilisationPercent?: number | null;
    readonly cpuMillisecondsPerSecond?: number | null;
    readonly deliveredParticleStepsPerSecond?: number | null;
    readonly assignments?: WebGlCapeWorkerDiagnostics['assignments'];
    readonly active: boolean;
    readonly workers: number;
    readonly busyWorkers: number;
    readonly queuedSteps: number;
    readonly capeResultHz?: number;
    readonly workerStepHz?: number;
    readonly averageBatchMilliseconds?: number;
    readonly averageStepMilliseconds?: number | null;
    readonly failure: string | null;
  } | null;
  readonly scene: {
    readonly simulationSeconds: number;
    readonly capeSleeping: boolean;
    readonly worldColliders: number;
    readonly bodyColliders?: number;
    readonly worldColliderKinds?: Readonly<Record<string, number>>;
    readonly activeRipples: number;
    readonly botCount: number;
    readonly simulatedCapes: number;
  };
  readonly page: {
    readonly visibility: DocumentVisibilityState;
    readonly focused: boolean;
    readonly devicePixelRatio: number;
    readonly multipleScreens: boolean | null;
    readonly url: string;
  };
  readonly runtime: {
    readonly deviceMemory?: number;
    readonly hardwareThreads?: number;
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
    rendererStartup,
    renderer,
    canvas,
    quality,
    workload,
    capeSolver,
    capeWorkers,
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
    ? capeSolver.implementation === 'webgpu-compute'
      ? [
        `Cape solver: packed WebGPU compute PBD, frame-coalesced steps (at most 33.3 ms), scene at nominal ${Math.round(1 / PHYSICS_STEP)} Hz | ${CAPE.columns * CAPE.rows * scene.simulatedCapes} active GPU-resident particles across ${scene.simulatedCapes} of 51 preallocated capes | ${CAPE.solverIterations} PBD iterations with ${capeSolver.constraintColorBatches ?? 'unknown'} constraint colors across packed lanes | ${capeSolver.dispatchesPerStep ?? 'unknown'} dispatches in at most 1 compute submission/rendered frame`,
        'Cape timing: no animation-loop particle readback or GPU fence; main-thread physics above measures command preparation/submission, not GPU completion',
      ]
      : [
        capeWorkers?.active
          ? `Cape solver: CPU PBD Gauss-Seidel | player at nominal ${Math.round(1 / PHYSICS_STEP)} Hz on main thread, bots on adaptive worker steps (at most 33.3 ms) across ${capeWorkers.workers} workers | ${CAPE.solverIterations} projection passes | sampled 1/${capeSolver.sampleIntervalSteps} player steps (${capeSolver.sampledActiveSteps} samples)`
          : `Cape solver: sequential CPU PBD Gauss-Seidel at nominal ${Math.round(1 / PHYSICS_STEP)} Hz | ${CAPE.solverIterations} projection passes | sampled 1/${capeSolver.sampleIntervalSteps} active steps (${capeSolver.sampledActiveSteps} samples)`,
        ...(capeSolver.sampledActiveSteps >= 30 ? [
          `Player cape only, awake CPU steps, last 15s: ${metric(capeSolver.averageStepMilliseconds)} ms/step | ${capeSolver.sampledActiveSteps} samples | phase sum ${metric(Object.values(capeSolver.phases).reduce((sum, value) => sum + value, 0))} ms | prediction ${metric(capeSolver.phases.prediction)} | constraints ${metric(capeSolver.phases.constraints)} | self ${metric(capeSolver.phases.selfCollision)} | fold ${metric(capeSolver.phases.foldGuard)} | body ${metric(capeSolver.phases.bodyCollision)} | world ${metric(capeSolver.phases.worldCollision)} | cave ${metric(capeSolver.phases.caveCollision)} | reconcile ${metric(capeSolver.phases.reconciliation)} | anchors ${metric(capeSolver.phases.anchors)} | finalization ${metric(capeSolver.phases.finalization)}`,
        ] : [`Player cape only, awake CPU step timing: insufficient samples (${capeSolver.sampledActiveSteps}/30, last 15s)`]),
        'Scope: physics is main-thread work per rendered callback (player cape, controllers, worker scheduling/result reconciliation, and geometry sync); awake player ms/step excludes those other costs and sleeping steps, so multiplying it by all steps/callback does not estimate total main-thread physics.',

        ...(capeWorkers?.active ? [
          `Cape workers: ${capeWorkers.workers} active | ${capeWorkers.busyWorkers} busy | ${capeWorkers.queuedSteps} queued fixed steps | ${capeWorkers.failure ?? 'healthy'}`,
          ...(capeWorkers.averageStepMilliseconds != null ? [`Cape worker execution: ${capeWorkers.workers} workers | ${metric(capeWorkers.averageStepMilliseconds)} ms/step/worker average across each worker's assigned capes (excludes result packing and message latency)`] : []),
          `Worker selection: ${runtime.hardwareThreads ?? capeWorkers.logicalCores ?? 'unavailable'} logical cores | ${capeWorkers.workers} chosen | limit ${capeWorkers.workerLimit ?? 'unavailable'} | ${capeWorkers.selectionRule ?? 'unavailable'} | override ${capeWorkers.overridden ? `requested ${capeWorkers.requestedWorkers}; worker budget only, CPU speed unchanged` : 'none'}`,
          `Worker simulated timestep: ${capeWorkers.simulatedStepMilliseconds != null ? metric(capeWorkers.simulatedStepMilliseconds) : 'unavailable'} ms (elapsed simulation time, separately from execution wall time) | utilisation ${capeWorkers.utilisationPercent != null ? metric(capeWorkers.utilisationPercent, 1) : 'unavailable'}% average | worker execution ${capeWorkers.cpuMillisecondsPerSecond != null ? metric(capeWorkers.cpuMillisecondsPerSecond) : 'unavailable'} ms/s summed across workers`,
          ...(capeWorkers.assignments ?? []).flatMap(item => [
            `Worker ${item.worker}: ${item.capes} capes / ${item.particles} particles per step | compute ${item.timing.computeMilliseconds != null ? metric(item.timing.computeMilliseconds) : 'unavailable'} ms/step | delivered ${item.timing.stepHz != null ? metric(item.timing.stepHz) : 'unavailable'} steps/s | busy ${item.timing.utilisationPercent != null ? metric(item.timing.utilisationPercent, 1) : 'unavailable'}%`,
            item.timing.stepPhases ? `Worker ${item.worker} phases (ms/step, ${item.timing.stepPhases.sampleCount} measured worker steps): ${WORKER_PHASES.map(phase => `${phase} ${metric(item.timing.stepPhases!.phases[phase])} ms (${metric(item.timing.stepPhases!.phases[phase] / Math.max(1e-9, item.timing.stepPhases!.computeMilliseconds) * 100, 1)}%)`).join(' | ')}`
              : `Worker ${item.worker} phases: ${capeWorkers.profilingEnabled === false ? 'disabled for overhead comparison' : 'insufficient samples (minimum 8/worker; 30 pooled)'}`,
          ]),
          `Worker body candidates: ${formatBodyCandidates(capeWorkers.stepPhases)} | counts sampled every fourth batch; vertex/capsule calls plus 3 incident particles per triangle/sample call, including existing narrowphase bounds checks; vertex candidate-list build checks excluded from counts but included in execution time; corrections mean an applied projection; denominator includes every delivered cape step, including sleeping capes`,
          `Worker phase mean: ${formatWorkerPhaseSplit(capeWorkers.stepPhases)} | phase shares sampled every fourth worker batch, apportioned to all-step compute; includes reconciliation collision calls; other includes input updates, prefilter/preparation and sleeping step updates`,
          ...(capeWorkers.capeResultHz !== undefined ? [`Cape worker delivery: ${metric(capeWorkers.capeResultHz)} results/s/cape | ${metric(capeWorkers.averageBatchMilliseconds ?? 0)} ms average batch latency`] : []),
        ] : []),
      ]
    : [];
  const latestRendererFailure = rendererStartup?.failures.at(-1);
  const rendererRecoveryLines = latestRendererFailure
    ? [
      `Renderer recovery: ${latestRendererFailure.renderer.toUpperCase()} failed at ${latestRendererFailure.stage} | ${latestRendererFailure.name}: ${latestRendererFailure.message} | ${latestRendererFailure.recoveredWith ? `recovered with ${latestRendererFailure.recoveredWith.toUpperCase()}` : 'not recovered'}`,
    ]
    : [];

  return [
    'Cape Physics performance report',
    `Captured: ${input.capturedAt}`,
    `Warm-up excluded: ${metric((performance.warmupExcludedMilliseconds ?? 0) / 1000)} s | ${performance.warmupExcludedFrames ?? 0} frames | ${performance.warmupReason ?? 'none'} | ${performance.warmingUp ? 'warming up: measurements unavailable' : 'measuring steady state; subsequent stalls retained'}`,
    `Window: last ${metric(performance.windowElapsedMilliseconds / 1_000, 2)} s of 15 s | ${performance.sampleCount} frames`,
    `Rendered FPS: ${metric(performance.averageFps)} average | ${metric(performance.onePercentLow)} 1% low | ${metric(performance.refreshEstimate, 0)} callback/s estimate`,
    `Frame interval: ${metric(performance.averageFrameTime)} ms average | p50 ${metric(performance.medianFrameTime)} ms | p95 ${metric(performance.p95FrameTime)} ms | p99 ${metric(performance.p99FrameTime)} ms | worst ${metric(performance.longestFrameTime)} ms`,
    `Long frames: ${performance.longFrameCount} at or above 50 ms`,
    `Renderer: ${renderer.backend} | ${renderer.vendor} | ${renderer.device}`,
    `Renderer selection: requested ${renderer.preference.toUpperCase()} | active ${renderer.actual.toUpperCase()} | ${renderer.fallback ? 'fallback active' : 'no fallback'}`,
    ...rendererRecoveryLines,
    `Canvas: ${canvas.drawingBufferWidth}x${canvas.drawingBufferHeight} drawing buffer / ${canvas.cssWidth}x${canvas.cssHeight} CSS px`,
    `GPU frame execution: ${input.gpu?.averageMilliseconds != null ? metric(input.gpu.averageMilliseconds) + ' ms average' : 'unavailable'} | ${input.gpu?.sampleCount ?? 0} samples, last 15s | ${input.gpu?.source ?? 'unavailable'}${input.gpu?.renderMilliseconds != null ? ` | render ${metric(input.gpu.renderMilliseconds)} ms / compute ${metric(input.gpu.computeMilliseconds ?? 0)} ms` : ''}`,
    `Quality: ${quality.label} | ${metric(quality.scale, 3)} resolution scale | ${quality.reason ?? 'reason unavailable'} | ${quality.targetResizes} render-target resizes`,
    `Main thread: ${metric(workload.averageMainThreadMilliseconds)} ms average | p95 ${metric(workload.p95MainThreadMilliseconds)} ms | physics ${metric(workload.averagePhysicsMilliseconds)} ms | scene ${metric(workload.averageSceneMilliseconds)} ms | render submission ${metric(workload.averageRenderMilliseconds)} ms | ${metric(workload.averagePhysicsSteps)} physics steps/callback average, ${workload.maximumPhysicsSteps} maximum`,
    ...capeSolverLines,
    formatMainThreadPhases(input.mainThreadPhases, input.mainThreadProfilingEnabled),
    `Cloth workload: ${(CAPE.columns * CAPE.rows * scene.simulatedCapes).toLocaleString('en-US')} sim particles (${scene.simulatedCapes} \u00d7 ${CAPE.columns * CAPE.rows}) | ${(CAPE_DISTANCE_CONSTRAINTS.length * scene.simulatedCapes).toLocaleString('en-US')} distance constraints \u00d7 ${CAPE.solverIterations} iterations | main-thread simulation phase ${metric(workload.averagePhysicsMilliseconds)} ms average / ${metric(workload.p95PhysicsMilliseconds)} ms p95 (excludes asynchronous worker and GPU execution)`,
    `Collider inventory per cape: ${scene.worldColliders} static world proxies (${Object.entries(scene.worldColliderKinds ?? {}).map(([kind, count]) => `${kind} ${count}`).join(', ') || 'types unavailable'}) | ${scene.bodyColliders ?? 'unavailable'} animated body capsules | cave floor/ceiling/sides sampled analytically, not included in proxy count`,
    `Constraints by type: ${Object.entries(CAPE_CONSTRAINT_COUNTS).map(([kind, count]) => `${kind} ${count * scene.simulatedCapes} (${count}/cape)`).join(' | ')} | excludes collision and shape guards`,
    `Simulation delivery: ${simulationDelivery(input)}`,
    `Main-thread physics wall cost: ${metric(workload.averagePhysicsMilliseconds * performance.averageFps)} ms/s (per-callback measured physics x callback rate); worker wall cost above is separate and executes in parallel`,
    'Execution timers measure elapsed time inside solving, exclude idle/message waits, and may include OS preemption; utilisation is measured solve wall time / observation time, not an OS CPU counter.',
    `Hardware: ${runtime.hardwareThreads ?? 'unavailable'} logical cores | navigator.deviceMemory ${runtime.deviceMemory !== undefined ? runtime.deviceMemory + ' GiB (browser approximation)' : 'unavailable'}`,
    `Scene: ${metric(scene.simulationSeconds, 2)} s simulated | ${scene.botCount} performance bots | ${scene.simulatedCapes} simulated capes | ${renderer.drawCalls} draw calls | ${renderer.triangles} triangles | ${renderer.programs} programs | ${scene.worldColliders} cape colliders/cape | ${scene.activeRipples} active ripples | player cape ${scene.capeSleeping ? 'sleeping' : 'active'}`,
    `Page state: ${page.visibility} | ${page.focused ? 'focused' : 'not focused'} | DPR ${metric(page.devicePixelRatio)} | ${displayTopology}`,
    'Timing caveat: display FPS is refresh/vsync capped and therefore cannot compare backend headroom; main-thread render submission is not GPU completion',
    `Page: ${page.url}`,
    `Runtime: ${runtime.platform}`,
    `User agent (raw): ${runtime.userAgent}`,
  ].join('\n');
}

export function simulationDelivery(input: PerformanceReportDetails): string {
  const particles = CAPE.columns * CAPE.rows;
  const profile = input.capeSolver;
  const elapsed = profile?.windowElapsedMilliseconds ?? 0;
  const playerHz = elapsed > 0 ? (profile?.windowTotalSteps ?? profile?.windowActiveSteps ?? 0) * 1000 / elapsed : null;
  const gpu = input.gpuSimulation;
  if (profile?.implementation === 'webgpu-compute') return gpu?.capeStepsPerSecond != null
    ? `${metric(gpu.capeStepsPerSecond * particles, 0)} submitted particle-steps/s | packed GPU ${metric(gpu.stepHz ?? 0)} submissions/s | simulated timestep ${metric(gpu.simulatedStepMilliseconds ?? 0)} ms`
    : 'unavailable (packed GPU submissions)';
  const workerParticles = input.capeWorkers?.active ? input.capeWorkers.deliveredParticleStepsPerSecond : 0;
  if (playerHz === null || workerParticles == null) return 'unavailable (awaiting current-window delivery samples)';
  return `${metric(playerHz * particles + workerParticles, 0)} particle-steps/s | player ${metric(playerHz)} step calls/s (includes sleeping updates; awake ${metric((profile?.windowActiveSteps ?? 0) * 1000 / elapsed)}/s) x ${particles} particles | bot delivery ${metric(workerParticles, 0)} particle-steps/s`;
}

export function formatWorkerPhaseSplit(split: WebGlCapeWorkerDiagnostics['stepPhases'] | undefined): string {
  if (!split) return 'insufficient samples (minimum 8/worker; 30 pooled), or profiling disabled';
  return `${split.sampleCount} phase samples | ` + WORKER_PHASES.map(phase => `${phase} ${metric(split.phases[phase])} ms (${metric(split.phases[phase] / Math.max(1e-9, split.computeMilliseconds) * 100, 1)}%)`).join(' | ')
    + ` | sum ${metric(Object.values(split.phases).reduce((sum, value) => sum + value, 0))} ms / compute ${metric(split.computeMilliseconds)} ms`;
}

export function formatBodyCandidates(split: WebGlCapeWorkerDiagnostics['stepPhases'] | undefined): string {
  const counts = split?.bodyTests;
  if (!counts || counts.particles <= 0) return 'insufficient samples';
  return `${metric((counts.vertexTests + 3 * counts.triangleTests) / counts.particles)} tests/particle/step | vertex ${metric(counts.vertexTests / counts.particles)} (${metric(counts.vertexCorrections / Math.max(1, counts.vertexTests) * 100, 3)}% correcting) | triangle incidence ${metric(3 * counts.triangleTests / counts.particles)} (${metric(counts.triangleCorrections / Math.max(1, counts.triangleTests) * 100, 3)}% correcting triangle/sample tests)`;
}

export function formatMainThreadPhases(snapshot: MainThreadPhaseSnapshot | null | undefined, enabled = true): string {
  if (!enabled) return 'Main-thread simulation breakdown: profiling disabled';
  if (!snapshot) return 'Main-thread simulation breakdown: insufficient samples (minimum 30; every fourth callback after warm-up)';
  const phases = MAIN_THREAD_PHASES.map(phase => `${phase} ${metric(snapshot.phases[phase])} ms`).join(' | ');
  const sum = MAIN_THREAD_PHASES.reduce((total, phase) => total + snapshot.phases[phase], 0);
  return `Main-thread simulation breakdown: ${snapshot.sampleCount} sampled callbacks | ${phases} | sum ${metric(sum)} ms / sampled simulation phase ${metric(snapshot.averageMilliseconds)} ms; raw sampled averages per callback, not rescaled to all-frame mean. player: CPU cape only; controllers: player/bot movement and landing handling; workerInputs: bot input preparation/submission, flush and CPU bot fallback; workerResults: state reconciliation, arrival processing and completed-cape normals; presentation: player geometry and bot mesh updates; other: population, clock and remaining scheduling; excludes scene update, render submission and asynchronous worker/GPU execution`;
}
