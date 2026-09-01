import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';
import { predictCapeVerletAxis } from '../src/physics/CapeVerletPrediction';

describe('cape world-space Verlet integration', () => {
  test('leaves a settled free particle in world space while its anchor moves', () => {
    const result = predictCapeVerletAxis({
      currentPosition: 1,
      previousPosition: 1,
      dragPerSecond: 0,
      deltaTime: 1 / 120,
    });

    expect(result.predictedPosition).toBe(1);
    expect(result.storedPreviousPosition).toBe(1);
  });

  test('preserves existing free-particle velocity without anchor advection', () => {
    const result = predictCapeVerletAxis({
      currentPosition: 1.3,
      previousPosition: 1.25,
      dragPerSecond: 0,
      deltaTime: 1 / 120,
    });

    expect(result.predictedPosition).toBeCloseTo(1.35, 12);
    expect(result.storedPreviousPosition).toBe(1.3);
  });

  test('applies the same exponential drag and acceleration terms as WebGL', () => {
    const deltaTime = 1 / 120;
    const result = predictCapeVerletAxis({
      currentPosition: 2,
      previousPosition: 1.9,
      dragPerSecond: 3,
      deltaTime,
      acceleration: -9.81,
    });

    expect(result.predictedPosition).toBeCloseTo(
      2 + 0.1 * Math.exp(-3 * deltaTime) - 9.81 * deltaTime * deltaTime,
      12,
    );
  });

  test('WebGPU predictor cannot reintroduce whole-cape anchor transport', () => {
    const facadeSource = readFileSync(
      new URL('../src/physics/GpuCapeSimulation.ts', import.meta.url),
      'utf8',
    );
    const predictionSource = readFileSync(
      new URL('../src/physics/GpuCapePredictionKernels.ts', import.meta.url),
      'utf8',
    );
    const source = `${facadeSource}\n${predictionSource}`;

    expect(source).not.toContain('anchorDisplacementUniform');
    expect(source).not.toContain('anchorAccelerationDisplacementUniform');
    expect(predictionSource).toContain(
      "const currentPosition = current.xyz.toVar('currentPosition')",
    );
    expect(predictionSource).toContain('previous.assign(vec4(currentPosition, 0))');
  });
});
