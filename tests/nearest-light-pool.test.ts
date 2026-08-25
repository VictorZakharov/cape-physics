import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import {
  NearestPointLightPool,
  type LocalLightSource,
} from '../src/lighting/NearestPointLightPool';

describe('NearestPointLightPool', () => {
  test('keeps the compiled light count constant while assignments move', () => {
    const pool = new NearestPointLightPool(2, 'Test');
    const sources: LocalLightSource[] = [-8, 0, 9].map((z, index) => ({
      position: new THREE.Vector3(0, 2, z),
      color: new THREE.Color(index === 0 ? 0xff0000 : index === 1 ? 0x00ff00 : 0x0000ff),
      intensity: 10,
      range: 12,
    }));

    pool.update(new THREE.Vector3(0, 0, -7), sources);
    expect(pool.lights[0]?.position.z).toBe(-8);
    expect(pool.getDiagnostics().visibleLights).toBe(2);

    pool.update(new THREE.Vector3(0, 0, 8), sources);
    expect(pool.lights[0]?.position.z).toBe(9);
    expect(pool.getDiagnostics()).toMatchObject({ lights: 2, visibleLights: 2 });
  });
});
