import { describe, expect, test, spyOn } from 'bun:test';
import { CapePerformanceProfiler } from '../src/physics/CapePerformanceProfiler';

describe('CapePerformanceProfiler', () => {
  test('samples active steps at a fixed interval and averages supplied phases', () => {
    const profiler = new CapePerformanceProfiler(3);

    expect(profiler.beginStep(true)).toBe(true);
    profiler.record('constraints', 2);
    profiler.record('worldCollision', 1);
    profiler.endStep(4);

    expect(profiler.beginStep(false)).toBe(false);
    expect(profiler.beginStep(true)).toBe(false);
    expect(profiler.beginStep(true)).toBe(false);
    expect(profiler.beginStep(true)).toBe(true);
    profiler.record('constraints', 4);
    profiler.record('worldCollision', 3);
    profiler.endStep(8);

    const diagnostics = profiler.getDiagnostics();
    expect(diagnostics.totalSteps).toBe(5);
    expect(diagnostics.activeSteps).toBe(4);
    expect(diagnostics.sampledActiveSteps).toBe(2);
    expect(diagnostics.averageStepMilliseconds).toBe(6);
    expect(diagnostics.phases.constraints).toBe(3);
    expect(diagnostics.phases.worldCollision).toBe(2);
    expect(diagnostics.phases.selfCollision).toBe(0);
  });
  test('uses only awake window samples, has a minimum of 30, and sums coarse phases', () => {
    let now = 0; const clock = spyOn(performance, 'now').mockImplementation(() => now);
    try {
      const profiler = new CapePerformanceProfiler(1); profiler.restart(0, 1000);
      expect(profiler.beginStep(true)).toBe(false);
      now = 1000;
      for (let index = 0; index < 30; index++) {
        now += 100; expect(profiler.beginStep(true)).toBe(true);
        profiler.record('constraints', 2); profiler.record('bodyCollision', 3); profiler.endStep(6);
      }
      expect(profiler.beginStep(false)).toBe(false);
      const report = profiler.getDiagnostics();
      expect(report.sufficientSamples).toBe(true);
      expect(report.sampledActiveSteps).toBe(30);
      expect(Object.values(report.phases).reduce((sum, phase) => sum + phase, 0)).toBeCloseTo(report.averageStepMilliseconds);
      now = 20000;
      expect(profiler.getDiagnostics().sampledActiveSteps).toBe(0);
      expect(profiler.getDiagnostics().sufficientSamples).toBe(false);
    } finally { clock.mockRestore(); }
  });

});
