import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';

describe('WebGPU cape body contact architecture', () => {
  test('uses particle-capsule contact without the rigid inverse face sweep', () => {
    const source = readFileSync(
      new URL('../src/physics/GpuCapeSimulation.ts', import.meta.url),
      'utf8',
    );

    expect(source).toContain('const BODY_BUFFER_STRIDE = 4');
    expect(source).toContain("position.sub(closest).toVar('bodyDelta')");
    expect(source).not.toContain('createBodyFaceColorFunction');
    expect(source).not.toContain('Cape body faces in position');
    expect(source).not.toContain('coloredBodyFace');
  });
});
