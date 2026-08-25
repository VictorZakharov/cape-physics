import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { PHYSICS_STEP, PLAYER } from '../src/config';
import { Character } from '../src/player/Character';
import {
  CharacterController,
  type CharacterMovementInput,
} from '../src/player/CharacterController';
import { caveCenterX } from '../src/world/caveProfile';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

class TestMovementInput implements CharacterMovementInput {
  public readonly movement = new THREE.Vector2(0, 1);

  public constructor(private readonly running: boolean) {}

  public getMovement(): THREE.Vector2 {
    return this.movement;
  }

  public isRunning(): boolean {
    return this.running;
  }
}

function traverse(running: boolean): {
  readonly distance: number;
  readonly speed: number;
  readonly maximumBob: number;
  readonly runningBlend: number;
} {
  const character = new Character();
  const collision = new WorldCollisionResolver([]);
  const startZ = 10;
  const startX = caveCenterX(startZ);
  character.root.position.set(startX, collision.getPlayerRootHeight(startX, startZ), startZ);
  const controller = new CharacterController(character, new TestMovementInput(running), collision);
  let maximumBob = 0;

  for (let tick = 0; tick < 240; tick += 1) {
    controller.update(PHYSICS_STEP, 0);
    maximumBob = Math.max(maximumBob, character.getAnimationDiagnostics().bob);
  }

  return {
    distance: startZ - character.root.position.z,
    speed: character.velocity.length(),
    maximumBob,
    runningBlend: character.getAnimationDiagnostics().runningBlend,
  };
}

describe('CharacterController', () => {
  test('uses a human-scale armored silhouette without the former helmet spike', () => {
    const character = new Character();
    const bounds = new THREE.Box3().setFromObject(character.root);

    expect(bounds.max.x - bounds.min.x).toBeLessThan(0.8);
    expect(bounds.max.y).toBeLessThan(1.92);
    expect(bounds.max.y - bounds.min.y).toBeGreaterThan(1.95);
  });

  test('Shift running is faster and uses a stronger but restrained gait bob', () => {
    const walk = traverse(false);
    const run = traverse(true);

    expect(walk.speed).toBeCloseTo(PLAYER.walkSpeed, 2);
    expect(run.speed).toBeCloseTo(PLAYER.runSpeed, 2);
    expect(run.distance).toBeGreaterThan(walk.distance * 1.55);
    expect(run.maximumBob).toBeGreaterThan(walk.maximumBob + 0.015);
    expect(run.maximumBob).toBeLessThan(0.05);
    expect(run.runningBlend).toBeGreaterThan(0.9);
  });

  test('caps and eases low-speed turns instead of snapping the character', () => {
    const character = new Character();
    const collision = new WorldCollisionResolver([]);
    const input = new TestMovementInput(false);
    input.movement.set(1, 0);
    const controller = new CharacterController(character, input, collision);
    const yawSteps: number[] = [];

    for (let tick = 0; tick < 24; tick += 1) {
      const before = character.root.rotation.y;
      controller.update(PHYSICS_STEP, 0);
      yawSteps.push(Math.abs(character.root.rotation.y - before));
    }

    expect(yawSteps[0]).toBeLessThan(0.004);
    expect(Math.max(...yawSteps)).toBeLessThanOrEqual(PLAYER.walkTurnRate * PHYSICS_STEP + 0.004);
    expect(yawSteps[1]!).toBeGreaterThan(yawSteps[0]!);
  });

  test('keeps character pieces opaque and depth-writing for layer compositing', () => {
    const character = new Character();
    character.setOpacity(0.12);
    const materials = new Set<THREE.Material>();
    character.root.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
        meshMaterials.forEach((material) => materials.add(material));
      }
    });

    expect(materials.size).toBeGreaterThan(0);
    for (const material of materials) {
      expect(material.alphaHash).toBe(false);
      expect(material.transparent).toBe(false);
      expect(material.depthWrite).toBe(true);
      expect(material.opacity).toBe(1);
    }
  });
});
