import * as THREE from 'three';
import { CAVE } from '../config';
import { caveCenterX } from '../world/caveProfile';
import { BOT_COUNT_RANGE } from './BotMovementInput';

const ROW_SPACING = 1.55;
const PATROL_MARGIN = 6;
const GRID_LENGTH = (Math.ceil(BOT_COUNT_RANGE.max / 2) - 1) * ROW_SPACING;

/** Reserve space for the whole crowd, including its walking patrols. */
export function getBotSpawnPosition(index: number, playerZ: number): THREE.Vector3 {
  const firstRowZ = THREE.MathUtils.clamp(
    playerZ + 2 * ROW_SPACING,
    CAVE.endZ + PATROL_MARGIN + GRID_LENGTH,
    CAVE.startZ - PATROL_MARGIN,
  );
  const z = firstRowZ - Math.floor(index / 2) * ROW_SPACING;
  const side = index % 2 === 0 ? -1 : 1;
  return new THREE.Vector3(caveCenterX(z) + side * 0.82, 0, z);
}
