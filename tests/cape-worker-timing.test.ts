import { expect, test } from 'bun:test';
import * as THREE from 'three';
import { PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { serializeCapeAnchors, type CapeWorkerRequest, type CapeWorkerResponse } from '../src/physics/CapeWorkerProtocol';
import type { CapeAnchors } from '../src/player/Character';

test('worker snapshots describe the actual Verlet anchor frames, including skipped poses and reset', async () => {
  const originalSelf = Object.getOwnPropertyDescriptor(globalThis, 'self');
  const responses: CapeWorkerResponse[] = [];
  const scope = {
    onmessage: null as ((event: MessageEvent<CapeWorkerRequest>) => void) | null,
    postMessage: (response: CapeWorkerResponse) => { responses.push(response); },
    close: () => {},
  };
  const anchors: CapeAnchors = {
    left: new THREE.Vector3(-0.48, 2.1, 0.27),
    right: new THREE.Vector3(0.48, 2.1, 0.27),
    back: new THREE.Vector3(0, 0, 1),
  };
  const cape = new CapeSimulation(anchors, {}, undefined, { renderResources: false });
  const send = (data: CapeWorkerRequest): void => {
    scope.onmessage!({ data } as MessageEvent<CapeWorkerRequest>);
  };
  try {
    Object.defineProperty(globalThis, 'self', { configurable: true, value: scope });
    await import('../src/physics/CapePhysicsWorker');
    send({ type: 'initialize', worldColliders: [] });
    send({ type: 'add-cape', capeId: 1, revision: 0, anchors: serializeCapeAnchors(anchors),
      bodyColliders: [], settings: cape.getSettings(), ...cape.copyPackedState() });
    let preceding = serializeCapeAnchors(anchors);
    for (const step of [1, 2, 12]) {
      const current = serializeCapeAnchors({ ...anchors,
        left: anchors.left.clone().add(new THREE.Vector3(step * 0.01, 0, 0)),
        right: anchors.right.clone().add(new THREE.Vector3(step * 0.01, 0, 0)),
      });
      send({ type: 'step-batch', requestId: step, frames: [{ deltaTime: PHYSICS_STEP, time: step * PHYSICS_STEP,
        capes: [{ capeId: 1, anchors: current, bodyColliderEndpoints: new Float32Array(), characterVelocity: [1, 0, 0] }],
      }] });
      const result = responses.at(-1)!;
      if (result.type !== 'batch-result') throw new Error(JSON.stringify(result));
      expect(result.states[0]!.time).toBe(step * PHYSICS_STEP);
      expect(result.states[0]!.deltaTime).toBe(step === 12 ? 1 / 30 : PHYSICS_STEP);
      expect(result.states[0]!.anchors).toEqual(current);
      expect(result.states[0]!.previousAnchors).toEqual(step === 12 ? current : preceding);
      preceding = current;
    }
    send({ type: 'update-cape', capeId: 1, revision: 1, anchors: serializeCapeAnchors(anchors),
      settings: cape.getSettings(), ...cape.copyPackedState() });
    send({ type: 'step-batch', requestId: 13, frames: [{ deltaTime: PHYSICS_STEP, time: 13 * PHYSICS_STEP,
      capes: [{ capeId: 1, anchors: serializeCapeAnchors(anchors), bodyColliderEndpoints: new Float32Array(), characterVelocity: [0, 0, 0] }],
    }] });
    const result = responses.at(-1)!;
    if (result.type !== 'batch-result') throw new Error(JSON.stringify(result));
    expect(result.states[0]!.revision).toBe(1);
    expect(result.states[0]!.previousAnchors).toEqual(serializeCapeAnchors(anchors));
  } finally {
    if (scope.onmessage) send({ type: 'dispose' });
    if (originalSelf) Object.defineProperty(globalThis, 'self', originalSelf);
    else Reflect.deleteProperty(globalThis, 'self');
    cape.dispose();
  }
});
