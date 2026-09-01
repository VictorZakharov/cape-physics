import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapeReconciliationKernels.ts'),
  'utf8',
);

describe('WebGPU cape reconciliation kernel boundaries', () => {
  test('keeps the three reconciliation passes independently named', () => {
    expect(source).toContain("setName('Cape reset material contact flags')");
    expect(source).toContain("setName('Cape reconcile body contact velocity')");
    expect(source).toContain(".setName('Cape reconcile projection vertical velocity')");
  });

  test('allows only per-particle world support to bypass falling velocity repair', () => {
    expect(source).toContain('atomicLoad(');
    expect(source).toContain('worldContactFlagBuffer.element(index)');
    expect(source).toContain('.bitAnd(uint(1)).greaterThan(uint(0))');
    expect(source).toContain('.and(hasWorldContact.not())');
    expect(source).toContain('.and(resources.predictedVerticalBuffer.element(index).lessThan(0))');
  });
});
