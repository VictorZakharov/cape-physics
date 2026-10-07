import { expect, test } from 'bun:test';
import { GpuTimingWindow, WebGlGpuTimer } from '../src/core/GpuTiming';
test('GPU timings reject warm-up and stale asynchronous epochs and expire after 15s', () => {
  const timer = new GpuTimingWindow('test'); timer.reset(0, 1000); const old = timer.epoch;
  timer.record(90, old, 500); expect(timer.getSnapshot(500).sampleCount).toBe(0);
  timer.record(3, old, 1500); timer.record(5, old, 2000);
  expect(timer.getSnapshot(2000).averageMilliseconds).toBe(4);
  timer.reset(2500, 0); timer.record(999, old, 3000);
  expect(timer.getSnapshot(3000).sampleCount).toBe(0);
  timer.record(4, timer.epoch, 4000);
  expect(timer.getSnapshot(20000).sampleCount).toBe(0);
});

test('WebGL queries poll without reading unavailable results and discard disjoint timings', () => {
  let available = false, disjoint = false, reads = 0, deleted = 0;
  const gl = {
    QUERY_RESULT_AVAILABLE: 1, QUERY_RESULT: 2,
    getExtension: () => ({ TIME_ELAPSED_EXT: 3, GPU_DISJOINT_EXT: 4 }),
    isContextLost: () => false, getParameter: () => disjoint,
    createQuery: () => ({}), beginQuery: () => {}, endQuery: () => {},
    getQueryParameter: (_query: unknown, parameter: number) => {
      if (parameter === 1) return available;
      reads++; return 4000000;
    }, deleteQuery: () => { deleted++; },
  } as unknown as WebGL2RenderingContext;
  const timer = new WebGlGpuTimer(gl);
  timer.begin(); timer.end(); timer.begin(); timer.end();
  expect(reads).toBe(0);
  available = true; timer.begin(); timer.end();
  expect(timer.window.getSnapshot().averageMilliseconds).toBe(4);
  disjoint = true; timer.begin();
  expect(timer.window.getSnapshot().sampleCount).toBe(0);
  expect(deleted).toBe(3);
  timer.dispose();
});
