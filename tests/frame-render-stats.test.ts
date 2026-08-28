import { describe, expect, test } from 'bun:test';
import {
  addFrameRenderStats,
  captureFrameRenderStats,
} from '../src/core/frameRenderStats';

describe('frame render stats', () => {
  test('copies a complete frame before later renderer resets can overwrite it', () => {
    const rendererInfo = {
      calls: 84,
      triangles: 135_500,
      points: 4_096,
      lines: 12,
    };
    const snapshot = captureFrameRenderStats(rendererInfo);

    rendererInfo.calls = 1;
    rendererInfo.triangles = 1;

    expect(snapshot).toEqual({
      calls: 84,
      triangles: 135_500,
      points: 4_096,
      lines: 12,
    });
  });

  test('reads draw calls from the universal WebGPU renderer stats shape', () => {
    expect(captureFrameRenderStats({
      drawCalls: 91,
      triangles: 142_300,
      points: 620,
      lines: 0,
    })).toEqual({
      calls: 91,
      triangles: 142_300,
      points: 620,
      lines: 0,
    });
  });

  test('combines direct and cached-bundle workload', () => {
    expect(addFrameRenderStats(
      { calls: 30, triangles: 33_415, points: 10, lines: 4 },
      { calls: 72, triangles: 90_996, points: 0, lines: 0 },
    )).toEqual({
      calls: 102,
      triangles: 124_411,
      points: 10,
      lines: 4,
    });
  });
});
