import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import {
  DIRECT_OPAQUE_THRESHOLD,
  selectCharacterRenderMode,
} from '../src/core/characterRenderMode';
import {
  createResolvedDepthTexture,
  isLayerDepthVisible,
  LAYER_DEPTH_EPSILON,
} from '../src/core/depthComposite';
import { SceneLayerCompositePass } from '../src/core/SceneLayerCompositePass';
import { maximumPixelDelta } from '../src/testing/DepthOcclusionProbe';

describe('SceneLayerCompositePass', () => {
  test('clamps the final silhouette opacity without mutating source materials', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const pass = new SceneLayerCompositePass(scene, camera, 1);

    expect(pass.getDepthDiagnostics()).toEqual({
      layerDepthTexture: true,
      worldDepthConnected: false,
    });

    pass.setOpacity(0.12);
    expect(pass.getOpacity()).toBeCloseTo(0.12, 6);
    pass.setOpacity(-1);
    expect(pass.getOpacity()).toBe(0);
    pass.setOpacity(2);
    expect(pass.getOpacity()).toBe(1);
    pass.dispose();
  });

  test('lets the nearest sampled depth determine whether the character layer is visible', () => {
    expect(isLayerDepthVisible(0.2, 0.8)).toBeFalse();
    expect(isLayerDepthVisible(0.8, 0.2)).toBeTrue();
    expect(isLayerDepthVisible(1, 0.5)).toBeTrue();
    expect(isLayerDepthVisible(0.4, 0.4 + LAYER_DEPTH_EPSILON)).toBeTrue();
    expect(isLayerDepthVisible(0.4, 0.4 + LAYER_DEPTH_EPSILON * 2)).toBeFalse();
    expect(isLayerDepthVisible(0.8, 0.2, 0)).toBeFalse();
  });

  test('creates nearest-filtered integer depth textures for resolved render targets', () => {
    const texture = createResolvedDepthTexture('test depth');
    expect(texture.name).toBe('test depth');
    expect(texture.format).toBe(THREE.DepthFormat);
    expect(texture.type).toBe(THREE.UnsignedIntType);
    expect(texture.minFilter).toBe(THREE.NearestFilter);
    expect(texture.magFilter).toBe(THREE.NearestFilter);
    expect(texture.generateMipmaps).toBeFalse();
    texture.dispose();
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
