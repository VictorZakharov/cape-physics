import * as THREE from 'three';
import { CAMERA_NEAR_OPACITY, CAPE, PLAYER } from '../config';
import type { CapsuleCollider } from '../physics/colliders';
import { createCapeAttachment } from './CapeAttachment';
import { createProceduralHead } from './ProceduralHead';

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
  private readonly capeColliders: CapsuleCollider[] = [
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.145, name: 'shoulders' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.27, name: 'upper torso' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.235, name: 'hips and belt' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.258, name: 'belt ring' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.115, name: 'left arm' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.115, name: 'right arm' },
  ];
  private readonly materials: THREE.Material[] = [];
  private capeAttachment!: THREE.Group;
  private opacity = 1;
  private walkPhase = 0;
  private gaitBob = 0;
  private runningBlend = 0;

  public constructor() {
    this.root.name = 'Procedural hero';
    this.root.add(this.rig);
    this.buildBody();
    enableShadows(this.root);
  }

  public updateAnimation(delta: number, speed: number): void {
    const gait = THREE.MathUtils.smoothstep(speed, 0.04, PLAYER.walkSpeed * 0.45);
    this.runningBlend = THREE.MathUtils.smoothstep(
      speed,
      PLAYER.walkSpeed * 1.02,
      PLAYER.runSpeed * 0.9,
    );
    this.walkPhase += delta * THREE.MathUtils.lerp(6.4, 10.8, this.runningBlend) * gait;
    const swing = Math.sin(this.walkPhase) * gait;
    const stride = THREE.MathUtils.lerp(0.55, 0.78, this.runningBlend);
    this.leftLeg.rotation.x = swing * stride;
    this.rightLeg.rotation.x = -swing * stride;
    this.leftArm.rotation.x = -swing * THREE.MathUtils.lerp(0.38, 0.58, this.runningBlend) - 0.08;
    this.rightArm.rotation.x = swing * THREE.MathUtils.lerp(0.38, 0.58, this.runningBlend) - 0.08;
    this.gaitBob = Math.abs(Math.sin(this.walkPhase * 2))
      * THREE.MathUtils.lerp(0.018, 0.046, this.runningBlend)
      * gait;
    this.rig.position.y = this.gaitBob;
    this.rig.rotation.x = -this.runningBlend * gait * 0.035;
    this.rig.rotation.z = -swing * THREE.MathUtils.lerp(0.014, 0.024, this.runningBlend);
  }

  public getCapeAnchors(): CapeAnchors {
    this.root.updateMatrixWorld(true);
    this.leftCapeAnchor.getWorldPosition(this.leftAnchorWorld);
    this.rightCapeAnchor.getWorldPosition(this.rightAnchorWorld);
    this.backWorld.set(0, 0, 1).applyQuaternion(this.root.quaternion).normalize();
    return this.capeAnchors;
  }

  public getCapeColliders(): readonly CapsuleCollider[] {
    const [shoulders, upperTorso, hips, belt, leftArm, rightArm] = this.capeColliders;
    if (!shoulders || !upperTorso || !hips || !belt || !leftArm || !rightArm) {
      throw new Error('Character cape collider configuration is incomplete.');
    }

    this.setWorldCapsule(shoulders, this.rig, [-0.24, 1.47, -0.015], [0.24, 1.47, -0.015]);
    this.setWorldCapsule(upperTorso, this.rig, [0, 1.43, -0.07], [0, 1.12, -0.07]);
    this.setWorldCapsule(hips, this.rig, [0, 1.02, -0.04], [0, 0.8, -0.04]);
    this.setWorldCapsule(belt, this.rig, [0, 1.01, -0.005], [0, 1.01, -0.005]);
    this.setWorldCapsule(leftArm, this.leftArm, [0, -0.02, 0], [0, -0.69, 0]);
    this.setWorldCapsule(rightArm, this.rightArm, [0, -0.02, 0], [0, -0.69, 0]);
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

  public getAnimationDiagnostics(): { readonly bob: number; readonly runningBlend: number } {
    return { bob: this.gaitBob, runningBlend: this.runningBlend };
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

    const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.205, 0.18, 5, 10), armor);
    hips.position.y = 0.88;
    hips.scale.z = 0.76;
    this.rig.add(hips);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.205, 0.58, 10), armor);
    torso.position.y = 1.25;
    torso.scale.z = 0.74;
    this.rig.add(torso);

    const breastplate = new THREE.Mesh(new THREE.CylinderGeometry(0.252, 0.205, 0.42, 10, 1, false), darkMetal);
    breastplate.position.set(0, 1.29, -0.075);
    breastplate.scale.z = 0.7;
    this.rig.add(breastplate);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.215, 0.028, 6, 18), leather);
    belt.rotation.x = Math.PI / 2;
    belt.position.y = 1.01;
    belt.scale.z = 0.78;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.072, 0.035), trim);
    buckle.position.set(0, 1.01, -0.2);
    this.rig.add(belt, buckle);

    const head = createProceduralHead(skin, darkMetal, trim);
    const gorget = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.022, 6, 20), leather);
    gorget.rotation.x = Math.PI / 2;
    gorget.position.y = 1.53;
    gorget.scale.z = 0.78;
    const claspGeometry = new THREE.SphereGeometry(0.042, 10, 8);
    const leftClasp = new THREE.Mesh(claspGeometry, trim);
    leftClasp.position.set(-0.225, 1.5, -0.12);
    const rightClasp = leftClasp.clone();
    rightClasp.position.x = 0.225;
    this.rig.add(head, gorget, leftClasp, rightClasp);

    this.createArm(this.leftArm, -1, armor, darkMetal, leather);
    this.createArm(this.rightArm, 1, armor, darkMetal, leather);
    this.createLeg(this.leftLeg, -1, cloth, darkMetal);
    this.createLeg(this.rightLeg, 1, cloth, darkMetal);
    this.rig.add(this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

    const shoulderGeometry = new THREE.SphereGeometry(0.105, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const leftShoulder = new THREE.Mesh(shoulderGeometry, armor);
    leftShoulder.position.set(-0.245, 1.48, 0);
    leftShoulder.scale.set(1.12, 0.78, 1);
    leftShoulder.rotation.z = 0.35;
    const rightShoulder = leftShoulder.clone();
    rightShoulder.position.x = 0.245;
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
    arm.position.set(side * 0.26, 1.43, 0);
    arm.rotation.z = side * -0.08;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.072, 0.43, 9), leather);
    upper.position.y = -0.22;
    const bracer = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.058, 0.32, 9), armor);
    bracer.position.y = -0.56;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.064, 9, 7), metal);
    hand.position.y = -0.74;
    arm.add(upper, bracer, hand);
  }

  private createLeg(leg: THREE.Group, side: -1 | 1, cloth: THREE.Material, metal: THREE.Material): void {
    leg.position.set(side * 0.115, 0.79, 0);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.086, 0.42, 9), cloth);
    thigh.position.y = -0.22;
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.087, 0.065, 0.4, 9), metal);
    shin.position.y = -0.62;
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.13, 0.27), metal);
    boot.position.set(0, -0.86, -0.065);
    leg.add(thigh, shin, boot);
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
}
