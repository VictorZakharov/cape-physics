import { expect, test } from 'bun:test';
import * as THREE from 'three';
import { BOT_CYAN_CAPE_PALETTE } from '../src/physics/CapeAppearance';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { BotCharacterBatch } from '../src/player/BotCharacterBatch';
import { prepareBotRenderWarmup } from '../src/player/BotRenderWarmup';
import { Character } from '../src/player/Character';

test('warm-up allocates crowd cohorts and compiles representative materials, then restores the scene', () => {
  const scene = new THREE.Scene();
  const character = new Character(BOT_CYAN_CAPE_PALETTE);
  const cape = new CapeSimulation(character.getCapeAnchors());
  const material = (cape.mesh.material as THREE.MeshPhysicalMaterial).clone();
  let materialDisposed = false;
  material.addEventListener('dispose', () => { materialDisposed = true; });
  const batch = new BotCharacterBatch();
  scene.add(batch.group, cape.mesh);
  batch.setCharacters([character]);
  const parts = batch.group.children.length;
  const finish = prepareBotRenderWarmup(scene, batch, cape, cape.getSettings(), material, [character]);
  try {
    expect(batch.group.children).toHaveLength(parts * 7);
    expect(batch.group.children.filter((object) => object.visible)).toHaveLength(parts * 7);
    expect(batch.group.children.every((object) => !object.frustumCulled)).toBe(true);
    expect(scene.children).toHaveLength(3);
    expect((scene.children[2] as THREE.Mesh).material).toBe(material);
  } finally { finish(); }
  try {
    expect(scene.children).toHaveLength(2);
    expect(batch.group.children.every((object) => object.frustumCulled)).toBe(true);
    expect((batch.group.children[0] as THREE.InstancedMesh).count).toBe(1);
    expect(character.root.visible).toBe(false);
    expect(materialDisposed).toBe(false);
  } finally { batch.dispose(); material.dispose(); cape.dispose(); character.dispose(); }
});
