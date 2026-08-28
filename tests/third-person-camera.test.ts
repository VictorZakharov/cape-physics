import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { ThirdPersonCamera } from '../src/camera/ThirdPersonCamera';
import type { InputController } from '../src/input/InputController';
import { caveCenterX, caveGroundHeightAt } from '../src/world/caveProfile';

class CameraInputStub {
  public readonly orbit = new THREE.Vector2();

  public consumeOrbitDelta(target: THREE.Vector2): void {
    target.copy(this.orbit);
    this.orbit.set(0, 0);
  }

  public consumeZoomDelta(): number {
    return 0;
  }
}

describe('ThirdPersonCamera', () => {
  test('reverses vertical drag so an upward drag looks upward', () => {
    const input = new CameraInputStub();
    const camera = new THREE.PerspectiveCamera();
    const controller = new ThirdPersonCamera(camera, input as unknown as InputController, []);
    const z = 0;
    const x = caveCenterX(z);
    const focus = new THREE.Vector3(x, caveGroundHeightAt(x, z), z);
    controller.setOrbit(0, 0, 4.5, focus);

    input.orbit.set(0, -180);
    controller.update(1 / 60, focus);

    expect(controller.getPitch()).toBeLessThan(-0.6);
  });

  test('preserves a sharp look-up pitch while shortening above terrain', () => {
    const input = new CameraInputStub();
    const camera = new THREE.PerspectiveCamera();
    const controller = new ThirdPersonCamera(camera, input as unknown as InputController, []);
    const z = -8;
    const x = caveCenterX(z);
    const focus = new THREE.Vector3(x, caveGroundHeightAt(x, z), z);

    controller.setOrbit(0, -1.1, 4.5, focus);

    expect(controller.getPitch()).toBeCloseTo(-1.1, 6);
    expect(controller.getActualDistance()).toBeLessThan(2);
    expect(camera.position.y - caveGroundHeightAt(camera.position.x, camera.position.z)).toBeGreaterThanOrEqual(0.175);
  });
});
