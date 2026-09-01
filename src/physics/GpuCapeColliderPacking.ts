import * as THREE from 'three';
import { CAPE } from '../config';
import {
  isWorldRockCollider,
  type CapsuleCollider,
  type WorldCollider,
  type WorldRockCollider,
  type WorldSphereCollider,
} from './colliders';
import {
  getClothBodyClearance,
  getClothBodyDepthRadius,
} from './ClothBodyCollision';
import { getClothWorldClearance } from './ClothWorldCollision';
import { calculateGpuCapeSphereQueryRadius } from './GpuCapeBroadphase';

export const MAX_GPU_BODY_COLLIDERS = 32;
export const MAX_GPU_WORLD_SPHERES = 512;
export const MAX_GPU_WORLD_ROCKS = 16;
export const GPU_ROCK_FACES_PER_COLLIDER = 60;
export const GPU_BODY_BUFFER_STRIDE = 5;
export const GPU_ROCK_BUFFER_STRIDE = 4 + GPU_ROCK_FACES_PER_COLLIDER * 4;

const WORLD_SPHERE_QUERY_RADIUS = calculateGpuCapeSphereQueryRadius(
  CAPE.lengthRange.max,
  CAPE.widthRange.max,
);
const WORLD_ROCK_QUERY_RADIUS = CAPE.lengthRange.max + 2.2;

export interface GpuWorldColliderCandidates {
  readonly spheres: readonly WorldSphereCollider[];
  readonly rocks: readonly WorldRockCollider[];
}

export function packGpuCapeBodyColliders(
  target: Float32Array,
  capeIndex: number,
  colliders: readonly CapsuleCollider[],
  back: THREE.Vector3,
): void {
  if (colliders.length > MAX_GPU_BODY_COLLIDERS) {
    throw new RangeError(
      `GPU cape supports at most ${MAX_GPU_BODY_COLLIDERS} body colliders.`,
    );
  }
  colliders.forEach((collider, index) => {
    const offset = (
      capeIndex * MAX_GPU_BODY_COLLIDERS * GPU_BODY_BUFFER_STRIDE
      + index * GPU_BODY_BUFFER_STRIDE
    ) * 4;
    const axis = collider.end.clone().sub(collider.start);
    const axisDepthProjection = axis.dot(back);
    const lateralAxis = axis.clone().addScaledVector(back, -axisDepthProjection);
    const lateralRadius = collider.radius + getClothBodyClearance(collider);
    const depthRadius = getClothBodyDepthRadius(collider);
    // Measure progress along the capsule in the same anisotropic metric used
    // for contact. A lateral-only denominator collapses a boot's mostly-depth
    // axis to zero, reducing its final particle contact to one endpoint.
    const axisMetricLengthSquared = lateralAxis.lengthSq() / (lateralRadius * lateralRadius)
      + axisDepthProjection * axisDepthProjection / (depthRadius * depthRadius);
    const verticalRadius = Math.max(lateralRadius, depthRadius);
    const axisLength = axis.length();
    const faceSampleSpacing = collider.faceSampleSpacing
      ?? Math.max(0.04, lateralRadius * 0.82);
    const faceSegments = axisLength < 0.000_001
      ? 0
      : Math.max(1, Math.ceil(axisLength / faceSampleSpacing));
    const faceStepLength = faceSegments > 0 ? axisLength / faceSegments : 0;
    const faceLateralRadius = Math.hypot(lateralRadius, faceStepLength * 0.5);
    const faceDepthRadius = depthRadius * faceLateralRadius / lateralRadius;
    target[offset] = collider.start.x;
    target[offset + 1] = collider.start.y;
    target[offset + 2] = collider.start.z;
    target[offset + 3] = lateralRadius;
    target[offset + 4] = axis.x;
    target[offset + 5] = axis.y;
    target[offset + 6] = axis.z;
    target[offset + 7] = depthRadius;
    target[offset + 8] = lateralAxis.x;
    target[offset + 9] = lateralAxis.y;
    target[offset + 10] = lateralAxis.z;
    target[offset + 11] = axisMetricLengthSquared;
    if (Math.abs(back.y) < 0.000_1) {
      target[offset + 12] = Math.min(collider.start.y, collider.end.y) - verticalRadius;
      target[offset + 13] = Math.max(collider.start.y, collider.end.y) + verticalRadius;
    } else {
      target[offset + 12] = -1_000_000;
      target[offset + 13] = 1_000_000;
    }
    target[offset + 14] = faceSegments;
    target[offset + 15] = faceLateralRadius;
    target[offset + 16] = faceDepthRadius;
  });
}

export function selectGpuCapeWorldColliderCandidates(
  center: THREE.Vector3,
  colliders: readonly WorldCollider[],
): GpuWorldColliderCandidates {
  const nearby = colliders.filter((collider) => {
    const queryRadius = isWorldRockCollider(collider)
      ? WORLD_ROCK_QUERY_RADIUS
      : WORLD_SPHERE_QUERY_RADIUS;
    const range = queryRadius + collider.radius;
    return collider.center.distanceToSquared(center) <= range * range;
  });
  const spheres = nearby.filter(
    (collider): collider is WorldSphereCollider => !isWorldRockCollider(collider),
  );
  const rocks = nearby.filter(isWorldRockCollider);
  if (spheres.length > MAX_GPU_WORLD_SPHERES) {
    throw new RangeError(
      `Nearby GPU cape sphere count ${spheres.length} exceeds ${MAX_GPU_WORLD_SPHERES}.`,
    );
  }
  if (rocks.length > MAX_GPU_WORLD_ROCKS) {
    throw new RangeError(
      `Nearby GPU cape rock count ${rocks.length} exceeds ${MAX_GPU_WORLD_ROCKS}.`,
    );
  }
  return { spheres, rocks };
}

export function packGpuCapeWorldColliders(
  sphereTarget: Float32Array,
  rockTarget: Float32Array,
  capeIndex: number,
  candidates: GpuWorldColliderCandidates,
): void {
  candidates.spheres.forEach((collider, index) => {
    const offset = (capeIndex * MAX_GPU_WORLD_SPHERES + index) * 4;
    sphereTarget[offset] = collider.center.x;
    sphereTarget[offset + 1] = collider.center.y;
    sphereTarget[offset + 2] = collider.center.z;
    sphereTarget[offset + 3] = collider.radius + getClothWorldClearance(collider);
  });

  candidates.rocks.forEach((collider, rockIndex) => {
    if (collider.faces.length !== GPU_ROCK_FACES_PER_COLLIDER) {
      throw new RangeError(
        `GPU rock ${rockIndex} has ${collider.faces.length} faces; expected ${GPU_ROCK_FACES_PER_COLLIDER}.`,
      );
    }
    const rockOffset = (
      capeIndex * MAX_GPU_WORLD_ROCKS * GPU_ROCK_BUFFER_STRIDE
      + rockIndex * GPU_ROCK_BUFFER_STRIDE
    ) * 4;
    rockTarget[rockOffset] = collider.center.x;
    rockTarget[rockOffset + 1] = collider.center.y;
    rockTarget[rockOffset + 2] = collider.center.z;
    rockTarget[rockOffset + 3] = collider.walkable ? 0.015 : 0.03;
    rockTarget[rockOffset + 4] = collider.bounds.min.x;
    rockTarget[rockOffset + 5] = collider.bounds.min.y;
    rockTarget[rockOffset + 6] = collider.bounds.min.z;
    rockTarget[rockOffset + 7] = collider.walkable
      ? THREE.MathUtils.lerp(collider.bounds.min.y, collider.bounds.max.y, 0.72)
      : -1_000_000;
    rockTarget[rockOffset + 8] = collider.bounds.max.x;
    rockTarget[rockOffset + 9] = collider.bounds.max.y;
    rockTarget[rockOffset + 10] = collider.bounds.max.z;
    rockTarget[rockOffset + 11] = collider.walkable ? 1 : 0;
    collider.faces.forEach((face, faceIndex) => {
      const offset = rockOffset + (4 + faceIndex * 4) * 4;
      rockTarget[offset] = face.triangle.a.x;
      rockTarget[offset + 1] = face.triangle.a.y;
      rockTarget[offset + 2] = face.triangle.a.z;
      rockTarget[offset + 4] = face.triangle.b.x;
      rockTarget[offset + 5] = face.triangle.b.y;
      rockTarget[offset + 6] = face.triangle.b.z;
      rockTarget[offset + 8] = face.triangle.c.x;
      rockTarget[offset + 9] = face.triangle.c.y;
      rockTarget[offset + 10] = face.triangle.c.z;
      rockTarget[offset + 12] = face.normal.x;
      rockTarget[offset + 13] = face.normal.y;
      rockTarget[offset + 14] = face.normal.z;
      rockTarget[offset + 15] = face.planeConstant;
    });
  });
}
