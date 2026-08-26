import { PLAYER } from '../config';
import { caveCenterX, caveHalfWidth } from './caveProfile';

export type CapeContactRockSize = 'large' | 'small';

export interface CapeContactRockSpec {
  readonly size: CapeContactRockSize;
  readonly z: number;
  readonly lateralOffset: number;
  readonly scale: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly embedDepth: number;
}

export interface CapeContactRockPlacement {
  readonly size: CapeContactRockSize;
  readonly walkable: boolean;
  readonly position: readonly [number, number, number];
  readonly lateralOffset: number;
  readonly scale: readonly [number, number, number];
  readonly openLaneWidth: number;
}

const ROCK_RADIUS = 0.42;
const PLAYER_WALL_MARGIN = PLAYER.radius + 0.42;
const CONTACT_PADDING = 0.08;

export const MINIMUM_CONTACT_COURSE_LANE_WIDTH = PLAYER.radius * 2 + 0.25;

export const CAPE_CONTACT_ROCKS: readonly CapeContactRockSpec[] = [
  {
    size: 'large',
    z: 3.1,
    lateralOffset: -0.82,
    scale: [1.65, 1.35, 1.05],
    rotation: [0.16, 0.48, -0.1],
    embedDepth: 0.08,
  },
  {
    size: 'small',
    z: 1.2,
    lateralOffset: 0.44,
    scale: [0.55, 0.48, 0.62],
    rotation: [-0.08, 1.12, 0.2],
    embedDepth: 0.035,
  },
  {
    size: 'large',
    z: -0.9,
    lateralOffset: 0.94,
    scale: [1.12, 1.05, 0.78],
    rotation: [0.24, 2.08, -0.14],
    embedDepth: 0.065,
  },
  {
    size: 'small',
    z: -2.9,
    lateralOffset: -0.4,
    scale: [0.48, 0.38, 0.7],
    rotation: [0.12, 2.72, 0.08],
    embedDepth: 0.03,
  },
  {
    size: 'large',
    z: -5.0,
    lateralOffset: -0.98,
    scale: [1.38, 1.08, 1.48],
    rotation: [-0.18, 0.86, 0.14],
    embedDepth: 0.075,
  },
  {
    size: 'small',
    z: -6.8,
    lateralOffset: 0.5,
    scale: [0.64, 0.46, 0.52],
    rotation: [0.18, 1.66, -0.16],
    embedDepth: 0.035,
  },
] as const;

export function getCapeContactRockX(spec: CapeContactRockSpec): number {
  return caveCenterX(spec.z) + spec.lateralOffset;
}

export function getCapeContactRockOpenLaneWidth(spec: CapeContactRockSpec): number {
  const traversableHalfWidth = caveHalfWidth(spec.z) - PLAYER_WALL_MARGIN;
  const conservativeRockRadius = ROCK_RADIUS * Math.max(...spec.scale)
    + PLAYER.radius
    + CONTACT_PADDING;
  const leftLane = traversableHalfWidth + spec.lateralOffset - conservativeRockRadius;
  const rightLane = traversableHalfWidth - spec.lateralOffset - conservativeRockRadius;
  return Math.max(leftLane, rightLane);
}
