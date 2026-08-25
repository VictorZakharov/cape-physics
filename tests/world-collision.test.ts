import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAVE } from '../src/config';
import type { WorldSphereCollider } from '../src/physics/colliders';
import { periodicFbm } from '../src/utils/random';
import { caveCeiling, caveCenterX, caveGroundHeightAt, caveHalfWidth, floorHeightAt } from '../src/world/caveProfile';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

describe('WorldCollisionResolver', () => {
  test('walks onto rock support instead of clipping through it', () => {
    const rock: WorldSphereCollider = {
      center: new THREE.Vector3(0, 0.22, 0),
      radius: 0.5,
      walkable: true,
      kind: 'rock',
    };
    const resolver = new WorldCollisionResolver([rock]);
    const position = new THREE.Vector3(0, 0, 0);

    resolver.resolvePlayer(position);

    expect(position.y).toBeCloseTo(0.86, 5);
  });

  test('pushes the player capsule out of solid formations', () => {
    const formation: WorldSphereCollider = {
      center: new THREE.Vector3(0.16, 0.9, 0),
      radius: 0.42,
      walkable: false,
      kind: 'formation',
    };
    const resolver = new WorldCollisionResolver([formation]);
    const position = new THREE.Vector3(0, 0, 0);

    resolver.resolvePlayer(position);

    expect(Math.hypot(position.x - formation.center.x, position.z - formation.center.z)).toBeGreaterThan(0.74);
  });

  test('treats the lower cave shell as a walkable bank', () => {
    const z = -8;
    const center = caveCenterX(z);
    const centerHeight = caveGroundHeightAt(center, z);
    const bankX = center + caveHalfWidth(z) * 0.82;

    expect(caveGroundHeightAt(bankX, z)).toBeGreaterThan(centerHeight + 0.5);
  });

  test('samples the same displaced lower-shell vertices that are rendered', () => {
    const segment = 43;
    const radial = 33;
    const progress = segment / CAVE.segments;
    const z = THREE.MathUtils.lerp(CAVE.startZ, CAVE.endZ, progress);
    const around = radial / CAVE.radialSegments;
    const angle = around * Math.PI * 2;
    const ceiling = caveCeiling(z);
    const centerY = ceiling * 0.5 - 0.25;
    const verticalRadius = ceiling * 0.5 + 0.45;
    const detail = periodicFbm(progress * 11.5, around * 8, 8, 0x782f) - 0.5;
    const ridges = Math.sin(z * 0.42 + angle * 5) * 0.12;
    const displacement = detail * 0.72 + ridges;
    const x = caveCenterX(z) + Math.cos(angle) * (caveHalfWidth(z) + displacement);
    const renderedY = centerY + Math.sin(angle) * (verticalRadius + displacement * 0.66);
    const expectedGround = Math.max(floorHeightAt(x, z), renderedY + 0.008);

    expect(caveGroundHeightAt(x, z)).toBeCloseTo(expectedGround, 5);
  });
});
