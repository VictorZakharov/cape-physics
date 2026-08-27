import * as THREE from 'three';
import { CAVE } from '../config';
import { SeededRandom } from '../utils/random';
import { caveCeiling, caveCenterX, caveHalfWidth } from './caveProfile';

const dustVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    vec3 transformed = position;
    transformed.x += sin(uTime * 0.19 + aPhase) * 0.19;
    transformed.y += sin(uTime * 0.27 + aPhase * 1.7) * 0.11;
    vec4 view = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = aSize * uPixelRatio * (24.0 / max(1.0, -view.z));
    vAlpha = smoothstep(58.0, 3.0, -view.z);
  }
`;

const dustFragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5) * 2.0;
    float alpha = (1.0 - smoothstep(0.15, 1.0, distanceToCenter)) * vAlpha;
    gl_FragColor = vec4(vec3(0.52, 0.76, 0.7), alpha * 0.2);
  }
`;

export class CaveAtmosphere {
  public readonly points: THREE.Points;
  private readonly material: THREE.ShaderMaterial;

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
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(geometry, this.material);
    this.points.name = 'Suspended cave dust';
    this.points.frustumCulled = false;
  }

  public update(time: number): void {
    this.material.uniforms.uTime!.value = time;
  }

  public resize(): void {
    this.material.uniforms.uPixelRatio!.value = Math.min(window.devicePixelRatio, 2);
  }
}
