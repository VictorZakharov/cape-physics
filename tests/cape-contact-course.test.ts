import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import {
  CAPE_CONTACT_ROCKS,
  getCapeContactRockOpenLaneWidth,
  MINIMUM_CONTACT_COURSE_LANE_WIDTH,
} from '../src/world/CapeContactCourse';
import { CaveColliderBuilder } from '../src/world/CaveColliderBuilder';

describe('cape contact rock course', () => {
  test('mixes large and small rocks through the middle passage', () => {
    expect(CAPE_CONTACT_ROCKS).toHaveLength(6);
    expect(CAPE_CONTACT_ROCKS.filter(({ size }) => size === 'large')).toHaveLength(3);
    expect(CAPE_CONTACT_ROCKS.filter(({ size }) => size === 'small')).toHaveLength(3);
    expect(Math.max(...CAPE_CONTACT_ROCKS.map(({ scale }) => Math.max(...scale)))).toBeGreaterThan(1.4);
    expect(
      Math.max(
        ...CAPE_CONTACT_ROCKS
          .filter(({ size }) => size === 'small')
          .map(({ scale }) => Math.max(...scale)),
      ),
    ).toBeLessThan(0.75);

    for (const rock of CAPE_CONTACT_ROCKS) {
      expect(Math.abs(rock.lateralOffset)).toBeLessThan(1.05);
      expect(rock.z).toBeLessThan(4);
      expect(rock.z).toBeGreaterThan(-7);
    }
  });

  test('leaves a conservative player-width lane beside every rock', () => {
    for (const rock of CAPE_CONTACT_ROCKS) {
      expect(getCapeContactRockOpenLaneWidth(rock)).toBeGreaterThan(
        MINIMUM_CONTACT_COURSE_LANE_WIDTH,
      );
    }
  });

  test('supports solid large boulders while retaining walkable small stones', () => {
    const geometry = new THREE.DodecahedronGeometry(0.42, 1);
    const matrix = new THREE.Matrix4();
    const solidBuilder = new CaveColliderBuilder();

    solidBuilder.addRock(geometry, matrix, false);
    expect(solidBuilder.colliders).toHaveLength(1);
    expect(solidBuilder.colliders.every(({ walkable }) => !walkable)).toBe(true);

    const walkableBuilder = new CaveColliderBuilder();
    walkableBuilder.addRock(geometry, matrix);
    expect(walkableBuilder.colliders).toHaveLength(1);
    expect(walkableBuilder.colliders.every(({ walkable }) => walkable)).toBe(true);
  });
});
