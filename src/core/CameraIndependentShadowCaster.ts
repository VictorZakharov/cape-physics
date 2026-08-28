import * as THREE from 'three';
import type { RendererPreference } from './RendererPreference';
import {
  CHARACTER_RENDER_LAYER,
  WORLD_RENDER_LAYER,
} from './renderLayers';

const CONFIGURED_KEY = 'cameraIndependentShadowCaster';

interface MaterialWriteState {
  readonly material: THREE.Material;
  colorWrite: boolean;
  depthWrite: boolean;
}

/**
 * WebGPU shadow passes can opt directly into the character layer. The native
 * WebGL renderer filters casters through the color camera mask, so its path
 * also exposes the caster on the world layer while suppressing color/depth
 * writes during world-camera renders.
 */
export function enableCameraIndependentShadowCaster(
  mesh: THREE.Mesh,
  backend: RendererPreference = 'webgpu',
): void {
  if (mesh.userData[CONFIGURED_KEY] === true) return;
  mesh.userData[CONFIGURED_KEY] = true;
  mesh.castShadow = true;
  mesh.layers.set(CHARACTER_RENDER_LAYER);

  if (backend === 'webgpu') return;

  mesh.layers.enable(WORLD_RENDER_LAYER);
  const originalBeforeRender = mesh.onBeforeRender;
  const originalAfterRender = mesh.onAfterRender;
  const materialStates: MaterialWriteState[] = [];
  const configuredMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of configuredMaterials) {
    if (materialStates.some((state) => state.material === material)) continue;
    materialStates.push({
      material,
      colorWrite: material.colorWrite,
      depthWrite: material.depthWrite,
    });
  }
  let suppressingWrites = false;

  mesh.onBeforeRender = (...parameters): void => {
    originalBeforeRender.apply(mesh, parameters);
    const camera = parameters[2];
    suppressingWrites = !camera.layers.isEnabled(CHARACTER_RENDER_LAYER);
    if (!suppressingWrites) return;
    for (const state of materialStates) {
      state.colorWrite = state.material.colorWrite;
      state.depthWrite = state.material.depthWrite;
      state.material.colorWrite = false;
      state.material.depthWrite = false;
    }
  };

  mesh.onAfterRender = (...parameters): void => {
    if (suppressingWrites) {
      for (const state of materialStates) {
        state.material.colorWrite = state.colorWrite;
        state.material.depthWrite = state.depthWrite;
      }
    }
    suppressingWrites = false;
    originalAfterRender.apply(mesh, parameters);
  };
}
