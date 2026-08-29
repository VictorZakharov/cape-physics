import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  Return,
  attribute,
  bool,
  cross,
  float,
  instancedArray,
  instanceIndex,
  mix,
  negateOnBackSide,
  select,
  smoothstep,
  storageBarrier,
  transformNormalToView,
  uint,
  uniform,
  vec3,
  vec4,
  vertexIndex,
} from 'three/tsl';
import { CAPE, CAVE, PLAYER } from '../config';
import { createCapeFabricTextures } from '../graphics/proceduralTextures';
import type { CapeAnchors } from '../player/Character';
import {
  isWorldRockCollider,
  type CapsuleCollider,
  type WorldCollider,
} from './colliders';
import { CAPE_FLUTTER_ACCELERATION } from './CapeAerodynamics';
import { CapeSimulation } from './CapeSimulation';
import {
  CAPE_ROW_CURL_RELAXATION,
  CAPE_ROW_SPAN_RELAXATION,
  MAXIMUM_CAPE_ROW_CURL_RATIO,
  MINIMUM_CAPE_ROW_SPAN_RATIO,
} from './CapeRestShape';
import { getClothBodyClearance, getClothBodyDepthRadius } from './ClothBodyCollision';
import { FOLD_RELAXATION, MAXIMUM_LOCAL_UPWARD_FOLD } from './ClothFoldGuard';
import { CLOTH_THICKNESS } from './ClothSelfCollision';
import {
  CLOTH_ROCK_CLEARANCE,
  CLOTH_WORLD_CLEARANCE,
  getClothWorldClearance,
} from './ClothWorldCollision';
import {
  DEFAULT_CAPE_PHYSICS_SETTINGS,
  normalizeCapePhysicsSettings,
  type CapePhysicsSettings,
} from './CapeSettings';
import {
  calculateGpuCapeSphereQueryRadius,
  GPU_WORLD_CANDIDATE_REFRESH_DISTANCE,
} from './GpuCapeBroadphase';
import {
  CAVE_SHELL_CONTACT_SKIN,
  getCaveShellSampleData,
  WATER_BASINS,
} from '../world/caveProfile';

interface ConstraintDefinition {
  readonly first: number;
  readonly second: number;
  readonly restLength: number;
  readonly stiffness: number;
}

interface ColoredConstraintRange {
  readonly offset: number;
  readonly count: number;
}

interface KernelTimestampBackend {
  readonly trackTimestamp?: boolean;
  getTimestampUID(context: THREE.ComputeNode): string;
  getTimestamp(uid: string): number;
}

export interface GpuCapeKernelTiming {
  readonly index: number;
  readonly name: string;
  readonly averageMilliseconds: number;
  readonly minimumMilliseconds: number;
  readonly maximumMilliseconds: number;
  readonly estimatedArithmeticMilliseconds: number;
}

export interface GpuCapeKernelProfile {
  readonly samples: number;
  readonly noOpMilliseconds: number;
  readonly separatePassTotalMilliseconds: number;
  readonly estimatedArithmeticTotalMilliseconds: number;
  readonly kernels: readonly GpuCapeKernelTiming[];
  readonly projectionComponents: {
    readonly fullMilliseconds: number;
    readonly contactsMilliseconds: number;
    readonly selfCollisionMilliseconds: number;
    readonly constraintsAndFoldMilliseconds: number;
  };
}

const PARTICLE_COUNT = CAPE.columns * CAPE.rows;
const ACTIVE_DRAG_PER_SECOND = 2.05;
const IDLE_DRAG_PER_SECOND = 2.8;
// A graph-colored sweep resolves overlapping lengthwise bend links much more
// completely than the serial WebGL sweep. Relax only those non-structural
// links so both solvers retain the same authored flex; structural constraints,
// collision projection, and the user stiffness multiplier remain unchanged.
const GPU_LENGTHWISE_BEND_RELAXATION = 0.12;
// Graph-colored projection dissipates more of the neckline's braking inertia
// than WebGL's ordered sweep. Filter only the controller's measured planar
// deceleration into the normal Verlet prediction; no cape position or target
// pose is selected at the walking/idle boundary.
const GPU_BRAKING_VELOCITY_TRANSFER = 18.5;
const GPU_BRAKING_VELOCITY_RESPONSE_PER_SECOND = 40;
const WAKE_SPEED = 0.08;
const MAX_BODY_COLLIDERS = 32;
const MAX_WORLD_SPHERES = 512;
const MAX_WORLD_ROCKS = 16;
const ROCK_FACES_PER_COLLIDER = 60;
const MAXIMUM_CONTINUOUS_ROCK_SWEEP = 0.08;
const ROCK_SWEEP_SURFACE_OFFSET = 0.001;
const ROCK_SWEEP_TANGENTIAL_DAMPING = 0.76;
const BODY_BUFFER_STRIDE = 5;
const ROCK_BUFFER_STRIDE = 4 + ROCK_FACES_PER_COLLIDER * 4;
const TOPOLOGY_METADATA_STRIDE = 2;
// A particle cannot travel farther from the neckline than the cape's maximum
// length plus half its width. Include one full refresh interval so a static
// collider cannot enter reach before the next candidate-buffer update. The
// helper also retains adjacent formation clusters for simultaneous contacts.
const WORLD_SPHERE_QUERY_RADIUS = calculateGpuCapeSphereQueryRadius(
  CAPE.lengthRange.max,
  CAPE.widthRange.max,
);
// Exact rock faces can pin the cape between adjacent formations, so retain
// the wider legacy rock set while culling the much larger sphere-proxy set.
const WORLD_ROCK_QUERY_RADIUS = CAPE.lengthRange.max + 2.2;
const CAVE_LOWER_RADIAL_START = Math.floor(CAVE.radialSegments / 2);

/**
 * WebGPU cape path. Particle state never leaves storage buffers while the
 * game is running; readback is reserved for explicit harness diagnostics.
 *
 * Distance, self-collision, and fold constraints use race-free pair colors.
 * They apply the same shared PBD rules as WebGL while keeping the performance
 * benefit of a parallel GPU sweep. Movement affects only authored forces;
 * projection never selects or steers toward a locomotion-specific shape.
 */
export class GpuCapeSimulation {
  public readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalNodeMaterial>;
  private readonly diagnosticMirror: CapeSimulation;
  private readonly renderer: THREE.WebGPURenderer;
  private readonly positionBuffer;
  private readonly scratchBuffer;
  private readonly previousBuffer;
  private readonly anchorBuffer;
  private readonly topologyBuffer;
  private readonly constraintBuffer;
  private readonly coloredConstraintRanges: readonly ColoredConstraintRange[];
  private readonly bodyBuffer;
  private readonly caveShellBuffer;
  private readonly worldSphereBuffer;
  private readonly rockBuffer;
  private readonly deltaTimeUniform = uniform(1 / 120);
  private readonly timeUniform = uniform(0);
  private readonly movementBlendUniform = uniform(0);
  private readonly airflowUniform = uniform(new THREE.Vector3());
  private readonly anchorDisplacementUniform = uniform(new THREE.Vector3());
  private readonly anchorAccelerationDisplacementUniform = uniform(new THREE.Vector3());
  private readonly brakingVelocityCorrectionUniform = uniform(new THREE.Vector3());
  private readonly stiffnessUniform = uniform(DEFAULT_CAPE_PHYSICS_SETTINGS.stiffness);
  private readonly dampingUniform = uniform(DEFAULT_CAPE_PHYSICS_SETTINGS.damping);
  private readonly weightUniform = uniform(DEFAULT_CAPE_PHYSICS_SETTINGS.weight);
  private readonly bodyCountUniform = uniform(0, 'uint');
  private readonly backUniform = uniform(new THREE.Vector3(0, 0, 1));
  private readonly worldSphereCountUniform = uniform(0, 'uint');
  private readonly rockCountUniform = uniform(0, 'uint');
  private readonly computeSequence: THREE.ComputeNode[] = [];
  private readonly profileNoOpKernel: THREE.ComputeNode;
  private readonly profileProjectionKernels: readonly THREE.ComputeNode[];
  private readonly anchorCenter = new THREE.Vector3();
  private readonly anchorDisplacement = new THREE.Vector3();
  private readonly previousAnchorDisplacement = new THREE.Vector3();
  private readonly anchorAccelerationDisplacement = new THREE.Vector3();
  private readonly characterDisplacement = new THREE.Vector3();
  private readonly previousCharacterDisplacement = new THREE.Vector3();
  private readonly characterAccelerationDisplacement = new THREE.Vector3();
  private readonly brakingVelocityCorrection = new THREE.Vector3();
  private readonly brakingVelocityCorrectionTarget = new THREE.Vector3();
  private readonly anchorTarget = new THREE.Vector3();
  private readonly worldCandidateCenter = new THREE.Vector3(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  );
  private worldColliderSource: readonly WorldCollider[] | null = null;
  private worldContactsLastStep = 0;
  private worldContactEvents = 0;
  private worldContactEventOffset = 0;
  private submittedSteps = 0;
  private settings: CapePhysicsSettings;

  public constructor(
    renderer: THREE.WebGPURenderer,
    initialAnchors: CapeAnchors,
    settings: Partial<CapePhysicsSettings> = {},
  ) {
    this.renderer = renderer;
    this.settings = normalizeCapePhysicsSettings(settings);
    this.applySettingsUniforms();
    this.diagnosticMirror = new CapeSimulation(initialAnchors, this.settings);

    const initialState = this.createInitialState();
    this.positionBuffer = instancedArray(initialState.slice(), 'vec4');
    this.scratchBuffer = instancedArray(initialState.slice(), 'vec4');
    this.previousBuffer = instancedArray(initialState.slice(), 'vec4');
    this.anchorBuffer = instancedArray(CAPE.columns, 'vec4');

    const topology = this.createTopology(initialState);
    this.topologyBuffer = instancedArray(topology.packed, 'vec4');
    this.constraintBuffer = instancedArray(topology.coloredConstraints, 'vec4');
    this.coloredConstraintRanges = topology.coloredConstraintRanges;
    this.bodyBuffer = instancedArray(MAX_BODY_COLLIDERS * BODY_BUFFER_STRIDE, 'vec4');
    const caveSamples = getCaveShellSampleData();
    const packedCaveSamples = new Float32Array(caveSamples.x.length * 2);
    for (let index = 0; index < caveSamples.x.length; index += 1) {
      packedCaveSamples[index * 2] = caveSamples.x[index] ?? 0;
      packedCaveSamples[index * 2 + 1] = caveSamples.y[index] ?? 0;
    }
    this.caveShellBuffer = instancedArray(packedCaveSamples, 'vec2');
    this.worldSphereBuffer = instancedArray(MAX_WORLD_SPHERES, 'vec4');
    this.rockBuffer = instancedArray(MAX_WORLD_ROCKS * ROCK_BUFFER_STRIDE, 'vec4');
    this.updateAnchorBuffer(initialAnchors);

    this.computeSequence.push(this.createPredictionKernel());
    const constrainPosition = this.createConstraintKernel(
      this.positionBuffer,
      'Cape constrain position',
      true,
      true,
    );
    const constrainScratch = this.createConstraintKernel(
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
      true,
    );
    const positionToScratch = this.createProjectionKernel(
      this.positionBuffer,
      this.scratchBuffer,
      false,
      'Cape project position to scratch',
      false,
      true,
      true,
    );
    const hardScratchToPosition = this.createProjectionKernel(
      this.scratchBuffer,
      this.positionBuffer,
      true,
      'Cape reconcile scratch to position',
      false,
      true,
      true,
    );
    const hardPositionToScratch = this.createProjectionKernel(
      this.positionBuffer,
      this.scratchBuffer,
      true,
      'Cape reconcile position to scratch',
      false,
      true,
      true,
    );
    const positionBodyFaces = this.createFaceSweepKernel(
      this.createBodyFaceColorFunction(this.positionBuffer, 'Position'),
      'Cape body faces in position',
    );
    const scratchBodyFaces = this.createFaceSweepKernel(
      this.createBodyFaceColorFunction(this.scratchBuffer, 'Scratch'),
      'Cape body faces in scratch',
    );
    const positionRockFaces = this.createFaceSweepKernel(
      this.createRockFaceColorFunction(this.positionBuffer, 'Position', false, true),
      'Cape rock faces in position',
    );
    const positionSweptRockFaces = this.createFaceSweepKernel(
      this.createRockFaceColorFunction(this.positionBuffer, 'PositionSwept', true),
      'Cape swept rock faces in position',
    );
    const scratchRockFaces = this.createFaceSweepKernel(
      this.createRockFaceColorFunction(this.scratchBuffer, 'Scratch'),
      'Cape rock faces in scratch',
    );

    // One workgroup executes race-free pair colors for the same distance,
    // self-collision, and fold constraints used by the CPU/WebGL solver. The
    // following projection pass applies body and environment contacts.
    let currentBufferIsPosition = false;
    for (let iteration = 0; iteration < CAPE.solverIterations; iteration += 1) {
      this.computeSequence.push(
        currentBufferIsPosition ? constrainPosition : constrainScratch,
        currentBufferIsPosition ? positionToScratch : scratchToPosition,
      );
      currentBufferIsPosition = !currentBufferIsPosition;
      if (iteration >= CAPE.solverIterations - 6) {
        this.computeSequence.push(
          currentBufferIsPosition ? positionBodyFaces : scratchBodyFaces,
        );
      }
    }
    for (let reconciliation = 0; reconciliation < 3; reconciliation += 1) {
      this.computeSequence.push(
        currentBufferIsPosition ? hardPositionToScratch : hardScratchToPosition,
      );
      currentBufferIsPosition = !currentBufferIsPosition;
      if (reconciliation > 0) {
        this.computeSequence.push(
          currentBufferIsPosition ? positionBodyFaces : scratchBodyFaces,
        );
      }
      if (reconciliation === 0) {
        this.computeSequence.push(positionSweptRockFaces);
      } else {
        this.computeSequence.push(
          currentBufferIsPosition ? positionRockFaces : scratchRockFaces,
        );
      }
    }
    if (!currentBufferIsPosition) {
      throw new Error('GPU cape projection schedule must finish in the render position buffer.');
    }
    this.profileNoOpKernel = Fn(() => {})()
      .compute(PARTICLE_COUNT, [PARTICLE_COUNT])
      .setName('Cape profile no-op');
    this.profileProjectionKernels = [
      this.createProjectionFeatureKernel(false, true, 'Cape profile contacts and fold', true),
      this.createProjectionFeatureKernel(false, false, 'Cape profile fold only', true),
      this.createProjectionFeatureKernel(false, false, 'Cape profile copy only', false),
      this.createConstraintKernel(
        this.scratchBuffer,
        'Cape profile colored constraints self and fold',
        true,
        true,
      ),
      this.createConstraintKernel(
        this.scratchBuffer,
        'Cape profile colored constraints and fold',
        false,
        true,
      ),
    ];

    const geometry = this.diagnosticMirror.mesh.geometry;
    geometry.setAttribute(
      'capeNormalNeighbors',
      new THREE.Uint32BufferAttribute(topology.normalNeighbors, 4),
    );
    const textures = createCapeFabricTextures();
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
      sheenColor: new THREE.Color(0x6f0713),
      sheenRoughness: 0.72,
      clearcoat: 0.04,
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: true,
    });
    material.name = 'GPU woven crimson cape';
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
  }

  public step(
    deltaTime: number,
    anchors: CapeAnchors,
    bodyColliders: readonly CapsuleCollider[],
    worldColliders: readonly WorldCollider[],
    characterVelocity: THREE.Vector3,
    time: number,
  ): void {
    const characterSpeed = characterVelocity.length();
    const planarSpeed = Math.hypot(characterVelocity.x, characterVelocity.z);
    const movementBlend = THREE.MathUtils.smoothstep(characterSpeed, WAKE_SPEED, 2.4);
    const runningBlend = THREE.MathUtils.smoothstep(
      planarSpeed,
      PLAYER.walkSpeed * 1.02,
      PLAYER.runSpeed * 0.92,
    );
    const locomotionAirflow = THREE.MathUtils.lerp(0.28, 1, runningBlend);
    const velocityAirflow = THREE.MathUtils.lerp(0.32, 1.28, runningBlend);
    this.airflowUniform.value.set(
      Math.sin(time * 0.47) * 0.38 + Math.sin(time * 1.91) * 0.16,
      0.08 + Math.sin(time * 0.71) * 0.05,
      0.62 + Math.cos(time * 0.31) * 0.24,
    ).multiplyScalar(THREE.MathUtils.lerp(0.025, locomotionAirflow, movementBlend))
      .addScaledVector(characterVelocity, -velocityAirflow);
    this.deltaTimeUniform.value = deltaTime;
    this.timeUniform.value = time;
    this.movementBlendUniform.value = movementBlend;
    this.anchorDisplacement.copy(anchors.left).add(anchors.right)
      .multiplyScalar(0.5)
      .sub(this.anchorCenter);
    this.anchorAccelerationDisplacement.copy(this.anchorDisplacement)
      .sub(this.previousAnchorDisplacement);
    this.characterDisplacement.copy(characterVelocity);
    this.characterDisplacement.y = 0;
    this.characterDisplacement.multiplyScalar(deltaTime);
    this.characterAccelerationDisplacement.copy(this.characterDisplacement)
      .sub(this.previousCharacterDisplacement);
    this.brakingVelocityCorrectionTarget.set(0, 0, 0);
    const planarAccelerationDotDisplacement = this.characterAccelerationDisplacement.x
      * this.characterDisplacement.x
      + this.characterAccelerationDisplacement.z * this.characterDisplacement.z;
    if (planarAccelerationDotDisplacement < 0) {
      this.brakingVelocityCorrectionTarget.set(
        this.characterAccelerationDisplacement.x * (GPU_BRAKING_VELOCITY_TRANSFER - 1),
        0,
        this.characterAccelerationDisplacement.z * (GPU_BRAKING_VELOCITY_TRANSFER - 1),
      );
    }
    this.brakingVelocityCorrection.lerp(
      this.brakingVelocityCorrectionTarget,
      1 - Math.exp(-GPU_BRAKING_VELOCITY_RESPONSE_PER_SECOND * deltaTime),
    );
    this.anchorDisplacementUniform.value.copy(this.anchorDisplacement);
    this.anchorAccelerationDisplacementUniform.value.copy(
      this.anchorAccelerationDisplacement,
    );
    this.brakingVelocityCorrectionUniform.value.copy(this.brakingVelocityCorrection);
    this.updateAnchorBuffer(anchors);
    this.updateBodyBuffers(bodyColliders, anchors.back);
    this.updateWorldBuffers(worldColliders);
    this.renderer.compute(this.computeSequence);
    this.previousAnchorDisplacement.copy(this.anchorDisplacement);
    this.previousCharacterDisplacement.copy(this.characterDisplacement);
    this.submittedSteps += 1;
  }

  /** GPU rendering consumes the position storage buffer directly. */
  public syncGeometry(): void {}

  public reset(anchors: CapeAnchors): void {
    this.diagnosticMirror.reset(anchors);
    const state = this.createInitialState();
    this.writeStorage(this.positionBuffer.value, state);
    this.writeStorage(this.scratchBuffer.value, state);
    this.writeStorage(this.previousBuffer.value, state);
    this.updateAnchorBuffer(anchors);
    this.previousAnchorDisplacement.set(0, 0, 0);
    this.previousCharacterDisplacement.set(0, 0, 0);
    this.brakingVelocityCorrection.set(0, 0, 0);
    this.brakingVelocityCorrectionTarget.set(0, 0, 0);
    this.submittedSteps = 0;
    this.worldContactsLastStep = 0;
    this.worldContactEventOffset = this.worldContactEvents;
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

    const state = this.createInitialState();
    const topology = this.createTopology(state);
    this.writeStorage(this.positionBuffer.value, state);
    this.writeStorage(this.scratchBuffer.value, state);
    this.writeStorage(this.previousBuffer.value, state);
    this.writeStorage(this.topologyBuffer.value, topology.packed);
    this.writeStorage(this.constraintBuffer.value, topology.coloredConstraints);
    this.updateAnchorBuffer(anchors);
    this.previousAnchorDisplacement.set(0, 0, 0);
    this.previousCharacterDisplacement.set(0, 0, 0);
    this.brakingVelocityCorrection.set(0, 0, 0);
    this.brakingVelocityCorrectionTarget.set(0, 0, 0);
    this.submittedSteps = 0;
    this.worldContactsLastStep = 0;
    this.worldContactEventOffset = this.worldContactEvents;
  }

  public getSettings(): CapePhysicsSettings {
    return { ...this.settings };
  }

  public setOpacity(_opacity: number): void {}

  public async refreshDiagnostics(): Promise<void> {
    if (this.submittedSteps === 0) return;
    const [positions, previous] = await Promise.all([
      this.renderer.getArrayBufferAsync(this.positionBuffer.value),
      this.renderer.getArrayBufferAsync(this.previousBuffer.value),
    ]);
    const positionData = new Float32Array(positions);
    this.diagnosticMirror.overwriteStateFromGpu(positionData, new Float32Array(previous));
    let gpuContactEvents = 0;
    for (let index = CAPE.columns; index < PARTICLE_COUNT; index += 1) {
      gpuContactEvents += Math.round(positionData[index * 4 + 3] ?? 0);
    }
    const cumulativeContactEvents = this.worldContactEventOffset + gpuContactEvents;
    this.worldContactsLastStep = Math.max(
      0,
      cumulativeContactEvents - this.worldContactEvents,
    );
    this.worldContactEvents = cumulativeContactEvents;
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
      worldColliders ?? this.worldColliderSource ?? [],
    );
  }

  private createPredictionKernel(): THREE.ComputeNode {
    return Fn(() => {
      const index = instanceIndex;
      const current = this.positionBuffer.element(index);
      const previous = this.previousBuffer.element(index);
      const target = this.scratchBuffer.element(index);
      If(index.lessThan(uint(CAPE.columns)), () => {
        const anchor = this.anchorBuffer.element(index);
        target.assign(anchor);
        previous.assign(anchor);
        Return();
      });

      const currentPosition = current.xyz.add(this.anchorDisplacementUniform)
        .toVar('currentPosition');
      const previousPosition = previous.xyz.add(this.anchorDisplacementUniform);
      const velocity = currentPosition.sub(previousPosition).toVar('velocity');
      const drag = mix(
        float(IDLE_DRAG_PER_SECOND),
        float(ACTIVE_DRAG_PER_SECOND),
        this.movementBlendUniform,
      ).mul(this.dampingUniform);
      velocity.mulAssign(drag.mul(this.deltaTimeUniform).negate().exp());
      previous.assign(vec4(currentPosition, 0));

      const topologyMetadata = this.topologyBuffer.element(
        index.mul(uint(TOPOLOGY_METADATA_STRIDE)),
      );
      const topologyNeighbors = this.topologyBuffer.element(
        index.mul(uint(TOPOLOGY_METADATA_STRIDE)).add(1),
      );
      const left = this.positionBuffer.element(uint(topologyMetadata.z)).xyz;
      const right = this.positionBuffer.element(uint(topologyMetadata.w)).xyz;
      const up = this.positionBuffer.element(uint(topologyNeighbors.x)).xyz;
      const down = this.positionBuffer.element(uint(topologyNeighbors.y)).xyz;
      const normal = cross(down.sub(up), right.sub(left)).normalize().toVar('normal');
      const pressure = this.airflowUniform.dot(normal).toVar('pressure');
      const row = index.div(uint(CAPE.columns));
      const column = index.mod(uint(CAPE.columns));
      const turbulence = this.timeUniform.mul(4.3)
        .add(float(row).mul(0.83))
        .add(float(column).mul(1.71))
        .sin()
        .mul(0.42);
      const across = float(column).div(CAPE.columns - 1).sub(0.5);
      const flutterEnvelope = float(row)
        .div(CAPE.rows - 1)
        .mul(Math.PI)
        .sin()
        .pow(2);
      const flutterProfile = float(0.3).add(across.mul(0.4));
      const fabricFlutter = this.timeUniform.mul(3.4)
        .add(float(row).mul(0.28))
        .sin()
        .mul(flutterProfile)
        .mul(flutterEnvelope);
      const deltaSquared = this.deltaTimeUniform.mul(this.deltaTimeUniform);
      const predicted = currentPosition.add(velocity).toVar('predicted');
      predicted.subAssign(this.anchorAccelerationDisplacementUniform);
      predicted.subAssign(this.brakingVelocityCorrectionUniform);
      predicted.y.subAssign(deltaSquared.mul(9.81).mul(this.weightUniform));
      predicted.addAssign(normal.mul(
        pressure.mul(pressure.abs()).mul(0.026).mul(deltaSquared),
      ));
      predicted.addAssign(normal.mul(
        fabricFlutter
          .mul(this.movementBlendUniform)
          .mul(CAPE_FLUTTER_ACCELERATION)
          .mul(deltaSquared),
      ));
      predicted.addAssign(
        this.airflowUniform
          .mul(float(0.048).add(turbulence.mul(0.011)))
          .mul(deltaSquared),
      );
      // Keep a monotonic event count in the otherwise-unused state lane so
      // contacts that begin and end between explicit diagnostic readbacks are
      // still observable without a new storage binding or a GPU fence.
      target.assign(vec4(predicted, current.w));
    })().compute(PARTICLE_COUNT).setName('Cape predict');
  }

  private createConstraintKernel(
    buffer: typeof this.positionBuffer,
    name: string,
    includeSelfCollision = true,
    includeFoldGuard = true,
  ): THREE.ComputeNode {
    return Fn(() => {
      const constraintIndex = instanceIndex;
      for (const range of this.coloredConstraintRanges) {
        If(constraintIndex.lessThan(uint(range.count)), () => {
          const definition = this.constraintBuffer.element(
            uint(range.offset).add(constraintIndex),
          );
          const firstIndex = uint(definition.x);
          const secondIndex = uint(definition.y);
          const firstState = buffer.element(firstIndex);
          const secondState = buffer.element(secondIndex);
          const first = firstState.xyz.toVar();
          const second = secondState.xyz.toVar();
          const delta = second.sub(first).toVar();
          const length = delta.length().toVar();
          const firstWeight = select(firstIndex.lessThan(uint(CAPE.columns)), 0, 1);
          const secondWeight = select(secondIndex.lessThan(uint(CAPE.columns)), 0, 1);
          const totalWeight = firstWeight.add(secondWeight);
          If(length.greaterThan(0.000_001).and(totalWeight.greaterThan(0)), () => {
            const stiffness = definition.w.mul(this.stiffnessUniform).min(0.999);
            const correction = delta.mul(
              length.sub(definition.z).div(length).mul(stiffness),
            );
            first.addAssign(correction.mul(firstWeight.div(totalWeight)));
            second.subAssign(correction.mul(secondWeight.div(totalWeight)));
            buffer.element(firstIndex).assign(vec4(first, firstState.w));
            buffer.element(secondIndex).assign(vec4(second, secondState.w));
          });
        });
        storageBarrier();
      }

      if (includeSelfCollision) {
        const rotatingParticleCount = uint(PARTICLE_COUNT - 1);
        Loop(
          {
            start: uint(0),
            end: rotatingParticleCount,
            type: 'uint',
            condition: '<',
          },
          ({ i: round }) => {
            If(constraintIndex.lessThan(uint(PARTICLE_COUNT / 2)), () => {
              const pairFirst = select(
                constraintIndex.equal(uint(0)),
                uint(PARTICLE_COUNT - 1),
                round.add(constraintIndex).mod(rotatingParticleCount),
              );
              const pairSecond = select(
                constraintIndex.equal(uint(0)),
                round,
                round.add(rotatingParticleCount).sub(constraintIndex)
                  .mod(rotatingParticleCount),
              );
              const firstIndex = select(
                pairFirst.greaterThan(pairSecond),
                pairFirst,
                pairSecond,
              ).toVar('selfFirstIndex');
              const secondIndex = select(
                pairFirst.greaterThan(pairSecond),
                pairSecond,
                pairFirst,
              ).toVar('selfSecondIndex');
              const firstRow = firstIndex.div(uint(CAPE.columns));
              const secondRow = secondIndex.div(uint(CAPE.columns));
              const firstColumn = firstIndex.mod(uint(CAPE.columns));
              const secondColumn = secondIndex.mod(uint(CAPE.columns));
              const rowDifference = firstRow.sub(secondRow);
              const columnDifference = select(
                firstColumn.greaterThan(secondColumn),
                firstColumn.sub(secondColumn),
                secondColumn.sub(firstColumn),
              );
              const topologicalNeighbor = rowDifference.lessThanEqual(uint(2))
                .and(columnDifference.lessThanEqual(2));
              If(topologicalNeighbor.not(), () => {
                const firstState = buffer.element(firstIndex);
                const secondState = buffer.element(secondIndex);
                const first = firstState.xyz.toVar('selfFirst');
                const second = secondState.xyz.toVar('selfSecond');
                const separation = first.sub(second).toVar('selfSeparation');
                const distanceSquared = separation.dot(separation).toVar('selfDistanceSquared');
                If(distanceSquared.lessThan(CLOTH_THICKNESS ** 2), () => {
                  const distance = distanceSquared.sqrt().toVar('selfDistance');
                  const normal = vec3(1, 0, 0).toVar('selfNormal');
                  If(distance.greaterThan(0.000_001), () => {
                    normal.assign(separation.div(distance));
                  }).Else(() => {
                    const phase = float(firstIndex)
                      .mul(0.754_877_666)
                      .add(float(secondIndex).mul(0.569_840_291));
                    normal.assign(vec3(
                      phase.sin(),
                      phase.mul(1.37).cos(),
                      phase.mul(0.73).add(1.1).sin(),
                    ).normalize());
                  });
                  const firstWeight = select(firstIndex.lessThan(uint(CAPE.columns)), 0, 1);
                  const secondWeight = select(secondIndex.lessThan(uint(CAPE.columns)), 0, 1);
                  const totalWeight = firstWeight.add(secondWeight);
                  If(totalWeight.greaterThan(0), () => {
                    const correction = normal
                      .mul(float(CLOTH_THICKNESS).sub(distance).div(totalWeight));
                    const firstCorrection = correction.mul(firstWeight);
                    const secondCorrection = correction.mul(secondWeight);
                    first.addAssign(firstCorrection);
                    second.subAssign(secondCorrection);
                    buffer.element(firstIndex).assign(vec4(first, firstState.w));
                    buffer.element(secondIndex).assign(vec4(second, secondState.w));
                    const firstPreviousState = this.previousBuffer.element(firstIndex);
                    const secondPreviousState = this.previousBuffer.element(secondIndex);
                    this.previousBuffer.element(firstIndex).assign(vec4(
                      firstPreviousState.xyz.add(firstCorrection),
                      firstPreviousState.w,
                    ));
                    this.previousBuffer.element(secondIndex).assign(vec4(
                      secondPreviousState.xyz.sub(secondCorrection),
                      secondPreviousState.w,
                    ));
                  });
                });
              });
            });
            storageBarrier();
          },
        );
      }

      if (includeFoldGuard) {
      for (let foldColor = 0; foldColor < 2; foldColor += 1) {
        const foldRowCount = Math.ceil((CAPE.rows - 1 - foldColor) / 2);
        If(constraintIndex.lessThan(uint(foldRowCount * CAPE.columns)), () => {
          const pairRow = constraintIndex.div(uint(CAPE.columns));
          const column = constraintIndex.mod(uint(CAPE.columns));
          const upperRow = pairRow.mul(uint(2)).add(uint(foldColor));
          const upperIndex = upperRow.mul(uint(CAPE.columns)).add(column);
          const lowerIndex = upperIndex.add(uint(CAPE.columns));
          const upperState = buffer.element(upperIndex);
          const lowerState = buffer.element(lowerIndex);
          const upper = upperState.xyz.toVar();
          const lower = lowerState.xyz.toVar();
          const excess = lower.y.sub(upper.y).sub(MAXIMUM_LOCAL_UPWARD_FOLD);
          If(excess.greaterThan(0), () => {
            const upperWeight = select(upperIndex.lessThan(uint(CAPE.columns)), 0, 1);
            const lowerWeight = float(1);
            const totalWeight = upperWeight.add(lowerWeight);
            const correction = excess.mul(FOLD_RELAXATION);
            const upperCorrection = correction.mul(upperWeight.div(totalWeight));
            const lowerCorrection = correction.mul(lowerWeight.div(totalWeight));
            upper.y.addAssign(upperCorrection);
            lower.y.subAssign(lowerCorrection);
            buffer.element(upperIndex).assign(vec4(upper, upperState.w));
            buffer.element(lowerIndex).assign(vec4(lower, lowerState.w));
            const upperPreviousState = this.previousBuffer.element(upperIndex);
            const lowerPreviousState = this.previousBuffer.element(lowerIndex);
            this.previousBuffer.element(upperIndex).assign(vec4(
              upperPreviousState.xyz.add(vec3(0, upperCorrection, 0)),
              upperPreviousState.w,
            ));
            this.previousBuffer.element(lowerIndex).assign(vec4(
              lowerPreviousState.xyz.sub(vec3(0, lowerCorrection, 0)),
              lowerPreviousState.w,
            ));
          });
        });
        storageBarrier();
      }
      }

      If(constraintIndex.lessThan(uint(CAPE.rows - 1)), () => {
        const row = constraintIndex.add(1);
        const leftIndex = row.mul(uint(CAPE.columns));
        const rightIndex = leftIndex.add(uint(CAPE.columns - 1));
        const leftState = buffer.element(leftIndex);
        const rightState = buffer.element(rightIndex);
        const left = leftState.xyz.toVar('spanLeft');
        const right = rightState.xyz.toVar('spanRight');
        const shoulderAxis = this.anchorBuffer.element(uint(CAPE.columns - 1)).xyz
          .sub(this.anchorBuffer.element(uint(0)).xyz)
          .normalize();
        const restSpan = this.topologyBuffer.element(
          leftIndex.mul(uint(TOPOLOGY_METADATA_STRIDE)),
        ).x;
        const lateralSpan = right.sub(left).dot(shoulderAxis);
        const deficit = restSpan.mul(MINIMUM_CAPE_ROW_SPAN_RATIO)
          .sub(lateralSpan)
          .max(0);
        const correction = shoulderAxis.mul(
          deficit.mul(CAPE_ROW_SPAN_RELAXATION * 0.5),
        );
        left.subAssign(correction);
        right.addAssign(correction);
        buffer.element(leftIndex).assign(vec4(left, leftState.w));
        buffer.element(rightIndex).assign(vec4(right, rightState.w));
        const leftPreviousState = this.previousBuffer.element(leftIndex);
        const rightPreviousState = this.previousBuffer.element(rightIndex);
        this.previousBuffer.element(leftIndex).assign(vec4(
          leftPreviousState.xyz.sub(correction),
          leftPreviousState.w,
        ));
        this.previousBuffer.element(rightIndex).assign(vec4(
          rightPreviousState.xyz.add(correction),
          rightPreviousState.w,
        ));

        // Endpoint span alone still allows all interior particles to curl into
        // a U-shaped tube. Constrain only excessive departure from the current
        // row chord; the chord itself remains free to trail and twist.
        for (let column = 1; column < CAPE.columns - 1; column += 1) {
          const particleIndex = leftIndex.add(uint(column));
          const particleState = buffer.element(particleIndex);
          const position = particleState.xyz.toVar('rowCurl' + column);
          const chordPoint = left.add(
            right.sub(left).mul(column / (CAPE.columns - 1)),
          );
          const curlDelta = position.sub(chordPoint).toVar('rowCurlDelta' + column);
          const curlLength = curlDelta.length().toVar('rowCurlLength' + column);
          const maximumCurl = restSpan.mul(MAXIMUM_CAPE_ROW_CURL_RATIO);
          If(curlLength.greaterThan(maximumCurl).and(curlLength.greaterThan(0.000_001)), () => {
            const curlCorrection = curlDelta.mul(
              curlLength.sub(maximumCurl)
                .div(curlLength)
                .mul(CAPE_ROW_CURL_RELAXATION),
            );
            position.subAssign(curlCorrection);
            buffer.element(particleIndex).assign(vec4(position, particleState.w));
            const previousState = this.previousBuffer.element(particleIndex);
            this.previousBuffer.element(particleIndex).assign(vec4(
              previousState.xyz.sub(curlCorrection),
              previousState.w,
            ));
          });
        }
      });
      storageBarrier();
    })().compute(PARTICLE_COUNT, [PARTICLE_COUNT]).setName(name);
  }

  private createProjectionKernel(
    source: typeof this.positionBuffer,
    target: typeof this.positionBuffer,
    hardRockRecovery: boolean,
    name: string,
    includeSelfCollision = true,
    includeContacts = true,
    includeFoldGuard = true,
  ): THREE.ComputeNode {
    const project = this.createProjectionFunction(
      source,
      target,
      name.replaceAll(' ', ''),
      includeSelfCollision,
      includeContacts,
      includeFoldGuard,
    );
    return Fn(() => {
      const passResult = float(0).toVar('projectionPassResult');
      passResult.assign(project(instanceIndex, bool(hardRockRecovery)));
    })().compute(PARTICLE_COUNT).setName(name);
  }

  private createProjectionFeatureKernel(
    includeSelfCollision: boolean,
    includeContacts: boolean,
    name: string,
    includeFoldGuard = true,
  ): THREE.ComputeNode {
    const project = this.createProjectionFunction(
      this.positionBuffer,
      this.scratchBuffer,
      name.replaceAll(' ', ''),
      includeSelfCollision,
      includeContacts,
      includeFoldGuard,
    );
    return Fn(() => {
      const passResult = float(0).toVar('profileProjectionPassResult');
      passResult.assign(project(instanceIndex, bool(false)));
    })().compute(PARTICLE_COUNT).setName(name);
  }

  private createFaceSweepKernel(
    colorPass: ReturnType<GpuCapeSimulation['createBodyFaceColorFunction']>,
    name: string,
  ): THREE.ComputeNode {
    return Fn(() => {
      const passResult = float(0).toVar('faceSweepResult');
      for (let color = 0; color < 8; color += 1) {
        passResult.assign(colorPass(uint(color)));
        storageBarrier();
      }
    })().compute(PARTICLE_COUNT, [PARTICLE_COUNT]).setName(name);
  }

  private createProjectionFunction(
    source: typeof this.positionBuffer,
    target: typeof this.positionBuffer,
    passName: string,
    includeSelfCollision = true,
    includeContacts = true,
    includeFoldGuard = true,
  ) {
    return Fn<
      readonly [THREE.Node<'uint'>, THREE.Node<'bool'>],
      THREE.Node<'float'>
    >(([index, hardRockRecovery]) => {
      If(index.lessThan(uint(CAPE.columns)), () => {
        target.element(index).assign(source.element(index));
      }).Else(() => {
      const position = source.element(index).xyz.toVar('position');
      const worldContactEvents = source.element(index).w.toVar('worldContactEvents');
      const previousState = this.previousBuffer.element(index);
      const previousPosition = previousState.xyz.toVar('previousPosition');
      const rockSweepResolved = previousState.w.greaterThanEqual(0.5)
        .toVar('rockSweepResolved');
      const rockCorrectionUsed = select(
        rockSweepResolved,
        previousState.w.sub(1),
        previousState.w,
      ).toVar('rockCorrectionUsed');
      const particleRow = index.div(uint(CAPE.columns));
      const particleColumn = index.mod(uint(CAPE.columns));

      if (includeFoldGuard) {
      const topologyNeighbors = this.topologyBuffer.element(
        index.mul(uint(TOPOLOGY_METADATA_STRIDE)).add(1),
      );
      const upper = source.element(uint(topologyNeighbors.x)).xyz;
      const lower = source.element(uint(topologyNeighbors.y)).xyz;
      const foldStart = position.toVar('foldStart');
      If(index.greaterThanEqual(uint(CAPE.columns)), () => {
        const upwardExcess = position.y.sub(upper.y)
          .sub(MAXIMUM_LOCAL_UPWARD_FOLD)
          .max(0);
        position.y.subAssign(upwardExcess.mul(FOLD_RELAXATION * 0.5));
      });
      If(index.lessThan(uint(PARTICLE_COUNT - CAPE.columns)), () => {
        const lowerExcess = lower.y.sub(position.y)
          .sub(MAXIMUM_LOCAL_UPWARD_FOLD)
          .max(0);
        position.y.addAssign(lowerExcess.mul(FOLD_RELAXATION * 0.5));
      });
      previousPosition.addAssign(position.sub(foldStart));
      }

      if (includeSelfCollision) {
      const selfStart = position.toVar('selfStart');
      const selfCorrection = vec3(0).toVar('selfCorrection');
      const selfContacts = float(0).toVar('selfContacts');
      Loop({ start: uint(0), end: uint(PARTICLE_COUNT), type: 'uint', condition: '<' }, ({ i }) => {
        If(i.notEqual(index), () => {
          const otherRow = i.div(uint(CAPE.columns));
          const otherColumn = i.mod(uint(CAPE.columns));
          const rowDifference = select(
            particleRow.greaterThan(otherRow),
            particleRow.sub(otherRow),
            otherRow.sub(particleRow),
          );
          const columnDifference = select(
            particleColumn.greaterThan(otherColumn),
            particleColumn.sub(otherColumn),
            otherColumn.sub(particleColumn),
          );
          const topologicalNeighbor = rowDifference.lessThanEqual(uint(2))
            .and(columnDifference.lessThanEqual(2));
          If(topologicalNeighbor.not(), () => {
            const separation = position.sub(source.element(i).xyz).toVar('selfSeparation');
            const distanceSquared = separation.dot(separation).toVar('selfDistanceSquared');
            If(distanceSquared.lessThan(CLOTH_THICKNESS ** 2), () => {
              const distance = distanceSquared.sqrt().toVar('selfDistance');
              const normal = vec3(1, 0, 0).toVar('selfNormal');
              If(distance.greaterThan(0.000_001), () => {
                normal.assign(separation.div(distance));
              }).Else(() => {
                const phase = float(index)
                  .mul(0.754_877_666)
                  .add(float(i).mul(0.569_840_291));
                normal.assign(vec3(
                  phase.sin(),
                  phase.mul(1.37).cos(),
                  phase.mul(0.73).add(1.1).sin(),
                ).normalize());
              });
              const massShare = select(i.lessThan(uint(CAPE.columns)), 1, 0.5);
              selfCorrection.addAssign(
                normal.mul(float(CLOTH_THICKNESS).sub(distance)).mul(massShare),
              );
              selfContacts.addAssign(1);
            });
          });
        });
      });
      position.addAssign(selfCorrection.div(selfContacts.max(1)));
      previousPosition.addAssign(position.sub(selfStart));
      }

      if (includeContacts) {
      const contactStart = position.toVar('contactStart');
      Loop(
        { start: uint(0), end: uint(this.bodyCountUniform), type: 'uint', condition: '<' },
        ({ i }) => {
          const bodyBase = i.mul(uint(BODY_BUFFER_STRIDE));
          const startRadius = this.bodyBuffer.element(bodyBase);
          const axisDepth = this.bodyBuffer.element(bodyBase.add(1));
          const lateralAxis = this.bodyBuffer.element(bodyBase.add(2));
          const verticalBounds = this.bodyBuffer.element(bodyBase.add(3));
          If(
            position.y.greaterThanEqual(verticalBounds.x)
              .and(position.y.lessThanEqual(verticalBounds.y)),
            () => {
              const fromStart = position.sub(startRadius.xyz).toVar('bodyFromStart');
              const particleDepth = fromStart.dot(this.backUniform).toVar('bodyParticleDepth');
              const particleLateral = fromStart
                .sub(this.backUniform.mul(particleDepth))
                .toVar('bodyParticleLateral');
              const progress = select(
                lateralAxis.w.greaterThan(0.000_001),
                particleLateral.dot(lateralAxis.xyz).div(lateralAxis.w).clamp(0, 1),
                0,
              );
              const closest = startRadius.xyz.add(axisDepth.xyz.mul(progress));
              const bodyDelta = position.sub(closest).toVar('bodyDelta');
              const depth = bodyDelta.dot(this.backUniform).toVar('bodyDepth');
              const lateralSquared = bodyDelta.dot(bodyDelta)
                .sub(depth.mul(depth))
                .max(0)
                .toVar('bodyLateralSquared');
              const radiusSquared = startRadius.w.mul(startRadius.w);
              If(lateralSquared.lessThan(radiusSquared), () => {
                const normalizedLateral = lateralSquared.div(radiusSquared).clamp(0, 1);
                const surfaceDepth = axisDepth.w.mul(float(1).sub(normalizedLateral).sqrt());
                const penetration = surfaceDepth.sub(depth).max(0);
                position.addAssign(this.backUniform.mul(penetration));
              });
            },
          );
        },
      );

      position.z.assign(position.z.clamp(CAVE.endZ + 0.08, CAVE.startZ - 0.08));
      const caveSegmentPosition = float(CAVE.startZ).sub(position.z)
        .div(CAVE.startZ - CAVE.endZ)
        .clamp(0, 1)
        .mul(CAVE.segments)
        .toVar('caveSegmentPosition');
      const caveFirstSegment = uint(caveSegmentPosition.floor()).toVar('caveFirstSegment');
      const caveSecondSegment = select(
        caveFirstSegment.lessThan(uint(CAVE.segments)),
        caveFirstSegment.add(1),
        caveFirstSegment,
      ).toVar('caveSecondSegment');
      const caveBlend = caveSegmentPosition.sub(float(caveFirstSegment)).toVar('caveBlend');
      const caveSectionSamples = uint(CAVE.radialSegments + 1);

      // Match CaveShellSampler.getLowerHeight exactly: intersect each adjacent
      // z section at the particle's x coordinate, then interpolate the two
      // resulting heights. Interpolating shell vertices first subtly changes
      // the piecewise surface and created centimetre-scale contact gaps.
      const firstLowerSurface = float(-1_000_000).toVar('firstLowerSurface');
      const secondLowerSurface = float(-1_000_000).toVar('secondLowerSurface');
      const firstNearestLowerHeight = float(0).toVar('firstNearestLowerHeight');
      const secondNearestLowerHeight = float(0).toVar('secondNearestLowerHeight');
      const firstNearestLowerDistance = float(1_000_000).toVar('firstNearestLowerDistance');
      const secondNearestLowerDistance = float(1_000_000).toVar('secondNearestLowerDistance');
      Loop(
        {
          start: uint(0),
          end: uint(CAVE.radialSegments - CAVE_LOWER_RADIAL_START + 1),
          type: 'uint',
          condition: '<',
        },
        ({ i }) => {
          const radial = i.add(uint(CAVE_LOWER_RADIAL_START));
          const firstSample = this.caveShellBuffer.element(
            caveFirstSegment.mul(caveSectionSamples).add(radial),
          );
          const secondSample = this.caveShellBuffer.element(
            caveSecondSegment.mul(caveSectionSamples).add(radial),
          );
          const firstSampleDistance = position.x.sub(firstSample.x).abs();
          const secondSampleDistance = position.x.sub(secondSample.x).abs();
          If(firstSampleDistance.lessThan(firstNearestLowerDistance), () => {
            firstNearestLowerDistance.assign(firstSampleDistance);
            firstNearestLowerHeight.assign(firstSample.y);
          });
          If(secondSampleDistance.lessThan(secondNearestLowerDistance), () => {
            secondNearestLowerDistance.assign(secondSampleDistance);
            secondNearestLowerHeight.assign(secondSample.y);
          });
          If(
            i.lessThan(uint(CAVE.radialSegments - CAVE_LOWER_RADIAL_START)),
            () => {
              const nextFirst = this.caveShellBuffer.element(
                caveFirstSegment.mul(caveSectionSamples).add(radial).add(1),
              );
              const nextSecond = this.caveShellBuffer.element(
                caveSecondSegment.mul(caveSectionSamples).add(radial).add(1),
              );
              const firstEdgeWidth = nextFirst.x.sub(firstSample.x).toVar('firstLowerEdgeWidth');
              If(
                position.x.greaterThanEqual(firstSample.x.min(nextFirst.x))
                  .and(position.x.lessThanEqual(firstSample.x.max(nextFirst.x)))
                  .and(firstEdgeWidth.abs().greaterThan(0.000_001)),
                () => {
                  const edgeBlend = position.x.sub(firstSample.x).div(firstEdgeWidth);
                  firstLowerSurface.assign(
                    firstLowerSurface.max(mix(firstSample.y, nextFirst.y, edgeBlend)),
                  );
                },
              );
              const secondEdgeWidth = nextSecond.x.sub(secondSample.x).toVar('secondLowerEdgeWidth');
              If(
                position.x.greaterThanEqual(secondSample.x.min(nextSecond.x))
                  .and(position.x.lessThanEqual(secondSample.x.max(nextSecond.x)))
                  .and(secondEdgeWidth.abs().greaterThan(0.000_001)),
                () => {
                  const edgeBlend = position.x.sub(secondSample.x).div(secondEdgeWidth);
                  secondLowerSurface.assign(
                    secondLowerSurface.max(mix(secondSample.y, nextSecond.y, edgeBlend)),
                  );
                },
              );
            },
          );
        },
      );
      const firstShellFloor = select(
        firstLowerSurface.greaterThan(-500_000),
        firstLowerSurface,
        firstNearestLowerHeight,
      );
      const secondShellFloor = select(
        secondLowerSurface.greaterThan(-500_000),
        secondLowerSurface,
        secondNearestLowerHeight,
      );
      const shellFloor = mix(firstShellFloor, secondShellFloor, caveBlend)
        .add(CAVE_SHELL_CONTACT_SKIN);

      const caveCenter = position.z.sub(10).mul(0.055).sin().mul(2.05)
        .add(position.z.add(5).mul(0.137).sin().mul(0.38))
        .toVar('caveCenter');
      const caveHalfWidth = float(4.7)
        .add(position.z.mul(0.093).add(1.2).sin().mul(0.62))
        .add(position.z.mul(0.031).sin().mul(0.34))
        .toVar('caveHalfWidth');
      const edge = position.x.sub(caveCenter).abs().div(caveHalfWidth);
      const baseFloor = position.x.mul(0.71).add(position.z.mul(0.16)).sin().mul(0.018)
        .add(position.z.mul(0.47).sin().mul(0.014))
        .add(edge.sub(0.68).max(0).pow(2).mul(0.34))
        .toVar('baseFloor');
      const basinFloor = baseFloor.toVar('basinFloor');
      for (const basin of WATER_BASINS) {
        const normalizedX = position.x.sub(basin.centerX).div(basin.radiusX);
        const normalizedZ = position.z.sub(basin.centerZ).div(basin.radiusZ);
        const normalizedDistance = normalizedX.mul(normalizedX)
          .add(normalizedZ.mul(normalizedZ))
          .sqrt();
        const basinBlend = float(1).sub(smoothstep(0.9, 1.08, normalizedDistance));
        basinFloor.assign(basinFloor.min(baseFloor.sub(basinBlend.mul(basin.depth))));
      }
      const caveFloor = shellFloor.max(basinFloor).add(CLOTH_WORLD_CLEARANCE).toVar('caveFloor');

      Loop(
        {
          start: uint(0),
          end: uint(this.worldSphereCountUniform),
          type: 'uint',
          condition: '<',
        },
        ({ i }) => {
          const sphere = this.worldSphereBuffer.element(i);
          const sphereDelta = position.sub(sphere.xyz).toVar('sphereDelta');
          const sphereDistanceSquared = sphereDelta.dot(sphereDelta).toVar('sphereDistanceSquared');
          If(sphereDistanceSquared.lessThan(sphere.w.mul(sphere.w)), () => {
            worldContactEvents.addAssign(1);
            const sphereDistance = sphereDistanceSquared.sqrt().toVar('sphereDistance');
            const sphereNormal = vec3(0, 1, 0).toVar('sphereNormal');
            If(sphereDistance.greaterThan(0.000_001), () => {
              sphereNormal.assign(sphereDelta.div(sphereDistance));
            }).Else(() => {
              const previousDelta = previousPosition.sub(sphere.xyz);
              If(previousDelta.dot(previousDelta).greaterThan(0.000_001), () => {
                sphereNormal.assign(previousDelta.normalize());
              });
            });
            const sphereCorrection = sphere.w.sub(sphereDistance).toVar('sphereCorrection');
            If(
              sphereNormal.y.lessThan(0)
                .and(position.y.lessThanEqual(caveFloor.add(0.045))),
              () => {
                const planar = vec3(sphereDelta.x, 0, sphereDelta.z).toVar('spherePlanar');
                const planarDistance = planar.length().toVar('spherePlanarDistance');
                If(planarDistance.greaterThan(0.000_001), () => {
                  sphereNormal.assign(planar.div(planarDistance));
                }).Else(() => {
                  sphereNormal.assign(vec3(1, 0, 0));
                });
                const requiredPlanar = sphere.w.mul(sphere.w)
                  .sub(sphereDelta.y.mul(sphereDelta.y))
                  .max(0)
                  .sqrt();
                sphereCorrection.assign(requiredPlanar.sub(planarDistance).max(0));
              },
            );
            position.addAssign(sphereNormal.mul(sphereCorrection));
          });
        },
      );

      Loop(
        { start: uint(0), end: uint(this.rockCountUniform), type: 'uint', condition: '<' },
        ({ i }) => {
          const rockBase = i.mul(uint(ROCK_BUFFER_STRIDE));
          const rockCenterLimit = this.rockBuffer.element(rockBase);
          const rockMinimum = this.rockBuffer.element(rockBase.add(1));
          const rockMaximum = this.rockBuffer.element(rockBase.add(2));
          const sweepMinimum = position.min(previousPosition);
          const sweepMaximum = position.max(previousPosition);
          const inExpandedBounds = sweepMaximum.x
            .greaterThanEqual(rockMinimum.x.sub(CLOTH_ROCK_CLEARANCE))
            .and(sweepMinimum.x.lessThanEqual(rockMaximum.x.add(CLOTH_ROCK_CLEARANCE)))
            .and(sweepMaximum.y.greaterThanEqual(rockMinimum.y.sub(CLOTH_ROCK_CLEARANCE)))
            .and(sweepMinimum.y.lessThanEqual(rockMaximum.y.add(CLOTH_ROCK_CLEARANCE)))
            .and(sweepMaximum.z.greaterThanEqual(rockMinimum.z.sub(CLOTH_ROCK_CLEARANCE)))
            .and(sweepMinimum.z.lessThanEqual(rockMaximum.z.add(CLOTH_ROCK_CLEARANCE)));
          If(inExpandedBounds, () => {
            const sweepMotion = position.sub(previousPosition).toVar('rockSweepMotion');
            const sweepLengthSquared = sweepMotion.dot(sweepMotion)
              .toVar('rockSweepLengthSquared');
            If(
              rockSweepResolved.not()
                .and(sweepLengthSquared.greaterThan(0.000_000_1))
                .and(sweepLengthSquared.lessThanEqual(MAXIMUM_CONTINUOUS_ROCK_SWEEP ** 2)),
              () => {
                const sweepEntry = float(0).toVar('rockSweepEntry');
                const sweepExit = float(1).toVar('rockSweepExit');
                const sweepStartsInside = bool(true).toVar('rockSweepStartsInside');
                const sweepRejected = bool(false).toVar('rockSweepRejected');
                const sweepEntryFaceFound = bool(false).toVar('rockSweepEntryFaceFound');
                const sweepNormal = vec3(0, 1, 0).toVar('rockSweepNormal');
                Loop(
                  { start: uint(0), end: uint(ROCK_FACES_PER_COLLIDER), type: 'uint', condition: '<' },
                  ({ i: sweepFaceOffset }) => {
                    const sweepFaceBase = rockBase.add(4).add(sweepFaceOffset.mul(4));
                    const sweepPlane = this.rockBuffer.element(sweepFaceBase.add(3));
                    const expandedConstant = sweepPlane.w.add(CLOTH_ROCK_CLEARANCE);
                    const startDistance = sweepPlane.xyz.dot(previousPosition)
                      .sub(expandedConstant)
                      .toVar('rockSweepStartDistance');
                    const endDistance = sweepPlane.xyz.dot(position)
                      .sub(expandedConstant)
                      .toVar('rockSweepEndDistance');
                    If(startDistance.greaterThan(0), () => {
                      sweepStartsInside.assign(bool(false));
                    });
                    If(
                      startDistance.greaterThan(0).and(endDistance.greaterThan(0)),
                      () => {
                        sweepRejected.assign(bool(true));
                      },
                    );
                    If(
                      startDistance.lessThanEqual(0).and(endDistance.lessThanEqual(0)).not()
                        .and(startDistance.sub(endDistance).abs().greaterThan(0.000_000_1)),
                      () => {
                        const progress = startDistance
                          .div(startDistance.sub(endDistance))
                          .toVar('rockSweepProgress');
                        If(startDistance.greaterThan(endDistance), () => {
                          If(progress.greaterThan(sweepEntry), () => {
                            sweepEntry.assign(progress);
                            sweepNormal.assign(sweepPlane.xyz);
                            sweepEntryFaceFound.assign(bool(true));
                          });
                        }).Else(() => {
                          sweepExit.assign(sweepExit.min(progress));
                        });
                      },
                    );
                  },
                );
                If(
                  sweepStartsInside.not()
                    .and(sweepRejected.not())
                    .and(sweepEntryFaceFound)
                    .and(sweepEntry.lessThanEqual(sweepExit))
                    .and(sweepEntry.greaterThanEqual(0))
                    .and(sweepEntry.lessThanEqual(1)),
                  () => {
                    worldContactEvents.addAssign(1);
                    rockSweepResolved.assign(bool(true));
                    const sweepHit = previousPosition.add(sweepMotion.mul(sweepEntry))
                      .toVar('rockSweepHit');
                    const belowWalkableShoulder = sweepHit.y.lessThanEqual(rockMinimum.w);
                    const trappedAtFloor = sweepNormal.y.lessThan(0)
                      .and(sweepHit.y.lessThanEqual(caveFloor.add(CLOTH_ROCK_CLEARANCE * 2)));
                    If(belowWalkableShoulder.or(trappedAtFloor), () => {
                      const planarNormal = vec3(
                        sweepHit.x.sub(rockCenterLimit.x),
                        0,
                        sweepHit.z.sub(rockCenterLimit.z),
                      ).toVar('rockSweepPlanarNormal');
                      If(planarNormal.dot(planarNormal).greaterThan(0.000_001), () => {
                        sweepNormal.assign(planarNormal.normalize());
                      }).Else(() => {
                        sweepNormal.assign(vec3(1, 0, 0));
                      });
                    });
                    const remainingMotion = sweepMotion.mul(float(1).sub(sweepEntry))
                      .toVar('rockSweepRemainingMotion');
                    const inwardMotion = remainingMotion.dot(sweepNormal)
                      .toVar('rockSweepInwardMotion');
                    If(inwardMotion.lessThan(0), () => {
                      remainingMotion.subAssign(sweepNormal.mul(inwardMotion));
                    });
                    remainingMotion.mulAssign(ROCK_SWEEP_TANGENTIAL_DAMPING);
                    sweepHit.addAssign(sweepNormal.mul(ROCK_SWEEP_SURFACE_OFFSET));
                    previousPosition.assign(sweepHit);
                    position.assign(sweepHit.add(remainingMotion));
                  },
                );
              },
            );

            const insideRock = bool(true).toVar('insideRock');
            const closestDistanceSquared = float(1_000_000).toVar('closestRockDistanceSquared');
            const closestRockPoint = rockCenterLimit.xyz.toVar('closestRockPoint');
            const closestRockFaceNormal = vec3(0, 1, 0).toVar('closestRockFaceNormal');
            Loop(
              { start: uint(0), end: uint(ROCK_FACES_PER_COLLIDER), type: 'uint', condition: '<' },
              ({ i: faceOffset }) => {
                const faceBase = rockBase.add(4).add(faceOffset.mul(4));
                const vertexA = this.rockBuffer.element(faceBase).xyz;
                const vertexB = this.rockBuffer.element(faceBase.add(1)).xyz;
                const vertexC = this.rockBuffer.element(faceBase.add(2)).xyz;
                const facePlane = this.rockBuffer.element(faceBase.add(3));
                If(facePlane.xyz.dot(position).sub(facePlane.w).greaterThan(0.000_01), () => {
                  insideRock.assign(bool(false));
                });

                const faceMinimum = vertexA.min(vertexB).min(vertexC);
                const faceMaximum = vertexA.max(vertexB).max(vertexC);
                const boundsDelta = vec3(
                  faceMinimum.x.sub(position.x).max(0)
                    .add(position.x.sub(faceMaximum.x).max(0)),
                  faceMinimum.y.sub(position.y).max(0)
                    .add(position.y.sub(faceMaximum.y).max(0)),
                  faceMinimum.z.sub(position.z).max(0)
                    .add(position.z.sub(faceMaximum.z).max(0)),
                );
                If(boundsDelta.dot(boundsDelta).lessThan(closestDistanceSquared), () => {
                  const ab = vertexB.sub(vertexA).toVar('rockAB');
                  const ac = vertexC.sub(vertexA).toVar('rockAC');
                  const ap = position.sub(vertexA).toVar('rockAP');
                  const d1 = ab.dot(ap).toVar('rockD1');
                  const d2 = ac.dot(ap).toVar('rockD2');
                  const bp = position.sub(vertexB).toVar('rockBP');
                  const d3 = ab.dot(bp).toVar('rockD3');
                  const d4 = ac.dot(bp).toVar('rockD4');
                  const cp = position.sub(vertexC).toVar('rockCP');
                  const d5 = ab.dot(cp).toVar('rockD5');
                  const d6 = ac.dot(cp).toVar('rockD6');
                  const vc = d1.mul(d4).sub(d3.mul(d2)).toVar('rockVC');
                  const vb = d5.mul(d2).sub(d1.mul(d6)).toVar('rockVB');
                  const va = d3.mul(d6).sub(d5.mul(d4)).toVar('rockVA');
                  const trianglePoint = vertexA.toVar('rockTrianglePoint');
                  If(d1.lessThanEqual(0).and(d2.lessThanEqual(0)), () => {
                    trianglePoint.assign(vertexA);
                  }).ElseIf(d3.greaterThanEqual(0).and(d4.lessThanEqual(d3)), () => {
                    trianglePoint.assign(vertexB);
                  }).ElseIf(
                    vc.lessThanEqual(0).and(d1.greaterThanEqual(0)).and(d3.lessThanEqual(0)),
                    () => {
                      const progress = d1.div(d1.sub(d3).max(0.000_001));
                      trianglePoint.assign(vertexA.add(ab.mul(progress)));
                    },
                  ).ElseIf(d6.greaterThanEqual(0).and(d5.lessThanEqual(d6)), () => {
                    trianglePoint.assign(vertexC);
                  }).ElseIf(
                    vb.lessThanEqual(0).and(d2.greaterThanEqual(0)).and(d6.lessThanEqual(0)),
                    () => {
                      const progress = d2.div(d2.sub(d6).max(0.000_001));
                      trianglePoint.assign(vertexA.add(ac.mul(progress)));
                    },
                  ).ElseIf(
                    va.lessThanEqual(0)
                      .and(d4.sub(d3).greaterThanEqual(0))
                      .and(d5.sub(d6).greaterThanEqual(0)),
                    () => {
                      const first = d4.sub(d3);
                      const second = d5.sub(d6);
                      const progress = first.div(first.add(second).max(0.000_001));
                      trianglePoint.assign(vertexB.add(vertexC.sub(vertexB).mul(progress)));
                    },
                  ).Else(() => {
                    const denominator = va.add(vb).add(vc).max(0.000_001).reciprocal();
                    const firstWeight = vb.mul(denominator);
                    const secondWeight = vc.mul(denominator);
                    trianglePoint.assign(
                      vertexA.add(ab.mul(firstWeight)).add(ac.mul(secondWeight)),
                    );
                  });

                  const pointDelta = position.sub(trianglePoint).toVar('rockPointDelta');
                  const pointDistanceSquared = pointDelta.dot(pointDelta)
                    .toVar('rockPointDistanceSquared');
                  If(pointDistanceSquared.lessThan(closestDistanceSquared), () => {
                    closestDistanceSquared.assign(pointDistanceSquared);
                    closestRockPoint.assign(trianglePoint);
                    closestRockFaceNormal.assign(facePlane.xyz);
                  });
                });
              },
            );

            const rockDistance = closestDistanceSquared.sqrt().toVar('rockDistance');
            const rockNormal = closestRockFaceNormal.toVar('rockNormal');
            If(rockDistance.greaterThan(0.000_001), () => {
              rockNormal.assign(select(
                insideRock,
                closestRockPoint.sub(position).div(rockDistance),
                position.sub(closestRockPoint).div(rockDistance),
              ));
            });
            const signedRockDistance = select(insideRock, rockDistance.negate(), rockDistance);
            If(signedRockDistance.lessThan(CLOTH_ROCK_CLEARANCE), () => {
              worldContactEvents.addAssign(1);
              const belowWalkableShoulder = position.y.lessThanEqual(rockMinimum.w);
              const trappedAtFloor = rockNormal.y.lessThan(0)
                .and(position.y.lessThanEqual(caveFloor.add(CLOTH_ROCK_CLEARANCE * 2)));
              If(belowWalkableShoulder.or(trappedAtFloor), () => {
                const planarNormal = vec3(
                  position.x.sub(rockCenterLimit.x),
                  0,
                  position.z.sub(rockCenterLimit.z),
                ).toVar('rockPlanarNormal');
                If(planarNormal.dot(planarNormal).greaterThan(0.000_001), () => {
                  rockNormal.assign(planarNormal.normalize());
                }).Else(() => {
                  rockNormal.assign(vec3(1, 0, 0));
                });
              });
              const remainingAllowance = select(
                hardRockRecovery,
                1_000_000,
                rockCenterLimit.w.sub(rockCorrectionUsed).max(0),
              );
              const rockCorrection = float(CLOTH_ROCK_CLEARANCE)
                .sub(signedRockDistance)
                .min(remainingAllowance)
                .max(0);
              position.addAssign(rockNormal.mul(rockCorrection));
              rockCorrectionUsed.addAssign(rockCorrection);
            });
          });
        },
      );
      position.y.assign(position.y.max(caveFloor));

      const caveCeiling = float(7.3)
        .add(position.z.mul(0.071).add(0.7).sin().mul(0.58))
        .add(position.z.mul(0.21).sin().mul(0.18))
        .add(0.12 - CLOTH_WORLD_CLEARANCE)
        .toVar('caveCeiling');
      position.y.assign(position.y.min(caveCeiling));

      const minimumIntersection = float(1_000_000).toVar('minimumCaveIntersection');
      const maximumIntersection = float(-1_000_000).toVar('maximumCaveIntersection');
      const nearestLeft = float(-1_000_000).toVar('nearestCaveLeft');
      const nearestRight = float(1_000_000).toVar('nearestCaveRight');
      Loop(
        { start: uint(0), end: uint(CAVE.radialSegments), type: 'uint', condition: '<' },
        ({ i }) => {
          const firstA = this.caveShellBuffer.element(
            caveFirstSegment.mul(caveSectionSamples).add(i),
          );
          const firstB = this.caveShellBuffer.element(
            caveSecondSegment.mul(caveSectionSamples).add(i),
          );
          const secondA = this.caveShellBuffer.element(
            caveFirstSegment.mul(caveSectionSamples).add(i).add(1),
          );
          const secondB = this.caveShellBuffer.element(
            caveSecondSegment.mul(caveSectionSamples).add(i).add(1),
          );
          const firstX = mix(firstA.x, firstB.x, caveBlend).toVar('caveFirstX');
          const firstY = mix(firstA.y, firstB.y, caveBlend).toVar('caveFirstY');
          const secondX = mix(secondA.x, secondB.x, caveBlend).toVar('caveSecondX');
          const secondY = mix(secondA.y, secondB.y, caveBlend).toVar('caveSecondY');
          If(firstX.lessThanEqual(caveCenter), () => {
            nearestLeft.assign(nearestLeft.max(firstX));
          });
          If(firstX.greaterThanEqual(caveCenter), () => {
            nearestRight.assign(nearestRight.min(firstX));
          });
          const edgeHeight = secondY.sub(firstY);
          If(
            position.y.greaterThanEqual(firstY.min(secondY))
              .and(position.y.lessThanEqual(firstY.max(secondY)))
              .and(edgeHeight.abs().greaterThan(0.000_001)),
            () => {
              const edgeBlend = position.y.sub(firstY).div(edgeHeight);
              const intersection = mix(firstX, secondX, edgeBlend);
              minimumIntersection.assign(minimumIntersection.min(intersection));
              maximumIntersection.assign(maximumIntersection.max(intersection));
            },
          );
        },
      );
      const minimumX = select(
        minimumIntersection.lessThan(500_000),
        minimumIntersection,
        nearestLeft,
      ).add(CLOTH_WORLD_CLEARANCE).toVar('minimumCaveX');
      const maximumX = select(
        maximumIntersection.greaterThan(-500_000),
        maximumIntersection,
        nearestRight,
      ).sub(CLOTH_WORLD_CLEARANCE).toVar('maximumCaveX');
      If(minimumX.greaterThan(maximumX), () => {
        const center = minimumX.add(maximumX).mul(0.5);
        minimumX.assign(center.sub(0.08));
        maximumX.assign(center.add(0.08));
      });
      position.x.assign(position.x.clamp(minimumX, maximumX));
      const contactCorrection = position.sub(contactStart).toVar('contactCorrection');
      previousPosition.addAssign(contactCorrection);
      If(contactCorrection.dot(contactCorrection).greaterThan(0.000_000_1), () => {
        const contactNormal = contactCorrection.normalize().toVar('contactNormal');
        const inwardMotion = position.sub(previousPosition)
          .dot(contactNormal)
          .min(0)
          .toVar('contactInwardMotion');
        previousPosition.addAssign(contactNormal.mul(inwardMotion));
      });
      }
      this.previousBuffer.element(index).assign(vec4(
        previousPosition,
        rockCorrectionUsed.add(select(rockSweepResolved, 1, 0)),
      ));

        target.element(index).assign(vec4(position, worldContactEvents));
      });
      return float(0);
    }, 'float').setLayout({
      name: `capeProjection${passName}`,
      type: 'float',
      inputs: [
        { name: 'index', type: 'uint' },
        { name: 'hardRockRecovery', type: 'bool' },
      ],
    });
  }

  /**
   * Complementary rock-edge/cloth-face contact. Vertex collision handles
   * ordinary contact; this restores a face-only crossing to the particle's
   * previous continuous position without scatter writes or a corrective
   * impulse that can grow into a spike.
   */
  private createRockFaceColorFunction(
    buffer: typeof this.positionBuffer,
    passName: string,
    allowSweptFaceRecovery = false,
    includeCaveFaceRecovery = false,
  ) {
    const intersectsSegmentTriangle = Fn<
      readonly [
        THREE.Node<'vec3'>,
        THREE.Node<'vec3'>,
        THREE.Node<'vec3'>,
        THREE.Node<'vec3'>,
        THREE.Node<'vec3'>,
      ],
      THREE.Node<'bool'>
    >(([start, end, first, second, third]) => {
      const intersects = bool(false).toVar('segmentTriangleIntersects');
      const direction = end.sub(start).toVar('segmentTriangleDirection');
      const firstEdge = second.sub(first).toVar('segmentTriangleFirstEdge');
      const secondEdge = third.sub(first).toVar('segmentTriangleSecondEdge');
      const determinantVector = cross(direction, secondEdge)
        .toVar('segmentTriangleDeterminantVector');
      const determinant = firstEdge.dot(determinantVector)
        .toVar('segmentTriangleDeterminant');
      If(determinant.abs().greaterThan(0.000_01), () => {
        const inverseDeterminant = determinant.reciprocal();
        const vertexOffset = start.sub(first).toVar('segmentTriangleVertexOffset');
        const firstWeight = vertexOffset.dot(determinantVector)
          .mul(inverseDeterminant)
          .toVar('segmentTriangleFirstWeight');
        const barycentricVector = cross(vertexOffset, firstEdge)
          .toVar('segmentTriangleBarycentricVector');
        const secondWeight = direction.dot(barycentricVector)
          .mul(inverseDeterminant)
          .toVar('segmentTriangleSecondWeight');
        const progress = secondEdge.dot(barycentricVector)
          .mul(inverseDeterminant)
          .toVar('segmentTriangleProgress');
        If(
          firstWeight.greaterThanEqual(-0.000_01)
            .and(firstWeight.lessThanEqual(1.000_01))
            .and(secondWeight.greaterThanEqual(-0.000_01))
            .and(firstWeight.add(secondWeight).lessThanEqual(1.000_01))
            .and(progress.greaterThanEqual(-0.000_01))
            .and(progress.lessThanEqual(1.000_01)),
          () => {
            intersects.assign(bool(true));
          },
        );
      });
      return intersects;
    }, 'bool').setLayout({
      name: `capeRockFaceSegmentTriangle${passName}`,
      type: 'bool',
      inputs: [
        { name: 'start', type: 'vec3' },
        { name: 'end', type: 'vec3' },
        { name: 'first', type: 'vec3' },
        { name: 'second', type: 'vec3' },
        { name: 'third', type: 'vec3' },
      ],
    });
    const trianglesIntersect = (
      clothFirst: THREE.Node<'vec3'>,
      clothSecond: THREE.Node<'vec3'>,
      clothThird: THREE.Node<'vec3'>,
      rockFirst: THREE.Node<'vec3'>,
      rockSecond: THREE.Node<'vec3'>,
      rockThird: THREE.Node<'vec3'>,
    ): THREE.Node<'bool'> => intersectsSegmentTriangle(
      clothFirst,
      clothSecond,
      rockFirst,
      rockSecond,
      rockThird,
    ).or(intersectsSegmentTriangle(
      clothSecond,
      clothThird,
      rockFirst,
      rockSecond,
      rockThird,
    )).or(intersectsSegmentTriangle(
      clothThird,
      clothFirst,
      rockFirst,
      rockSecond,
      rockThird,
    )).or(intersectsSegmentTriangle(
      rockFirst,
      rockSecond,
      clothFirst,
      clothSecond,
      clothThird,
    )).or(intersectsSegmentTriangle(
      rockSecond,
      rockThird,
      clothFirst,
      clothSecond,
      clothThird,
    )).or(intersectsSegmentTriangle(
      rockThird,
      rockFirst,
      clothFirst,
      clothSecond,
      clothThird,
    ));
    const sphereIntersectsTriangle = Fn<
      readonly [
        THREE.Node<'vec4'>,
        THREE.Node<'vec3'>,
        THREE.Node<'vec3'>,
        THREE.Node<'vec3'>,
      ],
      THREE.Node<'bool'>
    >(([sphere, first, second, third]) => {
      const center = sphere.xyz;
      const firstEdge = second.sub(first).toVar('sphereFaceFirstEdge');
      const secondEdge = third.sub(first).toVar('sphereFaceSecondEdge');
      const fromFirst = center.sub(first).toVar('sphereFaceFromFirst');
      const firstFirst = firstEdge.dot(fromFirst).toVar('sphereFaceFirstFirst');
      const firstSecond = secondEdge.dot(fromFirst).toVar('sphereFaceFirstSecond');
      const fromSecond = center.sub(second).toVar('sphereFaceFromSecond');
      const secondFirst = firstEdge.dot(fromSecond).toVar('sphereFaceSecondFirst');
      const secondSecond = secondEdge.dot(fromSecond).toVar('sphereFaceSecondSecond');
      const fromThird = center.sub(third).toVar('sphereFaceFromThird');
      const thirdFirst = firstEdge.dot(fromThird).toVar('sphereFaceThirdFirst');
      const thirdSecond = secondEdge.dot(fromThird).toVar('sphereFaceThirdSecond');
      const firstRegion = firstFirst.mul(secondSecond)
        .sub(secondFirst.mul(firstSecond))
        .toVar('sphereFaceFirstRegion');
      const secondRegion = thirdFirst.mul(firstSecond)
        .sub(firstFirst.mul(thirdSecond))
        .toVar('sphereFaceSecondRegion');
      const thirdRegion = secondFirst.mul(thirdSecond)
        .sub(thirdFirst.mul(secondSecond))
        .toVar('sphereFaceThirdRegion');
      const closest = first.toVar('sphereFaceClosest');
      If(firstFirst.lessThanEqual(0).and(firstSecond.lessThanEqual(0)), () => {
        closest.assign(first);
      }).ElseIf(secondFirst.greaterThanEqual(0).and(secondSecond.lessThanEqual(secondFirst)), () => {
        closest.assign(second);
      }).ElseIf(
        firstRegion.lessThanEqual(0)
          .and(firstFirst.greaterThanEqual(0))
          .and(secondFirst.lessThanEqual(0)),
        () => {
          const progress = firstFirst.div(firstFirst.sub(secondFirst).max(0.000_001));
          closest.assign(first.add(firstEdge.mul(progress)));
        },
      ).ElseIf(thirdSecond.greaterThanEqual(0).and(thirdFirst.lessThanEqual(thirdSecond)), () => {
        closest.assign(third);
      }).ElseIf(
        secondRegion.lessThanEqual(0)
          .and(firstSecond.greaterThanEqual(0))
          .and(thirdSecond.lessThanEqual(0)),
        () => {
          const progress = firstSecond.div(firstSecond.sub(thirdSecond).max(0.000_001));
          closest.assign(first.add(secondEdge.mul(progress)));
        },
      ).ElseIf(
        thirdRegion.lessThanEqual(0)
          .and(secondSecond.sub(secondFirst).greaterThanEqual(0))
          .and(thirdFirst.sub(thirdSecond).greaterThanEqual(0)),
        () => {
          const firstDistance = secondSecond.sub(secondFirst);
          const secondDistance = thirdFirst.sub(thirdSecond);
          const progress = firstDistance.div(firstDistance.add(secondDistance).max(0.000_001));
          closest.assign(second.add(third.sub(second).mul(progress)));
        },
      ).Else(() => {
        const denominator = thirdRegion.add(secondRegion).add(firstRegion)
          .max(0.000_001)
          .reciprocal();
        closest.assign(
          first
            .add(firstEdge.mul(secondRegion.mul(denominator)))
            .add(secondEdge.mul(firstRegion.mul(denominator))),
        );
      });
      return closest.sub(center).dot(closest.sub(center))
        .lessThan(sphere.w.mul(sphere.w));
    }, 'bool').setLayout({
      name: `capeSphereFaceTriangle${passName}`,
      type: 'bool',
      inputs: [
        { name: 'sphere', type: 'vec4' },
        { name: 'first', type: 'vec3' },
        { name: 'second', type: 'vec3' },
        { name: 'third', type: 'vec3' },
      ],
    });
    const getCaveWallCorrection = includeCaveFaceRecovery ? Fn<
      readonly [THREE.Node<'vec3'>],
      THREE.Node<'float'>
    >(([sample]) => {
      const segmentPosition = float(CAVE.startZ).sub(sample.z)
        .div(CAVE.startZ - CAVE.endZ)
        .clamp(0, 1)
        .mul(CAVE.segments)
        .toVar('caveFaceSegmentPosition');
      const firstSegment = uint(segmentPosition.floor()).toVar('caveFaceFirstSegment');
      const secondSegment = select(
        firstSegment.lessThan(uint(CAVE.segments)),
        firstSegment.add(1),
        firstSegment,
      ).toVar('caveFaceSecondSegment');
      const blend = segmentPosition.sub(float(firstSegment)).toVar('caveFaceBlend');
      const sectionSamples = uint(CAVE.radialSegments + 1);
      const center = sample.z.sub(10).mul(0.055).sin().mul(2.05)
        .add(sample.z.add(5).mul(0.137).sin().mul(0.38))
        .toVar('caveFaceCenter');
      const minimumIntersection = float(1_000_000).toVar('caveFaceMinimumIntersection');
      const maximumIntersection = float(-1_000_000).toVar('caveFaceMaximumIntersection');
      const nearestLeft = float(-1_000_000).toVar('caveFaceNearestLeft');
      const nearestRight = float(1_000_000).toVar('caveFaceNearestRight');
      Loop(
        { start: uint(0), end: uint(CAVE.radialSegments), type: 'uint', condition: '<' },
        ({ i }) => {
          const firstA = this.caveShellBuffer.element(
            firstSegment.mul(sectionSamples).add(i),
          );
          const firstB = this.caveShellBuffer.element(
            secondSegment.mul(sectionSamples).add(i),
          );
          const secondA = this.caveShellBuffer.element(
            firstSegment.mul(sectionSamples).add(i).add(1),
          );
          const secondB = this.caveShellBuffer.element(
            secondSegment.mul(sectionSamples).add(i).add(1),
          );
          const firstX = mix(firstA.x, firstB.x, blend).toVar('caveFaceFirstX');
          const firstY = mix(firstA.y, firstB.y, blend).toVar('caveFaceFirstY');
          const secondX = mix(secondA.x, secondB.x, blend).toVar('caveFaceSecondX');
          const secondY = mix(secondA.y, secondB.y, blend).toVar('caveFaceSecondY');
          If(firstX.lessThanEqual(center), () => {
            nearestLeft.assign(nearestLeft.max(firstX));
          });
          If(firstX.greaterThanEqual(center), () => {
            nearestRight.assign(nearestRight.min(firstX));
          });
          const edgeHeight = secondY.sub(firstY);
          If(
            sample.y.greaterThanEqual(firstY.min(secondY))
              .and(sample.y.lessThanEqual(firstY.max(secondY)))
              .and(edgeHeight.abs().greaterThan(0.000_001)),
            () => {
              const edgeBlend = sample.y.sub(firstY).div(edgeHeight);
              const intersection = mix(firstX, secondX, edgeBlend);
              minimumIntersection.assign(minimumIntersection.min(intersection));
              maximumIntersection.assign(maximumIntersection.max(intersection));
            },
          );
        },
      );
      const minimumX = select(
        minimumIntersection.lessThan(500_000),
        minimumIntersection,
        nearestLeft,
      ).add(CLOTH_WORLD_CLEARANCE).toVar('caveFaceMinimumX');
      const maximumX = select(
        maximumIntersection.greaterThan(-500_000),
        maximumIntersection,
        nearestRight,
      ).sub(CLOTH_WORLD_CLEARANCE).toVar('caveFaceMaximumX');
      If(minimumX.greaterThan(maximumX), () => {
        const midpoint = minimumX.add(maximumX).mul(0.5);
        minimumX.assign(midpoint.sub(0.08));
        maximumX.assign(midpoint.add(0.08));
      });
      const correction = float(0).toVar('caveFaceSampleCorrection');
      If(sample.x.lessThan(minimumX), () => {
        correction.assign(minimumX.sub(sample.x));
      }).ElseIf(sample.x.greaterThan(maximumX), () => {
        correction.assign(maximumX.sub(sample.x));
      });
      return correction;
    }, 'float').setLayout({
      name: `capeCaveFaceSample${passName}`,
      type: 'float',
      inputs: [{ name: 'sample', type: 'vec3' }],
    }) : null;

    return Fn<readonly [THREE.Node<'uint'>], THREE.Node<'float'>>(([color]) => {
      const orientation = color.mod(uint(2));
      const columnParity = color.div(uint(2)).mod(uint(2));
      const rowParity = color.div(uint(4));
      const coloredColumns = uint(Math.ceil((CAPE.columns - 1) / 2));
      const coloredRows = select(
        rowParity.equal(uint(0)),
        uint(Math.ceil((CAPE.rows - 1) / 2)),
        uint(Math.floor((CAPE.rows - 1) / 2)),
      );
      const triangleSlot = instanceIndex;
      If(triangleSlot.lessThan(coloredRows.mul(coloredColumns)), () => {
        const localRow = triangleSlot.div(coloredColumns);
        const localColumn = triangleSlot.mod(coloredColumns);
        const cellRow = rowParity.add(localRow.mul(2));
        const cellColumn = columnParity.add(localColumn.mul(2));
        const topLeft = cellRow.mul(uint(CAPE.columns)).add(cellColumn);
        const bottomLeft = topLeft.add(uint(CAPE.columns));
        const firstIndex = select(orientation.equal(uint(0)), topLeft, bottomLeft);
        const secondIndex = select(
          orientation.equal(uint(0)),
          bottomLeft,
          bottomLeft.add(1),
        );
        const thirdIndex = topLeft.add(1);
        const first = buffer.element(firstIndex).xyz;
        const second = buffer.element(secondIndex).xyz;
        const third = buffer.element(thirdIndex).xyz;
        const previousFirst = this.previousBuffer.element(firstIndex).xyz;
        const previousSecond = this.previousBuffer.element(secondIndex).xyz;
        const previousThird = this.previousBuffer.element(thirdIndex).xyz;
        const sweptFirstQuarter = mix(previousFirst, first, 0.25);
        const sweptSecondQuarter = mix(previousSecond, second, 0.25);
        const sweptThirdQuarter = mix(previousThird, third, 0.25);
        const sweptFirstHalf = mix(previousFirst, first, 0.5);
        const sweptSecondHalf = mix(previousSecond, second, 0.5);
        const sweptThirdHalf = mix(previousThird, third, 0.5);
        const sweptFirstThreeQuarter = mix(previousFirst, first, 0.75);
        const sweptSecondThreeQuarter = mix(previousSecond, second, 0.75);
        const sweptThirdThreeQuarter = mix(previousThird, third, 0.75);
        const triangleMinimum = first.min(second).min(third)
          .sub(CLOTH_ROCK_CLEARANCE);
        const triangleMaximum = first.max(second).max(third)
          .add(CLOTH_ROCK_CLEARANCE);
        const previousTriangleMinimum = previousFirst.min(previousSecond).min(previousThird);
        const previousTriangleMaximum = previousFirst.max(previousSecond).max(previousThird);
        const sweptTriangleMinimum = triangleMinimum.min(
          previousTriangleMinimum.sub(CLOTH_ROCK_CLEARANCE),
        );
        const sweptTriangleMaximum = triangleMaximum.max(
          previousTriangleMaximum.add(CLOTH_ROCK_CLEARANCE),
        );
        const faceTriangleMinimum = allowSweptFaceRecovery
          ? sweptTriangleMinimum
          : triangleMinimum;
        const faceTriangleMaximum = allowSweptFaceRecovery
          ? sweptTriangleMaximum
          : triangleMaximum;
        const faceCorrection = vec3(0).toVar('rockFaceCorrection');
        const hadFaceContact = bool(false).toVar('rockFaceHadContact');
        const previousTriangleSafe = bool(true).toVar('rockFacePreviousTriangleSafe');
        Loop(
          {
            start: uint(0),
            end: uint(this.worldSphereCountUniform),
            type: 'uint',
            condition: '<',
          },
          ({ i: sphereIndex }) => {
            const sphere = this.worldSphereBuffer.element(sphereIndex);
            const overlapsSphere = faceTriangleMaximum.x
              .greaterThanEqual(sphere.x.sub(sphere.w))
              .and(faceTriangleMinimum.x.lessThanEqual(sphere.x.add(sphere.w)))
              .and(faceTriangleMaximum.y.greaterThanEqual(sphere.y.sub(sphere.w)))
              .and(faceTriangleMinimum.y.lessThanEqual(sphere.y.add(sphere.w)))
              .and(faceTriangleMaximum.z.greaterThanEqual(sphere.z.sub(sphere.w)))
              .and(faceTriangleMinimum.z.lessThanEqual(sphere.z.add(sphere.w)));
            If(overlapsSphere, () => {
              const previousIntersects = sphereIntersectsTriangle(
                sphere,
                previousFirst,
                previousSecond,
                previousThird,
              );
              If(previousIntersects, () => {
                previousTriangleSafe.assign(bool(false));
              });
              const currentIntersects = sphereIntersectsTriangle(
                sphere,
                first,
                second,
                third,
              );
              const intersects = allowSweptFaceRecovery
                ? currentIntersects.or(sphereIntersectsTriangle(
                  sphere,
                  sweptFirstQuarter,
                  sweptSecondQuarter,
                  sweptThirdQuarter,
                )).or(sphereIntersectsTriangle(
                  sphere,
                  sweptFirstHalf,
                  sweptSecondHalf,
                  sweptThirdHalf,
                )).or(sphereIntersectsTriangle(
                  sphere,
                  sweptFirstThreeQuarter,
                  sweptSecondThreeQuarter,
                  sweptThirdThreeQuarter,
                ))
                : currentIntersects;
              If(intersects, () => {
                const centroid = first.add(second).add(third).div(3);
                const resolvedNormal = centroid.sub(sphere.xyz)
                  .toVar('sphereFaceResolvedNormal');
                If(resolvedNormal.dot(resolvedNormal).greaterThan(0.000_001), () => {
                  resolvedNormal.assign(resolvedNormal.normalize());
                }).Else(() => {
                  resolvedNormal.assign(vec3(1, 0, 0));
                });
                faceCorrection.addAssign(
                  resolvedNormal.mul(CLOTH_WORLD_CLEARANCE * 1.5),
                );
                hadFaceContact.assign(bool(true));
              });
            });
          },
        );
        Loop(
          { start: uint(0), end: uint(this.rockCountUniform), type: 'uint', condition: '<' },
          ({ i: rockIndex }) => {
            const rockBase = rockIndex.mul(uint(ROCK_BUFFER_STRIDE));
            const rockMinimum = this.rockBuffer.element(rockBase.add(1));
            const rockMaximum = this.rockBuffer.element(rockBase.add(2));
            const overlapsRock = faceTriangleMaximum.x.greaterThanEqual(rockMinimum.x)
              .and(faceTriangleMinimum.x.lessThanEqual(rockMaximum.x))
              .and(faceTriangleMaximum.y.greaterThanEqual(rockMinimum.y))
              .and(faceTriangleMinimum.y.lessThanEqual(rockMaximum.y))
              .and(faceTriangleMaximum.z.greaterThanEqual(rockMinimum.z))
              .and(faceTriangleMinimum.z.lessThanEqual(rockMaximum.z));
            If(overlapsRock, () => {
              const previousOverlapsRock = previousTriangleMaximum.x
                .greaterThanEqual(rockMinimum.x)
                .and(previousTriangleMinimum.x.lessThanEqual(rockMaximum.x))
                .and(previousTriangleMaximum.y.greaterThanEqual(rockMinimum.y))
                .and(previousTriangleMinimum.y.lessThanEqual(rockMaximum.y))
                .and(previousTriangleMaximum.z.greaterThanEqual(rockMinimum.z))
                .and(previousTriangleMinimum.z.lessThanEqual(rockMaximum.z));
              const triangleIntersects = bool(false).toVar('rockFaceTriangleIntersects');
              const previousTriangleIntersects = bool(false)
                .toVar('rockFacePreviousTriangleIntersects');
              const previousFirstInside = previousOverlapsRock
                .toVar('rockFacePreviousFirstInside');
              const previousSecondInside = previousOverlapsRock
                .toVar('rockFacePreviousSecondInside');
              const previousThirdInside = previousOverlapsRock
                .toVar('rockFacePreviousThirdInside');
              Loop(
                {
                  start: uint(0),
                  end: uint(ROCK_FACES_PER_COLLIDER),
                  type: 'uint',
                  condition: '<',
                },
                ({ i: rockFaceOffset }) => {
                  const rockFaceBase = rockBase.add(4).add(rockFaceOffset.mul(4));
                  const rockFirst = this.rockBuffer.element(rockFaceBase).xyz;
                  const rockSecond = this.rockBuffer.element(rockFaceBase.add(1)).xyz;
                  const rockThird = this.rockBuffer.element(rockFaceBase.add(2)).xyz;
                  const rockPlane = this.rockBuffer.element(rockFaceBase.add(3));
                  const rockFaceMinimum = rockFirst.min(rockSecond).min(rockThird);
                  const rockFaceMaximum = rockFirst.max(rockSecond).max(rockThird);
                  const overlapsRockFace = faceTriangleMaximum.x
                    .greaterThanEqual(rockFaceMinimum.x)
                    .and(faceTriangleMinimum.x.lessThanEqual(rockFaceMaximum.x))
                    .and(faceTriangleMaximum.y.greaterThanEqual(rockFaceMinimum.y))
                    .and(faceTriangleMinimum.y.lessThanEqual(rockFaceMaximum.y))
                    .and(faceTriangleMaximum.z.greaterThanEqual(rockFaceMinimum.z))
                    .and(faceTriangleMinimum.z.lessThanEqual(rockFaceMaximum.z));
                  If(overlapsRockFace, () => {
                    const currentIntersects = trianglesIntersect(
                      first,
                      second,
                      third,
                      rockFirst,
                      rockSecond,
                      rockThird,
                    );
                    const intersects = allowSweptFaceRecovery
                      ? currentIntersects.or(trianglesIntersect(
                        sweptFirstQuarter,
                        sweptSecondQuarter,
                        sweptThirdQuarter,
                        rockFirst,
                        rockSecond,
                        rockThird,
                      )).or(trianglesIntersect(
                        sweptFirstHalf,
                        sweptSecondHalf,
                        sweptThirdHalf,
                        rockFirst,
                        rockSecond,
                        rockThird,
                      )).or(trianglesIntersect(
                        sweptFirstThreeQuarter,
                        sweptSecondThreeQuarter,
                        sweptThirdThreeQuarter,
                        rockFirst,
                        rockSecond,
                        rockThird,
                      ))
                      : currentIntersects;
                    If(intersects, () => {
                      triangleIntersects.assign(bool(true));
                    });
                  });
                  If(previousOverlapsRock, () => {
                    If(rockPlane.xyz.dot(previousFirst).sub(rockPlane.w).greaterThan(0.000_001), () => {
                      previousFirstInside.assign(bool(false));
                    });
                    If(rockPlane.xyz.dot(previousSecond).sub(rockPlane.w).greaterThan(0.000_001), () => {
                      previousSecondInside.assign(bool(false));
                    });
                    If(rockPlane.xyz.dot(previousThird).sub(rockPlane.w).greaterThan(0.000_001), () => {
                      previousThirdInside.assign(bool(false));
                    });
                    const previousOverlapsRockFace = previousTriangleMaximum.x
                      .greaterThanEqual(rockFaceMinimum.x)
                      .and(previousTriangleMinimum.x.lessThanEqual(rockFaceMaximum.x))
                      .and(previousTriangleMaximum.y.greaterThanEqual(rockFaceMinimum.y))
                      .and(previousTriangleMinimum.y.lessThanEqual(rockFaceMaximum.y))
                      .and(previousTriangleMaximum.z.greaterThanEqual(rockFaceMinimum.z))
                      .and(previousTriangleMinimum.z.lessThanEqual(rockFaceMaximum.z));
                    If(previousOverlapsRockFace, () => {
                      const previousIntersects = trianglesIntersect(
                        previousFirst,
                        previousSecond,
                        previousThird,
                        rockFirst,
                        rockSecond,
                        rockThird,
                      );
                      If(previousIntersects, () => {
                        previousTriangleIntersects.assign(bool(true));
                      });
                    });
                  });
                },
              );
              If(
                previousTriangleIntersects
                  .or(previousFirstInside)
                  .or(previousSecondInside)
                  .or(previousThirdInside),
                () => {
                  previousTriangleSafe.assign(bool(false));
                },
              );
              If(triangleIntersects, () => {
                const centroid = first.add(second).add(third).div(3)
                  .toVar('rockFaceCentroid');
                const resolvedNormal = centroid.sub(
                  this.rockBuffer.element(rockBase).xyz,
                )
                  .toVar('rockFaceResolvedNormal');
                If(resolvedNormal.dot(resolvedNormal).greaterThan(0.000_001), () => {
                  resolvedNormal.assign(resolvedNormal.normalize());
                }).Else(() => {
                  resolvedNormal.assign(vec3(1, 0, 0));
                });
                const belowWalkableShoulder = centroid.y.lessThanEqual(rockMinimum.w);
                const trappedAtFloor = resolvedNormal.y.lessThan(0)
                  .and(centroid.y.lessThanEqual(rockMinimum.y.add(CLOTH_ROCK_CLEARANCE * 2)));
                If(belowWalkableShoulder.or(trappedAtFloor), () => {
                  resolvedNormal.y.assign(0);
                  If(resolvedNormal.dot(resolvedNormal).greaterThan(0.000_001), () => {
                    resolvedNormal.assign(resolvedNormal.normalize());
                  }).Else(() => {
                    resolvedNormal.assign(vec3(1, 0, 0));
                  });
                });
                faceCorrection.addAssign(
                  resolvedNormal.mul(CLOTH_ROCK_CLEARANCE * 1.5),
                );
                hadFaceContact.assign(bool(true));
              });
            });
          },
        );
        if (getCaveWallCorrection) {
          const caveFaceCorrection = getCaveWallCorrection(
            first.add(second).add(third).div(3),
          ).toVar('caveFaceCorrection');
          const keepLargerCaveCorrection = (candidate: THREE.Node<'float'>): void => {
            If(candidate.abs().greaterThan(caveFaceCorrection.abs()), () => {
              caveFaceCorrection.assign(candidate);
            });
          };
          keepLargerCaveCorrection(getCaveWallCorrection(first.add(second).mul(0.5)));
          keepLargerCaveCorrection(getCaveWallCorrection(first.add(third).mul(0.5)));
          keepLargerCaveCorrection(getCaveWallCorrection(second.add(third).mul(0.5)));
          If(caveFaceCorrection.abs().greaterThan(0.000_001), () => {
            faceCorrection.x.addAssign(caveFaceCorrection.clamp(-0.015, 0.015));
            hadFaceContact.assign(bool(true));
            // A previous cloth face can pierce the same curved wall, so cave
            // recovery must use the sampled separating correction, not rollback.
            previousTriangleSafe.assign(bool(false));
          });
        }
        const correctionLength = faceCorrection.length().toVar('rockFaceCorrectionLength');
        If(correctionLength.greaterThan(0.015), () => {
          faceCorrection.mulAssign(float(0.015).div(correctionLength));
        });
        If(hadFaceContact.and(previousTriangleSafe), () => {
          const restorePrevious = (
            particleIndex: THREE.Node<'uint'>,
            previousPosition: THREE.Node<'vec3'>,
          ): void => {
            If(particleIndex.greaterThanEqual(uint(CAPE.columns)), () => {
              const state = buffer.element(particleIndex);
              buffer.element(particleIndex).assign(vec4(
                previousPosition,
                state.w.add(1),
              ));
            });
          };
          restorePrevious(firstIndex, previousFirst);
          restorePrevious(secondIndex, previousSecond);
          restorePrevious(thirdIndex, previousThird);
        }).ElseIf(hadFaceContact, () => {
          const applyCorrection = (particleIndex: THREE.Node<'uint'>): void => {
            If(particleIndex.greaterThanEqual(uint(CAPE.columns)), () => {
              const state = buffer.element(particleIndex);
              const corrected = state.xyz.add(faceCorrection).toVar('correctedRockFace');
              buffer.element(particleIndex).assign(vec4(
                corrected,
                state.w.add(1),
              ));
              const previousState = this.previousBuffer.element(particleIndex);
              const correctedPrevious = previousState.xyz
                .add(faceCorrection)
                .toVar('correctedPreviousRockFace');
              const faceNormal = faceCorrection.normalize().toVar('rockFaceMotionNormal');
              const inwardMotion = corrected.sub(correctedPrevious)
                .dot(faceNormal)
                .min(0);
              correctedPrevious.addAssign(faceNormal.mul(inwardMotion));
              this.previousBuffer.element(particleIndex).assign(vec4(
                correctedPrevious,
                previousState.w,
              ));
            });
          };
          applyCorrection(firstIndex);
          applyCorrection(secondIndex);
          applyCorrection(thirdIndex);
        });
      });
      return float(0);
    }, 'float').setLayout({
      name: `capeRockFaceColorPass${passName}`,
      type: 'float',
      inputs: [{ name: 'color', type: 'uint' }],
    });
  }

  /**
   * Resolves body-capsule points against cloth faces with a graph-colored
   * triangle schedule. Triangles in one color share no vertices, so an
   * invocation can apply the CPU solver's barycentric correction to all
   * three particles without atomics or competing scatter writes.
   */
  private createBodyFaceColorFunction(
    buffer: typeof this.positionBuffer,
    passName: string,
  ) {
    return Fn<readonly [THREE.Node<'uint'>], THREE.Node<'float'>>(([color]) => {
      const orientation = color.mod(uint(2));
      const columnParity = color.div(uint(2)).mod(uint(2));
      const rowParity = color.div(uint(4));
      const coloredColumns = uint(Math.ceil((CAPE.columns - 1) / 2));
      const coloredRows = select(
        rowParity.equal(uint(0)),
        uint(Math.ceil((CAPE.rows - 1) / 2)),
        uint(Math.floor((CAPE.rows - 1) / 2)),
      );
      const triangleSlot = instanceIndex;
      If(triangleSlot.lessThan(coloredRows.mul(coloredColumns)), () => {
        const localRow = triangleSlot.div(coloredColumns);
        const localColumn = triangleSlot.mod(coloredColumns);
        const cellRow = rowParity.add(localRow.mul(2));
        const cellColumn = columnParity.add(localColumn.mul(2));
        const topLeft = cellRow.mul(uint(CAPE.columns)).add(cellColumn);
        const bottomLeft = topLeft.add(uint(CAPE.columns));
        const firstIndex = select(orientation.equal(uint(0)), topLeft, bottomLeft);
        const secondIndex = select(
          orientation.equal(uint(0)),
          bottomLeft,
          bottomLeft.add(1),
        );
        const thirdIndex = topLeft.add(1);
        const firstState = buffer.element(firstIndex);
        const secondState = buffer.element(secondIndex);
        const thirdState = buffer.element(thirdIndex);
        const firstStart = firstState.xyz.toVar('bodyFaceFirstStart');
        const secondStart = secondState.xyz.toVar('bodyFaceSecondStart');
        const thirdStart = thirdState.xyz.toVar('bodyFaceThirdStart');
        const first = firstStart.toVar('bodyFaceFirst');
        const second = secondStart.toVar('bodyFaceSecond');
        const third = thirdStart.toVar('bodyFaceThird');
        const firstMass = select(firstIndex.lessThan(uint(CAPE.columns)), 0, 1);
        const secondMass = select(secondIndex.lessThan(uint(CAPE.columns)), 0, 1);
        const thirdMass = select(thirdIndex.lessThan(uint(CAPE.columns)), 0, 1);
        const triangleMinimum = first.min(second).min(third);
        const triangleMaximum = first.max(second).max(third);

        Loop(
          { start: uint(0), end: uint(this.bodyCountUniform), type: 'uint', condition: '<' },
          ({ i: bodyIndex }) => {
            const bodyBase = bodyIndex.mul(uint(BODY_BUFFER_STRIDE));
            const startRadius = this.bodyBuffer.element(bodyBase);
            const axisDepth = this.bodyBuffer.element(bodyBase.add(1));
            const faceInfo = this.bodyBuffer.element(bodyBase.add(4));
            const segments = uint(faceInfo.x);
            const lateralRadius = faceInfo.y;
            const depthRadius = faceInfo.z;
            const boundsRadius = lateralRadius.max(depthRadius);
            const bodyEnd = startRadius.xyz.add(axisDepth.xyz);
            const bodyMinimum = startRadius.xyz.min(bodyEnd).sub(boundsRadius);
            const bodyMaximum = startRadius.xyz.max(bodyEnd).add(boundsRadius);
            const overlapsBody = bodyMaximum.x.greaterThanEqual(triangleMinimum.x)
              .and(bodyMinimum.x.lessThanEqual(triangleMaximum.x))
              .and(bodyMaximum.y.greaterThanEqual(triangleMinimum.y))
              .and(bodyMinimum.y.lessThanEqual(triangleMaximum.y))
              .and(bodyMaximum.z.greaterThanEqual(triangleMinimum.z))
              .and(bodyMinimum.z.lessThanEqual(triangleMaximum.z));
            If(overlapsBody, () => {
              Loop(
                { start: uint(0), end: segments.add(1), type: 'uint', condition: '<' },
                ({ i: sampleIndex }) => {
                  const progress = select(
                    segments.greaterThan(uint(0)),
                    float(sampleIndex).div(float(segments)),
                    0,
                  );
                  const center = startRadius.xyz.add(axisDepth.xyz.mul(progress));
                  const overlapsBounds = center.x.add(boundsRadius)
                    .greaterThanEqual(triangleMinimum.x)
                    .and(center.x.sub(boundsRadius).lessThanEqual(triangleMaximum.x))
                    .and(center.y.add(boundsRadius).greaterThanEqual(triangleMinimum.y))
                    .and(center.y.sub(boundsRadius).lessThanEqual(triangleMaximum.y))
                    .and(center.z.add(boundsRadius).greaterThanEqual(triangleMinimum.z))
                    .and(center.z.sub(boundsRadius).lessThanEqual(triangleMaximum.z));
                  If(overlapsBounds, () => {
                    const ab = second.sub(first).toVar('coloredBodyFaceAB');
                    const ac = third.sub(first).toVar('coloredBodyFaceAC');
                    const ap = center.sub(first).toVar('coloredBodyFaceAP');
                    const d1 = ab.dot(ap).toVar('coloredBodyFaceD1');
                    const d2 = ac.dot(ap).toVar('coloredBodyFaceD2');
                    const bp = center.sub(second).toVar('coloredBodyFaceBP');
                    const d3 = ab.dot(bp).toVar('coloredBodyFaceD3');
                    const d4 = ac.dot(bp).toVar('coloredBodyFaceD4');
                    const cp = center.sub(third).toVar('coloredBodyFaceCP');
                    const d5 = ab.dot(cp).toVar('coloredBodyFaceD5');
                    const d6 = ac.dot(cp).toVar('coloredBodyFaceD6');
                    const vc = d1.mul(d4).sub(d3.mul(d2)).toVar('coloredBodyFaceVC');
                    const vb = d5.mul(d2).sub(d1.mul(d6)).toVar('coloredBodyFaceVB');
                    const va = d3.mul(d6).sub(d5.mul(d4)).toVar('coloredBodyFaceVA');
                    const closest = first.toVar('coloredBodyFaceClosest');
                    const barycentric = vec3(1, 0, 0).toVar('coloredBodyFaceBarycentric');
                    If(d1.lessThanEqual(0).and(d2.lessThanEqual(0)), () => {
                      closest.assign(first);
                      barycentric.assign(vec3(1, 0, 0));
                    }).ElseIf(d3.greaterThanEqual(0).and(d4.lessThanEqual(d3)), () => {
                      closest.assign(second);
                      barycentric.assign(vec3(0, 1, 0));
                    }).ElseIf(
                      vc.lessThanEqual(0).and(d1.greaterThanEqual(0)).and(d3.lessThanEqual(0)),
                      () => {
                        const edge = d1.div(d1.sub(d3).max(0.000_001));
                        closest.assign(first.add(ab.mul(edge)));
                        barycentric.assign(vec3(float(1).sub(edge), edge, 0));
                      },
                    ).ElseIf(d6.greaterThanEqual(0).and(d5.lessThanEqual(d6)), () => {
                      closest.assign(third);
                      barycentric.assign(vec3(0, 0, 1));
                    }).ElseIf(
                      vb.lessThanEqual(0).and(d2.greaterThanEqual(0)).and(d6.lessThanEqual(0)),
                      () => {
                        const edge = d2.div(d2.sub(d6).max(0.000_001));
                        closest.assign(first.add(ac.mul(edge)));
                        barycentric.assign(vec3(float(1).sub(edge), 0, edge));
                      },
                    ).ElseIf(
                      va.lessThanEqual(0)
                        .and(d4.sub(d3).greaterThanEqual(0))
                        .and(d5.sub(d6).greaterThanEqual(0)),
                      () => {
                        const firstEdge = d4.sub(d3);
                        const secondEdge = d5.sub(d6);
                        const edge = firstEdge.div(firstEdge.add(secondEdge).max(0.000_001));
                        closest.assign(second.add(third.sub(second).mul(edge)));
                        barycentric.assign(vec3(0, float(1).sub(edge), edge));
                      },
                    ).Else(() => {
                      const reciprocal = va.add(vb).add(vc).max(0.000_001).reciprocal();
                      const secondWeight = vb.mul(reciprocal);
                      const thirdWeight = vc.mul(reciprocal);
                      barycentric.assign(vec3(
                        float(1).sub(secondWeight).sub(thirdWeight),
                        secondWeight,
                        thirdWeight,
                      ));
                      closest.assign(first.add(ab.mul(secondWeight)).add(ac.mul(thirdWeight)));
                    });

                    const delta = closest.sub(center).toVar('coloredBodyFaceDelta');
                    const depth = delta.dot(this.backUniform).toVar('coloredBodyFaceDepth');
                    const lateralSquared = delta.dot(delta)
                      .sub(depth.mul(depth))
                      .max(0)
                      .toVar('coloredBodyFaceLateralSquared');
                    If(lateralSquared.lessThan(lateralRadius.mul(lateralRadius)), () => {
                      const surfaceDepth = depthRadius.mul(
                        float(1).sub(
                          lateralSquared.div(lateralRadius.mul(lateralRadius)),
                        ).max(0).sqrt(),
                      );
                      const penetration = surfaceDepth.sub(depth).max(0);
                      const denominator = firstMass.mul(barycentric.x.mul(barycentric.x))
                        .add(secondMass.mul(barycentric.y.mul(barycentric.y)))
                        .add(thirdMass.mul(barycentric.z.mul(barycentric.z)));
                      If(
                        penetration.greaterThan(0)
                          .and(denominator.greaterThan(0.000_001)),
                        () => {
                          const lambda = penetration.div(denominator);
                          first.addAssign(this.backUniform.mul(
                            firstMass.mul(barycentric.x).mul(lambda),
                          ));
                          second.addAssign(this.backUniform.mul(
                            secondMass.mul(barycentric.y).mul(lambda),
                          ));
                          third.addAssign(this.backUniform.mul(
                            thirdMass.mul(barycentric.z).mul(lambda),
                          ));
                        },
                      );
                    });
                  });
                },
              );
            });
          },
        );

        const storeCorrection = (
          particleIndex: THREE.Node<'uint'>,
          state: THREE.Node<'vec4'>,
          start: THREE.Node<'vec3'>,
          corrected: THREE.Node<'vec3'>,
        ): void => {
          buffer.element(particleIndex).assign(vec4(corrected, state.w));
          const previousState = this.previousBuffer.element(particleIndex);
          const correctedPrevious = previousState.xyz
            .add(corrected.sub(start))
            .toVar('correctedPreviousBodyFace');
          const inwardMotion = corrected.sub(correctedPrevious)
            .dot(this.backUniform)
            .min(0);
          correctedPrevious.addAssign(this.backUniform.mul(inwardMotion));
          this.previousBuffer.element(particleIndex).assign(vec4(
            correctedPrevious,
            previousState.w,
          ));
        };
        storeCorrection(firstIndex, firstState, firstStart, first);
        storeCorrection(secondIndex, secondState, secondStart, second);
        storeCorrection(thirdIndex, thirdState, thirdStart, third);
      });
      return float(0);
    }, 'float').setLayout({
      name: `capeBodyFaceColorPass${passName}`,
      type: 'float',
      inputs: [{ name: 'color', type: 'uint' }],
    });
  }

  private createInitialState(): Float32Array {
    const state = new Float32Array(PARTICLE_COUNT * 4);
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = row * CAPE.columns + column;
        const position = this.diagnosticMirror.getParticlePosition(column, row);
        state[index * 4] = position.x;
        state[index * 4 + 1] = position.y;
        state[index * 4 + 2] = position.z;
        state[index * 4 + 3] = 0;
      }
    }
    return state;
  }

  private createTopology(initialState: Float32Array): {
    readonly packed: Float32Array;
    readonly normalNeighbors: Uint32Array;
    readonly coloredConstraints: Float32Array;
    readonly coloredConstraintRanges: readonly ColoredConstraintRange[];
  } {
    const constraints: ConstraintDefinition[] = [];
    const readPosition = (index: number): THREE.Vector3 => new THREE.Vector3(
      initialState[index * 4] ?? 0,
      initialState[index * 4 + 1] ?? 0,
      initialState[index * 4 + 2] ?? 0,
    );
    const addConstraint = (
      firstColumn: number,
      firstRow: number,
      secondColumn: number,
      secondRow: number,
      stiffness: number,
    ): void => {
      const first = firstRow * CAPE.columns + firstColumn;
      const second = secondRow * CAPE.columns + secondColumn;
      constraints.push({
        first,
        second,
        restLength: readPosition(first).distanceTo(readPosition(second)),
        stiffness,
      });
    };
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        if (column + 1 < CAPE.columns) addConstraint(column, row, column + 1, row, 0.93);
        if (row + 1 < CAPE.rows) addConstraint(column, row, column, row + 1, 0.96);
        if (column + 1 < CAPE.columns && row + 1 < CAPE.rows) {
          addConstraint(column, row, column + 1, row + 1, 0.8);
          addConstraint(column + 1, row, column, row + 1, 0.8);
        }
        if (column + 2 < CAPE.columns) addConstraint(column, row, column + 2, row, 0.58);
        if (row + 2 < CAPE.rows) {
          addConstraint(
            column,
            row,
            column,
            row + 2,
            0.82 * GPU_LENGTHWISE_BEND_RELAXATION,
          );
        }
        if (column + 3 < CAPE.columns) addConstraint(column, row, column + 3, row, 0.16);
        if (row + 3 < CAPE.rows) {
          addConstraint(
            column,
            row,
            column,
            row + 3,
            0.38 * GPU_LENGTHWISE_BEND_RELAXATION,
          );
        }
      }
    }
    const normalNeighbors = new Uint32Array(PARTICLE_COUNT * 4);
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = row * CAPE.columns + column;
        normalNeighbors[index * 4] = row * CAPE.columns + Math.max(0, column - 1);
        normalNeighbors[index * 4 + 1] = row * CAPE.columns + Math.min(CAPE.columns - 1, column + 1);
        normalNeighbors[index * 4 + 2] = Math.max(0, row - 1) * CAPE.columns + column;
        normalNeighbors[index * 4 + 3] = Math.min(CAPE.rows - 1, row + 1) * CAPE.columns + column;
      }
    }

    const packed = new Float32Array(PARTICLE_COUNT * TOPOLOGY_METADATA_STRIDE * 4);
    for (let particleIndex = 0; particleIndex < PARTICLE_COUNT; particleIndex += 1) {
      const metadataOffset = particleIndex * TOPOLOGY_METADATA_STRIDE * 4;
      const neighborOffset = particleIndex * 4;
      const row = Math.floor(particleIndex / CAPE.columns);
      const rowLeft = row * CAPE.columns;
      const rowRight = rowLeft + CAPE.columns - 1;
      packed[metadataOffset] = readPosition(rowLeft).distanceTo(readPosition(rowRight));
      packed[metadataOffset + 2] = normalNeighbors[neighborOffset] ?? particleIndex;
      packed[metadataOffset + 3] = normalNeighbors[neighborOffset + 1] ?? particleIndex;
      packed[metadataOffset + 4] = normalNeighbors[neighborOffset + 2] ?? particleIndex;
      packed[metadataOffset + 5] = normalNeighbors[neighborOffset + 3] ?? particleIndex;
    }

    const colors: ConstraintDefinition[][] = [];
    const occupiedByColor: Set<number>[] = [];
    for (const constraint of constraints) {
      let color = occupiedByColor.findIndex(
        (occupied) => !occupied.has(constraint.first) && !occupied.has(constraint.second),
      );
      if (color < 0) {
        color = colors.length;
        colors.push([]);
        occupiedByColor.push(new Set<number>());
      }
      colors[color]?.push(constraint);
      occupiedByColor[color]?.add(constraint.first);
      occupiedByColor[color]?.add(constraint.second);
    }
    const coloredConstraints = new Float32Array(constraints.length * 4);
    const coloredConstraintRanges: ColoredConstraintRange[] = [];
    let constraintOffset = 0;
    for (const color of colors) {
      coloredConstraintRanges.push({ offset: constraintOffset, count: color.length });
      for (const constraint of color) {
        const offset = constraintOffset * 4;
        coloredConstraints[offset] = constraint.first;
        coloredConstraints[offset + 1] = constraint.second;
        coloredConstraints[offset + 2] = constraint.restLength;
        coloredConstraints[offset + 3] = constraint.stiffness;
        constraintOffset += 1;
      }
    }
    return {
      packed,
      normalNeighbors,
      coloredConstraints,
      coloredConstraintRanges,
    };
  }

  private updateAnchorBuffer(anchors: CapeAnchors): void {
    this.anchorCenter.copy(anchors.left).add(anchors.right).multiplyScalar(0.5);
    this.diagnosticMirror.synchronizeAnchorDiagnostics(anchors);
    const array = this.anchorBuffer.value.array as Float32Array;
    for (let column = 0; column < CAPE.columns; column += 1) {
      const progress = column / (CAPE.columns - 1);
      const neckline = Math.sin(progress * Math.PI);
      this.anchorTarget.lerpVectors(anchors.left, anchors.right, progress);
      this.anchorTarget.y += neckline * CAPE.attachment.necklineRise;
      this.anchorTarget.addScaledVector(anchors.back, neckline * CAPE.attachment.necklineDepth);
      const offset = column * 4;
      array[offset] = this.anchorTarget.x;
      array[offset + 1] = this.anchorTarget.y;
      array[offset + 2] = this.anchorTarget.z;
      array[offset + 3] = 0;
    }
    this.anchorBuffer.value.needsUpdate = true;
  }

  private writeStorage(attribute: THREE.BufferAttribute, state: Float32Array): void {
    (attribute.array as Float32Array).set(state);
    attribute.needsUpdate = true;
  }

  private applySettingsUniforms(): void {
    this.stiffnessUniform.value = this.settings.stiffness;
    this.dampingUniform.value = this.settings.damping;
    this.weightUniform.value = this.settings.weight;
  }

  private updateBodyBuffers(
    colliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): void {
    if (colliders.length > MAX_BODY_COLLIDERS) {
      throw new RangeError(`GPU cape supports at most ${MAX_BODY_COLLIDERS} body colliders.`);
    }
    const bodyData = this.bodyBuffer.value.array as Float32Array;
    colliders.forEach((collider, index) => {
      const axis = collider.end.clone().sub(collider.start);
      const axisDepthProjection = axis.dot(back);
      const lateralAxis = axis.clone().addScaledVector(back, -axisDepthProjection);
      const lateralRadius = collider.radius + getClothBodyClearance(collider);
      const depthRadius = getClothBodyDepthRadius(collider);
      const verticalRadius = Math.max(lateralRadius, depthRadius);
      const axisLength = axis.length();
      const sampleSpacing = collider.faceSampleSpacing
        ?? Math.max(0.04, lateralRadius * 0.82);
      const faceSegments = axisLength < 0.000_001
        ? 0
        : Math.max(1, Math.ceil(axisLength / sampleSpacing));
      const faceStepLength = faceSegments > 0 ? axisLength / faceSegments : 0;
      const faceLateralRadius = Math.hypot(lateralRadius, faceStepLength * 0.5);
      const faceDepthRadius = depthRadius * faceLateralRadius / lateralRadius;
      const offset = index * BODY_BUFFER_STRIDE * 4;
      bodyData[offset] = collider.start.x;
      bodyData[offset + 1] = collider.start.y;
      bodyData[offset + 2] = collider.start.z;
      bodyData[offset + 3] = lateralRadius;
      bodyData[offset + 4] = axis.x;
      bodyData[offset + 5] = axis.y;
      bodyData[offset + 6] = axis.z;
      bodyData[offset + 7] = depthRadius;
      bodyData[offset + 8] = lateralAxis.x;
      bodyData[offset + 9] = lateralAxis.y;
      bodyData[offset + 10] = lateralAxis.z;
      bodyData[offset + 11] = lateralAxis.lengthSq();
      if (Math.abs(back.y) < 0.000_1) {
        bodyData[offset + 12] = Math.min(collider.start.y, collider.end.y) - verticalRadius;
        bodyData[offset + 13] = Math.max(collider.start.y, collider.end.y) + verticalRadius;
      } else {
        bodyData[offset + 12] = -1_000_000;
        bodyData[offset + 13] = 1_000_000;
      }
      bodyData[offset + 16] = faceSegments;
      bodyData[offset + 17] = faceLateralRadius;
      bodyData[offset + 18] = faceDepthRadius;
    });
    this.bodyCountUniform.value = colliders.length;
    this.backUniform.value.copy(back);
    this.bodyBuffer.value.needsUpdate = true;
  }

  private updateWorldBuffers(colliders: readonly WorldCollider[]): void {
    if (
      this.worldColliderSource === colliders
      && this.worldCandidateCenter.distanceToSquared(this.anchorCenter)
        < GPU_WORLD_CANDIDATE_REFRESH_DISTANCE ** 2
    ) return;
    this.worldColliderSource = colliders;
    this.worldCandidateCenter.copy(this.anchorCenter);
    const nearby = colliders.filter((collider) => {
      const queryRadius = isWorldRockCollider(collider)
        ? WORLD_ROCK_QUERY_RADIUS
        : WORLD_SPHERE_QUERY_RADIUS;
      const range = queryRadius + collider.radius;
      return collider.center.distanceToSquared(this.anchorCenter) <= range * range;
    });
    const spheres = nearby.filter((collider) => !isWorldRockCollider(collider));
    const rocks = nearby.filter(isWorldRockCollider);
    if (spheres.length > MAX_WORLD_SPHERES) {
      throw new RangeError(`Nearby GPU cape sphere count ${spheres.length} exceeds ${MAX_WORLD_SPHERES}.`);
    }
    if (rocks.length > MAX_WORLD_ROCKS) {
      throw new RangeError(`Nearby GPU cape rock count ${rocks.length} exceeds ${MAX_WORLD_ROCKS}.`);
    }
    const sphereData = this.worldSphereBuffer.value.array as Float32Array;
    spheres.forEach((collider, index) => {
      const offset = index * 4;
      sphereData[offset] = collider.center.x;
      sphereData[offset + 1] = collider.center.y;
      sphereData[offset + 2] = collider.center.z;
      sphereData[offset + 3] = collider.radius + getClothWorldClearance(collider);
    });

    const rockData = this.rockBuffer.value.array as Float32Array;
    rocks.forEach((collider, rockIndex) => {
      if (collider.faces.length !== ROCK_FACES_PER_COLLIDER) {
        throw new RangeError(
          `GPU rock ${rockIndex} has ${collider.faces.length} faces; expected ${ROCK_FACES_PER_COLLIDER}.`,
        );
      }
      const rockOffset = rockIndex * ROCK_BUFFER_STRIDE * 4;
      rockData[rockOffset] = collider.center.x;
      rockData[rockOffset + 1] = collider.center.y;
      rockData[rockOffset + 2] = collider.center.z;
      rockData[rockOffset + 3] = collider.walkable ? 0.015 : 0.03;
      rockData[rockOffset + 4] = collider.bounds.min.x;
      rockData[rockOffset + 5] = collider.bounds.min.y;
      rockData[rockOffset + 6] = collider.bounds.min.z;
      rockData[rockOffset + 7] = collider.walkable
        ? THREE.MathUtils.lerp(collider.bounds.min.y, collider.bounds.max.y, 0.72)
        : -1_000_000;
      rockData[rockOffset + 8] = collider.bounds.max.x;
      rockData[rockOffset + 9] = collider.bounds.max.y;
      rockData[rockOffset + 10] = collider.bounds.max.z;
      rockData[rockOffset + 11] = collider.walkable ? 1 : 0;
      collider.faces.forEach((face, faceIndex) => {
        const offset = rockOffset + (4 + faceIndex * 4) * 4;
        rockData[offset] = face.triangle.a.x;
        rockData[offset + 1] = face.triangle.a.y;
        rockData[offset + 2] = face.triangle.a.z;
        rockData[offset + 4] = face.triangle.b.x;
        rockData[offset + 5] = face.triangle.b.y;
        rockData[offset + 6] = face.triangle.b.z;
        rockData[offset + 8] = face.triangle.c.x;
        rockData[offset + 9] = face.triangle.c.y;
        rockData[offset + 10] = face.triangle.c.z;
        rockData[offset + 12] = face.normal.x;
        rockData[offset + 13] = face.normal.y;
        rockData[offset + 14] = face.normal.z;
        rockData[offset + 15] = face.planeConstant;
      });
    });

    this.worldSphereCountUniform.value = spheres.length;
    this.rockCountUniform.value = rocks.length;
    this.worldSphereBuffer.value.needsUpdate = true;
    this.rockBuffer.value.needsUpdate = true;
  }
}
