import * as THREE from 'three';
import type { RenderPipeline } from '../core/RenderPipeline';
import { CHARACTER_RENDER_LAYER, WORLD_RENDER_LAYER } from '../core/renderLayers';

export type FramebufferPixel = readonly [number, number, number, number];

export interface DepthOcclusionProbeResult {
  readonly visibleWorldPixel: FramebufferPixel;
  readonly visibleLayerPixel: FramebufferPixel;
  readonly occludedWorldPixel: FramebufferPixel;
  readonly occludedLayerPixel: FramebufferPixel;
  readonly visibleLayerDelta: number;
  readonly occludedLayerDelta: number;
  readonly depthComposite: ReturnType<RenderPipeline['getDepthCompositeDiagnostics']>;
}

const LAYER_DISTANCE_FROM_CAMERA = 0.16;
const WORLD_DISTANCE_FROM_CAMERA = 0.11;
const PROBE_SIZE = 0.13;

export function maximumPixelDelta(
  first: FramebufferPixel,
  second: FramebufferPixel,
): number {
  return Math.max(
    Math.abs(first[0] - second[0]),
    Math.abs(first[1] - second[1]),
    Math.abs(first[2] - second[2]),
    Math.abs(first[3] - second[3]),
  );
}

export async function runDepthOcclusionProbe(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  pipeline: RenderPipeline,
): Promise<DepthOcclusionProbeResult> {
  const savedOpacity = pipeline.getCharacterOpacity();
  const direction = camera.getWorldDirection(new THREE.Vector3());
  const geometry = new THREE.PlaneGeometry(PROBE_SIZE, PROBE_SIZE);
  const layerMaterial = new THREE.MeshBasicMaterial({
    color: 0x20ff70,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const worldMaterial = new THREE.MeshBasicMaterial({
    color: 0xd020ff,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const layerProbe = createProbe(
    camera,
    direction,
    LAYER_DISTANCE_FROM_CAMERA,
    geometry,
    layerMaterial,
    CHARACTER_RENDER_LAYER,
    'Depth audit character-layer marker',
  );
  const worldProbe = createProbe(
    camera,
    direction,
    WORLD_DISTANCE_FROM_CAMERA,
    geometry,
    worldMaterial,
    WORLD_RENDER_LAYER,
    'Depth audit world occluder',
  );

  scene.add(layerProbe);
  try {
    pipeline.setCharacterOpacity(0);
    pipeline.render(0);
    const visibleWorldPixel = await pipeline.readScreenCenterPixel();
    pipeline.setCharacterOpacity(savedOpacity);
    pipeline.render(0);
    const visibleLayerPixel = await pipeline.readScreenCenterPixel();

    scene.add(worldProbe);
    pipeline.setCharacterOpacity(0);
    pipeline.render(0);
    const occludedWorldPixel = await pipeline.readScreenCenterPixel();
    pipeline.setCharacterOpacity(savedOpacity);
    pipeline.render(0);
    const occludedLayerPixel = await pipeline.readScreenCenterPixel();

    return {
      visibleWorldPixel,
      visibleLayerPixel,
      occludedWorldPixel,
      occludedLayerPixel,
      visibleLayerDelta: maximumPixelDelta(visibleWorldPixel, visibleLayerPixel),
      occludedLayerDelta: maximumPixelDelta(occludedWorldPixel, occludedLayerPixel),
      depthComposite: pipeline.getDepthCompositeDiagnostics(),
    };
  } finally {
    scene.remove(layerProbe, worldProbe);
    geometry.dispose();
    layerMaterial.dispose();
    worldMaterial.dispose();
    pipeline.setCharacterOpacity(savedOpacity);
    pipeline.render(0);
  }
}

function createProbe(
  camera: THREE.PerspectiveCamera,
  direction: THREE.Vector3,
  distance: number,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  layer: number,
  name: string,
): THREE.Mesh {
  const probe = new THREE.Mesh(geometry, material);
  probe.name = name;
  probe.position.copy(camera.position).addScaledVector(direction, distance);
  probe.quaternion.copy(camera.quaternion);
  probe.layers.set(layer);
  probe.frustumCulled = false;
  probe.updateMatrixWorld(true);
  return probe;
}
