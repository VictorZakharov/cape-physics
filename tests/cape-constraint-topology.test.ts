import { describe, expect, test } from 'bun:test';
import { CAPE } from '../src/config';
import { CAPE_DISTANCE_CONSTRAINTS } from '../src/physics/CapeConstraintTopology';

describe('shared cape distance-constraint topology', () => {
  test('retains the exact WebGL row-major Gauss-Seidel stream', () => {
    expect(CAPE_DISTANCE_CONSTRAINTS.length).toBe(1626);
    expect(CAPE_DISTANCE_CONSTRAINTS.slice(0, 8)).toEqual([
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 1,
        secondRow: 0,
        stiffness: 0.93,
        structural: true,
      },
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 0,
        secondRow: 1,
        stiffness: 0.96,
        structural: true,
      },
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 1,
        secondRow: 1,
        stiffness: 0.8,
        structural: false,
      },
      {
        firstColumn: 1,
        firstRow: 0,
        secondColumn: 0,
        secondRow: 1,
        stiffness: 0.8,
        structural: false,
      },
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 2,
        secondRow: 0,
        stiffness: 0.58,
        structural: false,
      },
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 0,
        secondRow: 2,
        stiffness: 0.82,
        structural: false,
      },
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 3,
        secondRow: 0,
        stiffness: 0.16,
        structural: false,
      },
      {
        firstColumn: 0,
        firstRow: 0,
        secondColumn: 0,
        secondRow: 3,
        stiffness: 0.38,
        structural: false,
      },
    ]);
  });

  test('keeps every authored endpoint inside the shared particle grid', () => {
    for (const definition of CAPE_DISTANCE_CONSTRAINTS) {
      expect(definition.firstColumn).toBeGreaterThanOrEqual(0);
      expect(definition.firstColumn).toBeLessThan(CAPE.columns);
      expect(definition.secondColumn).toBeGreaterThanOrEqual(0);
      expect(definition.secondColumn).toBeLessThan(CAPE.columns);
      expect(definition.firstRow).toBeGreaterThanOrEqual(0);
      expect(definition.firstRow).toBeLessThan(CAPE.rows);
      expect(definition.secondRow).toBeGreaterThanOrEqual(0);
      expect(definition.secondRow).toBeLessThan(CAPE.rows);
    }
  });
});
