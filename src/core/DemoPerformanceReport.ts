import type { SimulationTelemetry } from './SimulationTelemetry';
import type { PerformanceReportDetails } from './PerformanceReport';
import type { RenderPipeline } from './RenderPipeline';
import type { RendererStartupRecovery } from './RendererStartupRecovery';
import type { AdaptiveQuality } from './AdaptiveQuality';
import type { PerformanceMonitor } from './PerformanceMonitor';
import type { CapePerformanceDiagnostics } from '../physics/CapePerformanceProfiler';
import type { WebGlCapeWorkerPool } from '../physics/WebGlCapeWorkerPool';
interface ReportSource {
  simulationTelemetry: SimulationTelemetry;
  pipeline: RenderPipeline; startupRecovery: RendererStartupRecovery; quality: AdaptiveQuality;
  performance: PerformanceMonitor; ready: boolean;
  cape: { getPerformanceDiagnostics(): CapePerformanceDiagnostics; isSleeping(): boolean };
  webGlCapeWorkers: WebGlCapeWorkerPool | null;
  worldColliders: readonly unknown[]; performanceBots: readonly unknown[]; fixedTime: number;
  water: { getDiagnostics(): { activeRipples: number } };
}
export function buildPerformanceReportDetails(source: ReportSource): PerformanceReportDetails {
    const backend = source.pipeline.getBackendDiagnostics();
    const sizing = source.pipeline.getSizingDiagnostics();
    const frameRenderStats = source.pipeline.getLastFrameRenderStats();
    const screenWithTopology = window.screen as Screen & { readonly isExtended?: boolean };
    const multipleScreens = typeof screenWithTopology.isExtended === 'boolean'
      ? screenWithTopology.isExtended
      : null;

    return {
      gpu: source.pipeline.getGpuTiming(),
      gpuSimulation: source.simulationTelemetry.getSnapshot(),
      rendererStartup: source.startupRecovery.getDiagnostics(),
      renderer: {
        backend: backend.backend,
        vendor: backend.vendor,
        device: backend.device,
        preference: backend.preference,
        actual: backend.actual,
        fallback: backend.fallback,
        drawCalls: frameRenderStats.calls,
        triangles: frameRenderStats.triangles,
        programs: source.pipeline.getProgramCount(),
      },
      canvas: {
        drawingBufferWidth: sizing.drawingBufferWidth,
        drawingBufferHeight: sizing.drawingBufferHeight,
        cssWidth: window.innerWidth,
        cssHeight: window.innerHeight,
      },
      quality: {
        label: source.quality.getState().label,
        scale: source.quality.getState().scale,
        targetResizes: sizing.targetResizeCount,
        reason: source.quality.getState().reason,
      },
      workload: source.performance.getWorkloadSnapshot(),
      capeSolver: source.ready ? source.cape.getPerformanceDiagnostics() : null,
      capeWorkers: source.webGlCapeWorkers?.getDiagnostics() ?? null,
      scene: {
        simulationSeconds: source.fixedTime,
        capeSleeping: source.ready ? source.cape.isSleeping() : false,
        worldColliders: source.worldColliders.length,
        activeRipples: source.ready ? source.water.getDiagnostics().activeRipples : 0,
        botCount: source.performanceBots.length,
        simulatedCapes: 1 + source.performanceBots.length,
      },
      page: {
        visibility: document.visibilityState,
        focused: document.hasFocus(),
        devicePixelRatio: window.devicePixelRatio,
        multipleScreens,
        url: window.location.href,
      },
      runtime: {
        hardwareThreads: navigator.hardwareConcurrency,
        deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
        platform: navigator.platform || 'Unknown platform',
        userAgent: navigator.userAgent || 'Unavailable',
      },
    };
}
