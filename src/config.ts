export const PHYSICS_STEP = 1 / 120;
export const MAX_FRAME_DELTA = 1 / 20;
export const MAX_PHYSICS_STEPS = 6;
export const CAMERA_NEAR_OPACITY = 0.12;

export const CAVE = {
  startZ: 18,
  endZ: -72,
  segments: 96,
  radialSegments: 36,
} as const;

export const PLAYER = {
  radius: 0.34,
  height: 1.9,
  footOffset: 0.14,
  walkSpeed: 3.45,
  runSpeed: 6.15,
  jumpSpeed: 5.2,
  gravity: 14.5,
  acceleration: 15,
  deceleration: 19,
  turnResponse: 9,
  walkTurnRate: 2.4,
  runTurnRate: 4.8,
} as const;

export const CAPE = {
  columns: 13,
  rows: 18,
  width: 0.98,
  length: 1.68,
  solverIterations: 5,
  attachment: {
    halfWidth: 0.29,
    height: 1.49,
    depth: 0.22,
    necklineRise: 0.052,
    necklineDepth: 0.05,
  },
} as const;

export const RIPPLE_CAPACITY = 16;
