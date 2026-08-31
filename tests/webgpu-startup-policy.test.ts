import { describe, expect, test } from 'bun:test';
import { evaluateWebGpuStartupPolicy } from '../src/core/WebGpuStartupPolicy';

const macChrome151 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
  + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

describe('WebGPU startup safety policy', () => {
  test('blocks Chromium 151 on macOS before requesting an adapter', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: macChrome151,
    })).toEqual({
      allowed: false,
      code: 'chromium-151-macos',
      reason: 'WebGPU is disabled on Chromium 151 for macOS because its GPU-process failure can also disable WebGL. Use WebGL or update Chrome.',
    });
  });

  test('does not extend the temporary version gate to a future Chrome release', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: macChrome151.replace('Chrome/151', 'Chrome/152'),
    })).toMatchObject({
      allowed: true,
      code: 'allowed',
    });
  });

  test('does not block Chrome 151 on Windows', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: macChrome151.replace(
        'Macintosh; Intel Mac OS X 10_15_7',
        'Windows NT 10.0; Win64; x64',
      ),
    })).toMatchObject({
      allowed: true,
      code: 'allowed',
    });
  });

  test('quarantines WebGPU for the session after any device-loss shutdown', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: 'Future Browser',
      diagnostics: {
        current: null,
        automaticReloads: 0,
        recoveryPending: false,
        failures: [{
          attemptId: 'lost',
          renderer: 'webgpu',
          stage: 'webgpu-device-lost',
          name: 'Error',
          message: 'A valid external Instance reference no longer exists.',
          stack: null,
          occurredAt: 1,
          userAgent: 'Future Browser',
          pageUrl: 'https://example.test/',
          recoveredWith: 'webgl',
          recoveredAt: 2,
        }],
      },
    })).toMatchObject({
      allowed: false,
      code: 'session-device-loss',
    });
  });

  test('reports a missing API independently from the platform blocklist', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: false,
      userAgent: macChrome151,
    })).toMatchObject({
      allowed: false,
      code: 'api-unavailable',
    });
  });
});
