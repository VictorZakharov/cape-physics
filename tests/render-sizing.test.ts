import { describe, expect, test } from 'bun:test';
import {
  calculateRenderSizing,
  MAX_RENDER_PIXELS,
} from '../src/core/renderSizing';
import {
  calculateViewportAspect,
  synchronizePerspectiveCameraAspect,
} from '../src/camera/viewportProjection';
import * as THREE from 'three';

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

  test('initializes and synchronizes a widescreen camera without a browser resize event', () => {
    const camera = new THREE.PerspectiveCamera(52, calculateViewportAspect(1920, 1080), 0.08, 120);
    expect(camera.aspect).toBeCloseTo(16 / 9, 8);

    const initialHorizontalScale = camera.projectionMatrix.elements[0];
    synchronizePerspectiveCameraAspect(camera, 1024, 768);

    expect(camera.aspect).toBeCloseTo(4 / 3, 8);
    expect(camera.projectionMatrix.elements[0]).not.toBe(initialHorizontalScale);
  });

  test('keeps projection math finite for a collapsed viewport', () => {
    expect(calculateViewportAspect(Number.NaN, 0)).toBe(1);
  });
});
