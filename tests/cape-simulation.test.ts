import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP, PLAYER } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { CLOTH_BODY_CLEARANCE } from '../src/physics/ClothBodyCollision';
import {
  CLOTH_WORLD_CLEARANCE,
  getClothWorldClearance,
} from '../src/physics/ClothWorldCollision';
import type { CapsuleCollider, WorldSphereCollider } from '../src/physics/colliders';
import type { CapeAnchors } from '../src/player/Character';
import { Character } from '../src/player/Character';
import { caveCenterX } from '../src/world/caveProfile';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

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
    const first = cape.getParticlePosition(5, 15);
    const second = cape.getParticlePosition(5, 16);
    const third = cape.getParticlePosition(6, 15);
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

  test('slides laterally around a floor-seated rock instead of oscillating through it', () => {
    const character = new Character();
    const collision = new WorldCollisionResolver([]);
    const z = 11.8;
    const x = caveCenterX(z);
    character.root.position.set(x, collision.getPlayerRootHeight(x, z), z);
    character.root.updateMatrixWorld(true);
    const characterAnchors = character.getCapeAnchors();
    const cape = new CapeSimulation(characterAnchors);

    for (let tick = 0; tick < 360; tick += 1) {
      cape.step(
        PHYSICS_STEP,
        characterAnchors,
        character.getCapeColliders(),
        [],
        new THREE.Vector3(),
        tick * PHYSICS_STEP,
      );
    }

    const hem = cape.getParticlePosition(6, CAPE.rows - 1);
    const floor = collision.getGroundHeight(hem.x, hem.z);
    const rock: WorldSphereCollider = {
      center: new THREE.Vector3(hem.x + 0.19, floor + 0.17, hem.z),
      radius: 0.27,
      walkable: true,
      kind: 'rock',
    };
    const brushingVelocity = new THREE.Vector3(0, 0, -0.2);
    for (let tick = 360; tick < 540; tick += 1) {
      cape.step(
        PHYSICS_STEP,
        characterAnchors,
        character.getCapeColliders(),
        [rock],
        brushingVelocity,
        tick * PHYSICS_STEP,
      );
    }

    expect(cape.getWorldContactDiagnostics().total).toBeGreaterThan(0);
    expect(cape.getMaximumEnvironmentFacePenetration([rock])).toBeLessThan(0.002);
    expect(cape.getMaximumEnvironmentPenetration([rock])).toBeLessThan(0.002);
    expect(cape.getMaximumBodyPenetration(
      character.getCapeColliders(),
      characterAnchors.back,
    )).toBeLessThan(0.002);
  });

  test('keeps a stone-pinned cape outside animated boots throughout walking', () => {
    const character = new Character();
    const collision = new WorldCollisionResolver([]);
    const z = 11.8;
    const x = caveCenterX(z);
    character.root.position.set(x, collision.getPlayerRootHeight(x, z), z);
    character.root.updateMatrixWorld(true);
    let characterAnchors = character.getCapeAnchors();
    const cape = new CapeSimulation(characterAnchors);

    for (let tick = 0; tick < 240; tick += 1) {
      cape.step(
        PHYSICS_STEP,
        characterAnchors,
        character.getCapeColliders(),
        [],
        new THREE.Vector3(),
        tick * PHYSICS_STEP,
      );
    }

    const floor = collision.getGroundHeight(x, z + 0.75);
    const rock: WorldSphereCollider = {
      center: new THREE.Vector3(x + 0.38, floor + 0.2, z + 0.75),
      radius: 0.25,
      walkable: true,
      kind: 'rock',
    };
    const walkingVelocity = new THREE.Vector3(0, 0, -PLAYER.walkSpeed);
    let maximumBootPenetration = 0;
    let maximumBodyPenetration = 0;
    let maximumRockPenetration = 0;
    let minimumBootRockGap = Number.POSITIVE_INFINITY;
    const bootAxis = new THREE.Vector3();
    const bootToRock = new THREE.Vector3();
    const closestBootPoint = new THREE.Vector3();

    for (let tick = 240; tick < 720; tick += 1) {
      character.updateAnimation(PHYSICS_STEP, PLAYER.walkSpeed, true, 0);
      character.root.updateMatrixWorld(true);
      characterAnchors = character.getCapeAnchors();
      const bodyColliders = character.getCapeColliders();
      const bootColliders = bodyColliders.filter((collider) => collider.name.endsWith('boot'));
      for (const boot of bootColliders) {
        bootAxis.copy(boot.end).sub(boot.start);
        const axisLengthSquared = bootAxis.lengthSq();
        const progress = axisLengthSquared > 0.000_001
          ? THREE.MathUtils.clamp(
            bootToRock.copy(rock.center).sub(boot.start).dot(bootAxis) / axisLengthSquared,
            0,
            1,
          )
          : 0;
        closestBootPoint.copy(boot.start).addScaledVector(bootAxis, progress);
        minimumBootRockGap = Math.min(
          minimumBootRockGap,
          closestBootPoint.distanceTo(rock.center)
            - boot.radius
            - CLOTH_BODY_CLEARANCE
            - rock.radius
            - getClothWorldClearance(rock),
        );
      }
      cape.step(
        PHYSICS_STEP,
        characterAnchors,
        bodyColliders,
        [rock],
        walkingVelocity,
        tick * PHYSICS_STEP,
      );
      maximumBootPenetration = Math.max(
        maximumBootPenetration,
        cape.getMaximumBodyPenetration(bootColliders, characterAnchors.back),
      );
      maximumBodyPenetration = Math.max(
        maximumBodyPenetration,
        cape.getMaximumBodyPenetration(bodyColliders, characterAnchors.back),
      );
      maximumRockPenetration = Math.max(
        maximumRockPenetration,
        cape.getMaximumEnvironmentFacePenetration([rock]),
      );
    }

    expect(cape.getWorldContactDiagnostics().total).toBeGreaterThan(0);
    expect(minimumBootRockGap).toBeGreaterThan(0.01);
    expect(cape.getMaximumEnvironmentFacePenetration([rock])).toBeLessThan(0.002);
    expect(maximumBootPenetration).toBeLessThan(0.002);
    expect(maximumBodyPenetration).toBeLessThan(0.002);
    expect(maximumRockPenetration).toBeLessThan(0.002);
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
    expect(cape.getMinimumLowerCapeDrop()).toBeGreaterThan(0.48);
    expect(cape.getMaximumLowerCapeLateralOffset(anchors)).toBeLessThan(0.18);

    cape.step(PHYSICS_STEP, anchors, bodyColliders, [], new THREE.Vector3(0, 0, -3), 901 * PHYSICS_STEP);
    expect(cape.isSleeping()).toBe(false);
  });

  test('curves the pinned neckline behind the shoulders without body penetration', () => {
    const cape = new CapeSimulation(anchors);
    const bodyColliders: CapsuleCollider[] = [
      { start: new THREE.Vector3(-0.4, 1.96, -0.04), end: new THREE.Vector3(0.4, 1.96, -0.04), radius: 0.27, name: 'shoulders' },
      { start: new THREE.Vector3(0, 1.86, -0.08), end: new THREE.Vector3(0, 1.25, -0.08), radius: 0.36, name: 'torso' },
    ];
    cape.step(PHYSICS_STEP, anchors, bodyColliders, [], new THREE.Vector3(), 0);

    const left = cape.getParticlePosition(0, 0);
    const center = cape.getParticlePosition(Math.floor(CAPE.columns / 2), 0);
    expect(center.clone().sub(left).dot(anchors.back)).toBeGreaterThan(0.045);
    expect(cape.getMaximumBodyPenetration(bodyColliders, anchors.back)).toBeLessThan(0.002);
  });

  test('does not sleep while a rotated cape remains suspended', () => {
    const cape = new CapeSimulation(anchors);
    const dynamicAnchors: CapeAnchors = {
      left: anchors.left.clone(),
      right: anchors.right.clone(),
      back: anchors.back.clone(),
    };
    const rotation = new THREE.Quaternion();

    for (let frame = 0; frame < 150; frame += 1) {
      const yaw = frame / 149 * Math.PI * 0.82;
      rotation.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
      dynamicAnchors.left.copy(anchors.left).setY(0).applyQuaternion(rotation).setY(anchors.left.y);
      dynamicAnchors.right.copy(anchors.right).setY(0).applyQuaternion(rotation).setY(anchors.right.y);
      dynamicAnchors.back.copy(anchors.back).applyQuaternion(rotation);
      cape.step(PHYSICS_STEP, dynamicAnchors, [], [], new THREE.Vector3(), frame * PHYSICS_STEP);
    }

    for (let frame = 150; frame < 390; frame += 1) {
      cape.step(PHYSICS_STEP, dynamicAnchors, [], [], new THREE.Vector3(), frame * PHYSICS_STEP);
      if (cape.isSleeping()) {
        expect(cape.getMinimumLowerCapeDrop()).toBeGreaterThan(0.48);
      }
    }
    expect(cape.getMinimumLowerCapeDrop()).toBeGreaterThan(0.48);
  });

  test('follows a jump at the neckline while the free hem rises and falls under inertia', () => {
    const cape = new CapeSimulation(anchors);
    const dynamicAnchors: CapeAnchors = {
      left: anchors.left.clone(),
      right: anchors.right.clone(),
      back: anchors.back.clone(),
    };
    const bodyColliders: CapsuleCollider[] = [
      { start: new THREE.Vector3(-0.3, 1.96, -0.04), end: new THREE.Vector3(0.3, 1.96, -0.04), radius: 0.22, name: 'shoulders' },
      { start: new THREE.Vector3(0, 1.84, -0.08), end: new THREE.Vector3(0, 1.05, -0.08), radius: 0.3, name: 'torso and belt' },
    ];
    const baseColliderPositions = bodyColliders.map((collider) => ({
      start: collider.start.clone(),
      end: collider.end.clone(),
    }));
    const velocity = new THREE.Vector3(0, PLAYER.jumpSpeed, 0);
    const initialHemHeight = cape.getParticlePosition(6, CAPE.rows - 1).y;
    let rootOffset = 0;
    let maximumHemRise = 0;
    let landed = false;

    for (let tick = 0; tick < 300; tick += 1) {
      velocity.y -= PLAYER.gravity * PHYSICS_STEP;
      rootOffset += velocity.y * PHYSICS_STEP;
      if (rootOffset <= 0 && tick > 1) {
        rootOffset = 0;
        velocity.y = 0;
        landed = true;
      }
      dynamicAnchors.left.copy(anchors.left).setY(anchors.left.y + rootOffset);
      dynamicAnchors.right.copy(anchors.right).setY(anchors.right.y + rootOffset);
      bodyColliders.forEach((collider, index) => {
        const baseline = baseColliderPositions[index]!;
        collider.start.copy(baseline.start).setY(baseline.start.y + rootOffset);
        collider.end.copy(baseline.end).setY(baseline.end.y + rootOffset);
      });
      cape.step(
        PHYSICS_STEP,
        dynamicAnchors,
        bodyColliders,
        [],
        velocity,
        tick * PHYSICS_STEP,
      );
      maximumHemRise = Math.max(
        maximumHemRise,
        cape.getParticlePosition(6, CAPE.rows - 1).y - initialHemHeight,
      );
      expect(cape.getParticlePosition(0, 0).distanceTo(dynamicAnchors.left)).toBeLessThan(0.000_001);
      expect(cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(dynamicAnchors.right)).toBeLessThan(0.000_001);
    }

    expect(maximumHemRise).toBeGreaterThan(0.35);
    expect(landed).toBe(true);
    expect(cape.getMaximumBodyPenetration(bodyColliders, dynamicAnchors.back)).toBeLessThan(0.002);
    expect(cape.getHemDrop()).toBeGreaterThan(0.72);
  });

  test('keeps walk airflow draped while allowing a materially stronger running trail', () => {
    const walkCape = new CapeSimulation(anchors);
    const runCape = new CapeSimulation(anchors);
    for (let tick = 0; tick < 360; tick += 1) {
      const time = tick * PHYSICS_STEP;
      walkCape.step(
        PHYSICS_STEP,
        anchors,
        [],
        [],
        new THREE.Vector3(0, 0, -PLAYER.walkSpeed),
        time,
      );
      runCape.step(
        PHYSICS_STEP,
        anchors,
        [],
        [],
        new THREE.Vector3(0, 0, -PLAYER.runSpeed),
        time,
      );
    }

    const walkOffset = walkCape.getHemBackOffset(anchors);
    const runOffset = runCape.getHemBackOffset(anchors);
    expect(walkOffset).toBeLessThan(0.72);
    expect(runOffset).toBeGreaterThan(walkOffset + 0.22);
  });

  test('settles a character-length hem onto the procedural ground instead of floating', () => {
    const character = new Character();
    const collision = new WorldCollisionResolver([]);
    const z = 11.8;
    const x = caveCenterX(z);
    character.root.position.set(x, collision.getPlayerRootHeight(x, z), z);
    character.root.updateMatrixWorld(true);
    const characterAnchors = character.getCapeAnchors();
    const cape = new CapeSimulation(characterAnchors);

    for (let tick = 0; tick < 720; tick += 1) {
      cape.step(
        PHYSICS_STEP,
        characterAnchors,
        character.getCapeColliders(),
        [],
        new THREE.Vector3(),
        tick * PHYSICS_STEP,
      );
    }

    expect(cape.getMinimumHemGroundClearance()).toBeGreaterThanOrEqual(0.032);
    expect(cape.getMinimumHemGroundClearance()).toBeLessThan(0.09);
    expect(cape.getMaximumBodyPenetration(
      character.getCapeColliders(),
      characterAnchors.back,
    )).toBeLessThan(0.002);
  });
});
