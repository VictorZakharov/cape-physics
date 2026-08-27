import { describe, expect, test } from 'bun:test';
import {
  DIRECT_OPAQUE_THRESHOLD,
  selectCharacterRenderMode,
} from '../src/core/characterRenderMode';
import {
  isLayerDepthVisible,
  LAYER_DEPTH_EPSILON,
} from '../src/core/depthComposite';
import { maximumPixelDelta } from '../src/testing/DepthOcclusionProbe';

describe('depth-aware character compositing', () => {
  test('lets the nearest sampled depth determine whether the character layer is visible', () => {
    expect(isLayerDepthVisible(0.2, 0.8)).toBeFalse();
    expect(isLayerDepthVisible(0.8, 0.2)).toBeTrue();
    expect(isLayerDepthVisible(1, 0.5)).toBeTrue();
    expect(isLayerDepthVisible(0.4, 0.4 + LAYER_DEPTH_EPSILON)).toBeTrue();
    expect(isLayerDepthVisible(0.4, 0.4 + LAYER_DEPTH_EPSILON * 2)).toBeFalse();
    expect(isLayerDepthVisible(0.8, 0.2, 0)).toBeFalse();
  });

  test('measures the largest deterministic framebuffer channel change', () => {
    expect(maximumPixelDelta([10, 20, 30, 255], [12, 13, 33, 255])).toBe(7);
  });

  test('uses shared MSAA depth for opaque edges and isolates only camera fade', () => {
    expect(selectCharacterRenderMode(1)).toBe('direct-opaque');
    expect(selectCharacterRenderMode(DIRECT_OPAQUE_THRESHOLD)).toBe('direct-opaque');
    expect(selectCharacterRenderMode(DIRECT_OPAQUE_THRESHOLD - 0.000_001)).toBe('isolated-fade');
    expect(selectCharacterRenderMode(0.12)).toBe('isolated-fade');
  });
});
