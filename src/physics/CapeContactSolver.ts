import * as THREE from 'three';
import { CAPE, CAVE } from '../config';
import {
  caveCeiling,
  caveCenterX,
  caveGroundHeightAt,
  caveInteriorHalfWidthAtHeight,
} from '../world/caveProfile';
import type { CapsuleCollider, WorldSphereCollider } from './colliders';

const BODY_CLEARANCE = 0.026;
const WORLD_CLEARANCE = 0.034;
const WORLD_QUERY_RADIUS = CAPE.length + 2.2;

export interface WorldContactDiagnostics {
  readonly lastStep: number;
  readonly total: number;
}

export class CapeContactSolver {
  private readonly nearbyWorldColliders: WorldSphereCollider[] = [];
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
  private worldContactsLastStep = 0;
  private worldContactEvents = 0;

  public constructor(
    private readonly positions: readonly THREE.Vector3[],
    private readonly previous: readonly THREE.Vector3[],
  ) {}

  public beginStep(anchorCenter: THREE.Vector3, colliders: readonly WorldSphereCollider[]): void {
    this.worldContactsLastStep = 0;
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
  }

  public solveWorld(): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      for (const collider of this.nearbyWorldColliders) {
        this.solveWorldSphere(position, previous, collider);
      }
    }
  }

  public solveCave(): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;

      const clampedZ = THREE.MathUtils.clamp(position.z, CAVE.endZ + 0.08, CAVE.startZ - 0.08);
      if (clampedZ !== position.z) this.applyAxisCorrection(position, previous, 'z', clampedZ - position.z);

      const floor = caveGroundHeightAt(position.x, position.z) + WORLD_CLEARANCE;
      if (position.y < floor) this.applyAxisCorrection(position, previous, 'y', floor - position.y);

      const ceiling = caveCeiling(position.z) + 0.12 - WORLD_CLEARANCE;
      if (position.y > ceiling) this.applyAxisCorrection(position, previous, 'y', ceiling - position.y);

      const center = caveCenterX(position.z);
      const halfWidth = caveInteriorHalfWidthAtHeight(position.y, position.z, WORLD_CLEARANCE);
      const clampedX = THREE.MathUtils.clamp(position.x, center - halfWidth, center + halfWidth);
      if (clampedX !== position.x) this.applyAxisCorrection(position, previous, 'x', clampedX - position.x);
    }
  }

  public getMaximumBodyPenetration(
    colliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): number {
    let maximum = 0;
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      if (!position) continue;
      for (const collider of colliders) {
        maximum = Math.max(maximum, this.getCapsulePenetration(position, collider, back));
      }
    }
    return maximum;
  }

  public getMaximumEnvironmentPenetration(colliders: readonly WorldSphereCollider[]): number {
    let maximum = 0;
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      if (!position) continue;
      for (const collider of colliders) {
        maximum = Math.max(maximum, collider.radius + WORLD_CLEARANCE - position.distanceTo(collider.center));
      }
      maximum = Math.max(maximum, caveGroundHeightAt(position.x, position.z) + WORLD_CLEARANCE - position.y);
      const halfWidth = caveInteriorHalfWidthAtHeight(position.y, position.z, WORLD_CLEARANCE);
      maximum = Math.max(maximum, Math.abs(position.x - caveCenterX(position.z)) - halfWidth);
    }
    return Math.max(0, maximum);
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
    const radius = collider.radius + BODY_CLEARANCE;
    if (lateralSquared >= radius * radius) return 0;
    return Math.max(0, Math.sqrt(radius * radius - lateralSquared) - depth);
  }

  private solveWorldSphere(
    position: THREE.Vector3,
    previous: THREE.Vector3,
    collider: WorldSphereCollider,
  ): void {
    const radius = collider.radius + WORLD_CLEARANCE;
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
      const correction = radius - distance;
      position.addScaledVector(this.contactNormal, correction);
      previous.addScaledVector(this.contactNormal, correction);
      return;
    }

    this.sweep.copy(position).sub(previous);
    const sweepLengthSquared = this.sweep.lengthSq();
    if (sweepLengthSquared < 0.000_000_1) return;
    this.sweepStart.copy(previous).sub(collider.center);
    const startDistance = this.sweepStart.lengthSq() - radius * radius;
    if (startDistance <= 0) return;
    const approach = this.sweepStart.dot(this.sweep);
    if (approach >= 0) return;
    const discriminant = approach * approach - sweepLengthSquared * startDistance;
    if (discriminant < 0) return;
    const hitTime = (-approach - Math.sqrt(discriminant)) / sweepLengthSquared;
    if (hitTime < 0 || hitTime > 1) return;

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
}
