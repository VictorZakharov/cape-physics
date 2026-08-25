import type { PerformanceSnapshot } from '../core/PerformanceMonitor';
import type { QualityState } from '../core/AdaptiveQuality';

interface CapeDemoDiagnostics {
  readonly ready: boolean;
  readonly simulationTime: number;
  readonly fps: PerformanceSnapshot;
  readonly quality: QualityState;
  readonly renderer: {
    readonly calls: number;
    readonly triangles: number;
    readonly pixelRatio: number;
  };
  readonly player: {
    readonly position: number[];
    readonly speed: number;
    readonly inWater: boolean;
  };
  readonly cape: {
    readonly maximumStructuralError: number;
    readonly hemCenter: number[];
  };
  readonly water: {
    readonly puddles: number;
    readonly drops: number;
    readonly activeRipples: number;
    readonly activeSplashes: number;
    readonly rippleEmissions: number;
    readonly footstepRipples: number;
    readonly dripRipples: number;
  };
  readonly minerals: {
    readonly clusters: number[][];
  };
}

declare global {
  interface Window {
    __CAPE_DEMO__?: {
      ready: boolean;
      getDiagnostics: () => CapeDemoDiagnostics;
      setView: (view: { yaw: number; pitch: number; distance: number }) => CapeDemoDiagnostics;
      setCameraPose: (pose: { position: number[]; target: number[] }) => CapeDemoDiagnostics;
      setMovement: (horizontal: number, forward: number) => void;
      advance: (options: { duration: number; frameStep?: number }) => CapeDemoDiagnostics;
    };
  }
}

export {};
