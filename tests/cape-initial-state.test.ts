import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import {
  createCapeInitialParticlePositions,
  createPackedCapeInitialState,
  packCapeParticlePositions,
  setCapeAnchorTarget,
} from '../src/physics/CapeInitialState';
import { DEFAULT_CAPE_PHYSICS_SETTINGS } from '../src/physics/CapeSettings';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('shared cape initial state', () => {
  test('builds one finite row-major particle for every cape grid point', () => {
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );

    expect(positions).toHaveLength(CAPE.columns * CAPE.rows);
    expect(positions.every((position) => position.toArray().every(Number.isFinite))).toBeTrue();
    expect(positions[0]!.distanceTo(anchors.left)).toBeLessThan(0.000_001);
    expect(positions[CAPE.columns - 1]!.distanceTo(anchors.right)).toBeLessThan(0.000_001);
  });

  test('uses the same curved neckline target for initialization and pinning', () => {
    const centerColumn = Math.floor(CAPE.columns / 2);
    const progress = centerColumn / (CAPE.columns - 1);
    const target = setCapeAnchorTarget(anchors, progress, new THREE.Vector3());
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );

    expect(positions[centerColumn]!.distanceTo(target)).toBeLessThan(0.000_001);
    expect(target.y).toBeGreaterThan(anchors.left.y);
    expect(target.z).toBeGreaterThan(anchors.left.z);
  });

  test('packs identical vec4 state for the WebGPU storage lane', () => {
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );
    const packed = packCapeParticlePositions(positions);

    expect(packed).toEqual(createPackedCapeInitialState(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    ));
    expect(packed).toHaveLength(CAPE.columns * CAPE.rows * 4);
    for (let index = 3; index < packed.length; index += 4) expect(packed[index]).toBe(0);
  });
});
