import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import type {
  CapsuleCollider,
  WorldCollider,
  WorldRockCollider,
  WorldRockFace,
} from '../src/physics/colliders';
import {
  GPU_BODY_BUFFER_STRIDE,
  GPU_ROCK_BUFFER_STRIDE,
  GPU_ROCK_FACES_PER_COLLIDER,
  MAX_GPU_BODY_COLLIDERS,
  MAX_GPU_WORLD_ROCKS,
  MAX_GPU_WORLD_SPHERES,
  packGpuCapeBodyColliders,
  packGpuCapeWorldColliders,
  selectGpuCapeWorldColliderCandidates,
} from '../src/physics/GpuCapeColliderPacking';

function createBodyCollider(index = 0): CapsuleCollider {
  return {
    start: new THREE.Vector3(1 + index, 2, 3),
    end: new THREE.Vector3(2 + index, 4, 6),
    radius: 0.2,
    depthRadius: 0.1,
    clearance: 0.03,
    name: `body-${index}`,
  };
}

function createRockFace(index: number): WorldRockFace {
  return {
    triangle: new THREE.Triangle(
      new THREE.Vector3(index + 0.1, index + 0.2, index + 0.3),
      new THREE.Vector3(index + 1.1, index + 1.2, index + 1.3),
      new THREE.Vector3(index + 2.1, index + 2.2, index + 2.3),
    ),
    normal: new THREE.Vector3(index + 3.1, index + 3.2, index + 3.3),
    planeConstant: index + 4.1,
    bounds: new THREE.Box3(),
  };
}

function createRock(faceCount = GPU_ROCK_FACES_PER_COLLIDER): WorldRockCollider {
  return {
    shape: 'convex-rock',
    kind: 'rock',
    center: new THREE.Vector3(4, 5, 6),
    radius: 1.5,
    walkable: true,
    bounds: new THREE.Box3(
      new THREE.Vector3(3, 4, 5),
      new THREE.Vector3(5, 8, 7),
    ),
    faces: Array.from({ length: faceCount }, (_, index) => createRockFace(index)),
  };
}

describe('WebGPU cape collider packing', () => {
  test('packs body capsules at the exact lane and vec4 offsets', () => {
    const target = new Float32Array(
      2 * MAX_GPU_BODY_COLLIDERS * GPU_BODY_BUFFER_STRIDE * 4,
    );
    packGpuCapeBodyColliders(target, 1, [createBodyCollider()], new THREE.Vector3(0, 0, 1));

    const offset = MAX_GPU_BODY_COLLIDERS * GPU_BODY_BUFFER_STRIDE * 4;
    expect([...target.slice(offset, offset + 11)]).toEqual([
      1, 2, 3, 0.23,
      1, 2, 3, 0.13,
      1, 2, 0,
    ].map(Math.fround));
    expect(target[offset + 11]).toBeCloseTo(627.0623, 3);
    expect([...target.slice(offset + 12, offset + 14)]).toEqual(
      [1.77, 4.23].map(Math.fround),
    );
    expect(target[offset + 14]).toBe(20);
    expect(target[offset + 15]).toBeCloseTo(0.2483, 4);
    expect(target[offset + 16]).toBeCloseTo(0.1403, 4);
    expect([...target.slice(offset + 17, offset + 20)]).toEqual([0, 0, 0]);
    expect(target.slice(0, offset).every((value) => value === 0)).toBe(true);
  });

  test('preserves a boot capsule axis aligned with character depth', () => {
    const target = new Float32Array(MAX_GPU_BODY_COLLIDERS * GPU_BODY_BUFFER_STRIDE * 4);
    const boot: CapsuleCollider = {
      start: new THREE.Vector3(0, 0, -0.115),
      end: new THREE.Vector3(0, 0, -0.005),
      radius: 0.095,
      name: 'right boot',
    };
    packGpuCapeBodyColliders(target, 0, [boot], new THREE.Vector3(0, 0, 1));

    expect([...target.slice(8, 11)]).toEqual([0, 0, 0]);
    expect(target[11]).toBeCloseTo((0.11 / 0.121) ** 2, 6);
  });


  test('retains unbounded vertical capsule limits for tilted back vectors', () => {
    const target = new Float32Array(MAX_GPU_BODY_COLLIDERS * GPU_BODY_BUFFER_STRIDE * 4);
    packGpuCapeBodyColliders(target, 0, [createBodyCollider()], new THREE.Vector3(0, 0.2, 1));
    expect(target[12]).toBe(-1_000_000);
    expect(target[13]).toBe(1_000_000);
  });

  test('rejects body collider batches that cannot fit the fixed GPU lane', () => {
    const colliders = Array.from(
      { length: MAX_GPU_BODY_COLLIDERS + 1 },
      (_, index) => createBodyCollider(index),
    );
    expect(() => packGpuCapeBodyColliders(
      new Float32Array(1),
      0,
      colliders,
      new THREE.Vector3(0, 0, 1),
    )).toThrow(`GPU cape supports at most ${MAX_GPU_BODY_COLLIDERS} body colliders.`);
  });

  test('keeps only nearby spheres and rocks in source order', () => {
    const nearSphere: WorldCollider = {
      kind: 'formation',
      center: new THREE.Vector3(0.5, 0, 0),
      radius: 0.2,
      walkable: false,
    };
    const farSphere: WorldCollider = {
      kind: 'mineral',
      center: new THREE.Vector3(100, 0, 0),
      radius: 0.2,
      walkable: false,
    };
    const rock = createRock();
    rock.center.set(0, 0, 0);
    const farRock = createRock();
    farRock.center.set(100, 0, 0);
    const selected = selectGpuCapeWorldColliderCandidates(
      new THREE.Vector3(),
      [nearSphere, farSphere, rock, farRock],
    );
    expect(selected.spheres).toEqual([nearSphere]);
    expect(selected.rocks).toEqual([rock]);
  });

  test('packs sphere, rock header, and ordered face records into one cape lane', () => {
    const sphereTarget = new Float32Array(2 * MAX_GPU_WORLD_SPHERES * 4);
    const rockTarget = new Float32Array(
      2 * MAX_GPU_WORLD_ROCKS * GPU_ROCK_BUFFER_STRIDE * 4,
    );
    const sphere = {
      kind: 'torch' as const,
      center: new THREE.Vector3(1, 2, 3),
      radius: 0.25,
      walkable: false,
    };
    const rock = createRock();
    packGpuCapeWorldColliders(sphereTarget, rockTarget, 1, {
      spheres: [sphere],
      rocks: [rock],
    });

    const sphereOffset = MAX_GPU_WORLD_SPHERES * 4;
    expect([...sphereTarget.slice(sphereOffset, sphereOffset + 4)]).toEqual(
      [1, 2, 3, 0.254].map(Math.fround),
    );
    const rockOffset = MAX_GPU_WORLD_ROCKS * GPU_ROCK_BUFFER_STRIDE * 4;
    expect([...rockTarget.slice(rockOffset, rockOffset + 12)]).toEqual([
      4, 5, 6, 0.015,
      3, 4, 5, 6.88,
      5, 8, 7, 1,
    ].map(Math.fround));
    const firstFace = rockOffset + 16;
    expect([...rockTarget.slice(firstFace, firstFace + 16)]).toEqual([
      0.1, 0.2, 0.3, 0,
      1.1, 1.2, 1.3, 0,
      2.1, 2.2, 2.3, 0,
      3.1, 3.2, 3.3, 4.1,
    ].map(Math.fround));
    const lastFace = rockOffset + (4 + 59 * 4) * 4;
    expect([...rockTarget.slice(lastFace, lastFace + 16)]).toEqual([
      59.1, 59.2, 59.3, 0,
      60.1, 60.2, 60.3, 0,
      61.1, 61.2, 61.3, 0,
      62.1, 62.2, 62.3, 63.1,
    ].map(Math.fround));
  });

  test('rejects rock layouts with a different production face count', () => {
    expect(() => packGpuCapeWorldColliders(
      new Float32Array(MAX_GPU_WORLD_SPHERES * 4),
      new Float32Array(MAX_GPU_WORLD_ROCKS * GPU_ROCK_BUFFER_STRIDE * 4),
      0,
      { spheres: [], rocks: [createRock(1)] },
    )).toThrow('GPU rock 0 has 1 faces; expected 60.');
  });
});
