import * as THREE from 'three';
import { WebGLRenderer, WebGLRenderTarget } from 'three';
import { enableCameraIndependentShadowCaster } from '../core/CameraIndependentShadowCaster';
import type { RenderPipelineRenderer } from '../core/RenderPipeline';
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
type ProbeTarget = THREE.RenderTarget | WebGLRenderTarget;

/**
 * Renders a character-layer caster over a world-layer receiver twice: once
 * with both camera layers and once with only the world layer used by close
 * camera fading. The sampled world-space shadow must survive both renders.
 */
export async function runShadowLayerProbe(
  renderer: RenderPipelineRenderer,
): Promise<ShadowLayerProbeResult> {
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
  enableCameraIndependentShadowCaster(
    caster,
    renderer instanceof WebGLRenderer ? 'webgl' : 'webgpu',
  );

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
  light.shadow.camera.layers.enable(CHARACTER_RENDER_LAYER);
  light.shadow.bias = -0.000_2;
  light.shadow.normalBias = 0.015;
  scene.add(receiver, caster, ambient, light, light.target);
  scene.updateMatrixWorld(true);

  const target: ProbeTarget = renderer instanceof WebGLRenderer
    ? new WebGLRenderTarget(TARGET_SIZE, TARGET_SIZE, {
        type: THREE.UnsignedByteType,
        depthBuffer: true,
        stencilBuffer: false,
      })
    : new THREE.RenderTarget(TARGET_SIZE, TARGET_SIZE, {
        type: THREE.UnsignedByteType,
        depthBuffer: true,
        stencilBuffer: false,
      });
  const previousTarget: ProbeTarget | null = renderer instanceof WebGLRenderer
    ? renderer.getRenderTarget()
    : renderer.getRenderTarget();
  const previousShadowEnabled = renderer.shadowMap.enabled;
  const previousClearAlpha = renderer.getClearAlpha();
  const previousClearColor = renderer.getClearColor(new THREE.Color()).clone();
  const shadowPoint = new THREE.Vector3(0.5, 0.001, -0.5);
  const litPoint = new THREE.Vector3(-1.1, 0.001, 0.9);

  try {
    renderer.shadowMap.enabled = true;
    const direct = await renderSample(
      renderer,
      scene,
      camera,
      target,
      shadowPoint,
      litPoint,
      true,
    );
    const isolated = await renderSample(
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
    const secondAngle = await renderSample(
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
    setProbeRenderTarget(renderer, previousTarget);
    renderer.shadowMap.enabled = previousShadowEnabled;
    renderer.setClearColor(previousClearColor, previousClearAlpha);
    target.dispose();
    receiver.geometry.dispose();
    caster.geometry.dispose();
    receiverMaterial.dispose();
    casterMaterial.dispose();
    light.dispose();
  }
}

async function renderSample(
  renderer: RenderPipelineRenderer,
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  target: ProbeTarget,
  shadowPoint: THREE.Vector3,
  litPoint: THREE.Vector3,
  includeCharacterLayer: boolean,
): Promise<ShadowLayerProbeSample> {
  camera.layers.set(WORLD_RENDER_LAYER);
  if (includeCharacterLayer) camera.layers.enable(CHARACTER_RENDER_LAYER);
  setProbeRenderTarget(renderer, target);
  renderer.setClearColor(0x050505, 1);
  renderer.clear(true, true, false);
  renderer.render(scene, camera);
  const shadowPixel = await readWorldPoint(renderer, target, camera, shadowPoint);
  const litPixel = await readWorldPoint(renderer, target, camera, litPoint);
  return {
    shadowPixel,
    litPixel,
    contrast: luminance(litPixel) - luminance(shadowPixel),
  };
}

async function readWorldPoint(
  renderer: RenderPipelineRenderer,
  target: ProbeTarget,
  camera: THREE.Camera,
  point: THREE.Vector3,
): Promise<FramebufferPixel> {
  const projected = point.clone().project(camera);
  const x = THREE.MathUtils.clamp(
    Math.round((projected.x * 0.5 + 0.5) * (TARGET_SIZE - 1)),
    SAMPLE_RADIUS,
    TARGET_SIZE - SAMPLE_RADIUS - 1,
  );
  const y = THREE.MathUtils.clamp(
    framebufferYFromNdc(projected.y, TARGET_SIZE, renderer.coordinateSystem),
    SAMPLE_RADIUS,
    TARGET_SIZE - SAMPLE_RADIUS - 1,
  );
  const size = SAMPLE_RADIUS * 2 + 1;
  const pixels = renderer instanceof WebGLRenderer
    ? await renderer.readRenderTargetPixelsAsync(
        target as WebGLRenderTarget,
        x - SAMPLE_RADIUS,
        y - SAMPLE_RADIUS,
        size,
        size,
        new Uint8Array(size * size * 4),
      )
    : await renderer.readRenderTargetPixelsAsync(
        target as THREE.RenderTarget,
        x - SAMPLE_RADIUS,
        y - SAMPLE_RADIUS,
        size,
        size,
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

export function framebufferYFromNdc(
  ndcY: number,
  targetSize: number,
  coordinateSystem: typeof THREE.WebGLCoordinateSystem | typeof THREE.WebGPUCoordinateSystem,
): number {
  const normalizedFromBottom = ndcY * 0.5 + 0.5;
  const normalizedFromOrigin = coordinateSystem === THREE.WebGPUCoordinateSystem
    ? 1 - normalizedFromBottom
    : normalizedFromBottom;
  return Math.round(normalizedFromOrigin * (targetSize - 1));
}

function setProbeRenderTarget(
  renderer: RenderPipelineRenderer,
  target: ProbeTarget | null,
): void {
  if (renderer instanceof WebGLRenderer) {
    renderer.setRenderTarget(target as WebGLRenderTarget | null);
    return;
  }
  renderer.setRenderTarget(target as THREE.RenderTarget | null);
}

function luminance(pixel: FramebufferPixel): number {
  return pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722;
}
