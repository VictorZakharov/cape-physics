import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import { CapeCpuConstraints } from '../src/physics/CapeCpuConstraints';
import { createCapeInitialParticlePositions } from '../src/physics/CapeInitialState';
import { DEFAULT_CAPE_PHYSICS_SETTINGS } from '../src/physics/CapeSettings';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CPU cape ordered constraints', () => {
  test('rebuilds rest lengths and reduces structural error without moving pinned particles', () => {
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );
    const inverseMass = new Float32Array(positions.length).fill(1);
    inverseMass.fill(0, 0, CAPE.columns);
    const constraints = new CapeCpuConstraints(positions, inverseMass);
    constraints.rebuild();
    const pinned = positions.slice(0, CAPE.columns).map((position) => position.clone());

    positions[CAPE.columns + 6]!.y -= 0.2;
    const errorBefore = constraints.getMaximumStructuralError();
    constraints.solve(1);

    expect(errorBefore).toBeGreaterThan(0.1);
    expect(constraints.getMaximumStructuralError()).toBeLessThan(errorBefore);
    for (let index = 0; index < CAPE.columns; index += 1) {
      expect(positions[index]).toEqual(pinned[index]!);
    }
  });
});
