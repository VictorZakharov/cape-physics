import * as THREE from 'three';
import type { WorldSphereCollider } from '../physics/colliders';

const SPELEOTHEM_HEIGHT = 1.6;
const FORMATION_SAMPLES = [0.12, 0.34, 0.58, 0.8, 0.96] as const;

export class CaveColliderBuilder {
  public readonly colliders: WorldSphereCollider[] = [];
  private readonly localCenter = new THREE.Vector3();
  private readonly worldCenter = new THREE.Vector3();

  public addSpeleothem(
    position: THREE.Vector3,
    quaternion: THREE.Quaternion,
    scale: THREE.Vector3,
    pointsUp: boolean,
  ): void {
    const maximumRadialScale = Math.max(scale.x, scale.z);
    for (const progress of FORMATION_SAMPLES) {
      const direction = pointsUp ? 1 : -1;
      this.localCenter.set(0, direction * SPELEOTHEM_HEIGHT * progress, 0)
        .multiply(scale)
        .applyQuaternion(quaternion);
      this.worldCenter.copy(position).add(this.localCenter);
      const taper = Math.pow(1 - progress, 0.72);
      this.colliders.push({
        center: this.worldCenter.clone(),
        radius: Math.max(0.055, 0.43 * maximumRadialScale * taper),
        walkable: false,
        kind: 'formation',
      });
    }
  }

  public addCollar(position: THREE.Vector3, scale: THREE.Vector3): void {
    this.colliders.push({
      center: position.clone(),
      radius: 0.38 * Math.max(scale.x, scale.z),
      walkable: false,
      kind: 'formation',
    });
  }

  public addRock(position: THREE.Vector3, scale: THREE.Vector3): void {
    const verticalRadius = 0.42 * scale.y;
    const radialRadius = 0.42 * Math.min(scale.x, scale.z);
    this.colliders.push({
      center: position.clone(),
      radius: THREE.MathUtils.clamp(Math.max(verticalRadius, radialRadius * 0.78), 0.085, 0.34),
      walkable: true,
      kind: 'rock',
    });
  }
}
