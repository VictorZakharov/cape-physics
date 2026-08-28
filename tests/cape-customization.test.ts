import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAPE, PHYSICS_STEP } from '../src/config';
import {
  CAPE_PHYSICS_SETTING_RANGES,
  DEFAULT_CAPE_PHYSICS_SETTINGS,
  normalizeCapePhysicsSettings,
  type CapePhysicsSettings,
} from '../src/physics/CapeSettings';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { Character } from '../src/player/Character';

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
      wind: 99,
    })).toEqual({
      length: DEFAULT_CAPE_PHYSICS_SETTINGS.length,
      width: CAPE_PHYSICS_SETTING_RANGES.width.min,
      stiffness: CAPE_PHYSICS_SETTING_RANGES.stiffness.max,
      damping: DEFAULT_CAPE_PHYSICS_SETTINGS.damping,
      weight: CAPE_PHYSICS_SETTING_RANGES.weight.min,
      wind: CAPE_PHYSICS_SETTING_RANGES.wind.max,
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
});
