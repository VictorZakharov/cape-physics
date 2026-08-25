export const MAX_RENDER_PIXELS = 3_600_000;
export const MAX_DEVICE_PIXEL_RATIO = 1.5;

export interface RenderSizing {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
  readonly drawingBufferWidth: number;
  readonly drawingBufferHeight: number;
  readonly renderPixels: number;
}

export function calculateRenderSizing(
  width: number,
  height: number,
  devicePixelRatio: number,
  qualityScale: number,
): RenderSizing {
  // The composer uses half-float multisampled targets plus bloom mips. Budget
  // physical pixels directly so a high-DPI 4K screen cannot cause VRAM churn.
  const safeWidth = Math.max(1, Math.floor(width));
  const safeHeight = Math.max(1, Math.floor(height));
  const cssPixels = safeWidth * safeHeight;
  const nativeRatio = Math.min(Math.max(devicePixelRatio, 0.25), MAX_DEVICE_PIXEL_RATIO);
  const budgetRatio = Math.sqrt(MAX_RENDER_PIXELS / cssPixels);
  const baseRatio = Math.min(nativeRatio, budgetRatio);
  const pixelRatio = Math.max(0.25, baseRatio * Math.min(Math.max(qualityScale, 0.5), 1));
  const drawingBufferWidth = Math.max(1, Math.floor(safeWidth * pixelRatio));
  const drawingBufferHeight = Math.max(1, Math.floor(safeHeight * pixelRatio));

  return {
    width: safeWidth,
    height: safeHeight,
    pixelRatio,
    drawingBufferWidth,
    drawingBufferHeight,
    renderPixels: drawingBufferWidth * drawingBufferHeight,
  };
}
