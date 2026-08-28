import type { PerformanceSnapshot } from '../core/PerformanceMonitor';
import type { QualityState } from '../core/AdaptiveQuality';
import type { DepthOcclusionProbeResult } from '../testing/DepthOcclusionProbe';
import type { ShadowLayerProbeResult } from '../testing/ShadowLayerProbe';

interface CapeDemoDiagnostics {
  readonly ready: boolean;
  readonly simulationTime: number;
  readonly fps: PerformanceSnapshot;
  readonly quality: QualityState;
  readonly renderer: {
    readonly preference: 'webgpu' | 'webgl';
    readonly actual: 'webgpu' | 'webgl';
    readonly backend: string;
    readonly vendor: string;
    readonly device: string;
    readonly fallback: boolean;
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
    readonly depthComposite: {
      readonly layerDepthTexture: boolean;
      readonly worldDepthConnected: boolean;
      readonly renderMode: 'direct-opaque' | 'isolated-fade';
    };
  };
  readonly player: {
    readonly position: number[];
    readonly yaw: number;
    readonly speed: number;
    readonly verticalSpeed: number;
    readonly grounded: boolean;
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
    readonly aspect: number;
    readonly viewportAspect: number;
    readonly initialProjectionAspect: number;
    readonly initialViewportAspect: number;
    readonly distance: number;
    readonly pitch: number;
    readonly position: number[];
    readonly groundClearance: number;
  };
  readonly cave: {
    readonly contactRocks: readonly {
      readonly size: 'large' | 'small';
      readonly walkable: boolean;
      readonly position: readonly [number, number, number];
      readonly lateralOffset: number;
      readonly scale: readonly [number, number, number];
      readonly openLaneWidth: number;
    }[];
  };
  readonly cape: {
    readonly maximumStructuralError: number;
    readonly maximumBodyPenetration: number;
    readonly bodyPenetrationByKind: {
      readonly point: number;
      readonly face: number;
      readonly maximum: number;
    };
    readonly bodyPenetrationByCollider: Readonly<Record<string, number>>;
    readonly maximumEnvironmentPenetration: number;
    readonly environmentPenetrationByKind: {
      readonly sphere: number;
      readonly rock: number;
      readonly floor: number;
      readonly wall: number;
      readonly sphereFace: number;
      readonly rockFace: number;
      readonly caveFace: number;
      readonly maximum: number;
      readonly floorParticleIndex: number | null;
      readonly floorPosition: readonly [number, number, number] | null;
      readonly floorHeight: number | null;
      readonly rockFaceDetail: {
        readonly triangle: readonly [number, number, number] | null;
        readonly positions: readonly [number, number, number][] | null;
        readonly previous: readonly [number, number, number][] | null;
        readonly rockCenter: readonly [number, number, number] | null;
      };
    };
    readonly maximumEnvironmentFacePenetration: number;
    readonly maximumParticleMotion: number;
    readonly maximumParticleVerticalMotion: number;
    readonly sleeping: boolean;
    readonly minimumSelfSeparation: number;
    readonly maximumUpwardFold: number;
    readonly hemDrop: number;
    readonly minimumLowerCapeDrop: number;
    readonly maximumLowerCapeLateralOffset: number;
    readonly hemBackOffset: number;
    readonly minimumHemGroundClearance: number;
    readonly minimumActiveRockSurfaceDistance: number | null;
    readonly closestActiveRockCenter: readonly [number, number, number] | null;
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
      readonly landingRipples: number;
      readonly basinCenters: readonly (readonly [number, number, number])[];
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
    readonly shadow: {
      readonly activeTorch: number;
      readonly enabled: boolean;
      readonly intensity: number;
      readonly position: readonly [number, number, number];
      readonly target: readonly [number, number, number];
      readonly mapSize: readonly [number, number];
    };
  };
}

declare global {
  interface Window {
    __CAPE_DEMO__?: {
      ready: boolean;
      getDiagnostics: () => Promise<CapeDemoDiagnostics>;
      setView: (view: { yaw: number; pitch: number; distance: number }) => Promise<CapeDemoDiagnostics>;
      setCameraPose: (pose: { position: number[]; target: number[] }) => Promise<CapeDemoDiagnostics>;
      setPlayerPose: (pose: { position: number[]; yaw?: number }) => Promise<CapeDemoDiagnostics>;
      setMovement: (horizontal: number, forward: number) => void;
      clearMovement: () => void;
      setRunning: (running: boolean) => void;
      jump: () => void;
      advance: (options: { duration: number; frameStep?: number }) => Promise<CapeDemoDiagnostics>;
      profile: (options: {
        duration: number;
        frameStep?: number;
        synchronizationInterval?: number;
      }) => Promise<{
        readonly frames: number;
        readonly synchronizationInterval: number;
        readonly averageFrameMilliseconds: number;
        readonly p95FrameMilliseconds: number;
        readonly maximumFrameMilliseconds: number;
        readonly averagePhysicsMilliseconds: number;
        readonly averageSceneMilliseconds: number;
        readonly averageSubmissionMilliseconds: number;
        readonly p95SubmissionMilliseconds: number;
        readonly maximumSubmissionMilliseconds: number;
        readonly averageGpuRenderMilliseconds: number | null;
        readonly p95GpuRenderMilliseconds: number | null;
        readonly averageGpuComputeMilliseconds: number | null;
        readonly p95GpuComputeMilliseconds: number | null;
        readonly averageGpuTotalMilliseconds: number | null;
        readonly p95GpuTotalMilliseconds: number | null;
        readonly gpuTimestampSamples: number;
        readonly programsBefore: number;
        readonly programsAfter: number;
        readonly diagnostics: CapeDemoDiagnostics;
      }>;
      runDepthOcclusionProbe: () => Promise<DepthOcclusionProbeResult>;
      runShadowLayerProbe: () => Promise<ShadowLayerProbeResult>;
    };
  }
}

export {};
