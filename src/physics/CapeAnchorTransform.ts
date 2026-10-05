import * as THREE from 'three';
import type { CapeAnchors } from '../player/Character';

const sourceBasis = new THREE.Matrix4();
const targetBasis = new THREE.Matrix4();
const right = new THREE.Vector3();
const up = new THREE.Vector3();
const back = new THREE.Vector3();

function setAnchorBasis(anchors: CapeAnchors, matrix: THREE.Matrix4): void {
  right.subVectors(anchors.right, anchors.left).normalize();
  up.crossVectors(anchors.back, right).normalize();
  back.crossVectors(right, up).normalize();
  matrix.makeBasis(right, up, back);
}

/** Rigidly carry a delayed cape shape with its owner's current neckline. */
export function getCapeAnchorTransform(
  source: CapeAnchors,
  target: CapeAnchors,
  matrix: THREE.Matrix4,
): THREE.Matrix4 {
  setAnchorBasis(source, sourceBasis);
  setAnchorBasis(target, targetBasis);
  matrix.multiplyMatrices(targetBasis, sourceBasis.transpose());
  const x = (source.left.x + source.right.x) * 0.5;
  const y = (source.left.y + source.right.y) * 0.5;
  const z = (source.left.z + source.right.z) * 0.5;
  const elements = matrix.elements;
  elements[12] = (target.left.x + target.right.x) * 0.5
    - (elements[0]! * x + elements[4]! * y + elements[8]! * z);
  elements[13] = (target.left.y + target.right.y) * 0.5
    - (elements[1]! * x + elements[5]! * y + elements[9]! * z);
  elements[14] = (target.left.z + target.right.z) * 0.5
    - (elements[2]! * x + elements[6]! * y + elements[10]! * z);
  return matrix;
}
