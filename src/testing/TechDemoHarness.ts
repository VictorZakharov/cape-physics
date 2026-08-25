import * as THREE from 'three';
import { PHYSICS_STEP } from '../config';
import { createRockTextures } from '../graphics/proceduralTextures';
import { CapeSimulation } from '../physics/CapeSimulation';
import { Character } from '../player/Character';
import { CaveWorld } from '../world/CaveWorld';
import { caveCenterX } from '../world/caveProfile';
import { MineralVeins } from '../world/MineralVeins';
import { TorchSystem } from '../world/TorchSystem';
import { WaterSystem } from '../world/WaterSystem';
import { WorldCollisionResolver } from '../world/WorldCollisionResolver';

interface SceneBudget {
  readonly objects: number;
  readonly estimatedDrawCalls: number;
  readonly triangles: number;
  readonly lights: number;
  readonly shadowCastingLights: number;
  readonly shaderMaterials: number;
}

export interface TechDemoHarnessReport {
  readonly constructionMilliseconds: number;
  readonly simulationMilliseconds: number;
  readonly millisecondsPerPhysicsStep: number;
  readonly simulatedSeconds: number;
  readonly capeMaximumStructuralError: number;
  readonly capeMaximumBodyPenetration: number;
  readonly capeMaximumEnvironmentPenetration: number;
  readonly capeMinimumSelfSeparation: number;
  readonly capeHemDrop: number;
  readonly capeStateFinite: boolean;
  readonly water: ReturnType<WaterSystem['getDiagnostics']>;
  readonly scene: SceneBudget;
  readonly lighting: {
    readonly torches: ReturnType<TorchSystem['getLightDiagnostics']>;
    readonly minerals: ReturnType<MineralVeins['getLightDiagnostics']>;
  };
  readonly proceduralTextureBytes: number;
  readonly worldColliderCount: number;
}

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Harness invariant failed: ${message}`);
}

function geometryTriangles(geometry: THREE.BufferGeometry): number {
  return geometry.index
    ? Math.floor(geometry.index.count / 3)
    : Math.floor((geometry.getAttribute('position')?.count ?? 0) / 3);
}

function validateGeometry(geometry: THREE.BufferGeometry, name: string): void {
  const positions = geometry.getAttribute('position');
  invariant(positions !== undefined && positions.count > 0, `${name} has no vertices`);
  for (let index = 0; index < positions.count; index += 1) {
    invariant(
      Number.isFinite(positions.getX(index))
        && Number.isFinite(positions.getY(index))
        && Number.isFinite(positions.getZ(index)),
      `${name} contains a non-finite vertex`,
    );
  }
}

function analyzeScene(scene: THREE.Scene): SceneBudget {
  let objects = 0;
  let estimatedDrawCalls = 0;
  let triangles = 0;
  let lights = 0;
  let shadowCastingLights = 0;
  let shaderMaterials = 0;

  scene.traverse((object) => {
    objects += 1;
    if (object instanceof THREE.Light) {
      lights += 1;
      if (object.castShadow) shadowCastingLights += 1;
    }
    if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
      estimatedDrawCalls += 1;
      validateGeometry(object.geometry, object.name || object.type);
      const instanceCount = object instanceof THREE.InstancedMesh ? object.count : 1;
      triangles += geometryTriangles(object.geometry) * instanceCount;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      shaderMaterials += materials.filter((material) => material instanceof THREE.ShaderMaterial).length;
    }
  });
  return { objects, estimatedDrawCalls, triangles, lights, shadowCastingLights, shaderMaterials };
}

function textureByteLength(texture: THREE.DataTexture): number {
  const data = texture.image.data as ArrayBufferView;
  return data.byteLength;
}

export function runTechDemoHarness(simulatedSeconds = 12): TechDemoHarnessReport {
  const constructionStart = performance.now();
  const rockTextures = createRockTextures(256);
  const cave = new CaveWorld(rockTextures);
  const water = new WaterSystem();
  const torches = new TorchSystem();
  const veins = new MineralVeins();
  const worldColliders = [
    ...cave.worldColliders,
    ...torches.worldColliders,
    ...veins.worldColliders,
  ];
  const worldCollision = new WorldCollisionResolver(worldColliders);
  const character = new Character();
  const startZ = 11.8;
  const startX = caveCenterX(startZ);
  character.root.position.set(startX, worldCollision.getPlayerRootHeight(startX, startZ), startZ);
  character.root.updateMatrixWorld(true);
  const cape = new CapeSimulation(character.getCapeAnchors());
  const scene = new THREE.Scene();
  scene.add(cave.group, water.group, torches.group, veins.group, character.root, cape.mesh);
  const constructionMilliseconds = performance.now() - constructionStart;

  const ticks = Math.round(simulatedSeconds / PHYSICS_STEP);
  const priorPosition = character.root.position.clone();
  const simulationStart = performance.now();
  for (let tick = 0; tick < ticks; tick += 1) {
    const time = tick * PHYSICS_STEP;
    const z = startZ - time * 2.45;
    const x = caveCenterX(z) + Math.sin(time * 0.72) * 0.34;
    priorPosition.copy(character.root.position);
    character.root.position.set(x, worldCollision.getPlayerRootHeight(x, z), z);
    character.velocity.copy(character.root.position).sub(priorPosition).divideScalar(PHYSICS_STEP);
    if (character.velocity.lengthSq() > 0.001) {
      character.root.rotation.y = Math.atan2(-character.velocity.x, -character.velocity.z);
    }
    character.updateAnimation(PHYSICS_STEP, character.velocity.length());
    character.root.updateMatrixWorld(true);
    cape.step(
      PHYSICS_STEP,
      character.getCapeAnchors(),
      character.getCapeColliders(),
      worldColliders,
      character.velocity,
      time,
    );
    water.update(PHYSICS_STEP, time, character.root.position, character.root.rotation.y, character.velocity.length());
    torches.update(time, character.root.position);
    veins.update(time, character.root.position);
    if (tick % 2 === 0) cape.syncGeometry();
  }
  cape.syncGeometry();
  const simulationMilliseconds = performance.now() - simulationStart;

  const capeBottom = cape.getParticlePosition(6, 17);
  const capeStateFinite = Number.isFinite(capeBottom.x)
    && Number.isFinite(capeBottom.y)
    && Number.isFinite(capeBottom.z);
  const capeMaximumStructuralError = cape.getMaximumStructuralError();
  const finalAnchors = character.getCapeAnchors();
  const capeMaximumBodyPenetration = cape.getMaximumBodyPenetration(
    character.getCapeColliders(),
    finalAnchors.back,
  );
  const capeMaximumEnvironmentPenetration = cape.getMaximumEnvironmentPenetration(worldColliders);
  const capeMinimumSelfSeparation = cape.getMinimumSelfSeparation();
  const capeHemDrop = cape.getHemDrop();
  const waterDiagnostics = water.getDiagnostics();
  const sceneBudget = analyzeScene(scene);
  const torchLights = torches.getLightDiagnostics();
  const mineralLights = veins.getLightDiagnostics();
  const proceduralTextureBytes = textureByteLength(rockTextures.color)
    + textureByteLength(rockTextures.height)
    + textureByteLength(rockTextures.normal)
    + textureByteLength(rockTextures.roughness);
  const millisecondsPerPhysicsStep = simulationMilliseconds / ticks;
  const expectedFootstepRipples = simulatedSeconds >= 10 ? 8 : Math.max(1, Math.floor(simulatedSeconds / 2));
  const expectedDripRipples = simulatedSeconds >= 10 ? 8 : Math.max(2, Math.floor(simulatedSeconds * 0.65));
  const expectedActiveRipples = Math.min(8, expectedFootstepRipples + expectedDripRipples);

  invariant(capeStateFinite, 'cape state became non-finite');
  invariant(capeMaximumStructuralError < 0.055, `cape constraint error ${capeMaximumStructuralError.toFixed(4)} exceeded budget`);
  invariant(capeMaximumBodyPenetration < 0.002, `cape body penetration ${capeMaximumBodyPenetration.toFixed(4)} exceeded budget`);
  invariant(capeMaximumEnvironmentPenetration < 0.002, `cape cave penetration ${capeMaximumEnvironmentPenetration.toFixed(4)} exceeded budget`);
  invariant(capeMinimumSelfSeparation > 0.05, `cape self-separation ${capeMinimumSelfSeparation.toFixed(4)} collapsed`);
  invariant(capeHemDrop > 0.72, `cape settled into an inverted pose (hem drop ${capeHemDrop.toFixed(3)})`);
  invariant(worldColliders.length >= 600, 'procedural cave-object collision coverage regressed');
  invariant(waterDiagnostics.puddles >= 5, 'walkable puddle count regressed');
  invariant(waterDiagnostics.drops >= 10, 'water-drop emitters are missing');
  invariant(waterDiagnostics.activeRipples >= expectedActiveRipples, 'footsteps and drips did not produce enough ripple events');
  invariant(waterDiagnostics.footstepRipples >= expectedFootstepRipples, 'walk traversal produced too few footstep ripples');
  invariant(waterDiagnostics.dripRipples >= expectedDripRipples, 'ceiling emitters produced too few drip ripples');
  invariant(sceneBudget.shadowCastingLights === 1, 'the single-shadow-light performance contract changed');
  invariant(torchLights.visibleLights === torchLights.lights, 'torch pool changed the compiled light count');
  invariant(mineralLights.visibleLights === mineralLights.lights, 'mineral pool changed the compiled light count');
  invariant(sceneBudget.shaderMaterials >= 3, 'procedural water, flame, or glow shaders are missing');
  invariant(sceneBudget.estimatedDrawCalls <= 85, `estimated draw calls ${sceneBudget.estimatedDrawCalls} exceeded budget`);
  invariant(sceneBudget.triangles <= 160_000, `triangle count ${sceneBudget.triangles} exceeded budget`);
  invariant(millisecondsPerPhysicsStep < 3, `simulation cost ${millisecondsPerPhysicsStep.toFixed(3)} ms exceeded budget`);

  return {
    constructionMilliseconds,
    simulationMilliseconds,
    millisecondsPerPhysicsStep,
    simulatedSeconds,
    capeMaximumStructuralError,
    capeMaximumBodyPenetration,
    capeMaximumEnvironmentPenetration,
    capeMinimumSelfSeparation,
    capeHemDrop,
    capeStateFinite,
    water: waterDiagnostics,
    scene: sceneBudget,
    lighting: {
      torches: torchLights,
      minerals: mineralLights,
    },
    proceduralTextureBytes,
    worldColliderCount: worldColliders.length,
  };
}
