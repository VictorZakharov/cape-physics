import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { enableCameraIndependentShadowCaster } from '../src/core/CameraIndependentShadowCaster';
import { framebufferYFromNdc } from '../src/testing/ShadowLayerProbe';
import {
  CHARACTER_RENDER_LAYER,
  WORLD_RENDER_LAYER,
} from '../src/core/renderLayers';

describe('camera-independent character shadows', () => {
  test('keeps the WebGPU caster isolated while the shadow camera selects its layer', () => {
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    mesh.layers.set(CHARACTER_RENDER_LAYER);
    enableCameraIndependentShadowCaster(mesh, 'webgpu');

    expect(mesh.layers.isEnabled(WORLD_RENDER_LAYER)).toBeFalse();
    expect(mesh.layers.isEnabled(CHARACTER_RENDER_LAYER)).toBeTrue();
    expect(mesh.castShadow).toBeTrue();
    expect(material.colorWrite).toBeTrue();
    expect(material.depthWrite).toBeTrue();

    enableCameraIndependentShadowCaster(mesh, 'webgpu');
    expect(mesh.children).toHaveLength(0);

    material.dispose();
    mesh.geometry.dispose();
  });

  test('keeps a native WebGL caster in shadow traversal without writing world color or depth', () => {
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    mesh.layers.set(CHARACTER_RENDER_LAYER);
    enableCameraIndependentShadowCaster(mesh, 'webgl');

    expect(mesh.layers.isEnabled(WORLD_RENDER_LAYER)).toBeTrue();
    expect(mesh.layers.isEnabled(CHARACTER_RENDER_LAYER)).toBeTrue();

    const worldCamera = new THREE.PerspectiveCamera();
    worldCamera.layers.set(WORLD_RENDER_LAYER);
    invokeRenderCallback(mesh.onBeforeRender, mesh, worldCamera, material);
    expect(material.colorWrite).toBeFalse();
    expect(material.depthWrite).toBeFalse();
    invokeRenderCallback(mesh.onAfterRender, mesh, worldCamera, material);
    expect(material.colorWrite).toBeTrue();
    expect(material.depthWrite).toBeTrue();

    const characterCamera = new THREE.PerspectiveCamera();
    characterCamera.layers.set(CHARACTER_RENDER_LAYER);
    invokeRenderCallback(mesh.onBeforeRender, mesh, characterCamera, material);
    expect(material.colorWrite).toBeTrue();
    expect(material.depthWrite).toBeTrue();
    invokeRenderCallback(mesh.onAfterRender, mesh, characterCamera, material);

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

function invokeRenderCallback(
  callback: THREE.Object3D['onBeforeRender'],
  mesh: THREE.Mesh,
  camera: THREE.Camera,
  material: THREE.Material,
): void {
  callback.call(
    mesh,
    {} as THREE.WebGLRenderer,
    new THREE.Scene(),
    camera,
    mesh.geometry,
    material,
    {} as THREE.Group,
  );
}
