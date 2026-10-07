import { applySerializedCapsuleEndpoints, copySerializedCapeAnchors, deserializeCapeAnchors, deserializeCapsuleColliders, serializeCapeAnchors, serializeCapsuleColliders, serializeCapsuleEndpoints, serializeVector3 } from '../../src/physics/CapeWorkerProtocol';
import * as THREE from 'three';
import { Character } from '../../src/player/Character';
import { BotMovementInput } from '../../src/player/BotMovementInput';
import { CharacterController } from '../../src/player/CharacterController';
import { getBotSpawnPosition } from '../../src/player/BotSpawnLayout';
import { TorchSystem } from '../../src/world/TorchSystem';
import { MineralVeins } from '../../src/world/MineralVeins';
import { CaveWorld } from '../../src/world/CaveWorld';
import { WorldCollisionResolver } from '../../src/world/WorldCollisionResolver';
import type { SurfaceTextures } from '../../src/graphics/proceduralTextures';
import type { CapeSimulation } from '../../src/physics/CapeSimulation';
export function createClothFixture(Simulation: typeof CapeSimulation, count = 50, workerInputs = false) {
  const texture = new THREE.Texture();
  const cave = new CaveWorld({ color: texture, normal: texture, roughness: texture } as SurfaceTextures);
  const torches = new TorchSystem(), veins = new MineralVeins();
  const worldColliders = [...cave.worldColliders, ...torches.worldColliders, ...veins.worldColliders];
  const resolver = new WorldCollisionResolver(worldColliders);
  const bots = Array.from({ length: count }, (_, index) => {
    const character = new Character();
    character.root.position.copy(getBotSpawnPosition(index, 11.8));
    resolver.resolvePlayer(character.root.position);
    const input = new BotMovementInput(index);
    const controller = new CharacterController(character, input, resolver);
    const simulation = new Simulation(character.getCapeAnchors(), {}, undefined, { renderResources: false });
    return { character, input, controller, simulation, initialPosition: character.root.position.clone(),
      anchors: deserializeCapeAnchors(serializeCapeAnchors(character.getCapeAnchors())),
      previousAnchors: deserializeCapeAnchors(serializeCapeAnchors(character.getCapeAnchors())),
      bodyColliders: deserializeCapsuleColliders(serializeCapsuleColliders(character.getCapeColliders())),
      velocity: new THREE.Vector3(),
      packet: { anchors: serializeCapeAnchors(character.getCapeAnchors()), endpoints: serializeCapsuleEndpoints(character.getCapeColliders()), velocity: serializeVector3(character.velocity) },
    };
  });
  return { cave, worldColliders, bots, inputUpdateMilliseconds: 0,
    prepareInputs(step: number, delta = 1 / 30) {
      const time = step * delta;
      for (const bot of bots) {
        bot.input.update(time); bot.controller.update(delta, 0);
        if (workerInputs) bot.packet = { anchors: serializeCapeAnchors(bot.character.getCapeAnchors()), endpoints: serializeCapsuleEndpoints(bot.character.getCapeColliders()), velocity: serializeVector3(bot.character.velocity) };
      }
    },
    solve(step: number, delta = 1 / 30) {
      this.inputUpdateMilliseconds = 0;
      for (const bot of bots) this.solveCape(bot, step, delta);
    },
    solveCape(bot: typeof bots[number], step: number, delta = 1 / 30) {
        if (workerInputs) {
          const inputStart = performance.now();
          // Fixed worker deliveries skip nominal 120Hz callbacks, matching the current freshest-pose rebase branch.
          if (step > 1) {
            bot.simulation.rebaseAnchors(bot.anchors, deserializeCapeAnchors(bot.packet.anchors));
            copySerializedCapeAnchors(bot.packet.anchors, bot.previousAnchors);
          } else copySerializedCapeAnchors(serializeCapeAnchors(bot.anchors), bot.previousAnchors);
          copySerializedCapeAnchors(bot.packet.anchors, bot.anchors);
          applySerializedCapsuleEndpoints(bot.packet.endpoints, bot.bodyColliders);
          bot.velocity.fromArray(bot.packet.velocity);
          this.inputUpdateMilliseconds += performance.now() - inputStart;
          bot.simulation.step(delta, bot.anchors, bot.bodyColliders, worldColliders, bot.velocity, step * delta, delta);
        } else bot.simulation.step(delta, bot.character.getCapeAnchors(), bot.character.getCapeColliders(), worldColliders, bot.character.velocity, step * delta);
    },
    advance(step: number, delta = 1 / 30) { this.prepareInputs(step, delta); this.solve(step, delta);
  }, dispose() {
    bots.forEach(bot => { bot.simulation.dispose(); bot.character.dispose(); });
    for (const group of [cave.group, torches.group, veins.group]) group.traverse(object => {
      const mesh = object as THREE.Mesh; mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) mesh.material.forEach(material => material.dispose());
      else mesh.material?.dispose();
    }); texture.dispose();
  } };
}
