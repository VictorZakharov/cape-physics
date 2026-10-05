import * as THREE from 'three';
import { WORLD_RENDER_LAYER } from '../core/renderLayers';
import type { Character } from './Character';

const CHARACTERS_PER_BATCH = 8;

/** Draw matching animated body parts together in independently culled groups. */
export class BotCharacterBatch {
  public readonly group = new THREE.Group();
  private readonly batches: THREE.InstancedMesh[][] = [];
  private readonly materials = new Set<THREE.Material>();
  private readonly templates: THREE.Mesh[] = [];
  private sources: THREE.Mesh[][] = [];
  private characters: readonly Character[] = [];

  public setCharacters(characters: readonly Character[]): void {
    this.characters.forEach((character) => { character.root.visible = true; });
    this.characters = characters;
    this.sources = characters.map((character) => {
      const meshes: THREE.Mesh[] = [];
      character.root.traverse((object) => {
        if (object instanceof THREE.Mesh) meshes.push(object);
      });
      character.root.visible = false;
      return meshes;
    });
    if (this.templates.length === 0 && this.sources.length > 0) {
      const sharedMaterials = new Map<THREE.Material, THREE.Material>();
      const cloneMaterial = (source: THREE.Material): THREE.Material => {
        let material = sharedMaterials.get(source);
        if (!material) {
          material = source.clone();
          sharedMaterials.set(source, material);
          this.materials.add(material);
        }
        return material;
      };
      for (const source of this.sources[0]!) {
        const material = Array.isArray(source.material)
          ? source.material.map(cloneMaterial)
          : cloneMaterial(source.material);
        const template = new THREE.Mesh(source.geometry.clone(), material);
        template.name = source.name || source.geometry.type;
        template.castShadow = source.castShadow;
        template.receiveShadow = source.receiveShadow;
        this.templates.push(template);
      }
    }
    while (this.batches.length < Math.ceil(characters.length / CHARACTERS_PER_BATCH)) {
      const cohort = this.templates.map((template) => {
        const batch = new THREE.InstancedMesh(template.geometry, template.material, CHARACTERS_PER_BATCH);
        batch.name = `Bot crowd: ${template.name}`;
        batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        batch.layers.set(WORLD_RENDER_LAYER);
        batch.castShadow = template.castShadow;
        batch.receiveShadow = template.receiveShadow;
        // Small cohorts retain camera and shadow-frustum culling along the cave.
        batch.frustumCulled = true;
        this.group.add(batch);
        return batch;
      });
      this.batches.push(cohort);
    }
    this.sync();
  }

  public sync(): void {
    for (let cohort = 0; cohort < this.batches.length; cohort += 1) {
      const first = cohort * CHARACTERS_PER_BATCH;
      const count = Math.max(0, Math.min(CHARACTERS_PER_BATCH, this.sources.length - first));
      const batches = this.batches[cohort]!;
      for (let part = 0; part < batches.length; part += 1) {
        const batch = batches[part]!;
        batch.count = count;
        batch.visible = count > 0;
        for (let character = 0; character < count; character += 1) {
          batch.setMatrixAt(character, this.sources[first + character]![part]!.matrixWorld);
        }
        if (count > 0) {
          batch.instanceMatrix.needsUpdate = true;
          batch.computeBoundingSphere();
        }
      }
    }
  }

  public dispose(): void {
    this.characters.forEach((character) => { character.root.visible = true; });
    this.characters = [];
    this.batches.forEach((cohort) => cohort.forEach((batch) => batch.dispose()));
    this.templates.forEach((template) => template.geometry.dispose());
    this.materials.forEach((material) => material.dispose());
    this.group.clear();
    this.sources = [];
    this.batches.length = 0;
    this.templates.length = 0;
    this.materials.clear();
  }
}
