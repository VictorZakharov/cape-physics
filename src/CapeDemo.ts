import * as THREE from 'three';
import { CAMERA_NEAR_OPACITY, CAPE, PHYSICS_STEP, PLAYER } from './config';
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
  rendererDefaultUrl,
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
import {
  BOT_CYAN_CAPE_PALETTE,
  CRIMSON_CAPE_PALETTE,
  type CapeFabricPalette,
} from './physics/CapeAppearance';
import {
  DEFAULT_CAPE_PHYSICS_SETTINGS,
  type CapePhysicsSettings,
} from './physics/CapeSettings';
import type { GpuCapeSimulation } from './physics/GpuCapeSimulation';
import type { WorldCollider } from './physics/colliders';
import { BotMovementInput, normalizeBotCount } from './player/BotMovementInput';
import { Character, type CapeAnchors } from './player/Character';
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

interface ScenePhaseTotals {
  camera: number;
  cameraFade: number;
  water: number;
  torches: number;
  veins: number;
  atmosphere: number;
  lighting: number;
}

type CapeInstance = CapeSimulation | GpuCapeSimulation;

type CapeFactory = (
  anchors: CapeAnchors,
  settings: Partial<CapePhysicsSettings>,
  appearance: CapeFabricPalette,
) => CapeInstance;

interface PerformanceBot {
  readonly character: Character;
  readonly cape: CapeInstance | null;
  readonly input: BotMovementInput;
  readonly controller: CharacterController;
}

type CapeTrajectoryScenario =
  | 'raised-drop'
  | 'falling-forward-start'
  | 'forward-start'
  | 'forward-stop'
  | 'reverse'
  | 'back-and-forth'
  | 'lightweight-stop';

interface CapeTrajectorySample {
  readonly frame: number;
  readonly time: number;
  readonly playerPosition: readonly number[];
  readonly playerYaw: number;
  readonly playerSpeed: number;
  /** Particle triples in neckline-local right/up/back coordinates. */
  readonly particles: readonly number[];
  readonly hemDrop: number;
  readonly hemBackOffset: number;
  readonly maximumParticleMotion: number;
  readonly particleMotion: ReturnType<CapeSimulation['getMaximumParticleMotionDiagnostics']>;
  readonly maximumLowerParticleHeight: number;
  readonly maximumLowerHorizontalOffset: number;
  readonly centerlineDeviation: number;
  readonly rowTwistRange: number;
  readonly maximumNecklineAttachmentError: number;
  readonly maximumBodyPenetration: number;
  readonly bodyPenetrationByKind: ReturnType<CapeSimulation['getBodyPenetrationDiagnostics']>;
  readonly bodyPenetrationByCollider: Readonly<Record<string, number>>;
  readonly maximumStructuralError: number;
  readonly minimumSelfSeparation: number;
  readonly maximumUpwardFold: number;
  readonly lowerCapeSpanRatio: number;
  readonly lowerCapeRowCurlRatio: number;
}

interface CapeTrajectoryReport {
  readonly scenario: CapeTrajectoryScenario;
  readonly renderer: 'webgpu' | 'webgl';
  readonly physicsStep: number;
  readonly samples: readonly CapeTrajectorySample[];
}

function createScenePhaseTotals(): ScenePhaseTotals {
  return {
    camera: 0,
    cameraFade: 0,
    water: 0,
    torches: 0,
    veins: 0,
    atmosphere: 0,
    lighting: 0,
  };
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
  private cape!: CapeInstance;
  private capeFactory!: CapeFactory;
  private readonly performanceBots: PerformanceBot[] = [];
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
  private readonly stabilizationVelocity = new THREE.Vector3();
  private readonly savedLightIntensities = new Map<THREE.Light, number>();
  private readonly savedShadowIntensities = new Map<THREE.Light, number>();
  private shadowsEnabled = true;

  public constructor() {
    this.canvas = invariant(document.querySelector<HTMLCanvasElement>('#scene-canvas'), 'Scene canvas is missing.');
    this.scene.background = new THREE.Color(0x050a0c);
    this.scene.fog = new THREE.FogExp2(0x071012, 0.034);
    this.webGPUAvailable = browserSupportsWebGPU();
    this.rendererPreference = resolveRendererPreference({
      search: window.location.search,
    });
    const defaultUrl = rendererDefaultUrl(window.location.href);
    if (defaultUrl !== window.location.href) {
      window.history.replaceState(window.history.state, '', defaultUrl);
    }
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
    if (this.rendererPreference === 'webgpu') {
      await this.loading.beginLongStage(
        0.03,
        0.075,
        'Requesting the WebGPU adapter and device',
        4_000,
      );
    } else {
      await this.loading.update(0.03, 'Selecting the graphics backend');
    }
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
    await this.loading.beginLongStage(0.08, 0.27, 'Shaping ancient stone', 1_600);
    const rockTextures = createRockTextures(512);
    configureTextureFiltering(
      rockTextures,
      Math.min(8, this.pipeline.getMaxAnisotropy()),
    );
    this.cave = new CaveWorld(rockTextures);
    this.scene.add(this.cave.group);

    await this.loading.beginLongStage(0.3, 0.52, 'Awakening mineral light', 2_000);
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
      await this.loading.update(0.59, 'Loading the WebGPU cloth solver');
      const { GpuCapeSimulation } = await import('./physics/GpuCapeSimulation');
      await this.loading.update(0.62, 'Allocating WebGPU cloth buffers');
      await this.loading.beginLongStage(
        0.64,
        0.72,
        'Linking WebGPU cloth compute passes',
        2_500,
      );
      this.capeFactory = (anchors, settings, appearance) => (
        new GpuCapeSimulation(gpuRenderer, anchors, settings, appearance)
      );
    } else {
      await this.loading.update(0.64, 'Weaving the cloth simulation');
      this.capeFactory = (anchors, settings, appearance) => (
        new CapeSimulation(anchors, settings, appearance)
      );
    }
    this.cape = this.capeFactory(
      this.character.getCapeAnchors(),
      this.customizationSettings,
      CRIMSON_CAPE_PALETTE,
    );
    this.scene.add(this.cape.mesh);
    await this.loading.update(0.73, 'Rigging movement and camera');
    this.configureCharacterRenderObjects(this.character, this.cape);
    if (!(this.cape instanceof CapeSimulation)) {
      this.scene.add(this.cape.botMesh);
      this.cape.botMesh.layers.set(CHARACTER_RENDER_LAYER);
      enableCameraIndependentShadowCaster(this.cape.botMesh, 'webgpu');
    }

    this.input = new InputController(this.canvas, this.dismissOnboarding);
    this.mobileControls = new MobileControls(this.canvas, this.input);
    this.characterController = new CharacterController(this.character, this.input, this.worldCollision);
    this.thirdPersonCamera = new ThirdPersonCamera(this.camera, this.input);
    this.thirdPersonCamera.snapTo(this.character.root.position);
    await this.loading.update(0.78, 'Placing traveller lights');
    if (usesNodeRenderer) {
      const { WebGpuCinematicLighting } = await import('./lighting/WebGpuCinematicLighting');
      await this.loading.update(0.8, 'Creating WebGPU light pipelines');
      const nodeRenderer = invariant(
        this.pipeline.getNodeRenderer(),
        'WebGPU node renderer is missing.',
      );
      this.lighting = new WebGpuCinematicLighting(this.scene, nodeRenderer);
      await this.loading.update(0.82, 'Binding WebGPU shadows and reflections');
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
    await this.loading.update(0.84, 'Settling the first cloth frame');
    this.stabilizeCape();
    this.cape.syncGeometry();
    this.applySceneCustomization(this.customizationSettings);
    this.reconcilePerformanceBots(this.customizationSettings.bots);

    await this.loading.beginLongStage(
      0.88,
      0.95,
      usesNodeRenderer
        ? 'Compiling WebGPU cloth, water, and post-processing shaders'
        : 'Compiling cloth, water, and post-processing shaders',
      usesNodeRenderer ? 22_000 : 4_000,
    );
    await this.pipeline.compile(this.scene, this.camera);
    await this.loading.update(0.96, 'Submitting the first rendered frame');
    this.pipeline.renderManual(0);
    await this.loading.update(0.98, 'Validating torchlight and reflections');
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
    if (timing.physicsSteps > 0) this.syncCapeGeometries();
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
    for (const bot of this.performanceBots) {
      bot.input.update(this.fixedTime);
      bot.controller.update(step, 0);
    }

    if (this.cape instanceof CapeSimulation) {
      this.cape.step(
        step,
        this.character.getCapeAnchors(),
        this.character.getCapeColliders(),
        this.worldColliders,
        this.character.velocity,
        this.fixedTime,
      );
      for (const bot of this.performanceBots) {
        if (!bot.cape || !(bot.cape instanceof CapeSimulation)) {
          throw new Error('Mixed CPU and GPU cape simulations are unsupported.');
        }
        bot.cape.step(
          step,
          bot.character.getCapeAnchors(),
          bot.character.getCapeColliders(),
          this.worldColliders,
          bot.character.velocity,
          this.fixedTime,
        );
      }
      return;
    }

    const computeNodes = this.cape.prepareBatchStep(step, [
      {
        anchors: this.character.getCapeAnchors(),
        bodyColliders: this.character.getCapeColliders(),
        characterVelocity: this.character.velocity,
      },
      ...this.performanceBots.map((bot) => ({
        anchors: bot.character.getCapeAnchors(),
        bodyColliders: bot.character.getCapeColliders(),
        characterVelocity: bot.character.velocity,
      })),
    ], this.worldColliders, this.fixedTime);
    const renderer = invariant(
      this.pipeline.getWebGpuRenderer(),
      'WebGPU renderer is missing for the GPU cape batch.',
    );
    renderer.compute(computeNodes);
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

  private readonly handleCustomizationChange = (
    settings: CustomizationSettings,
    settleDimensions: boolean,
  ): void => {
    this.customizationSettings = settings;
    if (!this.cape || !this.character) return;
    this.cape.updateSettings(settings, this.character.getCapeAnchors());
    this.reconcilePerformanceBots(settings.bots);
    for (const bot of this.performanceBots) {
      bot.cape?.updateSettings(settings, bot.character.getCapeAnchors());
    }
    if (settleDimensions) this.stabilizeAllCapes();
    this.applySceneCustomization(settings);
    if (this.ready) this.pipeline.renderManual(0);
  };

  private applySceneCustomization(settings: CustomizationSettings): void {
    this.setLightsEnabled(settings.lights);
    this.setShadowsEnabled(settings.shadows);
    this.scene.environmentIntensity = settings.reflections ? 0.24 : 0;
    this.water.setReflectionsEnabled(settings.reflections);
  }

  private stabilizeCape(): void {
    this.stabilizeCapeInstance(this.character, this.cape);
  }

  private stabilizeAllCapes(): void {
    if (!(this.cape instanceof CapeSimulation)) {
      this.syncCapeGeometries();
      return;
    }
    this.stabilizeCape();
    this.performanceBots.forEach((bot) => {
      if (bot.cape) this.stabilizeCapeInstance(bot.character, bot.cape);
    });
    this.syncCapeGeometries();
  }

  private stabilizeCapeInstance(character: Character, cape: CapeInstance): void {
    const anchors = character.getCapeAnchors();
    const bodyColliders = character.getCapeColliders();
    this.stabilizationVelocity.set(0, 0, 0);
    for (let step = 0; step < 12; step += 1) {
      cape.step(
        PHYSICS_STEP,
        anchors,
        bodyColliders,
        this.worldColliders,
        this.stabilizationVelocity,
        this.fixedTime + step * PHYSICS_STEP,
      );
    }
  }

  private reconcilePerformanceBots(requestedCount: number): void {
    const targetCount = normalizeBotCount(requestedCount);
    while (this.performanceBots.length < targetCount) {
      this.performanceBots.push(this.createPerformanceBot(this.performanceBots.length));
    }
    while (this.performanceBots.length > targetCount) {
      const bot = this.performanceBots.pop();
      if (bot) this.disposePerformanceBot(bot);
    }
  }

  private createPerformanceBot(index: number): PerformanceBot {
    const character = new Character(BOT_CYAN_CAPE_PALETTE);
    const row = Math.floor(index / 2);
    const side = index % 2 === 0 ? -1 : 1;
    const z = this.character.root.position.z + (row - 2) * 1.55;
    const x = caveCenterX(z) + side * 0.82;
    character.root.position.set(
      x,
      this.worldCollision.getPlayerRootHeight(x, z),
      z,
    );
    character.root.rotation.y = index * 0.73;
    character.root.updateMatrixWorld(true);

    const cape = this.cape instanceof CapeSimulation
      ? this.capeFactory(
        character.getCapeAnchors(),
        this.customizationSettings,
        BOT_CYAN_CAPE_PALETTE,
      )
      : null;
    const input = new BotMovementInput(index);
    input.update(this.fixedTime);
    const bot: PerformanceBot = {
      character,
      cape,
      input,
      controller: new CharacterController(character, input, this.worldCollision),
    };
    this.scene.add(character.root);
    if (cape) this.scene.add(cape.mesh);
    this.configureCharacterRenderObjects(character, cape);
    // A GPU cape starts from the authored drape already. Running twelve
    // immediate steps here synchronously compiled every new compute graph on
    // the range-input event and caused multi-second UI freezes.
    if (cape instanceof CapeSimulation) this.stabilizeCapeInstance(character, cape);
    cape?.syncGeometry();
    return bot;
  }

  private configureCharacterRenderObjects(
    character: Character,
    cape: CapeInstance | null,
  ): void {
    const backend = this.pipeline.usesNodeRenderer() ? 'webgpu' : 'webgl';
    character.root.traverse((object) => {
      object.layers.set(CHARACTER_RENDER_LAYER);
      if (object instanceof THREE.Mesh && object.castShadow) {
        enableCameraIndependentShadowCaster(object, backend);
      }
    });
    if (cape) {
      cape.mesh.layers.set(CHARACTER_RENDER_LAYER);
      enableCameraIndependentShadowCaster(cape.mesh, backend);
    }
  }

  private syncCapeGeometries(): void {
    this.cape.syncGeometry();
    this.performanceBots.forEach((bot) => bot.cape?.syncGeometry());
  }

  private disposePerformanceBot(bot: PerformanceBot): void {
    this.scene.remove(bot.character.root);
    if (bot.cape) {
      this.scene.remove(bot.cape.mesh);
      bot.cape.dispose();
    }
    bot.character.dispose();
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

  private setShadowsEnabled(enabled: boolean): void {
    if (this.shadowsEnabled === enabled) return;
    this.shadowsEnabled = enabled;

    this.scene.traverse((object) => {
      if (
        !(object instanceof THREE.DirectionalLight)
        && !(object instanceof THREE.PointLight)
        && !(object instanceof THREE.SpotLight)
      ) return;
      if (enabled) {
        const intensity = this.savedShadowIntensities.get(object);
        if (intensity !== undefined) object.shadow.intensity = intensity;
      } else {
        this.savedShadowIntensities.set(object, object.shadow.intensity);
        object.shadow.intensity = 0;
      }
    });

    if (enabled) this.savedShadowIntensities.clear();
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
      traceCapeScenario: (options) => this.traceCapeScenario(options),
      profile: ({
        duration,
        frameStep = 1 / 60,
        synchronizationInterval = 1,
        includeDiagnostics = true,
      }) => (
        this.profileHarness(duration, frameStep, synchronizationInterval, includeDiagnostics)
      ),
      profileGpuKernels: ({ samples = 4 } = {}) => {
        if (!(this.cape instanceof CapeSimulation)) {
          return this.cape.profileKernelBreakdown(samples);
        }
        throw new Error('Per-kernel GPU profiling requires the WebGPU cape solver.');
      },
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

  private resetHarnessPlayer(): void {
    this.input.clearVirtualMovement();
    this.input.setVirtualRunning(false);
    this.character.root.position.set(-2.38, 0, -15);
    this.worldCollision.resolvePlayer(this.character.root.position);
    this.character.root.rotation.y = 0;
    this.characterController.reset();
    this.character.root.updateMatrixWorld(true);
    this.cape.reset(this.character.getCapeAnchors());
    this.harnessAccumulator = 0;
  }

  private async raiseCapeForHarness(): Promise<void> {
    await this.cape.refreshDiagnostics();
    const anchors = this.character.getCapeAnchors();
    const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    const state = new Float32Array(CAPE.columns * CAPE.rows * 4);
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = row * CAPE.columns + column;
        const position = this.cape.getParticlePosition(column, row);
        const offset = position.clone().sub(center);
        if (row > 0) position.y = center.y + Math.abs(offset.y);
        state[index * 4] = position.x;
        state[index * 4 + 1] = position.y;
        state[index * 4 + 2] = position.z;
      }
    }
    this.cape.overwriteStateForHarness(state, state);
    this.cape.syncGeometry();
  }

  private captureCapeTrajectorySample(frame: number): CapeTrajectorySample {
    const anchors = this.character.getCapeAnchors();
    const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    const right = anchors.right.clone().sub(anchors.left).normalize();
    const particles: number[] = [];
    let maximumLowerParticleHeight = Number.NEGATIVE_INFINITY;
    const firstLowerRow = Math.floor(CAPE.rows * 0.58);
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const offset = this.cape.getParticlePosition(column, row).clone().sub(center);
        const localRight = offset.dot(right);
        const localBack = offset.dot(anchors.back);
        particles.push(localRight, offset.y, localBack);
        if (row >= firstLowerRow) {
          maximumLowerParticleHeight = Math.max(maximumLowerParticleHeight, offset.y);
        }
      }
    }
    const bodyColliders = this.character.getCapeColliders();
    const bodyPenetrationByKind = this.cape.getBodyPenetrationDiagnostics(
      bodyColliders,
      anchors.back,
    );
    const bodyPenetrationByCollider = Object.fromEntries(
      bodyColliders.map((collider) => [
        collider.name,
        this.cape.getMaximumBodyPenetration([collider], anchors.back),
      ]),
    );
    const maximumNecklineAttachmentError = Math.max(
      this.cape.getParticlePosition(0, 0).distanceTo(anchors.left),
      this.cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(anchors.right),
    );
    return {
      frame,
      time: this.fixedTime,
      playerPosition: this.character.root.position.toArray(),
      playerYaw: this.character.root.rotation.y,
      playerSpeed: Math.hypot(this.character.velocity.x, this.character.velocity.z),
      particles,
      hemDrop: this.cape.getHemDrop(),
      hemBackOffset: this.cape.getHemBackOffset(anchors),
      maximumParticleMotion: this.cape.getMaximumParticleMotion(),
      particleMotion: this.cape.getMaximumParticleMotionDiagnostics(),
      maximumLowerParticleHeight,
      maximumLowerHorizontalOffset: this.cape.getMaximumLowerCapeHorizontalOffset(),
      centerlineDeviation: this.cape.getCapeCenterlineDeviation(),
      rowTwistRange: this.cape.getCapeRowTwistRange(anchors),
      maximumNecklineAttachmentError,
      maximumBodyPenetration: bodyPenetrationByKind.maximum,
      bodyPenetrationByKind,
      bodyPenetrationByCollider,
      maximumStructuralError: this.cape.getMaximumStructuralError(),
      minimumSelfSeparation: this.cape.getMinimumSelfSeparation(),
      maximumUpwardFold: this.cape.getMaximumUpwardFold(),
      lowerCapeSpanRatio: this.cape.getAverageLowerCapeSpanRatio(anchors),
      lowerCapeRowCurlRatio: this.cape.getMaximumLowerCapeRowCurlRatio(anchors),
    };
  }

  private async traceCapeScenario({
    scenario,
    frames = 120,
    sampleEvery = 1,
  }: {
    scenario: CapeTrajectoryScenario;
    frames?: number;
    sampleEvery?: number;
  }): Promise<CapeTrajectoryReport> {
    const frameCount = THREE.MathUtils.clamp(Math.round(frames), 1, 360);
    const sampleInterval = THREE.MathUtils.clamp(Math.round(sampleEvery), 1, 12);
    this.resetHarnessPlayer();
    this.fixedTime = 0;
    const anchors = this.character.getCapeAnchors();
    this.cape.updateSettings({
      ...DEFAULT_CAPE_PHYSICS_SETTINGS,
      weight: scenario === 'lightweight-stop'
        ? 0.5
        : DEFAULT_CAPE_PHYSICS_SETTINGS.weight,
    }, anchors);
    this.cape.reset(anchors);
    if (scenario === 'raised-drop' || scenario === 'falling-forward-start') {
      await this.raiseCapeForHarness();
    }

    const samples: CapeTrajectorySample[] = [];
    for (let frame = 0; frame <= frameCount; frame += 1) {
      if (scenario !== 'raised-drop') {
        if (scenario === 'forward-start' || scenario === 'falling-forward-start') {
          this.input.setVirtualMovement(0, frame >= 30 ? 1 : 0);
        } else if (scenario === 'forward-stop' || scenario === 'lightweight-stop') {
          this.input.setVirtualMovement(0, frame >= 30 && frame < 90 ? 1 : 0);
        } else if (scenario === 'reverse') {
          this.input.setVirtualMovement(0, frame < 30 ? 0 : frame < 90 ? 1 : -1);
        } else if (scenario === 'back-and-forth') {
          const moving = frame >= 30 && frame < 210;
          const direction = Math.floor((frame - 30) / 30) % 2 === 0 ? 1 : -1;
          this.input.setVirtualMovement(0, moving ? direction : 0);
        }
      }
      if (frame % sampleInterval === 0) {
        await this.cape.refreshDiagnostics();
        samples.push(this.captureCapeTrajectorySample(frame));
      }
      if (frame === frameCount) break;
      this.fixedTime += PHYSICS_STEP;
      this.characterController.update(PHYSICS_STEP, this.thirdPersonCamera.yaw);
      this.characterController.consumeLandingImpact();
      this.character.root.updateMatrixWorld(true);
      this.cape.step(
        PHYSICS_STEP,
        this.character.getCapeAnchors(),
        this.character.getCapeColliders(),
        [],
        this.character.velocity,
        this.fixedTime,
      );
      this.cape.syncGeometry();
      this.pipeline.renderManual(PHYSICS_STEP);
    }
    this.input.clearVirtualMovement();
    return {
      scenario,
      renderer: this.pipeline.getBackendDiagnostics().actual,
      physicsStep: PHYSICS_STEP,
      samples,
    };
  }

  private async profileHarness(
    duration: number,
    requestedFrameStep: number,
    requestedSynchronizationInterval: number,
    includeDiagnostics: boolean,
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
    const scenePhaseTotals = createScenePhaseTotals();
    const profileStart = performance.now();
    let batchStart = profileStart;
    let batchFrames = 0;
    let frames = 0;

    while (remaining > 0.000_001) {
      const delta = Math.min(frameStep, remaining);
      remaining -= delta;
      const framePhases = this.advanceHarnessFrame(delta, scenePhaseTotals);
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
      scenePhaseMilliseconds: Object.fromEntries(
        Object.entries(scenePhaseTotals).map(([name, total]) => [
          name,
          frames > 0 ? total / frames : 0,
        ]),
      ) as unknown as ScenePhaseTotals,
      programsBefore,
      programsAfter: this.pipeline.getProgramCount(),
      diagnostics: includeDiagnostics ? await this.getDiagnosticsAfterReadback() : null,
    };
  }

  private async getDiagnosticsAfterReadback(): Promise<ReturnType<CapeDemo['getDiagnostics']>> {
    await this.cape.refreshDiagnostics();
    return this.getDiagnostics();
  }

  private advanceHarnessFrame(delta: number): {
    readonly physicsMilliseconds: number;
    readonly sceneMilliseconds: number;
  };
  private advanceHarnessFrame(
    delta: number,
    scenePhaseTotals: ScenePhaseTotals,
  ): {
    readonly physicsMilliseconds: number;
    readonly sceneMilliseconds: number;
  };
  private advanceHarnessFrame(
    delta: number,
    scenePhaseTotals?: ScenePhaseTotals,
  ): {
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
    if (simulated) this.syncCapeGeometries();
    const sceneStart = performance.now();
    if (scenePhaseTotals) {
      this.updateSceneProfiled(delta, scenePhaseTotals);
    } else {
      this.updateScene(delta);
    }
    return {
      physicsMilliseconds: sceneStart - physicsStart,
      sceneMilliseconds: performance.now() - sceneStart,
    };
  }

  private updateSceneProfiled(delta: number, totals: ScenePhaseTotals): void {
    const playerPosition = this.character.root.position;
    const planarSpeed = Math.hypot(this.character.velocity.x, this.character.velocity.z);
    let start = performance.now();
    this.thirdPersonCamera.update(delta, playerPosition);
    totals.camera += performance.now() - start;
    start = performance.now();
    this.updateCameraFade();
    totals.cameraFade += performance.now() - start;
    start = performance.now();
    this.water.update(
      delta,
      this.fixedTime,
      playerPosition,
      this.character.root.rotation.y,
      this.characterController.isGrounded() ? planarSpeed : 0,
    );
    totals.water += performance.now() - start;
    start = performance.now();
    this.torches.update(this.fixedTime, playerPosition);
    totals.torches += performance.now() - start;
    start = performance.now();
    this.veins.update(this.fixedTime, playerPosition);
    totals.veins += performance.now() - start;
    start = performance.now();
    this.atmosphere.update(this.fixedTime);
    totals.atmosphere += performance.now() - start;
    start = performance.now();
    this.lighting.update(playerPosition, this.fixedTime);
    if (!this.customizationSettings.lights) this.setLightsEnabled(false);
    totals.lighting += performance.now() - start;
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
        particleMotion: this.cape.getMaximumParticleMotionDiagnostics(),
        sleeping: this.cape.isSleeping(),
        minimumSelfSeparation: this.cape.getMinimumSelfSeparation(),
        maximumUpwardFold: this.cape.getMaximumUpwardFold(),
        hemDrop: this.cape.getHemDrop(),
        minimumLowerCapeDrop: this.cape.getMinimumLowerCapeDrop(),
        maximumLowerCapeLateralOffset: this.cape.getMaximumLowerCapeLateralOffset(capeAnchors),
        averageLowerCapeSpanRatio: this.cape.getAverageLowerCapeSpanRatio(capeAnchors),
        capeRowTwistRange: this.cape.getCapeRowTwistRange(capeAnchors),
        capeCenterlineDeviation: this.cape.getCapeCenterlineDeviation(),
        maximumLowerCapeRowCurlRatio: this.cape.getMaximumLowerCapeRowCurlRatio(capeAnchors),
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
        botCount: this.performanceBots.length,
        simulatedCapes: 1 + this.performanceBots.length,
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
    while (this.performanceBots.length > 0) {
      const bot = this.performanceBots.pop();
      if (bot) this.disposePerformanceBot(bot);
    }
    this.cape?.dispose();
    this.character?.dispose();
    this.lighting?.dispose();
    this.performance.dispose();
    this.pipeline.dispose();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  };
}
