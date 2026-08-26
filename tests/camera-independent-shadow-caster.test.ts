import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { enableCameraIndependentShadowCaster } from '../src/core/CameraIndependentShadowCaster';
import {
  CHARACTER_RENDER_LAYER,
  WORLD_RENDER_LAYER,
} from '../src/core/renderLayers';

describe('camera-independent character shadows', () => {
  test('keeps a caster in world shadow traversal without writing world color or depth', () => {
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    mesh.layers.set(CHARACTER_RENDER_LAYER);
    enableCameraIndependentShadowCaster(mesh);

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
