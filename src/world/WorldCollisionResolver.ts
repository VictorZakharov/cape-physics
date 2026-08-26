import * as THREE from 'three';
import { CAVE, PLAYER } from '../config';
import type { WorldSphereCollider } from '../physics/colliders';
import {
  caveCeiling,
  caveCenterX,
  caveGroundHeightAt,
  caveHalfWidth,
  caveInteriorHalfWidthAtHeight,
} from './caveProfile';

const PLAYER_WALL_MARGIN = PLAYER.radius + 0.42;
const SUPPORT_INSET = 0.94;
const CEILING_CLEARANCE = 0.08;

export interface PlayerVerticalMotion {
  readonly previousY: number;
  readonly velocityY: number;
  readonly grounded: boolean;
}

export interface PlayerCollisionResult {
  readonly grounded: boolean;
  readonly hitCeiling: boolean;
}

export class WorldCollisionResolver {
  private readonly separation = new THREE.Vector2();

  public constructor(private readonly colliders: readonly WorldSphereCollider[]) {}

  public resolvePlayer(
    position: THREE.Vector3,
    verticalMotion?: PlayerVerticalMotion,
  ): PlayerCollisionResult {
    this.constrainCorridorBounds(position);
    if (!verticalMotion || verticalMotion.grounded) {
      position.y = this.getPlayerRootHeight(position.x, position.z);
    }
    this.constrainPlanarBounds(position);

    for (const collider of this.colliders) {
      if (collider.walkable) continue;
      this.resolveObstacle(position, collider);
    }

    this.constrainCorridorBounds(position);
    if (!verticalMotion || verticalMotion.grounded) {
      position.y = this.getPlayerRootHeight(position.x, position.z);
    }
    this.constrainPlanarBounds(position);
    const supportHeight = this.getPlayerRootHeight(position.x, position.z);
    let grounded = verticalMotion?.grounded ?? true;
    const crossedSupportWhileFalling = verticalMotion !== undefined
      && verticalMotion.velocityY <= 0
      && verticalMotion.previousY >= supportHeight
      && position.y <= supportHeight;
    const embeddedInSupport = position.y < supportHeight;
    if (!verticalMotion || grounded || crossedSupportWhileFalling || embeddedInSupport) {
      position.y = supportHeight;
      grounded = true;
    }

    const maximumRootHeight = caveCeiling(position.z) - PLAYER.height - CEILING_CLEARANCE;
    const hitCeiling = position.y > maximumRootHeight;
    if (hitCeiling) {
      position.y = Math.max(supportHeight, maximumRootHeight);
      grounded = position.y <= supportHeight + 0.000_001;
    }
    return { grounded, hitCeiling };
  }

  public getPlayerRootHeight(x: number, z: number): number {
    return this.getGroundHeight(x, z) + PLAYER.footOffset;
  }

  public getGroundHeight(x: number, z: number): number {
    let height = caveGroundHeightAt(x, z);
    for (const collider of this.colliders) {
      if (!collider.walkable) continue;
      const dx = x - collider.center.x;
      const dz = z - collider.center.z;
      const supportRadius = collider.radius * SUPPORT_INSET;
      const planarSquared = dx * dx + dz * dz;
      if (planarSquared >= supportRadius * supportRadius) continue;
      const top = collider.center.y + Math.sqrt(collider.radius * collider.radius - planarSquared);
      height = Math.max(height, top);
    }
    return height;
  }

  private constrainPlanarBounds(position: THREE.Vector3): void {
    const center = caveCenterX(position.z);
    const upperCenter = position.y + PLAYER.height - PLAYER.radius;
    const middleCenter = position.y + PLAYER.height * 0.5;
    const shellClearance = PLAYER.radius + 0.12;
    const halfWidth = Math.min(
      caveHalfWidth(position.z) - PLAYER_WALL_MARGIN,
      caveInteriorHalfWidthAtHeight(middleCenter, position.z, shellClearance),
      caveInteriorHalfWidthAtHeight(upperCenter, position.z, shellClearance),
    );
    position.x = THREE.MathUtils.clamp(position.x, center - halfWidth, center + halfWidth);
  }

  private constrainCorridorBounds(position: THREE.Vector3): void {
    position.z = THREE.MathUtils.clamp(position.z, CAVE.endZ + 2.2, CAVE.startZ - 2.1);
    const center = caveCenterX(position.z);
    const halfWidth = caveHalfWidth(position.z) - PLAYER_WALL_MARGIN;
    position.x = THREE.MathUtils.clamp(position.x, center - halfWidth, center + halfWidth);
  }

  private resolveObstacle(position: THREE.Vector3, collider: WorldSphereCollider): void {
    const capsuleBottom = position.y + PLAYER.radius;
    const capsuleTop = position.y + PLAYER.height - PLAYER.radius;
    const closestY = THREE.MathUtils.clamp(collider.center.y, capsuleBottom, capsuleTop);
    const verticalDistance = collider.center.y - closestY;
    const combinedRadius = collider.radius + PLAYER.radius;
    const planarRequiredSquared = combinedRadius * combinedRadius - verticalDistance * verticalDistance;
    if (planarRequiredSquared <= 0) return;

    this.separation.set(position.x - collider.center.x, position.z - collider.center.z);
    const planarDistance = this.separation.length();
    const requiredDistance = Math.sqrt(planarRequiredSquared);
    if (planarDistance >= requiredDistance) return;
    if (planarDistance < 0.000_001) this.separation.set(1, 0);
    else this.separation.multiplyScalar(1 / planarDistance);
    position.x += this.separation.x * (requiredDistance - planarDistance);
    position.z += this.separation.y * (requiredDistance - planarDistance);
  }
}
