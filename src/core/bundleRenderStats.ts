import * as THREE from 'three';
import {
  addFrameRenderStats,
  EMPTY_FRAME_RENDER_STATS,
  type FrameRenderStats,
} from './frameRenderStats';

/**
 * Measures commands hidden from renderer.info once a WebGPU render bundle is cached.
 * The demo intentionally has one shadow-casting light, so each casting mesh contributes
 * one main draw and one shadow draw.
 */
export function measureBundledRenderStats(
  root: THREE.Object3D,
  shadowPasses = 1,
): FrameRenderStats {
  let result = EMPTY_FRAME_RENDER_STATS;
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !object.visible) return;
    const main = measureMesh(object);
    result = addFrameRenderStats(result, main);
    if (object.castShadow) {
      for (let pass = 0; pass < shadowPasses; pass += 1) {
        result = addFrameRenderStats(result, main);
      }
    }
  });
  return result;
}

function measureMesh(mesh: THREE.Mesh): FrameRenderStats {
  const geometry = mesh.geometry;
  const material = mesh.material;
  const instances = mesh instanceof THREE.InstancedMesh ? mesh.count : 1;
  let calls = 0;
  let triangles = 0;

  if (Array.isArray(material)) {
    for (const group of geometry.groups) {
      if (material[group.materialIndex ?? 0]?.visible !== true) continue;
      const count = intersectDrawCount(group.start, group.count, geometry.drawRange);
      if (count <= 0) continue;
      calls += 1;
      triangles += instances * count / 3;
    }
  } else if (material.visible) {
    const available = geometry.index?.count ?? geometry.getAttribute('position')?.count ?? 0;
    const count = intersectDrawCount(0, available, geometry.drawRange);
    if (count > 0) {
      calls = 1;
      triangles = instances * count / 3;
    }
  }

  return { calls, triangles, points: 0, lines: 0 };
}

function intersectDrawCount(
  start: number,
  count: number,
  drawRange: { readonly start: number; readonly count: number },
): number {
  const end = start + count;
  const drawEnd = Number.isFinite(drawRange.count)
    ? drawRange.start + drawRange.count
    : Number.POSITIVE_INFINITY;
  return Math.max(0, Math.min(end, drawEnd) - Math.max(start, drawRange.start));
}
