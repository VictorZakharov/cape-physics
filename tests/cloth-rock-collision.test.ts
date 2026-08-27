import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { ClothRockCollision } from '../src/physics/ClothRockCollision';
import { CLOTH_ROCK_CLEARANCE } from '../src/physics/ClothWorldCollision';
import { createWorldRockCollider } from '../src/physics/RockCollider';

const COLUMNS = 2;
const ROWS = 2;
const MAXIMUM_CORRECTION = 0.012;

describe('ClothRockCollision', () => {
  test('expels a rock edge piercing a cloth face without a large correction', () => {
    const positions = createClothSquare(0);
    const previous = createClothSquare(0.06);
    const inverseMass = new Float32Array([1, 1, 1, 1]);
    const correctionUsed = new Float32Array(positions.length);
    const rock = createTestRock();
    const collision = new ClothRockCollision(
      positions,
      previous,
      inverseMass,
      COLUMNS,
      ROWS,
      CLOTH_ROCK_CLEARANCE,
      correctionUsed,
      MAXIMUM_CORRECTION,
    );
    let contacts = 0;
    let maximumStep = 0;

    expect(collision.getMaximumPenetration([rock])).toBeGreaterThan(0.002);
    for (let step = 0; step < 4; step += 1) {
      const before = positions.map((position) => position.clone());
      correctionUsed.fill(0);
      collision.beginStep();
      contacts += collision.solve([rock]);
      for (let index = 0; index < positions.length; index += 1) {
        maximumStep = Math.max(
          maximumStep,
          positions[index]!.distanceTo(before[index]!),
        );
      }
    }

    expect(contacts).toBeGreaterThan(0);
    expect(maximumStep).toBeLessThan(0.08);
    expect(collision.getMaximumPenetration([rock])).toBeLessThan(0.002);
  });

  test('does not turn a clearance-only near miss into an impulse', () => {
    const rockHalfExtent = 0.05;
    const surfaceGap = CLOTH_ROCK_CLEARANCE * 0.5;
    const positions = createClothSquare(rockHalfExtent + surfaceGap);
    const previous = positions.map((position) => position.clone());
    const original = positions.map((position) => position.clone());
    const inverseMass = new Float32Array([1, 1, 1, 1]);
    const correctionUsed = new Float32Array(positions.length);
    const rock = createTestRock();
    const collision = new ClothRockCollision(
      positions,
      previous,
      inverseMass,
      COLUMNS,
      ROWS,
      CLOTH_ROCK_CLEARANCE,
      correctionUsed,
      MAXIMUM_CORRECTION,
    );

    expect(collision.getMaximumPenetration([rock])).toBe(0);
    collision.beginStep();
    expect(collision.solve([rock])).toBe(0);
    for (let index = 0; index < positions.length; index += 1) {
      expect(positions[index]!.distanceTo(original[index]!)).toBe(0);
    }
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

function createTestRock() {
  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const collider = createWorldRockCollider(
    geometry,
    new THREE.Matrix4().makeTranslation(-0.15, 0.15, 0),
    false,
  );
  geometry.dispose();
  return collider;
}
