import { describe, expect, test } from 'bun:test';
import { reconcileCapeProjectionPreviousY } from '../src/physics/CapeProjectionVelocity';

describe('cape projection velocity reconciliation', () => {
  test('does not turn a falling prediction into upward Verlet velocity', () => {
    expect(reconcileCapeProjectionPreviousY({
      predictedVerticalDisplacement: -0.02,
      projectedPositionY: 1.1,
      previousPositionY: 1,
      hasMaterialContact: false,
    })).toBe(1.1);
  });

  test('preserves physical upward prediction and continued falling', () => {
    expect(reconcileCapeProjectionPreviousY({
      predictedVerticalDisplacement: 0.02,
      projectedPositionY: 1.1,
      previousPositionY: 1,
      hasMaterialContact: false,
    })).toBe(1);
    expect(reconcileCapeProjectionPreviousY({
      predictedVerticalDisplacement: -0.02,
      projectedPositionY: 0.9,
      previousPositionY: 1,
      hasMaterialContact: false,
    })).toBe(1);
  });

  test('preserves upward material-contact response', () => {
    expect(reconcileCapeProjectionPreviousY({
      predictedVerticalDisplacement: -0.02,
      projectedPositionY: 1.1,
      previousPositionY: 1,
      hasMaterialContact: true,
    })).toBe(1);
  });
});
