import * as THREE from 'three/webgpu';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { NearestPointLightPool, type LocalLightSource } from '../lighting/NearestPointLightPool';
import type { WorldSphereCollider } from '../physics/colliders';
import { SeededRandom } from '../utils/random';
import { caveCenterX, caveHalfWidth } from './caveProfile';

interface VeinCluster extends LocalLightSource {
  readonly root: THREE.Vector3;
  readonly phase: number;
}

export class MineralVeins {
  public readonly group = new THREE.Group();
  public readonly worldColliders: WorldSphereCollider[] = [];
  private readonly clusters: VeinCluster[] = [];
  private readonly lightPool = new NearestPointLightPool(2, 'Mineral');

  public constructor() {
    this.group.name = 'Glowing mineral veins';
    const locations = [
      { z: 1, side: -1, color: 0x42efd1 },
      { z: -22, side: 1, color: 0x70cfff },
      { z: -43, side: -1, color: 0xa187ff },
      { z: -61, side: 1, color: 0x49e6c2 },
    ] as const;

    locations.forEach((location, index) => this.createCluster(location.z, location.side, location.color, index));
    this.group.add(...this.lightPool.lights);
  }

  public update(time: number, viewer: THREE.Vector3): void {
    for (const cluster of this.clusters) {
      cluster.intensity = 8.5 + Math.sin(time * 1.3 + cluster.phase) * 0.65;
    }
    this.lightPool.update(viewer, this.clusters);
  }

  public getClusterPositions(): number[][] {
    return this.clusters.map((cluster) => cluster.root.toArray());
  }

  public getLightDiagnostics() {
    return this.lightPool.getDiagnostics();
  }

  private createCluster(z: number, side: -1 | 1, color: number, seed: number): void {
    const random = new SeededRandom(0xc2a9 + seed * 991);
    const wallX = caveCenterX(z) + side * (caveHalfWidth(z) - 0.48);
    const root = new THREE.Vector3(wallX, random.range(2.1, 4.2), z);
    const coreColor = new THREE.Color(color);
    const material = new THREE.MeshStandardMaterial({
      color: coreColor,
      emissive: coreColor,
      emissiveIntensity: 5.5,
      roughness: 0.23,
      metalness: 0.34,
    });
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const branchCount = 8;
    const coreGeometries: THREE.BufferGeometry[] = [];
    const glowGeometries: THREE.BufferGeometry[] = [];
    for (let branch = 0; branch < branchCount; branch += 1) {
      const points: THREE.Vector3[] = [root.clone()];
      const directionY = random.range(-1, 1);
      const directionZ = random.range(-1, 1);
      const length = random.range(1.1, 3.0);
      const segments = random.integer(3, 5);
      for (let pointIndex = 1; pointIndex <= segments; pointIndex += 1) {
        const progress = pointIndex / segments;
        const branchZ = z + directionZ * length * progress + Math.sin(progress * 7 + branch) * 0.14;
        const branchY = root.y + directionY * length * progress + Math.sin(progress * 5 + seed) * 0.18;
        const branchX = caveCenterX(branchZ) + side * (caveHalfWidth(branchZ) - 0.46 - Math.sin(progress * Math.PI) * 0.08);
        points.push(new THREE.Vector3(branchX, branchY, branchZ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const radius = random.range(0.018, 0.045) * (1 - branch / branchCount * 0.38);
      coreGeometries.push(new THREE.TubeGeometry(curve, 18, radius, 5, false));
      glowGeometries.push(new THREE.TubeGeometry(curve, 14, radius * 3.2, 5, false));
    }
    const coreGeometry = mergeGeometries(coreGeometries, false);
    const glowGeometry = mergeGeometries(glowGeometries, false);
    if (!coreGeometry || !glowGeometry) throw new Error('Unable to merge procedural mineral branches.');
    const vein = new THREE.Mesh(coreGeometry, material);
    vein.name = `Mineral vein core ${seed}`;
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.name = `Mineral vein glow ${seed}`;
    this.group.add(glow, vein);
    coreGeometries.forEach((geometry) => geometry.dispose());
    glowGeometries.forEach((geometry) => geometry.dispose());

    const crystalGeometry = new THREE.OctahedronGeometry(0.11, 0);
    const crystals = new THREE.InstancedMesh(crystalGeometry, material, 18);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();
    for (let index = 0; index < crystals.count; index += 1) {
      position.set(
        wallX - side * random.range(0, 0.14),
        root.y + random.range(-1.8, 1.8),
        z + random.range(-2.1, 2.1),
      );
      quaternion.setFromEuler(new THREE.Euler(random.range(0, Math.PI), random.range(0, Math.PI), random.range(0, Math.PI)));
      scale.set(random.range(0.45, 1.6), random.range(0.8, 2.9), random.range(0.45, 1.2));
      matrix.compose(position, quaternion, scale);
      crystals.setMatrixAt(index, matrix);
      this.worldColliders.push({
        center: position.clone(),
        radius: THREE.MathUtils.clamp(0.11 * Math.max(scale.x, scale.y, scale.z), 0.07, 0.34),
        walkable: false,
        kind: 'mineral',
      });
    }
    crystals.instanceMatrix.needsUpdate = true;
    this.group.add(crystals);

    const lightPosition = root.clone().add(new THREE.Vector3(-side * 0.65, 0, 0));
    this.clusters.push({
      root,
      position: lightPosition,
      color: coreColor,
      intensity: 9,
      range: 7.5,
      phase: random.range(0, Math.PI * 2),
    });
  }
}
