import { expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { GpuCapeSimulation, MAXIMUM_GPU_CAPES } from '../src/physics/GpuCapeSimulation';

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
