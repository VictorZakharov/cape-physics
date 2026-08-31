export interface CapeVerletAxisState {
  readonly currentPosition: number;
  readonly previousPosition: number;
  readonly dragPerSecond: number;
  readonly deltaTime: number;
  readonly acceleration?: number;
}

export interface CapeVerletAxisPrediction {
  readonly predictedPosition: number;
  readonly storedPreviousPosition: number;
}

/**
 * Scalar reference for the world-space Verlet prediction shared by the cape
 * backends. Character/anchor displacement is deliberately absent: only pinned
 * particles receive new anchor positions, and constraints propagate their pull
 * through the free cloth.
 */
export function predictCapeVerletAxis({
  currentPosition,
  previousPosition,
  dragPerSecond,
  deltaTime,
  acceleration = 0,
}: CapeVerletAxisState): CapeVerletAxisPrediction {
  const velocity = (currentPosition - previousPosition)
    * Math.exp(-dragPerSecond * deltaTime);
  return {
    predictedPosition:
      currentPosition + velocity + acceleration * deltaTime * deltaTime,
    storedPreviousPosition: currentPosition,
  };
}
