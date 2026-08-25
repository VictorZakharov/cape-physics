import * as THREE from 'three';
import type { WorldSphereCollider } from '../physics/colliders';
import { SPELEOTHEM_RINGS, SPELEOTHEM_SIDES } from './SpeleothemGeometry';

const MAXIMUM_FORMATION_PROXY_SPACING = 0.14;
const FORMATION_PROXY_SKIN = 0.012;
const MAXIMUM_ROCK_PROXY_SPACING = 0.13;
const ROCK_PROXY_SKIN = 0.008;

interface FormationSection {
  readonly center: THREE.Vector3;
  readonly radius: number;
}

export class CaveColliderBuilder {
  public readonly colliders: WorldSphereCollider[] = [];
  private readonly localVertex = new THREE.Vector3();
  private readonly worldVertex = new THREE.Vector3();
  private readonly sampleCenter = new THREE.Vector3();
  private readonly instancePosition = new THREE.Vector3();
  private readonly instanceQuaternion = new THREE.Quaternion();
  private readonly instanceScale = new THREE.Vector3();
  private readonly majorAxis = new THREE.Vector3();

  /**
   * Builds a conservative sphere chain from the rendered cross-sections. This
   * follows curved, elliptical variants and their sharp tip exactly enough for
   * cloth contact instead of assuming every formation is a straight cone.
   */
  public addSpeleothem(geometry: THREE.BufferGeometry, instanceMatrix: THREE.Matrix4): void {
    const positions = geometry.getAttribute('position');
    if (!positions) throw new Error('Speleothem collision geometry has no positions.');

    const sections: FormationSection[] = [];
    const stride = SPELEOTHEM_SIDES + 1;
    for (let ring = 0; ring < SPELEOTHEM_RINGS; ring += 1) {
      const center = new THREE.Vector3();
      for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
        const vertexIndex = ring * stride + side;
        this.localVertex.fromBufferAttribute(positions, vertexIndex);
        center.add(this.localVertex);
      }
      center.multiplyScalar(1 / SPELEOTHEM_SIDES).applyMatrix4(instanceMatrix);

      let radius = 0;
      for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
        const vertexIndex = ring * stride + side;
        this.worldVertex.fromBufferAttribute(positions, vertexIndex).applyMatrix4(instanceMatrix);
        radius = Math.max(radius, this.worldVertex.distanceTo(center));
      }
      sections.push({ center, radius });
    }

    const tipIndex = SPELEOTHEM_RINGS * stride;
    const tip = new THREE.Vector3().fromBufferAttribute(positions, tipIndex).applyMatrix4(instanceMatrix);
    sections.push({ center: tip, radius: 0 });
    this.addFormationSections(sections);
  }

  public addCollar(position: THREE.Vector3, scale: THREE.Vector3): void {
    this.addSphere(position, 0.38 * Math.max(scale.x, scale.z), false, 'formation');
  }

  public addRock(geometry: THREE.BufferGeometry, instanceMatrix: THREE.Matrix4): void {
    if (!geometry.boundingSphere) geometry.computeBoundingSphere();
    const bounds = geometry.boundingSphere;
    if (!bounds) throw new Error('Rock collision geometry has no bounding sphere.');
    instanceMatrix.decompose(this.instancePosition, this.instanceQuaternion, this.instanceScale);
    const axes = [
      { length: Math.abs(this.instanceScale.x), direction: new THREE.Vector3(1, 0, 0) },
      { length: Math.abs(this.instanceScale.y), direction: new THREE.Vector3(0, 1, 0) },
      { length: Math.abs(this.instanceScale.z), direction: new THREE.Vector3(0, 0, 1) },
    ].sort((first, second) => second.length - first.length);
    const major = (axes[0]?.length ?? 1) * bounds.radius;
    const secondary = (axes[1]?.length ?? 1) * bounds.radius;
    this.majorAxis.copy(axes[0]?.direction ?? new THREE.Vector3(1, 0, 0))
      .applyQuaternion(this.instanceQuaternion)
      .normalize();
    this.worldVertex.copy(bounds.center).applyMatrix4(instanceMatrix);
    const halfSegment = Math.max(0, major - secondary);
    const subdivisions = Math.max(1, Math.ceil(halfSegment * 2 / MAXIMUM_ROCK_PROXY_SPACING));
    const halfStep = halfSegment / subdivisions;

    for (let sample = 0; sample <= subdivisions; sample += 1) {
      const offset = THREE.MathUtils.lerp(-halfSegment, halfSegment, sample / subdivisions);
      this.sampleCenter.copy(this.worldVertex).addScaledVector(this.majorAxis, offset);
      this.addSphere(this.sampleCenter, secondary + halfStep + ROCK_PROXY_SKIN, true, 'rock');
    }
  }

  private addFormationSections(sections: readonly FormationSection[]): void {
    for (let sectionIndex = 0; sectionIndex < sections.length - 1; sectionIndex += 1) {
      const start = sections[sectionIndex];
      const end = sections[sectionIndex + 1];
      if (!start || !end) continue;
      const sectionLength = start.center.distanceTo(end.center);
      const subdivisions = Math.max(1, Math.ceil(sectionLength / MAXIMUM_FORMATION_PROXY_SPACING));
      const halfStepLength = sectionLength / subdivisions * 0.5;
      const halfRadiusStep = Math.abs(end.radius - start.radius) / subdivisions * 0.5;
      const coveragePadding = Math.hypot(halfStepLength, halfRadiusStep) + FORMATION_PROXY_SKIN;
      const firstSample = sectionIndex === 0 ? 0 : 1;

      for (let sample = firstSample; sample <= subdivisions; sample += 1) {
        const progress = sample / subdivisions;
        this.sampleCenter.lerpVectors(start.center, end.center, progress);
        this.addSphere(
          this.sampleCenter,
          THREE.MathUtils.lerp(start.radius, end.radius, progress) + coveragePadding,
          false,
          'formation',
        );
      }
    }
  }

  private addSphere(
    center: THREE.Vector3,
    radius: number,
    walkable: boolean,
    kind: WorldSphereCollider['kind'],
  ): void {
    this.colliders.push({ center: center.clone(), radius, walkable, kind });
  }
}
