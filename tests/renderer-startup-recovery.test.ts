import { describe, expect, test } from 'bun:test';
import {
  RENDERER_STARTUP_STORAGE_KEY,
  RendererStartupRecovery,
} from '../src/core/RendererStartupRecovery';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function recovery(
  storage: MemoryStorage,
  clock: { value: number },
  ids: string[],
): RendererStartupRecovery {
  return new RendererStartupRecovery({
    storage,
    now: () => clock.value,
    createId: () => ids.shift() ?? 'extra-attempt',
    userAgent: 'Chrome test',
    pageUrl: 'https://example.test/?renderer=webgpu',
  });
}

describe('renderer startup recovery', () => {
  test('persists a WebGPU failure and marks a same-page WebGL fallback recovered', () => {
    const storage = new MemoryStorage();
    const clock = { value: 100 };
    const state = recovery(storage, clock, ['gpu-attempt', 'gl-attempt']);
    state.begin('webgpu', true);
    state.stage('request-webgpu-device');
    clock.value = 150;
    state.fallbackToWebGl(new Error('device request rejected'), 'request-webgpu-device');

    expect(state.getDiagnostics().current).toMatchObject({
      id: 'gl-attempt',
      renderer: 'webgl',
      stage: 'initialize-webgl-fallback',
    });
    expect(state.getDiagnostics().failures[0]).toMatchObject({
      attemptId: 'gpu-attempt',
      renderer: 'webgpu',
      stage: 'request-webgpu-device',
      message: 'device request rejected',
      recoveredWith: null,
    });

    clock.value = 200;
    state.complete('webgl');
    const restored = recovery(storage, clock, []).getDiagnostics();
    expect(restored.current).toBeNull();
    expect(restored.failures[0]).toMatchObject({
      recoveredWith: 'webgl',
      recoveredAt: 200,
    });
  });

  test('promotes an abandoned WebGPU stage after a browser reload', () => {
    const storage = new MemoryStorage();
    const clock = { value: 1_000 };
    const firstPage = recovery(storage, clock, ['hung-gpu']);
    firstPage.begin('webgpu', true);
    firstPage.stage('request-webgpu-adapter');

    clock.value = 2_000;
    const reloadedPage = recovery(storage, clock, ['fallback-gl']);
    reloadedPage.begin('webgl');
    const diagnostics = reloadedPage.getDiagnostics();
    expect(diagnostics.current).toMatchObject({
      renderer: 'webgl',
      id: 'fallback-gl',
    });
    expect(diagnostics.failures[0]).toMatchObject({
      attemptId: 'hung-gpu',
      renderer: 'webgpu',
      stage: 'request-webgpu-adapter',
      message: 'The page ended before WEBGPU startup completed.',
    });
  });

  test('permits one automatic reload and never loops after WebGL also fails', () => {
    const storage = new MemoryStorage();
    const clock = { value: 10 };
    const gpuPage = recovery(storage, clock, ['gpu']);
    gpuPage.begin('webgpu', true);
    gpuPage.stage('compile-render-pipelines');
    expect(gpuPage.fail(new Error('compile stalled'))).toEqual({
      action: 'reload-webgl',
      delayMilliseconds: 1_200,
    });

    clock.value = 20;
    const glPage = recovery(storage, clock, ['gl']);
    glPage.begin('webgl');
    glPage.stage('construct-webgl-renderer');
    expect(glPage.fail(new Error('context disabled'))).toEqual({
      action: 'show-error',
      delayMilliseconds: 0,
    });

    const diagnostics = glPage.getDiagnostics();
    expect(diagnostics.failures.map((failure) => failure.renderer)).toEqual([
      'webgpu',
      'webgl',
    ]);
    expect(diagnostics.recoveryPending).toBe(true);
    expect(diagnostics.automaticReloads).toBe(1);
  });

  test('keeps operating when session storage rejects reads and writes', () => {
    const unavailableStorage = {
      getItem(): string | null {
        throw new Error('blocked');
      },
      setItem(): void {
        throw new Error('blocked');
      },
    };
    const state = new RendererStartupRecovery({
      storage: unavailableStorage,
      now: () => 1,
      createId: () => 'memory-only',
    });
    state.begin('webgl');
    state.stage('construct-webgl-renderer');
    expect(state.fail(new Error('disabled')).action).toBe('show-error');
    expect(state.getDiagnostics().failures).toHaveLength(1);
  });

  test('stores a versioned JSON record rather than console-only state', () => {
    const storage = new MemoryStorage();
    const clock = { value: 42 };
    const state = recovery(storage, clock, ['persisted']);
    state.begin('webgpu', true);
    state.stage('request-webgpu-adapter');
    const raw = storage.getItem(RENDERER_STARTUP_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toMatchObject({
      version: 1,
      current: {
        renderer: 'webgpu',
        stage: 'request-webgpu-adapter',
      },
    });
  });

  test('retains the last successful application stage after startup completes', () => {
    const state = recovery(new MemoryStorage(), { value: 10 }, ['gpu']);
    state.begin('webgpu');
    state.stage('submit-first-frame');
    state.complete('webgpu');

    expect(state.getDiagnostics().current).toBeNull();
    expect(state.getLastStage()).toBe('submit-first-frame');
  });
});
