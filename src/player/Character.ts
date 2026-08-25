import * as THREE from 'three';
import { PLAYER } from '../config';
import type { CapsuleCollider } from '../physics/colliders';

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
  private readonly capeAnchors: CapeAnchors = {
    left: this.leftAnchorWorld,
    right: this.rightAnchorWorld,
    back: this.backWorld,
  };
  private readonly capeColliders: CapsuleCollider[] = [
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.255, name: 'shoulders' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.355, name: 'upper torso' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.36, name: 'hips and belt' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.155, name: 'left arm' },
    { start: new THREE.Vector3(), end: new THREE.Vector3(), radius: 0.155, name: 'right arm' },
  ];
  private readonly materials: THREE.Material[] = [];
  private opacity = 1;
  private walkPhase = 0;

  public constructor() {
    this.root.name = 'Procedural hero';
    this.root.add(this.rig);
    this.buildBody();
    enableShadows(this.root);
  }

  public updateAnimation(delta: number, speed: number): void {
    const gait = THREE.MathUtils.clamp(speed / PLAYER.walkSpeed, 0, 1);
    this.walkPhase += delta * THREE.MathUtils.lerp(3.2, 8.4, gait);
    const swing = Math.sin(this.walkPhase) * gait;
    const secondary = Math.sin(this.walkPhase * 2) * gait;
    this.leftLeg.rotation.x = swing * 0.62;
    this.rightLeg.rotation.x = -swing * 0.62;
    this.leftArm.rotation.x = -swing * 0.42 - 0.08;
    this.rightArm.rotation.x = swing * 0.42 - 0.08;
    this.rig.position.y = Math.abs(secondary) * 0.026;
    this.rig.rotation.z = -swing * 0.018;
  }

  public getCapeAnchors(): CapeAnchors {
    this.root.updateMatrixWorld(true);
    this.leftCapeAnchor.getWorldPosition(this.leftAnchorWorld);
    this.rightCapeAnchor.getWorldPosition(this.rightAnchorWorld);
    this.backWorld.set(0, 0, 1).applyQuaternion(this.root.quaternion).normalize();
    return this.capeAnchors;
  }

  public getCapeColliders(): readonly CapsuleCollider[] {
    const [shoulders, upperTorso, hips, leftArm, rightArm] = this.capeColliders;
    if (!shoulders || !upperTorso || !hips || !leftArm || !rightArm) {
      throw new Error('Character cape collider configuration is incomplete.');
    }

    this.setWorldCapsule(shoulders, this.rig, [-0.39, 1.48, -0.04], [0.39, 1.48, -0.04]);
    this.setWorldCapsule(upperTorso, this.rig, [0, 1.46, -0.085], [0, 1.13, -0.085]);
    this.setWorldCapsule(hips, this.rig, [0, 1.12, -0.055], [0, 0.78, -0.055]);
    this.setWorldCapsule(leftArm, this.leftArm, [0, -0.03, 0], [0, -0.72, 0]);
    this.setWorldCapsule(rightArm, this.rightArm, [0, -0.03, 0], [0, -0.72, 0]);
    return this.capeColliders;
  }

  public setOpacity(opacity: number): void {
    const nextOpacity = THREE.MathUtils.clamp(opacity, 0.5, 1);
    if (Math.abs(nextOpacity - this.opacity) < 0.002) return;
    this.opacity = nextOpacity;
    const opaque = nextOpacity > 0.995;
    for (const material of this.materials) {
      material.opacity = nextOpacity;
      material.depthWrite = opaque;
    }
  }

  public getOpacity(): number {
    return this.opacity;
  }

  private buildBody(): void {
    const armor = new THREE.MeshPhysicalMaterial({
      color: 0x182329,
      roughness: 0.28,
      metalness: 0.76,
      clearcoat: 0.36,
      clearcoatRoughness: 0.26,
    });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x080c0e, roughness: 0.38, metalness: 0.88 });
    const leather = new THREE.MeshStandardMaterial({ color: 0x24140f, roughness: 0.82, metalness: 0.03 });
    const trim = new THREE.MeshStandardMaterial({ color: 0x8e7146, roughness: 0.3, metalness: 0.82 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x161b1d, roughness: 0.92, metalness: 0 });
    this.materials.push(armor, darkMetal, leather, trim, cloth);
    for (const material of this.materials) material.transparent = true;

    const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.25, 5, 10), armor);
    hips.position.y = 0.84;
    hips.scale.z = 0.78;
    this.rig.add(hips);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.48, 6, 12), armor);
    torso.position.y = 1.2;
    torso.scale.set(1.08, 1, 0.78);
    this.rig.add(torso);

    const breastplate = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.255, 0.5, 8, 1, false), darkMetal);
    breastplate.position.set(0, 1.24, -0.11);
    breastplate.scale.z = 0.7;
    this.rig.add(breastplate);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.036, 6, 18), leather);
    belt.rotation.x = Math.PI / 2;
    belt.position.y = 0.94;
    belt.scale.z = 0.82;
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.045), trim);
    buckle.position.set(0, 0.94, -0.273);
    this.rig.add(belt, buckle);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.205, 16, 12), darkMetal);
    head.position.y = 1.69;
    head.scale.set(0.95, 1.08, 1);
    const helmCrest = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.34, 5), trim);
    helmCrest.position.y = 1.97;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.042, 0.026), trim);
    visor.position.set(0, 1.7, -0.198);
    this.rig.add(head, helmCrest, visor);

    this.createArm(this.leftArm, -1, armor, darkMetal, leather);
    this.createArm(this.rightArm, 1, armor, darkMetal, leather);
    this.createLeg(this.leftLeg, -1, cloth, darkMetal);
    this.createLeg(this.rightLeg, 1, cloth, darkMetal);
    this.rig.add(this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

    const shoulderGeometry = new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const leftShoulder = new THREE.Mesh(shoulderGeometry, armor);
    leftShoulder.position.set(-0.38, 1.49, 0);
    leftShoulder.rotation.z = 0.35;
    const rightShoulder = leftShoulder.clone();
    rightShoulder.position.x = 0.38;
    rightShoulder.rotation.z = -0.35;
    this.rig.add(leftShoulder, rightShoulder);

    this.leftCapeAnchor.position.set(-0.48, 1.52, 0.27);
    this.rightCapeAnchor.position.set(0.48, 1.52, 0.27);
    this.rig.add(this.leftCapeAnchor, this.rightCapeAnchor);
  }

  private createArm(
    arm: THREE.Group,
    side: -1 | 1,
    armor: THREE.Material,
    metal: THREE.Material,
    leather: THREE.Material,
  ): void {
    arm.position.set(side * 0.36, 1.43, 0);
    arm.rotation.z = side * -0.08;
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.45, 9), leather);
    upper.position.y = -0.22;
    const bracer = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.065, 0.33, 9), armor);
    bracer.position.y = -0.58;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.075, 9, 7), metal);
    hand.position.y = -0.77;
    arm.add(upper, bracer, hand);
  }

  private createLeg(leg: THREE.Group, side: -1 | 1, cloth: THREE.Material, metal: THREE.Material): void {
    leg.position.set(side * 0.16, 0.79, 0);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.42, 9), cloth);
    thigh.position.y = -0.22;
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.4, 9), metal);
    shin.position.y = -0.62;
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.13, 0.3), metal);
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
