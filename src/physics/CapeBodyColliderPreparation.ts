import * as THREE from 'three';
import type { CapsuleCollider } from './colliders';
import { getClothBodyClearance, getClothBodyDepthRadius } from './ClothBodyCollision';
export interface PreparedBodyCollider {
  startX: number;
  startY: number;
  startZ: number;
  axisX: number;
  axisY: number;
  axisZ: number;
  lateralAxisX: number;
  lateralAxisY: number;
  lateralAxisZ: number;
  lateralLengthSquared: number;
  lateralRadius: number;
  depthRadius: number;
  minimumY: number;
  maximumY: number;
}

export function prepareBodyColliders(
  colliders: readonly CapsuleCollider[],
  back: THREE.Vector3,
  preparedBodyColliders: PreparedBodyCollider[],
): void {
  preparedBodyColliders.length = colliders.length;
  for (let index = 0; index < colliders.length; index += 1) {
    const collider = colliders[index];
    if (!collider) continue;
    const prepared = preparedBodyColliders[index] ?? {
      startX: 0,
      startY: 0,
      startZ: 0,
      axisX: 0,
      axisY: 0,
      axisZ: 0,
      lateralAxisX: 0,
      lateralAxisY: 0,
      lateralAxisZ: 0,
      lateralLengthSquared: 0,
      lateralRadius: 0,
      depthRadius: 0,
      minimumY: 0,
      maximumY: 0,
    };
    const axisX = collider.end.x - collider.start.x;
    const axisY = collider.end.y - collider.start.y;
    const axisZ = collider.end.z - collider.start.z;
    const axisDepth = axisX * back.x + axisY * back.y + axisZ * back.z;
    const lateralAxisX = axisX - back.x * axisDepth;
    const lateralAxisY = axisY - back.y * axisDepth;
    const lateralAxisZ = axisZ - back.z * axisDepth;
    const lateralRadius = collider.radius + getClothBodyClearance(collider);
    const depthRadius = getClothBodyDepthRadius(collider);
    const verticalRadius = Math.max(lateralRadius, depthRadius);
    prepared.startX = collider.start.x;
    prepared.startY = collider.start.y;
    prepared.startZ = collider.start.z;
    prepared.axisX = axisX;
    prepared.axisY = axisY;
    prepared.axisZ = axisZ;
    prepared.lateralAxisX = lateralAxisX;
    prepared.lateralAxisY = lateralAxisY;
    prepared.lateralAxisZ = lateralAxisZ;
    prepared.lateralLengthSquared = lateralAxisX * lateralAxisX
      + lateralAxisY * lateralAxisY
      + lateralAxisZ * lateralAxisZ;
    prepared.lateralRadius = lateralRadius;
    prepared.depthRadius = depthRadius;
    if (Math.abs(back.y) < 0.000_1) {
      prepared.minimumY = Math.min(collider.start.y, collider.end.y) - verticalRadius;
      prepared.maximumY = Math.max(collider.start.y, collider.end.y) + verticalRadius;
    } else {
      prepared.minimumY = Number.NEGATIVE_INFINITY;
      prepared.maximumY = Number.POSITIVE_INFINITY;
    }
    preparedBodyColliders[index] = prepared;
  }
}

