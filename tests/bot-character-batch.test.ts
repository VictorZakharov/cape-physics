import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { WORLD_RENDER_LAYER } from '../src/core/renderLayers';
import { BOT_CYAN_CAPE_PALETTE } from '../src/physics/CapeAppearance';
import { BotCharacterBatch } from '../src/player/BotCharacterBatch';
import { Character } from '../src/player/Character';

function bodyMeshes(character: Character): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  character.root.traverse((object) => {
    if (object instanceof THREE.Mesh) meshes.push(object);
  });
  return meshes;
}

describe('instanced bot character rendering', () => {
  test('preserves animated part transforms, materials, and shadows in small instance groups', () => {
    const characters = Array.from({ length: 3 }, () => new Character(BOT_CYAN_CAPE_PALETTE));
    const batch = new BotCharacterBatch();
    try {
      characters.forEach((character, index) => {
        character.root.position.set(index * 2, index * 0.1, -index * 3);
        character.root.rotation.y = index * 0.8;
        character.updateAnimation(0.25 + index * 0.1, 3);
        character.getCapeAnchors();
      });
      const originals = characters.map(bodyMeshes);
      batch.setCharacters(characters);
      expect(batch.group.children).toHaveLength(originals[0]!.length);
      const instance = new THREE.Matrix4();
      batch.group.children.forEach((object, part) => {
        const mesh = object as THREE.InstancedMesh;
        expect(mesh.count).toBe(3);
        expect(mesh.castShadow).toBe(originals[0]![part]!.castShadow);
        expect(mesh.receiveShadow).toBe(originals[0]![part]!.receiveShadow);
        expect(mesh.layers.mask).toBe(1 << WORLD_RENDER_LAYER);
        expect(mesh.frustumCulled).toBe(true);
        expect(mesh.boundingSphere).not.toBeNull();
        expect(mesh.geometry.getAttribute('position').count)
          .toBe(originals[0]![part]!.geometry.getAttribute('position').count);
        const material = mesh.material as THREE.MeshStandardMaterial;
        const original = originals[0]![part]!.material as THREE.MeshStandardMaterial;
        expect(material.color.equals(original.color)).toBe(true);
        expect(material.roughness).toBe(original.roughness);
        expect(material.metalness).toBe(original.metalness);
        for (let index = 0; index < characters.length; index += 1) {
          mesh.getMatrixAt(index, instance);
          instance.elements.forEach((value, axis) => {
            expect(value).toBeCloseTo(originals[index]![part]!.matrixWorld.elements[axis]!, 5);
          });
        }
      });
      characters[1]!.root.position.x += 1;
      characters[1]!.updateAnimation(0.3, 4);
      characters[1]!.getCapeAnchors();
      batch.sync();
      (batch.group.children[0] as THREE.InstancedMesh).getMatrixAt(1, instance);
      expect(instance.elements[12]).toBeCloseTo(originals[1]![0]!.matrixWorld.elements[12]!, 5);
      expect(characters.every((character) => !character.root.visible)).toBe(true);
      batch.setCharacters([characters[2]!]);
      expect(characters[0]!.root.visible).toBe(true);
      expect(characters[1]!.root.visible).toBe(true);
      expect((batch.group.children[0] as THREE.InstancedMesh).count).toBe(1);
      batch.setCharacters([]);
      expect(batch.group.children.every((object) => (object as THREE.InstancedMesh).count === 0)).toBe(true);
    } finally {
      batch.dispose();
      characters.forEach((character) => character.dispose());
    }
  });

  test('owns batch resources independently of a disposed first bot', () => {
    const first = new Character(BOT_CYAN_CAPE_PALETTE);
    const replacement = new Character(BOT_CYAN_CAPE_PALETTE);
    const batch = new BotCharacterBatch();
    try {
      first.getCapeAnchors(); replacement.getCapeAnchors();
      batch.setCharacters([first]);
      const source = bodyMeshes(first)[0]!;
      const instance = batch.group.children[0] as THREE.InstancedMesh;
      expect(instance.geometry).not.toBe(source.geometry);
      expect(instance.material).not.toBe(source.material);
      batch.setCharacters([]);
      first.dispose();
      batch.setCharacters([replacement]);
      expect(instance.count).toBe(1);
      expect(instance.geometry.getAttribute('position').count).toBeGreaterThan(0);
    } finally {
      batch.dispose();
      replacement.dispose();
    }
  });

  test('groups a crowd into bounded, independently culled batches', () => {
    const characters = Array.from({ length: 10 }, () => new Character(BOT_CYAN_CAPE_PALETTE));
    const batch = new BotCharacterBatch();
    try {
      characters.forEach((character, index) => {
        character.root.position.set(index % 2, 0, -index * 2);
        character.getCapeAnchors();
      });
      const parts = bodyMeshes(characters[0]!).length;
      batch.setCharacters(characters);
      expect(batch.group.children).toHaveLength(parts * 2);
      const first = batch.group.children[0] as THREE.InstancedMesh;
      const second = batch.group.children[parts] as THREE.InstancedMesh;
      expect(first.count).toBe(8);
      expect(second.count).toBe(2);
      expect(first.geometry).toBe(second.geometry);
      expect(first.material).toBe(second.material);
      const matrix = new THREE.Matrix4();
      second.getMatrixAt(1, matrix);
      expect(matrix.elements[14]).toBeCloseTo(bodyMeshes(characters[9]!)[0]!.matrixWorld.elements[14]!, 5);
      const initialBounds = second.boundingSphere!.clone();
      characters[9]!.root.position.z -= 5;
      characters[9]!.getCapeAnchors();
      batch.sync();
      expect(second.boundingSphere!.equals(initialBounds)).toBe(false);
      batch.setCharacters(characters.slice(0, 1));
      expect(second.visible).toBe(false);
      expect(second.count).toBe(0);
    } finally {
      batch.dispose();
      characters.forEach((character) => character.dispose());
    }
  });
});
