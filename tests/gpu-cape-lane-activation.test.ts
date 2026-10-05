import { expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { GpuCapeSimulation, MAXIMUM_GPU_CAPES } from '../src/physics/GpuCapeSimulation';
import { GPU_BODY_BUFFER_STRIDE, GPU_ROCK_BUFFER_STRIDE, MAX_GPU_BODY_COLLIDERS, MAX_GPU_WORLD_ROCKS, MAX_GPU_WORLD_SPHERES } from '../src/physics/GpuCapeColliderPacking';
import type { WorldCollider } from '../src/physics/colliders';

test('refreshing one GPU lane uploads only its live collider records and ignores empty/cached world lanes', () => {
  const anchors = { left: new THREE.Vector3(-0.48, 2.1, 0.27), right: new THREE.Vector3(0.48, 2.1, 0.27), back: new THREE.Vector3(0, 0, 1) };
  const cape = new GpuCapeSimulation({} as THREE.WebGPURenderer, anchors);
  const storage = cape as unknown as { bodyBuffer: { value: THREE.BufferAttribute }; worldSphereBuffer: { value: THREE.BufferAttribute }; rockBuffer: { value: THREE.BufferAttribute } };
  const body = { start: new THREE.Vector3(0, 1, 0), end: new THREE.Vector3(0, 2, 0), radius: 0.2, name: 'torso' };
  const worlds: WorldCollider[] = [
    { center: new THREE.Vector3(0, 1, 0), radius: 0.5, walkable: false, kind: 'formation' },
    { shape: 'convex-rock', kind: 'rock', center: new THREE.Vector3(0, 1, 0), radius: 1, walkable: false,
      bounds: new THREE.Box3(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 2, 1)),
      faces: Array.from({ length: 60 }, () => ({ triangle: new THREE.Triangle(), normal: new THREE.Vector3(0, 1, 0), planeConstant: 0, bounds: new THREE.Box3() })) },
  ];
  try {
    const input = { anchors, bodyColliders: [body], characterVelocity: new THREE.Vector3() };
    cape.prepareBatchStep(PHYSICS_STEP, [input, input], worlds, PHYSICS_STEP);
    const bodyAttribute = storage.bodyBuffer.value, spheres = storage.worldSphereBuffer.value, rocks = storage.rockBuffer.value;
    expect(bodyAttribute.updateRanges).toEqual([{ start: 0, count: GPU_BODY_BUFFER_STRIDE * 4 }, { start: MAX_GPU_BODY_COLLIDERS * GPU_BODY_BUFFER_STRIDE * 4, count: GPU_BODY_BUFFER_STRIDE * 4 }]);
    expect(spheres.updateRanges).toEqual([{ start: 0, count: 4 }, { start: MAX_GPU_WORLD_SPHERES * 4, count: 4 }]);
    expect(rocks.updateRanges).toEqual([{ start: 0, count: GPU_ROCK_BUFFER_STRIDE * 4 }, { start: MAX_GPU_WORLD_ROCKS * GPU_ROCK_BUFFER_STRIDE * 4, count: GPU_ROCK_BUFFER_STRIDE * 4 }]);
    [bodyAttribute, spheres, rocks].forEach((attribute) => attribute.clearUpdateRanges());
    const moved = { ...input, anchors: { ...anchors, left: anchors.left.clone().add(new THREE.Vector3(1, 0, 0)), right: anchors.right.clone().add(new THREE.Vector3(1, 0, 0)) } };
    cape.prepareBatchStep(PHYSICS_STEP, [input, moved], worlds, 2 * PHYSICS_STEP);
    expect(spheres.updateRanges).toEqual([{ start: MAX_GPU_WORLD_SPHERES * 4, count: 4 }]);
    expect(rocks.updateRanges).toEqual([{ start: MAX_GPU_WORLD_ROCKS * GPU_ROCK_BUFFER_STRIDE * 4, count: GPU_ROCK_BUFFER_STRIDE * 4 }]);
    [bodyAttribute, spheres, rocks].forEach((attribute) => attribute.clearUpdateRanges());
    cape.prepareBatchStep(PHYSICS_STEP, [{ ...input, bodyColliders: [] }], [], 3 * PHYSICS_STEP);
    expect(bodyAttribute.updateRanges).toEqual([]);
    expect(spheres.updateRanges).toEqual([]);
    expect(rocks.updateRanges).toEqual([]);
  } finally { cape.dispose(); }
});

test('activating a GPU cape uploads only its new lane, preserving GPU-owned active history', () => {
  const anchors = { left: new THREE.Vector3(-0.48, 2.1, 0.27), right: new THREE.Vector3(0.48, 2.1, 0.27), back: new THREE.Vector3(0, 0, 1) };
  const cape = new GpuCapeSimulation({} as THREE.WebGPURenderer, anchors);
  const storage = cape as unknown as {
    positionBuffer: { value: THREE.BufferAttribute };
    previousBuffer: { value: THREE.BufferAttribute };
    scratchBuffer: { value: THREE.BufferAttribute };
  };
  try {
    const input = { anchors, bodyColliders: [], characterVelocity: new THREE.Vector3() };
    const attributes = [storage.positionBuffer.value, storage.previousBuffer.value, storage.scratchBuffer.value];
    attributes.forEach((attribute) => attribute.clearUpdateRanges());
    const laneLength = CAPE.columns * CAPE.rows * 4;
    cape.prepareBatchStep(PHYSICS_STEP, [input, input], [], PHYSICS_STEP);
    attributes.forEach((attribute) => {
      expect(attribute.updateRanges).toEqual([{ start: laneLength, count: laneLength }]);
      attribute.clearUpdateRanges();
    });
    cape.prepareBatchStep(PHYSICS_STEP, [input, input, input], [], 2 * PHYSICS_STEP);
    attributes.forEach((attribute) => {
      expect(attribute.updateRanges).toEqual([{ start: 2 * laneLength, count: laneLength }]);
    });
  } finally { cape.dispose(); }
});

test('render prewarming initializes real bot triangles without activating lanes or rewinding the player', () => {
  const anchors = { left: new THREE.Vector3(-0.48, 2.1, 0.27), right: new THREE.Vector3(0.48, 2.1, 0.27), back: new THREE.Vector3(0, 0, 1) };
  const cape = new GpuCapeSimulation({} as THREE.WebGPURenderer, anchors);
  const storage = cape as unknown as { activeCapeCount: number; positionBuffer: { value: THREE.BufferAttribute } };
  try {
    const length = CAPE.columns * CAPE.rows * 4;
    const before = storage.positionBuffer.value.array.slice(0, length);
    cape.prewarmBotMesh(anchors);
    expect(cape.botMesh.count).toBe(MAXIMUM_GPU_CAPES - 1);
    expect(storage.activeCapeCount).toBe(1);
    expect(storage.positionBuffer.value.array.slice(0, length)).toEqual(before);
    expect(storage.positionBuffer.value.array.slice(length, 2 * length)).toEqual(before);
  } finally { cape.dispose(); }
});
