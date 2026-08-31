import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';

describe('WebGPU body-face parity', () => {
  test('uses WebGL front-side rejection and lateral escape instead of back projection', () => {
    const source = readFileSync(
      new URL('../src/physics/GpuCapeSimulation.ts', import.meta.url),
      'utf8',
    );
    const start = source.indexOf('private createBodyFaceColorFunction');
    const end = source.indexOf('private createInitialState', start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const bodyFaceSource = source.slice(start, end);

    expect(bodyFaceSource).toContain('coloredBodyFacePreviousClosest');
    expect(bodyFaceSource).toContain('depth.lessThanEqual(depthRadius.negate())');
    expect(bodyFaceSource).toContain('coloredBodyFacePreferredSide');
    expect(bodyFaceSource).toContain('first.addAssign(contactNormal.mul(');
    expect(bodyFaceSource).not.toContain('first.addAssign(this.backUniform.mul(');
    expect(bodyFaceSource).toContain('.dot(correctionNormal)');
  });

  test('documents the one-sided ellipsoid policy used by WebGL', () => {
    const depthRadius = 0.08;
    const lateralRadius = 0.12;
    const partialFrontDepth = -0.04;
    const lateral = 0.03;
    const lateralBoundary = lateralRadius * Math.sqrt(
      1 - (partialFrontDepth / depthRadius) ** 2,
    );

    expect(-0.09).toBeLessThanOrEqual(-depthRadius);
    expect(lateralBoundary - lateral).toBeGreaterThan(0);
  });
});
