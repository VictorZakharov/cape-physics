import * as THREE from 'three/webgpu';
import { CHARACTER_RENDER_LAYER } from './renderLayers';

const CONFIGURED_KEY = 'cameraIndependentShadowCaster';

/**
 * Keeps the visible character mesh on its isolated render layer. Character
 * shadow cameras opt into that layer separately, so the caster remains active
 * regardless of which camera layers the color pass currently renders.
 */
export function enableCameraIndependentShadowCaster(mesh: THREE.Mesh): void {
  if (mesh.userData[CONFIGURED_KEY] === true) return;
  mesh.userData[CONFIGURED_KEY] = true;
  mesh.castShadow = true;
  mesh.layers.set(CHARACTER_RENDER_LAYER);
}
