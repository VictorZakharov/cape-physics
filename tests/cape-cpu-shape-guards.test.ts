import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import { CapeCpuShapeGuards } from '../src/physics/CapeCpuShapeGuards';
import { createCapeInitialParticlePositions } from '../src/physics/CapeInitialState';
import { DEFAULT_CAPE_PHYSICS_SETTINGS } from '../src/physics/CapeSettings';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CPU cape shape guards', () => {
  test('opens a collapsed lower row while retaining pinned particles', () => {
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );
    const previous = positions.map((position) => position.clone());
    const inverseMass = new Float32Array(positions.length).fill(1);
    inverseMass.fill(0, 0, CAPE.columns);
    const anchorCenter = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    const guards = new CapeCpuShapeGuards(
      positions,
      previous,
      inverseMass,
      anchorCenter,
    );
    const row = Math.floor(CAPE.rows * 0.7);
    const rowCenter = positions[row * CAPE.columns + Math.floor(CAPE.columns / 2)]!.clone();
    for (let column = 0; column < CAPE.columns; column += 1) {
      positions[row * CAPE.columns + column]!.copy(rowCenter);
      previous[row * CAPE.columns + column]!.copy(rowCenter);
    }
    const pinned = positions.slice(0, CAPE.columns).map((position) => position.clone());

    guards.solveFoldAndRows(anchors, DEFAULT_CAPE_PHYSICS_SETTINGS.width);

    expect(
      positions[row * CAPE.columns]!.distanceTo(
        positions[row * CAPE.columns + CAPE.columns - 1]!,
      ),
    ).toBeGreaterThan(0.2);
    for (let index = 0; index < CAPE.columns; index += 1) {
      expect(positions[index]).toEqual(pinned[index]!);
    }
  });
});
