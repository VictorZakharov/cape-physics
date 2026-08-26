import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import {
  CAPE_ATTACHMENT_FABRIC_NAME,
  CAPE_TIES_NAME,
  setCapeCollarPoint,
  setCapeNecklinePoint,
  setCapeShoulderPoint,
  setCapeUpperBackPoint,
} from '../src/player/CapeAttachment';
import { Character } from '../src/player/Character';

describe('procedural cape attachment', () => {
  test('joins the neck through both shoulders and overlaps the dynamic upper back', () => {
    const character = new Character();
    character.root.position.set(2.4, 0.7, -3.1);
    character.root.rotation.y = 0.73;
    character.root.updateMatrixWorld(true);
    const anchors = character.getCapeAnchors();
    const cape = new CapeSimulation(anchors);
    const attachmentFabric = character.root.getObjectByName(CAPE_ATTACHMENT_FABRIC_NAME);
    const ties = character.root.getObjectByName(CAPE_TIES_NAME);

    expect(attachmentFabric).toBeInstanceOf(THREE.Mesh);
    expect(ties).toBeInstanceOf(THREE.Mesh);

    const attachmentBounds = new THREE.Box3().setFromObject(attachmentFabric!);
    expect(attachmentBounds.distanceToPoint(anchors.left)).toBeLessThan(0.001);
    expect(attachmentBounds.distanceToPoint(anchors.right)).toBeLessThan(0.001);

    const centerColumn = Math.floor(CAPE.columns / 2);
    const pinnedCenter = cape.getParticlePosition(centerColumn, 0);
    expect(attachmentBounds.distanceToPoint(pinnedCenter)).toBeLessThan(0.001);

    const collar = setCapeCollarPoint(0.5, new THREE.Vector3());
    const shoulder = setCapeShoulderPoint(0.5, new THREE.Vector3());
    const seam = setCapeNecklinePoint(0.5, new THREE.Vector3());
    const upperBack = setCapeUpperBackPoint(0.5, new THREE.Vector3());
    const worldSeam = seam.clone().applyMatrix4(character.root.matrixWorld);

    expect(pinnedCenter.distanceTo(worldSeam)).toBeLessThan(0.000_01);
    expect(collar.z).toBeLessThan(0.1);
    expect(seam.z).toBeLessThan(0.2);
    expect(collar.distanceTo(shoulder)).toBeLessThan(0.03);
    expect(shoulder.distanceTo(seam)).toBeLessThan(0.09);
    expect(seam.distanceTo(upperBack)).toBeLessThan(0.23);

    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const collarPoint = setCapeCollarPoint(progress, new THREE.Vector3());
      const shoulderPoint = setCapeShoulderPoint(progress, new THREE.Vector3());
      const seamPoint = setCapeNecklinePoint(progress, new THREE.Vector3());
      const upperBackPoint = setCapeUpperBackPoint(progress, new THREE.Vector3());
      expect(collarPoint.distanceTo(shoulderPoint)).toBeLessThan(0.11);
      expect(shoulderPoint.distanceTo(seamPoint)).toBeLessThan(0.125);
      expect(seamPoint.distanceTo(upperBackPoint)).toBeLessThan(0.23);
    }

    expect(attachmentBounds.max.z - attachmentBounds.min.z).toBeGreaterThan(0.2);
    expect(attachmentBounds.max.x - attachmentBounds.min.x).toBeGreaterThan(0.51);
    expect(attachmentBounds.max.x - attachmentBounds.min.x).toBeLessThan(0.58);
  });
});
