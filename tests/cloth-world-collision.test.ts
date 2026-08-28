import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { ClothWorldCollision } from '../src/physics/ClothWorldCollision';
import type { WorldSphereCollider } from '../src/physics/colliders';

describe('ClothWorldCollision', () => {
  test('rejects a formation proxy swept through the middle of a moving cloth face', () => {
    const positions = createClothSquare(-0.31);
    const previous = createClothSquare(0.31);
    const inverseMass = new Float32Array([1, 1, 1, 1]);
    const collider: WorldSphereCollider = {
      center: new THREE.Vector3(),
      radius: 0.28,
      walkable: false,
      kind: 'formation',
    };
    const collision = new ClothWorldCollision(
      positions,
      previous,
      inverseMass,
      2,
      2,
    );

    expect(collision.getMaximumPenetration([collider])).toBe(0);
    let contacts = collision.solve([collider]);
    for (let iteration = 1; iteration < 4; iteration += 1) {
      contacts += collision.solve([collider]);
    }
    expect(contacts).toBeGreaterThan(0);
    for (const index of [0, 1, 2]) {
      expect(positions[index]!.z).toBeGreaterThan(0);
    }
    expect(collision.getMaximumPenetration([collider])).toBeLessThan(0.002);
  });
});

function createClothSquare(z: number): THREE.Vector3[] {
  return [
    new THREE.Vector3(-0.4, 0.4, z),
    new THREE.Vector3(0.4, 0.4, z),
    new THREE.Vector3(-0.4, -0.4, z),
    new THREE.Vector3(0.4, -0.4, z),
  ];
}
