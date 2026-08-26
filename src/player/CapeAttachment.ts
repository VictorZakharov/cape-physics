import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CAPE } from '../config';

export const CAPE_ATTACHMENT_FABRIC_NAME = 'Cape shoulder yoke and gathered neckline';
export const CAPE_TIES_NAME = 'Paired cape shoulder ties';

const COLLAR_HALF_WIDTH = 0.105;
const COLLAR_HEIGHT = 1.535;
const COLLAR_DEPTH = 0.008;
const COLLAR_BACK_CURVE = 0.086;
const SHOULDER_HALF_WIDTH = 0.195;
const SHOULDER_HEIGHT = 1.515;
const SHOULDER_DEPTH = 0.038;
const SHOULDER_BACK_CURVE = 0.072;
const UPPER_BACK_HALF_WIDTH = 0.275;
const UPPER_BACK_HEIGHT = 1.305;
const UPPER_BACK_DEPTH = 0.208;
const UPPER_BACK_CURVE = 0.025;

export function setCapeNecklinePoint(
  progress: number,
  target: THREE.Vector3,
): THREE.Vector3 {
  const across = THREE.MathUtils.clamp(progress, 0, 1);
  const neckline = Math.sin(across * Math.PI);
  return target.set(
    THREE.MathUtils.lerp(-CAPE.attachment.halfWidth, CAPE.attachment.halfWidth, across),
    CAPE.attachment.height + neckline * CAPE.attachment.necklineRise,
    CAPE.attachment.depth + neckline * CAPE.attachment.necklineDepth,
  );
}

export function setCapeCollarPoint(
  progress: number,
  target: THREE.Vector3,
): THREE.Vector3 {
  const across = THREE.MathUtils.clamp(progress, 0, 1);
  const neckline = Math.sin(across * Math.PI);
  return target.set(
    THREE.MathUtils.lerp(-COLLAR_HALF_WIDTH, COLLAR_HALF_WIDTH, across),
    COLLAR_HEIGHT + neckline * 0.025,
    COLLAR_DEPTH + neckline * COLLAR_BACK_CURVE,
  );
}

export function setCapeShoulderPoint(
  progress: number,
  target: THREE.Vector3,
): THREE.Vector3 {
  const across = THREE.MathUtils.clamp(progress, 0, 1);
  const neckline = Math.sin(across * Math.PI);
  return target.set(
    THREE.MathUtils.lerp(-SHOULDER_HALF_WIDTH, SHOULDER_HALF_WIDTH, across),
    SHOULDER_HEIGHT + neckline * 0.035,
    SHOULDER_DEPTH + neckline * SHOULDER_BACK_CURVE,
  );
}

export function setCapeUpperBackPoint(
  progress: number,
  target: THREE.Vector3,
): THREE.Vector3 {
  const across = THREE.MathUtils.clamp(progress, 0, 1);
  const neckline = Math.sin(across * Math.PI);
  return target.set(
    THREE.MathUtils.lerp(-UPPER_BACK_HALF_WIDTH, UPPER_BACK_HALF_WIDTH, across),
    UPPER_BACK_HEIGHT + neckline * 0.018,
    UPPER_BACK_DEPTH + neckline * UPPER_BACK_CURVE,
  );
}

export function createCapeAttachment(
  fabric: THREE.Material,
  trim: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cape shoulder attachment';

  const seamPoints = Array.from({ length: CAPE.columns }, (_, column) => (
    setCapeNecklinePoint(column / (CAPE.columns - 1), new THREE.Vector3())
  ));
  const collarPoints = Array.from({ length: CAPE.columns }, (_, column) => (
    setCapeCollarPoint(column / (CAPE.columns - 1), new THREE.Vector3())
  ));
  const seamCurve = new THREE.CatmullRomCurve3(seamPoints, false, 'centripetal');
  const collarCurve = new THREE.CatmullRomCurve3(collarPoints, false, 'centripetal');
  const yokeGeometry = createYokeGeometry();
  const necklineGeometry = new THREE.TubeGeometry(seamCurve, 28, 0.018, 7, false);
  const collarGeometry = new THREE.TubeGeometry(collarCurve, 28, 0.012, 7, false);
  const fabricGeometry = mergeGeometries([yokeGeometry, necklineGeometry, collarGeometry]);
  yokeGeometry.dispose();
  necklineGeometry.dispose();
  collarGeometry.dispose();
  if (!fabricGeometry) throw new Error('Unable to merge procedural cape attachment geometry.');
  const attachmentFabric = new THREE.Mesh(fabricGeometry, fabric);
  attachmentFabric.name = CAPE_ATTACHMENT_FABRIC_NAME;

  const leftTieGeometry = createShoulderTieGeometry(-1);
  const rightTieGeometry = createShoulderTieGeometry(1);
  const tieGeometry = mergeGeometries([leftTieGeometry, rightTieGeometry]);
  leftTieGeometry.dispose();
  rightTieGeometry.dispose();
  if (!tieGeometry) throw new Error('Unable to merge procedural cape tie geometry.');
  const ties = new THREE.Mesh(tieGeometry, trim);
  ties.name = CAPE_TIES_NAME;

  group.add(attachmentFabric, ties);
  return group;
}

function createYokeGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const point = new THREE.Vector3();
  const profileSetters = [
    setCapeCollarPoint,
    setCapeShoulderPoint,
    setCapeNecklinePoint,
    setCapeUpperBackPoint,
  ];

  for (let column = 0; column < CAPE.columns; column += 1) {
    const progress = column / (CAPE.columns - 1);
    for (let row = 0; row < profileSetters.length; row += 1) {
      profileSetters[row]!(progress, point);
      const seamOverlap = row === profileSetters.length - 2;
      positions.push(point.x, point.y - (seamOverlap ? 0.012 : 0), point.z + (seamOverlap ? 0.018 : 0));
      uvs.push(progress, 1 - row / (profileSetters.length - 1));
    }

    if (column === 0) continue;
    for (let row = 0; row < profileSetters.length - 1; row += 1) {
      const previous = (column - 1) * profileSetters.length + row;
      const current = column * profileSetters.length + row;
      indices.push(previous, previous + 1, current, previous + 1, current + 1, current);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function createShoulderTieGeometry(side: -1 | 1): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.185, 1.47, -0.105),
    new THREE.Vector3(side * 0.192, 1.505, -0.035),
    new THREE.Vector3(side * SHOULDER_HALF_WIDTH, SHOULDER_HEIGHT, SHOULDER_DEPTH),
  ], false, 'centripetal');
  return new THREE.TubeGeometry(curve, 10, 0.009, 6, false);
}
