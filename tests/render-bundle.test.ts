import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { moveChildrenIntoRenderBundle } from '../src/core/renderBundle';

describe('render bundle transform modes', () => {
  test('keeps fixed hierarchies static', () => {
    const group = new THREE.Group();
    group.add(new THREE.Mesh());

    const bundle = moveChildrenIntoRenderBundle(group, 'fixed');

    expect(bundle.static).toBe(true);
    expect(group.children).toEqual([bundle]);
    expect(bundle.children).toHaveLength(1);
  });

  test('refreshes transforms for moving and animated hierarchies', () => {
    const group = new THREE.Group();
    const rig = new THREE.Group();
    group.add(rig);

    const bundle = moveChildrenIntoRenderBundle(group, 'dynamic');

    expect(bundle.static).toBe(false);
    expect(group.children).toEqual([bundle]);
    expect(bundle.children).toEqual([rig]);
  });
});
