import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAVE, PLAYER } from '../src/config';
import type { WorldSphereCollider } from '../src/physics/colliders';
import { periodicFbm } from '../src/utils/random';
import {
  CAVE_SHELL_CONTACT_SKIN,
  caveCeiling,
  caveCenterX,
  caveGroundHeightAt,
  caveHalfWidth,
  caveInteriorBoundsAtHeight,
  floorHeightAt,
} from '../src/world/caveProfile';
import { WorldCollisionResolver } from '../src/world/WorldCollisionResolver';

describe('WorldCollisionResolver', () => {
  test('rechecks distant candidates after an earlier obstacle pushes the capsule toward them', () => {
    const x = caveCenterX(0);
    const y = new WorldCollisionResolver([]).getPlayerRootHeight(x, 0) + PLAYER.height * 0.5;
    const collider = (z: number): WorldSphereCollider => ({ center: new THREE.Vector3(x, y, z), radius: 0.7, walkable: false, kind: 'formation' });
    const position = new THREE.Vector3(x, 0, 0);
    new WorldCollisionResolver([collider(-0.2), collider(1.6)]).resolvePlayer(position);
    expect(position.z).toBeCloseTo(1.6 - 0.7 - PLAYER.radius, 6);
  });

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

  test('refreshes ground support when an obstacle pushes the player onto a rock', () => {
    const centerX = caveCenterX(0);
    const rock: WorldSphereCollider = {
      center: new THREE.Vector3(centerX - 0.6, 0.3, 0),
      radius: 0.5, walkable: true, kind: 'rock',
    };
    const formation: WorldSphereCollider = {
      center: new THREE.Vector3(centerX + 0.16, 0.9, 0),
      radius: 0.42, walkable: false, kind: 'formation',
    };
    const resolver = new WorldCollisionResolver([formation, rock]);
    const position = new THREE.Vector3(centerX, 0, 0);
    resolver.resolvePlayer(position);
    expect(position.x).toBeLessThan(centerX - 0.4);
    expect(position.y).toBeGreaterThan(0.8);
    expect(position.y).toBeCloseTo(resolver.getPlayerRootHeight(position.x, position.z), 6);
  });

  test('does not retain ground support between independent collision queries', () => {
    const centerX = caveCenterX(0);
    const rock: WorldSphereCollider = {
      center: new THREE.Vector3(centerX, 0.3, 0),
      radius: 0.5, walkable: true, kind: 'rock',
    };
    const resolver = new WorldCollisionResolver([rock]);
    const position = new THREE.Vector3(centerX, 0, 0);
    resolver.resolvePlayer(position);
    const firstHeight = position.y;
    rock.center.y += 1;
    resolver.resolvePlayer(position);
    expect(position.y).toBeCloseTo(firstHeight + 1, 6);
  });

  test('lands an airborne capsule on terrain without passing through it', () => {
    const resolver = new WorldCollisionResolver([]);
    const z = -8;
    const x = caveCenterX(z);
    const supportHeight = resolver.getPlayerRootHeight(x, z);
    const position = new THREE.Vector3(x, supportHeight - 0.12, z);

    const result = resolver.resolvePlayer(position, {
      previousY: supportHeight + 0.08,
      velocityY: -4.2,
      grounded: false,
    });

    expect(result.grounded).toBe(true);
    expect(position.y).toBeCloseTo(supportHeight, 6);
  });

  test('stops an airborne capsule at the procedural cave ceiling', () => {
    const resolver = new WorldCollisionResolver([]);
    const z = -18;
    const x = caveCenterX(z);
    const maximumRootHeight = caveCeiling(z) - PLAYER.height - 0.08;
    const position = new THREE.Vector3(x, maximumRootHeight + 0.4, z);

    const result = resolver.resolvePlayer(position, {
      previousY: maximumRootHeight - 0.02,
      velocityY: 5,
      grounded: false,
    });

    expect(result.hitCeiling).toBe(true);
    expect(result.grounded).toBe(false);
    expect(position.y).toBeCloseTo(maximumRootHeight, 6);
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
    const expectedGround = Math.max(
      floorHeightAt(x, z),
      renderedY + CAVE_SHELL_CONTACT_SKIN,
    );

    expect(caveGroundHeightAt(x, z)).toBeCloseTo(expectedGround, 5);
  });

  test('traces the same displaced side-shell edge that is rendered', () => {
    const segment = 37;
    const firstRadial = 10;
    const progress = segment / CAVE.segments;
    const z = THREE.MathUtils.lerp(CAVE.startZ, CAVE.endZ, progress);
    const sample = (radial: number): THREE.Vector2 => {
      const around = radial / CAVE.radialSegments;
      const angle = around * Math.PI * 2;
      const ceiling = caveCeiling(z);
      const centerY = ceiling * 0.5 - 0.25;
      const verticalRadius = ceiling * 0.5 + 0.45;
      const detail = periodicFbm(progress * 11.5, around * 8, 8, 0x782f) - 0.5;
      const ridges = Math.sin(z * 0.42 + angle * 5) * 0.12;
      const displacement = detail * 0.72 + ridges;
      return new THREE.Vector2(
        caveCenterX(z) + Math.cos(angle) * (caveHalfWidth(z) + displacement),
        centerY + Math.sin(angle) * (verticalRadius + displacement * 0.66),
      );
    };
    const first = sample(firstRadial);
    const second = sample(firstRadial + 1);
    const y = (first.y + second.y) * 0.5;
    const edgeBlend = (y - first.y) / (second.y - first.y);
    const renderedX = THREE.MathUtils.lerp(first.x, second.x, edgeBlend);
    const bounds = caveInteriorBoundsAtHeight(y, z, 0, { minimum: 0, maximum: 0 });

    expect(bounds.minimum).toBeCloseTo(renderedX, 5);
  });
});
