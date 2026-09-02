import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';
import {
  getVirtualBodyContactParticleScales,
  MAXIMUM_VIRTUAL_BODY_CONSTRAINT_CORRECTION_PER_PASS,
  MAXIMUM_VIRTUAL_BODY_PARTICLE_CORRECTION_PER_PASS,
} from '../src/physics/GpuVirtualBodyContact';

const source = readFileSync(
  new URL('../src/physics/GpuCapeVirtualBodyContactKernel.ts', import.meta.url),
  'utf8',
);

describe('WebGPU cape virtual body-contact kernel', () => {
  test('finds exact triangle/capsule contact and keeps only one local correction', () => {
    expect(source).toContain('const d1 = ab.dot(ap)');
    expect(source).toContain('const vc = d1.mul(d4).sub(d3.mul(d2))');
    expect(source).toContain("const closest = first.toVar('virtualBodyClosest')");
    expect(source).toContain('normalizedDistanceSquared.lessThan(1)');
    expect(source).toContain('candidateLengthSquared.greaterThan');
    expect(source).not.toContain('triangleHasVertexContact');
    expect(source).not.toContain('previousBodyState');
  });

  test('uses the PBD barycentric gradient without moving pinned vertices', () => {
    expect(MAXIMUM_VIRTUAL_BODY_CONSTRAINT_CORRECTION_PER_PASS).toBe(0.032);
    expect(MAXIMUM_VIRTUAL_BODY_PARTICLE_CORRECTION_PER_PASS).toBe(0.064);
    const weights = [0.2, 0.3, 0.5] as const;
    const allFree = getVirtualBodyContactParticleScales([1, 1, 1], weights);
    expect(allFree[0]).toBeCloseTo(0.2 / 0.38);
    expect(allFree[1]).toBeCloseTo(0.3 / 0.38);
    expect(allFree[2]).toBeCloseTo(0.5 / 0.38);
    const firstPinned = getVirtualBodyContactParticleScales([0, 1, 1], weights);
    expect(firstPinned[0]).toBe(0);
    expect(firstPinned[1]).toBeCloseTo(0.3 / 0.34);
    expect(firstPinned[2]).toBeCloseTo(0.5 / 0.34);
    expect(getVirtualBodyContactParticleScales([0, 0, 0], weights)).toEqual([0, 0, 0]);
    expect(source).toContain('const lambdaCorrection = virtualCorrection.div(denominator)');
    expect(source).toContain('.mul(inverseMass.mul(barycentricWeight))');
    expect(source).toContain('If(inverseMass.greaterThan(0)');
    expect(source).toContain('correctedPrevious = previousState.xyz.add(particleCorrection)');
    expect(source).toContain('previousState.w');
    expect(source).toContain('correctionBarycentric.assign(barycentric)');
  });
});
