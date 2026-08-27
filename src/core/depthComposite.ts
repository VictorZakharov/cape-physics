export const LAYER_DEPTH_EPSILON = 0.000_001;

export function isLayerDepthVisible(
  worldDepth: number,
  layerDepth: number,
  layerAlpha = 1,
): boolean {
  return layerAlpha > 0 && layerDepth <= worldDepth + LAYER_DEPTH_EPSILON;
}
