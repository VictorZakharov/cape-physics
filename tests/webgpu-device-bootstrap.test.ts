import { describe, expect, test } from 'bun:test';
import {
  requestWebGpuDevice,
  WebGpuBootstrapError,
  type WebGpuBootstrapStage,
} from '../src/core/WebGpuDeviceBootstrap';

class ManualTimers {
  private nextHandle = 1;
  private readonly handlers = new Map<number, () => void>();

  public readonly setTimeout = (handler: () => void): number => {
    const handle = this.nextHandle++;
    this.handlers.set(handle, handler);
    return handle;
  };

  public readonly clearTimeout = (handle: number): void => {
    this.handlers.delete(handle);
  };

  public fireAll(): void {
    const handlers = [...this.handlers.values()];
    this.handlers.clear();
    for (const handler of handlers) handler();
  }

  public get pending(): number {
    return this.handlers.size;
  }
}

function fakeAdapter(
  requestDevice: (descriptor?: GPUDeviceDescriptor) => Promise<GPUDevice>,
): GPUAdapter {
  return {
    features: new Set<GPUFeatureName>([
      'core-features-and-limits',
      'timestamp-query',
    ]) as GPUSupportedFeatures,
    requestDevice,
  } as GPUAdapter;
}

describe('WebGPU device bootstrap', () => {
  test('acquires the adapter and device before renderer construction', async () => {
    const stages: WebGpuBootstrapStage[] = [];
    const descriptors: GPUDeviceDescriptor[] = [];
    const device = { destroy() {} } as GPUDevice;
    const adapter = fakeAdapter(async (descriptor) => {
      descriptors.push(descriptor ?? {});
      return device;
    });
    const gpu = {
      async requestAdapter(options?: GPURequestAdapterOptions) {
        expect(options?.powerPreference).toBe('high-performance');
        return adapter;
      },
    };

    await expect(requestWebGpuDevice(gpu, {
      requiredLimits: { maxStorageBuffersPerShaderStage: 8 },
      onStage: (stage) => stages.push(stage),
    })).resolves.toBe(device);
    expect(stages).toEqual([
      'request-webgpu-adapter',
      'request-webgpu-device',
    ]);
    expect(descriptors).toEqual([{
      requiredFeatures: [
        'core-features-and-limits',
        'timestamp-query',
      ],
      requiredLimits: { maxStorageBuffersPerShaderStage: 8 },
    }]);
  });

  test('classifies a missing adapter without constructing a renderer', async () => {
    const gpu = { requestAdapter: async () => null };
    try {
      await requestWebGpuDevice(gpu);
      throw new Error('Expected adapter acquisition to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(WebGpuBootstrapError);
      expect(error).toMatchObject({
        stage: 'request-webgpu-adapter',
        code: 'unavailable',
      });
    }
  });

  test('times out an adapter request deterministically', async () => {
    const timers = new ManualTimers();
    const pending = requestWebGpuDevice({
      requestAdapter: () => new Promise<GPUAdapter | null>(() => undefined),
    }, {
      timeoutMilliseconds: 25,
      timers,
    });
    expect(timers.pending).toBe(1);
    timers.fireAll();
    await expect(pending).rejects.toMatchObject({
      stage: 'request-webgpu-adapter',
      code: 'timeout',
    });
  });

  test('classifies a synchronous device descriptor rejection', async () => {
    const adapter = fakeAdapter(() => {
      throw new TypeError('unsupported required limit');
    });
    try {
      await requestWebGpuDevice({ requestAdapter: async () => adapter });
      throw new Error('Expected device acquisition to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(WebGpuBootstrapError);
      expect(error).toMatchObject({
        stage: 'request-webgpu-device',
        code: 'request-failed',
      });
    }
  });

  test('destroys a device that arrives after the device deadline', async () => {
    const timers = new ManualTimers();
    let resolveDevice: ((device: GPUDevice) => void) | null = null;
    const deviceRequest = new Promise<GPUDevice>((resolve) => {
      resolveDevice = resolve;
    });
    const adapter = fakeAdapter(() => deviceRequest);
    const pending = requestWebGpuDevice({
      requestAdapter: async () => adapter,
    }, {
      timeoutMilliseconds: 25,
      timers,
    });
    for (let index = 0; index < 5; index += 1) await Promise.resolve();
    expect(timers.pending).toBe(1);
    timers.fireAll();
    await expect(pending).rejects.toMatchObject({
      stage: 'request-webgpu-device',
      code: 'timeout',
    });

    let destroyed = 0;
    resolveDevice!({ destroy: () => { destroyed += 1; } } as GPUDevice);
    for (let index = 0; index < 3; index += 1) await Promise.resolve();
    expect(destroyed).toBe(1);
  });
});
