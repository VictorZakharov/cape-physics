import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAPE, CAVE, PHYSICS_STEP } from '../src/config';
import {
  CAPE_PHYSICS_SETTING_RANGES,
  DEFAULT_CAPE_PHYSICS_SETTINGS,
  normalizeCapePhysicsSettings,
  type CapePhysicsSettings,
} from '../src/physics/CapeSettings';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { CLOTH_WORLD_CLEARANCE } from '../src/physics/ClothWorldCollision';
import type { WorldSphereCollider } from '../src/physics/colliders';
import { Character } from '../src/player/Character';
import {
  caveCeiling,
  caveGroundHeightAt,
  caveInteriorBoundsAtHeight,
} from '../src/world/caveProfile';

function getHemCenter(cape: CapeSimulation): THREE.Vector3 {
  const center = new THREE.Vector3();
  for (let column = 0; column < CAPE.columns; column += 1) {
    center.add(cape.getParticlePosition(column, CAPE.rows - 1));
  }
  return center.multiplyScalar(1 / CAPE.columns);
}

function getMaximumCavePenetration(cape: CapeSimulation): number {
  let maximum = 0;
  const bounds = { minimum: 0, maximum: 0 };
  for (let row = 1; row < CAPE.rows; row += 1) {
    for (let column = 0; column < CAPE.columns; column += 1) {
      const position = cape.getParticlePosition(column, row);
      const floor = caveGroundHeightAt(position.x, position.z) + CLOTH_WORLD_CLEARANCE;
      const ceiling = caveCeiling(position.z) + 0.12 - CLOTH_WORLD_CLEARANCE;
      caveInteriorBoundsAtHeight(
        position.y,
        position.z,
        CLOTH_WORLD_CLEARANCE,
        bounds,
      );
      maximum = Math.max(
        maximum,
        CAVE.endZ + 0.08 - position.z,
        position.z - (CAVE.startZ - 0.08),
        floor - position.y,
        position.y - ceiling,
        bounds.minimum - position.x,
        position.x - bounds.maximum,
      );
    }
  }
  return maximum;
}

const dimensionCases: readonly {
  readonly name: string;
  readonly settings: CapePhysicsSettings;
}[] = [
  {
    name: 'minimum',
    settings: {
      ...DEFAULT_CAPE_PHYSICS_SETTINGS,
      length: CAPE_PHYSICS_SETTING_RANGES.length.min,
      width: CAPE_PHYSICS_SETTING_RANGES.width.min,
    },
  },
  { name: 'default', settings: DEFAULT_CAPE_PHYSICS_SETTINGS },
  {
    name: 'maximum',
    settings: {
      ...DEFAULT_CAPE_PHYSICS_SETTINGS,
      length: CAPE_PHYSICS_SETTING_RANGES.length.max,
      width: CAPE_PHYSICS_SETTING_RANGES.width.max,
    },
  },
];

describe('cape customization', () => {
  test('clamps every physics setting to a finite supported value', () => {
    expect(normalizeCapePhysicsSettings({
      length: Number.POSITIVE_INFINITY,
      width: -10,
      stiffness: 5,
      damping: Number.NaN,
      weight: -2,
    })).toEqual({
      length: DEFAULT_CAPE_PHYSICS_SETTINGS.length,
      width: CAPE_PHYSICS_SETTING_RANGES.width.min,
      stiffness: CAPE_PHYSICS_SETTING_RANGES.stiffness.max,
      damping: DEFAULT_CAPE_PHYSICS_SETTINGS.damping,
      weight: CAPE_PHYSICS_SETTING_RANGES.weight.min,
    });
  });

  test('keeps minimum, default, and maximum dimensions structurally valid', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const colliders = character.getCapeColliders();
    const initialHemDrops: number[] = [];
    const initialHemWidths: number[] = [];

    for (const dimensionCase of dimensionCases) {
      const cape = new CapeSimulation(anchors, dimensionCase.settings);
      const initialHemLeft = cape.getParticlePosition(0, CAPE.rows - 1);
      const initialHemRight = cape.getParticlePosition(CAPE.columns - 1, CAPE.rows - 1);
      initialHemDrops.push(cape.getHemDrop());
      initialHemWidths.push(initialHemLeft.distanceTo(initialHemRight));

      expect(cape.mesh.geometry.getAttribute('position').count).toBe(CAPE.columns * CAPE.rows);
      expect(cape.getSettings()).toEqual(dimensionCase.settings);
      expect(cape.getParticlePosition(0, 0).distanceTo(anchors.left)).toBeLessThan(0.000_001);
      expect(
        cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(anchors.right),
      ).toBeLessThan(0.000_001);

      for (let row = 0; row < CAPE.rows; row += 1) {
        for (let column = 0; column < CAPE.columns; column += 1) {
          expect(Number.isFinite(cape.getParticlePosition(column, row).lengthSq())).toBe(true);
        }
      }

      for (let step = 0; step < 90; step += 1) {
        cape.step(
          PHYSICS_STEP,
          anchors,
          colliders,
          [],
          new THREE.Vector3(),
          step * PHYSICS_STEP,
        );
      }
      expect(cape.getMaximumStructuralError()).toBeLessThan(0.04);
      expect(cape.getMaximumBodyPenetration(colliders, anchors.back)).toBeLessThan(0.002);
      expect(cape.getParticlePosition(0, 0).distanceTo(anchors.left)).toBeLessThan(0.000_001);
      expect(
        cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(anchors.right),
      ).toBeLessThan(0.000_001);
    }

    expect(initialHemDrops[0]!).toBeLessThan(initialHemDrops[1]!);
    expect(initialHemDrops[1]!).toBeLessThan(initialHemDrops[2]!);
    expect(initialHemWidths[0]!).toBeLessThan(initialHemWidths[1]!);
    expect(initialHemWidths[1]!).toBeLessThan(initialHemWidths[2]!);
  });

  test('rebuilds dimension constraints in place and reset returns to defaults', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const cape = new CapeSimulation(anchors, {
      length: CAPE_PHYSICS_SETTING_RANGES.length.min,
      width: CAPE_PHYSICS_SETTING_RANGES.width.min,
    });
    const minimumDrop = cape.getHemDrop();

    cape.updateSettings(DEFAULT_CAPE_PHYSICS_SETTINGS, anchors);

    expect(cape.getSettings()).toEqual(DEFAULT_CAPE_PHYSICS_SETTINGS);
    expect(cape.getHemDrop()).toBeGreaterThan(minimumDrop);
    expect(cape.getMaximumStructuralError()).toBeLessThan(0.000_001);
    expect(cape.getParticlePosition(0, 0).distanceTo(anchors.left)).toBeLessThan(0.000_001);
    expect(
      cape.getParticlePosition(CAPE.columns - 1, 0).distanceTo(anchors.right),
    ).toBeLessThan(0.000_001);
  });

  test('provides a materially wider structural stiffness response', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const colliders = character.getCapeColliders();
    const maximumErrors: number[] = [];

    for (const stiffness of [
      CAPE_PHYSICS_SETTING_RANGES.stiffness.min,
      CAPE_PHYSICS_SETTING_RANGES.stiffness.max,
    ]) {
      const cape = new CapeSimulation(anchors, {
        ...DEFAULT_CAPE_PHYSICS_SETTINGS,
        stiffness,
      });
      let maximumError = 0;
      for (let step = 0; step < 120; step += 1) {
        const velocity = new THREE.Vector3(
          Math.sin(step * 0.11) * 7,
          0,
          Math.cos(step * 0.07) * 5,
        );
        cape.step(
          PHYSICS_STEP,
          anchors,
          colliders,
          [],
          velocity,
          step * PHYSICS_STEP,
        );
        maximumError = Math.max(maximumError, cape.getMaximumStructuralError());
      }
      maximumErrors.push(maximumError);
    }

    expect(maximumErrors[0]!).toBeGreaterThan(maximumErrors[1]! * 1.8);
  });

  test('keeps a long heavy flexible cape outside formations and the cave shell', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const settings: CapePhysicsSettings = {
      ...DEFAULT_CAPE_PHYSICS_SETTINGS,
      length: CAPE_PHYSICS_SETTING_RANGES.length.max,
      width: CAPE_PHYSICS_SETTING_RANGES.width.max,
      stiffness: CAPE_PHYSICS_SETTING_RANGES.stiffness.min,
      weight: CAPE_PHYSICS_SETTING_RANGES.weight.max,
    };
    const cape = new CapeSimulation(anchors, settings);
    const initialHem = getHemCenter(cape);
    const floor = caveGroundHeightAt(initialHem.x, initialHem.z);
    const formation: WorldSphereCollider = {
      center: new THREE.Vector3(initialHem.x + 0.08, floor + 0.24, initialHem.z + 0.28),
      radius: 0.28,
      walkable: false,
      kind: 'formation',
    };
    const velocity = new THREE.Vector3();
    let maximumFormationPenetration = 0;
    let maximumCavePenetration = 0;
    let maximumBodyPenetration = 0;
    let maximumStructuralError = 0;

    for (let step = 0; step < 480; step += 1) {
      velocity.set(Math.sin(step * 0.057) * 5.5, 0, Math.cos(step * 0.041) * 2.8);
      cape.step(
        PHYSICS_STEP,
        anchors,
        character.getCapeColliders(),
        [formation],
        velocity,
        step * PHYSICS_STEP,
      );
      maximumFormationPenetration = Math.max(
        maximumFormationPenetration,
        cape.getMaximumEnvironmentPenetration([formation]),
        cape.getMaximumEnvironmentFacePenetration([formation]),
      );
      maximumCavePenetration = Math.max(maximumCavePenetration, getMaximumCavePenetration(cape));
      maximumBodyPenetration = Math.max(
        maximumBodyPenetration,
        cape.getMaximumBodyPenetration(character.getCapeColliders(), anchors.back),
      );
      maximumStructuralError = Math.max(maximumStructuralError, cape.getMaximumStructuralError());
    }

    expect(maximumFormationPenetration).toBeLessThan(0.002);
    expect(maximumCavePenetration).toBeLessThan(0.002);
    expect(maximumBodyPenetration).toBeLessThan(0.002);
    expect(cape.getWorldContactDiagnostics().total).toBeGreaterThan(0);
    expect(maximumStructuralError).toBeLessThan(0.18);
  });

  test('keeps a short heavy cape outside the body throughout a landing', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    let anchors = character.getCapeAnchors();
    const cape = new CapeSimulation(anchors, {
      ...DEFAULT_CAPE_PHYSICS_SETTINGS,
      length: CAPE_PHYSICS_SETTING_RANGES.length.min,
      stiffness: CAPE_PHYSICS_SETTING_RANGES.stiffness.min,
      weight: CAPE_PHYSICS_SETTING_RANGES.weight.max,
    });
    const baseY = character.root.position.y;
    const previousRoot = character.root.position.clone();
    const velocity = new THREE.Vector3();
    let maximumBodyPenetration = 0;

    for (let step = 0; step < 240; step += 1) {
      const lift = step < 45
        ? step / 45 * 0.8
        : step < 75
          ? (1 - (step - 45) / 30) * 0.8
          : 0;
      character.root.position.y = baseY + lift;
      velocity.copy(character.root.position).sub(previousRoot).multiplyScalar(1 / PHYSICS_STEP);
      previousRoot.copy(character.root.position);
      character.root.updateMatrixWorld(true);
      anchors = character.getCapeAnchors();
      const colliders = character.getCapeColliders();
      cape.step(PHYSICS_STEP, anchors, colliders, [], velocity, step * PHYSICS_STEP);
      maximumBodyPenetration = Math.max(
        maximumBodyPenetration,
        cape.getMaximumBodyPenetration(colliders, anchors.back),
      );
    }

    expect(maximumBodyPenetration).toBeLessThan(0.002);
    expect(cape.getMaximumStructuralError()).toBeLessThan(0.04);
  });
});
