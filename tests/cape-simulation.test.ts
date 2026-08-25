import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { CLOTH_WORLD_CLEARANCE } from '../src/physics/ClothWorldCollision';
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

  test('rejects a narrow obstacle that pierces a triangle while every vertex stays clear', () => {
    const cape = new CapeSimulation(anchors);
    const first = cape.getParticlePosition(5, 8);
    const second = cape.getParticlePosition(5, 9);
    const third = cape.getParticlePosition(6, 8);
    const triangle = new THREE.Triangle(first, second, third);
    const center = triangle.getMidpoint(new THREE.Vector3());
    const normal = triangle.getNormal(new THREE.Vector3());
    center.addScaledVector(normal, 0.008);
    const nearestVertex = Math.min(
      first.distanceTo(center),
      second.distanceTo(center),
      third.distanceTo(center),
    );
    const contactRadius = nearestVertex * 0.82;
    const worldColliders: WorldSphereCollider[] = [{
      center,
      radius: contactRadius - CLOTH_WORLD_CLEARANCE,
      walkable: false,
      kind: 'formation',
    }];

    expect(worldColliders[0]!.radius).toBeGreaterThan(0);
    expect(first.distanceTo(center)).toBeGreaterThan(contactRadius);
    expect(second.distanceTo(center)).toBeGreaterThan(contactRadius);
    expect(third.distanceTo(center)).toBeGreaterThan(contactRadius);
    expect(cape.getMaximumEnvironmentFacePenetration(worldColliders)).toBeGreaterThan(0.02);

    for (let frame = 0; frame < 30; frame += 1) {
      cape.step(PHYSICS_STEP, anchors, [], worldColliders, new THREE.Vector3(), frame * PHYSICS_STEP);
    }

    expect(cape.getMaximumEnvironmentFacePenetration(worldColliders)).toBeLessThan(0.002);
    expect(cape.getWorldContactDiagnostics().total).toBeGreaterThan(0);
  });

  test('damps residual trembling after an aggressive reversal settles', () => {
    const cape = new CapeSimulation(anchors);
    const bodyColliders: CapsuleCollider[] = [
      { start: new THREE.Vector3(-0.28, 1.96, -0.04), end: new THREE.Vector3(0.28, 1.96, -0.04), radius: 0.2, name: 'shoulders' },
      { start: new THREE.Vector3(0, 1.84, -0.08), end: new THREE.Vector3(0, 1.3, -0.08), radius: 0.28, name: 'torso' },
    ];
    const velocity = new THREE.Vector3();

    for (let frame = 0; frame < 300; frame += 1) {
      velocity.set(Math.sin(frame * 0.12) * 4.5, 0, frame < 100 ? 8 : -5);
      cape.step(PHYSICS_STEP, anchors, bodyColliders, [], velocity, frame * PHYSICS_STEP);
    }
    velocity.set(0, 0, 0);
    for (let frame = 300; frame < 900; frame += 1) {
      cape.step(PHYSICS_STEP, anchors, bodyColliders, [], velocity, frame * PHYSICS_STEP);
    }

    expect(cape.getMaximumParticleMotion()).toBeLessThan(0.001);
    expect(cape.isSleeping()).toBe(true);
    expect(cape.getMaximumBodyPenetration(bodyColliders, anchors.back)).toBeLessThan(0.002);
    expect(cape.getHemDrop()).toBeGreaterThan(0.7);

    cape.step(PHYSICS_STEP, anchors, bodyColliders, [], new THREE.Vector3(0, 0, -3), 901 * PHYSICS_STEP);
    expect(cape.isSleeping()).toBe(false);
  });
});
