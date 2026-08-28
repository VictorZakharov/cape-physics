export interface FrameRenderStats {
  readonly calls: number;
  readonly triangles: number;
  readonly points: number;
  readonly lines: number;
}

interface RenderInfoLike {
  readonly calls?: number;
  readonly drawCalls?: number;
  readonly triangles: number;
  readonly points: number;
  readonly lines: number;
}

export const EMPTY_FRAME_RENDER_STATS: FrameRenderStats = Object.freeze({
  calls: 0,
  triangles: 0,
  points: 0,
  lines: 0,
});

export function captureFrameRenderStats(render: RenderInfoLike): FrameRenderStats {
  return {
    calls: render.drawCalls ?? render.calls ?? 0,
    triangles: render.triangles,
    points: render.points,
    lines: render.lines,
  };
}

export function addFrameRenderStats(
  first: FrameRenderStats,
  second: FrameRenderStats,
): FrameRenderStats {
  return {
    calls: first.calls + second.calls,
    triangles: first.triangles + second.triangles,
    points: first.points + second.points,
    lines: first.lines + second.lines,
  };
}
