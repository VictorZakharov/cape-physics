import { describe, expect, test } from 'bun:test';
import { predictCapeMovingFrameAxis } from '../src/physics/CapeMovingFrame';

describe('cape moving-frame integration', () => {
  test('preserves inertia when character movement starts', () => {
    const result = predictCapeMovingFrameAxis({
      currentPosition: 1,
      previousPosition: 1,
      frameDisplacement: 0.02,
      previousFrameDisplacement: 0,
    });

    expect(result.predictedPosition).toBeCloseTo(1, 12);
    expect(result.storedPreviousPosition).toBeCloseTo(1.02, 12);
  });

  test('transports a constraint-settled particle at constant speed', () => {
    const result = predictCapeMovingFrameAxis({
      currentPosition: 1.02,
      previousPosition: 1.02,
      frameDisplacement: 0.02,
      previousFrameDisplacement: 0.02,
    });

    expect(result.predictedPosition).toBeCloseTo(1.04, 12);
    expect(result.frameAccelerationDisplacement).toBe(0);
  });

  test('does not magnetically snap to the character when movement stops', () => {
    const result = predictCapeMovingFrameAxis({
      currentPosition: 1.02,
      previousPosition: 1.02,
      frameDisplacement: 0,
      previousFrameDisplacement: 0.02,
    });

    expect(result.predictedPosition).toBeCloseTo(1.04, 12);
  });

  test('preserves prior travel direction across an immediate reversal', () => {
    const result = predictCapeMovingFrameAxis({
      currentPosition: 1.02,
      previousPosition: 1.02,
      frameDisplacement: -0.02,
      previousFrameDisplacement: 0.02,
    });

    expect(result.predictedPosition).toBeCloseTo(1.04, 12);
    expect(result.frameAccelerationDisplacement).toBeCloseTo(-0.04, 12);
  });

  test('preserves existing Verlet velocity while advecting the frame', () => {
    const result = predictCapeMovingFrameAxis({
      currentPosition: 1.3,
      previousPosition: 1.25,
      frameDisplacement: 0.02,
      previousFrameDisplacement: 0.02,
    });

    expect(result.predictedPosition).toBeCloseTo(1.37, 12);
  });
});
