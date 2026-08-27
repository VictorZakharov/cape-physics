import { describe, expect, test } from 'bun:test';
import { CAPE } from '../src/config';
import {
  getCapeRestBackOffset,
  getCapeRestWidth,
} from '../src/physics/CapeRestShape';

describe('cape rest shape', () => {
  test('expands a narrow neck mount through free shoulder rows', () => {
    const anchorWidth = CAPE.attachment.halfWidth * 2;
    const firstFreeRow = 1 / (CAPE.rows - 1);
    const shoulderRow = 2 / (CAPE.rows - 1);

    expect(getCapeRestWidth(anchorWidth, 0)).toBeCloseTo(anchorWidth, 10);
    expect(getCapeRestWidth(anchorWidth, firstFreeRow)).toBeGreaterThan(anchorWidth * 1.75);
    expect(getCapeRestWidth(anchorWidth, shoulderRow)).toBeGreaterThan(0.49);
  });

  test('never pinches a wider generic test mount inward', () => {
    const anchorWidth = 0.72;
    let previousWidth = getCapeRestWidth(anchorWidth, 0);
    for (let row = 1; row < CAPE.rows; row += 1) {
      const width = getCapeRestWidth(anchorWidth, row / (CAPE.rows - 1));
      expect(width).toBeGreaterThanOrEqual(previousWidth);
      previousWidth = width;
    }
  });

  test('follows the upper-back surface instead of preserving a detached panel', () => {
    const centerDepths = Array.from({ length: 5 }, (_, index) => {
      const down = (index + 1) / (CAPE.rows - 1);
      return CAPE.attachment.depth + getCapeRestBackOffset(down, 0);
    });

    for (const depth of centerDepths) {
      expect(depth).toBeGreaterThan(0.125);
      expect(depth).toBeLessThan(0.165);
    }
    expect(centerDepths.at(-1)!).toBeGreaterThan(centerDepths[0]!);
  });
});
