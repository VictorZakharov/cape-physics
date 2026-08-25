import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const FACE_NAME = 'Traveller face';
export const HELMET_SHELL_NAME = 'Fitted helmet shell and cheek guards';
export const HELMET_TRIM_NAME = 'Flush helmet brow and temple trim';

export function createProceduralHead(
  skin: THREE.Material,
  helmet: THREE.Material,
  trim: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Proportioned procedural head';

  const faceParts = [
    transformGeometry(
      new THREE.SphereGeometry(0.155, 20, 14),
      new THREE.Vector3(0, 1.69, -0.004),
      new THREE.Vector3(0.82, 1.08, 0.88),
    ),
    transformGeometry(
      new THREE.ConeGeometry(0.023, 0.055, 7),
      new THREE.Vector3(0, 1.68, -0.137),
      new THREE.Vector3(1, 1, 1),
      new THREE.Euler(-Math.PI / 2, 0, 0),
    ),
    transformGeometry(
      new THREE.SphereGeometry(0.024, 8, 6),
      new THREE.Vector3(-0.118, 1.69, -0.002),
      new THREE.Vector3(0.55, 1, 0.72),
    ),
    transformGeometry(
      new THREE.SphereGeometry(0.024, 8, 6),
      new THREE.Vector3(0.118, 1.69, -0.002),
      new THREE.Vector3(0.55, 1, 0.72),
    ),
  ];
  const faceGeometry = mergeAndDispose(faceParts, 'face');
  const face = new THREE.Mesh(faceGeometry, skin);
  face.name = FACE_NAME;

  const shellParts = [
    transformGeometry(
      new THREE.SphereGeometry(0.176, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.47),
      new THREE.Vector3(0, 1.72, 0),
      new THREE.Vector3(0.92, 1, 0.96),
    ),
    transformGeometry(
      new THREE.CapsuleGeometry(0.022, 0.115, 4, 8),
      new THREE.Vector3(-0.14, 1.66, -0.006),
      new THREE.Vector3(1, 1, 1.2),
    ),
    transformGeometry(
      new THREE.CapsuleGeometry(0.022, 0.115, 4, 8),
      new THREE.Vector3(0.14, 1.66, -0.006),
      new THREE.Vector3(1, 1, 1.2),
    ),
    transformGeometry(
      new THREE.SphereGeometry(0.012, 8, 6),
      new THREE.Vector3(-0.045, 1.705, -0.143),
      new THREE.Vector3(1.25, 0.68, 0.5),
    ),
    transformGeometry(
      new THREE.SphereGeometry(0.012, 8, 6),
      new THREE.Vector3(0.045, 1.705, -0.143),
      new THREE.Vector3(1.25, 0.68, 0.5),
    ),
    transformGeometry(
      new THREE.BoxGeometry(0.052, 0.007, 0.006),
      new THREE.Vector3(0, 1.635, -0.137),
    ),
  ];
  const shellGeometry = mergeAndDispose(shellParts, 'helmet shell');
  const shell = new THREE.Mesh(shellGeometry, helmet);
  shell.name = HELMET_SHELL_NAME;

  const trimParts = [
    transformGeometry(
      new THREE.BoxGeometry(0.226, 0.018, 0.018),
      new THREE.Vector3(0, 1.744, -0.166),
    ),
    transformGeometry(
      new THREE.SphereGeometry(0.022, 8, 6),
      new THREE.Vector3(-0.145, 1.742, -0.035),
      new THREE.Vector3(0.65, 1, 1),
    ),
    transformGeometry(
      new THREE.SphereGeometry(0.022, 8, 6),
      new THREE.Vector3(0.145, 1.742, -0.035),
      new THREE.Vector3(0.65, 1, 1),
    ),
  ];
  const trimGeometry = mergeAndDispose(trimParts, 'helmet trim');
  const helmetTrim = new THREE.Mesh(trimGeometry, trim);
  helmetTrim.name = HELMET_TRIM_NAME;

  group.add(face, shell, helmetTrim);
  return group;
}

function transformGeometry(
  geometry: THREE.BufferGeometry,
  position: THREE.Vector3,
  scale = new THREE.Vector3(1, 1, 1),
  rotation = new THREE.Euler(),
): THREE.BufferGeometry {
  const transform = new THREE.Matrix4().compose(
    position,
    new THREE.Quaternion().setFromEuler(rotation),
    scale,
  );
  geometry.applyMatrix4(transform);
  return geometry;
}

function mergeAndDispose(
  geometries: THREE.BufferGeometry[],
  description: string,
): THREE.BufferGeometry {
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error(`Unable to merge procedural ${description} geometry.`);
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}
