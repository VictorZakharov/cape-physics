import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import type { BodySphere, CapeAnchors } from '../src/player/Character';

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

  test('wraps behind the body instead of tunneling through during reversal', () => {
    const cape = new CapeSimulation(anchors);
    const velocity = new THREE.Vector3(0, 0, 8);
    const bodySpheres: BodySphere[] = [
      { center: new THREE.Vector3(-0.28, 1.82, -0.08), radius: 0.25 },
      { center: new THREE.Vector3(0.28, 1.82, -0.08), radius: 0.25 },
      { center: new THREE.Vector3(0, 1.58, -0.12), radius: 0.36 },
      { center: new THREE.Vector3(0, 1.25, -0.09), radius: 0.31 },
    ];

    for (let frame = 0; frame < 600; frame += 1) {
      velocity.x = Math.sin(frame * 0.09) * 5;
      cape.step(PHYSICS_STEP, anchors, bodySpheres, velocity, frame * PHYSICS_STEP);
    }

    expect(cape.getMaximumBodyPenetration(bodySpheres, anchors.back)).toBeLessThan(0.002);
    expect(cape.getMaximumStructuralError()).toBeLessThan(0.04);
  });
});
