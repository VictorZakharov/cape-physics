import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { ClothBodyCollision } from '../src/physics/ClothBodyCollision';
import type { CapsuleCollider } from '../src/physics/colliders';

describe('ClothBodyCollision', () => {
  test('rejects a belt capsule piercing a cloth face while every cloth vertex is clear', () => {
    const positions = [
      new THREE.Vector3(-0.4, 0.4, 0.2),
      new THREE.Vector3(0.4, 0.4, 0.2),
      new THREE.Vector3(-0.4, -0.4, 0.2),
      new THREE.Vector3(0.4, -0.4, 0.2),
    ];
    const previous = positions.map((position) => position.clone());
    const inverseMass = new Float32Array([1, 1, 1, 1]);
    const collider: CapsuleCollider = {
      start: new THREE.Vector3(0, 0, 0),
      end: new THREE.Vector3(0, 0, 0),
      radius: 0.28,
      name: 'belt ring',
    };
    const collision = new ClothBodyCollision(positions, previous, inverseMass, 2, 2);
    const back = new THREE.Vector3(0, 0, 1);

    for (const position of positions) {
      expect(Math.hypot(position.x, position.y)).toBeGreaterThan(collider.radius);
    }
    expect(collision.getMaximumPenetration([collider], back)).toBeGreaterThan(0.06);

    for (let iteration = 0; iteration < 12; iteration += 1) {
      collision.solve([collider], back);
    }

    expect(collision.getMaximumPenetration([collider], back)).toBeLessThan(0.002);
  });
});
