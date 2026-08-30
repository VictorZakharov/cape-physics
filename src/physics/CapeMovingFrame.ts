export interface CapeMovingFrameAxisState {
  readonly currentPosition: number;
  readonly previousPosition: number;
  readonly frameDisplacement: number;
  readonly previousFrameDisplacement: number;
}

export interface CapeMovingFrameAxisPrediction {
  readonly predictedPosition: number;
  readonly storedPreviousPosition: number;
  readonly frameAccelerationDisplacement: number;
}

/**
 * Scalar reference for the WebGPU Verlet moving-frame prediction.
 *
 * Both stored positions are advected by the current character displacement so
 * that transport does not manufacture cloth velocity. The displacement delta
 * is then removed once, preserving world-space inertia when movement starts,
 * stops, or reverses.
 */
export function predictCapeMovingFrameAxis({
  currentPosition,
  previousPosition,
  frameDisplacement,
  previousFrameDisplacement,
}: CapeMovingFrameAxisState): CapeMovingFrameAxisPrediction {
  const advectedCurrent = currentPosition + frameDisplacement;
  const advectedPrevious = previousPosition + frameDisplacement;
  const velocity = advectedCurrent - advectedPrevious;
  const frameAccelerationDisplacement = frameDisplacement - previousFrameDisplacement;
  return {
    predictedPosition:
      advectedCurrent + velocity - frameAccelerationDisplacement,
    storedPreviousPosition: advectedCurrent,
    frameAccelerationDisplacement,
  };
}
