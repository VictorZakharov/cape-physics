import { CaveShellSampler } from './CaveShellSampler';

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

const caveShellSampler = new CaveShellSampler({
  centerX: caveCenterX,
  halfWidth: caveHalfWidth,
  ceiling: caveCeiling,
});

export function caveGroundHeightAt(x: number, z: number): number {
  return Math.max(floorHeightAt(x, z), caveShellSampler.getLowerHeight(x, z) + 0.008);
}

export function caveInteriorHalfWidthAtHeight(y: number, z: number, clearance = 0): number {
  const ceiling = caveCeiling(z);
  const centerY = ceiling * 0.5 - 0.25;
  const verticalRadius = ceiling * 0.5 + 0.45;
  const normalizedY = (y - centerY) / verticalRadius;
  const section = Math.sqrt(Math.max(0.015, 1 - normalizedY * normalizedY));
  return Math.max(0.08, caveHalfWidth(z) * section - clearance - 0.16);
}
