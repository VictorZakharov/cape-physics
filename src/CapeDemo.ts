import * as THREE from 'three';
import { CAMERA_NEAR_OPACITY, PHYSICS_STEP, PLAYER } from './config';
import { ThirdPersonCamera } from './camera/ThirdPersonCamera';
import {
  calculateViewportAspect,
  synchronizePerspectiveCameraAspect,
} from './camera/viewportProjection';
import { AdaptiveQuality, type QualityState } from './core/AdaptiveQuality';
import { enableCameraIndependentShadowCaster } from './core/CameraIndependentShadowCaster';
import { FixedStepClock } from './core/FixedStepClock';
import { PerformanceMonitor } from './core/PerformanceMonitor';
import type { PerformanceReportDetails } from './core/PerformanceReport';
import { RenderPipeline } from './core/RenderPipeline';
import {
  browserSupportsWebGPU,
  RENDERER_STORAGE_KEY,
  rendererPreferenceUrl,
  resolveRendererPreference,
  type RendererPreference,
} from './core/RendererPreference';
import { CHARACTER_RENDER_LAYER } from './core/renderLayers';
import { configureTextureFiltering, createRockTextures } from './graphics/proceduralTextures';
import { InputController } from './input/InputController';
import { MobileControls } from './input/MobileControls';
import { CinematicLighting } from './lighting/CinematicLighting';
import type { WebGpuCinematicLighting } from './lighting/WebGpuCinematicLighting';
import { CapeSimulation } from './physics/CapeSimulation';
import type { GpuCapeSimulation } from './physics/GpuCapeSimulation';
import type { WorldCollider } from './physics/colliders';
import { Character } from './player/Character';
import { CharacterController } from './player/CharacterController';
import { runDepthOcclusionProbe } from './testing/DepthOcclusionProbe';
import { runShadowLayerProbe } from './testing/ShadowLayerProbe';
import { LoadingScreen } from './ui/LoadingScreen';
import {
  CustomizationPanel,
  type CustomizationSettings,
} from './ui/CustomizationPanel';
import { RendererSwitch } from './ui/RendererSwitch';
import { invariant } from './utils/assert';
import { percentile } from './utils/math';
import { CaveAtmosphere } from './world/CaveAtmosphere';
import type { WebGpuCaveAtmosphere } from './world/WebGpuCaveAtmosphere';
import { CaveWorld } from './world/CaveWorld';
import { caveCenterX, caveGroundHeightAt } from './world/caveProfile';
import { MineralVeins } from './world/MineralVeins';
import { TorchSystem } from './world/TorchSystem';
import type { WebGpuTorchSystem } from './world/WebGpuTorchSystem';
import { WaterSystem } from './world/WaterSystem';
import type { WebGpuWaterSystem } from './world/WebGpuWaterSystem';
import { WorldCollisionResolver } from './world/WorldCollisionResolver';

function averageOrNull(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentileOrNull(values: readonly number[], ratio: number): number | null {
  return values.length > 0 ? percentile(values, ratio) : null;
}

export class CapeDemo {
  private readonly canvas: HTMLCanvasElement;
  private readonly scene = new THREE.Scene();
  private readonly initialViewportAspect = calculateViewportAspect(
    window.innerWidth,
    window.innerHeight,
  );
  private readonly camera = new THREE.PerspectiveCamera(
    52,
    this.initialViewportAspect,
    0.08,
    120,
  );
  private readonly initialProjectionAspect = this.camera.aspect;
  private readonly loading = new LoadingScreen();
  private readonly pipeline: RenderPipeline;
  private readonly rendererPreference: RendererPreference;
  private readonly rendererSwitch: RendererSwitch;
  private readonly customizationPanel: CustomizationPanel;
  private readonly webGPUAvailable: boolean;
  private readonly performance: PerformanceMonitor;
  private readonly clock = new FixedStepClock();
  private readonly quality: AdaptiveQuality;
  private readonly qualityLabel: HTMLElement;
  private readonly urlParameters = new URLSearchParams(window.location.search);
  private readonly harnessMode = this.urlParameters.get('harness') === '1';
  private readonly gpuTimestampProfile = this.urlParameters.get('gpuTimestamps') === '1';
  private input!: InputController;
  private mobileControls!: MobileControls;
  private character!: Character;
  private characterController!: CharacterController;
  private thirdPersonCamera!: ThirdPersonCamera;
  private cape!: CapeSimulation | GpuCapeSimulation;
  private cave!: CaveWorld;
  private water!: WaterSystem | WebGpuWaterSystem;
  private torches!: TorchSystem | WebGpuTorchSystem;
  private veins!: MineralVeins;
  private atmosphere!: CaveAtmosphere | WebGpuCaveAtmosphere;
  private lighting!: CinematicLighting | WebGpuCinematicLighting;
  private worldCollision!: WorldCollisionResolver;
  private worldColliders: readonly WorldCollider[] = [];
  private fixedTime = 0;
  private harnessAccumulator = 0;
  private ready = false;
  private webGpuRecoveryStarted = false;
  private webGpuStartupTimer: number | null = null;
  private stopDeviceLossWatch: (() => void) | null = null;
  private customizationSettings: CustomizationSettings;
  private readonly savedLightIntensities = new Map<THREE.Light, number>();

  public constructor() {
    this.canvas = invariant(document.querySelector<HTMLCanvasElement>('#scene-canvas'), 'Scene canvas is missing.');
    this.scene.background = new THREE.Color(0x050a0c);
    this.scene.fog = new THREE.FogExp2(0x071012, 0.034);
    this.webGPUAvailable = browserSupportsWebGPU();
    let storedRendererPreference: string | null = null;
    try {
      storedRendererPreference = window.localStorage.getItem(RENDERER_STORAGE_KEY);
    } catch {
      // Storage can be disabled without preventing the demo from rendering.
    }
    this.rendererPreference = resolveRendererPreference({
      search: window.location.search,
      storedPreference: storedRendererPreference,
      webGPUAvailable: this.webGPUAvailable,
    });
    this.pipeline = new RenderPipeline(
      this.canvas,
      this.scene,
      this.camera,
      this.rendererPreference,
      this.gpuTimestampProfile,
    );
    this.rendererSwitch = new RendererSwitch(
      this.rendererPreference,
      this.webGPUAvailable,
    );
    this.customizationPanel = new CustomizationPanel(this.handleCustomizationChange);
    this.customizationSettings = this.customizationPanel.getSettings();
    this.qualityLabel = invariant(document.querySelector<HTMLElement>('[data-quality-label]'), 'Quality label is missing.');
    this.quality = new AdaptiveQuality((state) => this.applyQuality(state));
    this.performance = new PerformanceMonitor(this.getPerformanceReportDetails);
    document.body.classList.toggle('is-harness', this.harnessMode);
  }

  public async start(): Promise<void> {
    if (this.rendererPreference === 'webgpu' && !this.harnessMode) {
      this.webGpuStartupTimer = window.setTimeout(() => {
        this.recoverWithWebGL('WebGPU startup stalled; restarting with WebGL');
      }, 20_000);
    }
    await this.loading.update(0.03, 'Selecting the graphics backend');
    try {
      await this.pipeline.init();
    } catch (error) {
      if (this.rendererPreference !== 'webgpu') throw error;
      this.recoverWithWebGL('WebGPU unavailable; restarting with WebGL');
      return;
    }
    if (this.pipeline.getActualBackend() === 'webgpu') {
      this.stopDeviceLossWatch = this.pipeline.onDeviceLost((info) => {
        const detail = info.message || info.reason || 'unknown device error';
        console.warn(`WebGPU device lost: ${detail}`);
        this.recoverWithWebGL('WebGPU stopped responding; restarting with WebGL');
      });
    } else {
      this.clearWebGpuStartupTimer();
    }
    this.rendererSwitch.setActive(
      this.pipeline.getActualBackend(),
      this.rendererPreference,
    );
    await this.loading.update(0.08, 'Shaping ancient stone');
    const rockTextures = createRockTextures(512);
    configureTextureFiltering(
      rockTextures,
      Math.min(8, this.pipeline.getMaxAnisotropy()),
    );
    this.cave = new CaveWorld(rockTextures);
    this.scene.add(this.cave.group);

    await this.loading.update(0.3, 'Awakening mineral light');
    this.veins = new MineralVeins();
    const usesNodeRenderer = this.pipeline.usesNodeRenderer();
    if (usesNodeRenderer) {
      const [
        { WebGpuTorchSystem },
        { WebGpuWaterSystem },
        { WebGpuCaveAtmosphere },
      ] = await Promise.all([
        import('./world/WebGpuTorchSystem'),
        import('./world/WebGpuWaterSystem'),
        import('./world/WebGpuCaveAtmosphere'),
      ]);
      this.torches = new WebGpuTorchSystem();
      this.water = new WebGpuWaterSystem();
      this.atmosphere = new WebGpuCaveAtmosphere();
    } else {
      this.torches = new TorchSystem();
      this.water = new WaterSystem();
      this.atmosphere = new CaveAtmosphere();
    }
    this.scene.add(this.veins.group, this.torches.group, this.water.group, this.atmosphere.points);
    this.worldColliders = [
      ...this.cave.worldColliders,
      ...this.torches.worldColliders,
      ...this.veins.worldColliders,
    ];
    this.worldCollision = new WorldCollisionResolver(this.worldColliders);

    await this.loading.update(0.54, 'Forging the traveller');
    this.character = new Character();
    const startZ = 11.8;
    const startX = caveCenterX(startZ);
    this.character.root.position.set(startX, this.worldCollision.getPlayerRootHeight(startX, startZ), startZ);
    this.character.root.updateMatrixWorld(true);
    this.scene.add(this.character.root);
    const gpuRenderer = this.pipeline.getWebGpuRenderer();
    if (gpuRenderer) {
      const { GpuCapeSimulation } = await import('./physics/GpuCapeSimulation');
      this.cape = new GpuCapeSimulation(
        gpuRenderer,
        this.character.getCapeAnchors(),
        this.customizationSettings,
      );
    } else {
      this.cape = new CapeSimulation(
        this.character.getCapeAnchors(),
        this.customizationSettings,
      );
    }
    this.scene.add(this.cape.mesh);
    this.character.root.traverse((object) => {
      object.layers.set(CHARACTER_RENDER_LAYER);
      if (object instanceof THREE.Mesh && object.castShadow) {
        enableCameraIndependentShadowCaster(
          object,
          usesNodeRenderer ? 'webgpu' : 'webgl',
        );
      }
    });
    this.cape.mesh.layers.set(CHARACTER_RENDER_LAYER);
    enableCameraIndependentShadowCaster(
      this.cape.mesh,
      usesNodeRenderer ? 'webgpu' : 'webgl',
    );

    this.input = new InputController(this.canvas, this.dismissOnboarding);
    this.mobileControls = new MobileControls(this.canvas, this.input);
    this.characterController = new CharacterController(this.character, this.input, this.worldCollision);
    this.thirdPersonCamera = new ThirdPersonCamera(this.camera, this.input, this.cave.cameraColliders);
    this.thirdPersonCamera.snapTo(this.character.root.position);
    if (usesNodeRenderer) {
      const { WebGpuCinematicLighting } = await import('./lighting/WebGpuCinematicLighting');
      const nodeRenderer = invariant(
        this.pipeline.getNodeRenderer(),
        'WebGPU node renderer is missing.',
      );
      this.lighting = new WebGpuCinematicLighting(this.scene, nodeRenderer);
    } else {
      const webGlRenderer = invariant(
        this.pipeline.getWebGlRenderer(),
        'Native WebGL renderer is missing.',
      );
      this.lighting = new CinematicLighting(this.scene, webGlRenderer);
    }
    this.scene.add(this.lighting.group);
    this.enableCharacterLighting();
    this.lighting.update(this.character.root.position, 0);
    this.torches.update(0, this.character.root.position);
    this.veins.update(0, this.character.root.position);
    this.cape.syncGeometry();
    this.applySceneCustomization(this.customizationSettings);

    await this.loading.update(0.76, 'Compiling cloth and water shaders');
    await this.pipeline.compile(this.scene, this.camera);
    this.pipeline.renderManual(0);
    await this.loading.update(0.94, 'Warming the torchlight');
    this.pipeline.renderManual(0);

    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.dispose, { once: true });
    window.setTimeout(this.dismissOnboarding, 7_500);
    this.installHarness();
    await this.loading.reveal();
    this.ready = true;
    this.clearWebGpuStartupTimer();
    if (window.__CAPE_DEMO__) window.__CAPE_DEMO__.ready = true;
    if (this.harnessMode) {
      this.updateScene(0);
      this.pipeline.renderManual(0);
    } else {
      void this.pipeline.renderer.setAnimationLoop(this.frame);
    }
  }

  private readonly frame = (timestamp: number): void => {
    this.performance.recordFrame(timestamp);
    const physicsStart = performance.now();
    const timing = this.clock.advance(timestamp, this.simulateStep);
    if (timing.physicsSteps > 0) this.cape.syncGeometry();
    const sceneStart = performance.now();
    this.updateScene(timing.delta);
    this.quality.observe(this.fixedTime, this.performance.getSnapshot());
    const renderStart = performance.now();
    this.pipeline.render(timing.delta);
    const frameEnd = performance.now();
    this.performance.recordWorkload(timestamp, {
      physicsMilliseconds: sceneStart - physicsStart,
      sceneMilliseconds: renderStart - sceneStart,
      renderMilliseconds: frameEnd - renderStart,
      physicsSteps: timing.physicsSteps,
    });
  };

  private readonly simulateStep = (step: number): void => {
    this.fixedTime += step;
    this.characterController.update(step, this.thirdPersonCamera.yaw);
    const landingImpact = this.characterController.consumeLandingImpact();
    if (landingImpact > 0) {
      this.water.addLandingRipple(this.character.root.position, this.fixedTime, landingImpact);
    }
    const anchors = this.character.getCapeAnchors();
    this.cape.step(
      step,
      anchors,
      this.character.getCapeColliders(),
      this.worldColliders,
      this.character.velocity,
      this.fixedTime,
    );
  };

  private updateScene(delta: number): void {
    const playerPosition = this.character.root.position;
    const planarSpeed = Math.hypot(this.character.velocity.x, this.character.velocity.z);
    this.thirdPersonCamera.update(delta, playerPosition);
    this.updateCameraFade();
    this.water.update(
      delta,
      this.fixedTime,
      playerPosition,
      this.character.root.rotation.y,
      this.characterController.isGrounded() ? planarSpeed : 0,
    );
    this.torches.update(this.fixedTime, playerPosition);
    this.veins.update(this.fixedTime, playerPosition);
    this.atmosphere.update(this.fixedTime);
    this.lighting.update(playerPosition, this.fixedTime);
    if (!this.customizationSettings.lights) this.setLightsEnabled(false);
  }

  private readonly handleResize = (): void => {
    synchronizePerspectiveCameraAspect(this.camera, window.innerWidth, window.innerHeight);
    this.pipeline.resize();
    this.atmosphere.resize();
  };

  private readonly handleVisibilityChange = (): void => {
    if (!document.hidden) {
      const timestamp = performance.now();
      this.clock.reset(timestamp);
      this.performance.resume(timestamp);
    }
  };

  private readonly dismissOnboarding = (): void => {
    document.querySelector<HTMLElement>('[data-onboarding]')?.classList.add('is-dismissed');
  };

  private clearWebGpuStartupTimer(): void {
    if (this.webGpuStartupTimer === null) return;
    window.clearTimeout(this.webGpuStartupTimer);
    this.webGpuStartupTimer = null;
  }

  private recoverWithWebGL(message: string): void {
    if (this.webGpuRecoveryStarted) return;
    this.webGpuRecoveryStarted = true;
    this.ready = false;
    if (window.__CAPE_DEMO__) window.__CAPE_DEMO__.ready = false;
    this.clearWebGpuStartupTimer();
    this.stopDeviceLossWatch?.();
    this.stopDeviceLossWatch = null;
    document.body.classList.remove('is-ready');
    void this.loading.update(0.04, message);
    window.location.replace(rendererPreferenceUrl(window.location.href, 'webgl'));
  }

  private applyQuality(state: QualityState): void {
    this.pipeline.setResolutionScale(state.scale);
    this.qualityLabel.textContent = state.label;
  }

  private readonly handleCustomizationChange = (settings: CustomizationSettings): void => {
    this.customizationSettings = settings;
    if (!this.cape || !this.character) return;
    this.cape.updateSettings(settings, this.character.getCapeAnchors());
    this.applySceneCustomization(settings);
    if (this.ready) this.pipeline.renderManual(0);
  };

  private applySceneCustomization(settings: CustomizationSettings): void {
    this.setLightsEnabled(settings.lights);
    this.pipeline.renderer.shadowMap.enabled = settings.shadows;
    this.scene.environmentIntensity = settings.reflections ? 0.24 : 0;
    this.water.setReflectionsEnabled(settings.reflections);
  }

  private setLightsEnabled(enabled: boolean): void {
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Light)) return;
      if (enabled) {
        const savedIntensity = this.savedLightIntensities.get(object);
        if (savedIntensity !== undefined) object.intensity = savedIntensity;
        return;
      }
      if (!this.savedLightIntensities.has(object)) {
        this.savedLightIntensities.set(object, object.intensity);
      }
      object.intensity = 0;
    });
    if (enabled) this.savedLightIntensities.clear();
  }

  private installHarness(): void {
    window.__CAPE_DEMO__ = {
      ready: false,
      getDiagnostics: () => this.getDiagnosticsAfterReadback(),
      setView: async ({ yaw, pitch, distance }) => {
        this.thirdPersonCamera.setOrbit(yaw, pitch, distance, this.character.root.position);
        this.updateScene(0);
        this.pipeline.renderManual(0);
        return this.getDiagnosticsAfterReadback();
      },
      setCameraPose: async ({ position, target }) => {
        this.thirdPersonCamera.setPose(
          new THREE.Vector3().fromArray(position),
          new THREE.Vector3().fromArray(target),
        );
        this.updateCameraFade();
        this.pipeline.renderManual(0);
        return this.getDiagnosticsAfterReadback();
      },
      setPlayerPose: async ({ position, yaw = this.character.root.rotation.y }) => {
        this.character.root.position.fromArray(position);
        this.worldCollision.resolvePlayer(this.character.root.position);
        this.character.root.rotation.y = yaw;
        this.character.velocity.set(0, 0, 0);
        this.characterController.resetVerticalState();
        this.character.root.updateMatrixWorld(true);
        this.cape.reset(this.character.getCapeAnchors());
        this.cape.syncGeometry();
        this.thirdPersonCamera.snapTo(this.character.root.position);
        this.updateCameraFade();
        this.pipeline.renderManual(0);
        return this.getDiagnosticsAfterReadback();
      },
      setMovement: (horizontal, forward) => {
        this.input.setVirtualMovement(horizontal, forward);
      },
      clearMovement: () => {
        this.input.clearVirtualMovement();
      },
      setRunning: (running) => {
        this.input.setVirtualRunning(running);
      },
      jump: () => {
        this.input.queueVirtualJump();
      },
      advance: ({ duration, frameStep = 1 / 60 }) => this.advanceHarness(duration, frameStep),
      profile: ({ duration, frameStep = 1 / 60, synchronizationInterval = 1 }) => (
        this.profileHarness(duration, frameStep, synchronizationInterval)
      ),
      runDepthOcclusionProbe: () => runDepthOcclusionProbe(
        this.scene,
        this.camera,
        this.pipeline,
      ),
      runShadowLayerProbe: () => runShadowLayerProbe(this.pipeline.renderer),
    };
  }

  private async advanceHarness(
    duration: number,
    requestedFrameStep: number,
  ): Promise<ReturnType<CapeDemo['getDiagnostics']>> {
    const frameStep = THREE.MathUtils.clamp(requestedFrameStep, 1 / 144, 1 / 30);
    let remaining = THREE.MathUtils.clamp(duration, 0, 30);
    let lastDelta = 0;
    while (remaining > 0.000_001) {
      const delta = Math.min(frameStep, remaining);
      lastDelta = delta;
      remaining -= delta;
      this.advanceHarnessFrame(delta);
    }
    this.pipeline.renderManual(lastDelta);
    return this.getDiagnosticsAfterReadback();
  }

  private async profileHarness(
    duration: number,
    requestedFrameStep: number,
    requestedSynchronizationInterval: number,
  ) {
    const frameStep = THREE.MathUtils.clamp(requestedFrameStep, 1 / 144, 1 / 30);
    let remaining = THREE.MathUtils.clamp(duration, 0, 12);
    const synchronizationInterval = THREE.MathUtils.clamp(
      Math.round(requestedSynchronizationInterval),
      1,
      120,
    );
    const amortizedBatchFrameDurations: number[] = [];
    const physicsDurations: number[] = [];
    const sceneDurations: number[] = [];
    const submissionDurations: number[] = [];
    const gpuRenderDurations: number[] = [];
    const gpuComputeDurations: number[] = [];
    const gpuTotalDurations: number[] = [];
    const programsBefore = this.pipeline.getProgramCount();
    const profileStart = performance.now();
    let batchStart = profileStart;
    let batchFrames = 0;
    let frames = 0;

    while (remaining > 0.000_001) {
      const delta = Math.min(frameStep, remaining);
      remaining -= delta;
      const framePhases = this.advanceHarnessFrame(delta);
      physicsDurations.push(framePhases.physicsMilliseconds);
      sceneDurations.push(framePhases.sceneMilliseconds);
      const renderStart = performance.now();
      this.pipeline.renderManual(delta);
      submissionDurations.push(performance.now() - renderStart);
      frames += 1;
      batchFrames += 1;

      if (batchFrames >= synchronizationInterval || remaining <= 0.000_001) {
        const gpuFrameTime = await this.pipeline.resolveGpuFrameTimeForLocalProfile();
        if (gpuFrameTime === null) {
          await this.pipeline.synchronizeForLocalProfile();
        } else {
          gpuRenderDurations.push(gpuFrameTime.renderMilliseconds);
          gpuComputeDurations.push(gpuFrameTime.computeMilliseconds);
          gpuTotalDurations.push(gpuFrameTime.totalMilliseconds);
        }
        const batchEnd = performance.now();
        amortizedBatchFrameDurations.push((batchEnd - batchStart) / batchFrames);
        batchStart = batchEnd;
        batchFrames = 0;
      }
    }

    const totalMilliseconds = performance.now() - profileStart;
    const physicsTotal = physicsDurations.reduce((sum, value) => sum + value, 0);
    const sceneTotal = sceneDurations.reduce((sum, value) => sum + value, 0);
    const submissionTotal = submissionDurations.reduce((sum, value) => sum + value, 0);
    return {
      frames,
      synchronizationInterval,
      averageFrameMilliseconds: frames > 0 ? totalMilliseconds / frames : 0,
      p95FrameMilliseconds: percentile(amortizedBatchFrameDurations, 0.95),
      maximumFrameMilliseconds: Math.max(0, ...amortizedBatchFrameDurations),
      averagePhysicsMilliseconds: frames > 0 ? physicsTotal / frames : 0,
      averageSceneMilliseconds: frames > 0 ? sceneTotal / frames : 0,
      averageSubmissionMilliseconds: frames > 0 ? submissionTotal / frames : 0,
      p95SubmissionMilliseconds: percentile(submissionDurations, 0.95),
      maximumSubmissionMilliseconds: Math.max(0, ...submissionDurations),
      averageGpuRenderMilliseconds: averageOrNull(gpuRenderDurations),
      p95GpuRenderMilliseconds: percentileOrNull(gpuRenderDurations, 0.95),
      averageGpuComputeMilliseconds: averageOrNull(gpuComputeDurations),
      p95GpuComputeMilliseconds: percentileOrNull(gpuComputeDurations, 0.95),
      averageGpuTotalMilliseconds: averageOrNull(gpuTotalDurations),
      p95GpuTotalMilliseconds: percentileOrNull(gpuTotalDurations, 0.95),
      gpuTimestampSamples: gpuTotalDurations.length,
      programsBefore,
      programsAfter: this.pipeline.getProgramCount(),
      diagnostics: await this.getDiagnosticsAfterReadback(),
    };
  }

  private async getDiagnosticsAfterReadback(): Promise<ReturnType<CapeDemo['getDiagnostics']>> {
    await this.cape.refreshDiagnostics();
    return this.getDiagnostics();
  }

  private advanceHarnessFrame(delta: number): {
    readonly physicsMilliseconds: number;
    readonly sceneMilliseconds: number;
  } {
    const physicsStart = performance.now();
    this.harnessAccumulator += delta;
    let simulated = false;
    while (this.harnessAccumulator + 0.000_000_1 >= PHYSICS_STEP) {
      this.simulateStep(PHYSICS_STEP);
      this.harnessAccumulator -= PHYSICS_STEP;
      simulated = true;
    }
    if (simulated) this.cape.syncGeometry();
    const sceneStart = performance.now();
    this.updateScene(delta);
    return {
      physicsMilliseconds: sceneStart - physicsStart,
      sceneMilliseconds: performance.now() - sceneStart,
    };
  }

  private getDiagnostics() {
    const capeAnchors = this.character.getCapeAnchors();
    const capeColliders = this.character.getCapeColliders();
    const closestRockSurfaceContact = this.cape.getClosestActiveRockSurfaceContact(
      this.worldColliders,
    );
    const bodyPenetrationByCollider = Object.fromEntries(
      capeColliders.map((collider) => [
        collider.name,
        this.cape.getMaximumBodyPenetration([collider], capeAnchors.back),
      ]),
    );
    const frameRenderStats = this.pipeline.getLastFrameRenderStats();
    return {
      ready: this.ready,
      simulationTime: this.fixedTime,
      fps: this.performance.getSnapshot(),
      quality: this.quality.getState(),
      workload: this.performance.getWorkloadSnapshot(),
      renderer: {
        ...this.pipeline.getBackendDiagnostics(),
        calls: frameRenderStats.calls,
        triangles: frameRenderStats.triangles,
        pixelRatio: this.pipeline.renderer.getPixelRatio(),
        programs: this.pipeline.getProgramCount(),
        sizing: this.pipeline.getSizingDiagnostics(),
        depthComposite: this.pipeline.getDepthCompositeDiagnostics(),
      },
      player: {
        position: this.character.root.position.toArray(),
        yaw: this.character.root.rotation.y,
        speed: Math.hypot(this.character.velocity.x, this.character.velocity.z),
        verticalSpeed: this.character.velocity.y,
        grounded: this.characterController.isGrounded(),
        inWater: this.water.isInWater(this.character.root.position),
        groundClearance: this.character.root.position.y - PLAYER.footOffset - this.worldCollision.getGroundHeight(
          this.character.root.position.x,
          this.character.root.position.z,
        ),
        opacity: this.character.getOpacity(),
        running: this.characterController.isRunning(),
        gait: this.character.getAnimationDiagnostics(),
        capeAttachment: this.character.getCapeAttachmentDiagnostics(),
      },
      camera: {
        aspect: this.camera.aspect,
        viewportAspect: calculateViewportAspect(window.innerWidth, window.innerHeight),
        initialProjectionAspect: this.initialProjectionAspect,
        initialViewportAspect: this.initialViewportAspect,
        distance: this.thirdPersonCamera.getActualDistance(),
        pitch: this.thirdPersonCamera.getPitch(),
        position: this.camera.position.toArray(),
        groundClearance: this.camera.position.y - caveGroundHeightAt(
          this.camera.position.x,
          this.camera.position.z,
        ),
      },
      cave: {
        contactRocks: this.cave.contactRocks,
      },
      cape: {
        settings: { ...this.customizationSettings },
        maximumStructuralError: this.cape.getMaximumStructuralError(),
        maximumBodyPenetration: this.cape.getMaximumBodyPenetration(
          capeColliders,
          capeAnchors.back,
        ),
        bodyPenetrationByKind: this.cape.getBodyPenetrationDiagnostics(
          capeColliders,
          capeAnchors.back,
        ),
        bodyPenetrationByCollider,
        maximumEnvironmentPenetration: this.cape.getMaximumEnvironmentPenetration(this.worldColliders),
        environmentPenetrationByKind: this.cape.getEnvironmentPenetrationDiagnostics(
          this.worldColliders,
        ),
        maximumEnvironmentFacePenetration: this.cape.getMaximumEnvironmentFacePenetration(this.worldColliders),
        maximumParticleMotion: this.cape.getMaximumParticleMotion(),
        maximumParticleVerticalMotion: this.cape.getMaximumParticleVerticalMotion(),
        sleeping: this.cape.isSleeping(),
        minimumSelfSeparation: this.cape.getMinimumSelfSeparation(),
        maximumUpwardFold: this.cape.getMaximumUpwardFold(),
        hemDrop: this.cape.getHemDrop(),
        minimumLowerCapeDrop: this.cape.getMinimumLowerCapeDrop(),
        maximumLowerCapeLateralOffset: this.cape.getMaximumLowerCapeLateralOffset(capeAnchors),
        hemBackOffset: this.cape.getHemBackOffset(capeAnchors),
        minimumHemGroundClearance: this.cape.getMinimumHemGroundClearance(),
        minimumActiveRockSurfaceDistance: closestRockSurfaceContact?.distance ?? null,
        closestActiveRockCenter: closestRockSurfaceContact?.center ?? null,
        hemCenter: this.cape.getParticlePosition(6, 17).toArray(),
        worldColliders: this.worldColliders.length,
        worldContacts: this.cape.getWorldContactDiagnostics(),
        performance: this.cape.getPerformanceDiagnostics(),
      },
      water: this.water.getDiagnostics(),
      minerals: {
        clusters: this.veins.getClusterPositions(),
        lights: this.veins.getLightDiagnostics(),
      },
      torches: {
        lights: this.torches.getLightDiagnostics(),
        shadow: this.torches.getShadowDiagnostics(),
      },
    };
  }

  private updateCameraFade(): void {
    const distance = this.thirdPersonCamera.getActualDistance();
    const opacity = CAMERA_NEAR_OPACITY
      + THREE.MathUtils.smoothstep(distance, 0.78, 2.15) * (1 - CAMERA_NEAR_OPACITY);
    this.character.setOpacity(opacity);
    this.cape.setOpacity(opacity);
    this.pipeline.setCharacterOpacity(opacity);
  }

  private readonly getPerformanceReportDetails = (): PerformanceReportDetails => {
    const backend = this.pipeline.getBackendDiagnostics();
    const sizing = this.pipeline.getSizingDiagnostics();
    const frameRenderStats = this.pipeline.getLastFrameRenderStats();
    const screenWithTopology = window.screen as Screen & { readonly isExtended?: boolean };
    const multipleScreens = typeof screenWithTopology.isExtended === 'boolean'
      ? screenWithTopology.isExtended
      : null;

    return {
      renderer: {
        backend: backend.backend,
        vendor: backend.vendor,
        device: backend.device,
        preference: backend.preference,
        actual: backend.actual,
        fallback: backend.fallback,
        drawCalls: frameRenderStats.calls,
        triangles: frameRenderStats.triangles,
        programs: this.pipeline.getProgramCount(),
      },
      canvas: {
        drawingBufferWidth: sizing.drawingBufferWidth,
        drawingBufferHeight: sizing.drawingBufferHeight,
        cssWidth: window.innerWidth,
        cssHeight: window.innerHeight,
      },
      quality: {
        label: this.quality.getState().label,
        scale: this.quality.getState().scale,
        targetResizes: sizing.targetResizeCount,
      },
      workload: this.performance.getWorkloadSnapshot(),
      capeSolver: this.ready ? this.cape.getPerformanceDiagnostics() : null,
      scene: {
        simulationSeconds: this.fixedTime,
        capeSleeping: this.ready ? this.cape.isSleeping() : false,
        worldColliders: this.worldColliders.length,
        activeRipples: this.ready ? this.water.getDiagnostics().activeRipples : 0,
      },
      page: {
        visibility: document.visibilityState,
        focused: document.hasFocus(),
        devicePixelRatio: window.devicePixelRatio,
        multipleScreens,
        url: window.location.href,
      },
      runtime: {
        platform: navigator.platform || 'Unknown platform',
        userAgent: navigator.userAgent || 'Unavailable',
      },
    };
  };

  private enableCharacterLighting(): void {
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Light)) return;
      object.layers.enable(CHARACTER_RENDER_LAYER);
      if (
        object instanceof THREE.DirectionalLight
        || object instanceof THREE.PointLight
        || object instanceof THREE.SpotLight
      ) {
        object.shadow.camera.layers.enable(CHARACTER_RENDER_LAYER);
      }
    });
  }

  private readonly dispose = (): void => {
    this.clearWebGpuStartupTimer();
    this.stopDeviceLossWatch?.();
    this.stopDeviceLossWatch = null;
    void this.pipeline.renderer.setAnimationLoop(null);
    this.rendererSwitch.dispose();
    this.customizationPanel.dispose();
    this.mobileControls?.dispose();
    this.input?.dispose();
    this.lighting?.dispose();
    this.performance.dispose();
    this.pipeline.dispose();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  };
}
