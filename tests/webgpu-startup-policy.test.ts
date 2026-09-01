import { describe, expect, test } from 'bun:test';
import { evaluateWebGpuStartupPolicy } from '../src/core/WebGpuStartupPolicy';

const macChrome151 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
  + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

describe('WebGPU startup safety policy', () => {
  test('contains the confirmed runaway GPU helper on Chromium 151 macOS', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: macChrome151,
    })).toEqual({
      allowed: false,
      code: 'chromium-151-macos-runaway-process',
      reason: 'WebGPU is temporarily disabled on Chromium 151 for macOS after a device loss left a runaway GPU helper consuming CPU. This is a safety containment, not a fix.',
    });
  });

  test('does not extend the containment to other versions or platforms', () => {
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: macChrome151.replace('Chrome/151', 'Chrome/152'),
    })).toMatchObject({ allowed: true, code: 'allowed' });
    expect(evaluateWebGpuStartupPolicy({
      apiAvailable: true,
      userAgent: macChrome151.replace('Macintosh; Intel Mac OS X 10_15_7', 'Windows NT 10.0'),
    })).toMatchObject({ allowed: true, code: 'allowed' });
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
          stage: 'webgpu-device-lost-after-submit-first-frame',
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
