import { describe, expect, test } from 'bun:test';
import { SeededRandom, periodicFbm } from '../src/utils/random';

describe('procedural random utilities', () => {
  test('seeded streams are repeatable', () => {
    const first = new SeededRandom(42);
    const second = new SeededRandom(42);
    expect(Array.from({ length: 16 }, () => first.next())).toEqual(
      Array.from({ length: 16 }, () => second.next()),
    );
  });

  test('periodic noise joins at the texture boundary', () => {
    const period = 8;
    expect(periodicFbm(0, 3.25, period, 91)).toBeCloseTo(periodicFbm(period, 3.25, period, 91), 8);
    expect(periodicFbm(5.4, 0, period, 91)).toBeCloseTo(periodicFbm(5.4, period, period, 91), 8);
  });
});
