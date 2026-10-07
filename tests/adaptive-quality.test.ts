import { describe, expect, test } from 'bun:test';
import { EMPTY_WORKLOAD_SNAPSHOT } from '../src/core/PerformanceMonitor';
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
      quality.observe(observationTime, overloaded, { ...EMPTY_WORKLOAD_SNAPSHOT, averageMainThreadMilliseconds: 2 }, { averageMilliseconds: 41.7, sampleCount: 100, source: 'test' });
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
      quality.observe(time, appleReport, { ...EMPTY_WORKLOAD_SNAPSHOT, averageMainThreadMilliseconds: 2 }, { averageMilliseconds: 28.44, sampleCount: 100, source: 'test' });
    }

    expect(changes).toHaveLength(1);
    expect(quality.getState().scale).toBe(0.82);
  });
  test('holds full resolution for CPU-bound frames with and without a GPU timer', () => {
    for (const gpu of [undefined, { averageMilliseconds: 3, sampleCount: 100, source: 'test' }]) {
      const quality = new AdaptiveQuality(() => { throw new Error('CPU-bound resize'); });
      for (let time = 4; time < 60; time += 3) quality.observe(time, overloaded,
        { ...EMPTY_WORKLOAD_SNAPSHOT, averageMainThreadMilliseconds: 32 }, gpu);
      expect(quality.getState().scale).toBe(1);
      expect(quality.getState().reason).toBe('CPU-bound: held');
    }
  });
  test('holds resolution when GPU simulation compute dominates render cost', () => {
    const quality = new AdaptiveQuality(() => { throw Error('Compute-bound resize'); });
    quality.observe(4, overloaded, { ...EMPTY_WORKLOAD_SNAPSHOT, averageMainThreadMilliseconds: 2 },
      { averageMilliseconds: 40, renderMilliseconds: 2, computeMilliseconds: 38, sampleCount: 100, source: 'test' });
    expect(quality.getState().scale).toBe(1);
    expect(quality.getState().reason).toBe('GPU compute-bound: held');
  });
  test('restores resolution with GPU headroom despite low CPU-bound FPS', () => {
    const quality = new AdaptiveQuality(() => undefined);
    const work = { ...EMPTY_WORKLOAD_SNAPSHOT, averageMainThreadMilliseconds: 2 };
    quality.observe(4, overloaded, work, { averageMilliseconds: 40, sampleCount: 100, source: 'test' });
    const reduced = quality.getState().scale;
    for (let time = 7; time < 80; time += 3) quality.observe(time, overloaded,
      { ...work, averageMainThreadMilliseconds: 32 }, { averageMilliseconds: 3, sampleCount: 100, source: 'test' });
    expect(quality.getState().scale).toBeGreaterThan(reduced);
  });

});
