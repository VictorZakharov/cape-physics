import * as THREE from 'three';
import { PLAYER } from '../config';
import { damp } from '../utils/math';

export interface CharacterAnimationDiagnostics {
  readonly bob: number;
  readonly runningBlend: number;
  readonly airborneBlend: number;
  readonly jumpPhase: number;
  readonly armAngles: readonly [number, number];
  readonly legAngles: readonly [number, number];
  readonly footAngles: readonly [number, number];
}

interface CharacterAnimationRig {
  readonly body: THREE.Group;
  readonly leftArm: THREE.Group;
  readonly rightArm: THREE.Group;
  readonly leftLeg: THREE.Group;
  readonly rightLeg: THREE.Group;
  readonly leftFoot: THREE.Group;
  readonly rightFoot: THREE.Group;
}

export class CharacterAnimator {
  private walkPhase = 0;
  private gaitBob = 0;
  private runningBlend = 0;
  private airborneBlend = 0;
  private jumpPhase = 0;

  public constructor(private readonly rig: CharacterAnimationRig) {}

  public update(
    delta: number,
    planarSpeed: number,
    grounded: boolean,
    verticalVelocity: number,
  ): void {
    const gait = THREE.MathUtils.smoothstep(planarSpeed, 0.04, PLAYER.walkSpeed * 0.45);
    this.runningBlend = THREE.MathUtils.smoothstep(
      planarSpeed,
      PLAYER.walkSpeed * 1.02,
      PLAYER.runSpeed * 0.9,
    );
    this.walkPhase += delta * THREE.MathUtils.lerp(6.4, 10.8, this.runningBlend) * gait;
    this.airborneBlend = damp(
      this.airborneBlend,
      grounded ? 0 : 1,
      grounded ? 14 : 22,
      delta,
    );
    if (!grounded) {
      this.jumpPhase = THREE.MathUtils.clamp(
        0.5 - verticalVelocity / (PLAYER.jumpSpeed * 2),
        0,
        1,
      );
    } else if (this.airborneBlend < 0.02) {
      this.jumpPhase = 0;
    }

    const swing = Math.sin(this.walkPhase) * gait;
    const stride = THREE.MathUtils.lerp(0.55, 0.78, this.runningBlend);
    const groundedLeftLeg = swing * stride;
    const groundedRightLeg = -swing * stride;
    const groundedArmSwing = THREE.MathUtils.lerp(0.38, 0.58, this.runningBlend);
    const groundedLeftArm = -swing * groundedArmSwing - 0.08;
    const groundedRightArm = swing * groundedArmSwing - 0.08;

    const jumpArc = Math.sin(this.jumpPhase * Math.PI);
    const landingPreparation = THREE.MathUtils.smoothstep(this.jumpPhase, 0.62, 1);
    const airborneStride = Math.sin(this.jumpPhase * Math.PI * 2) * 0.055;
    const airborneLeftLeg = 0.16 + jumpArc * 0.38 - landingPreparation * 0.24 + airborneStride;
    const airborneRightLeg = 0.06 + jumpArc * 0.26 - landingPreparation * 0.18 - airborneStride;
    const airborneArmLift = 0.28 + jumpArc * 0.58 - landingPreparation * 0.16;
    const airborneFootPitch = -0.16 + jumpArc * 0.34 + landingPreparation * 0.18;

    this.rig.leftLeg.rotation.x = THREE.MathUtils.lerp(
      groundedLeftLeg,
      airborneLeftLeg,
      this.airborneBlend,
    );
    this.rig.rightLeg.rotation.x = THREE.MathUtils.lerp(
      groundedRightLeg,
      airborneRightLeg,
      this.airborneBlend,
    );
    this.rig.leftArm.rotation.x = THREE.MathUtils.lerp(
      groundedLeftArm,
      airborneArmLift + airborneStride,
      this.airborneBlend,
    );
    this.rig.rightArm.rotation.x = THREE.MathUtils.lerp(
      groundedRightArm,
      airborneArmLift - airborneStride,
      this.airborneBlend,
    );
    this.rig.leftFoot.rotation.x = THREE.MathUtils.lerp(
      -swing * 0.14,
      airborneFootPitch + airborneStride,
      this.airborneBlend,
    );
    this.rig.rightFoot.rotation.x = THREE.MathUtils.lerp(
      swing * 0.14,
      airborneFootPitch - airborneStride,
      this.airborneBlend,
    );

    this.gaitBob = Math.abs(Math.sin(this.walkPhase * 2))
      * THREE.MathUtils.lerp(0.018, 0.046, this.runningBlend)
      * gait
      * (1 - this.airborneBlend);
    this.rig.body.position.y = this.gaitBob
      + Math.sin(this.jumpPhase * Math.PI) * 0.012 * this.airborneBlend;
    this.rig.body.rotation.x = THREE.MathUtils.lerp(
      -this.runningBlend * gait * 0.035,
      0.025,
      this.airborneBlend,
    );
    this.rig.body.rotation.z = -swing
      * THREE.MathUtils.lerp(0.014, 0.024, this.runningBlend)
      * (1 - this.airborneBlend);
  }

  public getDiagnostics(): CharacterAnimationDiagnostics {
    return {
      bob: this.gaitBob,
      runningBlend: this.runningBlend,
      airborneBlend: this.airborneBlend,
      jumpPhase: this.jumpPhase,
      armAngles: [this.rig.leftArm.rotation.x, this.rig.rightArm.rotation.x],
      legAngles: [this.rig.leftLeg.rotation.x, this.rig.rightLeg.rotation.x],
      footAngles: [this.rig.leftFoot.rotation.x, this.rig.rightFoot.rotation.x],
    };
  }
}
