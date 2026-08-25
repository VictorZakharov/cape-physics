import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CAPE } from '../config';

export const CAPE_ATTACHMENT_FABRIC_NAME = 'Cape shoulder yoke and gathered neckline';
export const CAPE_TIES_NAME = 'Paired cape shoulder ties';

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
  group.name = 'Cape shoulder attachment';

  const seamPoints = Array.from({ length: CAPE.columns }, (_, column) => (
    setCapeNecklinePoint(column / (CAPE.columns - 1), new THREE.Vector3())
  ));
  const seamCurve = new THREE.CatmullRomCurve3(seamPoints, false, 'centripetal');
  const yokeGeometry = createYokeGeometry();
  const necklineGeometry = new THREE.TubeGeometry(seamCurve, 28, 0.018, 7, false);
  const fabricGeometry = mergeGeometries([yokeGeometry, necklineGeometry]);
  yokeGeometry.dispose();
  necklineGeometry.dispose();
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
  const seam = new THREE.Vector3();

  for (let column = 0; column < CAPE.columns; column += 1) {
    const progress = column / (CAPE.columns - 1);
    const neckline = Math.sin(progress * Math.PI);
    const innerX = THREE.MathUtils.lerp(-0.22, 0.22, progress);

    positions.push(
      innerX,
      1.495 + neckline * 0.045,
      0.025 + neckline * 0.085,
    );
    uvs.push(progress, 1);

    setCapeNecklinePoint(progress, seam);
    positions.push(seam.x, seam.y - 0.006, seam.z + 0.028);
    uvs.push(progress, 0);

    if (column === 0) continue;
    const previousInner = (column - 1) * 2;
    const previousSeam = previousInner + 1;
    const inner = column * 2;
    const outer = inner + 1;
    indices.push(previousInner, previousSeam, inner, previousSeam, outer, inner);
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
    new THREE.Vector3(side * 0.205, 1.515, -0.02),
    new THREE.Vector3(side * 0.23, 1.505, 0.105),
    new THREE.Vector3(side * CAPE.attachment.halfWidth, CAPE.attachment.height, CAPE.attachment.depth),
  ], false, 'centripetal');
  return new THREE.TubeGeometry(curve, 14, 0.011, 6, false);
}
