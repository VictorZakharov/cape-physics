import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import {
  createSpeleothemGeometry,
  SPELEOTHEM_RINGS,
  SPELEOTHEM_SIDES,
} from '../src/world/SpeleothemGeometry';

describe('procedural speleothem geometry', () => {
  test('is deterministic, curved, and materially more detailed than a cone', () => {
    const first = createSpeleothemGeometry(0x51a1);
    const repeat = createSpeleothemGeometry(0x51a1);
    const positions = first.getAttribute('position') as THREE.BufferAttribute;
    const repeatedPositions = repeat.getAttribute('position') as THREE.BufferAttribute;

    expect(Array.from(positions.array)).toEqual(Array.from(repeatedPositions.array));
    expect(positions.count).toBeGreaterThan(90);
    expect((first.index?.count ?? 0) / 3).toBeGreaterThan(150);

    const stride = SPELEOTHEM_SIDES + 1;
    let maximumCenterlineOffset = 0;
    for (let ring = 1; ring < SPELEOTHEM_RINGS; ring += 1) {
      let centerX = 0;
      let centerZ = 0;
      for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
        centerX += positions.getX(ring * stride + side);
        centerZ += positions.getZ(ring * stride + side);
      }
      maximumCenterlineOffset = Math.max(
        maximumCenterlineOffset,
        Math.hypot(centerX / SPELEOTHEM_SIDES, centerZ / SPELEOTHEM_SIDES),
      );
    }
    expect(maximumCenterlineOffset).toBeGreaterThan(0.025);
  });
});
