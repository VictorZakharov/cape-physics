import type * as THREE from 'three';
import type { WorldCollider } from './colliders';
const CELL_SIZE = 4;
const registered = new WeakMap<readonly WorldCollider[], StaticWorldColliderIndex>();
/** Static worker geometry only. Numeric cell hashes may add candidates, never omit them. */
export class StaticWorldColliderIndex {
  private readonly cells = new Map<number, number[]>();
  private readonly mask: Uint32Array;
  public readonly indices: Int32Array;
  public count = 0;
  public constructor(colliders: readonly WorldCollider[]) {
    this.mask = new Uint32Array(Math.ceil(colliders.length / 32));
    this.indices = new Int32Array(colliders.length);
    colliders.forEach((collider, index) => {
      for (let x = Math.floor((collider.center.x - collider.radius) / CELL_SIZE); x <= Math.floor((collider.center.x + collider.radius) / CELL_SIZE); x++)
        for (let y = Math.floor((collider.center.y - collider.radius) / CELL_SIZE); y <= Math.floor((collider.center.y + collider.radius) / CELL_SIZE); y++)
          for (let z = Math.floor((collider.center.z - collider.radius) / CELL_SIZE); z <= Math.floor((collider.center.z + collider.radius) / CELL_SIZE); z++) {
            const key = this.hash(x, y, z); let entries = this.cells.get(key);
            if (!entries) { entries = []; this.cells.set(key, entries); }
            entries.push(index);
          }
    });
  }
  private hash(x: number, y: number, z: number): number {
    return Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791);
  }
  public query(center: THREE.Vector3, radius: number): this {
    this.mask.fill(0); this.count = 0;
    for (let x = Math.floor((center.x - radius) / CELL_SIZE); x <= Math.floor((center.x + radius) / CELL_SIZE); x++)
      for (let y = Math.floor((center.y - radius) / CELL_SIZE); y <= Math.floor((center.y + radius) / CELL_SIZE); y++)
        for (let z = Math.floor((center.z - radius) / CELL_SIZE); z <= Math.floor((center.z + radius) / CELL_SIZE); z++) {
          const entries = this.cells.get(this.hash(x, y, z));
          if (entries) for (const index of entries) this.mask[index >>> 5] = this.mask[index >>> 5]! | (1 << (index & 31));
        }
    // Emit original collider order. Narrowphase projection order stays identical.
    for (let word = 0; word < this.mask.length; word++) {
      let bits = this.mask[word]!;
      while (bits !== 0) {
        const index = word * 32 + 31 - Math.clz32(bits & -bits);
        this.indices[this.count++] = index; bits &= bits - 1;
      }
    }
    return this;
  }
}
export function registerStaticWorldColliderIndex(colliders: readonly WorldCollider[]): void {
  registered.set(colliders, new StaticWorldColliderIndex(colliders));
}
export function staticWorldCandidates(colliders: readonly WorldCollider[], center: THREE.Vector3, radius: number): StaticWorldColliderIndex | null {
  return registered.get(colliders)?.query(center, radius) ?? null;
}
