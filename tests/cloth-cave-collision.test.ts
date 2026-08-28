import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { ClothCaveCollision } from '../src/physics/ClothCaveCollision';
import { CLOTH_WORLD_CLEARANCE } from '../src/physics/ClothWorldCollision';
import { caveInteriorBoundsAtHeight } from '../src/world/caveProfile';

describe('ClothCaveCollision', () => {
  test('expels a curved cave wall passing through an edge with valid endpoints', () => {
    const height = 0.25;
    const firstZ = -48.7;
    const secondZ = -48.4;
    const firstX = maximumX(height, firstZ) - 0.001;
    const secondX = maximumX(height, secondZ) - 0.001;
    const positions = [
      new THREE.Vector3(firstX, height, firstZ),
      new THREE.Vector3(firstX - 0.12, height + 0.1, firstZ),
      new THREE.Vector3(secondX, height, secondZ),
      new THREE.Vector3(secondX - 0.12, height + 0.1, secondZ),
    ];
    const previous = positions.map((position) => position.clone());
    const collision = new ClothCaveCollision(
      positions,
      previous,
      new Float32Array([1, 1, 1, 1]),
      2,
      2,
    );

    expect(collision.getMaximumPenetration()).toBeGreaterThan(0.008);
    let contacts = 0;
    for (let pass = 0; pass < 4; pass += 1) contacts += collision.solve();

    expect(contacts).toBeGreaterThan(0);
    expect(collision.getMaximumPenetration()).toBeLessThan(0.002);
  });
});

function maximumX(y: number, z: number): number {
  const bounds = caveInteriorBoundsAtHeight(
    y,
    z,
    CLOTH_WORLD_CLEARANCE,
    { minimum: 0, maximum: 0 },
  );
  return bounds.maximum;
}
