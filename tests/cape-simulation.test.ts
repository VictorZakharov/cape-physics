import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import type { CapsuleCollider, WorldSphereCollider } from '../src/physics/colliders';
import type { CapeAnchors } from '../src/player/Character';

const anchors: CapeAnchors = {
  left: new THREE.Vector3(-0.48, 2.1, 0.27),
  right: new THREE.Vector3(0.48, 2.1, 0.27),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CapeSimulation', () => {
  test('keeps the collar pinned and constraints stable', () => {
    const cape = new CapeSimulation(anchors);
    const velocity = new THREE.Vector3(0, 0, -2.5);
    for (let frame = 0; frame < 240; frame += 1) {
      cape.step(PHYSICS_STEP, anchors, [], [], velocity, frame * PHYSICS_STEP);
    }
    expect(cape.getParticlePosition(0, 0).distanceTo(anchors.left)).toBeLessThan(0.000_001);
    expect(cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(anchors.right)).toBeLessThan(0.000_001);
    expect(cape.getMaximumStructuralError()).toBeLessThan(0.035);
    expect(Number.isFinite(cape.getParticlePosition(6, CAPE.rows - 1).lengthSq())).toBe(true);
  });

  test('wraps behind the body instead of tunneling through during reversal', () => {
    const cape = new CapeSimulation(anchors);
    const velocity = new THREE.Vector3(0, 0, 8);
    const bodyColliders: CapsuleCollider[] = [
      { start: new THREE.Vector3(-0.4, 1.96, -0.04), end: new THREE.Vector3(0.4, 1.96, -0.04), radius: 0.27, name: 'shoulders' },
      { start: new THREE.Vector3(0, 1.86, -0.08), end: new THREE.Vector3(0, 1.25, -0.08), radius: 0.36, name: 'torso' },
    ];

    for (let frame = 0; frame < 600; frame += 1) {
      velocity.x = Math.sin(frame * 0.09) * 5;
      cape.step(PHYSICS_STEP, anchors, bodyColliders, [], velocity, frame * PHYSICS_STEP);
    }

    expect(cape.getMaximumBodyPenetration(bodyColliders, anchors.back)).toBeLessThan(0.002);
    expect(cape.getMaximumStructuralError()).toBeLessThan(0.04);
    expect(cape.getMinimumSelfSeparation()).toBeGreaterThan(0.05);
    expect(cape.getHemDrop()).toBeGreaterThan(0.65);
  });

  test('cannot tunnel through a cave object during a fast sweep', () => {
    const cape = new CapeSimulation(anchors);
    const velocity = new THREE.Vector3(0, 0, -12);
    const worldColliders: WorldSphereCollider[] = [{
      center: new THREE.Vector3(0, 1.25, 0.72),
      radius: 0.3,
      walkable: false,
      kind: 'formation',
    }];

    for (let frame = 0; frame < 420; frame += 1) {
      velocity.z = frame < 80 ? -12 : 0;
      cape.step(PHYSICS_STEP, anchors, [], worldColliders, velocity, frame * PHYSICS_STEP);
    }

    expect(cape.getMaximumEnvironmentPenetration(worldColliders)).toBeLessThan(0.002);
    expect(cape.getMinimumSelfSeparation()).toBeGreaterThan(0.05);
    expect(cape.getWorldContactDiagnostics().total).toBeGreaterThan(0);
  });
});
