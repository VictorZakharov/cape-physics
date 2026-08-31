import { describe, expect, test } from 'bun:test';
import {
  DEFAULT_GPU_CAPE_DIAGNOSTIC_OPTIONS,
  resolveGpuCapeDiagnosticOptions,
} from '../src/physics/GpuCapeDiagnosticOptions';

describe('WebGPU cape diagnostic options', () => {
  test('keeps body-face contacts enabled by default', () => {
    expect(DEFAULT_GPU_CAPE_DIAGNOSTIC_OPTIONS.bodyFaceContactsEnabled).toBe(true);
    expect(resolveGpuCapeDiagnosticOptions('').bodyFaceContactsEnabled).toBe(true);
    expect(
      resolveGpuCapeDiagnosticOptions('?renderer=webgpu').bodyFaceContactsEnabled,
    ).toBe(true);
  });

  test('disables only the explicit body-face diagnostic mode', () => {
    expect(
      resolveGpuCapeDiagnosticOptions(
        '?renderer=webgpu&gpuBodyFaces=off&harness=1',
      ).bodyFaceContactsEnabled,
    ).toBe(false);
    expect(
      resolveGpuCapeDiagnosticOptions('?gpuBodyFaces=on').bodyFaceContactsEnabled,
    ).toBe(true);
  });
});
