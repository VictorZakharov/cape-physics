import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(import.meta.dir, '../src/physics/GpuCapeVirtualBodyContactKernel.ts'),
  'utf8',
);

describe('WebGPU cape virtual body-contact kernel', () => {
  test('retains centroid-only capsule coverage after real vertices are clear', () => {
    expect(source).toContain('const virtualPoint = first.add(second).add(third)');
    expect(source).toContain('const triangleHasVertexContact = pointPenetrates(first)');
    expect(source).toContain('triangleHasVertexContact.not().and(pointPenetrates(virtualPoint))');
  });

  test('retains barycentric correction and material-contact signaling', () => {
    expect(source).toContain('VIRTUAL_BODY_BARYCENTRIC_WEIGHT ** 2');
    expect(source).toContain('atomicOr(resources.materialContactFlagBuffer.element(capeIndex)');
    expect(source).toContain("applyCorrection(firstIndex, firstState, firstMass, 'First')");
  });
});
