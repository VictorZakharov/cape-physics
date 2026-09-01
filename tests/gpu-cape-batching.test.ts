import { describe, expect, test } from 'bun:test';

describe('WebGPU multi-cape submission architecture', () => {
  test('uses one preallocated graph whose dispatch count does not grow with capes', async () => {
    const gpuSource = await Bun.file('src/physics/GpuCapeSimulation.ts').text();
    const demoSource = await Bun.file('src/CapeDemo.ts').text();

    expect(gpuSource).toContain('export const MAXIMUM_GPU_CAPES = 11;');
    expect(gpuSource).toContain('public prepareBatchStep(');
    expect(gpuSource).toContain('this.activeCapeCountUniform.value = inputs.length;');
    expect(gpuSource).toContain('this.botMesh.count = inputs.length - 1;');
    expect(gpuSource).toContain('const capeIndex = workgroupId.x;');
    expect(gpuSource).toContain('const constraintIndex = localId.x;');
    expect(gpuSource).toContain(
      "private readonly anchorUniform = uniformArray(this.anchorValues, 'vec4' as const);",
    );
    expect(gpuSource).toContain('this.updateAnchorValues(capeIndex, input.anchors);');
    expect(gpuSource).toContain('const anchor = this.anchorUniform.element(');
    expect(gpuSource).not.toContain('anchorBuffer');
    expect(gpuSource).not.toContain(
      'const constraintIndex = instanceIndex.mod(uint(PARTICLE_COUNT));',
    );
    expect(gpuSource).toContain('return this.computeSequence.slice();');
    expect(gpuSource).toContain('const SWEPT_FACE_SAMPLE_COUNT = 4;');
    expect(gpuSource).toContain('end: uint(SWEPT_FACE_SAMPLE_COUNT + 1)');
    expect(gpuSource).toContain('name: `capeRockFaceTrianglesIntersect${passName}`');
    expect(gpuSource).not.toContain('sweptFirstQuarter');
    expect(gpuSource).not.toContain('Return,');
    expect(gpuSource).not.toContain('() => Return()');
    expect(gpuSource).toContain("applyCorrection(firstIndex, 'First');");
    expect(gpuSource).toContain('`correctedRockFace${declarationSuffix}`');
    expect(gpuSource).toContain('`correctedPreviousVirtualBody${declarationSuffix}`');
    expect(demoSource).toContain('this.submitGpuCapeBatch(step, [');
    expect(demoSource).toContain(
      'const computeNodes = this.cape.prepareBatchStep(step, inputs, worldColliders, time);',
    );
    expect(demoSource).toContain('renderer.compute(computeNodes);');
    expect(demoSource).not.toContain('computeNodes.push(...bot.cape.prepareStep(');
    expect(demoSource).toContain('const cape = this.cape instanceof CapeSimulation');
    expect(demoSource).toContain(': null;');
    expect(demoSource).toContain('if (cape instanceof CapeSimulation) {');
    expect(demoSource).toContain(
      'this.webGlCapeWorkers.registerCape(',
    );
  });
});
