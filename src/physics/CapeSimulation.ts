import * as THREE from 'three';
import { CAMERA_NEAR_OPACITY, CAPE, PLAYER } from '../config';
import { createCapeFabricTextures } from '../graphics/proceduralTextures';
import type { CapeAnchors } from '../player/Character';
import { caveGroundHeightAt } from '../world/caveProfile';
import { CapeContactSolver, type WorldContactDiagnostics } from './CapeContactSolver';
import { ClothSelfCollision } from './ClothSelfCollision';
import type { CapsuleCollider, WorldSphereCollider } from './colliders';

interface DistanceConstraint {
  readonly first: number;
  readonly second: number;
  readonly restLength: number;
  readonly stiffness: number;
  readonly structural: boolean;
}

const ACTIVE_DRAG_PER_SECOND = 2.05;
const IDLE_DRAG_PER_SECOND = 2.8;
const SLEEP_AFTER_SETTLED_SECONDS = 0.55;
const SETTLED_MOTION_THRESHOLD = 0.0025;
const MINIMUM_SETTLED_LOWER_CAPE_DROP = 0.48;
const MAXIMUM_SETTLED_LATERAL_OFFSET = 0.18;
const IDLE_DRAPE_RECOVERY_PER_ITERATION = 0.0016;
const WAKE_SPEED = 0.08;

export class CapeSimulation {
  public readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  private readonly positions: THREE.Vector3[] = [];
  private readonly previous: THREE.Vector3[] = [];
  private readonly inverseMass: Float32Array;
  private readonly constraints: DistanceConstraint[] = [];
  private readonly positionAttribute: THREE.BufferAttribute;
  private readonly selfCollision: ClothSelfCollision;
  private readonly contactSolver: CapeContactSolver;
  private readonly velocity = new THREE.Vector3();
  private readonly airflow = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly tangentAcross = new THREE.Vector3();
  private readonly tangentDown = new THREE.Vector3();
  private readonly correction = new THREE.Vector3();
  private readonly delta = new THREE.Vector3();
  private readonly anchorTarget = new THREE.Vector3();
  private readonly anchorCenter = new THREE.Vector3();
  private readonly rightAxis = new THREE.Vector3();
  private readonly rowCenter = new THREE.Vector3();
  private readonly drapeDelta = new THREE.Vector3();
  private readonly stepStart: THREE.Vector3[] = [];
  private opacity = 1;
  private settledSeconds = 0;
  private sleeping = false;
  private maximumParticleMotion = 0;

  public constructor(initialAnchors: CapeAnchors) {
    const particleCount = CAPE.columns * CAPE.rows;
    this.inverseMass = new Float32Array(particleCount);
    this.selfCollision = new ClothSelfCollision(particleCount, CAPE.columns);
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
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        float capeSideTrim = 1.0 - smoothstep(0.018, 0.052, min(vMapUv.x, 1.0 - vMapUv.x));
        float capeHemTrim = 1.0 - smoothstep(0.018, 0.052, vMapUv.y);
        float capeTrim = max(capeSideTrim, capeHemTrim);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.34, 0.12, 0.035), capeTrim * 0.72);`,
      );
    };
    material.customProgramCacheKey = () => 'cape-fabric-trim-v2';
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
    worldColliders: readonly WorldSphereCollider[],
    characterVelocity: THREE.Vector3,
    time: number,
  ): void {
    this.captureStepStart();
    const characterSpeed = characterVelocity.length();
    const planarSpeed = Math.hypot(characterVelocity.x, characterVelocity.z);
    if (characterSpeed > WAKE_SPEED) {
      this.settledSeconds = 0;
      this.sleeping = false;
    }
    this.pinAnchors(anchors);
    this.contactSolver.beginStep(this.anchorCenter, worldColliders);
    if (this.sleeping) {
      this.measureStepMotion();
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

        const drag = THREE.MathUtils.lerp(IDLE_DRAG_PER_SECOND, ACTIVE_DRAG_PER_SECOND, movementBlend);
        this.velocity.copy(position).sub(previous).multiplyScalar(Math.exp(-drag * deltaTime));
        previous.copy(position);
        this.estimateNormal(column, row);
        const pressure = this.airflow.dot(this.normal);
        const turbulence = Math.sin(time * 4.3 + row * 0.83 + column * 1.71) * 0.42;
        position.add(this.velocity);
        position.y -= 9.81 * deltaSquared;
        position.addScaledVector(this.normal, pressure * Math.abs(pressure) * 0.026 * deltaSquared);
        position.addScaledVector(this.airflow, (0.048 + turbulence * 0.011) * deltaSquared);
      }
    }

    for (let iteration = 0; iteration < CAPE.solverIterations; iteration += 1) {
      for (const constraint of this.constraints) this.solveConstraint(constraint);
      this.selfCollision.solve(this.positions, this.previous, this.inverseMass);
      if (
        characterSpeed <= WAKE_SPEED
        && this.contactSolver.getDiagnostics().lastStep === 0
      ) {
        this.solveIdleDrapeRecovery(anchors);
      }
      this.contactSolver.solveBody(bodyColliders, anchors.back);
      this.contactSolver.solveWorld();
      this.contactSolver.solveCave();
      this.pinAnchors(anchors);
    }

    this.measureStepMotion();
    const laterallySettled = this.getMaximumLowerCapeLateralOffset(anchors)
      < MAXIMUM_SETTLED_LATERAL_OFFSET
      || this.contactSolver.getDiagnostics().lastStep > 0;
    const fullyDraped = characterSpeed <= WAKE_SPEED
      && this.getHemDrop() > 0.72
      && this.getMinimumLowerCapeDrop() > MINIMUM_SETTLED_LOWER_CAPE_DROP
      && laterallySettled;
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
    this.sleeping = false;
    this.maximumParticleMotion = 0;
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

  public getMaximumEnvironmentPenetration(worldColliders: readonly WorldSphereCollider[]): number {
    return this.contactSolver.getMaximumEnvironmentPenetration(worldColliders);
  }

  public getMaximumEnvironmentFacePenetration(worldColliders: readonly WorldSphereCollider[]): number {
    return this.contactSolver.getMaximumEnvironmentFacePenetration(worldColliders);
  }

  public getMinimumSelfSeparation(): number {
    return this.selfCollision.getMinimumSeparation(this.positions);
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

  public isSleeping(): boolean {
    return this.sleeping;
  }

  public getWorldContactDiagnostics(): WorldContactDiagnostics {
    return this.contactSolver.getDiagnostics();
  }

  private initializeParticles(anchors: CapeAnchors): void {
    this.anchorCenter.copy(anchors.left).add(anchors.right).multiplyScalar(0.5);
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    const right = anchors.right.clone().sub(anchors.left).normalize();
    const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    for (let row = 0; row < CAPE.rows; row += 1) {
      const down = row / (CAPE.rows - 1);
      const flare = down * down * (3 - 2 * down);
      const width = THREE.MathUtils.lerp(anchorWidth, CAPE.width * 1.16, flare);
      for (let column = 0; column < CAPE.columns; column += 1) {
        const across = column / (CAPE.columns - 1) - 0.5;
        const position = center.clone()
          .addScaledVector(right, across * width)
          .addScaledVector(
            anchors.back,
            0.045 + down * 0.18 + (1 - down) ** 2 * (1 - Math.abs(across) * 2) * 0.035,
          )
          .add(new THREE.Vector3(0, -down * CAPE.length * (1 - Math.abs(across) * 0.085), 0));
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
        if (row + 2 < CAPE.rows) this.addConstraint(column, row, column, row + 2, 0.64, false);
        if (column + 3 < CAPE.columns) this.addConstraint(column, row, column + 3, row, 0.16, false);
        if (row + 3 < CAPE.rows) this.addConstraint(column, row, column, row + 3, 0.24, false);
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

  private dampResidualMotion(strength: number): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (position && previous) previous.lerp(position, strength);
    }
  }

  private solveIdleDrapeRecovery(anchors: CapeAnchors): void {
    this.rightAxis.copy(anchors.right).sub(anchors.left).normalize();
    for (let row = 1; row < CAPE.rows; row += 1) {
      this.getRowCenter(row, this.rowCenter);
      const lateralOffset = this.drapeDelta
        .copy(this.rowCenter)
        .sub(this.anchorCenter)
        .dot(this.rightAxis);
      const down = row / (CAPE.rows - 1);
      const correction = -lateralOffset
        * IDLE_DRAPE_RECOVERY_PER_ITERATION
        * THREE.MathUtils.smoothstep(down, 0.05, 1);
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = this.index(column, row);
        this.positions[index]?.addScaledVector(this.rightAxis, correction);
        this.previous[index]?.addScaledVector(this.rightAxis, correction);
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
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const start = this.stepStart[index];
      if (position && start) maximum = Math.max(maximum, position.distanceTo(start));
    }
    this.maximumParticleMotion = maximum;
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
    this.correction.copy(this.delta).multiplyScalar(((length - constraint.restLength) / length) * constraint.stiffness);
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
