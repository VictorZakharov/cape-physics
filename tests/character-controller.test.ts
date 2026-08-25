import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { PHYSICS_STEP, PLAYER } from '../src/config';
import { CLOTH_BODY_CLEARANCE } from '../src/physics/ClothBodyCollision';
import type { WorldSphereCollider } from '../src/physics/colliders';
import {
  Character,
  LEFT_SHOULDER_NAME,
  NECK_NAME,
  RIGHT_SHOULDER_NAME,
  TORSO_NAME,
} from '../src/player/Character';
import {
  FACE_NAME,
  HELMET_SHELL_NAME,
  HELMET_TRIM_NAME,
} from '../src/player/ProceduralHead';
import {
  CharacterController,
  type CharacterMovementInput,
} from '../src/player/CharacterController';
import { caveCenterX } from '../src/world/caveProfile';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

class TestMovementInput implements CharacterMovementInput {
  public readonly movement = new THREE.Vector2(0, 1);
  private jumpQueued = false;

  public constructor(private readonly running: boolean) {}

  public getMovement(): THREE.Vector2 {
    return this.movement;
  }

  public isRunning(): boolean {
    return this.running;
  }

  public consumeJump(): boolean {
    const queued = this.jumpQueued;
    this.jumpQueued = false;
    return queued;
  }

  public requestJump(): void {
    this.jumpQueued = true;
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

    expect(bounds.max.x - bounds.min.x).toBeLessThan(0.68);
    expect(bounds.max.y).toBeLessThan(1.92);
    expect(bounds.max.y - bounds.min.y).toBeGreaterThan(1.95);
  });

  test('keeps torso and shoulders proportional to the head with a visible neck bridge', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const shell = character.root.getObjectByName(HELMET_SHELL_NAME);
    const torso = character.root.getObjectByName(TORSO_NAME);
    const neck = character.root.getObjectByName(NECK_NAME);
    const leftShoulder = character.root.getObjectByName(LEFT_SHOULDER_NAME);
    const rightShoulder = character.root.getObjectByName(RIGHT_SHOULDER_NAME);
    expect(shell && torso && neck && leftShoulder && rightShoulder).toBeTruthy();

    const headBounds = new THREE.Box3().setFromObject(shell!);
    const torsoBounds = new THREE.Box3().setFromObject(torso!);
    const neckBounds = new THREE.Box3().setFromObject(neck!);
    const shoulderBounds = new THREE.Box3()
      .setFromObject(leftShoulder!)
      .expandByObject(rightShoulder!);
    const headWidth = headBounds.max.x - headBounds.min.x;
    const shoulderWidth = shoulderBounds.max.x - shoulderBounds.min.x;
    const torsoWidth = torsoBounds.max.x - torsoBounds.min.x;
    const neckWidth = neckBounds.max.x - neckBounds.min.x;

    expect(shoulderWidth / headWidth).toBeGreaterThan(1.55);
    expect(shoulderWidth / headWidth).toBeLessThan(1.9);
    expect(torsoWidth / headWidth).toBeLessThan(1.45);
    expect(neckWidth / headWidth).toBeGreaterThan(0.38);
    expect(neckWidth / headWidth).toBeLessThan(0.55);
    expect(neckBounds.max.y - neckBounds.min.y).toBeGreaterThan(0.14);
    expect(neckBounds.intersectsBox(torsoBounds)).toBe(true);
  });

  test('covers the belt through both animated boots with continuous cape contact', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const colliders = character.getCapeColliders();
    const hips = colliders.find((collider) => collider.name === 'hips and belt');
    expect(hips).toBeDefined();

    for (const side of ['left', 'right'] as const) {
      const names = [
        `${side} thigh`,
        `${side} knee`,
        `${side} lower leg`,
        `${side} boot`,
      ];
      const leg = names.map((name) => colliders.find((collider) => collider.name === name));
      expect(leg.every((collider) => collider !== undefined)).toBe(true);
      const chain = [hips!, ...leg.map((collider) => collider!)].map((collider) => ({
        minimum: Math.min(collider.start.y, collider.end.y)
          - collider.radius
          - CLOTH_BODY_CLEARANCE,
        maximum: Math.max(collider.start.y, collider.end.y)
          + collider.radius
          + CLOTH_BODY_CLEARANCE,
      }));
      for (let index = 1; index < chain.length; index += 1) {
        expect(chain[index]!.maximum).toBeGreaterThanOrEqual(chain[index - 1]!.minimum);
      }
      expect(chain.at(-1)!.minimum).toBeLessThan(-0.1);
    }
  });

  test('builds a fitted human-proportioned head with flush helmet trim', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const face = character.root.getObjectByName(FACE_NAME);
    const shell = character.root.getObjectByName(HELMET_SHELL_NAME);
    const helmetTrim = character.root.getObjectByName(HELMET_TRIM_NAME);

    expect(face).toBeInstanceOf(THREE.Mesh);
    expect(shell).toBeInstanceOf(THREE.Mesh);
    expect(helmetTrim).toBeInstanceOf(THREE.Mesh);

    const faceBounds = new THREE.Box3().setFromObject(face!);
    const shellBounds = new THREE.Box3().setFromObject(shell!);
    const trimBounds = new THREE.Box3().setFromObject(helmetTrim!);
    expect(faceBounds.max.y - faceBounds.min.y).toBeGreaterThan(
      (faceBounds.max.x - faceBounds.min.x) * 1.25,
    );
    expect(shellBounds.intersectsBox(trimBounds)).toBe(true);
    expect(trimBounds.max.y).toBeLessThan(shellBounds.max.y);
    expect(shellBounds.max.x - shellBounds.min.x).toBeLessThan(0.36);
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

  test('jumps on Space intent, remains above the cave surface, and lands deterministically', () => {
    const character = new Character();
    const collision = new WorldCollisionResolver([]);
    const input = new TestMovementInput(false);
    input.movement.set(0, 0);
    const startZ = 10;
    const startX = caveCenterX(startZ);
    const supportHeight = collision.getPlayerRootHeight(startX, startZ);
    character.root.position.set(startX, supportHeight, startZ);
    const controller = new CharacterController(character, input, collision);
    input.requestJump();
    let maximumClearance = 0;
    let observedAirborne = false;
    let landedAfterJump = false;
    let landingImpact = 0;
    let maximumAirborneBlend = 0;
    let maximumArmLift = 0;
    let maximumLegLift = 0;
    let maximumFootPitch = 0;

    for (let tick = 0; tick < 360; tick += 1) {
      controller.update(PHYSICS_STEP, 0);
      landingImpact = Math.max(landingImpact, controller.consumeLandingImpact());
      const animation = character.getAnimationDiagnostics();
      maximumAirborneBlend = Math.max(maximumAirborneBlend, animation.airborneBlend);
      maximumArmLift = Math.max(maximumArmLift, ...animation.armAngles);
      maximumLegLift = Math.max(maximumLegLift, ...animation.legAngles);
      maximumFootPitch = Math.max(
        maximumFootPitch,
        ...animation.footAngles.map((angle) => Math.abs(angle)),
      );
      const currentSupport = collision.getPlayerRootHeight(
        character.root.position.x,
        character.root.position.z,
      );
      const clearance = character.root.position.y - currentSupport;
      maximumClearance = Math.max(maximumClearance, clearance);
      expect(clearance).toBeGreaterThanOrEqual(-0.000_001);
      if (!controller.isGrounded()) observedAirborne = true;
      if (tick > 12 && observedAirborne && controller.isGrounded()) landedAfterJump = true;
    }

    expect(observedAirborne).toBe(true);
    expect(maximumClearance).toBeGreaterThan(0.82);
    expect(maximumClearance).toBeLessThan(1);
    expect(landedAfterJump).toBe(true);
    expect(landingImpact).toBeGreaterThan(4);
    expect(controller.consumeLandingImpact()).toBe(0);
    expect(maximumAirborneBlend).toBeGreaterThan(0.9);
    expect(maximumArmLift).toBeGreaterThan(0.65);
    expect(maximumLegLift).toBeGreaterThan(0.4);
    expect(maximumFootPitch).toBeGreaterThan(0.15);
    expect(controller.isGrounded()).toBe(true);
    expect(character.root.position.y).toBeCloseTo(supportHeight, 5);
    expect(character.velocity.y).toBe(0);
  });

  test('cannot tunnel its airborne capsule through a solid formation', () => {
    const startZ = 10;
    const startX = caveCenterX(startZ);
    const baseResolver = new WorldCollisionResolver([]);
    const supportHeight = baseResolver.getPlayerRootHeight(startX, startZ);
    const formation: WorldSphereCollider = {
      center: new THREE.Vector3(startX, supportHeight + 0.92, startZ - 1.15),
      radius: 0.42,
      walkable: false,
      kind: 'formation',
    };
    const collision = new WorldCollisionResolver([formation]);
    const character = new Character();
    character.root.position.set(startX, supportHeight, startZ);
    const input = new TestMovementInput(true);
    const controller = new CharacterController(character, input, collision);
    input.requestJump();
    let minimumSeparation = Number.POSITIVE_INFINITY;

    for (let tick = 0; tick < 300; tick += 1) {
      controller.update(PHYSICS_STEP, 0);
      const capsuleBottom = character.root.position.y + PLAYER.radius;
      const capsuleTop = character.root.position.y + PLAYER.height - PLAYER.radius;
      const closestY = THREE.MathUtils.clamp(formation.center.y, capsuleBottom, capsuleTop);
      const separation = Math.hypot(
        character.root.position.x - formation.center.x,
        closestY - formation.center.y,
        character.root.position.z - formation.center.z,
      );
      minimumSeparation = Math.min(minimumSeparation, separation);
    }

    expect(minimumSeparation).toBeGreaterThanOrEqual(
      formation.radius + PLAYER.radius - 0.000_001,
    );
    expect(Number.isFinite(character.root.position.lengthSq())).toBe(true);
    expect(controller.isGrounded()).toBe(true);
  });

  test('raises a grounded capsule onto a bank before applying height-aware wall bounds', () => {
    const character = new Character();
    const collision = new WorldCollisionResolver([]);
    const input = new TestMovementInput(false);
    input.movement.set(1, 0);
    const controller = new CharacterController(character, input, collision);
    character.root.position.set(0.8, 0, -8);
    collision.resolvePlayer(character.root.position);
    const before = character.root.position.clone();

    for (let tick = 0; tick < 46; tick += 1) {
      controller.update(PHYSICS_STEP, 0);
    }
    input.movement.set(0, 0);
    for (let tick = 0; tick < 29; tick += 1) {
      controller.update(PHYSICS_STEP, 0);
    }

    expect(character.root.position.x).toBeGreaterThan(before.x + 0.65);
    expect(character.root.position.y).toBeGreaterThan(before.y + 0.35);
    expect(character.root.position.y).toBeCloseTo(
      collision.getPlayerRootHeight(character.root.position.x, character.root.position.z),
      5,
    );
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
