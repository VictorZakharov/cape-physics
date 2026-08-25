import * as THREE from 'three';
import { PLAYER } from '../config';
import type { InputController } from '../input/InputController';
import { dampAngle } from '../utils/math';
import type { WorldCollisionResolver } from '../world/WorldCollisionResolver';
import type { Character } from './Character';

export class CharacterController {
  private readonly desiredVelocity = new THREE.Vector3();
  private readonly cameraForward = new THREE.Vector3();
  private readonly cameraRight = new THREE.Vector3();

  public constructor(
    private readonly character: Character,
    private readonly input: InputController,
    private readonly worldCollision: WorldCollisionResolver,
  ) {}

  public update(delta: number, cameraYaw: number): void {
    const movement = this.input.getMovement();
    this.cameraForward.set(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    this.cameraRight.set(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));
    this.desiredVelocity
      .set(0, 0, 0)
      .addScaledVector(this.cameraRight, movement.x)
      .addScaledVector(this.cameraForward, movement.y);

    if (this.desiredVelocity.lengthSq() > 0) {
      this.desiredVelocity.normalize().multiplyScalar(PLAYER.walkSpeed);
    }
    const response = this.desiredVelocity.lengthSq() > 0 ? PLAYER.acceleration : PLAYER.deceleration;
    this.character.velocity.lerp(this.desiredVelocity, 1 - Math.exp(-response * delta));
    if (this.character.velocity.lengthSq() < 0.0001) this.character.velocity.set(0, 0, 0);
    this.character.root.position.addScaledVector(this.character.velocity, delta);
    this.worldCollision.resolvePlayer(this.character.root.position);

    const planarSpeed = this.character.velocity.length();
    if (planarSpeed > 0.08) {
      const targetYaw = Math.atan2(-this.character.velocity.x, -this.character.velocity.z);
      this.character.root.rotation.y = dampAngle(this.character.root.rotation.y, targetYaw, PLAYER.turnSpeed, delta);
    }
    this.character.updateAnimation(delta, planarSpeed);
  }
}
