import { afterEach, beforeEach, describe, expect, test, spyOn } from 'bun:test';
import * as THREE from 'three';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import type {
  CapeWorkerBatchResult,
  CapeWorkerRequest,
  CapeWorkerResponse,
} from '../src/physics/CapeWorkerProtocol';
import { workerLimit, WebGlCapeWorkerPool } from '../src/physics/WebGlCapeWorkerPool';
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
let now = 1000;
let clock: ReturnType<typeof spyOn>;

describe('WebGlCapeWorkerPool', () => {
  beforeEach(() => {
    now = 1000; clock = spyOn(performance, 'now').mockImplementation(() => now);
    FakeWorker.instances.length = 0;
    Object.defineProperty(globalThis, 'Worker', {
      configurable: true,
      writable: true,
      value: FakeWorker,
    });
  });

  afterEach(() => {
    clock.mockRestore();
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
    expect(pool.getDiagnostics().averageStepMilliseconds).toBeNull();

    pool.enqueueStep(1 / 120, 2 / 120, inputs);
    pool.enqueueStep(1 / 120, 3 / 120, inputs);
    pool.flush();
    expect(pool.getDiagnostics().queuedSteps).toBe(2);
    FakeWorker.instances.forEach((worker) => {
      expect(worker.posted.filter((message) => message.type === 'step-batch')).toHaveLength(1);
    });

    now = 5000;
    FakeWorker.instances.forEach((worker, workerIndex) => {
      const add = worker.posted.find((message) => message.type === 'add-cape');
      const firstBatch = worker.posted.find((message) => message.type === 'step-batch');
      if (!add || add.type !== 'add-cape' || !firstBatch || firstBatch.type !== 'step-batch') {
        throw new Error('Fake worker did not receive initialization messages.');
      }
      const response: CapeWorkerBatchResult = {
        type: 'batch-result',
        simulationStepMilliseconds: 4 + workerIndex * 4,
        requestId: firstBatch.requestId,
        states: [{
          capeId: add.capeId,
          revision: add.revision,
          anchors: add.anchors,
          previousAnchors: add.anchors,
          time: firstBatch.frames.at(-1)!.time,
          deltaTime: firstBatch.frames.at(-1)!.deltaTime,
          positions: add.positions.slice(),
          previous: add.previous.slice(),
        }],
      };
      worker.emit(response);
      const batches = worker.posted.filter((message) => message.type === 'step-batch');
      expect(batches).toHaveLength(2);
      expect(batches[1]?.frames).toHaveLength(1);
      expect(batches[1]?.frames[0]?.time).toBe(3 / 120);
    });
    expect(pool.getDiagnostics().averageStepMilliseconds).toBe(6);
    expect(pool.consumeLatestState(1)).not.toBeNull();
    pool.unregisterCape(1);
    expect(pool.getDiagnostics().workers).toBe(1);
    expect(pool.getDiagnostics().averageStepMilliseconds).toBe(8);
    expect(pool.consumeLatestState(2)).not.toBeNull();

    pool.unregisterCape(2);
    expect(pool.getDiagnostics().workers).toBe(0);
    expect(pool.getDiagnostics().averageStepMilliseconds).toBeNull();

    pool.dispose();
    expect(FakeWorker.instances.every((worker) => worker.terminated)).toBe(true);
    firstCape.dispose();
    secondCape.dispose();
  });

  for (const threads of [4, 24]) test(`bounds a 50-bot backlog with ${threads} reported logical cores`, () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency');
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: threads });
    const pool = new WebGlCapeWorkerPool([]);
    const cape = new CapeSimulation(anchors, {}, undefined, { renderResources: false });
    try {
      const inputs = Array.from({ length: 50 }, (_, capeId) => ({
        capeId, anchors, bodyColliders, characterVelocity: new THREE.Vector3(),
      }));
      inputs.forEach(({ capeId }) => pool.registerCape(capeId, cape, anchors, bodyColliders));
      pool.enqueueStep(1 / 120, 1 / 120, inputs);
      pool.flush();
      for (let step = 2; step <= 1_200; step += 1) {
        pool.enqueueStep(1 / 120, step / 120, inputs);
        pool.flush();
      }
      expect(pool.getDiagnostics().workers).toBe(workerLimit(threads));
      expect(pool.getDiagnostics().queuedSteps).toBe(FakeWorker.instances.length);
      for (const worker of FakeWorker.instances) {
        const batch = worker.posted.find((message) => message.type === 'step-batch');
        if (!batch || batch.type !== 'step-batch') throw new Error('Missing first batch.');
        worker.emit({ type: 'batch-result', simulationStepMilliseconds: 4, requestId: batch.requestId, states: [] });
        const batches = worker.posted.filter((message) => message.type === 'step-batch');
        expect(batches).toHaveLength(2);
        expect(batches[1]!.frames.map((frame) => frame.time)).toEqual([
          10,
        ]);
        expect(batches[1]!.frames.every((frame) => frame.capes.length > 0)).toBe(true);
      }
      expect(pool.getDiagnostics().queuedSteps).toBe(0);
    } finally {
      pool.dispose();
      cape.dispose();
      if (descriptor) Object.defineProperty(navigator, 'hardwareConcurrency', descriptor);
      else Reflect.deleteProperty(navigator, 'hardwareConcurrency');
    }
  });
  test('reserves two logical cores with a bounded worker pool', () => {
    expect(workerLimit(4)).toBe(2);
    expect(workerLimit(2)).toBe(1);
    expect(workerLimit(1)).toBe(1);
    expect(workerLimit(24)).toBe(10);
  });

});
