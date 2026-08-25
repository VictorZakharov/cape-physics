import * as THREE from 'three';
import { SeededRandom } from '../utils/random';

export const SPELEOTHEM_RINGS = 9;
export const SPELEOTHEM_SIDES = 10;

export function createSpeleothemGeometry(seed: number): THREE.BufferGeometry {
  const random = new SeededRandom(seed);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const morphology = Math.abs(seed) % 3;
  const sideVariation = Array.from(
    { length: SPELEOTHEM_SIDES },
    () => random.range(-0.11, 0.11),
  );
  const phase = random.range(0, Math.PI * 2);
  const secondaryPhase = random.range(0, Math.PI * 2);
  const bendX = random.range(0.1, 0.22);
  const bendZ = random.range(0.08, 0.19);
  const ellipticity = morphology === 1
    ? random.range(1.4, 1.85)
    : random.range(0.76, 1.28);
  const height = 1.6;

  const centerAt = (progress: number): [number, number] => [
    (Math.sin(progress * 3.4 + phase) - Math.sin(phase)) * bendX * progress
      + Math.sin(progress * 8.7 + secondaryPhase) * 0.018 * progress,
    (Math.sin(progress * 2.8 + secondaryPhase) - Math.sin(secondaryPhase)) * bendZ * progress
      + Math.cos(progress * 7.3 + phase) * 0.016 * progress,
  ];

  for (let ring = 0; ring < SPELEOTHEM_RINGS; ring += 1) {
    const progress = ring / SPELEOTHEM_RINGS;
    const taperExponent = morphology === 2 ? 0.58 : 0.74;
    const taper = Math.pow(1 - progress, taperExponent);
    const firstBulge = Math.exp(-Math.pow((progress - 0.3) / 0.12, 2)) * (morphology === 0 ? 0.26 : 0.13);
    const secondBulge = Math.exp(-Math.pow((progress - 0.58) / 0.09, 2)) * (morphology === 2 ? 0.22 : 0.1);
    const neck = Math.exp(-Math.pow((progress - 0.46) / 0.075, 2)) * 0.1;
    const depositionBands = 1
      + Math.sin(progress * 17 + phase) * 0.105
      + Math.sin(progress * 31 + secondaryPhase) * 0.045
      + random.range(-0.055, 0.055);
    const baseFlare = 1 + Math.exp(-progress * 8) * 0.3;
    const radius = Math.max(
      0.025,
      0.32 * taper * depositionBands * baseFlare * (1 + firstBulge + secondBulge - neck),
    );
    const [centerX, centerZ] = centerAt(progress);
    const twist = progress * random.range(-0.45, 0.45);

    for (let side = 0; side <= SPELEOTHEM_SIDES; side += 1) {
      const wrappedSide = side % SPELEOTHEM_SIDES;
      const angle = side / SPELEOTHEM_SIDES * Math.PI * 2 + twist;
      const irregularity = 1
        + (sideVariation[wrappedSide] ?? 0)
        + Math.sin(angle * 3 + progress * 9 + phase) * 0.035;
      positions.push(
        centerX + Math.cos(angle) * radius * ellipticity * irregularity,
        -height * progress,
        centerZ + Math.sin(angle) * radius / ellipticity * irregularity,
      );
      uvs.push(side / SPELEOTHEM_SIDES, progress);
    }
  }

  const stride = SPELEOTHEM_SIDES + 1;
  for (let ring = 0; ring < SPELEOTHEM_RINGS - 1; ring += 1) {
    for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
      const topLeft = ring * stride + side;
      const lowerLeft = topLeft + stride;
      indices.push(topLeft, lowerLeft, topLeft + 1, lowerLeft, lowerLeft + 1, topLeft + 1);
    }
  }

  const [tipX, tipZ] = centerAt(1);
  const tipIndex = positions.length / 3;
  positions.push(tipX, -height, tipZ);
  uvs.push(0.5, 1);
  const finalRing = (SPELEOTHEM_RINGS - 1) * stride;
  for (let side = 0; side < SPELEOTHEM_SIDES; side += 1) {
    indices.push(finalRing + side, tipIndex, finalRing + side + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
