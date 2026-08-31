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
    | 'session-device-loss';
  readonly reason: string | null;
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

  return {
    allowed: true,
    code: 'allowed',
    reason: null,
  };
}
