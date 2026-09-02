import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapeProjectionKernel.ts'),
  'utf8',
);

describe('WebGPU cape particle projection kernel', () => {
  test('retains the authored projection phase ordering', () => {
    const self = source.indexOf('if (includeSelfCollision)');
    const fold = source.indexOf('if (includeFoldGuard)');
    const body = source.indexOf(".toVar('bodyCorrection')");
    const world = source.indexOf(".toVar('worldContactStart')");
    expect(fold).toBeGreaterThan(0);
    expect(self).toBeGreaterThan(fold);
    expect(body).toBeGreaterThan(self);
    expect(world).toBeGreaterThan(body);
  });

  test('signals world support per particle and keeps its repair velocity-neutral', () => {
    expect(source).toContain('atomicOr(resources.worldContactFlagBuffer.element(index)');
    expect(source).not.toContain('worldContactFlagBuffer.element(capeIndex)');
    expect(source).toContain('previousPosition.addAssign(worldContactCorrection)');
    expect(source).toContain('rockCorrectionUsed.add(select(rockSweepResolved, 1, 0))');
  });
});
