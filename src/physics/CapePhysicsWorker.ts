import * as THREE from 'three';
import { CRIMSON_CAPE_PALETTE } from './CapeAppearance';
import { CapeSimulation } from './CapeSimulation';
import {
  applySerializedCapsuleEndpoints,
  copySerializedCapeAnchors,
  deserializeCapeAnchors,
  deserializeCapsuleColliders,
  deserializeWorldColliders,
  serializeCapeAnchors,
  type CapeWorkerBatchResult,
  type CapeWorkerFailure,
  type CapeWorkerRequest,
} from './CapeWorkerProtocol';
import type { WorldCollider } from './colliders';

interface WorkerCape {
  readonly simulation: CapeSimulation;
  readonly anchors: ReturnType<typeof deserializeCapeAnchors>;
  readonly previousAnchors: ReturnType<typeof deserializeCapeAnchors>;
  readonly bodyColliders: ReturnType<typeof deserializeCapsuleColliders>;
  readonly characterVelocity: THREE.Vector3;
  revision: number;
  time: number | null;
  deltaTime: number;
}

const capes = new Map<number, WorkerCape>();
let worldColliders: readonly WorldCollider[] = [];

function postFailure(error: unknown): void {
  const response: CapeWorkerFailure = {
    type: 'failure',
    message: error instanceof Error ? error.stack ?? error.message : String(error),
  };
  self.postMessage(response);
}

function handleMessage(message: CapeWorkerRequest): void {
  switch (message.type) {
    case 'initialize':
      worldColliders = deserializeWorldColliders(message.worldColliders);
      return;
    case 'add-cape': {
      capes.get(message.capeId)?.simulation.dispose();
      const anchors = deserializeCapeAnchors(message.anchors);
      const simulation = new CapeSimulation(
        anchors,
        message.settings,
        CRIMSON_CAPE_PALETTE,
        { renderResources: false },
      );
      simulation.overwriteStateForHarness(message.positions, message.previous);
      capes.set(message.capeId, {
        simulation,
        anchors,
        previousAnchors: deserializeCapeAnchors(message.anchors),
        bodyColliders: deserializeCapsuleColliders(message.bodyColliders),
        characterVelocity: new THREE.Vector3(),
        revision: message.revision,
        time: null,
        deltaTime: 0,
      });
      return;
    }
    case 'update-cape': {
      const cape = capes.get(message.capeId);
      if (!cape) return;
      copySerializedCapeAnchors(message.anchors, cape.anchors);
      copySerializedCapeAnchors(message.anchors, cape.previousAnchors);
      cape.simulation.updateSettings(message.settings, cape.anchors);
      cape.simulation.overwriteStateForHarness(message.positions, message.previous);
      cape.revision = message.revision;
      cape.time = null;
      cape.deltaTime = 0;
      return;
    }
    case 'remove-cape':
      capes.get(message.capeId)?.simulation.dispose();
      capes.delete(message.capeId);
      return;
    case 'step-batch': {
      const touchedCapeIds = new Set<number>();
      const simulationStart = performance.now();
      for (const frame of message.frames) {
        for (const input of frame.capes) {
          const cape = capes.get(input.capeId);
          if (!cape) continue;
          // Solve the freshest pose instead of spending a long batch on stale
          // poses. Account for elapsed time, bounded to a stable 30 Hz step.
          const deltaTime = cape.time === null ? frame.deltaTime
            : Math.min(1 / 30, Math.max(frame.deltaTime, frame.time - cape.time));
          if (cape.time !== null && frame.time - cape.time > frame.deltaTime * 1.5) {
            // Skipped overload frames must not drag old world-space particles
            // across the cave toward a character that has already moved on.
            cape.simulation.rebaseAnchors(cape.anchors, deserializeCapeAnchors(input.anchors));
            copySerializedCapeAnchors(input.anchors, cape.previousAnchors);
          } else {
            copySerializedCapeAnchors(serializeCapeAnchors(cape.anchors), cape.previousAnchors);
          }
          copySerializedCapeAnchors(input.anchors, cape.anchors);
          applySerializedCapsuleEndpoints(input.bodyColliderEndpoints, cape.bodyColliders);
          cape.characterVelocity.fromArray(input.characterVelocity);
          cape.simulation.step(
            deltaTime,
            cape.anchors,
            cape.bodyColliders,
            worldColliders,
            cape.characterVelocity,
            frame.time,
            cape.deltaTime || deltaTime,
          );
          touchedCapeIds.add(input.capeId);
          cape.time = frame.time;
          cape.deltaTime = deltaTime;
        }
      }
      const simulationStepMilliseconds = (performance.now() - simulationStart)
        / Math.max(1, message.frames.length);
      const states = [...touchedCapeIds].flatMap((capeId) => {
        const cape = capes.get(capeId);
        if (!cape) return [];
        const state = cape.simulation.copyPackedState();
        return [{
          capeId,
          revision: cape.revision,
          anchors: serializeCapeAnchors(cape.anchors),
          previousAnchors: serializeCapeAnchors(cape.previousAnchors),
          time: cape.time!,
          deltaTime: cape.deltaTime,
          positions: state.positions,
          previous: state.previous,
        }];
      });
      const response: CapeWorkerBatchResult = {
        type: 'batch-result',
        simulationStepMilliseconds,
        requestId: message.requestId,
        states,
      };
      const transfer = states.flatMap((state) => [
        state.positions.buffer,
        state.previous.buffer,
      ]);
      self.postMessage(response, { transfer });
      return;
    }
    case 'dispose':
      capes.forEach((cape) => cape.simulation.dispose());
      capes.clear();
      (self as unknown as { close: () => void }).close();
  }
}

self.onmessage = (event: MessageEvent<CapeWorkerRequest>) => {
  try {
    handleMessage(event.data);
  } catch (error) {
    postFailure(error);
  }
};
