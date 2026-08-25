import * as THREE from 'three';
import type { InputController } from '../input/InputController';
import { floorHeightAt } from '../world/caveProfile';

export class ThirdPersonCamera {
  public yaw = 0.08;
  private pitch = 0.26;
  private distance = 4.5;
  private readonly target = new THREE.Vector3();
  private readonly desiredPosition = new THREE.Vector3();
  private readonly direction = new THREE.Vector3();
  private readonly orbitDelta = new THREE.Vector2();
  private readonly raycastHits: THREE.Intersection[] = [];
  private readonly raycaster = new THREE.Raycaster();

  public constructor(
    public readonly camera: THREE.PerspectiveCamera,
    private readonly input: InputController,
    private readonly colliders: THREE.Object3D[],
  ) {}

  public snapTo(focus: THREE.Vector3): void {
    this.calculateDesired(focus);
    this.camera.position.copy(this.desiredPosition);
    this.camera.lookAt(this.target);
  }

  public setOrbit(yaw: number, pitch: number, distance: number, focus: THREE.Vector3): void {
    this.yaw = yaw;
    this.pitch = THREE.MathUtils.clamp(pitch, -0.08, 0.78);
    this.distance = THREE.MathUtils.clamp(distance, 2.8, 6.8);
    this.snapTo(focus);
  }

  public setPose(position: THREE.Vector3, target: THREE.Vector3): void {
    this.camera.position.copy(position);
    this.camera.lookAt(target);
  }

  public update(delta: number, focus: THREE.Vector3): void {
    this.input.consumeOrbitDelta(this.orbitDelta);
    this.yaw -= this.orbitDelta.x * 0.0042;
    this.pitch = THREE.MathUtils.clamp(this.pitch - this.orbitDelta.y * 0.0035, -0.08, 0.78);
    this.distance = THREE.MathUtils.clamp(this.distance + this.input.consumeZoomDelta() * 0.42, 2.8, 6.8);
    this.calculateDesired(focus);

    this.direction.copy(this.desiredPosition).sub(this.target);
    const desiredDistance = this.direction.length();
    this.direction.normalize();
    this.raycaster.set(this.target, this.direction);
    this.raycaster.near = 0.05;
    this.raycaster.far = desiredDistance;
    this.raycastHits.length = 0;
    this.raycaster.intersectObjects(this.colliders, false, this.raycastHits);
    const hit = this.raycastHits[0];
    if (hit && hit.distance < desiredDistance) {
      this.desiredPosition.copy(this.target).addScaledVector(this.direction, Math.max(0.72, hit.distance - 0.24));
    }
    this.desiredPosition.y = Math.max(this.desiredPosition.y, floorHeightAt(this.desiredPosition.x, this.desiredPosition.z) + 0.34);

    const positionSmoothing = hit ? 24 : 11;
    this.camera.position.lerp(this.desiredPosition, 1 - Math.exp(-positionSmoothing * delta));
    this.camera.lookAt(this.target);
  }

  private calculateDesired(focus: THREE.Vector3): void {
    this.target.copy(focus);
    this.target.y += 1.25;
    const horizontalDistance = Math.cos(this.pitch) * this.distance;
    this.desiredPosition.set(
      this.target.x + Math.sin(this.yaw) * horizontalDistance,
      this.target.y + Math.sin(this.pitch) * this.distance,
      this.target.z + Math.cos(this.yaw) * horizontalDistance,
    );
  }
}
