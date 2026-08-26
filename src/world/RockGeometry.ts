import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

const ROCK_RADIUS = 0.42;
const BASE_HEIGHT = -0.2;

/**
 * A closed convex rock with a broad, planar footprint. The linear skew keeps
 * the silhouette irregular while the clamped underside prevents spherical
 * props from appearing balanced on a point.
 */
export function createRockGeometry(): THREE.BufferGeometry {
  const source = new THREE.DodecahedronGeometry(ROCK_RADIUS, 1);
  const sourcePositions = source.getAttribute('position');
  const point = new THREE.Vector3();
  const uniquePoints = new Map<string, THREE.Vector3>();

  for (let index = 0; index < sourcePositions.count; index += 1) {
    point.fromBufferAttribute(sourcePositions, index);
    const originalX = point.x;
    point.x = originalX * 1.08 + point.y * 0.075;
    point.z = point.z * 0.94 - originalX * 0.045;
    point.y *= point.y > 0 ? 0.9 : 0.8;
    point.y = Math.max(BASE_HEIGHT, point.y);
    uniquePoints.set(
      `${point.x.toFixed(6)}:${point.y.toFixed(6)}:${point.z.toFixed(6)}`,
      point.clone(),
    );
  }

  const geometry = new ConvexGeometry([...uniquePoints.values()]);
  const positions = geometry.getAttribute('position');
  const uvs = new Float32Array(positions.count * 2);
  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    uvs[index * 2] = 0.5 + Math.atan2(point.z, point.x) / (Math.PI * 2);
    uvs[index * 2 + 1] = THREE.MathUtils.inverseLerp(BASE_HEIGHT, ROCK_RADIUS * 0.9, point.y);
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.name = 'Grounded irregular rock';
  return geometry;
}
