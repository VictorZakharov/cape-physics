import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeCpuPrediction } from '../src/physics/CapeCpuPrediction';
import { createCapeInitialParticlePositions } from '../src/physics/CapeInitialState';
import { DEFAULT_CAPE_PHYSICS_SETTINGS } from '../src/physics/CapeSettings';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CPU cape prediction pass', () => {
  test('leaves pinned particles unchanged and records every free vertical prediction', () => {
    const positions = createCapeInitialParticlePositions(
      anchors,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );
    const previous = positions.map((position) => position.clone());
    const predictedVerticalDisplacement = new Float32Array(positions.length);
    const prediction = new CapeCpuPrediction(
      positions,
      previous,
      predictedVerticalDisplacement,
    );
    const pinned = positions.slice(0, CAPE.columns).map((position) => position.clone());

    prediction.predict(
      PHYSICS_STEP,
      new THREE.Vector3(0.75, 0.1, -1.3),
      0.37,
      DEFAULT_CAPE_PHYSICS_SETTINGS,
    );

    for (let index = 0; index < CAPE.columns; index += 1) {
      expect(positions[index]).toEqual(pinned[index]!);
      expect(previous[index]).toEqual(pinned[index]!);
      expect(predictedVerticalDisplacement[index]).toBe(0);
    }
    for (let index = CAPE.columns; index < positions.length; index += 1) {
      expect(predictedVerticalDisplacement[index]).toBeCloseTo(
        positions[index]!.y - previous[index]!.y,
        7,
      );
    }
  });
});
