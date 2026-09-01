import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import {
  cloneCapeAnchors,
  packGpuCapeAnchors,
  prepareGpuCapeDynamics,
} from '../src/physics/GpuCapeStepPreparation';

describe('WebGPU cape step preparation', () => {
  test('locks movement-relative airflow inputs', () => {
    const target = new THREE.Vector4();
    const speed = prepareGpuCapeDynamics(
      target,
      new THREE.Vector3(0.75, 0.1, -1.3),
      0.37,
    );
    expect(speed).toBeCloseTo(1.5041608956491324, 14);
    expect(target.x).toBeCloseTo(-0.20686902435640447, 14);
    expect(target.y).toBeCloseTo(-0.013840181639017884, 14);
    expect(target.z).toBeCloseTo(0.5836496110752618, 14);
    expect(target.w).toBeCloseTo(0.6678413068039026, 14);
  });

  test('packs the center and neckline into the selected cape lane', () => {
    const anchors = {
      left: new THREE.Vector3(-0.3, 1.8, 0.1),
      right: new THREE.Vector3(0.4, 2, 0.3),
      back: new THREE.Vector3(0, 0, 1),
    };
    const states = [new THREE.Vector4(9, 9, 9, 0.25), new THREE.Vector4(8, 8, 8, 0.75)];
    const values = Array.from({ length: CAPE.columns * 2 }, () => new THREE.Vector4(7, 7, 7, 7));
    const center = packGpuCapeAnchors(
      states,
      values,
      1,
      anchors,
      new THREE.Vector3(),
    );

    expect(center.toArray()).toEqual([0.05000000000000002, 1.9, 0.2, 0.75]);
    expect(values[0]!.toArray()).toEqual([7, 7, 7, 7]);
    expect(values[CAPE.columns]!.toArray()).toEqual([-0.3, 1.8, 0.1, 0]);
    expect(values[CAPE.columns * 2 - 1]!.toArray()).toEqual([
      0.39999999999999997,
      2,
      0.3,
      0,
    ]);
  });

  test('clones every anchor vector without retaining shared references', () => {
    const anchors = {
      left: new THREE.Vector3(1, 2, 3),
      right: new THREE.Vector3(4, 5, 6),
      back: new THREE.Vector3(0, 0, 1),
    };
    const cloned = cloneCapeAnchors(anchors);
    expect(cloned).toEqual(anchors);
    expect(cloned.left).not.toBe(anchors.left);
    expect(cloned.right).not.toBe(anchors.right);
    expect(cloned.back).not.toBe(anchors.back);
  });
});
