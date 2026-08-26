import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import {
  CAPE_ATTACHMENT_FABRIC_NAME,
  CAPE_TIES_NAME,
} from '../src/player/CapeAttachment';
import { Character } from '../src/player/Character';

describe('procedural cape attachment', () => {
  test('overlaps the simulated pinned row with a visible shoulder yoke and gathered seam', () => {
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

    expect(attachmentBounds.max.z - attachmentBounds.min.z).toBeGreaterThan(0.14);
    expect(attachmentBounds.max.x - attachmentBounds.min.x).toBeGreaterThan(0.55);
  });
});
