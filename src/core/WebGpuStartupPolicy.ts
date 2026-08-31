import type { RendererStartupDiagnostics } from './RendererStartupRecovery';

export interface WebGpuStartupPolicyInput {
  readonly apiAvailable: boolean;
  readonly userAgent: string;
  readonly diagnostics?: RendererStartupDiagnostics;
}

export interface WebGpuStartupPolicy {
  readonly allowed: boolean;
  readonly code: 'allowed'
    | 'api-unavailable'
    | 'session-device-loss'
    | 'chromium-151-macos';
  readonly reason: string | null;
}

function chromiumMajorVersion(userAgent: string): number | null {
  const match = /\b(?:Chrome|Chromium)\/(\d+)/.exec(userAgent);
  return match ? Number(match[1]) : null;
}

/**
 * Chrome blocks or degrades 3D APIs after a GPU-process crash. In Chromium
 * 151 on macOS, the Dawn shutdown observed in issue #18 can therefore make a
 * later WebGL fallback impossible until Chrome restarts. Do not create a
 * WebGPU adapter/device on that known-bad combination.
 *
 * The version gate is deliberately narrow so a future Chrome release can be
 * tested without carrying a permanent macOS blocklist.
 */
export function evaluateWebGpuStartupPolicy(
  input: WebGpuStartupPolicyInput,
): WebGpuStartupPolicy {
  if (!input.apiAvailable) {
    return {
      allowed: false,
      code: 'api-unavailable',
      reason: 'WebGPU is not exposed by this browser.',
    };
  }

  const previousDeviceLoss = input.diagnostics?.failures.some((failure) => (
    failure.renderer === 'webgpu'
    && (
      failure.stage === 'webgpu-device-lost'
      || failure.message.includes('external Instance reference no longer exists')
    )
  )) === true;
  if (previousDeviceLoss) {
    return {
      allowed: false,
      code: 'session-device-loss',
      reason: 'WebGPU is disabled for this tab after a GPU device loss. Restart Chrome before trying WebGPU again.',
    };
  }

  const isMacOs = /\bMacintosh\b|\bMac OS X\b/.test(input.userAgent);
  if (isMacOs && chromiumMajorVersion(input.userAgent) === 151) {
    return {
      allowed: false,
      code: 'chromium-151-macos',
      reason: 'WebGPU is disabled on Chromium 151 for macOS because its GPU-process failure can also disable WebGL. Use WebGL or update Chrome.',
    };
  }

  return {
    allowed: true,
    code: 'allowed',
    reason: null,
  };
}
