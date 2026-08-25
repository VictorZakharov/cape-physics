import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { SceneLayerCompositePass } from '../src/core/SceneLayerCompositePass';

describe('SceneLayerCompositePass', () => {
  test('clamps the final silhouette opacity without mutating source materials', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const pass = new SceneLayerCompositePass(scene, camera, 1);

    pass.setOpacity(0.12);
    expect(pass.getOpacity()).toBeCloseTo(0.12, 6);
    pass.setOpacity(-1);
    expect(pass.getOpacity()).toBe(0);
    pass.setOpacity(2);
    expect(pass.getOpacity()).toBe(1);
    pass.dispose();
  });
});
