import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP, PLAYER } from '../src/config';
import { createRockTextures } from '../src/graphics/proceduralTextures';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import {
  isWorldRockCollider,
  type WorldRockCollider,
} from '../src/physics/colliders';
import { Character } from '../src/player/Character';
import { CaveWorld } from '../src/world/CaveWorld';
import type { CapeContactRockPlacement } from '../src/world/CapeContactCourse';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

interface RockStabilityMetrics {
  readonly index: number;
  readonly size: CapeContactRockPlacement['size'];
  readonly contacts: number;
  readonly maximumMotion: number;
  readonly maximumSettledMotion: number;
  readonly maximumStructuralError: number;
  readonly maximumFacePenetration: number;
  readonly maximumAnchorDistance: number;
  readonly maximumUpwardFold: number;
}

describe('exact rock contact stability', () => {
  const textures = createRockTextures();
  const cave = new CaveWorld(textures);
  Object.values(textures).forEach((texture) => texture.dispose());
  const rocks = cave.worldColliders.filter(isWorldRockCollider);
  const courseRocks = rocks.slice(0, cave.contactRocks.length);

  test('exposes every authored course rock to the stress matrix', () => {
    expect(courseRocks).toHaveLength(cave.contactRocks.length);
  });

  const extendedStressTest = process.env.CAPE_RUN_EXTENDED_ROCK_STRESS === 'true'
    ? test
    : test.skip;
  courseRocks.forEach((rock, index) => {
    const placement = cave.contactRocks[index]!;
    extendedStressTest(`keeps sustained contact with ${placement.size} rock ${index + 1} bounded and calm`, () => {
      const metrics = simulateRockContact(rock, placement, index);

      expect(metrics.contacts).toBeGreaterThan(0);
      expect(metrics.maximumMotion).toBeLessThan(0.12);
      expect(metrics.maximumSettledMotion).toBeLessThan(0.04);
      expect(metrics.maximumStructuralError).toBeLessThan(0.055);
      expect(metrics.maximumFacePenetration).toBeLessThan(0.002);
      expect(metrics.maximumAnchorDistance).toBeLessThan(CAPE.length * 1.32);
      expect(metrics.maximumUpwardFold).toBeLessThan(0.035);
    }, 30_000);
  });
});

function simulateRockContact(
  rock: WorldRockCollider,
  placement: CapeContactRockPlacement,
  index: number,
): RockStabilityMetrics {
  const collision = new WorldCollisionResolver([rock]);
  const character = new Character();
  const passOnRight = placement.lateralOffset < 0;
  const pathX = passOnRight
    ? rock.bounds.max.x + 0.2
    : rock.bounds.min.x - 0.2;
  // Begin just beyond the stone. The character then walks away while the
  // cape trails in +Z and is pulled across the near shoulder of the rock.
  const startZ = placement.position[2] - 0.28;
  const stopZ = startZ - 1.35;
  character.root.position.set(pathX, 0, startZ);
  collision.resolvePlayer(character.root.position);
  character.root.updateMatrixWorld(true);
  let anchors = character.getCapeAnchors();
  const cape = new CapeSimulation(anchors);
  const velocity = new THREE.Vector3();
  const previousRoot = new THREE.Vector3();
  let time = 0;

  for (let tick = 0; tick < 180; tick += 1) {
    time += PHYSICS_STEP;
    cape.step(
      PHYSICS_STEP,
      anchors,
      character.getCapeColliders(),
      [rock],
      velocity.set(0, 0, 0),
      time,
    );
  }

  let maximumMotion = 0;
  let maximumSettledMotion = 0;
  let maximumStructuralError = 0;
  let maximumFacePenetration = 0;
  let maximumAnchorDistance = 0;
  let maximumUpwardFold = 0;
  let walkingTicks = 0;
  while (character.root.position.z > stopZ && walkingTicks < 180) {
    previousRoot.copy(character.root.position);
    character.root.position.z = Math.max(
      stopZ,
      character.root.position.z - PLAYER.walkSpeed * PHYSICS_STEP,
    );
    collision.resolvePlayer(character.root.position);
    velocity.copy(character.root.position).sub(previousRoot).multiplyScalar(1 / PHYSICS_STEP);
    character.updateAnimation(PHYSICS_STEP, velocity.length(), true, time);
    character.root.updateMatrixWorld(true);
    anchors = character.getCapeAnchors();
    time += PHYSICS_STEP;
    cape.step(
      PHYSICS_STEP,
      anchors,
      character.getCapeColliders(),
      [rock],
      velocity,
      time,
    );
    maximumMotion = Math.max(maximumMotion, cape.getMaximumParticleMotion());
    maximumStructuralError = Math.max(
      maximumStructuralError,
      cape.getMaximumStructuralError(),
    );
    maximumFacePenetration = Math.max(
      maximumFacePenetration,
      cape.getMaximumEnvironmentFacePenetration([rock]),
    );
    maximumAnchorDistance = Math.max(
      maximumAnchorDistance,
      getMaximumAnchorDistance(cape, anchors),
    );
    maximumUpwardFold = Math.max(maximumUpwardFold, cape.getMaximumUpwardFold());
    walkingTicks += 1;
  }

  for (let tick = 0; tick < 600; tick += 1) {
    character.updateAnimation(PHYSICS_STEP, 0, false, time);
    character.root.updateMatrixWorld(true);
    anchors = character.getCapeAnchors();
    time += PHYSICS_STEP;
    cape.step(
      PHYSICS_STEP,
      anchors,
      character.getCapeColliders(),
      [rock],
      velocity.set(0, 0, 0),
      time,
    );
    const motion = cape.getMaximumParticleMotion();
    maximumMotion = Math.max(maximumMotion, motion);
    if (tick >= 120) maximumSettledMotion = Math.max(maximumSettledMotion, motion);
    maximumStructuralError = Math.max(
      maximumStructuralError,
      cape.getMaximumStructuralError(),
    );
    maximumFacePenetration = Math.max(
      maximumFacePenetration,
      cape.getMaximumEnvironmentFacePenetration([rock]),
    );
    maximumAnchorDistance = Math.max(
      maximumAnchorDistance,
      getMaximumAnchorDistance(cape, anchors),
    );
    maximumUpwardFold = Math.max(maximumUpwardFold, cape.getMaximumUpwardFold());
  }

  cape.mesh.geometry.dispose();
  cape.mesh.material.dispose();
  return {
    index,
    size: placement.size,
    contacts: cape.getWorldContactDiagnostics().total,
    maximumMotion,
    maximumSettledMotion,
    maximumStructuralError,
    maximumFacePenetration,
    maximumAnchorDistance,
    maximumUpwardFold,
  };
}

function getMaximumAnchorDistance(
  cape: CapeSimulation,
  anchors: { readonly left: THREE.Vector3; readonly right: THREE.Vector3 },
): number {
  const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
  let maximum = 0;
  for (let row = 1; row < CAPE.rows; row += 1) {
    for (let column = 0; column < CAPE.columns; column += 1) {
      maximum = Math.max(
        maximum,
        cape.getParticlePosition(column, row).distanceTo(center),
      );
    }
  }
  return maximum;
}
