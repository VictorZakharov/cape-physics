import * as THREE from 'three/webgpu';
import { PHYSICS_STEP } from '../config';
import { GpuCapeSimulation } from '../physics/GpuCapeSimulation';
import type { CapeAnchors } from '../player/Character';

export interface ApplicationCapeProbe {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  getComputePipelineNodes(): THREE.ComputeNode[];
  prepareStep(): THREE.ComputeNode[];
  usePositionOnlyMaterial(): void;
  useProductionMaterial(): void;
  dispose(): void;
}

/**
 * Smallest renderable workload that owns the production WebGPU cape graph.
 * It deliberately excludes the character and full demo, cave objects, world/body
 * colliders, PMREM, post-processing, bots, animation, and frame loops.
 */
export function createApplicationCapeProbe(
  renderer: THREE.WebGPURenderer,
): ApplicationCapeProbe {
  const anchors: CapeAnchors = {
    left: new THREE.Vector3(-0.48, 2.1, 0.27),
    right: new THREE.Vector3(0.48, 2.1, 0.27),
    back: new THREE.Vector3(0, 0, 1),
  };
  const simulation = new GpuCapeSimulation(renderer, anchors);
  const productionMaterial = simulation.mesh.material;
  const positionOnlyMaterial = new THREE.MeshBasicNodeMaterial({
    color: new THREE.Color(0xc9_3b_2b),
    side: THREE.DoubleSide,
  });
  positionOnlyMaterial.name = 'GPU cape position-only diagnostic';
  positionOnlyMaterial.positionNode = productionMaterial.positionNode;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07_10_12);
  scene.add(simulation.mesh);
  scene.add(new THREE.HemisphereLight(0x9f_d8_d0, 0x14_0d_0a, 1.8));
  const keyLight = new THREE.DirectionalLight(0xff_e0_b5, 2.4);
  keyLight.position.set(-2, 4, 3);
  scene.add(keyLight);

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.05, 20);
  camera.position.set(0, 1.45, 4.2);
  camera.lookAt(0, 1.35, 0.65);

  return {
    scene,
    camera,
    getComputePipelineNodes: () => simulation.getComputePipelineNodes(),
    prepareStep: () => simulation.prepareStep(
      PHYSICS_STEP,
      anchors,
      [],
      [],
      new THREE.Vector3(),
      0,
    ),
    usePositionOnlyMaterial: () => {
      simulation.mesh.material = positionOnlyMaterial as unknown as typeof productionMaterial;
    },
    useProductionMaterial: () => {
      simulation.mesh.material = productionMaterial;
    },
    dispose: () => {
      simulation.mesh.material = productionMaterial;
      positionOnlyMaterial.dispose();
      simulation.dispose();
    },
  };
}
