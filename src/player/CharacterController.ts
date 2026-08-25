import * as THREE from 'three';
import { PLAYER } from '../config';
import { damp } from '../utils/math';
import type { WorldCollisionResolver } from '../world/WorldCollisionResolver';
import type { Character } from './Character';

export interface CharacterMovementInput {
  getMovement(): THREE.Vector2;
  isRunning(): boolean;
}

export class CharacterController {
  private readonly desiredVelocity = new THREE.Vector3();
  private readonly cameraForward = new THREE.Vector3();
  private readonly cameraRight = new THREE.Vector3();
  private running = false;
  private turnRate = 0;

  public constructor(
    private readonly character: Character,
    private readonly input: CharacterMovementInput,
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

    this.running = this.desiredVelocity.lengthSq() > 0 && this.input.isRunning();
    if (this.desiredVelocity.lengthSq() > 0) {
      const speed = this.running ? PLAYER.runSpeed : PLAYER.walkSpeed;
      this.desiredVelocity.normalize().multiplyScalar(speed);
    }
    const response = this.desiredVelocity.lengthSq() > 0 ? PLAYER.acceleration : PLAYER.deceleration;
    this.character.velocity.lerp(this.desiredVelocity, 1 - Math.exp(-response * delta));
    if (this.character.velocity.lengthSq() < 0.0001) this.character.velocity.set(0, 0, 0);
    this.character.root.position.addScaledVector(this.character.velocity, delta);
    this.worldCollision.resolvePlayer(this.character.root.position);

    const planarSpeed = this.character.velocity.length();
    if (planarSpeed > 0.08) {
      const targetYaw = Math.atan2(-this.character.velocity.x, -this.character.velocity.z);
      const yawDelta = Math.atan2(
        Math.sin(targetYaw - this.character.root.rotation.y),
        Math.cos(targetYaw - this.character.root.rotation.y),
      );
      const speedBlend = THREE.MathUtils.smoothstep(planarSpeed, 0.08, PLAYER.runSpeed);
      const maximumTurnRate = THREE.MathUtils.lerp(
        PLAYER.walkTurnRate,
        PLAYER.runTurnRate,
        speedBlend,
      );
      const desiredTurnRate = THREE.MathUtils.clamp(
        yawDelta * PLAYER.turnResponse,
        -maximumTurnRate,
        maximumTurnRate,
      );
      this.turnRate = damp(
        this.turnRate,
        desiredTurnRate,
        THREE.MathUtils.lerp(7, 12, speedBlend),
        delta,
      );
      const yawStep = THREE.MathUtils.clamp(
        this.turnRate * delta,
        -Math.abs(yawDelta),
        Math.abs(yawDelta),
      );
      const nextYaw = this.character.root.rotation.y + yawStep;
      this.character.root.rotation.y = Math.atan2(Math.sin(nextYaw), Math.cos(nextYaw));
    } else {
      this.turnRate = damp(this.turnRate, 0, 10, delta);
    }
    this.character.updateAnimation(delta, planarSpeed);
  }

  public isRunning(): boolean {
    return this.running;
  }
}
