import * as THREE from 'three';
import type { CapsuleCollider } from './colliders';

export const CLOTH_BODY_CLEARANCE = 0.026;

/**
 * Resolves one-sided character contact against cloth triangle faces. Vertex-only
 * capsules can otherwise pass through the middle of a coarse cloth triangle.
 */
export class ClothBodyCollision {
  private readonly triangle = new THREE.Triangle();
  private readonly closestPoint = new THREE.Vector3();
  private readonly barycentric = new THREE.Vector3();
  private readonly capsuleAxis = new THREE.Vector3();
  private readonly sampleCenter = new THREE.Vector3();
  private readonly delta = new THREE.Vector3();
  private readonly boundsMinimum = new THREE.Vector3();
  private readonly boundsMaximum = new THREE.Vector3();

  public constructor(
    private readonly positions: readonly THREE.Vector3[],
    private readonly previous: readonly THREE.Vector3[],
    private readonly inverseMass: Float32Array,
    private readonly columns: number,
    private readonly rows: number,
  ) {}

  public solve(colliders: readonly CapsuleCollider[], back: THREE.Vector3): void {
    this.updateBounds();
    this.forEachCapsuleSample(colliders, (center, radius) => {
      if (!this.intersectsBounds(center, radius)) return;
      this.forEachTriangle((first, second, third) => {
        this.solveTriangle(first, second, third, center, radius, back);
      });
    });
  }

  public getMaximumPenetration(
    colliders: readonly CapsuleCollider[],
    back: THREE.Vector3,
  ): number {
    this.updateBounds();
    let maximum = 0;
    this.forEachCapsuleSample(colliders, (center, radius) => {
      if (!this.intersectsBounds(center, radius)) return;
      this.forEachTriangle((first, second, third) => {
        maximum = Math.max(
          maximum,
          this.getTrianglePenetration(first, second, third, center, radius, back),
        );
      });
    });
    return maximum;
  }

  private solveTriangle(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    center: THREE.Vector3,
    radius: number,
    back: THREE.Vector3,
  ): void {
    const first = this.positions[firstIndex];
    const second = this.positions[secondIndex];
    const third = this.positions[thirdIndex];
    if (!first || !second || !third) return;
    if (!this.intersectsTriangleBounds(first, second, third, center, radius)) return;

    this.triangle.set(first, second, third);
    this.triangle.closestPointToPoint(center, this.closestPoint);
    const penetration = this.oneSidedPenetration(this.closestPoint, center, radius, back);
    if (penetration <= 0) return;
    if (this.triangle.getBarycoord(this.closestPoint, this.barycentric) === null) return;

    const firstWeight = this.inverseMass[firstIndex] ?? 0;
    const secondWeight = this.inverseMass[secondIndex] ?? 0;
    const thirdWeight = this.inverseMass[thirdIndex] ?? 0;
    const denominator = firstWeight * this.barycentric.x * this.barycentric.x
      + secondWeight * this.barycentric.y * this.barycentric.y
      + thirdWeight * this.barycentric.z * this.barycentric.z;
    if (denominator < 0.000_001) return;

    const lambda = penetration / denominator;
    this.applyCorrection(firstIndex, firstWeight * this.barycentric.x * lambda, back);
    this.applyCorrection(secondIndex, secondWeight * this.barycentric.y * lambda, back);
    this.applyCorrection(thirdIndex, thirdWeight * this.barycentric.z * lambda, back);
  }

  private getTrianglePenetration(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    center: THREE.Vector3,
    radius: number,
    back: THREE.Vector3,
  ): number {
    const first = this.positions[firstIndex];
    const second = this.positions[secondIndex];
    const third = this.positions[thirdIndex];
    if (!first || !second || !third) return 0;
    if (!this.intersectsTriangleBounds(first, second, third, center, radius)) return 0;
    this.triangle.set(first, second, third);
    this.triangle.closestPointToPoint(center, this.closestPoint);
    return this.oneSidedPenetration(this.closestPoint, center, radius, back);
  }

  private oneSidedPenetration(
    point: THREE.Vector3,
    center: THREE.Vector3,
    radius: number,
    back: THREE.Vector3,
  ): number {
    this.delta.copy(point).sub(center);
    const depth = this.delta.dot(back);
    const lateralSquared = Math.max(0, this.delta.lengthSq() - depth * depth);
    if (lateralSquared >= radius * radius) return 0;
    return Math.max(0, Math.sqrt(radius * radius - lateralSquared) - depth);
  }

  private forEachCapsuleSample(
    colliders: readonly CapsuleCollider[],
    visit: (center: THREE.Vector3, radius: number) => void,
  ): void {
    for (const collider of colliders) {
      this.capsuleAxis.copy(collider.end).sub(collider.start);
      const length = this.capsuleAxis.length();
      const radius = collider.radius + CLOTH_BODY_CLEARANCE;
      const segments = length < 0.000_001
        ? 0
        : Math.max(1, Math.ceil(length / Math.max(0.04, radius * 0.82)));
      const stepLength = segments > 0 ? length / segments : 0;
      const sampleRadius = Math.hypot(radius, stepLength * 0.5);
      for (let sample = 0; sample <= segments; sample += 1) {
        const progress = segments > 0 ? sample / segments : 0;
        this.sampleCenter.lerpVectors(collider.start, collider.end, progress);
        visit(this.sampleCenter, sampleRadius);
      }
    }
  }

  private forEachTriangle(visit: (first: number, second: number, third: number) => void): void {
    for (let row = 0; row < this.rows - 1; row += 1) {
      for (let column = 0; column < this.columns - 1; column += 1) {
        const topLeft = this.index(column, row);
        const bottomLeft = this.index(column, row + 1);
        visit(topLeft, bottomLeft, topLeft + 1);
        visit(bottomLeft, bottomLeft + 1, topLeft + 1);
      }
    }
  }

  private applyCorrection(index: number, scale: number, back: THREE.Vector3): void {
    if (scale <= 0) return;
    this.positions[index]?.addScaledVector(back, scale);
    this.previous[index]?.addScaledVector(back, scale);
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
