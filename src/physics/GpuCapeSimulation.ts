import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  attribute,
  bool,
  cross,
  float,
  instancedArray,
  instanceIndex,
  localId,
  negateOnBackSide,
  storageBarrier,
  transformNormalToView,
  uint,
  uniform,
  uniformArray,
  vertexIndex,
  workgroupId,
} from 'three/tsl';
import { CAPE } from '../config';
import { createCapeFabricTextures } from '../graphics/proceduralTextures';
import type { CapeAnchors } from '../player/Character';
import type { CapsuleCollider, WorldCollider } from './colliders';
import { CAPE_DRAG_PER_SECOND } from './CapeAerodynamics';
import { createGpuCapeTopology } from './GpuCapeTopology';
import { CapeSimulation } from './CapeSimulation';
import {
  BOT_CYAN_CAPE_PALETTE,
  CRIMSON_CAPE_PALETTE,
  type CapeFabricPalette,
} from './CapeAppearance';
import { createPackedCapeInitialState } from './CapeInitialState';
import {
  DEFAULT_CAPE_PHYSICS_SETTINGS,
  normalizeCapePhysicsSettings,
  type CapePhysicsSettings,
} from './CapeSettings';
import {
  IDLE_DRAPE_RECOVERY_DELAY_SECONDS,
  IDLE_DRAPE_RECOVERY_RAMP_SECONDS,
  WAKE_SPEED,
} from './CapeSolverConstants';
import type {
  GpuCapeBatchHarnessState,
  GpuCapeKernelProfile,
  GpuCapeKernelTiming,
  GpuCapeStepInput,
} from './CapeSolverTypes';
export type {
  GpuCapeBatchHarnessState,
  GpuCapeKernelProfile,
  GpuCapeKernelTiming,
  GpuCapeStepInput,
} from './CapeSolverTypes';
import { GPU_WORLD_CANDIDATE_REFRESH_DISTANCE } from './GpuCapeBroadphase';
import {
  GPU_BODY_BUFFER_STRIDE as BODY_BUFFER_STRIDE,
  GPU_ROCK_BUFFER_STRIDE as ROCK_BUFFER_STRIDE,
  MAX_GPU_BODY_COLLIDERS as MAX_BODY_COLLIDERS,
  MAX_GPU_WORLD_ROCKS as MAX_WORLD_ROCKS,
  MAX_GPU_WORLD_SPHERES as MAX_WORLD_SPHERES,
  packGpuCapeBodyColliders,
  packGpuCapeWorldColliders,
  selectGpuCapeWorldColliderCandidates,
} from './GpuCapeColliderPacking';
import { createGpuCapeDispatchSchedule } from './GpuCapeDispatchSchedule';
import {
  cloneCapeAnchors,
  packGpuCapeAnchors,
  prepareGpuCapeDynamics,
} from './GpuCapeStepPreparation';
import {
  createGpuCapeBodyContactReconciliationKernel,
  createGpuCapeMaterialContactFlagResetKernel,
  createGpuCapeProjectionVerticalVelocityReconciliationKernel,
} from './GpuCapeReconciliationKernels';
import {
  createGpuCapeIdleDrapeRecoveryKernel,
  createGpuCapePredictionKernel,
} from './GpuCapePredictionKernels';
import { createGpuCapeConstraintKernel } from './GpuCapeConstraintKernel';
import { createGpuCapeVirtualBodyContactColorFunction } from './GpuCapeVirtualBodyContactKernel';
import { createGpuCapeRockFaceColorFunction } from './GpuCapeRockFaceKernel';
import {
  createGpuCapeProjectionFunction,
  type GpuCapeProjectionResources,
} from './GpuCapeProjectionKernel';
import { getCaveShellSampleData } from '../world/caveProfile';

interface KernelTimestampBackend {
  readonly trackTimestamp?: boolean;
  getTimestampUID(context: THREE.ComputeNode): string;
  getTimestamp(uid: string): number;
}

const PARTICLE_COUNT = CAPE.columns * CAPE.rows;
export const MAXIMUM_GPU_CAPES = 11;
const PACKED_PARTICLE_COUNT = PARTICLE_COUNT * MAXIMUM_GPU_CAPES;

/**
 * WebGPU cape path. Particle state never leaves storage buffers while the
 * game is running; readback is reserved for explicit harness diagnostics.
 *
 * Distance constraints use WebGL's exact shared row-major Gauss-Seidel stream
 * so projection order and Verlet velocity agree between backends. Expensive
 * self, body, cave, and formation collision work remains parallel on the GPU.
 * Only the pinned neckline follows character translation. Free particles stay
 * in world-space Verlet motion so the ordered constraints transmit that pull
 * through the cloth exactly like the CPU/WebGL solver.
 */
export class GpuCapeSimulation {
  public readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalNodeMaterial>;
  public readonly botMesh: THREE.InstancedMesh<
    THREE.BufferGeometry,
    THREE.MeshPhysicalNodeMaterial
  >;
  private readonly diagnosticMirror: CapeSimulation;
  private readonly renderer: THREE.WebGPURenderer;
  private readonly positionBuffer;
  private readonly scratchBuffer;
  private readonly previousBuffer;
  private readonly predictedVerticalBuffer;
  private readonly materialContactFlagBuffer;
  private readonly topologyBuffer;
  private readonly constraintBuffer;
  private readonly constraintCount: number;
  private readonly bodyBuffer;
  private readonly caveShellBuffer;
  private readonly worldSphereBuffer;
  private readonly rockBuffer;
  private readonly deltaTimeUniform = uniform(1 / 120);
  private readonly timeUniform = uniform(0);
  private readonly dragPerSecondUniform = uniform(CAPE_DRAG_PER_SECOND);
  private readonly stiffnessUniform = uniform(DEFAULT_CAPE_PHYSICS_SETTINGS.stiffness);
  private readonly dampingUniform = uniform(DEFAULT_CAPE_PHYSICS_SETTINGS.damping);
  private readonly weightUniform = uniform(DEFAULT_CAPE_PHYSICS_SETTINGS.weight);
  private readonly activeCapeCountUniform = uniform(1, 'uint');
  private readonly dynamicsValues = Array.from(
    { length: MAXIMUM_GPU_CAPES },
    () => new THREE.Vector4(),
  );
  private readonly anchorStateValues = Array.from(
    { length: MAXIMUM_GPU_CAPES },
    () => new THREE.Vector4(),
  );
  private readonly anchorValues = Array.from(
    { length: CAPE.columns * MAXIMUM_GPU_CAPES },
    () => new THREE.Vector4(),
  );
  private readonly bodyStateValues = Array.from(
    { length: MAXIMUM_GPU_CAPES },
    () => new THREE.Vector4(0, 0, 1, 0),
  );
  private readonly worldCountValues = Array.from(
    { length: MAXIMUM_GPU_CAPES },
    () => new THREE.Vector4(),
  );
  private readonly dynamicsUniform = uniformArray(this.dynamicsValues, 'vec4' as const);
  private readonly anchorStateUniform = uniformArray(this.anchorStateValues, 'vec4' as const);
  private readonly anchorUniform = uniformArray(this.anchorValues, 'vec4' as const);
  private readonly bodyStateUniform = uniformArray(this.bodyStateValues, 'vec4' as const);
  private readonly worldCountUniform = uniformArray(this.worldCountValues, 'vec4' as const);
  private readonly projectionResources: GpuCapeProjectionResources;
  private readonly computeSequence: THREE.ComputeNode[];
  private readonly profileNoOpKernel: THREE.ComputeNode;
  private readonly profileProjectionKernels: readonly THREE.ComputeNode[];
  private readonly anchorCenter = new THREE.Vector3();
  private readonly anchorTarget = new THREE.Vector3();
  private readonly worldCandidateCenters = Array.from(
    { length: MAXIMUM_GPU_CAPES },
    () => new THREE.Vector3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    ),
  );
  private readonly worldColliderSources: (readonly WorldCollider[] | null)[] = Array.from(
    { length: MAXIMUM_GPU_CAPES },
    () => null,
  );
  private readonly idleDrapeRecoverySeconds = new Float32Array(MAXIMUM_GPU_CAPES);
  private readonly lastAnchors: CapeAnchors[] = [];
  private activeCapeCount = 1;
  private worldContactsLastStep = 0;
  private worldContactEvents = 0;
  private submittedSteps = 0;
  private settings: CapePhysicsSettings;

  public constructor(
    renderer: THREE.WebGPURenderer,
    initialAnchors: CapeAnchors,
    settings: Partial<CapePhysicsSettings> = {},
    appearance: CapeFabricPalette = CRIMSON_CAPE_PALETTE,
  ) {
    this.renderer = renderer;
    this.settings = normalizeCapePhysicsSettings(settings);
    this.applySettingsUniforms();
    this.diagnosticMirror = new CapeSimulation(initialAnchors, this.settings, appearance);

    const initialState = createPackedCapeInitialState(initialAnchors, this.settings);
    const packedInitialState = new Float32Array(PACKED_PARTICLE_COUNT * 4);
    for (let capeIndex = 0; capeIndex < MAXIMUM_GPU_CAPES; capeIndex += 1) {
      packedInitialState.set(initialState, capeIndex * PARTICLE_COUNT * 4);
    }
    this.positionBuffer = instancedArray(packedInitialState.slice(), 'vec4');
    this.scratchBuffer = instancedArray(packedInitialState.slice(), 'vec4');
    this.previousBuffer = instancedArray(packedInitialState.slice(), 'vec4');
    this.predictedVerticalBuffer = instancedArray(PACKED_PARTICLE_COUNT, 'float');
    this.materialContactFlagBuffer = instancedArray(MAXIMUM_GPU_CAPES, 'uint').toAtomic();
    const topology = createGpuCapeTopology(initialState);
    this.topologyBuffer = instancedArray(topology.packed, 'vec4');
    this.constraintBuffer = instancedArray(topology.orderedConstraints, 'vec4');
    this.constraintCount = topology.orderedConstraints.length / 4;
    this.bodyBuffer = instancedArray(
      MAXIMUM_GPU_CAPES * MAX_BODY_COLLIDERS * BODY_BUFFER_STRIDE,
      'vec4',
    );
    const caveSamples = getCaveShellSampleData();
    const packedCaveSamples = new Float32Array(caveSamples.x.length * 2);
    for (let index = 0; index < caveSamples.x.length; index += 1) {
      packedCaveSamples[index * 2] = caveSamples.x[index] ?? 0;
      packedCaveSamples[index * 2 + 1] = caveSamples.y[index] ?? 0;
    }
    this.caveShellBuffer = instancedArray(packedCaveSamples, 'vec2');
    this.worldSphereBuffer = instancedArray(
      MAXIMUM_GPU_CAPES * MAX_WORLD_SPHERES,
      'vec4',
    );
    this.rockBuffer = instancedArray(
      MAXIMUM_GPU_CAPES * MAX_WORLD_ROCKS * ROCK_BUFFER_STRIDE,
      'vec4',
    );
    this.updateAnchorValues(0, initialAnchors);
    this.lastAnchors.push(cloneCapeAnchors(initialAnchors));

    const reconciliationResources = {
      activeCapeCountUniform: this.activeCapeCountUniform,
      materialContactFlagBuffer: this.materialContactFlagBuffer,
      positionBuffer: this.positionBuffer,
      predictedVerticalBuffer: this.predictedVerticalBuffer,
      previousBuffer: this.previousBuffer,
      packedParticleCount: PACKED_PARTICLE_COUNT,
      particleCount: PARTICLE_COUNT,
      maximumCapeCount: MAXIMUM_GPU_CAPES,
    };
    const predictionResources = {
      activeCapeCountUniform: this.activeCapeCountUniform,
      anchorStateUniform: this.anchorStateUniform,
      anchorUniform: this.anchorUniform,
      dampingUniform: this.dampingUniform,
      deltaTimeUniform: this.deltaTimeUniform,
      dragPerSecondUniform: this.dragPerSecondUniform,
      dynamicsUniform: this.dynamicsUniform,
      positionBuffer: this.positionBuffer,
      predictedVerticalBuffer: this.predictedVerticalBuffer,
      previousBuffer: this.previousBuffer,
      scratchBuffer: this.scratchBuffer,
      timeUniform: this.timeUniform,
      topologyBuffer: this.topologyBuffer,
      weightUniform: this.weightUniform,
      maximumCapeCount: MAXIMUM_GPU_CAPES,
      packedParticleCount: PACKED_PARTICLE_COUNT,
      particleCount: PARTICLE_COUNT,
    };
    const constraintResources = {
      activeCapeCountUniform: this.activeCapeCountUniform,
      anchorUniform: this.anchorUniform,
      constraintBuffer: this.constraintBuffer,
      previousBuffer: this.previousBuffer,
      stiffnessUniform: this.stiffnessUniform,
      topologyBuffer: this.topologyBuffer,
      constraintCount: this.constraintCount,
      packedParticleCount: PACKED_PARTICLE_COUNT,
      particleCount: PARTICLE_COUNT,
    };
    const virtualBodyContactResources = {
      anchorStateUniform: this.anchorStateUniform,
      bodyBuffer: this.bodyBuffer,
      bodyStateUniform: this.bodyStateUniform,
      materialContactFlagBuffer: this.materialContactFlagBuffer,
      positionBuffer: this.positionBuffer,
      previousBuffer: this.previousBuffer,
      particleCount: PARTICLE_COUNT,
    };
    const rockFaceResources = {
      caveShellBuffer: this.caveShellBuffer,
      materialContactFlagBuffer: this.materialContactFlagBuffer,
      positionBuffer: this.positionBuffer,
      previousBuffer: this.previousBuffer,
      rockBuffer: this.rockBuffer,
      worldCountUniform: this.worldCountUniform,
      worldSphereBuffer: this.worldSphereBuffer,
      particleCount: PARTICLE_COUNT,
    };
    this.projectionResources = {
      anchorStateUniform: this.anchorStateUniform,
      bodyBuffer: this.bodyBuffer,
      bodyStateUniform: this.bodyStateUniform,
      caveShellBuffer: this.caveShellBuffer,
      materialContactFlagBuffer: this.materialContactFlagBuffer,
      positionBuffer: this.positionBuffer,
      previousBuffer: this.previousBuffer,
      rockBuffer: this.rockBuffer,
      topologyBuffer: this.topologyBuffer,
      worldCountUniform: this.worldCountUniform,
      worldSphereBuffer: this.worldSphereBuffer,
      particleCount: PARTICLE_COUNT,
    };
    const resetMaterialContactFlags = createGpuCapeMaterialContactFlagResetKernel(
      reconciliationResources,
    );
    const predict = createGpuCapePredictionKernel(predictionResources);
    const recoverIdleDrape = createGpuCapeIdleDrapeRecoveryKernel(predictionResources);
    const constrainPosition = createGpuCapeConstraintKernel(
      constraintResources,
      this.positionBuffer,
      'Cape constrain position',
      true,
      true,
    );
    const constrainScratch = createGpuCapeConstraintKernel(
      constraintResources,
      this.scratchBuffer,
      'Cape constrain scratch',
      true,
      true,
    );
    const scratchToPosition = this.createProjectionKernel(
      this.scratchBuffer,
      this.positionBuffer,
      false,
      'Cape project scratch to position',
      false,
      true,
    );
    const positionToScratch = this.createProjectionKernel(
      this.positionBuffer,
      this.scratchBuffer,
      false,
      'Cape project position to scratch',
      false,
      true,
    );
    const hardScratchToPosition = this.createProjectionKernel(
      this.scratchBuffer,
      this.positionBuffer,
      true,
      'Cape reconcile scratch to position',
      false,
      true,
    );
    const hardPositionToScratch = this.createProjectionKernel(
      this.positionBuffer,
      this.scratchBuffer,
      true,
      'Cape reconcile position to scratch',
      false,
      true,
    );
    const finalSelfPositionToScratch = this.createProjectionKernel(
      this.positionBuffer,
      this.scratchBuffer,
      false,
      'Cape final self separation',
      true,
      false,
    );
    const finalContactScratchToPosition = this.createProjectionKernel(
      this.scratchBuffer,
      this.positionBuffer,
      true,
      'Cape final contact reconciliation',
      false,
      true,
    );
    // Animated character contact stays particle-to-capsule inside the
    // projection kernels. A single final virtual-particle pass covers the
    // triangle interiors only when all three real vertices are clear.
    const positionVirtualBodyContacts = this.createFaceSweepKernel(
      createGpuCapeVirtualBodyContactColorFunction(
        virtualBodyContactResources,
        this.positionBuffer,
        'Position',
      ),
      'Cape virtual body contacts',
    );
    const positionRockFaces = this.createFaceSweepKernel(
      createGpuCapeRockFaceColorFunction(
        rockFaceResources,
        this.positionBuffer,
        'Position',
        false,
        true,
      ),
      'Cape rock faces in position',
    );
    const positionSweptRockFaces = this.createFaceSweepKernel(
      createGpuCapeRockFaceColorFunction(
        rockFaceResources,
        this.positionBuffer,
        'PositionSwept',
        true,
      ),
      'Cape swept rock faces in position',
    );
    const scratchRockFaces = this.createFaceSweepKernel(
      createGpuCapeRockFaceColorFunction(rockFaceResources, this.scratchBuffer, 'Scratch'),
      'Cape rock faces in scratch',
    );
    const reconcileBodyContactVelocity = createGpuCapeBodyContactReconciliationKernel(
      reconciliationResources,
    );
    const reconcileProjectionVerticalVelocity =
      createGpuCapeProjectionVerticalVelocityReconciliationKernel(
        reconciliationResources,
      );

    // The top-down structural wavefront can keep loading a sustained boulder
    // contact through the reconciliation passes. Finish with one race-free
    // face sweep in the authoritative render buffer so no later constraint can
    // push a cloth triangle back through the rock clearance.
    this.computeSequence = createGpuCapeDispatchSchedule({
      resetMaterialContactFlags,
      predict,
      recoverIdleDrape,
      constrainPosition,
      constrainScratch,
      scratchToPosition,
      positionToScratch,
      hardScratchToPosition,
      hardPositionToScratch,
      finalSelfPositionToScratch,
      finalContactScratchToPosition,
      positionVirtualBodyContacts,
      positionRockFaces,
      positionSweptRockFaces,
      scratchRockFaces,
      reconcileBodyContactVelocity,
      reconcileProjectionVerticalVelocity,
    }, CAPE.solverIterations);
    this.profileNoOpKernel = Fn(() => {})()
      .compute(PACKED_PARTICLE_COUNT, [PARTICLE_COUNT])
      .setName('Cape profile no-op');
    this.profileProjectionKernels = [
      this.createProjectionFeatureKernel(false, true, 'Cape profile contacts and fold', true),
      this.createProjectionFeatureKernel(false, false, 'Cape profile fold only', true),
      this.createProjectionFeatureKernel(false, false, 'Cape profile copy only', false),
      createGpuCapeConstraintKernel(
        constraintResources,
        this.scratchBuffer,
        'Cape profile colored constraints self and fold',
        true,
        true,
      ),
      createGpuCapeConstraintKernel(
        constraintResources,
        this.scratchBuffer,
        'Cape profile colored constraints and fold',
        false,
        true,
      ),
    ];

    const geometry = this.diagnosticMirror.mesh.geometry;
    this.diagnosticMirror.disposeMaterial();
    geometry.setAttribute(
      'capeNormalNeighbors',
      new THREE.Uint32BufferAttribute(topology.normalNeighbors, 4),
    );
    const textures = createCapeFabricTextures(256, appearance);
    textures.color.repeat.set(1, 1);
    textures.normal.repeat.set(1, 1);
    textures.roughness.repeat.set(1, 1);
    const material = new THREE.MeshPhysicalNodeMaterial({
      map: textures.color,
      normalMap: textures.normal,
      normalScale: new THREE.Vector2(0.48, 0.48),
      roughnessMap: textures.roughness,
      roughness: 0.78,
      metalness: 0.01,
      sheen: 0.92,
      sheenColor: new THREE.Color(appearance.sheenColor),
      sheenRoughness: 0.72,
      clearcoat: 0.04,
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: true,
    });
    material.name = `GPU ${appearance.materialName.toLowerCase()}`;
    material.positionNode = Fn(({ material: materialContext }) => {
      const position = this.positionBuffer.element(vertexIndex).xyz.toVar();
      const neighbors = attribute<'uvec4'>('capeNormalNeighbors', 'uvec4');
      const left = this.positionBuffer.element(neighbors.x).xyz;
      const right = this.positionBuffer.element(neighbors.y).xyz;
      const up = this.positionBuffer.element(neighbors.z).xyz;
      const down = this.positionBuffer.element(neighbors.w).xyz;
      // Geometry indices wind (down, right), so the dynamic normal must use
      // the same order before the standard double-sided correction.
      const normal = cross(down.sub(up), right.sub(left)).normalize();
      (materialContext as THREE.MeshPhysicalNodeMaterial).normalNode = negateOnBackSide(
        transformNormalToView(normal).toVarying(),
      );
      return position;
    })();

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = 'WebGPU compute cape';
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;

    const botGeometry = geometry.clone();
    const botTextures = createCapeFabricTextures(256, BOT_CYAN_CAPE_PALETTE);
    botTextures.color.repeat.set(1, 1);
    botTextures.normal.repeat.set(1, 1);
    botTextures.roughness.repeat.set(1, 1);
    const botMaterial = new THREE.MeshPhysicalNodeMaterial({
      map: botTextures.color,
      normalMap: botTextures.normal,
      normalScale: new THREE.Vector2(0.48, 0.48),
      roughnessMap: botTextures.roughness,
      roughness: 0.78,
      metalness: 0.01,
      sheen: 0.92,
      sheenColor: new THREE.Color(BOT_CYAN_CAPE_PALETTE.sheenColor),
      sheenRoughness: 0.72,
      clearcoat: 0.04,
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: true,
    });
    botMaterial.name = 'GPU woven cyan bot capes';
    botMaterial.positionNode = Fn(({ material: materialContext }) => {
      const capeBase = instanceIndex.add(uint(1)).mul(uint(PARTICLE_COUNT));
      const packedVertex = capeBase.add(vertexIndex);
      const position = this.positionBuffer.element(packedVertex).xyz.toVar();
      const neighbors = attribute<'uvec4'>('capeNormalNeighbors', 'uvec4');
      const left = this.positionBuffer.element(capeBase.add(neighbors.x)).xyz;
      const right = this.positionBuffer.element(capeBase.add(neighbors.y)).xyz;
      const up = this.positionBuffer.element(capeBase.add(neighbors.z)).xyz;
      const down = this.positionBuffer.element(capeBase.add(neighbors.w)).xyz;
      const normal = cross(down.sub(up), right.sub(left)).normalize();
      (materialContext as THREE.MeshPhysicalNodeMaterial).normalNode = negateOnBackSide(
        transformNormalToView(normal).toVarying(),
      );
      return position;
    })();
    this.botMesh = new THREE.InstancedMesh(
      botGeometry,
      botMaterial,
      MAXIMUM_GPU_CAPES - 1,
    );
    this.botMesh.name = 'WebGPU packed compute bot capes';
    this.botMesh.count = 0;
    this.botMesh.castShadow = true;
    this.botMesh.receiveShadow = true;
    this.botMesh.frustumCulled = false;
    const identity = new THREE.Matrix4();
    for (let index = 0; index < MAXIMUM_GPU_CAPES - 1; index += 1) {
      this.botMesh.setMatrixAt(index, identity);
    }
    this.botMesh.instanceMatrix.needsUpdate = true;
  }

  public step(
    deltaTime: number,
    anchors: CapeAnchors,
    bodyColliders: readonly CapsuleCollider[],
    worldColliders: readonly WorldCollider[],
    characterVelocity: THREE.Vector3,
    time: number,
  ): void {
    this.renderer.compute(this.prepareStep(
      deltaTime,
      anchors,
      bodyColliders,
      worldColliders,
      characterVelocity,
      time,
    ));
  }

  /** Updates the player lane without opening a compute pass. */
  public prepareStep(
    deltaTime: number,
    anchors: CapeAnchors,
    bodyColliders: readonly CapsuleCollider[],
    worldColliders: readonly WorldCollider[],
    characterVelocity: THREE.Vector3,
    time: number,
  ): THREE.ComputeNode[] {
    return this.prepareBatchStep(deltaTime, [{
      anchors,
      bodyColliders,
      characterVelocity,
    }], worldColliders, time);
  }

  /** Unique production kernels for asynchronous startup compilation. */
  public getComputePipelineNodes(): THREE.ComputeNode[] {
    return [...new Set(this.computeSequence)];
  }

  /**
   * Updates every active cape lane while retaining one precompiled compute
   * graph. One workgroup handles one cape, so bot activation never constructs
   * shaders or adds dispatches.
   */
  public prepareBatchStep(
    deltaTime: number,
    inputs: readonly GpuCapeStepInput[],
    worldColliders: readonly WorldCollider[],
    time: number,
  ): THREE.ComputeNode[] {
    if (inputs.length < 1 || inputs.length > MAXIMUM_GPU_CAPES) {
      throw new RangeError(`GPU cape batch supports 1-${MAXIMUM_GPU_CAPES} capes.`);
    }
    for (let capeIndex = this.activeCapeCount; capeIndex < inputs.length; capeIndex += 1) {
      this.initializeCapeLane(capeIndex, inputs[capeIndex]!.anchors);
    }
    this.activeCapeCount = inputs.length;
    this.activeCapeCountUniform.value = inputs.length;
    this.botMesh.count = inputs.length - 1;
    this.deltaTimeUniform.value = deltaTime;
    this.timeUniform.value = time;
    this.dragPerSecondUniform.value = CAPE_DRAG_PER_SECOND;
    inputs.forEach((input, capeIndex) => {
      const dynamics = this.dynamicsValues[capeIndex]!;
      const characterSpeed = prepareGpuCapeDynamics(
        dynamics,
        input.characterVelocity,
        time,
      );
      if (characterSpeed > WAKE_SPEED) this.idleDrapeRecoverySeconds[capeIndex] = 0;
      else this.idleDrapeRecoverySeconds[capeIndex]! += deltaTime;
      this.updateAnchorValues(capeIndex, input.anchors);
      this.anchorStateValues[capeIndex]!.w = THREE.MathUtils.smoothstep(
        this.idleDrapeRecoverySeconds[capeIndex]!,
        IDLE_DRAPE_RECOVERY_DELAY_SECONDS,
        IDLE_DRAPE_RECOVERY_DELAY_SECONDS + IDLE_DRAPE_RECOVERY_RAMP_SECONDS,
      );
      this.updateBodyBuffers(capeIndex, input.bodyColliders, input.anchors.back);
      this.updateWorldBuffers(capeIndex, worldColliders);
      this.lastAnchors[capeIndex] = cloneCapeAnchors(input.anchors);
    });
    this.submittedSteps += 1;
    return this.computeSequence.slice();
  }

  /** GPU rendering consumes the position storage buffer directly. */
  public syncGeometry(): void {}

  public reset(anchors: CapeAnchors): void {
    this.diagnosticMirror.reset(anchors);
    this.initializeCapeLane(0, anchors);
    this.activeCapeCount = 1;
    this.activeCapeCountUniform.value = 1;
    this.submittedSteps = 0;
    this.idleDrapeRecoverySeconds.fill(0);
    this.anchorStateValues.forEach((value) => { value.w = 0; });
    this.worldContactsLastStep = 0;
  }

  public updateSettings(
    settings: Partial<CapePhysicsSettings>,
    anchors: CapeAnchors,
  ): void {
    const next = normalizeCapePhysicsSettings(settings);
    const dimensionsChanged = next.length !== this.settings.length
      || next.width !== this.settings.width;
    this.settings = next;
    this.applySettingsUniforms();
    this.diagnosticMirror.updateSettings(next, anchors);
    if (!dimensionsChanged) return;

    const state = createPackedCapeInitialState(anchors, this.settings);
    const topology = createGpuCapeTopology(state);
    for (let capeIndex = 0; capeIndex < this.activeCapeCount; capeIndex += 1) {
      this.initializeCapeLane(capeIndex, this.lastAnchors[capeIndex] ?? anchors);
    }
    this.writeStorage(this.topologyBuffer.value, topology.packed);
    this.writeStorage(this.constraintBuffer.value, topology.orderedConstraints);
    this.submittedSteps = 0;
    this.idleDrapeRecoverySeconds.fill(0);
    this.anchorStateValues.forEach((value) => { value.w = 0; });
    this.worldContactsLastStep = 0;
  }

  public getSettings(): CapePhysicsSettings {
    return { ...this.settings };
  }

  public setOpacity(_opacity: number): void {}

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.map?.dispose();
    this.mesh.material.normalMap?.dispose();
    this.mesh.material.roughnessMap?.dispose();
    this.mesh.material.dispose();
    this.botMesh.geometry.dispose();
    this.botMesh.material.map?.dispose();
    this.botMesh.material.normalMap?.dispose();
    this.botMesh.material.roughnessMap?.dispose();
    this.botMesh.material.dispose();
  }

  public async refreshDiagnostics(): Promise<void> {
    if (this.submittedSteps === 0) return;
    const [positions, previous] = await Promise.all([
      this.renderer.getArrayBufferAsync(this.positionBuffer.value),
      this.renderer.getArrayBufferAsync(this.previousBuffer.value),
    ]);
    const positionData = new Float32Array(positions);

    this.diagnosticMirror.overwriteStateFromGpu(positionData, new Float32Array(previous));
    // The position state lane stores body-contact work during a GPU step; it
    // is not a world-contact counter. World contact totals remain unavailable
    // without adding a readback-only storage binding to the hot compute path.
    this.worldContactsLastStep = 0;
  }

  /**
   * Local GPU-harness readback for every active packed lane. Production never
   * calls this; it exists so batch correctness is verified from GPU state
   * instead of inferred from source text or screenshots.
   */
  public async readBatchStateForHarness(): Promise<readonly GpuCapeBatchHarnessState[]> {
    const positions = new Float32Array(
      await this.renderer.getArrayBufferAsync(this.positionBuffer.value),
    );
    return Array.from({ length: this.activeCapeCount }, (_, capeIndex) => {
      const anchors = this.lastAnchors[capeIndex];
      if (!anchors) throw new Error(`Missing anchors for GPU cape lane ${capeIndex}.`);
      const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
      const right = anchors.right.clone().sub(anchors.left).normalize();
      const capeBase = capeIndex * PARTICLE_COUNT;
      const particles: number[] = [];
      for (let localIndex = 0; localIndex < PARTICLE_COUNT; localIndex += 1) {
        const offset = (capeBase + localIndex) * 4;
        const particle = new THREE.Vector3(
          positions[offset]!,
          positions[offset + 1]!,
          positions[offset + 2]!,
        ).sub(center);
        particles.push(particle.dot(right), particle.y, particle.dot(anchors.back));
      }
      const leftOffset = capeBase * 4;
      const rightOffset = (capeBase + CAPE.columns - 1) * 4;
      const leftError = new THREE.Vector3(
        positions[leftOffset]!,
        positions[leftOffset + 1]!,
        positions[leftOffset + 2]!,
      ).distanceTo(anchors.left);
      const rightError = new THREE.Vector3(
        positions[rightOffset]!,
        positions[rightOffset + 1]!,
        positions[rightOffset + 2]!,
      ).distanceTo(anchors.right);
      return {
        capeIndex,
        maximumNecklineAttachmentError: Math.max(leftError, rightError),
        particles,
      };
    });
  }

  /** Harness-only state injection; production simulation never performs this upload. */
  public overwriteStateForHarness(
    positionData: Float32Array,
    previousData: Float32Array = positionData,
  ): void {
    if (positionData.length < PARTICLE_COUNT * 4 || previousData.length < PARTICLE_COUNT * 4) {
      throw new RangeError('Harness cape state is smaller than the simulation grid.');
    }
    this.writeStorage(this.positionBuffer.value, positionData);
    this.writeStorage(this.scratchBuffer.value, positionData);
    this.writeStorage(this.previousBuffer.value, previousData);
    this.diagnosticMirror.overwriteStateForHarness(positionData, previousData);
    this.submittedSteps = 0;
    this.idleDrapeRecoverySeconds[0] = 0;
    this.anchorStateValues[0]!.w = 0;
    this.worldContactsLastStep = 0;
  }

  public getParticlePosition(column: number, row: number): THREE.Vector3 {
    return this.diagnosticMirror.getParticlePosition(column, row);
  }

  public getMaximumStructuralError(): number {
    return this.diagnosticMirror.getMaximumStructuralError();
  }

  public getMaximumBodyPenetration(
    bodyColliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): number {
    return this.diagnosticMirror.getMaximumBodyPenetration(bodyColliders, back);
  }

  public getBodyPenetrationDiagnostics(
    bodyColliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ) {
    return this.diagnosticMirror.getBodyPenetrationDiagnostics(bodyColliders, back);
  }

  public getMaximumEnvironmentPenetration(worldColliders: readonly WorldCollider[]): number {
    return this.diagnosticMirror.getMaximumEnvironmentPenetration(worldColliders);
  }

  public getEnvironmentPenetrationDiagnostics(worldColliders: readonly WorldCollider[]) {
    return this.diagnosticMirror.getEnvironmentPenetrationDiagnostics(worldColliders);
  }

  public getMaximumEnvironmentFacePenetration(worldColliders: readonly WorldCollider[]): number {
    return this.diagnosticMirror.getMaximumEnvironmentFacePenetration(worldColliders);
  }

  public getMinimumSelfSeparation(): number {
    return this.diagnosticMirror.getMinimumSelfSeparation();
  }

  public getMaximumUpwardFold(): number {
    return this.diagnosticMirror.getMaximumUpwardFold();
  }

  public getHemDrop(): number {
    return this.diagnosticMirror.getHemDrop();
  }

  public getMinimumLowerCapeDrop(): number {
    return this.diagnosticMirror.getMinimumLowerCapeDrop();
  }

  public getMaximumLowerCapeLateralOffset(anchors: CapeAnchors): number {
    return this.diagnosticMirror.getMaximumLowerCapeLateralOffset(anchors);
  }

  public getMaximumLowerCapeHorizontalOffset(): number {
    return this.diagnosticMirror.getMaximumLowerCapeHorizontalOffset();
  }

  public getAverageLowerCapeSpanRatio(anchors: CapeAnchors): number {
    return this.diagnosticMirror.getAverageLowerCapeSpanRatio(anchors);
  }

  public getCapeRowTwistRange(anchors: CapeAnchors): number {
    return this.diagnosticMirror.getCapeRowTwistRange(anchors);
  }

  public getCapeCenterlineDeviation(): number {
    return this.diagnosticMirror.getCapeCenterlineDeviation();
  }

  public getMaximumLowerCapeRowCurlRatio(anchors: CapeAnchors): number {
    return this.diagnosticMirror.getMaximumLowerCapeRowCurlRatio(anchors);
  }

  public getHemBackOffset(anchors: CapeAnchors): number {
    return this.diagnosticMirror.getHemBackOffset(anchors);
  }

  public getMinimumHemGroundClearance(): number {
    return this.diagnosticMirror.getMinimumHemGroundClearance();
  }

  public getMaximumParticleMotion(): number {
    return this.diagnosticMirror.getMaximumParticleMotion();
  }

  public getMaximumParticleVerticalMotion(): number {
    return this.diagnosticMirror.getMaximumParticleVerticalMotion();
  }

  public getMaximumParticleMotionDiagnostics() {
    return this.diagnosticMirror.getMaximumParticleMotionDiagnostics();
  }

  public isSleeping(): boolean {
    // Unlike the CPU path, the GPU cannot inspect a settled-shape reduction
    // without a readback fence. Keep solving rather than freezing an invalid
    // airborne pose after an arbitrary no-input timeout.
    return false;
  }

  public getWorldContactDiagnostics() {
    return {
      lastStep: this.worldContactsLastStep,
      total: this.worldContactEvents,
    };
  }

  public getPerformanceDiagnostics() {
    return {
      ...this.diagnosticMirror.getPerformanceDiagnostics(),
      implementation: 'webgpu-compute' as const,
      totalSteps: this.submittedSteps,
      activeSteps: this.submittedSteps,
    };
  }

  /**
   * Profiling-only path: isolates every production dispatch in its own timed
   * compute pass. The matching no-op pass estimates fixed pass/dispatch cost.
   */
  public async profileKernelBreakdown(requestedSamples = 4): Promise<GpuCapeKernelProfile> {
    const backend = this.renderer.backend as unknown as KernelTimestampBackend;
    if (backend.trackTimestamp !== true) {
      throw new Error('GPU kernel profiling requires timestamp queries.');
    }
    const samples = THREE.MathUtils.clamp(Math.round(requestedSamples), 1, 16);
    await this.renderer.resolveTimestampsAsync(THREE.TimestampQuery.COMPUTE);
    const kernelDurations = this.computeSequence.map(() => [] as number[]);
    const noOpDurations: number[] = [];
    const pending: { readonly index: number; readonly uid: string }[] = [];
    const pendingNoOps: string[] = [];
    const projectionDurations = this.profileProjectionKernels.map(() => [] as number[]);
    const pendingProjections: { readonly index: number; readonly uid: string }[] = [];

    for (let sample = 0; sample < samples; sample += 1) {
      for (let index = 0; index < this.computeSequence.length; index += 1) {
        const kernel = this.computeSequence[index]!;
        this.renderer.compute(kernel);
        pending.push({ index, uid: backend.getTimestampUID(kernel) });
      }
      this.renderer.compute(this.profileNoOpKernel);
      pendingNoOps.push(backend.getTimestampUID(this.profileNoOpKernel));
      for (let index = 0; index < this.profileProjectionKernels.length; index += 1) {
        const kernel = this.profileProjectionKernels[index]!;
        this.renderer.compute(kernel);
        pendingProjections.push({ index, uid: backend.getTimestampUID(kernel) });
      }
    }
    await this.renderer.resolveTimestampsAsync(THREE.TimestampQuery.COMPUTE);

    for (const measurement of pending) {
      kernelDurations[measurement.index]!.push(backend.getTimestamp(measurement.uid));
    }
    for (const uid of pendingNoOps) noOpDurations.push(backend.getTimestamp(uid));
    for (const measurement of pendingProjections) {
      projectionDurations[measurement.index]!.push(backend.getTimestamp(measurement.uid));
    }

    const average = (values: readonly number[]): number => (
      values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length)
    );
    const noOpMilliseconds = average(noOpDurations);
    const contactProjectionMilliseconds = average(projectionDurations[0]!);
    const foldProjectionMilliseconds = average(projectionDurations[1]!);
    const copyMilliseconds = average(projectionDurations[2]!);
    const fullConstraintMilliseconds = average(projectionDurations[3]!);
    const noSelfConstraintMilliseconds = average(projectionDurations[4]!);
    const kernels = this.computeSequence.map((kernel, index): GpuCapeKernelTiming => {
      const durations = kernelDurations[index]!;
      const averageMilliseconds = average(durations);
      return {
        index,
        name: kernel.name || `Kernel ${index}`,
        averageMilliseconds,
        minimumMilliseconds: Math.min(...durations),
        maximumMilliseconds: Math.max(...durations),
        estimatedArithmeticMilliseconds: Math.max(0, averageMilliseconds - noOpMilliseconds),
      };
    });
    return {
      samples,
      noOpMilliseconds,
      separatePassTotalMilliseconds: kernels.reduce(
        (sum, kernel) => sum + kernel.averageMilliseconds,
        0,
      ),
      estimatedArithmeticTotalMilliseconds: kernels.reduce(
        (sum, kernel) => sum + kernel.estimatedArithmeticMilliseconds,
        0,
      ),
      kernels,
      projectionComponents: {
        fullMilliseconds: contactProjectionMilliseconds + fullConstraintMilliseconds,
        contactsMilliseconds: Math.max(
          0,
          contactProjectionMilliseconds - foldProjectionMilliseconds,
        ),
        selfCollisionMilliseconds: Math.max(
          0,
          fullConstraintMilliseconds - noSelfConstraintMilliseconds,
        ),
        constraintsAndFoldMilliseconds:
          Math.max(0, foldProjectionMilliseconds - copyMilliseconds)
          + Math.max(0, noSelfConstraintMilliseconds - noOpMilliseconds),
      },
    };
  }

  public getClosestActiveRockSurfaceContact(worldColliders?: readonly WorldCollider[]) {
    return this.diagnosticMirror.getClosestActiveRockSurfaceContact(
      worldColliders ?? this.worldColliderSources[0] ?? [],
    );
  }



  private createProjectionKernel(
    source: typeof this.positionBuffer,
    target: typeof this.positionBuffer,
    hardRockRecovery: boolean,
    name: string,
    includeSelfCollision = true,
    includeContacts = true,
  ): THREE.ComputeNode {
    // Fold, row-span, and row-curl guards belong to the authored solver
    // iteration in createConstraintKernel. Contact/copy dispatches must not
    // solve them again: the duplicate cadence suppressed travelling waves.
    const project = createGpuCapeProjectionFunction(
      this.projectionResources,
      source,
      target,
      name.replaceAll(' ', ''),
      includeSelfCollision,
      includeContacts,
      false,
    );
    return Fn(() => {
      const capeIndex = instanceIndex.div(uint(PARTICLE_COUNT));
      If(capeIndex.lessThan(this.activeCapeCountUniform), () => {
        const passResult = float(0).toVar('projectionPassResult');
        passResult.assign(project(instanceIndex, bool(hardRockRecovery)));
      });
    })().compute(PACKED_PARTICLE_COUNT).setName(name);
  }

  private createProjectionFeatureKernel(
    includeSelfCollision: boolean,
    includeContacts: boolean,
    name: string,
    includeFoldGuard = true,
  ): THREE.ComputeNode {
    const project = createGpuCapeProjectionFunction(
      this.projectionResources,
      this.positionBuffer,
      this.scratchBuffer,
      name.replaceAll(' ', ''),
      includeSelfCollision,
      includeContacts,
      includeFoldGuard,
    );
    return Fn(() => {
      const capeIndex = instanceIndex.div(uint(PARTICLE_COUNT));
      If(capeIndex.lessThan(this.activeCapeCountUniform), () => {
        const passResult = float(0).toVar('profileProjectionPassResult');
        passResult.assign(project(instanceIndex, bool(false)));
      });
    })().compute(PACKED_PARTICLE_COUNT).setName(name);
  }

  private createFaceSweepKernel(
    colorPass: ReturnType<typeof createGpuCapeRockFaceColorFunction>,
    name: string,
  ): THREE.ComputeNode {
    return Fn(() => {
      const capeIndex = workgroupId.x;
      const triangleSlot = localId.x;
      If(capeIndex.lessThan(this.activeCapeCountUniform), () => {
        const passResult = float(0).toVar('faceSweepResult');
        for (let color = 0; color < 8; color += 1) {
          // Built-in invocation IDs are scoped to the compute entry point.
          // Pass the slot explicitly so TSL does not emit an unresolved
          // `localId` reference inside the generated helper function.
          passResult.assign(colorPass(uint(color), triangleSlot, capeIndex));
          storageBarrier();
        }
      });
    })().compute(PACKED_PARTICLE_COUNT, [PARTICLE_COUNT]).setName(name);
  }


  private updateAnchorValues(capeIndex: number, anchors: CapeAnchors): void {
    const center = packGpuCapeAnchors(
      this.anchorStateValues,
      this.anchorValues,
      capeIndex,
      anchors,
      this.anchorTarget,
    );
    if (capeIndex === 0) {
      this.anchorCenter.set(center.x, center.y, center.z);
      this.diagnosticMirror.synchronizeAnchorDiagnostics(anchors);
    }
  }

  private writeStorage(attribute: THREE.BufferAttribute, state: Float32Array): void {
    (attribute.array as Float32Array).set(state);
    attribute.needsUpdate = true;
  }

  private initializeCapeLane(capeIndex: number, anchors: CapeAnchors): void {
    const state = createPackedCapeInitialState(anchors, this.settings);
    const offset = capeIndex * PARTICLE_COUNT * 4;
    for (const attribute of [
      this.positionBuffer.value,
      this.scratchBuffer.value,
      this.previousBuffer.value,
    ]) {
      (attribute.array as Float32Array).set(state, offset);
      attribute.needsUpdate = true;
    }
    this.updateAnchorValues(capeIndex, anchors);
    this.lastAnchors[capeIndex] = cloneCapeAnchors(anchors);
    this.idleDrapeRecoverySeconds[capeIndex] = 0;
    this.anchorStateValues[capeIndex]!.w = 0;
    this.worldColliderSources[capeIndex] = null;
    this.worldCandidateCenters[capeIndex]!.set(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    );
  }

  private applySettingsUniforms(): void {
    this.stiffnessUniform.value = this.settings.stiffness;
    this.dampingUniform.value = this.settings.damping;
    this.weightUniform.value = this.settings.weight;
  }

  private updateBodyBuffers(
    capeIndex: number,
    colliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): void {
    const bodyData = this.bodyBuffer.value.array as Float32Array;
    packGpuCapeBodyColliders(bodyData, capeIndex, colliders, back);
    this.bodyStateValues[capeIndex]!.set(back.x, back.y, back.z, colliders.length);
    this.bodyBuffer.value.needsUpdate = true;
  }

  private updateWorldBuffers(capeIndex: number, colliders: readonly WorldCollider[]): void {
    const centerState = this.anchorStateValues[capeIndex]!;
    const center = new THREE.Vector3(centerState.x, centerState.y, centerState.z);
    if (
      this.worldColliderSources[capeIndex] === colliders
      && this.worldCandidateCenters[capeIndex]!.distanceToSquared(center)
        < GPU_WORLD_CANDIDATE_REFRESH_DISTANCE ** 2
    ) return;
    this.worldColliderSources[capeIndex] = colliders;
    this.worldCandidateCenters[capeIndex]!.copy(center);
    const candidates = selectGpuCapeWorldColliderCandidates(center, colliders);
    const sphereData = this.worldSphereBuffer.value.array as Float32Array;
    const rockData = this.rockBuffer.value.array as Float32Array;
    packGpuCapeWorldColliders(sphereData, rockData, capeIndex, candidates);
    this.worldCountValues[capeIndex]!.set(
      candidates.spheres.length,
      candidates.rocks.length,
      0,
      0,
    );
    this.worldSphereBuffer.value.needsUpdate = true;
    this.rockBuffer.value.needsUpdate = true;
  }
}
