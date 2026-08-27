export interface FrameRenderStats {
  readonly calls: number;
  readonly triangles: number;
  readonly points: number;
  readonly lines: number;
}

interface RenderInfoLike {
  readonly calls: number;
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
    calls: render.calls,
    triangles: render.triangles,
    points: render.points,
    lines: render.lines,
  };
}
