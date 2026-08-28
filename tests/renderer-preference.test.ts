import { describe, expect, test } from 'bun:test';
import {
  parseRendererPreference,
  rendererDefaultUrl,
  rendererPreferenceUrl,
  resolveRendererPreference,
} from '../src/core/RendererPreference';

describe('renderer preference', () => {
  test('defaults to WebGL even when WebGPU is available', () => {
    expect(resolveRendererPreference({
      search: '',
    })).toBe('webgl');
  });

  test('uses an explicit renderer only for its one-time URL handoff', () => {
    expect(resolveRendererPreference({
      search: '?renderer=webgpu',
    })).toBe('webgpu');
    expect(rendererDefaultUrl(
      'https://example.test/demo?harness=1&renderer=webgpu#view',
    )).toBe('https://example.test/demo?harness=1#view');
  });

  test('the query string preserves an explicit fallback request', () => {
    expect(resolveRendererPreference({
      search: '?renderer=webgl',
    })).toBe('webgl');
    expect(resolveRendererPreference({
      search: '?renderer=webgpu',
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
