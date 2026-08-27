import { describe, expect, test } from 'bun:test';
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
});
