import * as THREE from 'three/webgpu';

const ROCK_SIDES = 10;
const BASE_HEIGHT = -0.2;
const SHOULDER_HEIGHT = 0.07;
const TOP_HEIGHT = 0.3;

/**
 * Builds a deterministic closed convex boulder without runtime hull
 * triangulation. Fixed face order is important because sequential cloth
 * projections must resolve identically on Windows and Linux.
 */
export function createRockGeometry(): THREE.BufferGeometry {
  const vertices = [
    ...createRing(BASE_HEIGHT, 1, 0, 0),
    ...createRing(SHOULDER_HEIGHT, 0.78, 0.018, -0.012),
    ...createRing(TOP_HEIGHT, 0.28, 0.034, -0.022),
    new THREE.Vector3(0, BASE_HEIGHT, 0),
    new THREE.Vector3(0.034, TOP_HEIGHT, -0.022),
  ];
  const baseCenter = ROCK_SIDES * 3;
  const topCenter = baseCenter + 1;
  const faces: [number, number, number][] = [];

  for (let side = 0; side < ROCK_SIDES; side += 1) {
    const next = (side + 1) % ROCK_SIDES;
    const shoulder = ROCK_SIDES + side;
    const nextShoulder = ROCK_SIDES + next;
    const top = ROCK_SIDES * 2 + side;
    const nextTop = ROCK_SIDES * 2 + next;
    faces.push(
      [side, next, nextShoulder],
      [side, nextShoulder, shoulder],
      [shoulder, nextShoulder, nextTop],
      [shoulder, nextTop, top],
      [baseCenter, next, side],
      [topCenter, top, nextTop],
    );
  }

  const solidCenter = vertices.reduce(
    (center, vertex) => center.add(vertex),
    new THREE.Vector3(),
  ).multiplyScalar(1 / vertices.length);
  const positions: number[] = [];
  const uvs: number[] = [];
  const firstEdge = new THREE.Vector3();
  const secondEdge = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const faceCenter = new THREE.Vector3();

  for (const face of faces) {
    let [firstIndex, secondIndex, thirdIndex] = face;
    const first = vertices[firstIndex];
    let second = vertices[secondIndex];
    let third = vertices[thirdIndex];
    if (!first || !second || !third) continue;
    normal.crossVectors(
      firstEdge.copy(second).sub(first),
      secondEdge.copy(third).sub(first),
    );
    faceCenter.copy(first).add(second).add(third).multiplyScalar(1 / 3);
    if (normal.dot(faceCenter.sub(solidCenter)) < 0) {
      const swap = secondIndex;
      secondIndex = thirdIndex;
      thirdIndex = swap;
      second = vertices[secondIndex];
      third = vertices[thirdIndex];
      if (!second || !third) continue;
    }
    for (const vertex of [first, second, third]) {
      positions.push(vertex.x, vertex.y, vertex.z);
      uvs.push(
        0.5 + Math.atan2(vertex.z, vertex.x) / (Math.PI * 2),
        THREE.MathUtils.inverseLerp(BASE_HEIGHT, TOP_HEIGHT, vertex.y),
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.name = 'Deterministic grounded irregular rock';
  return geometry;
}

function createRing(
  y: number,
  scale: number,
  offsetX: number,
  offsetZ: number,
): THREE.Vector3[] {
  return Array.from({ length: ROCK_SIDES }, (_, side) => {
    const angle = side / ROCK_SIDES * Math.PI * 2;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    return new THREE.Vector3(
      (cosine * 0.44 + sine * 0.025) * scale + offsetX,
      y,
      (sine * 0.36 - cosine * 0.018) * scale + offsetZ,
    );
  });
}
