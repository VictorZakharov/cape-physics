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

  test('rejoins the established body drape by the third free row', () => {
    const down = 3 / (CAPE.rows - 1);
    const across = 0.2;
    const previousAttachmentDepth = 0.14;
    const previousBackOffset = 0.045
      + down * 0.18
      + (1 - down) ** 2 * (1 - Math.abs(across) * 2) * 0.035;

    const previousWorldDepth = previousAttachmentDepth + previousBackOffset;
    const revisedWorldDepth = CAPE.attachment.depth + getCapeRestBackOffset(down, across);
    expect(revisedWorldDepth).toBeCloseTo(previousWorldDepth, 10);
  });
});
