import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAVE } from '../src/config';
import { createRockTextures } from '../src/graphics/proceduralTextures';
import { CaveWorld } from '../src/world/CaveWorld';

describe('CaveWorld', () => {
  test('stitches lighting normals across the wrapped cave wall seam', () => {
    const cave = new CaveWorld(createRockTextures(16));
    const wall = cave.group.getObjectByName('Cave shell');
    expect(wall).toBeInstanceOf(THREE.Mesh);
    const geometry = (wall as THREE.Mesh).geometry;
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    const stride = CAVE.radialSegments + 1;
    const first = new THREE.Vector3();
    const last = new THREE.Vector3();

    for (let segment = 0; segment <= CAVE.segments; segment += 1) {
      const firstIndex = segment * stride;
      const lastIndex = firstIndex + CAVE.radialSegments;
      first.fromBufferAttribute(positions, firstIndex);
      last.fromBufferAttribute(positions, lastIndex);
      expect(first.distanceTo(last)).toBeLessThan(0.000_001);
      first.fromBufferAttribute(normals, firstIndex);
      last.fromBufferAttribute(normals, lastIndex);
      expect(first.distanceTo(last)).toBeLessThan(0.000_001);
    }
  });
});
