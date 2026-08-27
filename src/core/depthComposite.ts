import * as THREE from 'three';

export const LAYER_DEPTH_EPSILON = 0.000_001;

export function createResolvedDepthTexture(name: string): THREE.DepthTexture {
  const texture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
  texture.name = name;
  texture.format = THREE.DepthFormat;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function isLayerDepthVisible(
  worldDepth: number,
  layerDepth: number,
  layerAlpha = 1,
): boolean {
  return layerAlpha > 0 && layerDepth <= worldDepth + LAYER_DEPTH_EPSILON;
}
