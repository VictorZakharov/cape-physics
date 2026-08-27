import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { enableCameraIndependentShadowCaster } from '../src/core/CameraIndependentShadowCaster';
import { framebufferYFromNdc } from '../src/testing/ShadowLayerProbe';
import {
  CHARACTER_RENDER_LAYER,
  WORLD_RENDER_LAYER,
} from '../src/core/renderLayers';

describe('camera-independent character shadows', () => {
  test('keeps the caster isolated for color while the shadow camera selects its layer', () => {
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    mesh.layers.set(CHARACTER_RENDER_LAYER);
    enableCameraIndependentShadowCaster(mesh);

    expect(mesh.layers.isEnabled(WORLD_RENDER_LAYER)).toBeFalse();
    expect(mesh.layers.isEnabled(CHARACTER_RENDER_LAYER)).toBeTrue();
    expect(mesh.castShadow).toBeTrue();
    expect(material.colorWrite).toBeTrue();
    expect(material.depthWrite).toBeTrue();

    enableCameraIndependentShadowCaster(mesh);
    expect(mesh.children).toHaveLength(0);

    material.dispose();
    mesh.geometry.dispose();
  });

  test('maps projected Y to each backend readback origin', () => {
    expect(framebufferYFromNdc(1, 128, THREE.WebGLCoordinateSystem)).toBe(127);
    expect(framebufferYFromNdc(-1, 128, THREE.WebGLCoordinateSystem)).toBe(0);
    expect(framebufferYFromNdc(1, 128, THREE.WebGPUCoordinateSystem)).toBe(0);
    expect(framebufferYFromNdc(-1, 128, THREE.WebGPUCoordinateSystem)).toBe(127);
  });
});
