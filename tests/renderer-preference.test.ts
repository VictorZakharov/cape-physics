import { describe, expect, test } from 'bun:test';
import {
  parseRendererPreference,
  rendererPreferenceUrl,
  resolveRendererPreference,
} from '../src/core/RendererPreference';

describe('renderer preference', () => {
  test('defaults to WebGL even when WebGPU is available', () => {
    expect(resolveRendererPreference({
      search: '',
      storedPreference: null,
      webGPUAvailable: true,
    })).toBe('webgl');
    expect(resolveRendererPreference({
      search: '',
      storedPreference: null,
      webGPUAvailable: false,
    })).toBe('webgl');
  });

  test('remembers a renderer explicitly selected under the current preference version', () => {
    expect(resolveRendererPreference({
      search: '',
      storedPreference: 'webgpu',
      webGPUAvailable: true,
    })).toBe('webgpu');
  });

  test('the query string overrides storage and preserves an explicit fallback request', () => {
    expect(resolveRendererPreference({
      search: '?renderer=webgl',
      storedPreference: 'webgpu',
      webGPUAvailable: true,
    })).toBe('webgl');
    expect(resolveRendererPreference({
      search: '?renderer=webgpu',
      storedPreference: 'webgl',
      webGPUAvailable: false,
    })).toBe('webgpu');
  });

  test('rejects unknown values and preserves other URL state', () => {
    expect(parseRendererPreference('vulkan')).toBeNull();
    expect(rendererPreferenceUrl(
      'https://example.test/demo?harness=1#view',
      'webgpu',
    )).toBe('https://example.test/demo?harness=1&renderer=webgpu#view');
  });
});
