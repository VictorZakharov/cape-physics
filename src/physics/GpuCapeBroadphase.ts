export const GPU_WORLD_CANDIDATE_REFRESH_DISTANCE = 0.35;
export const GPU_WORLD_ADJACENT_CONTACT_MARGIN = 0.95;

/**
 * Conservative distance from the cached neckline center at which a sphere
 * proxy can influence any cape particle before the candidate list refreshes.
 */
export function calculateGpuCapeSphereQueryRadius(
  maximumLength: number,
  maximumWidth: number,
  refreshDistance = GPU_WORLD_CANDIDATE_REFRESH_DISTANCE,
  adjacentContactMargin = GPU_WORLD_ADJACENT_CONTACT_MARGIN,
): number {
  return maximumLength
    + maximumWidth * 0.5
    + refreshDistance
    + adjacentContactMargin;
}
