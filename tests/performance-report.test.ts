import { describe, expect, test } from 'bun:test';
import { copyText } from '../src/core/clipboard';
import { formatPerformanceReport } from '../src/core/PerformanceReport';

describe('performance report', () => {
  test('formats the rolling FPS, renderer, quality, and scene diagnostics', () => {
    const input = {
      capturedAt: '2026-08-25T18:00:00.000Z',
      performance: {
        averageFps: 143.2,
        onePercentLow: 118.4,
        averageFrameTime: 6.98,
        medianFrameTime: 6.82,
        p95FrameTime: 8.1,
        p99FrameTime: 8.45,
        refreshEstimate: 144,
        longFrameCount: 1,
        longestFrameTime: 54.2,
        sampleCount: 2_144,
        windowElapsedMilliseconds: 15_000,
      },
      rendererStartup: {
        current: null,
        automaticReloads: 0,
        recoveryPending: false,
        failures: [{
          attemptId: 'gpu-attempt',
          renderer: 'webgpu',
          stage: 'request-webgpu-device',
          name: 'WebGpuBootstrapError',
          message: 'The browser rejected the WebGPU device request.',
          stack: null,
          occurredAt: 1,
          userAgent: 'Test Browser',
          pageUrl: 'https://example.test/?renderer=webgpu',
          recoveredWith: 'webgl',
          recoveredAt: 2,
        }],
      },
      renderer: {
        backend: 'WebGL 2.0',
        vendor: 'Example Vendor',
        device: 'Example GPU',
        preference: 'webgpu',
        actual: 'webgl',
        fallback: true,
        drawCalls: 74,
        triangles: 138_498,
        programs: 40,
      },
      canvas: {
        drawingBufferWidth: 1600,
        drawingBufferHeight: 900,
        cssWidth: 1600,
        cssHeight: 900,
      },
      quality: { label: 'ADAPTIVE ULTRA', scale: 1, targetResizes: 2 },
      workload: {
        averageMainThreadMilliseconds: 5.4,
        p95MainThreadMilliseconds: 8.2,
        averagePhysicsMilliseconds: 2.7,
        averageSceneMilliseconds: 0.4,
        averageRenderMilliseconds: 2.3,
        averagePhysicsSteps: 1.98,
        maximumPhysicsSteps: 3,
        sampleCount: 900,
      },
      capeSolver: {
        implementation: 'cpu-pbd',
        sampleIntervalSteps: 32,
        totalSteps: 3_840,
        activeSteps: 3_600,
        sampledActiveSteps: 113,
        averageStepMilliseconds: 1.35,
        phases: {
          prediction: 0.08,
          constraints: 0.4,
          selfCollision: 0.31,
          foldGuard: 0.02,
          bodyCollision: 0.19,
          worldCollision: 0.22,
          caveCollision: 0.06,
          reconciliation: 0.04,
          anchors: 0.01,
          finalization: 0.02,
        },
      },
      scene: {
        simulationSeconds: 32.5,
        capeSleeping: false,
        worldColliders: 2_260,
        activeRipples: 7,
        botCount: 6,
        simulatedCapes: 7,
      },
      page: {
        visibility: 'visible',
        focused: true,
        devicePixelRatio: 1,
        multipleScreens: null,
        url: 'https://example.test/cape-physics/',
      },
      runtime: {
        platform: 'Test OS',
        userAgent: 'Test Browser',
      },
    } as const;
    const report = formatPerformanceReport(input);

    expect(report).toContain('Cape Physics performance report');
    expect(report).toContain('Rendered FPS: 143.20 average | 118.40 1% low');
    expect(report).toContain('Frame interval: 6.98 ms average | p50 6.82 ms');
    expect(report).toContain('Renderer: WebGL 2.0 | Example Vendor | Example GPU');
    expect(report).toContain('Renderer selection: requested WEBGPU | active WEBGL | fallback active');
    expect(report).toContain('Renderer recovery: WEBGPU failed at request-webgpu-device');
    expect(report).toContain('recovered with WEBGL');
    expect(report).toContain('138498 triangles');
    expect(report).toContain('6 performance bots | 7 simulated capes');
    expect(report).toContain('2260 cape colliders/cape');
    expect(report).toContain('Main thread: 5.40 ms average | p95 8.20 ms');
    expect(report).toContain('Timing caveat: display FPS is refresh/vsync capped');
    expect(report).toContain('sequential CPU PBD Gauss-Seidel at 120 Hz');
    expect(report).toContain('sampled 1/32 active steps (113 samples)');
    expect(report).toContain('main-thread render submission is not GPU completion');
    expect(report).not.toContain('undefined');

    const gpuReport = formatPerformanceReport({
      ...input,
      renderer: {
        ...input.renderer,
        backend: 'WebGPU',
        actual: 'webgpu',
        fallback: false,
      },
      capeSolver: {
        ...input.capeSolver,
        implementation: 'webgpu-compute',
        dispatchesPerStep: 46,
        constraintColorBatches: 17,
      },
    });
    expect(gpuReport).toContain('10 PBD iterations with 17 constraint colors');
    expect(gpuReport).toContain('46 dispatches in 1 compute submission/step');
    expect(gpuReport).not.toContain('25 dispatches');
  });

  test('reports WebGL bot worker utilization separately from player physics', () => {
    const report = formatPerformanceReport({
      capturedAt: '2026-08-31T18:00:00.000Z',
      performance: {
        averageFps: 120,
        onePercentLow: 100,
        averageFrameTime: 8.33,
        medianFrameTime: 8.2,
        p95FrameTime: 9,
        p99FrameTime: 10,
        refreshEstimate: 144,
        longFrameCount: 0,
        longestFrameTime: 12,
        sampleCount: 1_800,
        windowElapsedMilliseconds: 15_000,
      },
      renderer: {
        backend: 'WebGL 2.0',
        vendor: 'Vendor',
        device: 'GPU',
        preference: 'webgl',
        actual: 'webgl',
        fallback: false,
        drawCalls: 200,
        triangles: 300_000,
        programs: 41,
      },
      canvas: {
        drawingBufferWidth: 1920,
        drawingBufferHeight: 1080,
        cssWidth: 1920,
        cssHeight: 1080,
      },
      quality: { label: 'ADAPTIVE HIGH', scale: 0.9, targetResizes: 1 },
      workload: {
        averageMainThreadMilliseconds: 3,
        p95MainThreadMilliseconds: 4,
        averagePhysicsMilliseconds: 1.2,
        averageSceneMilliseconds: 0.3,
        averageRenderMilliseconds: 1.5,
        averagePhysicsSteps: 1,
        maximumPhysicsSteps: 2,
        sampleCount: 1_800,
      },
      capeSolver: {
        implementation: 'cpu-pbd',
        sampleIntervalSteps: 32,
        totalSteps: 1_800,
        activeSteps: 1_800,
        sampledActiveSteps: 56,
        averageStepMilliseconds: 2.8,
        phases: {
          prediction: 0.1,
          constraints: 0.3,
          selfCollision: 0.7,
          foldGuard: 0.1,
          bodyCollision: 0.8,
          worldCollision: 0.2,
          caveCollision: 0.4,
          reconciliation: 0.2,
          anchors: 0,
          finalization: 0,
        },
      },
      capeWorkers: {
        active: true,
        workers: 8,
        busyWorkers: 6,
        queuedSteps: 2,
        failure: null,
      },
      scene: {
        simulationSeconds: 15,
        capeSleeping: false,
        worldColliders: 2_062,
        activeRipples: 0,
        botCount: 10,
        simulatedCapes: 11,
      },
      page: {
        visibility: 'visible',
        focused: true,
        devicePixelRatio: 1,
        multipleScreens: false,
        url: 'https://example.test/',
      },
      runtime: { platform: 'Test', userAgent: 'Test' },
    });

    expect(report).toContain('player on main thread, bots across 8 workers');
    expect(report).toContain('Cape workers: 8 active | 6 busy | 2 queued fixed steps | healthy');
  });

  test('writes the report through the asynchronous Clipboard API', async () => {
    let copied = '';
    await copyText('diagnostic payload', {
      clipboard: {
        writeText: async (text) => {
          copied = text;
        },
      },
      document: {} as Document,
    });

    expect(copied).toBe('diagnostic payload');
  });
});
