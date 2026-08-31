import { describe, expect, test } from 'bun:test';

describe('WebGPU runtime safety', () => {
  test('does not submit runtime PMREM generation on the WebGPU device', async () => {
    const source = await Bun.file('src/lighting/WebGpuCinematicLighting.ts').text();

    expect(source).not.toContain('PMREMGenerator');
    expect(source).not.toContain('RoomEnvironment');
    expect(source).not.toContain('fromScene(');
    expect(source).toContain('scene.environment = null');
    expect(source).toContain('scene.environmentNode = this.environmentNode');
  });
});
