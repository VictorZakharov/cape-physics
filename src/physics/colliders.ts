import type * as THREE from 'three';

export interface CapsuleCollider {
  readonly start: THREE.Vector3;
  readonly end: THREE.Vector3;
  readonly radius: number;
  readonly name: string;
}

export type WorldColliderKind = 'formation' | 'rock' | 'torch' | 'mineral';

export interface WorldSphereCollider {
  readonly center: THREE.Vector3;
  readonly radius: number;
  readonly walkable: boolean;
  readonly kind: WorldColliderKind;
}
