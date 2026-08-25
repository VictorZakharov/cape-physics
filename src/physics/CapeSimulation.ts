import * as THREE from 'three';
import { CAPE } from '../config';
import { createCapeFabricTextures } from '../graphics/proceduralTextures';
import type { BodySphere, CapeAnchors } from '../player/Character';
import { floorHeightAt } from '../world/caveProfile';

interface DistanceConstraint {
  readonly first: number;
  readonly second: number;
  readonly restLength: number;
  readonly stiffness: number;
  readonly structural: boolean;
}

const BODY_CLEARANCE = 0.018;

export class CapeSimulation {
  public readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  private readonly positions: THREE.Vector3[] = [];
  private readonly previous: THREE.Vector3[] = [];
  private readonly inverseMass: Float32Array;
  private readonly constraints: DistanceConstraint[] = [];
  private readonly positionAttribute: THREE.BufferAttribute;
  private readonly velocity = new THREE.Vector3();
  private readonly airflow = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly tangentAcross = new THREE.Vector3();
  private readonly tangentDown = new THREE.Vector3();
  private readonly correction = new THREE.Vector3();
  private readonly delta = new THREE.Vector3();
  private readonly anchorTarget = new THREE.Vector3();
  private readonly anchorCenter = new THREE.Vector3();
  private readonly previousAnchorCenter = new THREE.Vector3();
  private initializedAnchorCenter = false;

  public constructor(initialAnchors: CapeAnchors) {
    const particleCount = CAPE.columns * CAPE.rows;
    this.inverseMass = new Float32Array(particleCount);
    this.initializeParticles(initialAnchors);
    this.createConstraints();
    const geometry = this.createGeometry();
    this.positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;

    const textures = createCapeFabricTextures();
    textures.color.repeat.set(1, 1);
    textures.normal.repeat.set(1, 1);
    textures.roughness.repeat.set(1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      map: textures.color,
      normalMap: textures.normal,
      normalScale: new THREE.Vector2(0.48, 0.48),
      roughnessMap: textures.roughness,
      roughness: 0.78,
      metalness: 0.01,
      sheen: 0.92,
      sheenColor: new THREE.Color(0x6f0713),
      sheenRoughness: 0.72,
      clearcoat: 0.04,
      side: THREE.DoubleSide,
    });
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        float capeSideTrim = 1.0 - smoothstep(0.018, 0.052, min(vMapUv.x, 1.0 - vMapUv.x));
        float capeHemTrim = 1.0 - smoothstep(0.018, 0.052, vMapUv.y);
        float capeTrim = max(capeSideTrim, capeHemTrim);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.34, 0.12, 0.035), capeTrim * 0.72);`,
      );
    };
    material.customProgramCacheKey = () => 'cape-fabric-trim-v1';
    material.name = 'Woven crimson cape';
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = 'PBD cape';
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
  }

  public step(
    deltaTime: number,
    anchors: CapeAnchors,
    bodySpheres: readonly BodySphere[],
    characterVelocity: THREE.Vector3,
    time: number,
  ): void {
    this.pinAnchors(anchors);
    this.airflow.set(
      Math.sin(time * 0.47) * 0.38 + Math.sin(time * 1.91) * 0.16,
      0.08 + Math.sin(time * 0.71) * 0.05,
      0.62 + Math.cos(time * 0.31) * 0.24,
    ).addScaledVector(characterVelocity, -1.38);

    const deltaSquared = deltaTime * deltaTime;
    for (let row = 1; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        const index = this.index(column, row);
        const position = this.positions[index];
        const previous = this.previous[index];
        if (!position || !previous) continue;

        this.velocity.copy(position).sub(previous).multiplyScalar(0.988);
        previous.copy(position);
        this.estimateNormal(column, row);
        const pressure = this.airflow.dot(this.normal);
        const turbulence = Math.sin(time * 4.3 + row * 0.83 + column * 1.71) * 0.42;
        position.add(this.velocity);
        position.y -= 9.81 * deltaSquared;
        position.addScaledVector(this.normal, pressure * Math.abs(pressure) * 0.026 * deltaSquared);
        position.addScaledVector(this.airflow, (0.048 + turbulence * 0.011) * deltaSquared);
      }
    }

    for (let iteration = 0; iteration < CAPE.solverIterations; iteration += 1) {
      for (const constraint of this.constraints) this.solveConstraint(constraint);
      this.pinAnchors(anchors);
      this.solveBodyCollisions(bodySpheres, anchors.back);
      this.solveFloorCollision();
    }

    this.guardAgainstInvalidState(anchors);
  }

  public syncGeometry(): void {
    const array = this.positionAttribute.array as Float32Array;
    this.positions.forEach((position, index) => {
      array[index * 3] = position.x;
      array[index * 3 + 1] = position.y;
      array[index * 3 + 2] = position.z;
    });
    this.positionAttribute.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
    const normalAttribute = this.mesh.geometry.getAttribute('normal');
    if (normalAttribute) normalAttribute.needsUpdate = true;
  }

  public getParticlePosition(column: number, row: number): THREE.Vector3 {
    const position = this.positions[this.index(column, row)];
    if (!position) throw new RangeError('Cape particle index is outside the simulation grid.');
    return position.clone();
  }

  public getMaximumStructuralError(): number {
    let maximum = 0;
    for (const constraint of this.constraints) {
      if (!constraint.structural) continue;
      const first = this.positions[constraint.first];
      const second = this.positions[constraint.second];
      if (!first || !second) continue;
      maximum = Math.max(maximum, Math.abs(first.distanceTo(second) - constraint.restLength));
    }
    return maximum;
  }

  public getMaximumBodyPenetration(
    bodySpheres: readonly BodySphere[],
    back: THREE.Vector3,
  ): number {
    let maximum = 0;
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      if (!position) continue;
      for (const sphere of bodySpheres) {
        this.delta.copy(position).sub(sphere.center);
        const depth = this.delta.dot(back);
        const lateralSquared = Math.max(0, this.delta.lengthSq() - depth * depth);
        const radius = sphere.radius + BODY_CLEARANCE;
        if (lateralSquared >= radius * radius) continue;
        const requiredDepth = Math.sqrt(radius * radius - lateralSquared);
        maximum = Math.max(maximum, requiredDepth - depth);
      }
    }
    return Math.max(0, maximum);
  }

  private initializeParticles(anchors: CapeAnchors): void {
    const anchorWidth = anchors.right.distanceTo(anchors.left);
    const right = anchors.right.clone().sub(anchors.left).normalize();
    const center = anchors.left.clone().add(anchors.right).multiplyScalar(0.5);
    for (let row = 0; row < CAPE.rows; row += 1) {
      const down = row / (CAPE.rows - 1);
      const flare = down * down * (3 - 2 * down);
      const width = THREE.MathUtils.lerp(anchorWidth, CAPE.width * 1.16, flare);
      for (let column = 0; column < CAPE.columns; column += 1) {
        const across = column / (CAPE.columns - 1) - 0.5;
        const position = center.clone()
          .addScaledVector(right, across * width)
          .addScaledVector(anchors.back, 0.035 + down * 0.26)
          .add(new THREE.Vector3(0, -down * CAPE.length * (1 - Math.abs(across) * 0.085), 0));
        if (row === 0) position.lerpVectors(anchors.left, anchors.right, column / (CAPE.columns - 1));
        this.positions.push(position);
        this.previous.push(position.clone());
        this.inverseMass[this.index(column, row)] = row === 0 ? 0 : 1;
      }
    }
  }

  private createConstraints(): void {
    for (let row = 0; row < CAPE.rows; row += 1) {
      for (let column = 0; column < CAPE.columns; column += 1) {
        if (column + 1 < CAPE.columns) this.addConstraint(column, row, column + 1, row, 0.93, true);
        if (row + 1 < CAPE.rows) this.addConstraint(column, row, column, row + 1, 0.96, true);
        if (column + 1 < CAPE.columns && row + 1 < CAPE.rows) {
          this.addConstraint(column, row, column + 1, row + 1, 0.78, false);
          this.addConstraint(column + 1, row, column, row + 1, 0.78, false);
        }
        if (column + 2 < CAPE.columns) this.addConstraint(column, row, column + 2, row, 0.46, false);
        if (row + 2 < CAPE.rows) this.addConstraint(column, row, column, row + 2, 0.52, false);
      }
    }
  }

  private addConstraint(
    firstColumn: number,
    firstRow: number,
    secondColumn: number,
    secondRow: number,
    stiffness: number,
    structural: boolean,
  ): void {
    const first = this.index(firstColumn, firstRow);
    const second = this.index(secondColumn, secondRow);
    const firstPosition = this.positions[first];
    const secondPosition = this.positions[second];
    if (!firstPosition || !secondPosition) return;
    this.constraints.push({
      first,
      second,
      restLength: firstPosition.distanceTo(secondPosition),
      stiffness,
      structural,
    });
  }

  private createGeometry(): THREE.BufferGeometry {
    const positionData = new Float32Array(this.positions.length * 3);
    const uvData = new Float32Array(this.positions.length * 2);
    const indices: number[] = [];
    this.positions.forEach((position, index) => {
      position.toArray(positionData, index * 3);
      const column = index % CAPE.columns;
      const row = Math.floor(index / CAPE.columns);
      uvData[index * 2] = column / (CAPE.columns - 1);
      uvData[index * 2 + 1] = 1 - row / (CAPE.rows - 1);
    });
    for (let row = 0; row < CAPE.rows - 1; row += 1) {
      for (let column = 0; column < CAPE.columns - 1; column += 1) {
        const topLeft = this.index(column, row);
        const bottomLeft = this.index(column, row + 1);
        indices.push(topLeft, bottomLeft, topLeft + 1, bottomLeft, bottomLeft + 1, topLeft + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    const positions = new THREE.BufferAttribute(positionData, 3);
    positions.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', positions);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvData, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  private pinAnchors(anchors: CapeAnchors): void {
    this.anchorCenter.copy(anchors.left).add(anchors.right).multiplyScalar(0.5);
    if (!this.initializedAnchorCenter) {
      this.previousAnchorCenter.copy(this.anchorCenter);
      this.initializedAnchorCenter = true;
    }
    for (let column = 0; column < CAPE.columns; column += 1) {
      const index = this.index(column, 0);
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      this.anchorTarget.lerpVectors(anchors.left, anchors.right, column / (CAPE.columns - 1));
      position.copy(this.anchorTarget);
      previous.copy(this.anchorTarget);
    }
    this.previousAnchorCenter.copy(this.anchorCenter);
  }

  private solveConstraint(constraint: DistanceConstraint): void {
    const first = this.positions[constraint.first];
    const second = this.positions[constraint.second];
    if (!first || !second) return;
    this.delta.copy(second).sub(first);
    const length = this.delta.length();
    if (length < 0.000_001) return;
    const firstWeight = this.inverseMass[constraint.first] ?? 0;
    const secondWeight = this.inverseMass[constraint.second] ?? 0;
    const totalWeight = firstWeight + secondWeight;
    if (totalWeight === 0) return;
    this.correction.copy(this.delta).multiplyScalar(((length - constraint.restLength) / length) * constraint.stiffness);
    if (firstWeight > 0) first.addScaledVector(this.correction, firstWeight / totalWeight);
    if (secondWeight > 0) second.addScaledVector(this.correction, -secondWeight / totalWeight);
  }

  private estimateNormal(column: number, row: number): void {
    const left = this.positions[this.index(Math.max(0, column - 1), row)];
    const right = this.positions[this.index(Math.min(CAPE.columns - 1, column + 1), row)];
    const up = this.positions[this.index(column, Math.max(0, row - 1))];
    const down = this.positions[this.index(column, Math.min(CAPE.rows - 1, row + 1))];
    if (!left || !right || !up || !down) {
      this.normal.set(0, 0, 1);
      return;
    }
    this.tangentAcross.copy(right).sub(left);
    this.tangentDown.copy(down).sub(up);
    this.normal.crossVectors(this.tangentAcross, this.tangentDown).normalize();
  }

  private solveBodyCollisions(spheres: readonly BodySphere[], back: THREE.Vector3): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      const previous = this.previous[index];
      if (!position || !previous) continue;
      for (const sphere of spheres) {
        this.delta.copy(position).sub(sphere.center);
        const depth = this.delta.dot(back);
        const lateralSquared = Math.max(0, this.delta.lengthSq() - depth * depth);
        const radius = sphere.radius + BODY_CLEARANCE;
        if (lateralSquared >= radius * radius) continue;
        const requiredDepth = Math.sqrt(radius * radius - lateralSquared);
        const penetration = requiredDepth - depth;
        if (penetration <= 0) continue;

        // This one-sided posterior projection cannot select the body's front
        // hemisphere after a fast reversal. Its curved depth requirement makes
        // neighboring particles naturally wrap and slide around the silhouette.
        position.addScaledVector(back, penetration);
        previous.addScaledVector(back, penetration);
      }
    }
  }

  private solveFloorCollision(): void {
    for (let index = CAPE.columns; index < this.positions.length; index += 1) {
      const position = this.positions[index];
      if (!position) continue;
      const floor = floorHeightAt(position.x, position.z) + 0.035;
      if (position.y < floor) position.y = floor;
    }
  }

  private guardAgainstInvalidState(anchors: CapeAnchors): void {
    const center = this.anchorCenter;
    const invalid = this.positions.some((position) => !Number.isFinite(position.lengthSq()) || position.distanceToSquared(center) > 25);
    if (!invalid) return;
    this.positions.length = 0;
    this.previous.length = 0;
    this.initializeParticles(anchors);
  }

  private index(column: number, row: number): number {
    return row * CAPE.columns + column;
  }
}
