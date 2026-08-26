import * as THREE from 'three';
import { CAMERA_NEAR_OPACITY, CAPE } from '../config';
import type { CapsuleCollider } from '../physics/colliders';
import {
  CharacterAnimator,
  type CharacterAnimationDiagnostics,
} from './CharacterAnimator';
import {
  CAPE_THROAT_CLASP_POSITION,
  createCapeAttachment,
} from './CapeAttachment';
import { createProceduralHead } from './ProceduralHead';

export const TORSO_NAME = 'Tapered torso armor';
export const NECK_NAME = 'Visible skin neck';
export const LEFT_SHOULDER_NAME = 'Left fitted shoulder armor';
export const RIGHT_SHOULDER_NAME = 'Right fitted shoulder armor';

export interface CapeAnchors {
  readonly left: THREE.Vector3;
  readonly right: THREE.Vector3;
  readonly back: THREE.Vector3;
}

function enableShadows(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

export class Character {
  public readonly root = new THREE.Group();
  public readonly velocity = new THREE.Vector3();
  private readonly rig = new THREE.Group();
  private readonly leftArm = new THREE.Group();
  private readonly rightArm = new THREE.Group();
  private readonly leftLeg = new THREE.Group();
  private readonly rightLeg = new THREE.Group();
  private readonly leftFoot = new THREE.Group();
  private readonly rightFoot = new THREE.Group();
  private readonly leftCapeAnchor = new THREE.Object3D();
  private readonly rightCapeAnchor = new THREE.Object3D();
  private readonly leftAnchorWorld = new THREE.Vector3();
  private readonly rightAnchorWorld = new THREE.Vector3();
  private readonly backWorld = new THREE.Vector3();
  private readonly capeAttachmentBounds = new THREE.Box3();
  private readonly capeAnchors: CapeAnchors = {
    left: this.leftAnchorWorld,
    right: this.rightAnchorWorld,
    back: this.backWorld,
  };
  private readonly capeColliderRig = {
    shoulders: this.createCapeCollider(0.095, 'shoulders'),
    upperTorso: this.createCapeCollider(0.205, 'upper torso'),
    hips: this.createCapeCollider(0.198, 'hips and belt'),
    belt: this.createCapeCollider(0.225, 'belt ring'),
    leftArm: this.createCapeCollider(0.095, 'left arm'),
    rightArm: this.createCapeCollider(0.095, 'right arm'),
    leftThigh: this.createCapeCollider(0.085, 'left thigh'),
    leftKnee: this.createCapeCollider(0.08, 'left knee'),
    leftLowerLeg: this.createCapeCollider(0.075, 'left lower leg'),
    leftBoot: this.createCapeCollider(0.095, 'left boot'),
    rightThigh: this.createCapeCollider(0.085, 'right thigh'),
    rightKnee: this.createCapeCollider(0.08, 'right knee'),
    rightLowerLeg: this.createCapeCollider(0.075, 'right lower leg'),
    rightBoot: this.createCapeCollider(0.095, 'right boot'),
  };
  private readonly capeColliders: readonly CapsuleCollider[] = Object.values(this.capeColliderRig);
  private readonly animator = new CharacterAnimator({
    body: this.rig,
    leftArm: this.leftArm,
    rightArm: this.rightArm,
    leftLeg: this.leftLeg,
    rightLeg: this.rightLeg,
    leftFoot: this.leftFoot,
    rightFoot: this.rightFoot,
  });
  private readonly materials: THREE.Material[] = [];
  private capeAttachment!: THREE.Group;
  private opacity = 1;

  public constructor() {
    this.root.name = 'Procedural hero';
    this.root.add(this.rig);
    this.buildBody();
    enableShadows(this.root);
  }

  public updateAnimation(
    delta: number,
    planarSpeed: number,
    grounded = true,
    verticalVelocity = 0,
  ): void {
    this.animator.update(delta, planarSpeed, grounded, verticalVelocity);
  }

  public getCapeAnchors(): CapeAnchors {
    this.root.updateMatrixWorld(true);
    this.leftCapeAnchor.getWorldPosition(this.leftAnchorWorld);
    this.rightCapeAnchor.getWorldPosition(this.rightAnchorWorld);
    this.backWorld.set(0, 0, 1).applyQuaternion(this.root.quaternion).normalize();
    return this.capeAnchors;
  }

  public getCapeColliders(): readonly CapsuleCollider[] {
    const {
      shoulders,
      upperTorso,
      hips,
      belt,
      leftArm,
      rightArm,
      leftThigh,
      leftKnee,
      leftLowerLeg,
      leftBoot,
      rightThigh,
      rightKnee,
      rightLowerLeg,
      rightBoot,
    } = this.capeColliderRig;

    this.setWorldCapsule(shoulders, this.rig, [-0.195, 1.45, -0.015], [0.195, 1.45, -0.015]);
    this.setWorldCapsule(upperTorso, this.rig, [0, 1.36, -0.06], [0, 1.11, -0.06]);
    this.setWorldCapsule(hips, this.rig, [0, 1.01, -0.035], [0, 0.79, -0.035]);
    this.setWorldCapsule(belt, this.rig, [0, 1.01, -0.005], [0, 1.01, -0.005]);
    this.setWorldCapsule(leftArm, this.leftArm, [0, -0.02, 0], [0, -0.69, 0]);
    this.setWorldCapsule(rightArm, this.rightArm, [0, -0.02, 0], [0, -0.69, 0]);
    this.setWorldCapsule(leftThigh, this.leftLeg, [0, -0.29, 0], [0, -0.29, 0]);
    this.setWorldCapsule(leftKnee, this.leftLeg, [0, -0.5, 0], [0, -0.5, 0]);
    this.setWorldCapsule(leftLowerLeg, this.leftLeg, [0, -0.69, 0], [0, -0.69, 0]);
    this.setWorldCapsule(leftBoot, this.leftFoot, [0, -0.06, -0.115], [0, -0.06, -0.005]);
    this.setWorldCapsule(rightThigh, this.rightLeg, [0, -0.29, 0], [0, -0.29, 0]);
    this.setWorldCapsule(rightKnee, this.rightLeg, [0, -0.5, 0], [0, -0.5, 0]);
    this.setWorldCapsule(rightLowerLeg, this.rightLeg, [0, -0.69, 0], [0, -0.69, 0]);
    this.setWorldCapsule(rightBoot, this.rightFoot, [0, -0.06, -0.115], [0, -0.06, -0.005]);
    return this.capeColliders;
  }

  public setOpacity(opacity: number): void {
    const nextOpacity = THREE.MathUtils.clamp(opacity, CAMERA_NEAR_OPACITY, 1);
    if (Math.abs(nextOpacity - this.opacity) < 0.002) return;
    this.opacity = nextOpacity;
  }

  public getOpacity(): number {
    return this.opacity;
  }

  public getAnimationDiagnostics(): CharacterAnimationDiagnostics {
    return this.animator.getDiagnostics();
  }

  public getCapeAttachmentDiagnostics(): {
    readonly meshes: number;
    readonly maximumAnchorGap: number;
  } {
    const anchors = this.getCapeAnchors();
    this.capeAttachmentBounds.setFromObject(this.capeAttachment);
    let meshes = 0;
    this.capeAttachment.traverse((object) => {
      if (object instanceof THREE.Mesh) meshes += 1;
    });
    return {
      meshes,
      maximumAnchorGap: Math.max(
        this.capeAttachmentBounds.distanceToPoint(anchors.left),
        this.capeAttachmentBounds.distanceToPoint(anchors.right),
      ),
    };
  }

  private buildBody(): void {
    const armor = new THREE.MeshPhysicalMaterial({
      color: 0x2a383d,
      roughness: 0.38,
      metalness: 0.62,
      clearcoat: 0.2,
      clearcoatRoughness: 0.34,
    });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x11191c, roughness: 0.46, metalness: 0.78 });
    const leather = new THREE.MeshStandardMaterial({ color: 0x342019, roughness: 0.86, metalness: 0.02 });
    const trim = new THREE.MeshStandardMaterial({ color: 0xa9864f, roughness: 0.34, metalness: 0.72 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x20282a, roughness: 0.94, metalness: 0 });
    const skin = new THREE.MeshStandardMaterial({ color: 0x8f5b42, roughness: 0.84, metalness: 0 });
    const capeFabric = new THREE.MeshPhysicalMaterial({
      color: 0x940a13,
      roughness: 0.78,
      metalness: 0.01,
      sheen: 0.92,
      sheenColor: new THREE.Color(0x6f0713),
      sheenRoughness: 0.72,
      side: THREE.DoubleSide,
    });
    this.materials.push(armor, darkMetal, leather, trim, cloth, skin, capeFabric);
    for (const material of this.materials) {
      material.transparent = false;
      material.depthWrite = true;
    }

    const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.17, 5, 10), armor);
    hips.position.y = 0.87;
    hips.scale.z = 0.72;
    this.rig.add(hips);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.218, 0.18, 0.55, 10), armor);
    torso.name = TORSO_NAME;
    torso.position.y = 1.225;
    torso.scale.z = 0.72;
    this.rig.add(torso);

    const breastplate = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.178, 0.39, 10, 1, false), darkMetal);
    breastplate.position.set(0, 1.255, -0.064);
    breastplate.scale.z = 0.69;
    this.rig.add(breastplate);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.026, 6, 18), leather);
    belt.rotation.x = Math.PI / 2;
    belt.position.y = 1.01;
    belt.scale.z = 0.74;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.064, 0.032), trim);
    buckle.position.set(0, 1.01, -0.172);
    this.rig.add(belt, buckle);

    const head = createProceduralHead(skin, darkMetal, trim);
    head.position.y = 0.018;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.067, 0.077, 0.16, 12), skin);
    neck.name = NECK_NAME;
    neck.position.y = 1.555;
    const gorget = new THREE.Mesh(new THREE.TorusGeometry(0.132, 0.019, 6, 20), leather);
    gorget.rotation.x = Math.PI / 2;
    gorget.position.y = 1.49;
    gorget.scale.z = 0.76;
    const clasp = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), trim);
    clasp.name = 'Cape throat clasp';
    clasp.position.fromArray(CAPE_THROAT_CLASP_POSITION);
    clasp.scale.z = 0.45;
    this.rig.add(head, neck, gorget, clasp);

    this.createArm(this.leftArm, -1, armor, darkMetal, leather);
    this.createArm(this.rightArm, 1, armor, darkMetal, leather);
    this.createLeg(this.leftLeg, this.leftFoot, -1, cloth, darkMetal);
    this.createLeg(this.rightLeg, this.rightFoot, 1, cloth, darkMetal);
    this.rig.add(this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

    const shoulderGeometry = new THREE.SphereGeometry(0.08, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const leftShoulder = new THREE.Mesh(shoulderGeometry, armor);
    leftShoulder.name = LEFT_SHOULDER_NAME;
    leftShoulder.position.set(-0.195, 1.445, 0);
    leftShoulder.scale.set(1.06, 0.76, 1);
    leftShoulder.rotation.z = 0.35;
    const rightShoulder = leftShoulder.clone();
    rightShoulder.name = RIGHT_SHOULDER_NAME;
    rightShoulder.position.x = 0.195;
    rightShoulder.rotation.z = -0.35;
    this.rig.add(leftShoulder, rightShoulder);

    this.capeAttachment = createCapeAttachment(capeFabric, trim);
    this.rig.add(this.capeAttachment);

    this.leftCapeAnchor.position.set(
      -CAPE.attachment.halfWidth,
      CAPE.attachment.height,
      CAPE.attachment.depth,
    );
    this.rightCapeAnchor.position.set(
      CAPE.attachment.halfWidth,
      CAPE.attachment.height,
      CAPE.attachment.depth,
    );
    this.rig.add(this.leftCapeAnchor, this.rightCapeAnchor);
  }

  private createArm(
    arm: THREE.Group,
    side: -1 | 1,
    armor: THREE.Material,
    metal: THREE.Material,
    leather: THREE.Material,
  ): void {
    arm.position.set(side * 0.205, 1.405, 0);
    arm.rotation.z = side * -0.08;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.06, 0.42, 9), leather);
    upper.position.y = -0.215;
    const bracer = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.05, 0.31, 9), armor);
    bracer.position.y = -0.545;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.056, 9, 7), metal);
    hand.position.y = -0.72;
    arm.add(upper, bracer, hand);
  }

  private createLeg(
    leg: THREE.Group,
    foot: THREE.Group,
    side: -1 | 1,
    cloth: THREE.Material,
    metal: THREE.Material,
  ): void {
    leg.position.set(side * 0.095, 0.79, 0);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.074, 0.42, 9), cloth);
    thigh.position.y = -0.22;
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.056, 0.4, 9), metal);
    shin.position.y = -0.62;
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.25), metal);
    foot.position.y = -0.8;
    boot.position.set(0, -0.06, -0.06);
    foot.add(boot);
    leg.add(thigh, shin, foot);
  }

  private setWorldCapsule(
    collider: CapsuleCollider,
    space: THREE.Object3D,
    start: readonly [number, number, number],
    end: readonly [number, number, number],
  ): void {
    space.localToWorld(collider.start.set(...start));
    space.localToWorld(collider.end.set(...end));
  }

  private createCapeCollider(radius: number, name: string): CapsuleCollider {
    return {
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      radius,
      name,
    };
  }
}
