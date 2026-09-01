import { describe, expect, test } from 'bun:test';

describe('WebGPU multi-cape submission architecture', () => {
  test('uses one preallocated graph whose dispatch count does not grow with capes', async () => {
    const gpuSource = await Bun.file('src/physics/GpuCapeSimulation.ts').text();
    const predictionSource = await Bun.file(
      'src/physics/GpuCapePredictionKernels.ts',
    ).text();
    const constraintSource = await Bun.file(
      'src/physics/GpuCapeConstraintKernel.ts',
    ).text();
    const virtualBodySource = await Bun.file(
      'src/physics/GpuCapeVirtualBodyContactKernel.ts',
    ).text();
    const rockFaceSource = await Bun.file(
      'src/physics/GpuCapeRockFaceKernel.ts',
    ).text();
    const projectionSource = await Bun.file(
      'src/physics/GpuCapeProjectionKernel.ts',
    ).text();
    const demoSource = await Bun.file('src/CapeDemo.ts').text();

    expect(gpuSource).toContain('export const MAXIMUM_GPU_CAPES = 11;');
    expect(gpuSource).toContain('public prepareBatchStep(');
    expect(gpuSource).toContain('this.activeCapeCountUniform.value = inputs.length;');
    expect(gpuSource).toContain('this.botMesh.count = inputs.length - 1;');
    expect(constraintSource).toContain('const capeIndex = workgroupId.x;');
    expect(constraintSource).toContain('const constraintIndex = localId.x;');
    expect(gpuSource).toContain(
      "private readonly anchorUniform = uniformArray(this.anchorValues, 'vec4' as const);",
    );
    expect(gpuSource).toContain('this.updateAnchorValues(capeIndex, input.anchors);');
    expect(predictionSource).toContain('const anchor = resources.anchorUniform.element(');
    expect(gpuSource + predictionSource).not.toContain('anchorBuffer');
    expect(gpuSource + constraintSource).not.toContain(
      'const constraintIndex = instanceIndex.mod(uint(PARTICLE_COUNT));',
    );
    expect(gpuSource).toContain('return this.computeSequence.slice();');
    expect(rockFaceSource).toContain('const SWEPT_FACE_SAMPLE_COUNT = 4;');
    expect(rockFaceSource).toContain('end: uint(SWEPT_FACE_SAMPLE_COUNT + 1)');
    expect(rockFaceSource).toContain('name: `capeRockFaceTrianglesIntersect${passName}`');
    expect(gpuSource + rockFaceSource).not.toContain('sweptFirstQuarter');
    expect(gpuSource + projectionSource + rockFaceSource).not.toContain('Return,');
    expect(gpuSource + projectionSource + rockFaceSource).not.toContain('() => Return()');
    expect(rockFaceSource).toContain("applyCorrection(firstIndex, 'First');");
    expect(rockFaceSource).toContain('`correctedRockFace${declarationSuffix}`');
    expect(virtualBodySource).toContain(
      '`correctedPreviousVirtualBody${declarationSuffix}`',
    );
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
