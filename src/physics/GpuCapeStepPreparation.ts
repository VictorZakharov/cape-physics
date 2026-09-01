import * as THREE from 'three';
import { CAPE, PLAYER } from '../config';
import type { CapeAnchors } from '../player/Character';
import { setCapeAnchorTarget } from './CapeInitialState';
import { WAKE_SPEED } from './CapeSolverConstants';

export function prepareGpuCapeDynamics(
  target: THREE.Vector4,
  characterVelocity: THREE.Vector3,
  time: number,
): number {
  const characterSpeed = characterVelocity.length();
  const planarSpeed = Math.hypot(characterVelocity.x, characterVelocity.z);
  const movementBlend = THREE.MathUtils.smoothstep(characterSpeed, WAKE_SPEED, 2.4);
  const runningBlend = THREE.MathUtils.smoothstep(
    planarSpeed,
    PLAYER.walkSpeed * 1.02,
    PLAYER.runSpeed * 0.92,
  );
  const locomotionAirflow = THREE.MathUtils.lerp(0.28, 1, runningBlend);
  const velocityAirflow = THREE.MathUtils.lerp(0.32, 1.28, runningBlend);
  target.set(
    Math.sin(time * 0.47) * 0.38 + Math.sin(time * 1.91) * 0.16,
    0.08 + Math.sin(time * 0.71) * 0.05,
    0.62 + Math.cos(time * 0.31) * 0.24,
    movementBlend,
  );
  target.multiplyScalar(THREE.MathUtils.lerp(0.025, locomotionAirflow, movementBlend));
  target.x += characterVelocity.x * -velocityAirflow;
  target.y += characterVelocity.y * -velocityAirflow;
  target.z += characterVelocity.z * -velocityAirflow;
  target.w = movementBlend;
  return characterSpeed;
}

export function packGpuCapeAnchors(
  anchorStateValues: readonly THREE.Vector4[],
  anchorValues: readonly THREE.Vector4[],
  capeIndex: number,
  anchors: CapeAnchors,
  anchorTarget: THREE.Vector3,
): THREE.Vector4 {
  const center = anchorStateValues[capeIndex]!;
  center.set(
    (anchors.left.x + anchors.right.x) * 0.5,
    (anchors.left.y + anchors.right.y) * 0.5,
    (anchors.left.z + anchors.right.z) * 0.5,
    center.w,
  );
  for (let column = 0; column < CAPE.columns; column += 1) {
    setCapeAnchorTarget(anchors, column / (CAPE.columns - 1), anchorTarget);
    anchorValues[capeIndex * CAPE.columns + column]!.set(
      anchorTarget.x,
      anchorTarget.y,
      anchorTarget.z,
      0,
    );
  }
  return center;
}

export function cloneCapeAnchors(anchors: CapeAnchors): CapeAnchors {
  return {
    left: anchors.left.clone(),
    right: anchors.right.clone(),
    back: anchors.back.clone(),
  };
}
