import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import {
  CAPE_ATTACHMENT_FABRIC_NAME,
  CAPE_TIES_NAME,
  setCapeNecklinePoint,
} from '../src/player/CapeAttachment';
import { Character } from '../src/player/Character';
import { getTorsoRearSurfaceZ } from '../src/player/ProceduralTorso';

function getUpperBackClearance(cape: CapeSimulation): number {
  const point = new THREE.Vector3();
  let minimum = Number.POSITIVE_INFINITY;
  const sampleResolution = 8;

  for (let column = 0; column < CAPE.columns - 1; column += 1) {
    const topLeft = cape.getParticlePosition(column, 0);
    const bottomLeft = cape.getParticlePosition(column, 1);
    const topRight = cape.getParticlePosition(column + 1, 0);
    const bottomRight = cape.getParticlePosition(column + 1, 1);
    const triangles = [
      [topLeft, bottomLeft, topRight],
      [bottomLeft, bottomRight, topRight],
    ] as const;
    for (const [first, second, third] of triangles) {
      for (let firstWeight = 0; firstWeight <= sampleResolution; firstWeight += 1) {
        for (
          let secondWeight = 0;
          secondWeight <= sampleResolution - firstWeight;
          secondWeight += 1
        ) {
          const normalizedFirst = firstWeight / sampleResolution;
          const normalizedSecond = secondWeight / sampleResolution;
          const normalizedThird = 1 - normalizedFirst - normalizedSecond;
          point.copy(first).multiplyScalar(normalizedFirst)
            .addScaledVector(second, normalizedSecond)
            .addScaledVector(third, normalizedThird);
          const rearSurface = getTorsoRearSurfaceZ(point.x, point.y);
          if (rearSurface !== null) minimum = Math.min(minimum, point.z - rearSurface);
        }
      }
    }
  }
  return minimum;
}

function getSettledBackContactRange(cape: CapeSimulation): {
  readonly minimum: number;
  readonly maximum: number;
} {
  const centerColumn = Math.floor(CAPE.columns / 2);
  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;

  for (let row = 1; row <= 5; row += 1) {
    const point = cape.getParticlePosition(centerColumn, row);
    const rearSurface = getTorsoRearSurfaceZ(point.x, point.y);
    expect(rearSurface).not.toBeNull();
    const clearance = point.z - rearSurface!;
    minimum = Math.min(minimum, clearance);
    maximum = Math.max(maximum, clearance);
  }

  return { minimum, maximum };
}

describe('procedural cape attachment', () => {
  test('pins the simulated cloth itself around the neck before widening over the shoulders', () => {
    const character = new Character();
    character.root.position.set(2.4, 0.7, -3.1);
    character.root.rotation.y = 0.73;
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const cape = new CapeSimulation(anchors);
    const seam = character.root.getObjectByName(CAPE_ATTACHMENT_FABRIC_NAME);
    const ties = character.root.getObjectByName(CAPE_TIES_NAME);
    const clasp = character.root.getObjectByName('Cape throat clasp');

    expect(seam).toBeInstanceOf(THREE.Mesh);
    expect(ties).toBeInstanceOf(THREE.Mesh);
    expect(clasp).toBeInstanceOf(THREE.Mesh);

    const seamBounds = new THREE.Box3().setFromObject(seam!);
    const tiesBounds = new THREE.Box3().setFromObject(ties!);
    expect(seamBounds.distanceToPoint(anchors.left)).toBeLessThan(0.001);
    expect(seamBounds.distanceToPoint(anchors.right)).toBeLessThan(0.001);
    expect(tiesBounds.distanceToPoint(clasp!.getWorldPosition(new THREE.Vector3()))).toBeLessThan(0.001);
    expect(clasp!.position.z).toBeLessThan(-0.15);

    const centerColumn = Math.floor(CAPE.columns / 2);
    const pinnedCenter = cape.getParticlePosition(centerColumn, 0);
    const expectedCenter = setCapeNecklinePoint(0.5, new THREE.Vector3())
      .applyMatrix4(character.root.matrixWorld);
    expect(pinnedCenter.distanceTo(expectedCenter)).toBeLessThan(0.000_01);

    const topWidth = cape.getParticlePosition(0, 0)
      .distanceTo(cape.getParticlePosition(CAPE.columns - 1, 0));
    const firstFreeWidth = cape.getParticlePosition(0, 1)
      .distanceTo(cape.getParticlePosition(CAPE.columns - 1, 1));
    const shoulderWidth = cape.getParticlePosition(0, 2)
      .distanceTo(cape.getParticlePosition(CAPE.columns - 1, 2));
    expect(topWidth).toBeLessThan(0.22);
    expect(firstFreeWidth).toBeGreaterThan(topWidth * 1.75);
    expect(shoulderWidth).toBeGreaterThan(0.49);

    for (let column = 0; column < CAPE.columns; column += 1) {
      const local = character.root.worldToLocal(cape.getParticlePosition(column, 0).clone());
      const neckRadius = Math.hypot(local.x, local.z);
      expect(neckRadius).toBeGreaterThan(0.095);
      expect(neckRadius).toBeLessThan(0.145);
      expect(local.y).toBeGreaterThan(1.52);
      expect(local.y).toBeLessThan(1.545);
    }

    const seamMesh = seam as THREE.Mesh<THREE.BufferGeometry>;
    seamMesh.geometry.computeBoundingBox();
    const localSeamBounds = seamMesh.geometry.boundingBox!;
    expect(localSeamBounds.min.y).toBeGreaterThan(1.49);
    expect(localSeamBounds.max.y).toBeLessThan(1.57);
    expect(localSeamBounds.max.x - localSeamBounds.min.x).toBeLessThan(0.26);
    expect(localSeamBounds.max.z - localSeamBounds.min.z).toBeLessThan(0.09);
  });

  test('keeps the first free cloth strip clear of the rendered upper back at rest and settled', () => {
    const character = new Character();
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const cape = new CapeSimulation(anchors);
    const bodyColliders = character.getCapeColliders();
    const velocity = new THREE.Vector3();

    expect(getUpperBackClearance(cape)).toBeGreaterThan(0.004);
    for (let tick = 0; tick < 180; tick += 1) {
      cape.step(
        PHYSICS_STEP,
        anchors,
        bodyColliders,
        [],
        velocity,
        tick * PHYSICS_STEP,
      );
    }
    expect(getUpperBackClearance(cape)).toBeGreaterThan(0.004);
    const settledContact = getSettledBackContactRange(cape);
    expect(settledContact.minimum).toBeGreaterThan(0.004);
    expect(settledContact.maximum).toBeLessThan(0.03);
  });
});
