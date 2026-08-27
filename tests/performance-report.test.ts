import { describe, expect, test } from 'bun:test';
import { copyText } from '../src/core/clipboard';
import { formatPerformanceReport } from '../src/core/PerformanceReport';

describe('performance report', () => {
  test('formats the rolling FPS, renderer, quality, and scene diagnostics', () => {
    const report = formatPerformanceReport({
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
    });

    expect(report).toContain('Cape Physics performance report');
    expect(report).toContain('Rendered FPS: 143.20 average | 118.40 1% low');
    expect(report).toContain('Frame interval: 6.98 ms average | p50 6.82 ms');
    expect(report).toContain('Renderer: WebGL 2.0 | Example Vendor | Example GPU');
    expect(report).toContain('Renderer selection: requested WEBGPU | active WEBGL | fallback active');
    expect(report).toContain('138498 triangles');
    expect(report).toContain('2260 cape colliders');
    expect(report).toContain('Main thread: 5.40 ms average | p95 8.20 ms');
    expect(report).toContain('sequential PBD Gauss-Seidel at 120 Hz');
    expect(report).toContain('sampled 1/32 active steps (113 samples)');
    expect(report).toContain('render submission is main-thread time');
    expect(report).toContain('physical panel measurements');
    expect(report).not.toContain('undefined');
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
