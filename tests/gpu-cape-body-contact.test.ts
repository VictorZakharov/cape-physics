import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';

const readPhysicsSource = (file: string): string => readFileSync(
  new URL(`../src/physics/${file}`, import.meta.url),
  'utf8',
);

describe('WebGPU cape body contact architecture', () => {
  test('keeps body contact local and independent of character velocity', () => {
    const facadeSource = readPhysicsSource('GpuCapeSimulation.ts');
    const colliderSource = readPhysicsSource('GpuCapeColliderPacking.ts');
    const projectionSource = readPhysicsSource('GpuCapeProjectionKernel.ts');
    const virtualBodySource = readPhysicsSource('GpuCapeVirtualBodyContactKernel.ts');
    const source = [facadeSource, colliderSource, projectionSource, virtualBodySource]
      .join('\n');

    expect(colliderSource).toContain('export const GPU_BODY_BUFFER_STRIDE = 5');
    expect(colliderSource).toContain('axisMetricLengthSquared');
    expect(projectionSource).toContain("position.sub(closest).toVar('bodyDelta')");
    expect(projectionSource).toContain("axisDepth.xyz.dot(back).toVar('bodyAxisBack')");
    expect(projectionSource).toContain('metricProjection.div(lateralAxis.w).clamp(0, 1)');
    expect(projectionSource).toContain('candidate.assign(back.mul(surfaceDepth.sub(depth).max(0)))');
    expect(virtualBodySource).toContain("const closest = first.toVar('virtualBodyClosest')");
    expect(virtualBodySource).toContain('candidateLengthSquared.greaterThan');
    expect(virtualBodySource).toContain('.mul(inverseMass.mul(barycentricWeight))');
    expect(virtualBodySource).toContain('If(inverseMass.greaterThan(0)');
    expect(source).not.toContain('previousBodyState');
    expect(source).not.toContain('bodyMotion');
    expect(facadeSource).not.toContain('input.characterVelocity.dot(input.anchors.back)');
    expect(source).not.toContain('createBodyFaceColorFunction');
    expect(facadeSource).toContain('createGpuCapeVirtualBodyContactColorFunction');
  });

  test('separates body response from world support when reconciling falling velocity', () => {
    const projectionSource = readPhysicsSource('GpuCapeProjectionKernel.ts');
    const virtualBodySource = readPhysicsSource('GpuCapeVirtualBodyContactKernel.ts');
    const reconciliationSource = readPhysicsSource('GpuCapeReconciliationKernels.ts');

    expect(projectionSource).not.toContain(
      'atomicOr(resources.worldContactFlagBuffer.element(capeIndex), uint(2))',
    );
    expect(virtualBodySource).not.toContain(
      'atomicOr(resources.worldContactFlagBuffer.element(capeIndex), uint(2))',
    );
    expect(projectionSource).toContain(
      'atomicOr(resources.worldContactFlagBuffer.element(index), uint(1))',
    );
    expect(reconciliationSource).toContain(
      'resources.worldContactFlagBuffer.element(index)',
    );
    expect(reconciliationSource).toContain('.bitAnd(uint(1)).greaterThan(uint(0))');
    expect(reconciliationSource).toContain('.and(hasWorldContact.not())');
  });
});
