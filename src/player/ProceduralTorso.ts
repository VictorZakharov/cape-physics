import * as THREE from 'three';

interface TorsoRing {
  readonly y: number;
  readonly halfWidth: number;
  readonly halfDepth: number;
}

const RADIAL_SEGMENTS = 16;

export const TORSO_PROFILE: readonly TorsoRing[] = [
  { y: 0.95, halfWidth: 0.18, halfDepth: 0.13 },
  { y: 1.12, halfWidth: 0.19, halfDepth: 0.137 },
  { y: 1.34, halfWidth: 0.205, halfDepth: 0.145 },
  { y: 1.4, halfWidth: 0.218, halfDepth: 0.13 },
  { y: 1.46, halfWidth: 0.165, halfDepth: 0.105 },
  { y: 1.5, halfWidth: 0.085, halfDepth: 0.065 },
] as const;

export function createProceduralTorsoGeometry(): THREE.BufferGeometry {
  const verticesPerRing = RADIAL_SEGMENTS + 1;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (const ring of TORSO_PROFILE) {
    for (let segment = 0; segment <= RADIAL_SEGMENTS; segment += 1) {
      const progress = segment / RADIAL_SEGMENTS;
      const angle = progress * Math.PI * 2;
      positions.push(
        Math.cos(angle) * ring.halfWidth,
        ring.y,
        Math.sin(angle) * ring.halfDepth,
      );
      uvs.push(progress, (ring.y - TORSO_PROFILE[0]!.y) / torsoHeight());
    }
  }

  for (let ring = 0; ring < TORSO_PROFILE.length - 1; ring += 1) {
    const lowerStart = ring * verticesPerRing;
    const upperStart = (ring + 1) * verticesPerRing;
    for (let segment = 0; segment < RADIAL_SEGMENTS; segment += 1) {
      const lower = lowerStart + segment;
      const upper = upperStart + segment;
      indices.push(
        lower,
        upper,
        lower + 1,
        lower + 1,
        upper,
        upper + 1,
      );
    }
  }

  addCap(positions, uvs, indices, 0, false);
  addCap(positions, uvs, indices, TORSO_PROFILE.length - 1, true);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function getTorsoRearSurfaceZ(x: number, y: number): number | null {
  const ring = getInterpolatedRing(y);
  if (!ring || Math.abs(x) > ring.halfWidth) return null;
  const normalizedX = x / ring.halfWidth;
  return ring.halfDepth * Math.sqrt(Math.max(0, 1 - normalizedX * normalizedX));
}

function addCap(
  positions: number[],
  uvs: number[],
  indices: number[],
  ringIndex: number,
  pointsUp: boolean,
): void {
  const ring = TORSO_PROFILE[ringIndex];
  if (!ring) return;
  const center = positions.length / 3;
  positions.push(0, ring.y, 0);
  uvs.push(0.5, 0.5);
  const ringStart = ringIndex * (RADIAL_SEGMENTS + 1);
  for (let segment = 0; segment < RADIAL_SEGMENTS; segment += 1) {
    if (pointsUp) indices.push(center, ringStart + segment + 1, ringStart + segment);
    else indices.push(center, ringStart + segment, ringStart + segment + 1);
  }
}

function getInterpolatedRing(y: number): TorsoRing | null {
  const first = TORSO_PROFILE[0];
  const last = TORSO_PROFILE.at(-1);
  if (!first || !last || y < first.y || y > last.y) return null;
  for (let index = 0; index < TORSO_PROFILE.length - 1; index += 1) {
    const lower = TORSO_PROFILE[index];
    const upper = TORSO_PROFILE[index + 1];
    if (!lower || !upper || y > upper.y) continue;
    const progress = THREE.MathUtils.inverseLerp(lower.y, upper.y, y);
    return {
      y,
      halfWidth: THREE.MathUtils.lerp(lower.halfWidth, upper.halfWidth, progress),
      halfDepth: THREE.MathUtils.lerp(lower.halfDepth, upper.halfDepth, progress),
    };
  }
  return last;
}

function torsoHeight(): number {
  const first = TORSO_PROFILE[0];
  const last = TORSO_PROFILE.at(-1);
  return first && last ? last.y - first.y : 1;
}
