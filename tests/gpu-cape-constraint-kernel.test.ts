import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapeConstraintKernel.ts'),
  'utf8',
);

describe('WebGPU cape structural constraint kernel', () => {
  test('retains the ordered single-invocation Gauss-Seidel stream', () => {
    expect(source).toContain('If(constraintIndex.equal(uint(0))');
    expect(source).toContain('end: uint(resources.constraintCount)');
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
