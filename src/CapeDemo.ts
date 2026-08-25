import * as THREE from 'three';
import { PHYSICS_STEP } from './config';
import { ThirdPersonCamera } from './camera/ThirdPersonCamera';
import { AdaptiveQuality, type QualityState } from './core/AdaptiveQuality';
import { FixedStepClock } from './core/FixedStepClock';
import { PerformanceMonitor } from './core/PerformanceMonitor';
import { RenderPipeline } from './core/RenderPipeline';
import { configureTextureFiltering, createRockTextures } from './graphics/proceduralTextures';
import { InputController } from './input/InputController';
import { CinematicLighting } from './lighting/CinematicLighting';
import { CapeSimulation } from './physics/CapeSimulation';
import { Character } from './player/Character';
import { CharacterController } from './player/CharacterController';
import { LoadingScreen } from './ui/LoadingScreen';
import { invariant } from './utils/assert';
import { CaveAtmosphere } from './world/CaveAtmosphere';
import { CaveWorld } from './world/CaveWorld';
import { caveCenterX, floorHeightAt } from './world/caveProfile';
import { MineralVeins } from './world/MineralVeins';
import { TorchSystem } from './world/TorchSystem';
import { WaterSystem } from './world/WaterSystem';

export class CapeDemo {
  private readonly canvas: HTMLCanvasElement;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(52, 1, 0.08, 120);
  private readonly loading = new LoadingScreen();
  private readonly pipeline: RenderPipeline;
  private readonly performance = new PerformanceMonitor();
  private readonly clock = new FixedStepClock();
  private readonly quality: AdaptiveQuality;
  private readonly qualityLabel: HTMLElement;
  private readonly harnessMode = new URLSearchParams(window.location.search).get('harness') === '1';
  private input!: InputController;
  private character!: Character;
  private characterController!: CharacterController;
  private thirdPersonCamera!: ThirdPersonCamera;
  private cape!: CapeSimulation;
  private cave!: CaveWorld;
  private water!: WaterSystem;
  private torches!: TorchSystem;
  private veins!: MineralVeins;
  private atmosphere!: CaveAtmosphere;
  private lighting!: CinematicLighting;
  private fixedTime = 0;
  private harnessAccumulator = 0;
  private ready = false;

  public constructor() {
    this.canvas = invariant(document.querySelector<HTMLCanvasElement>('#scene-canvas'), 'Scene canvas is missing.');
    this.scene.background = new THREE.Color(0x050a0c);
    this.scene.fog = new THREE.FogExp2(0x071012, 0.034);
    this.pipeline = new RenderPipeline(this.canvas, this.scene, this.camera);
    this.qualityLabel = invariant(document.querySelector<HTMLElement>('[data-quality-label]'), 'Quality label is missing.');
    this.quality = new AdaptiveQuality((state) => this.applyQuality(state));
    document.body.classList.toggle('is-harness', this.harnessMode);
  }

  public async start(): Promise<void> {
    await this.loading.update(0.08, 'Shaping ancient stone');
    const rockTextures = createRockTextures(512);
    configureTextureFiltering(
      rockTextures,
      Math.min(8, this.pipeline.renderer.capabilities.getMaxAnisotropy()),
    );
    this.cave = new CaveWorld(rockTextures);
    this.scene.add(this.cave.group);

    await this.loading.update(0.3, 'Awakening mineral light');
    this.veins = new MineralVeins();
    this.torches = new TorchSystem();
    this.water = new WaterSystem();
    this.atmosphere = new CaveAtmosphere();
    this.scene.add(this.veins.group, this.torches.group, this.water.group, this.atmosphere.points);

    await this.loading.update(0.54, 'Forging the traveller');
    this.character = new Character();
    const startZ = 11.8;
    const startX = caveCenterX(startZ);
    this.character.root.position.set(startX, floorHeightAt(startX, startZ), startZ);
    this.character.root.updateMatrixWorld(true);
    this.scene.add(this.character.root);
    this.cape = new CapeSimulation(this.character.getCapeAnchors());
    this.scene.add(this.cape.mesh);

    this.input = new InputController(this.canvas, this.dismissOnboarding);
    this.characterController = new CharacterController(this.character, this.input);
    this.thirdPersonCamera = new ThirdPersonCamera(this.camera, this.input, this.cave.cameraColliders);
    this.thirdPersonCamera.snapTo(this.character.root.position);
    this.lighting = new CinematicLighting(this.scene, this.pipeline.renderer);
    this.scene.add(this.lighting.group);
    this.lighting.update(this.character.root.position, 0);
    this.torches.update(0, this.character.root.position);
    this.veins.update(0, this.character.root.position);
    this.cape.syncGeometry();

    await this.loading.update(0.76, 'Compiling cloth and water shaders');
    await this.pipeline.compile(this.scene, this.camera);
    this.pipeline.render(0);
    await this.loading.update(0.94, 'Warming the torchlight');
    this.pipeline.renderer.shadowMap.needsUpdate = true;
    this.pipeline.render(0);

    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.dispose, { once: true });
    window.setTimeout(this.dismissOnboarding, 7_500);
    this.installHarness();
    await this.loading.reveal();
    this.ready = true;
    if (window.__CAPE_DEMO__) window.__CAPE_DEMO__.ready = true;
    if (this.harnessMode) {
      this.updateScene(0);
      this.pipeline.render(0);
    } else {
      this.pipeline.renderer.setAnimationLoop(this.frame);
    }
  }

  private readonly frame = (timestamp: number): void => {
    this.performance.recordFrame(timestamp);
    const timing = this.clock.advance(timestamp, this.simulateStep);
    if (timing.physicsSteps > 0) this.cape.syncGeometry();
    this.updateScene(timing.delta);
    this.quality.observe(this.fixedTime, this.performance.getSnapshot());
    this.pipeline.render(timing.delta);
  };

  private readonly simulateStep = (step: number): void => {
    this.fixedTime += step;
    this.characterController.update(step, this.thirdPersonCamera.yaw);
    const anchors = this.character.getCapeAnchors();
    this.cape.step(
      step,
      anchors,
      this.character.getBodySpheres(),
      this.character.velocity,
      this.fixedTime,
    );
  };

  private updateScene(delta: number): void {
    const playerPosition = this.character.root.position;
    const playerSpeed = this.character.velocity.length();
    this.thirdPersonCamera.update(delta, playerPosition);
    this.water.update(delta, this.fixedTime, playerPosition, this.character.root.rotation.y, playerSpeed);
    this.torches.update(this.fixedTime, playerPosition);
    this.veins.update(this.fixedTime, playerPosition);
    this.atmosphere.update(this.fixedTime);
    this.lighting.update(playerPosition, this.fixedTime);
  }

  private readonly handleResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
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

  private applyQuality(state: QualityState): void {
    this.pipeline.setResolutionScale(state.scale);
    this.qualityLabel.textContent = state.label;
  }

  private installHarness(): void {
    window.__CAPE_DEMO__ = {
      ready: false,
      getDiagnostics: () => this.getDiagnostics(),
      setView: ({ yaw, pitch, distance }) => {
        this.thirdPersonCamera.setOrbit(yaw, pitch, distance, this.character.root.position);
        this.updateScene(0);
        this.pipeline.render(0);
        return this.getDiagnostics();
      },
      setCameraPose: ({ position, target }) => {
        this.thirdPersonCamera.setPose(
          new THREE.Vector3().fromArray(position),
          new THREE.Vector3().fromArray(target),
        );
        this.pipeline.render(0);
        return this.getDiagnostics();
      },
      setMovement: (horizontal, forward) => {
        this.input.setVirtualMovement(horizontal, forward);
      },
      advance: ({ duration, frameStep = 1 / 60 }) => this.advanceHarness(duration, frameStep),
      profile: ({ duration, frameStep = 1 / 60 }) => this.profileHarness(duration, frameStep),
    };
  }

  private advanceHarness(duration: number, requestedFrameStep: number): ReturnType<CapeDemo['getDiagnostics']> {
    const frameStep = THREE.MathUtils.clamp(requestedFrameStep, 1 / 144, 1 / 30);
    let remaining = THREE.MathUtils.clamp(duration, 0, 30);
    let lastDelta = 0;
    while (remaining > 0.000_001) {
      const delta = Math.min(frameStep, remaining);
      lastDelta = delta;
      remaining -= delta;
      this.advanceHarnessFrame(delta);
    }
    this.pipeline.render(lastDelta);
    return this.getDiagnostics();
  }

  private profileHarness(duration: number, requestedFrameStep: number) {
    const frameStep = THREE.MathUtils.clamp(requestedFrameStep, 1 / 144, 1 / 30);
    let remaining = THREE.MathUtils.clamp(duration, 0, 12);
    const frameDurations: number[] = [];
    const programsBefore = this.pipeline.renderer.info.programs?.length ?? 0;
    const context = this.pipeline.renderer.getContext();

    while (remaining > 0.000_001) {
      const delta = Math.min(frameStep, remaining);
      remaining -= delta;
      const frameStart = performance.now();
      this.advanceHarnessFrame(delta);
      this.pipeline.render(delta);
      context.finish();
      frameDurations.push(performance.now() - frameStart);
    }

    frameDurations.sort((first, second) => first - second);
    const total = frameDurations.reduce((sum, value) => sum + value, 0);
    const p95Index = Math.min(
      frameDurations.length - 1,
      Math.floor(frameDurations.length * 0.95),
    );
    return {
      frames: frameDurations.length,
      averageFrameMilliseconds: frameDurations.length > 0 ? total / frameDurations.length : 0,
      p95FrameMilliseconds: frameDurations[p95Index] ?? 0,
      maximumFrameMilliseconds: frameDurations.at(-1) ?? 0,
      programsBefore,
      programsAfter: this.pipeline.renderer.info.programs?.length ?? 0,
      diagnostics: this.getDiagnostics(),
    };
  }

  private advanceHarnessFrame(delta: number): void {
    this.harnessAccumulator += delta;
    let simulated = false;
    while (this.harnessAccumulator + 0.000_000_1 >= PHYSICS_STEP) {
      this.simulateStep(PHYSICS_STEP);
      this.harnessAccumulator -= PHYSICS_STEP;
      simulated = true;
    }
    if (simulated) this.cape.syncGeometry();
    this.updateScene(delta);
  }

  private getDiagnostics() {
    const capeAnchors = this.character.getCapeAnchors();
    return {
      ready: this.ready,
      simulationTime: this.fixedTime,
      fps: this.performance.getSnapshot(),
      quality: this.quality.getState(),
      renderer: {
        calls: this.pipeline.renderer.info.render.calls,
        triangles: this.pipeline.renderer.info.render.triangles,
        pixelRatio: this.pipeline.renderer.getPixelRatio(),
        programs: this.pipeline.renderer.info.programs?.length ?? 0,
        sizing: this.pipeline.getSizingDiagnostics(),
      },
      player: {
        position: this.character.root.position.toArray(),
        speed: this.character.velocity.length(),
        inWater: this.water.isInWater(this.character.root.position),
      },
      cape: {
        maximumStructuralError: this.cape.getMaximumStructuralError(),
        maximumBodyPenetration: this.cape.getMaximumBodyPenetration(
          this.character.getBodySpheres(),
          capeAnchors.back,
        ),
        hemCenter: this.cape.getParticlePosition(6, 17).toArray(),
      },
      water: this.water.getDiagnostics(),
      minerals: {
        clusters: this.veins.getClusterPositions(),
        lights: this.veins.getLightDiagnostics(),
      },
      torches: {
        lights: this.torches.getLightDiagnostics(),
      },
    };
  }

  private readonly dispose = (): void => {
    this.pipeline.renderer.setAnimationLoop(null);
    this.input?.dispose();
    this.lighting?.dispose();
    this.pipeline.dispose();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  };
}
