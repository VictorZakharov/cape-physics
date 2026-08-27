import * as THREE from 'three/webgpu';
import {
  cameraPosition,
  float,
  instancedBufferAttribute,
  shapeCircle,
  vec3,
} from 'three/tsl';
import { RIPPLE_CAPACITY } from '../config';
import { createProceduralWaterMaterial } from '../graphics/ProceduralWaterMaterial';
import { SeededRandom } from '../utils/random';
import {
  caveCeiling,
  floorHeightAt,
  WATER_BASINS,
  waterSurfaceHeight,
  type WaterBasinProfile,
} from './caveProfile';

interface PuddleDefinition {
  readonly basin: WaterBasinProfile;
  readonly center: THREE.Vector3;
  readonly radiusX: number;
  readonly radiusZ: number;
}

interface Drop {
  readonly position: THREE.Vector3;
  readonly impact: THREE.Vector3;
  readonly top: number;
  velocity: number;
  delay: number;
}

interface SplashParticle {
  readonly position: THREE.Vector3;
  readonly velocity: THREE.Vector3;
  life: number;
}

const WATER_MINIMUM_ALPHA = 0.12;
const WATER_MAXIMUM_ALPHA = 0.55;

export class WebGpuWaterSystem {
  public readonly group = new THREE.Group();
  private readonly puddles: PuddleDefinition[];
  private readonly ripples = Array.from({ length: RIPPLE_CAPACITY }, () => new THREE.Vector4(0, 0, -100, 0));
  private readonly material: THREE.MeshBasicNodeMaterial;
  private readonly timeNode: THREE.UniformNode<'float', number>;
  private readonly drops: Drop[] = [];
  private readonly dropMesh: THREE.InstancedMesh;
  private readonly splashes: SplashParticle[] = [];
  private readonly splashPositions: THREE.InstancedBufferAttribute;
  private readonly splashPoints: THREE.Sprite;
  private readonly random = new SeededRandom(0xd1a9);
  private readonly dropMatrix = new THREE.Matrix4();
  private readonly hiddenDropMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
  private readonly footPosition = new THREE.Vector3();
  private rippleCursor = 0;
  private strideSinceStep = 0;
  private footSide = 1;
  private rippleEmissions = 0;
  private footstepRipples = 0;
  private dripRipples = 0;
  private landingRipples = 0;

  public constructor() {
    this.group.name = 'Reactive shallow water';
    this.puddles = this.createDefinitions();
    const waterMaterial = createProceduralWaterMaterial(
      this.ripples,
      WATER_MINIMUM_ALPHA,
      WATER_MAXIMUM_ALPHA,
    );
    this.material = waterMaterial.material;
    this.timeNode = waterMaterial.timeNode;

    const geometry = new THREE.PlaneGeometry(2, 2, 96, 68);
    for (const puddle of this.puddles) {
      const mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.copy(puddle.center);
      mesh.rotation.x = -Math.PI / 2;
      mesh.scale.set(puddle.radiusX, puddle.radiusZ, 1);
      mesh.renderOrder = 3;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    }

    this.createDrops();
    this.dropMesh = this.createDropMesh();
    this.group.add(this.dropMesh);

    this.splashPositions = new THREE.InstancedBufferAttribute(new Float32Array(72 * 3), 3);
    const splashPosition = instancedBufferAttribute<'vec3'>(this.splashPositions, 'vec3');
    const splashDistance = cameraPosition.sub(splashPosition).length();
    const splashMaterial = new THREE.PointsNodeMaterial({
      color: 0xb9e5dc,
      colorNode: vec3(0.73, 0.9, 0.86),
      opacityNode: float(shapeCircle() as THREE.Node<'float'>).mul(0.72),
      positionNode: splashPosition,
      sizeNode: float(30).div(splashDistance.max(1)),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false,
      alphaToCoverage: true,
    });
    splashMaterial.name = 'TSL water splash particles';
    this.splashPoints = new THREE.Sprite(splashMaterial);
    this.splashPoints.count = 0;
    this.splashPoints.name = 'Water splash particles';
    this.splashPoints.frustumCulled = false;
    this.group.add(this.splashPoints);
  }

  public update(
    delta: number,
    time: number,
    playerPosition: THREE.Vector3,
    playerYaw: number,
    playerSpeed: number,
  ): void {
    this.timeNode.value = time;
    this.updateDrops(delta, time);
    this.updateSplashes(delta);

    const puddle = this.findPuddle(playerPosition.x, playerPosition.z);
    if (puddle && playerSpeed > 0.45) {
      this.strideSinceStep += playerSpeed * delta;
      if (this.strideSinceStep > 0.48) {
        this.strideSinceStep = 0;
        this.footSide *= -1;
        const foot = this.footPosition.copy(playerPosition);
        foot.x += Math.cos(playerYaw) * 0.16 * this.footSide;
        foot.z -= Math.sin(playerYaw) * 0.16 * this.footSide;
        foot.y = puddle.center.y + 0.025;
        this.footstepRipples += 1;
        this.addRipple(foot, time, 0.038);
        this.spawnSplash(foot, 7, 0.58);
      }
    } else {
      this.strideSinceStep = Math.min(this.strideSinceStep, 0.3);
    }
  }

  public addRipple(position: THREE.Vector3, time: number, strength: number): void {
    const ripple = this.ripples[this.rippleCursor];
    ripple?.set(position.x, position.z, time, strength);
    this.rippleCursor = (this.rippleCursor + 1) % RIPPLE_CAPACITY;
    this.rippleEmissions += 1;
  }

  public addLandingRipple(
    position: THREE.Vector3,
    time: number,
    impactSpeed: number,
  ): boolean {
    const puddle = this.findPuddle(position.x, position.z);
    if (!puddle || impactSpeed <= 0) return false;

    const impact = this.footPosition.copy(position);
    impact.y = puddle.center.y + 0.025;
    const impactBlend = THREE.MathUtils.smoothstep(impactSpeed, 1.5, 6);
    this.landingRipples += 1;
    this.strideSinceStep = 0;
    this.addRipple(impact, time, THREE.MathUtils.lerp(0.05, 0.082, impactBlend));
    this.spawnSplash(impact, 14, THREE.MathUtils.lerp(0.72, 1.02, impactBlend));
    return true;
  }

  public isInWater(position: THREE.Vector3): boolean {
    return this.findPuddle(position.x, position.z) !== undefined;
  }

  public getDiagnostics(): {
    puddles: number;
    drops: number;
    activeRipples: number;
    activeSplashes: number;
    rippleEmissions: number;
    footstepRipples: number;
    dripRipples: number;
    landingRipples: number;
    basinCenters: readonly (readonly [number, number, number])[];
    surfaceAlphaRange: readonly [number, number];
    minimumInteriorDepth: number;
    minimumRimClearance: number;
  } {
    const containment = this.getContainmentDiagnostics();
    return {
      puddles: this.puddles.length,
      drops: this.drops.length,
      activeRipples: this.ripples.filter((ripple) => ripple.z > -99).length,
      activeSplashes: this.splashes.length,
      rippleEmissions: this.rippleEmissions,
      footstepRipples: this.footstepRipples,
      dripRipples: this.dripRipples,
      landingRipples: this.landingRipples,
      basinCenters: this.puddles.map((puddle) => (
        [puddle.center.x, puddle.center.y, puddle.center.z] as const
      )),
      surfaceAlphaRange: [WATER_MINIMUM_ALPHA, WATER_MAXIMUM_ALPHA],
      ...containment,
    };
  }

  private createDefinitions(): PuddleDefinition[] {
    return WATER_BASINS.map((basin) => ({
      basin,
      center: new THREE.Vector3(
        basin.centerX,
        waterSurfaceHeight(basin),
        basin.centerZ,
      ),
      radiusX: basin.radiusX,
      radiusZ: basin.radiusZ,
    }));
  }

  private getContainmentDiagnostics(): {
    readonly minimumInteriorDepth: number;
    readonly minimumRimClearance: number;
  } {
    let minimumInteriorDepth = Number.POSITIVE_INFINITY;
    let minimumRimClearance = Number.POSITIVE_INFINITY;
    for (const puddle of this.puddles) {
      for (let sample = 0; sample < 48; sample += 1) {
        const angle = sample / 48 * Math.PI * 2;
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        const interiorX = puddle.center.x + cosine * puddle.radiusX * 0.84;
        const interiorZ = puddle.center.z + sine * puddle.radiusZ * 0.84;
        minimumInteriorDepth = Math.min(
          minimumInteriorDepth,
          puddle.center.y - floorHeightAt(interiorX, interiorZ),
        );

        const rimX = puddle.center.x + cosine * puddle.radiusX * 1.1;
        const rimZ = puddle.center.z + sine * puddle.radiusZ * 1.1;
        minimumRimClearance = Math.min(
          minimumRimClearance,
          floorHeightAt(rimX, rimZ) - puddle.center.y,
        );
      }
    }
    return { minimumInteriorDepth, minimumRimClearance };
  }

  private findPuddle(x: number, z: number): PuddleDefinition | undefined {
    return this.puddles.find((puddle) => {
      const dx = (x - puddle.center.x) / (puddle.radiusX * 0.9);
      const dz = (z - puddle.center.z) / (puddle.radiusZ * 0.9);
      return dx * dx + dz * dz < 1;
    });
  }

  private createDrops(): void {
    this.puddles.forEach((puddle, puddleIndex) => {
      const count = puddleIndex % 2 === 0 ? 3 : 2;
      for (let index = 0; index < count; index += 1) {
        const angle = this.random.range(0, Math.PI * 2);
        const radius = this.random.range(0.1, 0.68);
        const impact = new THREE.Vector3(
          puddle.center.x + Math.cos(angle) * puddle.radiusX * radius,
          puddle.center.y,
          puddle.center.z + Math.sin(angle) * puddle.radiusZ * radius,
        );
        const top = Math.min(caveCeiling(puddle.center.z) - 0.45, this.random.range(3.2, 6.5));
        this.drops.push({
          position: new THREE.Vector3(impact.x, top, impact.z),
          impact,
          top,
          velocity: 0,
          delay: this.random.range(0, 5.5),
        });
      }
    });
  }

  private createDropMesh(): THREE.InstancedMesh {
    const geometry = new THREE.SphereGeometry(0.022, 5, 7);
    geometry.scale(0.72, 2.7, 0.72);
    const material = new THREE.MeshBasicMaterial({ color: 0xb9e8de, transparent: true, opacity: 0.74 });
    const mesh = new THREE.InstancedMesh(geometry, material, this.drops.length);
    mesh.name = 'Falling water drops';
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    return mesh;
  }

  private updateDrops(delta: number, time: number): void {
    this.drops.forEach((drop, index) => {
      if (drop.delay > 0) {
        drop.delay -= delta;
        this.dropMesh.setMatrixAt(index, this.hiddenDropMatrix);
        return;
      }
      drop.velocity += 7.8 * delta;
      drop.position.y -= drop.velocity * delta;
      if (drop.position.y <= drop.impact.y) {
        this.dripRipples += 1;
        this.addRipple(drop.impact, time, 0.019);
        this.spawnSplash(drop.impact, 3, 0.28);
        drop.position.y = drop.top;
        drop.velocity = 0;
        drop.delay = this.random.range(1.4, 5.8);
      }
      this.dropMatrix.makeTranslation(drop.position.x, drop.position.y, drop.position.z);
      this.dropMesh.setMatrixAt(index, this.dropMatrix);
    });
    this.dropMesh.instanceMatrix.needsUpdate = true;
  }

  private spawnSplash(origin: THREE.Vector3, count: number, energy: number): void {
    for (let index = 0; index < count && this.splashes.length < 72; index += 1) {
      const angle = this.random.range(0, Math.PI * 2);
      const speed = this.random.range(0.2, energy);
      this.splashes.push({
        position: origin.clone().add(new THREE.Vector3(0, 0.025, 0)),
        velocity: new THREE.Vector3(Math.cos(angle) * speed, this.random.range(0.55, 1.45) * energy, Math.sin(angle) * speed),
        life: this.random.range(0.24, 0.52),
      });
    }
  }

  private updateSplashes(delta: number): void {
    for (let index = this.splashes.length - 1; index >= 0; index -= 1) {
      const splash = this.splashes[index];
      if (!splash) continue;
      splash.life -= delta;
      if (splash.life <= 0) {
        this.splashes.splice(index, 1);
        continue;
      }
      splash.velocity.y -= 4.8 * delta;
      splash.position.addScaledVector(splash.velocity, delta);
    }

    const array = this.splashPositions.array as Float32Array;
    this.splashes.forEach((splash, index) => {
      array[index * 3] = splash.position.x;
      array[index * 3 + 1] = splash.position.y;
      array[index * 3 + 2] = splash.position.z;
    });
    this.splashPositions.needsUpdate = true;
    this.splashPoints.count = this.splashes.length;
  }
}
