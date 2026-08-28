import * as THREE from 'three/webgpu';

export type RenderBundleTransformMode = 'fixed' | 'dynamic';

/**
 * Moves an existing hierarchy into a WebGPU render bundle.
 *
 * A static bundle lets Three.js skip per-object binding refreshes, so it is
 * only correct when descendant world matrices never change. Dynamic bundles
 * still cache draw commands, but refresh animated and translated matrices.
 */
export function moveChildrenIntoRenderBundle(
  group: THREE.Group,
  transformMode: RenderBundleTransformMode,
): THREE.BundleGroup {
  const bundle = new THREE.BundleGroup();
  bundle.name = `${group.name || 'Object hierarchy'} render bundle`;
  bundle.static = transformMode === 'fixed';
  bundle.add(...group.children);
  group.add(bundle);
  return bundle;
}
