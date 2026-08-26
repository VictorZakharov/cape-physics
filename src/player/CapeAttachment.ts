import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CAPE } from '../config';

export const CAPE_ATTACHMENT_FABRIC_NAME = 'Cape neckline seam';
export const CAPE_TIES_NAME = 'Paired cape throat ties';
export const CAPE_THROAT_CLASP_POSITION = [0, 1.505, -0.17] as const;

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

export function createCapeAttachment(
  fabric: THREE.Material,
  trim: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cape neck attachment';

  const seamPoints = Array.from({ length: CAPE.columns }, (_, column) => (
    setCapeNecklinePoint(column / (CAPE.columns - 1), new THREE.Vector3())
  ));
  const seamCurve = new THREE.CatmullRomCurve3(seamPoints, false, 'centripetal');
  const seamGeometry = new THREE.TubeGeometry(seamCurve, 28, 0.022, 7, false);
  const seam = new THREE.Mesh(seamGeometry, fabric);
  seam.name = CAPE_ATTACHMENT_FABRIC_NAME;

  const leftTieGeometry = createThroatTieGeometry(-1);
  const rightTieGeometry = createThroatTieGeometry(1);
  const tieGeometry = mergeGeometries([leftTieGeometry, rightTieGeometry]);
  leftTieGeometry.dispose();
  rightTieGeometry.dispose();
  if (!tieGeometry) throw new Error('Unable to merge procedural cape throat ties.');
  const ties = new THREE.Mesh(tieGeometry, trim);
  ties.name = CAPE_TIES_NAME;

  group.add(seam, ties);
  return group;
}

function createThroatTieGeometry(side: -1 | 1): THREE.TubeGeometry {
  const [claspX, claspY, claspZ] = CAPE_THROAT_CLASP_POSITION;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(claspX + side * 0.006, claspY, claspZ),
    new THREE.Vector3(side * 0.065, 1.52, -0.045),
    new THREE.Vector3(
      side * CAPE.attachment.halfWidth,
      CAPE.attachment.height,
      CAPE.attachment.depth,
    ),
  ], false, 'centripetal');
  return new THREE.TubeGeometry(curve, 10, 0.008, 6, false);
}
