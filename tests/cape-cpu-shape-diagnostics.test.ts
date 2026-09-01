import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CapeCpuShapeDiagnostics } from '../src/physics/CapeCpuShapeDiagnostics';
import { createCapeInitialParticlePositions } from '../src/physics/CapeInitialState';
import { DEFAULT_CAPE_PHYSICS_SETTINGS } from '../src/physics/CapeSettings';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CPU cape shape diagnostics', () => {
  test('reports the established finite rest-shape metrics without mutating particles', () => {
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );
    const before = positions.map((position) => position.clone());
    const anchorCenter = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    const diagnostics = new CapeCpuShapeDiagnostics(positions, anchorCenter);

    expect(diagnostics.getHemDrop()).toBeGreaterThan(1.5);
    expect(diagnostics.getMinimumLowerCapeDrop()).toBeGreaterThan(0.8);
    expect(diagnostics.getAverageLowerCapeSpanRatio(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS.width,
    )).toBeGreaterThan(0.9);
    expect(diagnostics.getCapeCenterlineDeviation()).toBeGreaterThanOrEqual(0);
    expect(diagnostics.getMaximumLowerCapeRowCurlRatio(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS.width,
    )).toBeGreaterThanOrEqual(0);
    expect(positions).toEqual(before);
  });
});
