import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapeRockFaceKernel.ts'),
  'utf8',
);

describe('WebGPU cape rock-face contact kernel', () => {
  test('retains exact triangle, swept, sphere, and cave contact phases', () => {
    expect(source).toContain('const intersectsSegmentTriangle = Fn<');
    expect(source).toContain('const sphereIntersectsTriangle = Fn<');
    expect(source).toContain('if (allowSweptFaceRecovery)');
    expect(source).toContain(
      'const getCaveWallCorrection = includeCaveFaceRecovery ? Fn<',
    );
  });

  test('retains fixed sweep sampling and face order', () => {
    expect(source).toContain('const SWEPT_FACE_SAMPLE_COUNT = 4;');
    expect(source).toContain('end: uint(ROCK_FACES_PER_COLLIDER)');
    expect(source).toContain("name: `capeRockFaceColorPass${passName}`");
  });
});
