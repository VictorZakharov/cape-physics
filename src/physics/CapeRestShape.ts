import * as THREE from 'three';
import { CAPE } from '../config';

const SHOULDER_WIDTH = 0.5;
const SHOULDER_EXPANSION_END = 0.1;
const BODY_DRAPE_SEAM_DEPTH = 0.14;

export function getCapeRestWidth(anchorWidth: number, down: number): number {
  const normalizedDown = THREE.MathUtils.clamp(down, 0, 1);
  const shoulderBlend = THREE.MathUtils.smoothstep(
    normalizedDown,
    0,
    SHOULDER_EXPANSION_END,
  );
  const shoulderTarget = Math.max(anchorWidth, SHOULDER_WIDTH);
  const shoulderWidth = THREE.MathUtils.lerp(anchorWidth, shoulderTarget, shoulderBlend);
  const lowerFlare = normalizedDown * normalizedDown * (3 - 2 * normalizedDown);
  return THREE.MathUtils.lerp(shoulderWidth, CAPE.width * 1.16, lowerFlare);
}

export function getCapeRestBackOffset(down: number, across: number): number {
  const normalizedDown = THREE.MathUtils.clamp(down, 0, 1);
  const centered = 1 - Math.abs(THREE.MathUtils.clamp(across, -0.5, 0.5)) * 2;
  const establishedBodyDrape = BODY_DRAPE_SEAM_DEPTH - CAPE.attachment.depth
    + 0.045
    + normalizedDown * 0.18
    + (1 - normalizedDown) ** 2 * centered * 0.035;
  const neckDrape = 0.03
    + normalizedDown * 0.04
    + (1 - normalizedDown) ** 2 * centered * 0.075;
  const firstFreeRow = 1 / (CAPE.rows - 1);
  const bodyDrapeRow = 3 / (CAPE.rows - 1);
  const bodyBlend = THREE.MathUtils.smoothstep(
    normalizedDown,
    firstFreeRow,
    bodyDrapeRow,
  );
  return THREE.MathUtils.lerp(neckDrape, establishedBodyDrape, bodyBlend);
}
