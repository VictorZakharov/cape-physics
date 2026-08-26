import * as THREE from 'three';
import { PLAYER } from '../config';
import { damp } from '../utils/math';
import type { WorldCollisionResolver } from '../world/WorldCollisionResolver';
import type { Character } from './Character';

export interface CharacterMovementInput {
  getMovement(): THREE.Vector2;
  isRunning(): boolean;
  consumeJump(): boolean;
}

export class CharacterController {
  private readonly desiredVelocity = new THREE.Vector3();
  private readonly cameraForward = new THREE.Vector3();
  private readonly cameraRight = new THREE.Vector3();
  private running = false;
  private grounded = true;
  private verticalVelocity = 0;
  private landingImpactSpeed = 0;
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
    const velocityBlend = 1 - Math.exp(-response * delta);
    this.character.velocity.x = THREE.MathUtils.lerp(
      this.character.velocity.x,
      this.desiredVelocity.x,
      velocityBlend,
    );
    this.character.velocity.z = THREE.MathUtils.lerp(
      this.character.velocity.z,
      this.desiredVelocity.z,
      velocityBlend,
    );
    const planarSpeedSquared = this.character.velocity.x * this.character.velocity.x
      + this.character.velocity.z * this.character.velocity.z;
    if (planarSpeedSquared < 0.0001) {
      this.character.velocity.x = 0;
      this.character.velocity.z = 0;
    }

    const jumpRequested = this.input.consumeJump();
    if (jumpRequested && this.grounded) {
      this.verticalVelocity = PLAYER.jumpSpeed;
      this.grounded = false;
    }
    if (!this.grounded) this.verticalVelocity -= PLAYER.gravity * delta;
    else this.verticalVelocity = 0;
    this.character.velocity.y = this.verticalVelocity;

    const wasGrounded = this.grounded;
    const previousY = this.character.root.position.y;
    this.character.root.position.addScaledVector(this.character.velocity, delta);
    const collision = this.worldCollision.resolvePlayer(this.character.root.position, {
      previousY,
      velocityY: this.verticalVelocity,
      grounded: this.grounded,
    });
    this.grounded = collision.grounded;
    if (!wasGrounded && this.grounded && this.verticalVelocity < 0) {
      this.landingImpactSpeed = -this.verticalVelocity;
    }
    if (
      (collision.grounded && this.verticalVelocity < 0)
      || (collision.hitCeiling && this.verticalVelocity > 0)
    ) {
      this.verticalVelocity = 0;
      this.character.velocity.y = 0;
    }

    const planarSpeed = Math.hypot(this.character.velocity.x, this.character.velocity.z);
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
    this.character.updateAnimation(delta, planarSpeed, this.grounded, this.verticalVelocity);
  }

  public isRunning(): boolean {
    return this.running;
  }

  public isGrounded(): boolean {
    return this.grounded;
  }

  public consumeLandingImpact(): number {
    const impactSpeed = this.landingImpactSpeed;
    this.landingImpactSpeed = 0;
    return impactSpeed;
  }

  public resetVerticalState(): void {
    this.grounded = true;
    this.verticalVelocity = 0;
    this.landingImpactSpeed = 0;
    this.character.velocity.y = 0;
  }
}
