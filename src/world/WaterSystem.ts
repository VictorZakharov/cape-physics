import * as THREE from 'three';
import { RIPPLE_CAPACITY } from '../config';
import { SeededRandom } from '../utils/random';
import { caveCeiling, caveCenterX, floorHeightAt } from './caveProfile';

interface PuddleDefinition {
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

const waterVertexShader = /* glsl */ `
  #define RIPPLE_COUNT ${RIPPLE_CAPACITY}
  uniform float uTime;
  uniform vec4 uRipples[RIPPLE_COUNT];
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vWave;

  float rippleHeight(vec2 worldPosition) {
    float height = 0.0;
    for (int index = 0; index < RIPPLE_COUNT; index++) {
      vec4 ripple = uRipples[index];
      float age = uTime - ripple.z;
      if (age > 0.0 && age < 4.0) {
        float distanceToImpact = length(worldPosition - ripple.xy);
        float front = 1.0 - smoothstep(age * 2.1 - 0.1, age * 2.1 + 0.2, distanceToImpact);
        float wake = sin(distanceToImpact * 13.0 - age * 13.5);
        float fade = exp(-age * 0.86) * exp(-distanceToImpact * 0.48);
        height += wake * fade * front * ripple.w;
      }
    }
    return height;
  }

  void main() {
    vec4 flatWorld = modelMatrix * vec4(position, 1.0);
    float ambientWave = sin(flatWorld.x * 2.4 + uTime * 0.7) * cos(flatWorld.z * 2.1 - uTime * 0.55) * 0.0025;
    float wave = rippleHeight(flatWorld.xz) + ambientWave;
    vec3 transformed = position;
    transformed.z += wave;
    vec4 world = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = world.xyz;
    vUv = uv;
    vWave = wave;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const waterFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFogColor;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vWave;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  vec2 microGradient(vec2 point) {
    vec2 firstDirection = normalize(vec2(0.83, 0.56));
    vec2 secondDirection = normalize(vec2(-0.42, 0.91));
    vec2 thirdDirection = normalize(vec2(0.97, -0.24));
    float first = cos(dot(point, firstDirection) * 4.1 + uTime * 1.18) * 0.028;
    float second = cos(dot(point, secondDirection) * 7.7 - uTime * 1.62) * 0.017;
    float third = cos(dot(point, thirdDirection) * 13.4 + uTime * 2.05) * 0.008;
    float breakup = mix(0.72, 1.18, valueNoise(point * 1.8 + vec2(uTime * 0.08, -uTime * 0.05)));
    return (firstDirection * first + secondDirection * second + thirdDirection * third) * breakup;
  }

  float distributionGGX(float alpha, float normalDotHalf) {
    float alphaSquared = alpha * alpha;
    float denominator = normalDotHalf * normalDotHalf * (alphaSquared - 1.0) + 1.0;
    return alphaSquared / max(3.14159265 * denominator * denominator, 0.0001);
  }

  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    float angle = atan(centered.y, centered.x);
    float irregularEdge = 0.91 + sin(angle * 5.0 + uTime * 0.08) * 0.035 + sin(angle * 9.0) * 0.025;
    float edgeDistance = length(centered);
    float alphaEdge = 1.0 - smoothstep(irregularEdge - 0.09, irregularEdge, edgeDistance);
    if (alphaEdge < 0.015) discard;

    vec3 macroNormal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
    if (macroNormal.y < 0.0) macroNormal *= -1.0;
    vec2 detailGradient = microGradient(vWorldPosition.xz);
    vec3 normal = normalize(vec3(
      macroNormal.x - detailGradient.x,
      macroNormal.y,
      macroNormal.z - detailGradient.y
    ));
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float viewFacing = clamp(dot(normal, viewDirection), 0.0, 1.0);
    float fresnel = 0.025 + 0.975 * pow(1.0 - viewFacing, 5.0);
    vec3 torchDirection = normalize(vec3(-0.35, 0.72, 0.48));
    vec3 halfDirection = normalize(viewDirection + torchDirection);
    float normalVariance = max(dot(dFdx(normal), dFdx(normal)), dot(dFdy(normal), dFdy(normal)));
    float roughness = clamp(0.11 + normalVariance * 0.38, 0.11, 0.28);
    float specular = distributionGGX(roughness, max(dot(normal, halfDirection), 0.0));
    specular = specular / (1.0 + specular);
    float mineralGlint = pow(max(0.0, sin(vWorldPosition.x * 1.7 + vWorldPosition.z * 0.8)), 16.0);
    float depthTint = smoothstep(0.2, 0.92, edgeDistance);
    vec3 waterBody = mix(uDeepColor, uShallowColor, depthTint * 0.42);
    vec3 caveReflection = mix(vec3(0.035, 0.095, 0.10), vec3(0.22, 0.39, 0.36), normal.y * 0.5 + 0.5);
    vec3 color = mix(waterBody, caveReflection, clamp(0.08 + fresnel * 0.82, 0.0, 0.92));
    color += vec3(1.0, 0.38, 0.075) * specular * max(dot(normal, torchDirection), 0.0) * 1.45;
    color += vec3(0.15, 0.9, 0.76) * mineralGlint * fresnel * 0.16;
    color += abs(vWave) * vec3(0.8, 1.2, 1.1) * 3.4;
    float wetRim = smoothstep(0.73, 0.93, edgeDistance) * (1.0 - smoothstep(0.93, 1.0, edgeDistance));
    color += vec3(0.12, 0.26, 0.23) * wetRim * 0.28;
    float distanceToCamera = length(cameraPosition - vWorldPosition);
    float fogFactor = 1.0 - exp(-0.0032 * distanceToCamera * distanceToCamera);
    color = mix(color, uFogColor, fogFactor);
    gl_FragColor = vec4(color, alphaEdge * mix(0.7, 0.94, fresnel));
  }
`;

export class WaterSystem {
  public readonly group = new THREE.Group();
  private readonly puddles: PuddleDefinition[];
  private readonly ripples = Array.from({ length: RIPPLE_CAPACITY }, () => new THREE.Vector4(0, 0, -100, 0));
  private readonly material: THREE.ShaderMaterial;
  private readonly drops: Drop[] = [];
  private readonly dropMesh: THREE.InstancedMesh;
  private readonly splashes: SplashParticle[] = [];
  private readonly splashPositions: THREE.BufferAttribute;
  private readonly splashPoints: THREE.Points;
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

  public constructor() {
    this.group.name = 'Reactive shallow water';
    this.puddles = this.createDefinitions();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRipples: { value: this.ripples },
        uDeepColor: { value: new THREE.Color(0x07181a) },
        uShallowColor: { value: new THREE.Color(0x365d58) },
        uFogColor: { value: new THREE.Color(0x071012) },
      },
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.material.name = 'Procedural ripple water';

    const geometry = new THREE.PlaneGeometry(2, 2, 72, 52);
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

    const splashGeometry = new THREE.BufferGeometry();
    this.splashPositions = new THREE.Float32BufferAttribute(new Float32Array(72 * 3), 3);
    splashGeometry.setAttribute('position', this.splashPositions);
    splashGeometry.setDrawRange(0, 0);
    this.splashPoints = new THREE.Points(
      splashGeometry,
      new THREE.PointsMaterial({
        color: 0xb9e5dc,
        size: 0.034,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
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
    this.material.uniforms.uTime!.value = time;
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
  } {
    return {
      puddles: this.puddles.length,
      drops: this.drops.length,
      activeRipples: this.ripples.filter((ripple) => ripple.z > -99).length,
      activeSplashes: this.splashes.length,
      rippleEmissions: this.rippleEmissions,
      footstepRipples: this.footstepRipples,
      dripRipples: this.dripRipples,
    };
  }

  private createDefinitions(): PuddleDefinition[] {
    const raw = [
      { z: 6.2, offset: -0.55, rx: 2.35, rz: 1.55 },
      { z: -10.5, offset: 0.92, rx: 1.75, rz: 2.3 },
      { z: -26.5, offset: -0.45, rx: 2.65, rz: 1.72 },
      { z: -48.5, offset: 0.6, rx: 2.15, rz: 2.55 },
      { z: -64.2, offset: -0.65, rx: 1.85, rz: 1.55 },
    ];
    return raw.map(({ z, offset, rx, rz }) => {
      const x = caveCenterX(z) + offset;
      return {
        center: new THREE.Vector3(x, floorHeightAt(x, z) + 0.058, z),
        radiusX: rx,
        radiusZ: rz,
      };
    });
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
    this.splashPoints.geometry.setDrawRange(0, this.splashes.length);
  }
}
