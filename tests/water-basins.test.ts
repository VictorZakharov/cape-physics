import { describe, expect, test } from 'bun:test';
import {
  baseFloorHeightAt,
  floorHeightAt,
  WATER_BASINS,
  waterSurfaceHeight,
} from '../src/world/caveProfile';
import { WaterSystem } from '../src/world/WaterSystem';

describe('procedural water basins', () => {
  test('carves every water surface below a dry containing rim', () => {
    for (const basin of WATER_BASINS) {
      const surface = waterSurfaceHeight(basin);
      expect(surface - floorHeightAt(basin.centerX, basin.centerZ)).toBeCloseTo(basin.waterDepth, 8);

      for (let sample = 0; sample < 48; sample += 1) {
        const angle = sample / 48 * Math.PI * 2;
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        const interiorX = basin.centerX + cosine * basin.radiusX * 0.84;
        const interiorZ = basin.centerZ + sine * basin.radiusZ * 0.84;
        const rimX = basin.centerX + cosine * basin.radiusX * 1.1;
        const rimZ = basin.centerZ + sine * basin.radiusZ * 1.1;

        expect(surface - floorHeightAt(interiorX, interiorZ)).toBeGreaterThan(0.04);
        expect(floorHeightAt(rimX, rimZ) - surface).toBeGreaterThan(0.02);
      }
    }
  });

  test('returns to the undisturbed cave profile outside each basin', () => {
    for (const basin of WATER_BASINS) {
      const x = basin.centerX + basin.radiusX * 1.2;
      expect(floorHeightAt(x, basin.centerZ)).toBeCloseTo(baseFloorHeightAt(x, basin.centerZ), 10);
    }
  });

  test('reports measurable interior depth and rim clearance', () => {
    const diagnostics = new WaterSystem().getDiagnostics();
    expect(diagnostics.minimumInteriorDepth).toBeGreaterThan(0.04);
    expect(diagnostics.minimumRimClearance).toBeGreaterThan(0.02);
  });
});
