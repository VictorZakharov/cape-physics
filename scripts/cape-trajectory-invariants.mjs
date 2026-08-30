export const MAX_NECKLINE_ATTACHMENT_ERROR = 0.002;

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
