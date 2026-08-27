import * as THREE from 'three/webgpu';
import { CAVE, PLAYER } from '../config';
import {
  isWorldRockCollider,
  type WorldCollider,
  type WorldRockCollider,
  type WorldSphereCollider,
} from '../physics/colliders';
import { RockColliderQuery } from '../physics/RockCollider';
import {
  caveCeiling,
  caveCenterX,
  caveGroundHeightAt,
  caveHalfWidth,
  caveInteriorBoundsAtHeight,
} from './caveProfile';
import type { CaveHorizontalBounds } from './CaveShellSampler';

const PLAYER_WALL_MARGIN = PLAYER.radius + 0.42;
const SUPPORT_INSET = 0.94;
const CEILING_CLEARANCE = 0.08;
const WALKABLE_ROCK_FOOTPRINT = PLAYER.radius * 1.5;

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
  private readonly capsuleSample = new THREE.Vector3();
  private readonly rockQuery = new RockColliderQuery();
  private readonly middleBounds: CaveHorizontalBounds = { minimum: 0, maximum: 0 };
  private readonly upperBounds: CaveHorizontalBounds = { minimum: 0, maximum: 0 };

  public constructor(private readonly colliders: readonly WorldCollider[]) {}

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
      if (isWorldRockCollider(collider)) {
        const support = this.getSmoothRockSupport(collider, x, z, height);
        if (support !== null) height = Math.max(height, support);
        continue;
      }
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

  private getSmoothRockSupport(
    collider: WorldRockCollider,
    x: number,
    z: number,
    groundHeight: number,
  ): number | null {
    const centerX = (collider.bounds.min.x + collider.bounds.max.x) * 0.5;
    const centerZ = (collider.bounds.min.z + collider.bounds.max.z) * 0.5;
    const radiusX = (collider.bounds.max.x - collider.bounds.min.x) * 0.5
      + WALKABLE_ROCK_FOOTPRINT;
    const radiusZ = (collider.bounds.max.z - collider.bounds.min.z) * 0.5
      + WALKABLE_ROCK_FOOTPRINT;
    const normalizedDistance = Math.hypot(
      (x - centerX) / Math.max(radiusX, 0.001),
      (z - centerZ) / Math.max(radiusZ, 0.001),
    );
    if (normalizedDistance >= 1) return null;

    // This is the support surface of the character footprint, not the rock
    // mesh itself: the expanded smooth shoulder starts lifting the feet before
    // their volume reaches a sharp edge, preventing a one-frame step impulse.
    const blend = 1 - THREE.MathUtils.smoothstep(normalizedDistance, 0.12, 1);
    return THREE.MathUtils.lerp(
      groundHeight,
      Math.max(groundHeight, collider.bounds.max.y),
      blend,
    );
  }

  private constrainPlanarBounds(position: THREE.Vector3): void {
    const center = caveCenterX(position.z);
    const upperCenter = position.y + PLAYER.height - PLAYER.radius;
    const middleCenter = position.y + PLAYER.height * 0.5;
    const shellClearance = PLAYER.radius + 0.12;
    const corridorHalfWidth = caveHalfWidth(position.z) - PLAYER_WALL_MARGIN;
    caveInteriorBoundsAtHeight(
      middleCenter,
      position.z,
      shellClearance,
      this.middleBounds,
    );
    caveInteriorBoundsAtHeight(
      upperCenter,
      position.z,
      shellClearance,
      this.upperBounds,
    );
    position.x = THREE.MathUtils.clamp(
      position.x,
      Math.max(
        center - corridorHalfWidth,
        this.middleBounds.minimum,
        this.upperBounds.minimum,
      ),
      Math.min(
        center + corridorHalfWidth,
        this.middleBounds.maximum,
        this.upperBounds.maximum,
      ),
    );
  }

  private constrainCorridorBounds(position: THREE.Vector3): void {
    position.z = THREE.MathUtils.clamp(position.z, CAVE.endZ + 2.2, CAVE.startZ - 2.1);
    const center = caveCenterX(position.z);
    const halfWidth = caveHalfWidth(position.z) - PLAYER_WALL_MARGIN;
    position.x = THREE.MathUtils.clamp(position.x, center - halfWidth, center + halfWidth);
  }

  private resolveObstacle(position: THREE.Vector3, collider: WorldCollider): void {
    if (isWorldRockCollider(collider)) {
      this.resolveRockObstacle(position, collider);
      return;
    }
    this.resolveSphereObstacle(position, collider);
  }

  private resolveSphereObstacle(position: THREE.Vector3, collider: WorldSphereCollider): void {
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

  private resolveRockObstacle(position: THREE.Vector3, collider: WorldRockCollider): void {
    const capsuleBottom = position.y + PLAYER.radius;
    const capsuleTop = position.y + PLAYER.height - PLAYER.radius;
    for (let sample = 0; sample <= 4; sample += 1) {
      this.capsuleSample.set(
        position.x,
        THREE.MathUtils.lerp(capsuleBottom, capsuleTop, sample / 4),
        position.z,
      );
      const penetration = this.rockQuery.getPlanarSeparation(
        collider,
        this.capsuleSample,
        PLAYER.radius,
        this.separation,
      );
      if (penetration <= 0) continue;
      position.x += this.separation.x * penetration;
      position.z += this.separation.y * penetration;
    }
  }
}
