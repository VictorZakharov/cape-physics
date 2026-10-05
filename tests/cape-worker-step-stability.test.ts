import { expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { cloneCapeAnchors } from '../src/physics/GpuCapeStepPreparation';
import { Character } from '../src/player/Character';
import { caveCenterX } from '../src/world/caveProfile';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

test.each(['full', 'crowd'] as const)('%s contacts keep adaptive walking long-cape steps stable and attached', (collisionCadence) => {
  const character = new Character(), world = new WorldCollisionResolver([]);
  character.root.position.set(caveCenterX(-8), world.getPlayerRootHeight(caveCenterX(-8), -8), -8);
  let precedingAnchors = cloneCapeAnchors(character.getCapeAnchors());
  const cape = new CapeSimulation(precedingAnchors, { length: CAPE.lengthRange.max }, undefined, { renderResources: false, collisionCadence });
  let previousDelta = PHYSICS_STEP, time = 0;
  try {
    for (let step = 0; step < 150; step++) {
      const delta = [PHYSICS_STEP, 1 / 30, 1 / 60][step % 3]!;
      time += delta;
      character.root.position.z -= 2 * delta;
      character.root.position.x = caveCenterX(character.root.position.z);
      character.root.position.y = world.getPlayerRootHeight(character.root.position.x, character.root.position.z);
      character.updateAnimation(delta, 2);
      const anchors = character.getCapeAnchors();
      if (delta > PHYSICS_STEP * 1.5) cape.rebaseAnchors(precedingAnchors, anchors);
      cape.step(delta, anchors, character.getCapeColliders(), [], new THREE.Vector3(0, 0, -2), time, previousDelta);
      const state = cape.copyPackedState();
      expect(state.positions.every(Number.isFinite)).toBe(true);
      expect(cape.getParticlePosition(0, 0).distanceTo(anchors.left)).toBeLessThan(1e-6);
      expect(cape.getMaximumStructuralError()).toBeLessThan(0.1);
      expect(cape.getBodyPenetrationDiagnostics(character.getCapeColliders(), anchors.back).maximum).toBeLessThan(0.015);
      precedingAnchors = cloneCapeAnchors(anchors);
      previousDelta = delta;
    }
  } finally { cape.dispose(); character.dispose(); }
});
