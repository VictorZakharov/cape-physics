import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import { CapeCpuMotionTracker } from '../src/physics/CapeCpuMotionTracker';

describe('CPU cape motion tracking', () => {
  test('ignores pinned particles and reports maximum free-particle displacement', () => {
    const positions = Array.from(
      { length: CAPE.columns * CAPE.rows },
      () => new THREE.Vector3(),
    );
    const tracker = new CapeCpuMotionTracker(positions);
    tracker.captureStepStart();
    positions[0]!.set(9, 9, 9);
    positions[CAPE.columns + 2]!.set(0.3, -0.4, 0.5);

    tracker.measureStepMotion();

    expect(tracker.getMaximumParticleMotion()).toBeCloseTo(Math.hypot(0.3, -0.4, 0.5));
    expect(tracker.getMaximumParticleVerticalMotion()).toBe(0.4);
    expect(tracker.getDiagnostics()).toEqual({
      particleIndex: CAPE.columns + 2,
      displacement: [0.3, -0.4, 0.5],
      verticalParticleIndex: CAPE.columns + 2,
      verticalDelta: -0.4,
    });

    tracker.synchronizeStepStart();
    tracker.clearMaximumMotion();
    expect(tracker.getMaximumParticleMotion()).toBe(0);
    expect(tracker.getMaximumParticleVerticalMotion()).toBe(0);
  });
});
