import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapePredictionKernels.ts'),
  'utf8',
);

describe('WebGPU cape prediction kernel boundaries', () => {
  test('keeps prediction and idle recovery as distinct named passes', () => {
    expect(source).toContain("setName('Cape idle drape recovery')");
    expect(source).toContain("setName('Cape predict')");
  });

  test('retains world-space Verlet prediction and velocity limits', () => {
    expect(source).toContain('currentPosition.sub(previousPosition)');
    expect(source).toContain('MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED');
    expect(source).toContain('MAXIMUM_VERTICAL_CAPE_PARTICLE_SPEED');
    expect(source).not.toContain('anchorState.xyz.add(currentPosition)');
  });
});
