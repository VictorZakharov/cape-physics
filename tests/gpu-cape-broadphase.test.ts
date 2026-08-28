import { describe, expect, test } from 'bun:test';
import { CAPE } from '../src/config';
import {
  calculateGpuCapeSphereQueryRadius,
  GPU_WORLD_ADJACENT_CONTACT_MARGIN,
  GPU_WORLD_CANDIDATE_REFRESH_DISTANCE,
} from '../src/physics/GpuCapeBroadphase';

describe('GPU cape world broadphase', () => {
  test('covers the maximum cape reach until the candidate list refreshes', () => {
    const queryRadius = calculateGpuCapeSphereQueryRadius(
      CAPE.lengthRange.max,
      CAPE.widthRange.max,
    );
    const maximumCornerReach = Math.hypot(
      CAPE.lengthRange.max,
      CAPE.widthRange.max * 0.5,
    );

    expect(queryRadius).toBeCloseTo(4, 10);
    expect(queryRadius).toBeGreaterThanOrEqual(
      maximumCornerReach
        + GPU_WORLD_CANDIDATE_REFRESH_DISTANCE
        + GPU_WORLD_ADJACENT_CONTACT_MARGIN,
    );
    expect(queryRadius).toBeLessThan(CAPE.lengthRange.max + 2.2);
  });
});
