import * as THREE from 'three';
import { enableCameraIndependentShadowCaster } from '../core/CameraIndependentShadowCaster';
import {
  CHARACTER_RENDER_LAYER,
  WORLD_RENDER_LAYER,
} from '../core/renderLayers';
import type { FramebufferPixel } from './DepthOcclusionProbe';

export interface ShadowLayerProbeSample {
  readonly shadowPixel: FramebufferPixel;
  readonly litPixel: FramebufferPixel;
  readonly contrast: number;
}

export interface ShadowLayerProbeResult {
  readonly direct: ShadowLayerProbeSample;
  readonly isolated: ShadowLayerProbeSample;
  readonly secondAngle: ShadowLayerProbeSample;
  readonly contrastDelta: number;
  readonly angleContrastDelta: number;
}

const TARGET_SIZE = 128;
const SAMPLE_RADIUS = 2;

/**
 * Renders a character-layer caster over a world-layer receiver twice: once
 * with both camera layers and once with only the world layer used by close
 * camera fading. The sampled world-space shadow must survive both renders.
 */
export function runShadowLayerProbe(
  renderer: THREE.WebGLRenderer,
): ShadowLayerProbeResult {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  const camera = new THREE.OrthographicCamera(-2.2, 2.2, 2.2, -2.2, 0.1, 20);
  camera.position.set(4, 5, 6);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);

  const receiverMaterial = new THREE.MeshStandardMaterial({
    color: 0xb8b8b8,
    roughness: 1,
    metalness: 0,
  });
  const receiver = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    receiverMaterial,
  );
  receiver.name = 'Shadow layer probe receiver';
  receiver.rotation.x = -Math.PI / 2;
  receiver.receiveShadow = true;
  receiver.layers.set(WORLD_RENDER_LAYER);

  const casterMaterial = new THREE.MeshStandardMaterial({
    color: 0x606060,
    roughness: 1,
  });
  const caster = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.2, 0.8),
    casterMaterial,
  );
  caster.name = 'Shadow layer probe caster';
  caster.position.y = 0.6;
  caster.castShadow = true;
  caster.layers.set(CHARACTER_RENDER_LAYER);
  enableCameraIndependentShadowCaster(caster);

  const ambient = new THREE.AmbientLight(0xffffff, 0.08);
  const light = new THREE.DirectionalLight(0xffffff, 3.4);
  light.position.set(-3, 6, 3);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.mapSize.set(512, 512);
  light.shadow.camera.left = -4;
  light.shadow.camera.right = 4;
  light.shadow.camera.top = 4;
  light.shadow.camera.bottom = -4;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 14;
  light.shadow.bias = -0.000_2;
  light.shadow.normalBias = 0.015;
  scene.add(receiver, caster, ambient, light, light.target);
  scene.updateMatrixWorld(true);

  const target = new THREE.WebGLRenderTarget(TARGET_SIZE, TARGET_SIZE, {
    depthBuffer: true,
    stencilBuffer: false,
  });
  const previousTarget = renderer.getRenderTarget();
  const previousShadowEnabled = renderer.shadowMap.enabled;
  const previousShadowAutoUpdate = renderer.shadowMap.autoUpdate;
  const previousClearAlpha = renderer.getClearAlpha();
  const previousClearColor = renderer.getClearColor(new THREE.Color()).clone();
  const shadowPoint = new THREE.Vector3(0.5, 0.001, -0.5);
  const litPoint = new THREE.Vector3(-1.1, 0.001, 0.9);

  try {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = true;
    const direct = renderSample(
      renderer,
      scene,
      camera,
      target,
      shadowPoint,
      litPoint,
      true,
    );
    const isolated = renderSample(
      renderer,
      scene,
      camera,
      target,
      shadowPoint,
      litPoint,
      false,
    );
    camera.position.set(4, 5, -6);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    const secondAngle = renderSample(
      renderer,
      scene,
      camera,
      target,
      shadowPoint,
      litPoint,
      false,
    );
    return {
      direct,
      isolated,
      secondAngle,
      contrastDelta: Math.abs(direct.contrast - isolated.contrast),
      angleContrastDelta: Math.abs(isolated.contrast - secondAngle.contrast),
    };
  } finally {
    renderer.setRenderTarget(previousTarget);
    renderer.shadowMap.enabled = previousShadowEnabled;
    renderer.shadowMap.autoUpdate = previousShadowAutoUpdate;
    renderer.setClearColor(previousClearColor, previousClearAlpha);
    target.dispose();
    receiver.geometry.dispose();
    caster.geometry.dispose();
    receiverMaterial.dispose();
    casterMaterial.dispose();
    light.dispose();
  }
}

function renderSample(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  target: THREE.WebGLRenderTarget,
  shadowPoint: THREE.Vector3,
  litPoint: THREE.Vector3,
  includeCharacterLayer: boolean,
): ShadowLayerProbeSample {
  camera.layers.set(WORLD_RENDER_LAYER);
  if (includeCharacterLayer) camera.layers.enable(CHARACTER_RENDER_LAYER);
  renderer.setRenderTarget(target);
  renderer.setClearColor(0x050505, 1);
  renderer.clear(true, true, false);
  renderer.render(scene, camera);
  const shadowPixel = readWorldPoint(renderer, target, camera, shadowPoint);
  const litPixel = readWorldPoint(renderer, target, camera, litPoint);
  return {
    shadowPixel,
    litPixel,
    contrast: luminance(litPixel) - luminance(shadowPixel),
  };
}

function readWorldPoint(
  renderer: THREE.WebGLRenderer,
  target: THREE.WebGLRenderTarget,
  camera: THREE.Camera,
  point: THREE.Vector3,
): FramebufferPixel {
  const projected = point.clone().project(camera);
  const x = THREE.MathUtils.clamp(
    Math.round((projected.x * 0.5 + 0.5) * (TARGET_SIZE - 1)),
    SAMPLE_RADIUS,
    TARGET_SIZE - SAMPLE_RADIUS - 1,
  );
  const y = THREE.MathUtils.clamp(
    Math.round((projected.y * 0.5 + 0.5) * (TARGET_SIZE - 1)),
    SAMPLE_RADIUS,
    TARGET_SIZE - SAMPLE_RADIUS - 1,
  );
  const size = SAMPLE_RADIUS * 2 + 1;
  const pixels = new Uint8Array(size * size * 4);
  renderer.readRenderTargetPixels(
    target,
    x - SAMPLE_RADIUS,
    y - SAMPLE_RADIUS,
    size,
    size,
    pixels,
  );
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  for (let offset = 0; offset < pixels.length; offset += 4) {
    red += pixels[offset] ?? 0;
    green += pixels[offset + 1] ?? 0;
    blue += pixels[offset + 2] ?? 0;
    alpha += pixels[offset + 3] ?? 0;
  }
  const count = size * size;
  return [
    Math.round(red / count),
    Math.round(green / count),
    Math.round(blue / count),
    Math.round(alpha / count),
  ];
}

function luminance(pixel: FramebufferPixel): number {
  return pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722;
}
