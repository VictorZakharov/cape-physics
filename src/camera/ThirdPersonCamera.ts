import * as THREE from 'three/webgpu';
import type { InputController } from '../input/InputController';
import { caveGroundHeightAt } from '../world/caveProfile';

const MINIMUM_DISTANCE = 1.15;
const MAXIMUM_DISTANCE = 7.2;
const MINIMUM_PITCH = -1.18;
const MAXIMUM_PITCH = 1.02;
const CAMERA_GROUND_CLEARANCE = 0.18;
const GROUND_PROBES = 14;

export class ThirdPersonCamera {
  public yaw = 0.08;
  private pitch = 0.26;
  private distance = 4.5;
  private readonly target = new THREE.Vector3();
  private readonly desiredPosition = new THREE.Vector3();
  private readonly direction = new THREE.Vector3();
  private readonly probe = new THREE.Vector3();
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
    this.resolveOcclusion();
    this.camera.position.copy(this.desiredPosition);
    this.camera.lookAt(this.target);
  }

  public setOrbit(yaw: number, pitch: number, distance: number, focus: THREE.Vector3): void {
    this.yaw = yaw;
    this.pitch = THREE.MathUtils.clamp(pitch, MINIMUM_PITCH, MAXIMUM_PITCH);
    this.distance = THREE.MathUtils.clamp(distance, MINIMUM_DISTANCE, MAXIMUM_DISTANCE);
    this.snapTo(focus);
  }

  public setPose(position: THREE.Vector3, target: THREE.Vector3): void {
    this.target.copy(target);
    this.camera.position.copy(position);
    this.camera.lookAt(target);
  }

  public update(delta: number, focus: THREE.Vector3): void {
    this.input.consumeOrbitDelta(this.orbitDelta);
    this.yaw -= this.orbitDelta.x * 0.0042;
    // Screen-up drag now moves the camera down, producing the expected look-up motion.
    this.pitch = THREE.MathUtils.clamp(this.pitch + this.orbitDelta.y * 0.0035, MINIMUM_PITCH, MAXIMUM_PITCH);
    this.distance = THREE.MathUtils.clamp(
      this.distance + this.input.consumeZoomDelta() * 0.42,
      MINIMUM_DISTANCE,
      MAXIMUM_DISTANCE,
    );
    this.calculateDesired(focus);
    const obstructed = this.resolveOcclusion();

    if (obstructed && this.camera.position.distanceToSquared(this.target) > this.desiredPosition.distanceToSquared(this.target)) {
      this.camera.position.copy(this.desiredPosition);
    } else {
      const positionSmoothing = obstructed ? 24 : 11;
      this.camera.position.lerp(this.desiredPosition, 1 - Math.exp(-positionSmoothing * delta));
    }
    this.camera.lookAt(this.target);
  }

  public getActualDistance(): number {
    return this.camera.position.distanceTo(this.target);
  }

  public getPitch(): number {
    return this.pitch;
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

  private resolveOcclusion(): boolean {
    this.direction.copy(this.desiredPosition).sub(this.target);
    const desiredDistance = this.direction.length();
    if (desiredDistance < 0.000_001) return false;
    this.direction.multiplyScalar(1 / desiredDistance);
    this.raycaster.set(this.target, this.direction);
    this.raycaster.near = 0.05;
    this.raycaster.far = desiredDistance;
    this.raycastHits.length = 0;
    this.raycaster.intersectObjects(this.colliders, false, this.raycastHits);
    const hit = this.raycastHits[0];
    let obstructed = false;
    if (hit && hit.distance < desiredDistance) {
      this.desiredPosition.copy(this.target).addScaledVector(this.direction, Math.max(0.46, hit.distance - 0.2));
      obstructed = true;
    }
    return this.resolveGroundIntersection() || obstructed;
  }

  private resolveGroundIntersection(): boolean {
    this.direction.copy(this.desiredPosition).sub(this.target);
    const distance = this.direction.length();
    if (distance < 0.000_001) return false;
    let safeFraction = 0;
    for (let sample = 1; sample <= GROUND_PROBES; sample += 1) {
      const fraction = sample / GROUND_PROBES;
      this.probe.copy(this.target).addScaledVector(this.direction, fraction);
      if (this.isAboveGround(this.probe)) {
        safeFraction = fraction;
        continue;
      }

      let unsafeFraction = fraction;
      for (let iteration = 0; iteration < 7; iteration += 1) {
        const middle = (safeFraction + unsafeFraction) * 0.5;
        this.probe.copy(this.target).addScaledVector(this.direction, middle);
        if (this.isAboveGround(this.probe)) safeFraction = middle;
        else unsafeFraction = middle;
      }
      const paddedSafeFraction = safeFraction - Math.min(0.008, safeFraction * 0.25);
      this.desiredPosition.copy(this.target).addScaledVector(
        this.direction,
        Math.max(0, paddedSafeFraction),
      );
      return true;
    }
    return false;
  }

  private isAboveGround(position: THREE.Vector3): boolean {
    return position.y >= caveGroundHeightAt(position.x, position.z) + CAMERA_GROUND_CLEARANCE;
  }
}
