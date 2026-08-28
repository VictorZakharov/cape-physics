import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import {
  createSpeleothemGeometry,
  SPELEOTHEM_RINGS,
  SPELEOTHEM_SIDES,
} from '../src/world/SpeleothemGeometry';
import { isWorldRockCollider } from '../src/physics/colliders';
import { RockColliderQuery } from '../src/physics/RockCollider';
import { CaveColliderBuilder } from '../src/world/CaveColliderBuilder';
import { createRockGeometry } from '../src/world/RockGeometry';

describe('procedural speleothem geometry', () => {
  test('builds floor rocks with a broad planar load-bearing base', () => {
    const geometry = createRockGeometry();
    const repeatedGeometry = createRockGeometry();
    const positions = geometry.getAttribute('position');
    expect(Array.from(positions.array)).toEqual(
      Array.from(repeatedGeometry.getAttribute('position').array),
    );
    expect(positions.count / 3).toBe(60);
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    expect(bounds).not.toBeNull();
    if (!bounds) return;
    const basePoints = new Set<string>();
    for (let index = 0; index < positions.count; index += 1) {
      if (Math.abs(positions.getY(index) - bounds.min.y) > 0.000_01) continue;
      basePoints.add(`${positions.getX(index).toFixed(5)}:${positions.getZ(index).toFixed(5)}`);
    }

    expect(basePoints.size).toBeGreaterThanOrEqual(5);
    expect(bounds.max.y - bounds.min.y).toBeLessThan(bounds.max.x - bounds.min.x);
    expect(bounds.max.y - bounds.min.y).toBeLessThan(bounds.max.z - bounds.min.z);

    const builder = new CaveColliderBuilder();
    builder.addRock(geometry, new THREE.Matrix4());
    const collider = builder.colliders[0];
    expect(collider && isWorldRockCollider(collider)).toBe(true);
    if (!collider || !isWorldRockCollider(collider)) return;
    const vertex = new THREE.Vector3();
    let maximumPlaneViolation = 0;
    for (const face of collider.faces) {
      for (let index = 0; index < positions.count; index += 1) {
        vertex.fromBufferAttribute(positions, index);
        maximumPlaneViolation = Math.max(
          maximumPlaneViolation,
          face.normal.dot(vertex) - face.planeConstant,
        );
      }
    }
    expect(maximumPlaneViolation).toBeLessThan(0.000_001);
  });

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

  test('forms a closed shell with every ring normal facing the exterior', () => {
    const geometry = createSpeleothemGeometry(0x51a3);
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
    const normals = geometry.getAttribute('normal') as THREE.BufferAttribute;
    const stride = SPELEOTHEM_SIDES + 1;
    const normal = new THREE.Vector3();
    const radial = new THREE.Vector3();

    for (let ring = 0; ring < SPELEOTHEM_RINGS; ring += 1) {
      let centerX = 0;
      let centerZ = 0;
      for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
        centerX += positions.getX(ring * stride + side);
        centerZ += positions.getZ(ring * stride + side);
      }
      centerX /= SPELEOTHEM_SIDES;
      centerZ /= SPELEOTHEM_SIDES;

      for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
        const vertexIndex = ring * stride + side;
        radial.set(
          positions.getX(vertexIndex) - centerX,
          0,
          positions.getZ(vertexIndex) - centerZ,
        );
        normal.fromBufferAttribute(normals, vertexIndex);
        expect(normal.dot(radial)).toBeGreaterThan(0);
      }
    }

    const tipIndex = SPELEOTHEM_RINGS * stride;
    const baseCenterIndex = tipIndex + 1;
    expect(positions.count).toBe(baseCenterIndex + 1);
    expect(geometry.index?.count).toBe(
      (SPELEOTHEM_RINGS - 1) * SPELEOTHEM_SIDES * 6
        + SPELEOTHEM_SIDES * 3
        + SPELEOTHEM_SIDES * 3,
    );

    const indices = geometry.index;
    expect(indices).not.toBeNull();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const faceNormal = new THREE.Vector3();
    const baseIndexOffset = (indices?.count ?? 0) - SPELEOTHEM_SIDES * 3;
    for (let offset = baseIndexOffset; offset < (indices?.count ?? 0); offset += 3) {
      a.fromBufferAttribute(positions, indices?.getX(offset) ?? 0);
      b.fromBufferAttribute(positions, indices?.getX(offset + 1) ?? 0);
      c.fromBufferAttribute(positions, indices?.getX(offset + 2) ?? 0);
      faceNormal.crossVectors(b.clone().sub(a), c.clone().sub(a));
      expect(faceNormal.y).toBeGreaterThan(0);
    }
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

  test('uses one exact transformed surface for an elongated rotated rock', () => {
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

    expect(builder.colliders).toHaveLength(1);
    const collider = builder.colliders[0];
    expect(collider && isWorldRockCollider(collider)).toBe(true);
    if (!collider || !isWorldRockCollider(collider)) return;
    const query = new RockColliderQuery();
    const normal = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(matrix);
      expect(Math.abs(query.getSignedDistance(collider, vertex, normal))).toBeLessThan(0.000_01);
    }
  });

  test('rock contact follows a rendered face without hidden proxy overreach', () => {
    const geometry = new THREE.DodecahedronGeometry(0.42, 1);
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(-0.2, 0.18, 1.2),
      new THREE.Quaternion(),
      new THREE.Vector3(0.55, 0.48, 0.62),
    );
    const builder = new CaveColliderBuilder();
    builder.addRock(geometry, matrix);
    const collider = builder.colliders[0];
    expect(collider && isWorldRockCollider(collider)).toBe(true);
    if (!collider || !isWorldRockCollider(collider)) return;
    const face = collider.faces[0];
    expect(face).toBeDefined();
    if (!face) return;
    const query = new RockColliderQuery();
    const normal = new THREE.Vector3();
    const surfacePoint = face.triangle.getMidpoint(new THREE.Vector3());
    const outside = surfacePoint.clone().addScaledVector(face.normal, 0.01);
    const sweepStart = surfacePoint.clone().addScaledVector(face.normal, 0.2);
    const sweepEnd = surfacePoint.clone().addScaledVector(face.normal, -0.05);
    const farOffset = new THREE.Vector3(0, collider.radius * 4 + 1, 0);

    expect(Math.abs(query.getSignedDistance(collider, surfacePoint, normal))).toBeLessThan(0.000_01);
    expect(query.getSignedDistance(collider, outside, normal)).toBeCloseTo(0.01, 5);
    expect(normal.dot(face.normal)).toBeGreaterThan(0.999);
    expect(query.intersectsExpandedBounds(collider, sweepStart, sweepEnd, 0.003)).toBe(true);
    expect(query.sweep(collider, sweepStart, sweepEnd, 0.003, normal)).not.toBeNull();
    expect(query.intersectsExpandedBounds(
      collider,
      sweepStart.clone().add(farOffset),
      sweepEnd.clone().add(farOffset),
      0.003,
    )).toBe(false);
  });
});
