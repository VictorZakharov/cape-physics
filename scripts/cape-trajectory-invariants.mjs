export const MAX_NECKLINE_ATTACHMENT_ERROR = 0.002;
export const MIN_TRAVELLING_WAVE_RATIO = 0.7;
export const MIN_TRAVELLING_WAVE_TWIST = 0.04;
export const MIN_TRAVELLING_WAVE_SHAPE_CHANGE_RATIO = 0.7;
export const MIN_TRAVELLING_WAVE_SHAPE_CHANGE = 0.000_05;

/**
 * Measures temporal cloth deformation rather than whole-cape travel. The
 * second difference of row centers is invariant to rigid translation and a
 * straight sheet's rotation, so a permanently bent or airborne pose cannot
 * masquerade as a travelling cloth wave.
 */
export function measureAverageCenterlineShapeChange({
  samples,
  columns,
  rows,
  startFrame = Number.NEGATIVE_INFINITY,
}) {
  if (!Number.isInteger(columns) || columns < 1 || !Number.isInteger(rows) || rows < 3) {
    throw new RangeError('Centerline shape change requires a grid with at least three rows.');
  }
  const curvature = new Float64Array(rows - 2);
  const previousCurvature = new Float64Array(curvature.length);
  const rowCenters = new Float64Array(rows * 3);
  let previousFrame = 0;
  let hasPrevious = false;
  let squaredChange = 0;
  let changeCount = 0;

  for (const sample of samples) {
    if (sample.frame < startFrame) continue;
    const particles = sample.particles;
    if (!particles || particles.length < columns * rows * 3) return Number.NaN;
    rowCenters.fill(0);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const particleOffset = (row * columns + column) * 3;
        const centerOffset = row * 3;
        rowCenters[centerOffset] += particles[particleOffset] / columns;
        rowCenters[centerOffset + 1] += particles[particleOffset + 1] / columns;
        rowCenters[centerOffset + 2] += particles[particleOffset + 2] / columns;
      }
    }
    for (let row = 1; row < rows - 1; row += 1) {
      const previousRowOffset = (row - 1) * 3;
      const rowOffset = row * 3;
      const nextRowOffset = (row + 1) * 3;
      const curvatureX = rowCenters[previousRowOffset]
        - 2 * rowCenters[rowOffset]
        + rowCenters[nextRowOffset];
      const curvatureY = rowCenters[previousRowOffset + 1]
        - 2 * rowCenters[rowOffset + 1]
        + rowCenters[nextRowOffset + 1];
      const curvatureZ = rowCenters[previousRowOffset + 2]
        - 2 * rowCenters[rowOffset + 2]
        + rowCenters[nextRowOffset + 2];
      curvature[row - 1] = Math.hypot(curvatureX, curvatureY, curvatureZ);
    }
    if (hasPrevious) {
      const physicsSteps = Math.max(1, sample.frame - previousFrame);
      for (let index = 0; index < curvature.length; index += 1) {
        const delta = (curvature[index] - previousCurvature[index]) / physicsSteps;
        squaredChange += delta * delta;
        changeCount += 1;
      }
    }
    previousCurvature.set(curvature);
    previousFrame = sample.frame;
    hasPrevious = true;
  }
  return changeCount > 0 ? Math.sqrt(squaredChange / changeCount) : 0;
}

export function validateNecklineAttachment({
  scenario,
  renderer,
  maximumError,
}) {
  if (
    Number.isFinite(maximumError)
    && maximumError <= MAX_NECKLINE_ATTACHMENT_ERROR
  ) {
    return;
  }

  const formattedError = Number.isFinite(maximumError)
    ? `${maximumError.toFixed(4)} m`
    : String(maximumError);
  throw new Error(
    `Cape trajectory audit failed: ${scenario} ${renderer} detached its neckline by `
      + formattedError,
  );
}

export function validateTravellingWave({
  scenario,
  webglAverageRowTwist,
  webgpuAverageRowTwist,
  webglAverageShapeChange,
  webgpuAverageShapeChange,
}) {
  const minimumWebGpuTwist = Math.max(
    MIN_TRAVELLING_WAVE_TWIST,
    webglAverageRowTwist * MIN_TRAVELLING_WAVE_RATIO,
  );
  if (
    Number.isFinite(webglAverageRowTwist)
    && Number.isFinite(webgpuAverageRowTwist)
    && webgpuAverageRowTwist >= minimumWebGpuTwist
  ) {
    const minimumWebGpuShapeChange = Math.max(
      MIN_TRAVELLING_WAVE_SHAPE_CHANGE,
      webglAverageShapeChange * MIN_TRAVELLING_WAVE_SHAPE_CHANGE_RATIO,
    );
    if (
      Number.isFinite(webglAverageShapeChange)
      && Number.isFinite(webgpuAverageShapeChange)
      && webgpuAverageShapeChange >= minimumWebGpuShapeChange
    ) return;

    const formattedGpuShapeChange = Number.isFinite(webgpuAverageShapeChange)
      ? webgpuAverageShapeChange.toFixed(6)
      : String(webgpuAverageShapeChange);
    throw new Error(
      `Cape trajectory audit failed: ${scenario} WebGPU moved as a rigid sheet `
        + `(average centerline shape change ${formattedGpuShapeChange}, minimum `
        + `${minimumWebGpuShapeChange.toFixed(6)})`,
    );
  }

  const formattedGpuTwist = Number.isFinite(webgpuAverageRowTwist)
    ? webgpuAverageRowTwist.toFixed(4)
    : String(webgpuAverageRowTwist);
  throw new Error(
    `Cape trajectory audit failed: ${scenario} WebGPU lost its travelling cloth wave `
      + `(average row twist ${formattedGpuTwist}, minimum `
      + `${minimumWebGpuTwist.toFixed(4)})`,
  );
}
