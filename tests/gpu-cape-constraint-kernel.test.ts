import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapeConstraintKernel.ts'),
  'utf8',
);

describe('WebGPU cape structural constraint kernel', () => {
  test('uses race-free parallel Gauss-Seidel color batches', () => {
    expect(source).toContain('for (const batch of GPU_CAPE_CONSTRAINT_COLOR_BATCHES)');
    expect(source).toContain('If(constraintIndex.lessThan(uint(batch.count))');
    expect(source).toContain('uint(batch.offset).add(constraintIndex)');
    expect(source).toContain(".toVar('orderedConstraintCorrection')");
  });

  test('retains self, fold, row-span, and row-curl phases in order', () => {
    const self = source.indexOf('if (includeSelfCollision)');
    const fold = source.indexOf('if (includeFoldGuard)');
    const span = source.indexOf(".toVar('spanLeft')");
    const curl = source.indexOf(".toVar('rowCurl' + column)");
    expect(self).toBeGreaterThan(0);
    expect(fold).toBeGreaterThan(self);
    expect(span).toBeGreaterThan(fold);
    expect(curl).toBeGreaterThan(span);
  });
});
