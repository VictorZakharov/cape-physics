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

  test('bounds a crowd recovery frame while retaining normal 120 Hz stepping afterward', () => {
    const clock = new FixedStepClock();
    clock.advance(0, () => undefined, 2);
    expect(clock.advance(200, () => undefined, 2).physicsSteps).toBe(2);
    // Discard the old backlog; retain at most one step for the next frame.
    expect(clock.advance(200, () => undefined, 2).physicsSteps).toBe(1);
    let simulated = 0;
    for (let frame = 1; frame <= 144; frame++) {
      const result = clock.advance(200 + frame * 1000 / 144, (step) => { simulated += step; }, 2);
      expect(result.physicsSteps).toBeLessThanOrEqual(2);
    }
    // Timestamp rounding can leave the final fixed step in the accumulator.
    expect(Math.abs(simulated - 1)).toBeLessThan(PHYSICS_STEP + 1e-9);
  });
});
