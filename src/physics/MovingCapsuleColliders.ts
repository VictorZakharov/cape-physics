import * as THREE from 'three';
import type { CapsuleCollider } from './colliders';

export interface MovingCapsuleCollider extends CapsuleCollider {
  readonly previousStart: THREE.Vector3;
  readonly previousEnd: THREE.Vector3;
}

interface CapsuleSnapshot {
  readonly start: THREE.Vector3;
  readonly end: THREE.Vector3;
}

/**
 * Owns the temporal state of animated cloth colliders. Character collider
 * objects are mutated in place and queried by diagnostics as well as physics,
 * so history cannot safely live in Character.getCapeColliders(). The solver
 * advances it exactly once for each simulated cloth step instead.
 */
export class CapsuleColliderHistory {
  private readonly previousByKey = new Map<string, CapsuleSnapshot>();
  private readonly active: MovingCapsuleCollider[] = [];

  public capture(colliders: readonly CapsuleCollider[]): readonly MovingCapsuleCollider[] {
    const activeKeys = new Set<string>();
    this.active.length = colliders.length;
    for (let index = 0; index < colliders.length; index += 1) {
      const collider = colliders[index];
      if (!collider) continue;
      const key = `${index}:${collider.name}`;
      activeKeys.add(key);
      const previous = this.previousByKey.get(key);
      const moving = this.active[index] ?? {
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        previousStart: new THREE.Vector3(),
        previousEnd: new THREE.Vector3(),
        radius: collider.radius,
        name: collider.name,
      };
      moving.start.copy(collider.start);
      moving.end.copy(collider.end);
      moving.previousStart.copy(previous?.start ?? collider.start);
      moving.previousEnd.copy(previous?.end ?? collider.end);
      Object.assign(moving, {
        radius: collider.radius,
        depthRadius: collider.depthRadius,
        name: collider.name,
        clearance: collider.clearance,
        faceSampleSpacing: collider.faceSampleSpacing,
      });
      this.active[index] = moving;

      const snapshot = previous ?? {
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
      };
      snapshot.start.copy(collider.start);
      snapshot.end.copy(collider.end);
      this.previousByKey.set(key, snapshot);
    }
    for (const key of this.previousByKey.keys()) {
      if (!activeKeys.has(key)) this.previousByKey.delete(key);
    }
    return this.active;
  }

  public reset(): void {
    this.previousByKey.clear();
    this.active.length = 0;
  }
}
