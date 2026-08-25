import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import {
  createSpeleothemGeometry,
  SPELEOTHEM_RINGS,
  SPELEOTHEM_SIDES,
} from '../src/world/SpeleothemGeometry';
import { CaveColliderBuilder } from '../src/world/CaveColliderBuilder';

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

  test('geometry-derived proxies enclose every transformed formation vertex', () => {
    const geometry = createSpeleothemGeometry(0x51a2);
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(1.2, 2.4, -3.7),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.11, 1.2, -0.08)),
      new THREE.Vector3(1.55, 2.1, 0.62),
    );
    const builder = new CaveColliderBuilder();
    builder.addSpeleothem(geometry, matrix);
    const positions = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    expect(builder.colliders.length).toBeGreaterThan(SPELEOTHEM_RINGS);
    for (let index = 0; index < positions.count; index += 1) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(matrix);
      const signedDistance = Math.min(
        ...builder.colliders.map((collider) => vertex.distanceTo(collider.center) - collider.radius),
      );
      expect(signedDistance).toBeLessThanOrEqual(0.000_01);
    }
  });

  test('geometry-derived rock proxies enclose elongated rotated rocks', () => {
    const geometry = new THREE.DodecahedronGeometry(0.42, 1);
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(-1.4, 0.35, 2.8),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.7, -0.3, 1.1)),
      new THREE.Vector3(0.28, 0.42, 1.35),
    );
    const builder = new CaveColliderBuilder();
    builder.addRock(geometry, matrix);
    const positions = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    expect(builder.colliders.length).toBeGreaterThan(2);
    for (let index = 0; index < positions.count; index += 1) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(matrix);
      const signedDistance = Math.min(
        ...builder.colliders.map((collider) => vertex.distanceTo(collider.center) - collider.radius),
      );
      expect(signedDistance).toBeLessThanOrEqual(0.000_01);
    }
  });
});
