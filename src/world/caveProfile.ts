import {
  CaveShellSampler,
  type CaveHorizontalBounds,
} from './CaveShellSampler';
import { smoothstep } from '../utils/math';

export interface WaterBasinProfile {
  readonly centerX: number;
  readonly centerZ: number;
  readonly radiusX: number;
  readonly radiusZ: number;
  readonly depth: number;
  readonly waterDepth: number;
}

export function caveCenterX(z: number): number {
  return Math.sin((z - 10) * 0.055) * 2.05 + Math.sin((z + 5) * 0.137) * 0.38;
}

export function caveHalfWidth(z: number): number {
  return 4.7 + Math.sin(z * 0.093 + 1.2) * 0.62 + Math.sin(z * 0.031) * 0.34;
}

export function caveCeiling(z: number): number {
  return 7.3 + Math.sin(z * 0.071 + 0.7) * 0.58 + Math.sin(z * 0.21) * 0.18;
}

const WATER_BASIN_SPECS = [
  { centerZ: 6.2, offset: -0.55, radiusX: 2.35, radiusZ: 1.55 },
  { centerZ: -10.5, offset: 0.92, radiusX: 1.75, radiusZ: 2.3 },
  { centerZ: -26.5, offset: -0.45, radiusX: 2.65, radiusZ: 1.72 },
  { centerZ: -48.5, offset: 0.6, radiusX: 2.15, radiusZ: 2.55 },
  { centerZ: -64.2, offset: -0.65, radiusX: 1.85, radiusZ: 1.55 },
] as const;

export const WATER_BASINS: readonly WaterBasinProfile[] = WATER_BASIN_SPECS.map((spec) => ({
  centerX: caveCenterX(spec.centerZ) + spec.offset,
  centerZ: spec.centerZ,
  radiusX: spec.radiusX,
  radiusZ: spec.radiusZ,
  depth: 0.18,
  waterDepth: 0.11,
}));

export function baseFloorHeightAt(x: number, z: number): number {
  const center = caveCenterX(z);
  const edge = Math.abs(x - center) / caveHalfWidth(z);
  const base = Math.sin(x * 0.71 + z * 0.16) * 0.018 + Math.sin(z * 0.47) * 0.014;
  return base + Math.max(0, edge - 0.68) ** 2 * 0.34;
}

export function floorHeightAt(x: number, z: number): number {
  const base = baseFloorHeightAt(x, z);
  let height = base;
  for (const basin of WATER_BASINS) {
    const normalizedX = (x - basin.centerX) / basin.radiusX;
    const normalizedZ = (z - basin.centerZ) / basin.radiusZ;
    const normalizedDistance = Math.hypot(normalizedX, normalizedZ);
    const basinBlend = 1 - smoothstep(0.9, 1.08, normalizedDistance);
    height = Math.min(height, base - basin.depth * basinBlend);
  }
  return height;
}

export function waterSurfaceHeight(basin: WaterBasinProfile): number {
  return floorHeightAt(basin.centerX, basin.centerZ) + basin.waterDepth;
}

const caveShellSampler = new CaveShellSampler({
  centerX: caveCenterX,
  halfWidth: caveHalfWidth,
  ceiling: caveCeiling,
});

export const CAVE_SHELL_CONTACT_SKIN = 0.002;
const sharedHorizontalBounds: CaveHorizontalBounds = { minimum: 0, maximum: 0 };

export function caveGroundHeightAt(x: number, z: number): number {
  return Math.max(
    floorHeightAt(x, z),
    caveShellSampler.getLowerHeight(x, z) + CAVE_SHELL_CONTACT_SKIN,
  );
}

export function caveInteriorHalfWidthAtHeight(y: number, z: number, clearance = 0): number {
  caveInteriorBoundsAtHeight(y, z, clearance, sharedHorizontalBounds);
  const center = caveCenterX(z);
  return Math.max(
    0.08,
    Math.min(center - sharedHorizontalBounds.minimum, sharedHorizontalBounds.maximum - center),
  );
}

export function caveInteriorBoundsAtHeight(
  y: number,
  z: number,
  clearance: number,
  target: CaveHorizontalBounds,
): CaveHorizontalBounds {
  caveShellSampler.getHorizontalBounds(y, z, target);
  target.minimum += clearance;
  target.maximum -= clearance;
  if (target.minimum > target.maximum) {
    const center = (target.minimum + target.maximum) * 0.5;
    target.minimum = center - 0.08;
    target.maximum = center + 0.08;
  }
  return target;
}

export function isPointInsideCaveShell(
  x: number,
  y: number,
  z: number,
  clearance: number,
  target: CaveHorizontalBounds,
): boolean {
  return caveShellSampler.containsPoint(x, y, z, clearance, target);
}

export function getCaveShellSampleData() {
  return caveShellSampler.getSampleData();
}
