import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CRIMSON_CAPE_PALETTE } from '../src/physics/CapeAppearance';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import {
  applySerializedCapsuleEndpoints,
  deserializeCapeAnchors,
  deserializeCapsuleColliders,
  deserializeWorldColliders,
  serializeCapeAnchors,
  serializeCapsuleColliders,
  serializeCapsuleEndpoints,
  serializeWorldColliders,
} from '../src/physics/CapeWorkerProtocol';
import type {
  CapsuleCollider,
  WorldCollider,
  WorldRockCollider,
} from '../src/physics/colliders';
import type { CapeAnchors } from '../src/player/Character';

const anchors: CapeAnchors = {
  left: new THREE.Vector3(-0.48, 2.1, 0.27),
  right: new THREE.Vector3(0.48, 2.1, 0.27),
  back: new THREE.Vector3(0, 0, 1),
};

describe('WebGL cape worker protocol', () => {
  test('round-trips anchors and every capsule collision field', () => {
    const colliders: CapsuleCollider[] = [{
      start: new THREE.Vector3(1, 2, 3),
      end: new THREE.Vector3(4, 5, 6),
      radius: 0.25,
      depthRadius: 0.12,
      name: 'left boot',
      clearance: 0.008,
      faceSampleSpacing: 0.075,
    }];
    const restoredAnchors = deserializeCapeAnchors(serializeCapeAnchors(anchors));
    const restoredColliders = deserializeCapsuleColliders(
      serializeCapsuleColliders(colliders),
    );

    expect(restoredAnchors.left.toArray()).toEqual(anchors.left.toArray());
    expect(restoredAnchors.right.toArray()).toEqual(anchors.right.toArray());
    expect(restoredAnchors.back.toArray()).toEqual(anchors.back.toArray());
    expect(restoredColliders[0]?.start.toArray()).toEqual([1, 2, 3]);
    expect(restoredColliders[0]?.end.toArray()).toEqual([4, 5, 6]);
    expect(restoredColliders[0]).toMatchObject({
      radius: 0.25,
      depthRadius: 0.12,
      name: 'left boot',
      clearance: 0.008,
      faceSampleSpacing: 0.075,
    });

    colliders[0]?.start.set(-4, -5, -6);
    colliders[0]?.end.set(7, 8, 9);
    applySerializedCapsuleEndpoints(
      serializeCapsuleEndpoints(colliders),
      restoredColliders,
    );
    expect(restoredColliders[0]?.start.toArray()).toEqual([-4, -5, -6]);
    expect(restoredColliders[0]?.end.toArray()).toEqual([7, 8, 9]);
  });

  test('round-trips sphere and exact convex-rock world colliders', () => {
    const triangle = new THREE.Triangle(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
    );
    const faceBounds = new THREE.Box3().setFromPoints([
      triangle.a,
      triangle.b,
      triangle.c,
    ]);
    const rock: WorldRockCollider = {
      shape: 'convex-rock',
      kind: 'rock',
      center: new THREE.Vector3(0, 0.5, 0),
      radius: 1.2,
      walkable: true,
      bounds: faceBounds.clone(),
      faces: [{
        triangle,
        normal: new THREE.Vector3(0, 0, 1),
        planeConstant: 0,
        bounds: faceBounds,
      }],
    };
    const colliders: WorldCollider[] = [
      {
        center: new THREE.Vector3(3, 4, 5),
        radius: 0.4,
        walkable: false,
        kind: 'torch',
      },
      rock,
    ];
    const restored = deserializeWorldColliders(serializeWorldColliders(colliders));
    const restoredRock = restored[1] as WorldRockCollider;

    expect(restored[0]?.center.toArray()).toEqual([3, 4, 5]);
    expect(restored[0]).toMatchObject({
      shape: 'sphere',
      radius: 0.4,
      walkable: false,
      kind: 'torch',
    });
    expect(restoredRock.bounds.min.toArray()).toEqual(faceBounds.min.toArray());
    expect(restoredRock.bounds.max.toArray()).toEqual(faceBounds.max.toArray());
    expect(restoredRock.faces[0]?.triangle.a.toArray()).toEqual([-1, 0, 0]);
    expect(restoredRock.faces[0]?.normal.toArray()).toEqual([0, 0, 1]);
    expect(restoredRock.faces[0]?.planeConstant).toBe(0);
  });

  test('transfers authoritative particle history without changing solver evolution', () => {
    const source = new CapeSimulation(anchors);
    const velocity = new THREE.Vector3(0.7, 0, -2.1);
    for (let frame = 0; frame < 24; frame += 1) {
      source.step(PHYSICS_STEP, anchors, [], [], velocity, frame * PHYSICS_STEP);
    }

    const state = source.copyPackedState();
    const workerCopy = new CapeSimulation(
      anchors,
      source.getSettings(),
      CRIMSON_CAPE_PALETTE,
      { renderResources: false },
    );
    expect(workerCopy.mesh.geometry.getAttribute('position')).toBeUndefined();
    workerCopy.overwriteStateForHarness(state.positions, state.previous);

    for (let frame = 24; frame < 48; frame += 1) {
      const time = frame * PHYSICS_STEP;
      source.step(PHYSICS_STEP, anchors, [], [], velocity, time);
      workerCopy.step(PHYSICS_STEP, anchors, [], [], velocity, time);
    }
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        expect(
          workerCopy.getParticlePosition(column, row)
            .distanceTo(source.getParticlePosition(column, row)),
        ).toBeLessThan(0.000_001);
      }
    }
    source.dispose();
    workerCopy.dispose();
  });
});
