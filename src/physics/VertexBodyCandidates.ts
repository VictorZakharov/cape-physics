import type { Vector3 } from 'three';
import type { PreparedBodyCollider } from './CapeBodyColliderPreparation';

export const BODY_CANDIDATE_SKIN = 0.026;
/** Audit switches only; defaults retain exact vertex culling, with assertions off. */
export const bodyVertexDebug = { enabled: true, assertions: false, skin: BODY_CANDIDATE_SKIN, skippedAssertions: 0 };

/** One-step lists of potentially correcting vertex/capsule pairs, in collider order. */
export class VertexBodyCandidates {
  private readonly reference: Float64Array;
  private readonly masks: Uint32Array;
  private readonly valid: Uint8Array;
  public constructor(particles: number) {
    this.reference = new Float64Array(particles * 3);
    this.masks = new Uint32Array(particles);
    this.valid = new Uint8Array(particles);
  }
  public beginStep(): void { this.valid.fill(0); }
  public mask(index: number, point: Vector3, colliders: readonly PreparedBodyCollider[]): number {
    // Fixed capacity overflow keeps the original full sweep for this step.
    if (colliders.length > 32) return 0xffffffff;
    const offset = index * 3, skin = bodyVertexDebug.skin;
    const dx = point.x - this.reference[offset]!, dy = point.y - this.reference[offset + 1]!, dz = point.z - this.reference[offset + 2]!;
    if (this.valid[index] && dx * dx + dy * dy + dz * dz < skin * skin) return this.masks[index]!;
    let mask = 0;
    for (let candidate = 0; candidate < colliders.length; candidate++) {
      const collider = colliders[candidate]!, radius = Math.max(collider.lateralRadius, collider.depthRadius) + 1e-7 + skin;
      const x = point.x - collider.startX, z = point.z - collider.startZ;
      // These are the unchanged one-sided narrowphase's necessary bounds,
      // expanded by actual displacement skin, not a symmetric capsule test.
      if (point.y >= collider.minimumY - skin && point.y <= collider.maximumY + skin
        && x >= Math.min(0, collider.axisX) - radius && x <= Math.max(0, collider.axisX) + radius
        && z >= Math.min(0, collider.axisZ) - radius && z <= Math.max(0, collider.axisZ) + radius) mask |= 1 << candidate;
    }
    this.reference[offset] = point.x; this.reference[offset + 1] = point.y; this.reference[offset + 2] = point.z;
    this.valid[index] = 1; this.masks[index] = mask;
    return mask;
  }
}
