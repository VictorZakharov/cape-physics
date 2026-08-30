import * as THREE from 'three';
import { CAMERA_NEAR_OPACITY, CAPE, PLAYER } from '../config';
import { createCapeFabricTextures } from '../graphics/proceduralTextures';
import type { CapeAnchors } from '../player/Character';
import {
  CAPE_DRAG_PER_SECOND,
  CAPE_FLUTTER_ACCELERATION,
  MAXIMUM_CAPE_PARTICLE_SPEED,
} from './CapeAerodynamics';
import { caveGroundHeightAt } from '../world/caveProfile';
import {
  CapeContactSolver,
  type BodyPenetrationDiagnostics,
  type EnvironmentPenetrationDiagnostics,
  type RockSurfaceContactDiagnostics,
  type WorldContactDiagnostics,
} from './CapeContactSolver';
import {
  CapePerformanceProfiler,
  type CapePerformanceDiagnostics,
} from './CapePerformanceProfiler';
import {
  CAPE_ROW_CURL_RELAXATION,
  CAPE_ROW_SPAN_RELAXATION,
  getCapeRestBackOffset,
  getCapeRestWidth,
  MAXIMUM_CAPE_ROW_CURL_RATIO,
  MINIMUM_CAPE_ROW_SPAN_RATIO,
} from './CapeRestShape';
import {
  normalizeCapePhysicsSettings,
  type CapePhysicsSettings,
} from './CapeSettings';
import { ClothFoldGuard } from './ClothFoldGuard';
import { ClothSelfCollision } from './ClothSelfCollision';
import type { CapsuleCollider, WorldCollider } from './colliders';

interface DistanceConstraint {
  readonly first: number;
  readonly second: number;
  readonly restLength: number;
  readonly stiffness: number;
  readonly structural: boolean;
}

const MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED = 9.6;
const SLEEP_AFTER_SETTLED_SECONDS = 0.55;
const SETTLED_MOTION_THRESHOLD = 0.0025;
const MINIMUM_SETTLED_LOWER_CAPE_DROP = 0.48;
const MAXIMUM_SETTLED_HORIZONTAL_OFFSET = 0.18;
const IDLE_DRAPE_RECOVERY_PER_STEP = 0.016;
const IDLE_DRAPE_RECOVERY_TARGET = 0.12;
const IDLE_DRAPE_RECOVERY_HEM_DROP = 1.2;
const IDLE_DRAPE_RECOVERY_DELAY_SECONDS = 0.12;
const IDLE_DRAPE_RECOVERY_RAMP_SECONDS = 0.35;
const MAXIMUM_SLEEP_BODY_PENETRATION = 0.001;
const BODY_CONTACT_RECONCILIATION_START = 0.000_5;
const BODY_CONTACT_RECONCILIATION_FULL = 0.025;
const WAKE_SPEED = 0.08;

export class CapeSimulation {
  public readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  private readonly positions: THREE.Vector3[] = [];
  private readonly previous: THREE.Vector3[] = [];
  private readonly inverseMass: Float32Array;
  private readonly constraints: DistanceConstraint[] = [];
  private readonly positionAttribute: THREE.BufferAttribute;
  private readonly selfCollision: ClothSelfCollision;
  private readonly foldGuard: ClothFoldGuard;
  private readonly contactSolver: CapeContactSolver;
  private readonly profiler = new CapePerformanceProfiler();
  private readonly velocity = new THREE.Vector3();
  private readonly airflow = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly flutterDirection = new THREE.Vector3();
  private readonly tangentAcross = new THREE.Vector3();
  private readonly tangentDown = new THREE.Vector3();
  private readonly correction = new THREE.Vector3();
  private readonly delta = new THREE.Vector3();
  private readonly anchorTarget = new THREE.Vector3();
  private readonly anchorCenter = new THREE.Vector3();
  private readonly rightAxis = new THREE.Vector3();
  private readonly rowCenter = new THREE.Vector3();
  private readonly drapeDelta = new THREE.Vector3();
  private readonly horizontalOffset = new THREE.Vector3();
  private readonly centerlineStart = new THREE.Vector3();
  private readonly centerlineEnd = new THREE.Vector3();
  private readonly centerlinePoint = new THREE.Vector3();
  private readonly rowChordPoint = new THREE.Vector3();
  private readonly rowCurl = new THREE.Vector3();
  private readonly stepStart: THREE.Vector3[] = [];
  private opacity = 1;
  private settledSeconds = 0;
  private idleDrapeRecoverySeconds = 0;
  private sleeping = false;
  private maximumParticleMotion = 0;
  private maximumParticleVerticalMotion = 0;
  private maximumParticleMotionIndex = -1;
  private maximumParticleMotionX = 0;
  private maximumParticleMotionY = 0;
  private maximumParticleMotionZ = 0;
  private maximumParticleVerticalMotionIndex = -1;
  private maximumParticleVerticalDelta = 0;
  private settings: CapePhysicsSettings;

  public constructor(
    initialAnchors: CapeAnchors,
    settings: Partial<CapePhysicsSettings> = {},
  ) {
    this.settings = normalizeCapePhysicsSettings(settings);
    const particleCount = CAPE.columns * CAPE.rows;
    this.inverseMass = new Float32Array(particleCount);
    this.selfCollision = new ClothSelfCollision(particleCount, CAPE.columns);
    this.foldGuard = new ClothFoldGuard(CAPE.columns, CAPE.rows);
    this.contactSolver = new CapeContactSolver(this.positions, this.previous, this.inverseMass);
    this.initializeParticles(initialAnchors);
    this.positions.forEach((position) => this.stepStart.push(position.clone()));
    this.createConstraints();
    const geometry = this.createGeometry();
    this.positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;

    const textures = createCapeFabricTextures();
    textures.color.repeat.set(1, 1);
    textures.normal.repeat.set(1, 1);
    textures.roughness.repeat.set(1, 1);
    const material = new THREE.MeshPhysicalMaterial({
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
    material.name = 'Woven crimson cape';
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = 'PBD cape';
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
    const profileActive = this.profiler.beginStep(
      !this.sleeping || characterSpeed > WAKE_SPEED,
    );
    const profileStepStart = profileActive ? performance.now() : 0;
    let profilePhaseStart = profileStepStart;
    this.captureStepStart();
    const planarSpeed = Math.hypot(characterVelocity.x, characterVelocity.z);
    if (characterSpeed > WAKE_SPEED) {
      this.settledSeconds = 0;
      this.idleDrapeRecoverySeconds = 0;
      this.sleeping = false;
    } else {
      this.idleDrapeRecoverySeconds += deltaTime;
    }
    this.pinAnchors(anchors);
    this.contactSolver.beginStep(
      this.anchorCenter,
      worldColliders,
      bodyColliders,
      anchors.back,
    );
    if (this.sleeping) {
      this.measureStepMotion();
      if (profileActive) {
        const profileEnd = performance.now();
        this.profiler.record('prediction', profileEnd - profilePhaseStart);
        this.profiler.endStep(profileEnd - profileStepStart);
      }
      return;
    }
    const movementBlend = THREE.MathUtils.smoothstep(characterSpeed, WAKE_SPEED, 2.4);
    const runningBlend = THREE.MathUtils.smoothstep(
      planarSpeed,
      PLAYER.walkSpeed * 1.02,
      PLAYER.runSpeed * 0.92,
    );
    const locomotionAirflow = THREE.MathUtils.lerp(0.28, 1, runningBlend);
    const velocityAirflow = THREE.MathUtils.lerp(0.32, 1.28, runningBlend);
    this.airflow.set(
      Math.sin(time * 0.47) * 0.38 + Math.sin(time * 1.91) * 0.16,
      0.08 + Math.sin(time * 0.71) * 0.05,
      0.62 + Math.cos(time * 0.31) * 0.24,
    ).multiplyScalar(THREE.MathUtils.lerp(0.025, locomotionAirflow, movementBlend))
      .addScaledVector(characterVelocity, -velocityAirflow);

    const deltaSquared = deltaTime * deltaTime;
    for (let row = 1; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = this.index(column, row);
        const position = this.positions[index];
        const previous = this.previous[index];
        if (!position || !previous) continue;

        const drag = CAPE_DRAG_PER_SECOND * this.settings.damping;
        this.velocity.copy(position).sub(previous).multiplyScalar(Math.exp(-drag * deltaTime));
        const particlePlanarSpeed = Math.hypot(this.velocity.x, this.velocity.z);
        const maximumPlanarDisplacement = MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED * deltaTime;
        if (particlePlanarSpeed > maximumPlanarDisplacement) {
          const planarScale = maximumPlanarDisplacement / particlePlanarSpeed;
          this.velocity.x *= planarScale;
          this.velocity.z *= planarScale;
        }
        this.velocity.y = THREE.MathUtils.clamp(
          this.velocity.y,
          -MAXIMUM_CAPE_PARTICLE_SPEED * deltaTime,
          MAXIMUM_CAPE_PARTICLE_SPEED * deltaTime,
        );
        previous.copy(position);
        this.estimateNormal(column, row);
        const pressure = this.airflow.dot(this.normal);
        const turbulence = Math.sin(time * 4.3 + row * 0.83 + column * 1.71) * 0.42;
        const across = column / (CAPE.columns - 1) - 0.5;
        const flutterEnvelope = Math.sin(Math.PI * row / (CAPE.rows - 1)) ** 2;
        const flutterProfile = 0.3 + across * 0.4;
        const fabricFlutter = Math.sin(time * 3.4 + row * 0.28)
          * flutterProfile
          * flutterEnvelope;
        position.add(this.velocity);
        position.y -= 9.81 * this.settings.weight * deltaSquared;
        position.addScaledVector(
          this.normal,
          pressure * Math.abs(pressure) * 0.026 * deltaSquared,
        );
        // Synthetic flutter only breaks perfect grid symmetry; it must not
        // become an artificial lift force when contact turns the cape flat.
        this.flutterDirection.copy(this.normal).setY(0);
        position.addScaledVector(
          this.flutterDirection,
          fabricFlutter * movementBlend * CAPE_FLUTTER_ACCELERATION * deltaSquared,
        );
        position.addScaledVector(
          this.airflow,
          (0.048 + turbulence * 0.011) * deltaSquared,
        );
      }
    }
    if (profileActive) {
      const profileNow = performance.now();
      this.profiler.record('prediction', profileNow - profilePhaseStart);
      profilePhaseStart = profileNow;
    }

    for (let iteration = 0; iteration < CAPE.solverIterations; iteration += 1) {
      for (const constraint of this.constraints) this.solveConstraint(constraint);
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('constraints', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      this.selfCollision.solve(this.positions, this.previous, this.inverseMass);
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('selfCollision', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      this.foldGuard.solve(this.positions, this.previous, this.inverseMass);
      this.solveRowSpanGuard(anchors);
      this.solveRowCurlGuard(anchors);
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('foldGuard', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      if (
        iteration === 0
        && this.idleDrapeRecoverySeconds > IDLE_DRAPE_RECOVERY_DELAY_SECONDS
        && this.getHemDrop() < IDLE_DRAPE_RECOVERY_HEM_DROP
        && this.getMaximumLowerCapeHorizontalOffset() > IDLE_DRAPE_RECOVERY_TARGET
      ) {
        this.solveIdleDrapeRecovery(THREE.MathUtils.smoothstep(
          this.idleDrapeRecoverySeconds,
          IDLE_DRAPE_RECOVERY_DELAY_SECONDS,
          IDLE_DRAPE_RECOVERY_DELAY_SECONDS + IDLE_DRAPE_RECOVERY_RAMP_SECONDS,
        ));
      }
      this.contactSolver.solveBody(bodyColliders, anchors.back);
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('bodyCollision', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      this.contactSolver.solveWorld();
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('worldCollision', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      this.contactSolver.solveCave();
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('caveCollision', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      if (iteration === CAPE.solverIterations - 1) {
        // Cave-floor projection can re-enter the face of a floor-seated rock.
        // Recheck triangles only against colliders that actually touched this
        // iteration; vertex contacts were already solved above.
        this.contactSolver.solvePostCaveWorldContacts();
        // The fixed-world projection can in turn press cloth back into an
        // animated boot or lower leg. Finish on the moving body constraint so
        // rendered limb geometry cannot emerge through a stone-pinned cape,
        // then reconcile exact world-face crossings once more. Both rock
        // point projections share one strict per-particle step budget; exact
        // face translations are independently bounded and velocity-neutral.
        this.contactSolver.solveBody(bodyColliders, anchors.back);
        if (this.contactSolver.solvePostCaveWorldContacts() > 0) {
          this.contactSolver.solveBody(bodyColliders, anchors.back);
          this.contactSolver.solvePostCaveWorldContacts();
        }
        // Final world/body reconciliation can push a triangle interior back
        // through the curved cave side while all of its vertices stay valid.
        // Recheck the cave face, then alternate the compatible moving-body and
        // fixed-world constraints to convergence. Always end on the fixed
        // world so the rendered cloth cannot remain inside a floor formation.
        this.contactSolver.solveCave();
        for (let pass = 0; pass < 4; pass += 1) {
          this.contactSolver.solveBody(bodyColliders, anchors.back);
          if (this.contactSolver.solvePostCaveWorldContacts() === 0) break;
        }
      }
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('reconciliation', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
      this.pinAnchors(anchors);
      if (profileActive) {
        const profileNow = performance.now();
        this.profiler.record('anchors', profileNow - profilePhaseStart);
        profilePhaseStart = profileNow;
      }
    }

    this.reconcileBodyContactVelocity();
    this.measureStepMotion();
    const horizontallySettled = this.getMaximumLowerCapeHorizontalOffset()
      < MAXIMUM_SETTLED_HORIZONTAL_OFFSET;
    const settledShape = characterSpeed <= WAKE_SPEED
      && this.getHemDrop() > 0.72
      && this.getMinimumLowerCapeDrop() > MINIMUM_SETTLED_LOWER_CAPE_DROP
      && horizontallySettled;
    const fullyDraped = settledShape
      && this.contactSolver.getMaximumBodyPenetration(bodyColliders, anchors.back)
        < MAXIMUM_SLEEP_BODY_PENETRATION;
    if (fullyDraped) this.dampResidualMotion(0.14);
    if (fullyDraped && this.maximumParticleMotion < SETTLED_MOTION_THRESHOLD) {
      this.settledSeconds += deltaTime;
    } else if (fullyDraped) {
      this.settledSeconds = Math.max(0, this.settledSeconds - deltaTime * 0.2);
    } else {
      this.settledSeconds = 0;
    }
    if (this.settledSeconds >= SLEEP_AFTER_SETTLED_SECONDS) {
      this.sleeping = true;
      this.positions.forEach((position, index) => this.previous[index]?.copy(position));
    }
    this.guardAgainstInvalidState(anchors);
    if (profileActive) {
      const profileEnd = performance.now();
      this.profiler.record('finalization', profileEnd - profilePhaseStart);
      this.profiler.endStep(profileEnd - profileStepStart);
    }
  }

  public syncGeometry(): void {
    const array = this.positionAttribute.array as Float32Array;
    this.positions.forEach((position, index) => {
      array[index * 3] = position.x;
      array[index * 3 + 1] = position.y;
      array[index * 3 + 2] = position.z;
    });
    this.positionAttribute.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
    const normalAttribute = this.mesh.geometry.getAttribute('normal');
    if (normalAttribute) normalAttribute.needsUpdate = true;
  }

  /**
   * CPU simulations already own authoritative particle data. The WebGPU
   * implementation exposes the same hook and uses it for explicit diagnostic
   * readback, so browser audits never add a fence to the animation loop.
   */
  public async refreshDiagnostics(): Promise<void> {}

  /** Updates the CPU diagnostic mirror from tightly packed vec4 GPU buffers. */
  public overwriteStateFromGpu(
    positionData: Float32Array,
    previousData: Float32Array,
  ): void {
    const expectedLength = this.positions.length * 4;
    if (positionData.length < expectedLength || previousData.length < expectedLength) {
      throw new RangeError('GPU cape state is smaller than the simulation grid.');
    }
    this.positions.forEach((position, index) => {
      const offset = index * 4;
      position.set(
        positionData[offset] ?? 0,
        positionData[offset + 1] ?? 0,
        positionData[offset + 2] ?? 0,
      );
      this.previous[index]?.set(
        previousData[offset] ?? 0,
        previousData[offset + 1] ?? 0,
        previousData[offset + 2] ?? 0,
      );
    });
  }

  /** Harness-only state injection shared with the WebGPU implementation. */
  public overwriteStateForHarness(
    positionData: Float32Array,
    previousData: Float32Array = positionData,
  ): void {
    this.overwriteStateFromGpu(positionData, previousData);
    this.positions.forEach((position, index) => this.stepStart[index]?.copy(position));
    this.settledSeconds = 0;
    this.idleDrapeRecoverySeconds = 0;
    this.sleeping = false;
    this.maximumParticleMotion = 0;
    this.maximumParticleVerticalMotion = 0;
  }

  /** Keeps GPU readback diagnostics relative to the current moving neckline. */
  public synchronizeAnchorDiagnostics(anchors: CapeAnchors): void {
    this.anchorCenter.copy(anchors.left).add(anchors.right).multiplyScalar(0.5);
  }

  public reset(anchors: CapeAnchors): void {
    this.positions.length = 0;
    this.previous.length = 0;
    this.initializeParticles(anchors);
    this.pinAnchors(anchors);
    this.positions.forEach((position, index) => {
      const start = this.stepStart[index];
      if (start) start.copy(position);
      else this.stepStart.push(position.clone());
    });
    this.settledSeconds = 0;
    this.idleDrapeRecoverySeconds = 0;
    this.sleeping = false;
    this.maximumParticleMotion = 0;
    this.maximumParticleVerticalMotion = 0;
  }

  public updateSettings(
    settings: Partial<CapePhysicsSettings>,
    anchors: CapeAnchors,
  ): void {
    const next = normalizeCapePhysicsSettings(settings);
    const dimensionsChanged = next.length !== this.settings.length
      || next.width !== this.settings.width;
    this.settings = next;
    this.settledSeconds = 0;
    this.idleDrapeRecoverySeconds = 0;
    this.sleeping = false;
    if (!dimensionsChanged) return;

    this.constraints.length = 0;
    this.reset(anchors);
    this.createConstraints();
    this.syncGeometry();
  }

  public getSettings(): CapePhysicsSettings {
    return { ...this.settings };
  }

  public setOpacity(opacity: number): void {
    const nextOpacity = THREE.MathUtils.clamp(opacity, CAMERA_NEAR_OPACITY, 1);
    if (Math.abs(nextOpacity - this.opacity) < 0.002) return;
    this.opacity = nextOpacity;
  }

  public getParticlePosition(column: number, row: number): THREE.Vector3 {
    const position = this.positions[this.index(column, row)];
    if (!position) throw new RangeError('Cape particle index is outside the simulation grid.');
    return position.clone();
  }

  public getMaximumStructuralError(): number {
    let maximum = 0;
    for (const constraint of this.constraints) {
      if (!constraint.structural) continue;
      const first = this.positions[constraint.first];
      const second = this.positions[constraint.second];
      if (!first || !second) continue;
      maximum = Math.max(maximum, Math.abs(first.distanceTo(second) - constraint.restLength));
    }
    return maximum;
  }

  public getMaximumBodyPenetration(
    bodyColliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): number {
    return this.contactSolver.getMaximumBodyPenetration(bodyColliders, back);
  }

  public getBodyPenetrationDiagnostics(
    bodyColliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): BodyPenetrationDiagnostics {
    return this.contactSolver.getBodyPenetrationDiagnostics(bodyColliders, back);
  }

  public getMaximumEnvironmentPenetration(worldColliders: readonly WorldCollider[]): number {
    return this.contactSolver.getMaximumEnvironmentPenetration(worldColliders);
  }

  public getEnvironmentPenetrationDiagnostics(
    worldColliders: readonly WorldCollider[],
  ): EnvironmentPenetrationDiagnostics {
    return this.contactSolver.getEnvironmentPenetrationDiagnostics(worldColliders);
  }

  public getMaximumEnvironmentFacePenetration(worldColliders: readonly WorldCollider[]): number {
    return this.contactSolver.getMaximumEnvironmentFacePenetration(worldColliders);
  }

  public getMinimumSelfSeparation(): number {
    return this.selfCollision.getMinimumSeparation(this.positions);
  }

  public getMaximumUpwardFold(): number {
    return this.foldGuard.getMaximumUpwardFold(this.positions);
  }

  public getHemDrop(): number {
    let height = 0;
    for (let column = 0; column < CAPE.columns; column += 1) {
      height += this.positions[this.index(column, CAPE.rows - 1)]?.y ?? this.anchorCenter.y;
    }
    return this.anchorCenter.y - height / CAPE.columns;
  }

  public getMinimumLowerCapeDrop(): number {
    let minimum = Number.POSITIVE_INFINITY;
    const firstLowerRow = Math.floor(CAPE.rows * 0.58);
    for (let row = firstLowerRow; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const position = this.positions[this.index(column, row)];
        if (position) minimum = Math.min(minimum, this.anchorCenter.y - position.y);
      }
    }
    return minimum;
  }

  public getMaximumLowerCapeLateralOffset(anchors: CapeAnchors): number {
    this.rightAxis.copy(anchors.right).sub(anchors.left).normalize();
    const firstLowerRow = Math.floor(CAPE.rows * 0.58);
    let maximum = 0;
    for (let row = firstLowerRow; row < CAPE.rows; row += 1) {
      this.getRowCenter(row, this.rowCenter);
      maximum = Math.max(
        maximum,
        Math.abs(this.drapeDelta.copy(this.rowCenter).sub(this.anchorCenter).dot(this.rightAxis)),
      );
    }
    return maximum;
  }

  public getMaximumLowerCapeHorizontalOffset(): number {
    const firstLowerRow = Math.floor(CAPE.rows * 0.58);
    let maximum = 0;
    for (let row = firstLowerRow; row < CAPE.rows; row += 1) {
      this.getRowCenter(row, this.rowCenter);
      this.horizontalOffset.copy(this.rowCenter).sub(this.anchorCenter).setY(0);
      maximum = Math.max(maximum, this.horizontalOffset.length());
    }
    return maximum;
  }

  /**
   * Detects a cape that has rolled its rows into a tube while retaining valid
   * edge lengths. A healthy lower cape keeps most of each row aligned with the
   * character's shoulder axis even while it trails, folds, or contacts rocks.
   */
  public getAverageLowerCapeSpanRatio(anchors: CapeAnchors): number {
    this.rightAxis.copy(anchors.right).sub(anchors.left).normalize();
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    const firstLowerRow = Math.floor(CAPE.rows * 0.58);
    let ratioTotal = 0;
    let rowCount = 0;
    for (let row = firstLowerRow; row < CAPE.rows; row += 1) {
      const left = this.positions[this.index(0, row)];
      const right = this.positions[this.index(CAPE.columns - 1, row)];
      if (!left || !right) continue;
      const down = row / (CAPE.rows - 1);
      const restWidth = getCapeRestWidth(anchorWidth, down, this.settings.width);
      const lateralSpan = Math.abs(
        this.drapeDelta.copy(right).sub(left).dot(this.rightAxis),
      );
      ratioTotal += lateralSpan / Math.max(0.000_001, restWidth);
      rowCount += 1;
    }
    return rowCount > 0 ? ratioTotal / rowCount : 0;
  }

  /**
   * Measures changing cross-cape orientation down the cloth. A rigid planar
   * sheet has almost no range, while a naturally waving cape twists successive
   * rows forward and backward around its centerline.
   */
  public getCapeRowTwistRange(anchors: CapeAnchors): number {
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    let minimum = Number.POSITIVE_INFINITY;
    let maximum = Number.NEGATIVE_INFINITY;
    for (let row = 1; row < CAPE.rows; row += 1) {
      const left = this.positions[this.index(0, row)];
      const right = this.positions[this.index(CAPE.columns - 1, row)];
      if (!left || !right) continue;
      const down = row / (CAPE.rows - 1);
      const restWidth = getCapeRestWidth(anchorWidth, down, this.settings.width);
      const twist = this.drapeDelta.copy(right).sub(left).dot(anchors.back)
        / Math.max(0.000_001, restWidth);
      minimum = Math.min(minimum, twist);
      maximum = Math.max(maximum, twist);
    }
    return Number.isFinite(minimum) && Number.isFinite(maximum) ? maximum - minimum : 0;
  }

  /** Maximum row-center departure from the straight neckline-to-hem chord. */
  public getCapeCenterlineDeviation(): number {
    this.getRowCenter(0, this.centerlineStart);
    this.getRowCenter(CAPE.rows - 1, this.centerlineEnd);
    let maximum = 0;
    for (let row = 1; row < CAPE.rows - 1; row += 1) {
      const down = row / (CAPE.rows - 1);
      this.getRowCenter(row, this.rowCenter);
      this.centerlinePoint.lerpVectors(this.centerlineStart, this.centerlineEnd, down);
      maximum = Math.max(maximum, this.rowCenter.distanceTo(this.centerlinePoint));
    }
    return maximum;
  }

  /** Largest interior departure from a lower row's outer-edge chord. */
  public getMaximumLowerCapeRowCurlRatio(anchors: CapeAnchors): number {
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    const firstLowerRow = Math.floor(CAPE.rows * 0.58);
    let maximum = 0;
    for (let row = firstLowerRow; row < CAPE.rows; row += 1) {
      const left = this.positions[this.index(0, row)];
      const right = this.positions[this.index(CAPE.columns - 1, row)];
      if (!left || !right) continue;
      const down = row / (CAPE.rows - 1);
      const restWidth = getCapeRestWidth(anchorWidth, down, this.settings.width);
      for (let column = 1; column < CAPE.columns - 1; column += 1) {
        const position = this.positions[this.index(column, row)];
        if (!position) continue;
        this.rowChordPoint.lerpVectors(left, right, column / (CAPE.columns - 1));
        maximum = Math.max(
          maximum,
          position.distanceTo(this.rowChordPoint) / Math.max(0.000_001, restWidth),
        );
      }
    }
    return maximum;
  }

  public getHemBackOffset(anchors: CapeAnchors): number {
    this.getRowCenter(CAPE.rows - 1, this.rowCenter);
    return this.drapeDelta.copy(this.rowCenter).sub(this.anchorCenter).dot(anchors.back);
  }

  public getMinimumHemGroundClearance(): number {
    let minimum = Number.POSITIVE_INFINITY;
    for (let column = 0; column < CAPE.columns; column += 1) {
      const position = this.positions[this.index(column, CAPE.rows - 1)];
      if (position) {
        minimum = Math.min(
          minimum,
          position.y - caveGroundHeightAt(position.x, position.z),
        );
      }
    }
    return minimum;
  }

  public getMaximumParticleMotion(): number {
    return this.maximumParticleMotion;
  }

  public getMaximumParticleVerticalMotion(): number {
    return this.maximumParticleVerticalMotion;
  }

  public getMaximumParticleMotionDiagnostics() {
    return {
      particleIndex: this.maximumParticleMotionIndex,
      displacement: [
        this.maximumParticleMotionX,
        this.maximumParticleMotionY,
        this.maximumParticleMotionZ,
      ] as const,
      verticalParticleIndex: this.maximumParticleVerticalMotionIndex,
      verticalDelta: this.maximumParticleVerticalDelta,
      rockContact: this.contactSolver.getParticleRockCorrectionDiagnostics(
        this.maximumParticleMotionIndex,
      ),
    };
  }

  public isSleeping(): boolean {
    return this.sleeping;
  }

  public getWorldContactDiagnostics(): WorldContactDiagnostics {
    return this.contactSolver.getDiagnostics();
  }

  public getPerformanceDiagnostics(): CapePerformanceDiagnostics {
    return this.profiler.getDiagnostics();
  }

  public getClosestActiveRockSurfaceContact(
    worldColliders?: readonly WorldCollider[],
  ): RockSurfaceContactDiagnostics | null {
    return this.contactSolver.getClosestActiveRockSurfaceContact(worldColliders);
  }

  private initializeParticles(anchors: CapeAnchors): void {
    this.anchorCenter.copy(anchors.left).add(anchors.right).multiplyScalar(0.5);
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    const right = anchors.right.clone().sub(anchors.left).normalize();
    const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    for (let row = 0; row < CAPE.rows; row += 1) {
      const down = row / (CAPE.rows - 1);
      const width = getCapeRestWidth(anchorWidth, down, this.settings.width);
      for (let column = 0; column < CAPE.columns; column += 1) {
        const across = column / (CAPE.columns - 1) - 0.5;
        const position = center.clone()
          .addScaledVector(right, across * width)
          .addScaledVector(anchors.back, getCapeRestBackOffset(down, across))
          .add(new THREE.Vector3(
            0,
            -down * this.settings.length * (1 - Math.abs(across) * 0.085),
            0,
          ));
        if (row === 0) this.setAnchorTarget(anchors, column / (CAPE.columns - 1), position);
        this.positions.push(position);
        this.previous.push(position.clone());
        this.inverseMass[this.index(column, row)] = row === 0 ? 0 : 1;
      }
    }
  }

  private createConstraints(): void {
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        if (column + 1 < CAPE.columns) this.addConstraint(column, row, column + 1, row, 0.93, true);
        if (row + 1 < CAPE.rows) this.addConstraint(column, row, column, row + 1, 0.96, true);
        if (column + 1 < CAPE.columns && row + 1 < CAPE.rows) {
          this.addConstraint(column, row, column + 1, row + 1, 0.8, false);
          this.addConstraint(column + 1, row, column, row + 1, 0.8, false);
        }
        if (column + 2 < CAPE.columns) this.addConstraint(column, row, column + 2, row, 0.58, false);
        if (row + 2 < CAPE.rows) this.addConstraint(column, row, column, row + 2, 0.82, false);
        if (column + 3 < CAPE.columns) this.addConstraint(column, row, column + 3, row, 0.16, false);
        if (row + 3 < CAPE.rows) this.addConstraint(column, row, column, row + 3, 0.38, false);
      }
    }
  }

  private addConstraint(
    firstColumn: number,
    firstRow: number,
    secondColumn: number,
    secondRow: number,
    stiffness: number,
    structural: boolean,
  ): void {
    const first = this.index(firstColumn, firstRow);
    const second = this.index(secondColumn, secondRow);
    const firstPosition = this.positions[first];
    const secondPosition = this.positions[second];
    if (!firstPosition || !secondPosition) return;
    this.constraints.push({
      first,
      second,
      restLength: firstPosition.distanceTo(secondPosition),
      stiffness,
      structural,
    });
  }

  private createGeometry(): THREE.BufferGeometry {
    const positionData = new Float32Array(this.positions.length * 3);
    const uvData = new Float32Array(this.positions.length * 2);
    const indices: number[] = [];
    this.positions.forEach((position, index) => {
      position.toArray(positionData, index * 3);
      const column = index % CAPE.columns;
      const row = Math.floor(index / CAPE.columns);
      uvData[index * 2] = column / (CAPE.columns - 1);
      uvData[index * 2 + 1] = 1 - row / (CAPE.rows - 1);
    });
    for (let row = 0; row < CAPE.rows - 1; row += 1) {
      for (let column = 0; column < CAPE.columns - 1; column += 1) {
        const topLeft = this.index(column, row);
        const bottomLeft = this.index(column, row + 1);
        indices.push(topLeft, bottomLeft, topLeft + 1, bottomLeft, bottomLeft + 1, topLeft + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    const positions = new THREE.BufferAttribute(positionData, 3);
    positions.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', positions);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvData, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  private pinAnchors(anchors: CapeAnchors): void {
    this.anchorCenter.copy(anchors.left).add(anchors.right).multiplyScalar(0.5);
    for (let column = 0; column < CAPE.columns; column += 1) {
      const index = this.index(column, 0);
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      this.setAnchorTarget(anchors, column / (CAPE.columns - 1), this.anchorTarget);
      position.copy(this.anchorTarget);
      previous.copy(this.anchorTarget);
    }
  }

  private setAnchorTarget(anchors: CapeAnchors, progress: number, target: THREE.Vector3): void {
    const neckline = Math.sin(progress * Math.PI);
    target.lerpVectors(anchors.left, anchors.right, progress);
    target.y += neckline * CAPE.attachment.necklineRise;
    target.addScaledVector(anchors.back, neckline * CAPE.attachment.necklineDepth);
  }

  /**
   * Body projection is positional and intentionally resolves penetration in
   * full. Repeated constraint/contact passes can nevertheless encode that
   * projection as Verlet velocity. Treat sustained body contact as inelastic
   * so a boot can push cloth aside without catapulting it on the next step.
   */
  private reconcileBodyContactVelocity(): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const correction = this.contactSolver.getBodyCorrectionUsed(index);
      if (correction <= BODY_CONTACT_RECONCILIATION_START) continue;
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      const strength = THREE.MathUtils.smoothstep(
        correction,
        BODY_CONTACT_RECONCILIATION_START,
        BODY_CONTACT_RECONCILIATION_FULL,
      );
      previous.lerp(position, strength);
    }
  }

  private dampResidualMotion(strength: number): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (position && previous) previous.lerp(position, strength);
    }
  }

  private solveIdleDrapeRecovery(strength: number): void {
    for (let row = 1; row < CAPE.rows; row += 1) {
      this.getRowCenter(row, this.rowCenter);
      this.horizontalOffset
        .copy(this.rowCenter)
        .sub(this.anchorCenter)
        .setY(0);
      if (this.horizontalOffset.lengthSq() < 0.000_001) continue;
      const down = row / (CAPE.rows - 1);
      this.correction.copy(this.horizontalOffset).multiplyScalar(
        -IDLE_DRAPE_RECOVERY_PER_STEP
        * strength
        * THREE.MathUtils.smoothstep(down, 0.05, 1),
      );
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = this.index(column, row);
        this.positions[index]?.add(this.correction);
        this.previous[index]?.add(this.correction);
      }
    }
  }

  private solveRowSpanGuard(anchors: CapeAnchors): void {
    this.rightAxis.copy(anchors.right).sub(anchors.left).normalize();
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    for (let row = 1; row < CAPE.rows; row += 1) {
      const leftIndex = this.index(0, row);
      const rightIndex = this.index(CAPE.columns - 1, row);
      const left = this.positions[leftIndex];
      const right = this.positions[rightIndex];
      const leftPrevious = this.previous[leftIndex];
      const rightPrevious = this.previous[rightIndex];
      if (!left || !right || !leftPrevious || !rightPrevious) continue;
      const down = row / (CAPE.rows - 1);
      const minimumSpan = getCapeRestWidth(anchorWidth, down, this.settings.width)
        * MINIMUM_CAPE_ROW_SPAN_RATIO;
      const lateralSpan = this.delta.copy(right).sub(left).dot(this.rightAxis);
      const deficit = minimumSpan - lateralSpan;
      if (deficit <= 0) continue;
      this.correction.copy(this.rightAxis)
        .multiplyScalar(deficit * CAPE_ROW_SPAN_RELAXATION * 0.5);
      left.sub(this.correction);
      right.add(this.correction);
      leftPrevious.sub(this.correction);
      rightPrevious.add(this.correction);
    }
  }

  private solveRowCurlGuard(anchors: CapeAnchors): void {
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    for (let row = 1; row < CAPE.rows; row += 1) {
      const left = this.positions[this.index(0, row)];
      const right = this.positions[this.index(CAPE.columns - 1, row)];
      if (!left || !right) continue;
      const down = row / (CAPE.rows - 1);
      const maximumCurl = getCapeRestWidth(anchorWidth, down, this.settings.width)
        * MAXIMUM_CAPE_ROW_CURL_RATIO;
      for (let column = 1; column < CAPE.columns - 1; column += 1) {
        const index = this.index(column, row);
        const position = this.positions[index];
        const previous = this.previous[index];
        if (!position || !previous) continue;
        this.rowChordPoint.lerpVectors(left, right, column / (CAPE.columns - 1));
        this.rowCurl.copy(position).sub(this.rowChordPoint);
        const curl = this.rowCurl.length();
        if (curl <= maximumCurl || curl < 0.000_001) continue;
        this.rowCurl.multiplyScalar(
          ((curl - maximumCurl) / curl) * CAPE_ROW_CURL_RELAXATION,
        );
        position.sub(this.rowCurl);
        previous.sub(this.rowCurl);
      }
    }
  }

  private getRowCenter(row: number, target: THREE.Vector3): THREE.Vector3 {
    target.set(0, 0, 0);
    for (let column = 0; column < CAPE.columns; column += 1) {
      const position = this.positions[this.index(column, row)];
      if (position) target.add(position);
    }
    return target.multiplyScalar(1 / CAPE.columns);
  }

  private captureStepStart(): void {
    this.positions.forEach((position, index) => {
      const start = this.stepStart[index];
      if (start) start.copy(position);
      else this.stepStart.push(position.clone());
    });
  }

  private measureStepMotion(): void {
    let maximum = 0;
    let maximumVertical = 0;
    this.maximumParticleMotionIndex = -1;
    this.maximumParticleVerticalMotionIndex = -1;
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const start = this.stepStart[index];
      if (!position || !start) continue;
      const deltaX = position.x - start.x;
      const deltaY = position.y - start.y;
      const deltaZ = position.z - start.z;
      const motion = Math.hypot(deltaX, deltaY, deltaZ);
      if (motion > maximum) {
        maximum = motion;
        this.maximumParticleMotionIndex = index;
        this.maximumParticleMotionX = deltaX;
        this.maximumParticleMotionY = deltaY;
        this.maximumParticleMotionZ = deltaZ;
      }
      if (Math.abs(deltaY) > maximumVertical) {
        maximumVertical = Math.abs(deltaY);
        this.maximumParticleVerticalMotionIndex = index;
        this.maximumParticleVerticalDelta = deltaY;
      }
    }
    this.maximumParticleMotion = maximum;
    this.maximumParticleVerticalMotion = maximumVertical;
  }

  private solveConstraint(constraint: DistanceConstraint): void {
    const first = this.positions[constraint.first];
    const second = this.positions[constraint.second];
    if (!first || !second) return;
    this.delta.copy(second).sub(first);
    const length = this.delta.length();
    if (length < 0.000_001) return;
    const firstWeight = this.inverseMass[constraint.first] ?? 0;
    const secondWeight = this.inverseMass[constraint.second] ?? 0;
    const totalWeight = firstWeight + secondWeight;
    if (totalWeight === 0) return;
    const stiffness = Math.min(
      0.999,
      constraint.stiffness * this.settings.stiffness,
    );
    this.correction.copy(this.delta).multiplyScalar(
      ((length - constraint.restLength) / length) * stiffness,
    );
    if (firstWeight > 0) first.addScaledVector(this.correction, firstWeight / totalWeight);
    if (secondWeight > 0) second.addScaledVector(this.correction, -secondWeight / totalWeight);
  }

  private estimateNormal(column: number, row: number): void {
    const left = this.positions[this.index(Math.max(0, column - 1), row)];
    const right = this.positions[this.index(Math.min(CAPE.columns - 1, column + 1), row)];
    const up = this.positions[this.index(column, Math.max(0, row - 1))];
    const down = this.positions[this.index(column, Math.min(CAPE.rows - 1, row + 1))];
    if (!left || !right || !up || !down) {
      this.normal.set(0, 0, 1);
      return;
    }
    this.tangentAcross.copy(right).sub(left);
    this.tangentDown.copy(down).sub(up);
    this.normal.crossVectors(this.tangentAcross, this.tangentDown).normalize();
  }

  private guardAgainstInvalidState(anchors: CapeAnchors): void {
    const invalid = this.positions.some(
      (position) => !Number.isFinite(position.lengthSq()) || position.distanceToSquared(this.anchorCenter) > 25,
    );
    if (!invalid) return;
    this.reset(anchors);
  }

  private index(column: number, row: number): number {
    return row * CAPE.columns + column;
  }
}
