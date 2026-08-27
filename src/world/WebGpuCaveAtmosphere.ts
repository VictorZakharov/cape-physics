import * as THREE from 'three/webgpu';
import {
  cameraPosition,
  float,
  instancedBufferAttribute,
  oneMinus,
  shapeCircle,
  sin,
  smoothstep,
  uniform,
  vec3,
} from 'three/tsl';
import { CAVE } from '../config';
import { SeededRandom } from '../utils/random';
import { caveCeiling, caveCenterX, caveHalfWidth } from './caveProfile';

export class WebGpuCaveAtmosphere {
  public readonly points: THREE.Sprite;
  private readonly material: THREE.PointsNodeMaterial;
  private readonly timeNode = uniform(0);

  public constructor() {
    const count = 620;
    const random = new SeededRandom(0xd057);
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const z = random.range(CAVE.endZ, CAVE.startZ);
      const x = caveCenterX(z) + random.range(-1, 1) * caveHalfWidth(z) * 0.83;
      positions[index * 3] = x;
      positions[index * 3 + 1] = random.range(0.25, caveCeiling(z) * 0.92);
      positions[index * 3 + 2] = z;
      phases[index] = random.range(0, Math.PI * 2);
      sizes[index] = random.range(0.45, 1.15);
    }
    const positionAttribute = new THREE.InstancedBufferAttribute(positions, 3);
    const phaseAttribute = new THREE.InstancedBufferAttribute(phases, 1);
    const sizeAttribute = new THREE.InstancedBufferAttribute(sizes, 1);
    const basePosition = instancedBufferAttribute<'vec3'>(positionAttribute, 'vec3');
    const phase = instancedBufferAttribute<'float'>(phaseAttribute, 'float');
    const animatedPosition = basePosition.add(vec3(
      sin(this.timeNode.mul(0.19).add(phase)).mul(0.19),
      sin(this.timeNode.mul(0.27).add(phase.mul(1.7))).mul(0.11),
      0,
    ));
    const distance = cameraPosition.sub(animatedPosition).length();
    this.material = new THREE.PointsNodeMaterial({
      color: 0x84c2b3,
      colorNode: vec3(0.52, 0.76, 0.7),
      opacityNode: float(shapeCircle() as THREE.Node<'float'>)
        .mul(oneMinus(smoothstep(3, 58, distance)))
        .mul(0.2),
      positionNode: animatedPosition,
      sizeNode: instancedBufferAttribute<'float'>(sizeAttribute, 'float')
        .mul(24)
        .div(distance.max(1)),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false,
      alphaToCoverage: true,
    });
    this.material.name = 'TSL suspended cave dust';
    this.points = new THREE.Sprite(this.material);
    this.points.count = count;
    this.points.name = 'Suspended cave dust';
    this.points.frustumCulled = false;
  }

  public update(time: number): void {
    this.timeNode.value = time;
  }

  public resize(): void {}
}
