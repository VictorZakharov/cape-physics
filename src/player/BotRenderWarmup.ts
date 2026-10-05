import * as THREE from 'three';
import { WORLD_RENDER_LAYER } from '../core/renderLayers';
import { BOT_CYAN_CAPE_PALETTE } from '../physics/CapeAppearance';
import { CapeSimulation } from '../physics/CapeSimulation';
import type { GpuCapeSimulation } from '../physics/GpuCapeSimulation';
import type { CapePhysicsSettings } from '../physics/CapeSettings';
import { BotCharacterBatch } from './BotCharacterBatch';
import { BOT_COUNT_RANGE } from './BotMovementInput';
import { Character } from './Character';

/** Include every crowd render variant in asynchronous startup compilation. */
export function prepareBotRenderWarmup(
  scene: THREE.Scene,
  batch: BotCharacterBatch,
  playerCape: CapeSimulation | GpuCapeSimulation,
  settings: CapePhysicsSettings,
  material: THREE.MeshPhysicalMaterial | undefined,
  restoreCharacters: readonly Character[],
): () => void {
  const character = new Character(BOT_CYAN_CAPE_PALETTE);
  character.getCapeAnchors();
  batch.setCharacters(Array.from({ length: BOT_COUNT_RANGE.max }, () => character));
  batch.group.traverse((object) => { object.frustumCulled = false; });
  const cape = playerCape instanceof CapeSimulation
    ? new CapeSimulation(character.getCapeAnchors(), settings, BOT_CYAN_CAPE_PALETTE, { material })
    : null;
  const previousCount = playerCape instanceof CapeSimulation ? 0 : playerCape.botMesh.count;
  if (cape) {
    cape.mesh.layers.set(WORLD_RENDER_LAYER);
    scene.add(cape.mesh);
  } else if (!(playerCape instanceof CapeSimulation)) {
    playerCape.prewarmBotMesh(character.getCapeAnchors());
  }
  return () => {
    batch.setCharacters(restoreCharacters);
    batch.group.traverse((object) => { object.frustumCulled = true; });
    if (cape) { scene.remove(cape.mesh); cape.dispose(); }
    else if (!(playerCape instanceof CapeSimulation)) playerCape.botMesh.count = previousCount;
    character.dispose();
  };
}
