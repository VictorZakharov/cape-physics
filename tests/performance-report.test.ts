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
      quality: { label: 'ADAPTIVE ULTRA', scale: 1 },
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
    expect(report).toContain('138498 triangles');
    expect(report).toContain('2260 cape colliders');
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
