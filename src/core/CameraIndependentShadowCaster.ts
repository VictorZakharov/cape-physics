import * as THREE from 'three';
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
 * Keeps a character-layer mesh in the world shadow traversal even while the
 * close-camera fade renders its color in an isolated pass. Three.js filters
 * shadow casters with the main camera's layer mask, so the mesh must belong to
 * the world layer; normal world-pass color/depth writes are suppressed here.
 */
export function enableCameraIndependentShadowCaster(mesh: THREE.Mesh): void {
  if (mesh.userData[CONFIGURED_KEY] === true) return;
  mesh.userData[CONFIGURED_KEY] = true;
  mesh.layers.enable(WORLD_RENDER_LAYER);
  mesh.layers.enable(CHARACTER_RENDER_LAYER);

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
