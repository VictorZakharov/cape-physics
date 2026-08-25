import { describe, expect, test } from 'bun:test';
import { MAX_PHYSICS_STEPS, PHYSICS_STEP } from '../src/config';
import { FixedStepClock } from '../src/core/FixedStepClock';

describe('FixedStepClock', () => {
  test('runs deterministic 120 Hz simulation steps', () => {
    const clock = new FixedStepClock();
    let simulated = 0;
    clock.advance(0, (step) => { simulated += step; });
    const frame = clock.advance(1_000 / 60, (step) => { simulated += step; });
    expect(frame.physicsSteps).toBe(2);
    expect(simulated).toBeCloseTo(PHYSICS_STEP * 2, 8);
  });

  test('limits catch-up work after a stall', () => {
    const clock = new FixedStepClock();
    clock.advance(0, () => undefined);
    const frame = clock.advance(1_000, () => undefined);
    expect(frame.physicsSteps).toBe(MAX_PHYSICS_STEPS);
  });
});
