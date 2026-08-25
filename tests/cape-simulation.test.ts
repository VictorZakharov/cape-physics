import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import type { CapeAnchors } from '../src/player/Character';

const anchors: CapeAnchors = {
  left: new THREE.Vector3(-0.48, 2.1, 0.18),
  right: new THREE.Vector3(0.48, 2.1, 0.18),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CapeSimulation', () => {
  test('keeps the collar pinned and constraints stable', () => {
    const cape = new CapeSimulation(anchors);
    const velocity = new THREE.Vector3(0, 0, -2.5);
    for (let frame = 0; frame < 240; frame += 1) {
      cape.step(PHYSICS_STEP, anchors, [], velocity, frame * PHYSICS_STEP);
    }
    expect(cape.getParticlePosition(0, 0).distanceTo(anchors.left)).toBeLessThan(0.000_001);
    expect(cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(anchors.right)).toBeLessThan(0.000_001);
    expect(cape.getMaximumStructuralError()).toBeLessThan(0.035);
    expect(Number.isFinite(cape.getParticlePosition(6, CAPE.rows - 1).lengthSq())).toBe(true);
  });
});
