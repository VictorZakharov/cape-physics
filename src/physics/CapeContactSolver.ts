import * as THREE from 'three';
import { CAPE, CAVE } from '../config';
import {
  caveCeiling,
  caveGroundHeightAt,
  caveInteriorBoundsAtHeight,
} from '../world/caveProfile';
import type { CaveHorizontalBounds } from '../world/CaveShellSampler';
import {
  isWorldRockCollider,
  type CapsuleCollider,
  type WorldCollider,
  type WorldRockCollider,
  type WorldSphereCollider,
} from './colliders';
import { CLOTH_BODY_CLEARANCE, ClothBodyCollision } from './ClothBodyCollision';
import { ClothRockCollision } from './ClothRockCollision';
import {
  CLOTH_ROCK_CLEARANCE,
  CLOTH_WORLD_CLEARANCE,
  ClothWorldCollision,
  getClothWorldClearance,
} from './ClothWorldCollision';
import { constrainSphereContactToFloor } from './floorConstrainedContact';
import {
  isBelowWalkableRockShoulder,
  RockColliderQuery,
} from './RockCollider';

const WORLD_QUERY_RADIUS = CAPE.length + 2.2;
const WORLD_BROADPHASE_SKIN = 0.08;
const BODY_FACE_SOLVER_PASSES = 3;
// Discrete overlap recovery must not move one cloth particle by a sizeable
// fraction of a segment in one 120 Hz step. Continuous sweeps remain
// available for physical per-frame motion, so intentional motion cannot
// tunnel while iterative constraint displacement cannot masquerade as speed.
const MAXIMUM_DISCRETE_ROCK_CORRECTION = 0.012;
const MAXIMUM_BLOCKING_ROCK_CORRECTION = 0.03;
const MAXIMUM_CONTINUOUS_ROCK_SWEEP = 0.08;

export interface WorldContactDiagnostics {
  readonly lastStep: number;
  readonly total: number;
}

export interface RockSurfaceContactDiagnostics {
  readonly distance: number;
  readonly center: readonly [number, number, number];
}

export class CapeContactSolver {
  private readonly nearbyWorldColliders: WorldCollider[] = [];
  private readonly activeWorldColliders: WorldCollider[] = [];
  private readonly activeWorldSpheres: WorldSphereCollider[] = [];
  private readonly activeRocks: WorldRockCollider[] = [];
  private readonly postCaveWorldSpheres: WorldSphereCollider[] = [];
  private readonly postCaveRocks: WorldRockCollider[] = [];
  private readonly delta = new THREE.Vector3();
  private readonly capsuleAxis = new THREE.Vector3();
  private readonly lateralAxis = new THREE.Vector3();
  private readonly particleLateral = new THREE.Vector3();
  private readonly closestPoint = new THREE.Vector3();
  private readonly sweep = new THREE.Vector3();
  private readonly sweepStart = new THREE.Vector3();
  private readonly hitPoint = new THREE.Vector3();
  private readonly contactNormal = new THREE.Vector3();
  private readonly remainingMotion = new THREE.Vector3();
  private readonly boundsMinimum = new THREE.Vector3();
  private readonly boundsMaximum = new THREE.Vector3();
  private readonly caveBounds: CaveHorizontalBounds = { minimum: 0, maximum: 0 };
  private worldContactsLastStep = 0;
  private worldContactEvents = 0;
  private bodySolvePass = 0;
  private readonly bodyFaceCollision: ClothBodyCollision;
  private readonly faceCollision: ClothWorldCollision;
  private readonly rockFaceCollision: ClothRockCollision;
  private readonly rockQuery = new RockColliderQuery();
  private readonly rockCorrectionUsed: Float32Array;
  private readonly rockSweepResolved: Uint8Array;

  public constructor(
    private readonly positions: readonly THREE.Vector3[],
    private readonly previous: readonly THREE.Vector3[],
    inverseMass: Float32Array,
  ) {
    this.bodyFaceCollision = new ClothBodyCollision(
      positions,
      previous,
      inverseMass,
      CAPE.columns,
      CAPE.rows,
    );
    this.faceCollision = new ClothWorldCollision(
      positions,
      previous,
      inverseMass,
      CAPE.columns,
      CAPE.rows,
    );
    this.rockCorrectionUsed = new Float32Array(inverseMass.length);
    this.rockSweepResolved = new Uint8Array(inverseMass.length);
    this.rockFaceCollision = new ClothRockCollision(
      positions,
      previous,
      inverseMass,
      CAPE.columns,
      CAPE.rows,
      CLOTH_ROCK_CLEARANCE,
      this.rockCorrectionUsed,
      MAXIMUM_DISCRETE_ROCK_CORRECTION,
    );
  }

  public beginStep(anchorCenter: THREE.Vector3, colliders: readonly WorldCollider[]): void {
    this.worldContactsLastStep = 0;
    this.bodySolvePass = 0;
    this.rockCorrectionUsed.fill(0);
    this.rockSweepResolved.fill(0);
    this.rockFaceCollision.beginStep();
    this.nearbyWorldColliders.length = 0;
    for (const collider of colliders) {
      const range = WORLD_QUERY_RADIUS + collider.radius;
      if (collider.center.distanceToSquared(anchorCenter) <= range * range) {
        this.nearbyWorldColliders.push(collider);
      }
    }
  }

  public solveBody(colliders: readonly CapsuleCollider[], back: THREE.Vector3): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      for (const collider of colliders) {
        const penetration = this.getCapsulePenetration(position, collider, back);
        if (penetration <= 0) continue;
        position.addScaledVector(back, penetration);
        previous.addScaledVector(back, penetration);
      }
    }
    this.bodySolvePass += 1;
    if (this.bodySolvePass > CAPE.solverIterations - BODY_FACE_SOLVER_PASSES) {
      this.bodyFaceCollision.solve(colliders, back);
    }
  }

  public solveWorld(): void {
    this.updateActiveWorldColliders();
    this.postCaveWorldSpheres.length = 0;
    this.postCaveRocks.length = 0;
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      for (const collider of this.activeWorldColliders) {
        const contacted = isWorldRockCollider(collider)
          ? this.solveWorldRock(index, position, previous, collider)
          : this.solveWorldSphere(position, previous, collider);
        if (contacted) {
          this.registerPostCaveCollider(collider);
        }
      }
    }
    const sphereFaceContacts = this.faceCollision.solve(
      this.activeWorldSpheres,
      this.postCaveWorldSpheres,
    );
    const rockFaceContacts = this.rockFaceCollision.solve(
      this.activeRocks,
      this.postCaveRocks,
    );
    const faceContacts = sphereFaceContacts + rockFaceContacts;
    this.worldContactsLastStep += faceContacts;
    this.worldContactEvents += faceContacts;
  }

  public solvePostCaveWorldFaces(): void {
    if (
      this.postCaveWorldSpheres.length === 0
      && this.postCaveRocks.length === 0
    ) return;
    const faceContacts = this.faceCollision.solve(this.postCaveWorldSpheres)
      + this.rockFaceCollision.solve(this.postCaveRocks);
    this.worldContactsLastStep += faceContacts;
    this.worldContactEvents += faceContacts;
  }

  public solveCave(): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;

      const clampedZ = THREE.MathUtils.clamp(position.z, CAVE.endZ + 0.08, CAVE.startZ - 0.08);
      if (clampedZ !== position.z) this.applyAxisCorrection(position, previous, 'z', clampedZ - position.z);

      const floor = caveGroundHeightAt(position.x, position.z) + CLOTH_WORLD_CLEARANCE;
      if (position.y < floor) this.applyAxisCorrection(position, previous, 'y', floor - position.y);

      const ceiling = caveCeiling(position.z) + 0.12 - CLOTH_WORLD_CLEARANCE;
      if (position.y > ceiling) this.applyAxisCorrection(position, previous, 'y', ceiling - position.y);

      caveInteriorBoundsAtHeight(
        position.y,
        position.z,
        CLOTH_WORLD_CLEARANCE,
        this.caveBounds,
      );
      const clampedX = THREE.MathUtils.clamp(
        position.x,
        this.caveBounds.minimum,
        this.caveBounds.maximum,
      );
      if (clampedX !== position.x) this.applyAxisCorrection(position, previous, 'x', clampedX - position.x);
    }
  }

  public getMaximumBodyPenetration(
    colliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): number {
    let maximum = 0;
    for (let index = 0; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      if (!position) continue;
      for (const collider of colliders) {
        maximum = Math.max(maximum, this.getCapsulePenetration(position, collider, back));
      }
    }
    return Math.max(maximum, this.bodyFaceCollision.getMaximumPenetration(colliders, back));
  }

  public getMaximumEnvironmentPenetration(colliders: readonly WorldCollider[]): number {
    let maximum = 0;
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      if (!position) continue;
      for (const collider of colliders) {
        const penetration = isWorldRockCollider(collider)
          ? CLOTH_ROCK_CLEARANCE
            - this.rockQuery.getSignedDistance(collider, position, this.contactNormal)
          : collider.radius
            + getClothWorldClearance(collider)
            - position.distanceTo(collider.center);
        maximum = Math.max(maximum, penetration);
      }
      maximum = Math.max(maximum, caveGroundHeightAt(position.x, position.z) + CLOTH_WORLD_CLEARANCE - position.y);
      caveInteriorBoundsAtHeight(
        position.y,
        position.z,
        CLOTH_WORLD_CLEARANCE,
        this.caveBounds,
      );
      maximum = Math.max(
        maximum,
        this.caveBounds.minimum - position.x,
        position.x - this.caveBounds.maximum,
      );
    }
    return Math.max(
      maximum,
      this.faceCollision.getMaximumPenetration(
        colliders.filter((collider): collider is WorldSphereCollider => !isWorldRockCollider(collider)),
      ),
      this.rockFaceCollision.getMaximumPenetration(
        colliders.filter(isWorldRockCollider),
      ),
    );
  }

  public getMaximumEnvironmentFacePenetration(colliders: readonly WorldCollider[]): number {
    return Math.max(
      this.faceCollision.getMaximumPenetration(
        colliders.filter((collider): collider is WorldSphereCollider => !isWorldRockCollider(collider)),
      ),
      this.rockFaceCollision.getMaximumPenetration(colliders.filter(isWorldRockCollider)),
    );
  }

  public getClosestActiveRockSurfaceContact(): RockSurfaceContactDiagnostics | null {
    const contact = this.rockFaceCollision.getClosestSurfaceContact(this.activeRocks);
    if (!contact) return null;
    const { center } = contact.collider;
    return {
      distance: contact.distance,
      center: [center.x, center.y, center.z],
    };
  }

  public getDiagnostics(): WorldContactDiagnostics {
    return { lastStep: this.worldContactsLastStep, total: this.worldContactEvents };
  }

  private getCapsulePenetration(
    position: THREE.Vector3,
    collider: CapsuleCollider,
    back: THREE.Vector3,
  ): number {
    this.capsuleAxis.copy(collider.end).sub(collider.start);
    const axisDepth = this.capsuleAxis.dot(back);
    this.lateralAxis.copy(this.capsuleAxis).addScaledVector(back, -axisDepth);
    this.delta.copy(position).sub(collider.start);
    const particleDepth = this.delta.dot(back);
    this.particleLateral.copy(this.delta).addScaledVector(back, -particleDepth);
    const lateralLengthSquared = this.lateralAxis.lengthSq();
    const progress = lateralLengthSquared > 0.000_001
      ? THREE.MathUtils.clamp(this.particleLateral.dot(this.lateralAxis) / lateralLengthSquared, 0, 1)
      : 0;
    this.closestPoint.copy(collider.start).addScaledVector(this.capsuleAxis, progress);
    this.delta.copy(position).sub(this.closestPoint);
    const depth = this.delta.dot(back);
    const lateralSquared = Math.max(0, this.delta.lengthSq() - depth * depth);
    const radius = collider.radius + CLOTH_BODY_CLEARANCE;
    if (lateralSquared >= radius * radius) return 0;
    return Math.max(0, Math.sqrt(radius * radius - lateralSquared) - depth);
  }

  private solveWorldSphere(
    position: THREE.Vector3,
    previous: THREE.Vector3,
    collider: WorldSphereCollider,
  ): boolean {
    const clearance = getClothWorldClearance(collider);
    const radius = collider.radius + clearance;
    this.delta.copy(position).sub(collider.center);
    const distanceSquared = this.delta.lengthSq();
    if (distanceSquared < radius * radius) {
      this.registerWorldContact();
      const distance = Math.sqrt(distanceSquared);
      if (distance < 0.000_001) {
        this.contactNormal.copy(previous).sub(collider.center);
        if (this.contactNormal.lengthSq() < 0.000_001) this.contactNormal.set(0, 1, 0);
        else this.contactNormal.normalize();
      } else {
        this.contactNormal.copy(this.delta).multiplyScalar(1 / distance);
      }
      let correction = radius - distance;
      const constrainedCorrection = constrainSphereContactToFloor(
        position,
        collider.center,
        radius,
        clearance,
        this.contactNormal,
        previous,
      );
      if (constrainedCorrection !== null) correction = constrainedCorrection;
      position.addScaledVector(this.contactNormal, correction);
      previous.addScaledVector(this.contactNormal, correction);
      return true;
    }

    this.sweep.copy(position).sub(previous);
    const sweepLengthSquared = this.sweep.lengthSq();
    if (sweepLengthSquared < 0.000_000_1) return false;
    this.sweepStart.copy(previous).sub(collider.center);
    const startDistance = this.sweepStart.lengthSq() - radius * radius;
    if (startDistance <= 0) return false;
    const approach = this.sweepStart.dot(this.sweep);
    if (approach >= 0) return false;
    const discriminant = approach * approach - sweepLengthSquared * startDistance;
    if (discriminant < 0) return false;
    const hitTime = (-approach - Math.sqrt(discriminant)) / sweepLengthSquared;
    if (hitTime < 0 || hitTime > 1) return false;

    this.registerWorldContact();
    this.hitPoint.copy(previous).addScaledVector(this.sweep, hitTime);
    this.contactNormal.copy(this.hitPoint).sub(collider.center).normalize();
    this.remainingMotion.copy(this.sweep).multiplyScalar(1 - hitTime);
    const inwardMotion = this.remainingMotion.dot(this.contactNormal);
    if (inwardMotion < 0) this.remainingMotion.addScaledVector(this.contactNormal, -inwardMotion);
    this.remainingMotion.multiplyScalar(0.76);
    this.hitPoint.addScaledVector(this.contactNormal, 0.0015);
    previous.copy(this.hitPoint);
    position.copy(this.hitPoint).add(this.remainingMotion);
    return true;
  }

  private solveWorldRock(
    particleIndex: number,
    position: THREE.Vector3,
    previous: THREE.Vector3,
    collider: WorldRockCollider,
  ): boolean {
    if (!this.rockQuery.intersectsExpandedBounds(
      collider,
      previous,
      position,
      CLOTH_ROCK_CLEARANCE,
    )) return false;
    const startDistance = this.rockQuery.getSignedDistance(
      collider,
      previous,
      this.delta,
    );
    this.sweep.copy(position).sub(previous);
    if (
      this.rockSweepResolved[particleIndex] === 0
      && this.sweep.lengthSq() <= MAXIMUM_CONTINUOUS_ROCK_SWEEP ** 2
      && startDistance >= CLOTH_ROCK_CLEARANCE
    ) {
      const hitTime = this.rockQuery.sweep(
        collider,
        previous,
        position,
        CLOTH_ROCK_CLEARANCE,
        this.contactNormal,
      );
      if (hitTime !== null) {
        this.registerWorldContact();
        this.rockSweepResolved[particleIndex] = 1;
        this.hitPoint.copy(previous).addScaledVector(this.sweep, hitTime);
        this.redirectRockContactAlongFloor(this.hitPoint, collider);
        this.remainingMotion.copy(this.sweep).multiplyScalar(1 - hitTime);
        const inwardMotion = this.remainingMotion.dot(this.contactNormal);
        if (inwardMotion < 0) {
          this.remainingMotion.addScaledVector(this.contactNormal, -inwardMotion);
        }
        this.remainingMotion.multiplyScalar(0.76);
        this.hitPoint.addScaledVector(this.contactNormal, 0.001);
        previous.copy(this.hitPoint);
        position.copy(this.hitPoint).add(this.remainingMotion);
        return true;
      }
    }

    const signedDistance = this.rockQuery.getSignedDistance(
      collider,
      position,
      this.contactNormal,
    );
    if (signedDistance < CLOTH_ROCK_CLEARANCE) {
      this.registerWorldContact();
      let correction = CLOTH_ROCK_CLEARANCE - signedDistance;
      if (this.redirectRockContactAlongFloor(position, collider)) {
        correction = Math.min(correction, collider.radius * 0.5);
      }
      const remainingCorrection = Math.max(
        0,
        (collider.walkable
          ? MAXIMUM_DISCRETE_ROCK_CORRECTION
          : MAXIMUM_BLOCKING_ROCK_CORRECTION)
          - (this.rockCorrectionUsed[particleIndex] ?? 0),
      );
      correction = Math.min(correction, remainingCorrection);
      if (correction <= 0) return true;
      position.addScaledVector(this.contactNormal, correction);
      previous.addScaledVector(this.contactNormal, correction);
      this.rockCorrectionUsed[particleIndex] = (
        this.rockCorrectionUsed[particleIndex] ?? 0
      ) + correction;
      return true;
    }
    return false;
  }

  private redirectRockContactAlongFloor(
    position: THREE.Vector3,
    collider: WorldRockCollider,
  ): boolean {
    const trappedBelowSurface = this.contactNormal.y < 0
      && position.y <= caveGroundHeightAt(position.x, position.z)
        + CLOTH_ROCK_CLEARANCE * 2;
    if (
      !isBelowWalkableRockShoulder(collider, position.y)
      && !trappedBelowSurface
    ) return false;
    this.contactNormal.set(
      position.x - collider.center.x,
      0,
      position.z - collider.center.z,
    );
    if (this.contactNormal.lengthSq() < 0.000_001) this.contactNormal.set(1, 0, 0);
    else this.contactNormal.normalize();
    return true;
  }

  private applyAxisCorrection(
    position: THREE.Vector3,
    previous: THREE.Vector3,
    axis: 'x' | 'y' | 'z',
    correction: number,
  ): void {
    position[axis] += correction;
    previous[axis] += correction;
  }

  private registerWorldContact(): void {
    this.worldContactsLastStep += 1;
    this.worldContactEvents += 1;
  }

  private registerPostCaveCollider(collider: WorldCollider): void {
    if (isWorldRockCollider(collider)) {
      if (!this.postCaveRocks.includes(collider)) this.postCaveRocks.push(collider);
    } else if (!this.postCaveWorldSpheres.includes(collider)) {
      this.postCaveWorldSpheres.push(collider);
    }
  }

  private updateActiveWorldColliders(): void {
    this.boundsMinimum.set(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    );
    this.boundsMaximum.set(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    );
    for (let index = 0; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (position) {
        this.boundsMinimum.min(position);
        this.boundsMaximum.max(position);
      }
      if (previous) {
        this.boundsMinimum.min(previous);
        this.boundsMaximum.max(previous);
      }
    }

    this.activeWorldColliders.length = 0;
    this.activeWorldSpheres.length = 0;
    this.activeRocks.length = 0;
    for (const collider of this.nearbyWorldColliders) {
      if (isWorldRockCollider(collider)) {
        const clearance = CLOTH_ROCK_CLEARANCE + WORLD_BROADPHASE_SKIN;
        if (
          collider.bounds.max.x + clearance < this.boundsMinimum.x
          || collider.bounds.min.x - clearance > this.boundsMaximum.x
          || collider.bounds.max.y + clearance < this.boundsMinimum.y
          || collider.bounds.min.y - clearance > this.boundsMaximum.y
          || collider.bounds.max.z + clearance < this.boundsMinimum.z
          || collider.bounds.min.z - clearance > this.boundsMaximum.z
        ) continue;
        this.activeWorldColliders.push(collider);
        this.activeRocks.push(collider);
        continue;
      }
      const radius = collider.radius + getClothWorldClearance(collider) + WORLD_BROADPHASE_SKIN;
      if (
        collider.center.x + radius < this.boundsMinimum.x
        || collider.center.x - radius > this.boundsMaximum.x
        || collider.center.y + radius < this.boundsMinimum.y
        || collider.center.y - radius > this.boundsMaximum.y
        || collider.center.z + radius < this.boundsMinimum.z
        || collider.center.z - radius > this.boundsMaximum.z
      ) continue;
      this.activeWorldColliders.push(collider);
      this.activeWorldSpheres.push(collider);
    }
  }
}
