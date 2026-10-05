import { describe, expect, spyOn, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { getCapeAnchorTransform } from '../src/physics/CapeAnchorTransform';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { CapeWorkerPresentation } from '../src/physics/CapeWorkerPresentation';
import type { AnchoredCapeState } from '../src/physics/WebGlCapeWorkerPool';
import type { CapeAnchors } from '../src/player/Character';

const anchors: CapeAnchors = {
  left: new THREE.Vector3(-0.48, 2.1, 0.27),
  right: new THREE.Vector3(0.48, 2.1, 0.27),
  back: new THREE.Vector3(0, 0, 1),
};

function worldPoint(cape: CapeSimulation, index: number): THREE.Vector3 {
  return new THREE.Vector3().fromBufferAttribute(
    cape.mesh.geometry.getAttribute('position'), index,
  ).applyMatrix4(cape.mesh.matrix);
}

function snapshot(cape: CapeSimulation, time: number): AnchoredCapeState {
  return { ...cape.copyPackedState(), anchors, previousAnchors: anchors, time, deltaTime: PHYSICS_STEP };
}

describe('WebGL cape frame presentation', () => {
  test('advances free cloth on every render frame between worker results, with bounded prediction', () => {
    const cape = new CapeSimulation(anchors);
    const presentation = new CapeWorkerPresentation(cape, anchors, 1);
    const normals = spyOn(cape.mesh.geometry, 'computeVertexNormals');
    try {
      const state = snapshot(cape, 1);
      state.previous[CAPE.columns * 4 + 2]! -= 0.005;
      cape.overwriteStateForHarness(state.positions, state.previous);
      presentation.accept(state);
      presentation.update(1, anchors, true);
      const start = worldPoint(cape, CAPE.columns);
      presentation.update(1 + 1 / 144, anchors);
      const first = worldPoint(cape, CAPE.columns);
      presentation.update(1 + 2 / 144, anchors);
      const second = worldPoint(cape, CAPE.columns);
      expect(first.z).toBeGreaterThan(start.z + 0.003);
      expect(second.z).toBeGreaterThan(first.z + 0.003);
      presentation.update(1.05, anchors);
      const fading = worldPoint(cape, CAPE.columns);
      presentation.update(1.06, anchors);
      expect(worldPoint(cape, CAPE.columns).z).toBeGreaterThan(fading.z);
      presentation.update(10, anchors);
      const bounded = worldPoint(cape, CAPE.columns);
      presentation.update(11, anchors);
      expect(worldPoint(cape, CAPE.columns).distanceTo(bounded)).toBeLessThan(1e-6);
      expect(bounded.distanceTo(start)).toBeLessThanOrEqual(0.030001);
      expect(normals).toHaveBeenCalledTimes(1);
      expect(cape.copyPackedState()).toEqual({ positions: state.positions, previous: state.previous });
    } finally { normals.mockRestore(); cape.dispose(); }
  });

  test('removes owner translation, rotation and tilt from prediction while pinning the current neckline', () => {
    const cape = new CapeSimulation(anchors);
    const presentation = new CapeWorkerPresentation(cape, anchors, 0);
    try {
      const transform = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.17, 0.7, -0.08));
      transform.setPosition(4, 0.3, -2);
      const moved: CapeAnchors = {
        left: anchors.left.clone().applyMatrix4(transform),
        right: anchors.right.clone().applyMatrix4(transform),
        back: anchors.back.clone().transformDirection(transform),
      };
      const state = snapshot(cape, 1);
      const point = new THREE.Vector3();
      for (let offset = 0; offset < state.positions.length; offset += 4) {
        point.fromArray(state.positions, offset).applyMatrix4(transform).toArray(state.positions, offset);
      }
      cape.overwriteStateForHarness(state.positions, state.previous);
      presentation.accept({ ...state, anchors: moved });
      presentation.update(1, moved, true);
      const before = worldPoint(cape, CAPE.columns);
      presentation.update(1.04, moved);
      expect(worldPoint(cape, CAPE.columns).distanceTo(before)).toBeLessThan(1e-5);
      const owner = { ...anchors, left: anchors.left.clone().add(new THREE.Vector3(8, 0, -5)),
        right: anchors.right.clone().add(new THREE.Vector3(8, 0, -5)) };
      const toOwner = getCapeAnchorTransform(moved, owner, new THREE.Matrix4());
      presentation.update(1.045, owner);
      for (let index = 0; index < CAPE.columns; index += 1) {
        point.fromArray(state.positions, index * 4).applyMatrix4(toOwner);
        expect(worldPoint(cape, index).distanceTo(point)).toBeLessThan(1e-5);
      }
    } finally { cape.dispose(); }
  });

  test('eases new worker corrections without popping and snaps exactly at harness barriers or reset', () => {
    const cape = new CapeSimulation(anchors);
    const presentation = new CapeWorkerPresentation(cape, anchors, 1);
    try {
      const before = worldPoint(cape, CAPE.columns);
      const state = snapshot(cape, 1);
      state.positions[CAPE.columns * 4]! += 0.2;
      state.previous.set(state.positions);
      cape.overwriteStateForHarness(state.positions, state.previous);
      presentation.accept(state);
      presentation.update(1, anchors);
      expect(worldPoint(cape, CAPE.columns).distanceTo(before)).toBeLessThan(1e-6);
      presentation.update(1 + 1 / 144, anchors);
      const first = worldPoint(cape, CAPE.columns).x;
      presentation.update(1 + 2 / 144, anchors);
      expect(worldPoint(cape, CAPE.columns).x).toBeGreaterThan(first);
      presentation.update(1.03, anchors, true);
      expect(worldPoint(cape, CAPE.columns).x).toBeCloseTo(state.positions[CAPE.columns * 4]!, 5);
      presentation.update(1.035, anchors);
      expect(worldPoint(cape, CAPE.columns).x).toBeCloseTo(state.positions[CAPE.columns * 4]!, 5);
      cape.reset(anchors);
      presentation.reset(anchors, 2);
      presentation.update(2.04, anchors);
      expect(worldPoint(cape, CAPE.columns).distanceTo(before)).toBeLessThan(1e-5);
    } finally { cape.dispose(); }
  });
});
