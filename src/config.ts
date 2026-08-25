export const PHYSICS_STEP = 1 / 120;
export const MAX_FRAME_DELTA = 1 / 20;
export const MAX_PHYSICS_STEPS = 6;

export const CAVE = {
  startZ: 18,
  endZ: -72,
  segments: 96,
  radialSegments: 36,
} as const;

export const PLAYER = {
  radius: 0.34,
  height: 1.82,
  footOffset: 0.14,
  walkSpeed: 3.45,
  runSpeed: 6.15,
  acceleration: 15,
  deceleration: 19,
  turnSpeed: 14,
} as const;

export const CAPE = {
  columns: 13,
  rows: 18,
  width: 0.98,
  length: 1.4,
  solverIterations: 5,
} as const;

export const RIPPLE_CAPACITY = 16;
