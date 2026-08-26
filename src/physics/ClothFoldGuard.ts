import * as THREE from 'three';

// Leave a small post-contact tolerance below the public 55 mm invariant:
// the final body/world projection can legitimately move a row by millimetres.
export const MAXIMUM_LOCAL_UPWARD_FOLD = 0.052;

/**
 * A heavy shoulder cape may flare horizontally, but a lower row cannot pass
 * upward through the row above it without creating the persistent crossed
 * S-fold seen around small obstacles. This unilateral constraint preserves
 * free lateral drape while rejecting that local inversion.
 */
export class ClothFoldGuard {
  private readonly segment = new THREE.Vector3();
  private readonly targetSegment = new THREE.Vector3();
  private readonly segmentCorrection = new THREE.Vector3();

  public constructor(
    private readonly columns: number,
    private readonly rows: number,
  ) {}

  public solve(
    positions: readonly THREE.Vector3[],
    previous: readonly THREE.Vector3[],
    inverseMass: Float32Array,
  ): void {
    for (let pass = 0; pass < 3; pass += 1) {
      for (let row = 1; row < this.rows; row += 1) {
        for (let column = 0; column < this.columns; column += 1) {
          const upperIndex = (row - 1) * this.columns + column;
          const lowerIndex = row * this.columns + column;
          const upper = positions[upperIndex];
          const lower = positions[lowerIndex];
          const upperPrevious = previous[upperIndex];
          const lowerPrevious = previous[lowerIndex];
          if (!upper || !lower || !upperPrevious || !lowerPrevious) continue;
          this.segment.copy(lower).sub(upper);
          if (this.segment.y <= MAXIMUM_LOCAL_UPWARD_FOLD) continue;
          const segmentLength = this.segment.length();
          if (segmentLength <= MAXIMUM_LOCAL_UPWARD_FOLD) continue;
          const upperWeight = inverseMass[upperIndex] ?? 0;
          const lowerWeight = inverseMass[lowerIndex] ?? 0;
          const totalWeight = upperWeight + lowerWeight;
          if (totalWeight <= 0) continue;

          const targetHorizontalLength = Math.sqrt(
            segmentLength * segmentLength
              - MAXIMUM_LOCAL_UPWARD_FOLD * MAXIMUM_LOCAL_UPWARD_FOLD,
          );
          this.targetSegment.set(this.segment.x, 0, this.segment.z);
          if (this.targetSegment.lengthSq() < 0.000_001) {
            this.targetSegment.set(0, 0, 1);
          } else {
            this.targetSegment.normalize();
          }
          this.targetSegment.multiplyScalar(targetHorizontalLength);
          this.targetSegment.y = MAXIMUM_LOCAL_UPWARD_FOLD;
          this.segmentCorrection.copy(this.targetSegment).sub(this.segment);
          const upperScale = upperWeight / totalWeight;
          const lowerScale = lowerWeight / totalWeight;
          upper.addScaledVector(this.segmentCorrection, -upperScale);
          upperPrevious.addScaledVector(this.segmentCorrection, -upperScale);
          lower.addScaledVector(this.segmentCorrection, lowerScale);
          lowerPrevious.addScaledVector(this.segmentCorrection, lowerScale);
        }
      }
    }
  }

  public getMaximumUpwardFold(positions: readonly THREE.Vector3[]): number {
    let maximum = 0;
    for (let row = 1; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        const upper = positions[(row - 1) * this.columns + column];
        const lower = positions[row * this.columns + column];
        if (upper && lower) maximum = Math.max(maximum, lower.y - upper.y);
      }
    }
    return maximum;
  }
}
