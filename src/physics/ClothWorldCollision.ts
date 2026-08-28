import * as THREE from 'three';
import type { WorldCollider, WorldSphereCollider } from './colliders';
import { constrainSphereContactToFloor } from './floorConstrainedContact';

export const CLOTH_WORLD_CLEARANCE = 0.004;
export const CLOTH_ROCK_CLEARANCE = 0.003;

export function getClothWorldClearance(collider: WorldCollider): number {
  return collider.kind === 'rock' ? CLOTH_ROCK_CLEARANCE : CLOTH_WORLD_CLEARANCE;
}

/** Resolves fixed-sphere contacts against the actual cloth triangles, not only their vertices. */
export class ClothWorldCollision {
  private readonly triangle = new THREE.Triangle();
  private readonly closestPoint = new THREE.Vector3();
  private readonly barycentric = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly centroid = new THREE.Vector3();
  private readonly boundsMinimum = new THREE.Vector3();
  private readonly boundsMaximum = new THREE.Vector3();
  private readonly motion = new THREE.Vector3();

  public constructor(
    private readonly positions: readonly THREE.Vector3[],
    private readonly previous: readonly THREE.Vector3[],
    private readonly inverseMass: Float32Array,
    private readonly columns: number,
    private readonly rows: number,
  ) {}

  public solve(
    colliders: readonly WorldSphereCollider[],
    contactColliders?: WorldSphereCollider[],
  ): number {
    this.updateBounds();
    let contacts = 0;
    for (const collider of colliders) {
      const radius = collider.radius + getClothWorldClearance(collider);
      if (!this.intersectsBounds(collider.center, radius)) continue;
      let colliderContacts = 0;
      for (let row = 0; row < this.rows - 1; row += 1) {
        for (let column = 0; column < this.columns - 1; column += 1) {
          const topLeft = this.index(column, row);
          const bottomLeft = this.index(column, row + 1);
          colliderContacts += this.solveTriangle(topLeft, bottomLeft, topLeft + 1, collider);
          colliderContacts += this.solveTriangle(bottomLeft, bottomLeft + 1, topLeft + 1, collider);
        }
      }
      contacts += colliderContacts;
      if (
        colliderContacts > 0
        && contactColliders
        && !contactColliders.includes(collider)
      ) {
        contactColliders.push(collider);
      }
    }
    return contacts;
  }

  public getMaximumPenetration(colliders: readonly WorldSphereCollider[]): number {
    this.updateBounds();
    let maximum = 0;
    for (const collider of colliders) {
      const radius = collider.radius + getClothWorldClearance(collider);
      if (!this.intersectsBounds(collider.center, radius)) continue;
      for (let row = 0; row < this.rows - 1; row += 1) {
        for (let column = 0; column < this.columns - 1; column += 1) {
          const topLeft = this.index(column, row);
          const bottomLeft = this.index(column, row + 1);
          maximum = Math.max(
            maximum,
            this.getTrianglePenetration(topLeft, bottomLeft, topLeft + 1, collider.center, radius),
            this.getTrianglePenetration(bottomLeft, bottomLeft + 1, topLeft + 1, collider.center, radius),
          );
        }
      }
    }
    return maximum;
  }

  private solveTriangle(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    collider: WorldSphereCollider,
  ): number {
    const first = this.positions[firstIndex];
    const second = this.positions[secondIndex];
    const third = this.positions[thirdIndex];
    if (!first || !second || !third) return 0;

    const clearance = getClothWorldClearance(collider);
    const radius = collider.radius + clearance;
    if (!this.intersectsTriangleBounds(first, second, third, collider.center, radius)) return 0;
    this.triangle.set(first, second, third);
    this.triangle.closestPointToPoint(collider.center, this.closestPoint);
    const distanceSquared = this.closestPoint.distanceToSquared(collider.center);
    if (distanceSquared >= radius * radius) return 0;
    if (this.triangle.getBarycoord(this.closestPoint, this.barycentric) === null) return 0;

    const firstWeight = this.inverseMass[firstIndex] ?? 0;
    const secondWeight = this.inverseMass[secondIndex] ?? 0;
    const thirdWeight = this.inverseMass[thirdIndex] ?? 0;
    const denominator = firstWeight * this.barycentric.x * this.barycentric.x
      + secondWeight * this.barycentric.y * this.barycentric.y
      + thirdWeight * this.barycentric.z * this.barycentric.z;
    if (denominator < 0.000_001) return 0;

    const distance = Math.sqrt(distanceSquared);
    this.normal.copy(this.closestPoint).sub(collider.center);
    if (distance > 0.000_001) {
      this.normal.multiplyScalar(1 / distance);
    } else {
      this.triangle.getNormal(this.normal);
      this.triangle.getMidpoint(this.centroid);
      if (this.normal.dot(this.centroid.sub(collider.center)) < 0) this.normal.negate();
      if (this.normal.lengthSq() < 0.000_001) this.normal.set(0, 1, 0);
    }

    this.triangle.getMidpoint(this.centroid);
    const constrainedCorrection = constrainSphereContactToFloor(
      this.closestPoint,
      collider.center,
      radius,
      clearance,
      this.normal,
      this.centroid,
    );
    const penetration = constrainedCorrection ?? radius - distance;
    const lambda = penetration / denominator;
    this.applyCorrection(firstIndex, firstWeight * this.barycentric.x * lambda);
    this.applyCorrection(secondIndex, secondWeight * this.barycentric.y * lambda);
    this.applyCorrection(thirdIndex, thirdWeight * this.barycentric.z * lambda);
    return 1;
  }

  private getTrianglePenetration(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    center: THREE.Vector3,
    radius: number,
  ): number {
    const first = this.positions[firstIndex];
    const second = this.positions[secondIndex];
    const third = this.positions[thirdIndex];
    if (!first || !second || !third) return 0;
    if (!this.intersectsTriangleBounds(first, second, third, center, radius)) return 0;
    this.triangle.set(first, second, third);
    this.triangle.closestPointToPoint(center, this.closestPoint);
    return Math.max(0, radius - this.closestPoint.distanceTo(center));
  }

  private applyCorrection(index: number, scale: number): void {
    if (scale <= 0) return;
    const position = this.positions[index];
    const previous = this.previous[index];
    if (!position || !previous) return;
    position.addScaledVector(this.normal, scale);
    previous.addScaledVector(this.normal, scale);
    const inwardMotion = this.motion.copy(position).sub(previous).dot(this.normal);
    if (inwardMotion < 0) previous.addScaledVector(this.normal, inwardMotion);
  }

  private updateBounds(): void {
    this.boundsMinimum.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    this.boundsMaximum.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    for (const position of this.positions) {
      this.boundsMinimum.min(position);
      this.boundsMaximum.max(position);
    }
  }

  private intersectsBounds(center: THREE.Vector3, radius: number): boolean {
    return center.x + radius >= this.boundsMinimum.x
      && center.x - radius <= this.boundsMaximum.x
      && center.y + radius >= this.boundsMinimum.y
      && center.y - radius <= this.boundsMaximum.y
      && center.z + radius >= this.boundsMinimum.z
      && center.z - radius <= this.boundsMaximum.z;
  }

  private intersectsTriangleBounds(
    first: THREE.Vector3,
    second: THREE.Vector3,
    third: THREE.Vector3,
    center: THREE.Vector3,
    radius: number,
  ): boolean {
    return center.x + radius >= Math.min(first.x, second.x, third.x)
      && center.x - radius <= Math.max(first.x, second.x, third.x)
      && center.y + radius >= Math.min(first.y, second.y, third.y)
      && center.y - radius <= Math.max(first.y, second.y, third.y)
      && center.z + radius >= Math.min(first.z, second.z, third.z)
      && center.z - radius <= Math.max(first.z, second.z, third.z);
  }

  private index(column: number, row: number): number {
    return row * this.columns + column;
  }
}
