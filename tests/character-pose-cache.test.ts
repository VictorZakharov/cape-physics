import { expect, test } from 'bun:test';
import * as THREE from 'three';
import { Character } from '../src/player/Character';

test('shares rig matrix work between anchors and colliders while honoring animation and external root/parent transforms', () => {
  const character = new Character(), parent = new THREE.Group();
  parent.add(character.root);
  const original = character.root.updateMatrixWorld.bind(character.root);
  let refreshes = 0;
  character.root.updateMatrixWorld = (force) => { refreshes++; original(force); };
  try {
    const initial = character.getCapeAnchors().left.clone();
    character.getCapeColliders();
    character.getCapeAnchors();
    expect(refreshes).toBe(1);
    character.root.position.x += 2;
    expect(character.getCapeAnchors().left.x).toBeCloseTo(initial.x + 2, 6);
    expect(refreshes).toBe(2);
    parent.position.z += 4;
    expect(character.getCapeAnchors().left.z).toBeCloseTo(initial.z + 4, 6);
    expect(refreshes).toBe(3);
    character.updateAnimation(1 / 60, 3);
    character.getCapeColliders();
    character.getCapeAnchors();
    expect(refreshes).toBe(4);
    character.resetAnimation();
    character.getCapeAnchors();
    expect(refreshes).toBe(5);
    parent.remove(character.root);
    expect(character.getCapeAnchors().left.z).toBeCloseTo(initial.z, 6);
    expect(refreshes).toBe(6);
  } finally { character.dispose(); }
});
