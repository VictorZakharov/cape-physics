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
    | 'chromium-151-macos-runaway-process';
  readonly reason: string | null;
}

function chromiumMajorVersion(userAgent: string): number | null {
  const match = /\b(?:Chrome|Chromium)\/(\d+)/.exec(userAgent);
  return match ? Number(match[1]) : null;
}

/**
 * A device loss can leave the current browser GPU process unable to create a
 * replacement WebGL context. Quarantine only the already-failed tab session;
 * platform or browser-version blocklists would hide renderer regressions and
 * prevent WebGPU from working on otherwise capable hardware.
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
      failure.stage.startsWith('webgpu-device-lost')
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
      code: 'chromium-151-macos-runaway-process',
      reason: 'WebGPU is temporarily disabled on Chromium 151 for macOS after a device loss left a runaway GPU helper consuming CPU. This is a safety containment, not a fix.',
    };
  }

  return {
    allowed: true,
    code: 'allowed',
    reason: null,
  };
}
