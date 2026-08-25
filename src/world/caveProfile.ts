import * as THREE from 'three';
import { CAVE, PLAYER } from '../config';

export function caveCenterX(z: number): number {
  return Math.sin((z - 10) * 0.055) * 2.05 + Math.sin((z + 5) * 0.137) * 0.38;
}

export function caveHalfWidth(z: number): number {
  return 4.7 + Math.sin(z * 0.093 + 1.2) * 0.62 + Math.sin(z * 0.031) * 0.34;
}

export function caveCeiling(z: number): number {
  return 7.3 + Math.sin(z * 0.071 + 0.7) * 0.58 + Math.sin(z * 0.21) * 0.18;
}

export function floorHeightAt(x: number, z: number): number {
  const center = caveCenterX(z);
  const edge = Math.abs(x - center) / caveHalfWidth(z);
  const base = Math.sin(x * 0.71 + z * 0.16) * 0.018 + Math.sin(z * 0.47) * 0.014;
  return base + Math.max(0, edge - 0.68) ** 2 * 0.34;
}

export function constrainToCave(position: THREE.Vector3): void {
  position.z = THREE.MathUtils.clamp(position.z, CAVE.endZ + 2.2, CAVE.startZ - 2.1);
  const center = caveCenterX(position.z);
  const halfWidth = caveHalfWidth(position.z) - PLAYER.radius - 0.42;
  position.x = THREE.MathUtils.clamp(position.x, center - halfWidth, center + halfWidth);
  position.y = floorHeightAt(position.x, position.z);
}
