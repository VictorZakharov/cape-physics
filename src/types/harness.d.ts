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
    readonly programs: number;
    readonly sizing: {
      readonly width: number;
      readonly height: number;
      readonly pixelRatio: number;
      readonly drawingBufferWidth: number;
      readonly drawingBufferHeight: number;
      readonly renderPixels: number;
      readonly targetResizeCount: number;
    };
  };
  readonly player: {
    readonly position: number[];
    readonly speed: number;
    readonly inWater: boolean;
    readonly groundClearance: number;
    readonly opacity: number;
    readonly running: boolean;
    readonly gait: {
      readonly bob: number;
      readonly runningBlend: number;
    };
    readonly capeAttachment: {
      readonly meshes: number;
      readonly maximumAnchorGap: number;
    };
  };
  readonly camera: {
    readonly distance: number;
    readonly pitch: number;
    readonly position: number[];
    readonly groundClearance: number;
  };
  readonly cape: {
    readonly maximumStructuralError: number;
    readonly maximumBodyPenetration: number;
    readonly maximumEnvironmentPenetration: number;
    readonly maximumEnvironmentFacePenetration: number;
    readonly maximumParticleMotion: number;
    readonly sleeping: boolean;
    readonly minimumSelfSeparation: number;
    readonly hemDrop: number;
    readonly minimumLowerCapeDrop: number;
    readonly hemCenter: number[];
    readonly worldColliders: number;
    readonly worldContacts: {
      readonly lastStep: number;
      readonly total: number;
    };
  };
  readonly water: {
    readonly puddles: number;
    readonly drops: number;
    readonly activeRipples: number;
    readonly activeSplashes: number;
    readonly rippleEmissions: number;
    readonly footstepRipples: number;
    readonly dripRipples: number;
    readonly surfaceAlphaRange: readonly [number, number];
    readonly minimumInteriorDepth: number;
    readonly minimumRimClearance: number;
  };
  readonly minerals: {
    readonly clusters: number[][];
    readonly lights: {
      readonly lights: number;
      readonly visibleLights: number;
      readonly activeLights: number;
    };
  };
  readonly torches: {
    readonly lights: {
      readonly lights: number;
      readonly visibleLights: number;
      readonly activeLights: number;
    };
  };
}

declare global {
  interface Window {
    __CAPE_DEMO__?: {
      ready: boolean;
      getDiagnostics: () => CapeDemoDiagnostics;
      setView: (view: { yaw: number; pitch: number; distance: number }) => CapeDemoDiagnostics;
      setCameraPose: (pose: { position: number[]; target: number[] }) => CapeDemoDiagnostics;
      setPlayerPose: (pose: { position: number[]; yaw?: number }) => CapeDemoDiagnostics;
      setMovement: (horizontal: number, forward: number) => void;
      setRunning: (running: boolean) => void;
      advance: (options: { duration: number; frameStep?: number }) => CapeDemoDiagnostics;
      profile: (options: { duration: number; frameStep?: number }) => {
        readonly frames: number;
        readonly averageFrameMilliseconds: number;
        readonly p95FrameMilliseconds: number;
        readonly maximumFrameMilliseconds: number;
        readonly programsBefore: number;
        readonly programsAfter: number;
        readonly diagnostics: CapeDemoDiagnostics;
      };
    };
  }
}

export {};
