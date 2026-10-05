import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, CAVE } from '../src/config';
import { getCapeAnchorTransform } from '../src/physics/CapeAnchorTransform';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { cloneCapeAnchors } from '../src/physics/GpuCapeStepPreparation';
import { MAXIMUM_GPU_CAPES } from '../src/physics/GpuCapeSimulation';
import { BOT_COUNT_RANGE } from '../src/player/BotMovementInput';
import { getBotSpawnPosition } from '../src/player/BotSpawnLayout';
import type { CapeAnchors } from '../src/player/Character';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

const source: CapeAnchors = {
  left: new THREE.Vector3(-0.105, 1.525, 9),
  right: new THREE.Vector3(0.105, 1.525, 9),
  back: new THREE.Vector3(0, 0, 1),
};

describe('large bot crowd cape attachment', () => {
  test('reserves GPU storage for the player and all 50 bots', () => {
    expect(MAXIMUM_GPU_CAPES).toBe(51);
    expect(MAXIMUM_GPU_CAPES).toBe(BOT_COUNT_RANGE.max + 1);
  });

  test('spawns all 50 bots inside the cave at either end and mid-corridor', () => {
    const world = new WorldCollisionResolver([]);
    for (const playerZ of [CAVE.startZ - 2.1, 11.8, -15, CAVE.endZ + 2.2]) {
      const positions = Array.from({ length: 50 }, (_, index) => getBotSpawnPosition(index, playerZ));
      expect(new Set(positions.map((position) => position.toArray().join(','))).size).toBe(50);
      for (const position of positions) {
        expect(position.z).toBeGreaterThanOrEqual(CAVE.endZ + 6);
        expect(position.z).toBeLessThanOrEqual(CAVE.startZ - 6);
        const z = position.z;
        world.resolvePlayer(position);
        expect(position.z).toBe(z);
        const resolved = position.clone();
        world.resolvePlayer(position);
        expect(position.distanceTo(resolved)).toBeLessThan(1e-6);
      }
    }
  });

  test('keeps an old cape neckline attached while its owner translates and turns', () => {
    const matrix = new THREE.Matrix4();
    for (const angle of [0, Math.PI / 2, Math.PI, -2.3]) {
      const rotation = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.05, angle, 0.04));
      const translation = new THREE.Vector3(4, 0.35, -12);
      const target = cloneCapeAnchors(source);
      target.left.applyMatrix4(rotation).add(translation);
      target.right.applyMatrix4(rotation).add(translation);
      // The animated shoulders tilt while the character's back remains upright.
      target.back.transformDirection(new THREE.Matrix4().makeRotationY(angle));
      getCapeAnchorTransform(source, target, matrix);
      expect(source.left.clone().applyMatrix4(matrix).distanceTo(target.left)).toBeLessThan(1e-6);
      expect(source.right.clone().applyMatrix4(matrix).distanceTo(target.right)).toBeLessThan(1e-6);
    }
  });

  test('rebases skipped worker poses without injecting velocity or losing the drape', () => {
    const cape = new CapeSimulation(source, {}, undefined, { renderResources: false });
    try {
      cape.step(1 / 120, source, [], [], new THREE.Vector3(), 1 / 120);
      const before = cape.copyPackedState();
      const target = cloneCapeAnchors(source);
      const move = new THREE.Vector3(8, 0.5, -20);
      target.left.add(move); target.right.add(move);
      cape.rebaseAnchors(source, target);
      const after = cape.copyPackedState();
      for (let particle = 0; particle < CAPE.columns * CAPE.rows; particle += 1) {
        const offset = particle * 4;
        for (let axis = 0; axis < 3; axis += 1) {
          expect(after.positions[offset + axis]! - before.positions[offset + axis]!)
            .toBeCloseTo(move.getComponent(axis), 4);
          expect(after.previous[offset + axis]! - before.previous[offset + axis]!)
            .toBeCloseTo(move.getComponent(axis), 4);
        }
      }
      cape.step(1 / 120, target, [], [], new THREE.Vector3(), 10);
      expect(cape.getMaximumStructuralError()).toBeLessThan(0.04);
      expect(cape.getHemDrop()).toBeGreaterThan(1);
    } finally {
      cape.dispose();
    }
  });
});
