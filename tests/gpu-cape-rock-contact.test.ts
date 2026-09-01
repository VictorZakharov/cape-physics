import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';

describe('WebGPU complementary rock-face contact', () => {
  test('acts only on vertex-clear crossings and never rolls back a whole triangle', () => {
    const source = readFileSync(
      new URL('../src/physics/GpuCapeRockFaceKernel.ts', import.meta.url),
      'utf8',
    );

    expect(source).toContain('rockTriangleHasVertexContact');
    expect(source).toContain('triangleIntersects.and(triangleHasVertexContact.not())');
    expect(source).toContain('`correctedPreviousRockFace${declarationSuffix}`');
    expect(source).toContain("applyCorrection(firstIndex, 'First')");
    expect(source).toContain("applyCorrection(secondIndex, 'Second')");
    expect(source).toContain("applyCorrection(thirdIndex, 'Third')");
    expect(source).not.toContain('rockFacePreviousTriangleSafe');
    expect(source).not.toContain('restorePrevious(firstIndex');
  });
});
