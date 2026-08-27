import { describe, expect, test } from 'bun:test';
import { AdaptiveQuality, type QualityState } from '../src/core/AdaptiveQuality';
import type { PerformanceSnapshot } from '../src/core/PerformanceMonitor';

const overloaded: PerformanceSnapshot = {
  averageFps: 24,
  onePercentLow: 18,
  averageFrameTime: 41.7,
  medianFrameTime: 40,
  p95FrameTime: 48,
  p99FrameTime: 55.6,
  refreshEstimate: 60,
  longFrameCount: 1,
  longestFrameTime: 180,
  sampleCount: 120,
  windowElapsedMilliseconds: 5_000,
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

  test('responds materially to sustained fill-rate pressure without resize thrashing', () => {
    const changes: QualityState[] = [];
    const quality = new AdaptiveQuality((state) => changes.push(state));
    const appleReport = {
      ...overloaded,
      averageFps: 35.16,
      averageFrameTime: 28.44,
      p95FrameTime: 50.1,
    };

    for (let time = 4; time <= 15; time += 0.5) {
      quality.observe(time, appleReport);
    }

    expect(changes).toHaveLength(1);
    expect(quality.getState().scale).toBe(0.82);
  });
});
