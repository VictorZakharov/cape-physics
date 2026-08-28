import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { measureBundledRenderStats } from '../src/core/bundleRenderStats';

describe('bundle render stats', () => {
  test('counts instanced main and shadow draws', () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Array(12).fill(0), 3));
    const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshBasicMaterial(), 3);
    mesh.castShadow = true;

    expect(measureBundledRenderStats(mesh)).toEqual({
      calls: 2,
      triangles: 8,
      points: 0,
      lines: 0,
    });
  });

  test('honors material groups, visibility, and draw range', () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Array(36).fill(0), 3));
    geometry.addGroup(0, 6, 0);
    geometry.addGroup(6, 6, 1);
    geometry.setDrawRange(3, 6);
    const hidden = new THREE.MeshBasicMaterial({ visible: false });
    const mesh = new THREE.Mesh(geometry, [new THREE.MeshBasicMaterial(), hidden]);

    expect(measureBundledRenderStats(mesh, 0)).toEqual({
      calls: 1,
      triangles: 1,
      points: 0,
      lines: 0,
    });
  });
});
