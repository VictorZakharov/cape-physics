export type WebGpuBootstrapStage =
  | 'request-webgpu-adapter'
  | 'request-webgpu-device';

interface BootstrapGpu {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
}

interface BootstrapTimers {
  setTimeout(handler: () => void, milliseconds: number): number;
  clearTimeout(handle: number): void;
}

export interface WebGpuDeviceBootstrapOptions {
  readonly timeoutMilliseconds?: number;
  readonly requestedFeatures?: readonly GPUFeatureName[];
  readonly requiredLimits?: Record<string, number>;
  readonly onStage?: (stage: WebGpuBootstrapStage) => void;
  readonly timers?: BootstrapTimers;
}

export class WebGpuBootstrapError extends Error {
  public constructor(
    public readonly stage: WebGpuBootstrapStage,
    public readonly code: 'timeout' | 'unavailable' | 'request-failed',
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'WebGpuBootstrapError';
  }
}

const browserTimers: BootstrapTimers = {
  setTimeout: (handler, milliseconds) => window.setTimeout(handler, milliseconds),
  clearTimeout: (handle) => window.clearTimeout(handle),
};

async function withDeadline<T>(
  operation: Promise<T>,
  stage: WebGpuBootstrapStage,
  timeoutMilliseconds: number,
  timers: BootstrapTimers,
): Promise<T> {
  let timeoutHandle: number | null = null;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutHandle = timers.setTimeout(() => {
      reject(new WebGpuBootstrapError(
        stage,
        'timeout',
        `WebGPU ${stage === 'request-webgpu-adapter' ? 'adapter' : 'device'} request exceeded ${timeoutMilliseconds} ms.`,
      ));
    }, timeoutMilliseconds);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timeoutHandle !== null) timers.clearTimeout(timeoutHandle);
  }
}

/**
 * Acquires the WebGPU device before Three.js allocates a renderer or binds the
 * canvas. A stalled browser adapter/device request can therefore fall back to
 * the independent WebGL renderer without leaving a half-created renderer on
 * the same canvas.
 */
export async function requestWebGpuDevice(
  gpu: BootstrapGpu | undefined,
  options: WebGpuDeviceBootstrapOptions = {},
): Promise<GPUDevice> {
  const timeoutMilliseconds = options.timeoutMilliseconds ?? 12_000;
  const timers = options.timers ?? browserTimers;
  if (!gpu) {
    throw new WebGpuBootstrapError(
      'request-webgpu-adapter',
      'unavailable',
      'WebGPU is not exposed by this browser.',
    );
  }

  options.onStage?.('request-webgpu-adapter');
  let adapter: GPUAdapter | null;
  try {
    adapter = await withDeadline(
      gpu.requestAdapter({ powerPreference: 'high-performance' }),
      'request-webgpu-adapter',
      timeoutMilliseconds,
      timers,
    );
  } catch (error) {
    if (error instanceof WebGpuBootstrapError) throw error;
    throw new WebGpuBootstrapError(
      'request-webgpu-adapter',
      'request-failed',
      'The browser rejected the WebGPU adapter request.',
      { cause: error },
    );
  }
  if (!adapter) {
    throw new WebGpuBootstrapError(
      'request-webgpu-adapter',
      'unavailable',
      'The browser could not provide a WebGPU adapter.',
    );
  }

  options.onStage?.('request-webgpu-device');
  // Request only features the application actually uses. Enabling every
  // adapter feature opts the device into experimental driver paths (for
  // example timestamp queries, shader-f16, and subgroups) even when the app
  // never submits work that needs them.
  const requiredFeatures = (options.requestedFeatures ?? []).filter(
    (feature) => adapter.features.has(feature),
  );
  let deviceRequest: Promise<GPUDevice>;
  try {
    deviceRequest = adapter.requestDevice({
      requiredFeatures,
      requiredLimits: options.requiredLimits,
    });
  } catch (error) {
    throw new WebGpuBootstrapError(
      'request-webgpu-device',
      'request-failed',
      'The browser rejected the WebGPU device request.',
      { cause: error },
    );
  }
  let accepted = false;
  try {
    const device = await withDeadline(
      deviceRequest,
      'request-webgpu-device',
      timeoutMilliseconds,
      timers,
    );
    accepted = true;
    return device;
  } catch (error) {
    if (error instanceof WebGpuBootstrapError) throw error;
    throw new WebGpuBootstrapError(
      'request-webgpu-device',
      'request-failed',
      'The browser rejected the WebGPU device request.',
      { cause: error },
    );
  } finally {
    if (!accepted) {
      // requestDevice has no AbortSignal. If it resolves after our deadline,
      // destroy the orphan rather than leaving a live device behind while the
      // WebGL fallback is running.
      void deviceRequest.then((device) => device.destroy()).catch(() => undefined);
    }
  }
}
