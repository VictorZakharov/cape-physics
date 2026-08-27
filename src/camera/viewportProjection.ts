import type { PerspectiveCamera } from 'three/webgpu';

const MINIMUM_VIEWPORT_DIMENSION = 1;

function normalizeViewportDimension(value: number): number {
  if (!Number.isFinite(value)) return MINIMUM_VIEWPORT_DIMENSION;
  return Math.max(MINIMUM_VIEWPORT_DIMENSION, Math.floor(value));
}

export function calculateViewportAspect(width: number, height: number): number {
  return normalizeViewportDimension(width) / normalizeViewportDimension(height);
}

export function synchronizePerspectiveCameraAspect(
  camera: PerspectiveCamera,
  width: number,
  height: number,
): number {
  const aspect = calculateViewportAspect(width, height);
  if (Math.abs(camera.aspect - aspect) < 0.000_001) return aspect;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  return aspect;
}
