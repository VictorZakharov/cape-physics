import * as THREE from 'three';
import type { WorldRockCollider } from './colliders';
import {
  isBelowWalkableRockShoulder,
  RockColliderQuery,
} from './RockCollider';

const DISTANCE_EPSILON = 0.000_001;
const VERTEX_CONTACT_EPSILON = 0.0005;
const MAXIMUM_FACE_CORRECTION_CLEARANCES = 4;

export interface ClothRockSurfaceContact {
  readonly distance: number;
  readonly collider: WorldRockCollider;
}

/**
 * Resolves convex-rock surface intersections against cloth triangle faces.
 * Vertex contacts are handled separately; this closes the complementary case
 * where a sharp rock edge enters the middle of a coarse cloth triangle.
 */
export class ClothRockCollision {
  private readonly clothTriangle = new THREE.Triangle();
  private readonly clothPoint = new THREE.Vector3();
  private readonly rockPoint = new THREE.Vector3();
  private readonly candidateCloth = new THREE.Vector3();
  private readonly candidateRock = new THREE.Vector3();
  private readonly barycentric = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly boundsMinimum = new THREE.Vector3();
  private readonly boundsMaximum = new THREE.Vector3();
  private readonly clothBounds = new THREE.Box3();
  private readonly firstDirection = new THREE.Vector3();
  private readonly secondDirection = new THREE.Vector3();
  private readonly segmentOffset = new THREE.Vector3();
  private readonly vertexNormal = new THREE.Vector3();
  private readonly rockQuery = new RockColliderQuery();
  private readonly faceCorrectionUsed: Float32Array;

  public constructor(
    private readonly positions: readonly THREE.Vector3[],
    private readonly previous: readonly THREE.Vector3[],
    private readonly inverseMass: Float32Array,
    private readonly columns: number,
    private readonly rows: number,
    private readonly clearance: number,
    private readonly correctionUsed: Float32Array,
    private readonly maximumCorrectionPerStep: number,
  ) {
    this.faceCorrectionUsed = new Float32Array(inverseMass.length);
  }

  public beginStep(): void {
    this.faceCorrectionUsed.fill(0);
  }

  public solve(
    colliders: readonly WorldRockCollider[],
    contactColliders?: WorldRockCollider[],
  ): number {
    this.updateBounds();
    let contacts = 0;
    for (const collider of colliders) {
      if (!this.intersectsColliderBounds(collider)) continue;
      let colliderContacts = 0;
      this.forEachTriangle((first, second, third) => {
        colliderContacts += this.solveTriangle(first, second, third, collider);
      });
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

  public getMaximumPenetration(colliders: readonly WorldRockCollider[]): number {
    this.updateBounds();
    let maximum = 0;
    for (const collider of colliders) {
      if (!this.intersectsColliderBounds(collider)) continue;
      this.forEachTriangle((first, second, third) => {
        maximum = Math.max(
          maximum,
          this.getTrianglePenetration(first, second, third, collider),
        );
      });
    }
    return maximum;
  }

  public getClosestSurfaceContact(
    colliders: readonly WorldRockCollider[],
  ): ClothRockSurfaceContact | null {
    let minimumDistanceSquared = Number.POSITIVE_INFINITY;
    let closestCollider: WorldRockCollider | undefined;
    for (const collider of colliders) {
      this.forEachTriangle((firstIndex, secondIndex, thirdIndex) => {
        const first = this.positions[firstIndex];
        const second = this.positions[secondIndex];
        const third = this.positions[thirdIndex];
        if (!first || !second || !third) return;
        this.clothTriangle.set(first, second, third);
        for (const face of collider.faces) {
          const distanceSquared = this.closestTrianglePoints(
            this.clothTriangle,
            face.triangle,
            this.candidateCloth,
            this.candidateRock,
          );
          if (distanceSquared >= minimumDistanceSquared) continue;
          minimumDistanceSquared = distanceSquared;
          closestCollider = collider;
        }
      });
    }
    return closestCollider && Number.isFinite(minimumDistanceSquared)
      ? { distance: Math.sqrt(minimumDistanceSquared), collider: closestCollider }
      : null;
  }

  private solveTriangle(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    collider: WorldRockCollider,
  ): number {
    const penetration = this.findTrianglePenetration(
      firstIndex,
      secondIndex,
      thirdIndex,
      collider,
    );
    if (penetration <= 0) return 0;
    if (this.clothTriangle.getBarycoord(this.clothPoint, this.barycentric) === null) return 0;
    // This solver is deliberately complementary to particle collision. If a
    // triangle vertex already touches the rock, applying a second full
    // triangle projection duplicates the response across adjacent faces and
    // can turn millimetres of clearance into a large cloth impulse.
    if (this.hasVertexContact(firstIndex, secondIndex, thirdIndex, collider)) return 0;

    const firstWeight = this.inverseMass[firstIndex] ?? 0;
    const secondWeight = this.inverseMass[secondIndex] ?? 0;
    const thirdWeight = this.inverseMass[thirdIndex] ?? 0;
    const denominator = firstWeight * this.barycentric.x * this.barycentric.x
      + secondWeight * this.barycentric.y * this.barycentric.y
      + thirdWeight * this.barycentric.z * this.barycentric.z;
    if (denominator < DISTANCE_EPSILON) return 0;

    if (
      isBelowWalkableRockShoulder(collider, this.clothPoint.y)
      || (
        this.normal.y < 0
        && this.clothPoint.y <= collider.bounds.min.y + this.clearance * 2
      )
    ) {
      this.normal.set(
        this.clothPoint.x - collider.center.x,
        0,
        this.clothPoint.z - collider.center.z,
      );
      if (this.normal.lengthSq() < DISTANCE_EPSILON) this.normal.set(1, 0, 0);
      else this.normal.normalize();
    }

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
    collider: WorldRockCollider,
  ): number {
    const penetration = this.findTrianglePenetration(
      firstIndex,
      secondIndex,
      thirdIndex,
      collider,
    );
    if (
      penetration <= 0
      || this.hasVertexContact(firstIndex, secondIndex, thirdIndex, collider)
    ) return 0;
    return penetration;
  }

  private hasVertexContact(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    collider: WorldRockCollider,
  ): boolean {
    return this.isVertexContact(firstIndex, collider)
      || this.isVertexContact(secondIndex, collider)
      || this.isVertexContact(thirdIndex, collider);
  }

  private isVertexContact(index: number, collider: WorldRockCollider): boolean {
    const position = this.positions[index];
    return Boolean(
      position
      && this.rockQuery.getSignedDistance(
        collider,
        position,
        this.vertexNormal,
      ) <= this.clearance + VERTEX_CONTACT_EPSILON,
    );
  }

  private findTrianglePenetration(
    firstIndex: number,
    secondIndex: number,
    thirdIndex: number,
    collider: WorldRockCollider,
  ): number {
    const first = this.positions[firstIndex];
    const second = this.positions[secondIndex];
    const third = this.positions[thirdIndex];
    if (!first || !second || !third) return 0;
    this.clothTriangle.set(first, second, third);
    this.clothBounds.setFromPoints([first, second, third]).expandByScalar(this.clearance);
    if (!this.clothBounds.intersectsBox(collider.bounds)) return 0;

    let minimumDistanceSquared = this.clearance * this.clearance;
    let closestFaceNormal: THREE.Vector3 | undefined;
    for (const face of collider.faces) {
      if (!this.clothBounds.intersectsBox(face.bounds)) continue;
      const distanceSquared = this.closestTrianglePoints(
        this.clothTriangle,
        face.triangle,
        this.candidateCloth,
        this.candidateRock,
      );
      if (distanceSquared >= minimumDistanceSquared) continue;
      minimumDistanceSquared = distanceSquared;
      this.clothPoint.copy(this.candidateCloth);
      this.rockPoint.copy(this.candidateRock);
      closestFaceNormal = face.normal;
      if (distanceSquared <= DISTANCE_EPSILON * DISTANCE_EPSILON) break;
    }
    if (!closestFaceNormal) return 0;

    const distance = Math.sqrt(minimumDistanceSquared);
    this.normal.copy(this.clothPoint).sub(this.rockPoint);
    if (
      distance > DISTANCE_EPSILON
      && this.normal.dot(closestFaceNormal) > 0
    ) {
      this.normal.multiplyScalar(1 / distance);
    } else {
      this.normal.copy(closestFaceNormal);
    }
    return this.clearance - distance;
  }

  private closestTrianglePoints(
    first: THREE.Triangle,
    second: THREE.Triangle,
    firstTarget: THREE.Vector3,
    secondTarget: THREE.Vector3,
  ): number {
    let minimum = Number.POSITIVE_INFINITY;
    const update = (
      firstPoint: THREE.Vector3,
      secondPoint: THREE.Vector3,
    ): void => {
      const distanceSquared = firstPoint.distanceToSquared(secondPoint);
      if (distanceSquared >= minimum) return;
      minimum = distanceSquared;
      firstTarget.copy(firstPoint);
      secondTarget.copy(secondPoint);
    };

    for (const vertex of [first.a, first.b, first.c]) {
      second.closestPointToPoint(vertex, this.candidateRock);
      update(vertex, this.candidateRock);
    }
    for (const vertex of [second.a, second.b, second.c]) {
      first.closestPointToPoint(vertex, this.candidateCloth);
      update(this.candidateCloth, vertex);
    }

    const firstEdges = [
      [first.a, first.b],
      [first.b, first.c],
      [first.c, first.a],
    ] as const;
    const secondEdges = [
      [second.a, second.b],
      [second.b, second.c],
      [second.c, second.a],
    ] as const;
    for (const [firstStart, firstEnd] of firstEdges) {
      for (const [secondStart, secondEnd] of secondEdges) {
        this.closestSegmentPoints(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd,
          this.candidateCloth,
          this.candidateRock,
        );
        update(this.candidateCloth, this.candidateRock);
      }
    }
    return minimum;
  }

  private closestSegmentPoints(
    firstStart: THREE.Vector3,
    firstEnd: THREE.Vector3,
    secondStart: THREE.Vector3,
    secondEnd: THREE.Vector3,
    firstTarget: THREE.Vector3,
    secondTarget: THREE.Vector3,
  ): void {
    this.firstDirection.copy(firstEnd).sub(firstStart);
    this.secondDirection.copy(secondEnd).sub(secondStart);
    this.segmentOffset.copy(firstStart).sub(secondStart);
    const firstLengthSquared = this.firstDirection.lengthSq();
    const secondLengthSquared = this.secondDirection.lengthSq();
    const secondProjection = this.secondDirection.dot(this.segmentOffset);
    let firstProgress = 0;
    let secondProgress = 0;

    if (firstLengthSquared <= DISTANCE_EPSILON && secondLengthSquared <= DISTANCE_EPSILON) {
      firstTarget.copy(firstStart);
      secondTarget.copy(secondStart);
      return;
    }
    if (firstLengthSquared <= DISTANCE_EPSILON) {
      secondProgress = THREE.MathUtils.clamp(secondProjection / secondLengthSquared, 0, 1);
    } else {
      const firstProjection = this.firstDirection.dot(this.segmentOffset);
      if (secondLengthSquared <= DISTANCE_EPSILON) {
        firstProgress = THREE.MathUtils.clamp(-firstProjection / firstLengthSquared, 0, 1);
      } else {
        const crossProjection = this.firstDirection.dot(this.secondDirection);
        const denominator = firstLengthSquared * secondLengthSquared
          - crossProjection * crossProjection;
        if (Math.abs(denominator) > DISTANCE_EPSILON) {
          firstProgress = THREE.MathUtils.clamp(
            (crossProjection * secondProjection - firstProjection * secondLengthSquared)
              / denominator,
            0,
            1,
          );
        }
        secondProgress = (
          crossProjection * firstProgress + secondProjection
        ) / secondLengthSquared;
        if (secondProgress < 0) {
          secondProgress = 0;
          firstProgress = THREE.MathUtils.clamp(-firstProjection / firstLengthSquared, 0, 1);
        } else if (secondProgress > 1) {
          secondProgress = 1;
          firstProgress = THREE.MathUtils.clamp(
            (crossProjection - firstProjection) / firstLengthSquared,
            0,
            1,
          );
        }
      }
    }
    firstTarget.copy(firstStart).addScaledVector(this.firstDirection, firstProgress);
    secondTarget.copy(secondStart).addScaledVector(this.secondDirection, secondProgress);
  }

  private applyCorrection(index: number, scale: number): void {
    if (scale <= 0) return;
    const remaining = Math.max(
      0,
      Math.min(
        this.maximumCorrectionPerStep - (this.correctionUsed[index] ?? 0),
        this.clearance * MAXIMUM_FACE_CORRECTION_CLEARANCES
          - (this.faceCorrectionUsed[index] ?? 0),
      ),
    );
    const appliedScale = Math.min(scale, remaining);
    if (appliedScale <= 0) return;
    this.positions[index]?.addScaledVector(this.normal, appliedScale);
    this.previous[index]?.addScaledVector(this.normal, appliedScale);
    this.correctionUsed[index] = (this.correctionUsed[index] ?? 0) + appliedScale;
    this.faceCorrectionUsed[index] = (
      this.faceCorrectionUsed[index] ?? 0
    ) + appliedScale;
  }

  private forEachTriangle(visit: (first: number, second: number, third: number) => void): void {
    for (let row = 0; row < this.rows - 1; row += 1) {
      for (let column = 0; column < this.columns - 1; column += 1) {
        const topLeft = row * this.columns + column;
        const bottomLeft = topLeft + this.columns;
        visit(topLeft, bottomLeft, topLeft + 1);
        visit(bottomLeft, bottomLeft + 1, topLeft + 1);
      }
    }
  }

  private updateBounds(): void {
    this.boundsMinimum.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    this.boundsMaximum.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    for (const position of this.positions) {
      this.boundsMinimum.min(position);
      this.boundsMaximum.max(position);
    }
  }

  private intersectsColliderBounds(collider: WorldRockCollider): boolean {
    return collider.bounds.max.x + this.clearance >= this.boundsMinimum.x
      && collider.bounds.min.x - this.clearance <= this.boundsMaximum.x
      && collider.bounds.max.y + this.clearance >= this.boundsMinimum.y
      && collider.bounds.min.y - this.clearance <= this.boundsMaximum.y
      && collider.bounds.max.z + this.clearance >= this.boundsMinimum.z
      && collider.bounds.min.z - this.clearance <= this.boundsMaximum.z;
  }
}
