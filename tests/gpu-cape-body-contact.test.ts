import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';
import {
  getVirtualBodyContactParticleScales,
  shouldApplyVirtualBodyContact,
} from '../src/physics/GpuVirtualBodyContact';

describe('WebGPU cape body contact architecture', () => {
  test('uses particle and virtual-particle capsule contact without the inverse sweep', () => {
    const source = readFileSync(
      new URL('../src/physics/GpuCapeSimulation.ts', import.meta.url),
      'utf8',
    );

    expect(source).toContain('const BODY_BUFFER_STRIDE = 4');
    expect(source).toContain("position.sub(closest).toVar('bodyDelta')");
    expect(source).not.toContain('createBodyFaceColorFunction');
    expect(source).not.toContain('Cape body faces in position');
    expect(source).not.toContain('coloredBodyFace');
    expect(source).toContain('createVirtualBodyContactColorFunction');
    expect(source).toContain('triangleHasVertexContact.not()');
    expect(source).toContain('Cape virtual body contacts');
  });

  test('activates a virtual sample only for a vertex-clear face gap', () => {
    expect(shouldApplyVirtualBodyContact([0, 0, 0], 0.01)).toBe(true);
    expect(shouldApplyVirtualBodyContact([0.001, 0, 0], 0.01)).toBe(false);
    expect(shouldApplyVirtualBodyContact([0, 0, 0], 0)).toBe(false);
  });

  test('redistributes a centroid correction without moving pinned particles', () => {
    expect(getVirtualBodyContactParticleScales([1, 1, 1])).toEqual([1, 1, 1]);
    expect(getVirtualBodyContactParticleScales([0, 1, 1])).toEqual([0, 1.5, 1.5]);
    expect(getVirtualBodyContactParticleScales([0, 0, 0])).toEqual([0, 0, 0]);
  });
});
