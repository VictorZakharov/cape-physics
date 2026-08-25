import * as THREE from 'three';
import { NearestPointLightPool, type LocalLightSource } from '../lighting/NearestPointLightPool';
import type { WorldSphereCollider } from '../physics/colliders';
import { SeededRandom } from '../utils/random';
import { caveCenterX, caveHalfWidth, floorHeightAt } from './caveProfile';

interface Torch extends LocalLightSource {
  readonly root: THREE.Group;
  readonly flame: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  readonly inward: THREE.Vector3;
  readonly phase: number;
}

const flameVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  varying float vHeight;
  void main() {
    vec3 transformed = position;
    float height = uv.y;
    transformed.x += sin(uTime * 7.0 + uPhase + position.y * 8.0) * 0.045 * height;
    transformed.z += cos(uTime * 5.3 + uPhase + position.y * 6.0) * 0.03 * height;
    transformed.xz *= 0.78 + height * 0.25;
    vHeight = height;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const flameFragmentShader = /* glsl */ `
  varying float vHeight;
  void main() {
    float edge = smoothstep(0.0, 0.32, vHeight) * (1.0 - smoothstep(0.7, 1.0, vHeight));
    vec3 color = mix(vec3(5.0, 0.42, 0.035), vec3(1.4, 0.07, 0.01), vHeight);
    gl_FragColor = vec4(color, edge * 0.92);
  }
`;

export class TorchSystem {
  public readonly group = new THREE.Group();
  public readonly worldColliders: WorldSphereCollider[] = [];
  private readonly torches: Torch[] = [];
  private readonly lightPool = new NearestPointLightPool(3, 'Torch');
  private readonly shadowLight: THREE.SpotLight;
  private activeShadowTorch = -1;

  public constructor() {
    this.group.name = 'Torch lights';
    const random = new SeededRandom(0x70ac4);
    const zPositions = [11, -2, -15, -29, -43, -57, -68];
    zPositions.forEach((z, index) => this.createTorch(z, index % 2 === 0 ? -1 : 1, random));
    this.group.add(...this.lightPool.lights);

    this.shadowLight = new THREE.SpotLight(0xffb05a, 72, 12, 0.86, 0.82, 1.7);
    this.shadowLight.name = 'Nearest torch shadow proxy';
    this.shadowLight.castShadow = true;
    this.shadowLight.shadow.mapSize.set(1024, 1024);
    this.shadowLight.shadow.camera.near = 0.25;
    this.shadowLight.shadow.camera.far = 12;
    this.shadowLight.shadow.bias = -0.00016;
    this.shadowLight.shadow.normalBias = 0.035;
    this.group.add(this.shadowLight, this.shadowLight.target);
  }

  public update(time: number, viewer: THREE.Vector3): void {
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    this.torches.forEach((torch, index) => {
      const distance = torch.position.distanceTo(viewer);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
      const flicker = 1 + Math.sin(time * 11.3 + torch.phase) * 0.055 + Math.sin(time * 17.7 + torch.phase * 2.2) * 0.028;
      torch.intensity = 22 * flicker;
      torch.flame.scale.y = flicker;
      torch.flame.material.uniforms.uTime!.value = time;
    });
    this.lightPool.update(viewer, this.torches);

    const nearest = this.torches[closestIndex];
    if (!nearest) return;
    if (closestIndex !== this.activeShadowTorch) {
      this.activeShadowTorch = closestIndex;
      this.shadowLight.position.copy(nearest.position);
      this.shadowLight.target.position.copy(nearest.position)
        .addScaledVector(nearest.inward, 3.1)
        .setY(floorHeightAt(nearest.position.x, nearest.position.z) + 0.65);
      this.shadowLight.shadow.needsUpdate = true;
    }
    this.shadowLight.intensity = closestDistance < 13 ? 64 + Math.sin(time * 12.1) * 4 : 0;
  }

  public getLightDiagnostics() {
    return this.lightPool.getDiagnostics();
  }

  private createTorch(z: number, side: -1 | 1, random: SeededRandom): void {
    const root = new THREE.Group();
    const x = caveCenterX(z) + side * (caveHalfWidth(z) - 0.48);
    const y = floorHeightAt(x, z) + random.range(1.62, 2.15);
    root.position.set(x, y, z);

    const inward = new THREE.Vector3(-side, -0.18, 0).normalize();
    root.rotation.z = side * -0.15;
    const metal = new THREE.MeshStandardMaterial({ color: 0x201b17, roughness: 0.48, metalness: 0.82 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x32170b, roughness: 0.9, metalness: 0.02 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 0.82, 7), wood);
    handle.castShadow = true;
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.026, 6, 12), metal);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.37;
    const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.54, 6), metal);
    bracket.rotation.z = Math.PI / 2;
    bracket.position.set(side * 0.22, -0.18, 0);
    root.add(handle, collar, bracket);

    const flameMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPhase: { value: random.range(0, Math.PI * 2) } },
      vertexShader: flameVertexShader,
      fragmentShader: flameFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.15, 9, 12), flameMaterial);
    flame.scale.set(0.72, 1.8, 0.72);
    flame.position.y = 0.57;
    root.add(flame);

    root.updateMatrixWorld(true);
    const localColliderCenter = new THREE.Vector3();
    const worldColliderCenter = new THREE.Vector3();
    const addCollider = (xOffset: number, yOffset: number, radius: number): void => {
      localColliderCenter.set(xOffset, yOffset, 0);
      root.localToWorld(worldColliderCenter.copy(localColliderCenter));
      this.worldColliders.push({
        center: worldColliderCenter.clone(),
        radius,
        walkable: false,
        kind: 'torch',
      });
    };
    for (const offsetY of [-0.41, -0.205, 0, 0.205, 0.41]) {
      addCollider(0, offsetY, 0.112);
    }
    for (const bracketOffset of [-0.27, -0.135, 0, 0.135, 0.27]) {
      addCollider(side * 0.22 + bracketOffset, -0.18, 0.104);
    }
    addCollider(0, 0.37, 0.145);

    const worldFlamePosition = new THREE.Vector3(x, y + 0.58, z);
    this.group.add(root);
    this.torches.push({
      root,
      flame,
      position: worldFlamePosition,
      inward,
      phase: random.range(0, Math.PI * 2),
      color: new THREE.Color(0xffa24e),
      intensity: 22,
      range: 9.5,
    });
  }
}
