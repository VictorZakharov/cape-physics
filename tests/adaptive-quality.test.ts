import { describe, expect, test } from 'bun:test';
import { AdaptiveQuality, type QualityState } from '../src/core/AdaptiveQuality';
import type { PerformanceSnapshot } from '../src/core/PerformanceMonitor';

const overloaded: PerformanceSnapshot = {
  averageFps: 24,
  onePercentLow: 18,
  averageFrameTime: 41.7,
  refreshEstimate: 60,
  longFrameCount: 1,
  longestFrameTime: 180,
};

describe('AdaptiveQuality', () => {
  test('rate-limits expensive render-target reallocations during a slowdown', () => {
    const changes: Array<{ time: number; state: QualityState }> = [];
    let observationTime = 0;
    const quality = new AdaptiveQuality((state) => changes.push({ time: observationTime, state }));

    for (observationTime = 4; observationTime <= 18; observationTime += 0.5) {
      quality.observe(observationTime, overloaded);
    }

    expect(changes.length).toBe(2);
    expect((changes[1]?.time ?? 0) - (changes[0]?.time ?? 0)).toBeGreaterThanOrEqual(12);
    expect(quality.getState().scale).toBe(0.66);
  });
});
