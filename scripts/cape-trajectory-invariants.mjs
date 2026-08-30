export const MAX_NECKLINE_ATTACHMENT_ERROR = 0.002;
export const MIN_TRAVELLING_WAVE_RATIO = 0.7;
export const MIN_TRAVELLING_WAVE_TWIST = 0.04;

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
    return;
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
