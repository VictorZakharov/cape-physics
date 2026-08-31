import { describe, expect, test } from 'bun:test';

describe('WebGPU multi-cape submission architecture', () => {
  test('prepares all capes before issuing one shared compute submission', async () => {
    const gpuSource = await Bun.file('src/physics/GpuCapeSimulation.ts').text();
    const demoSource = await Bun.file('src/CapeDemo.ts').text();

    expect(gpuSource).toContain('public prepareStep(');
    expect(gpuSource).toContain('return this.computeSequence.slice();');
    expect(demoSource).toContain('computeNodes.push(...bot.cape.prepareStep(');
    expect(demoSource).toContain('renderer.compute(computeNodes);');
    expect(demoSource).toContain(
      'if (cape instanceof CapeSimulation) this.stabilizeCapeInstance(character, cape);',
    );
  });
});
