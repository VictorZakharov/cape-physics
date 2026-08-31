import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import type {
  CapeWorkerBatchResult,
  CapeWorkerRequest,
  CapeWorkerResponse,
} from '../src/physics/CapeWorkerProtocol';
import { WebGlCapeWorkerPool } from '../src/physics/WebGlCapeWorkerPool';
import type { CapsuleCollider } from '../src/physics/colliders';
import type { CapeAnchors } from '../src/player/Character';

const anchors: CapeAnchors = {
  left: new THREE.Vector3(-0.48, 2.1, 0.27),
  right: new THREE.Vector3(0.48, 2.1, 0.27),
  back: new THREE.Vector3(0, 0, 1),
};
const bodyColliders: CapsuleCollider[] = [{
  start: new THREE.Vector3(0, 1, 0),
  end: new THREE.Vector3(0, 2, 0),
  radius: 0.2,
  name: 'torso',
}];

class FakeWorker {
  public static readonly instances: FakeWorker[] = [];
  public onmessage: ((event: MessageEvent<CapeWorkerResponse>) => void) | null = null;
  public onerror: ((event: ErrorEvent) => void) | null = null;
  public onmessageerror: ((event: MessageEvent) => void) | null = null;
  public readonly posted: CapeWorkerRequest[] = [];
  public terminated = false;

  public constructor(_url: URL, _options?: WorkerOptions) {
    FakeWorker.instances.push(this);
  }

  public postMessage(message: CapeWorkerRequest): void {
    this.posted.push(message);
  }

  public terminate(): void {
    this.terminated = true;
  }

  public emit(response: CapeWorkerResponse): void {
    this.onmessage?.({ data: response } as MessageEvent<CapeWorkerResponse>);
  }
}

const originalWorker = globalThis.Worker;

describe('WebGlCapeWorkerPool', () => {
  beforeEach(() => {
    FakeWorker.instances.length = 0;
    Object.defineProperty(globalThis, 'Worker', {
      configurable: true,
      writable: true,
      value: FakeWorker,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'Worker', {
      configurable: true,
      writable: true,
      value: originalWorker,
    });
  });

  test('runs bots on separate workers and coalesces steps behind one in-flight batch', () => {
    const pool = new WebGlCapeWorkerPool([]);
    const firstCape = new CapeSimulation(anchors, {}, undefined, { renderResources: false });
    const secondCape = new CapeSimulation(anchors, {}, undefined, { renderResources: false });
    pool.registerCape(1, firstCape, anchors, bodyColliders);
    pool.registerCape(2, secondCape, anchors, bodyColliders);

    expect(FakeWorker.instances).toHaveLength(2);
    FakeWorker.instances.forEach((worker) => {
      expect(worker.posted[0]?.type).toBe('initialize');
      expect(worker.posted[1]?.type).toBe('add-cape');
    });

    const inputs = [1, 2].map((capeId) => ({
      capeId,
      anchors,
      bodyColliders,
      characterVelocity: new THREE.Vector3(0, 0, -2),
    }));
    pool.enqueueStep(1 / 120, 1 / 120, inputs);
    pool.flush();
    expect(pool.getDiagnostics().busyWorkers).toBe(2);

    pool.enqueueStep(1 / 120, 2 / 120, inputs);
    pool.enqueueStep(1 / 120, 3 / 120, inputs);
    pool.flush();
    expect(pool.getDiagnostics().queuedSteps).toBe(4);
    FakeWorker.instances.forEach((worker) => {
      expect(worker.posted.filter((message) => message.type === 'step-batch')).toHaveLength(1);
    });

    FakeWorker.instances.forEach((worker) => {
      const add = worker.posted.find((message) => message.type === 'add-cape');
      const firstBatch = worker.posted.find((message) => message.type === 'step-batch');
      if (!add || add.type !== 'add-cape' || !firstBatch || firstBatch.type !== 'step-batch') {
        throw new Error('Fake worker did not receive initialization messages.');
      }
      const response: CapeWorkerBatchResult = {
        type: 'batch-result',
        requestId: firstBatch.requestId,
        states: [{
          capeId: add.capeId,
          revision: add.revision,
          positions: add.positions.slice(),
          previous: add.previous.slice(),
        }],
      };
      worker.emit(response);
      const batches = worker.posted.filter((message) => message.type === 'step-batch');
      expect(batches).toHaveLength(2);
      expect(batches[1]?.frames).toHaveLength(2);
    });
    expect(pool.consumeLatestState(1)).not.toBeNull();
    expect(pool.consumeLatestState(2)).not.toBeNull();

    pool.dispose();
    expect(FakeWorker.instances.every((worker) => worker.terminated)).toBe(true);
    firstCape.dispose();
    secondCape.dispose();
  });
});
