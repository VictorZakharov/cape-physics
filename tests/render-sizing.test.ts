import { describe, expect, test } from 'bun:test';
import {
  calculateRenderSizing,
  MAX_RENDER_PIXELS,
} from '../src/core/renderSizing';

describe('render sizing', () => {
  test('caps a high-density 4K display before allocating post-processing targets', () => {
    const sizing = calculateRenderSizing(3840, 2160, 2, 1);
    expect(sizing.pixelRatio).toBeLessThan(1);
    expect(sizing.renderPixels).toBeLessThanOrEqual(MAX_RENDER_PIXELS);
  });

  test('preserves native resolution on a standard-density 1080p display', () => {
    const sizing = calculateRenderSizing(1920, 1080, 1, 1);
    expect(sizing.pixelRatio).toBe(1);
    expect(sizing.drawingBufferWidth).toBe(1920);
    expect(sizing.drawingBufferHeight).toBe(1080);
  });
});
