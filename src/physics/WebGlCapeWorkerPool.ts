import { CAPE } from '../config';
import { WorkerTelemetry } from './WorkerTelemetry';
import type { CapeAnchors } from '../player/Character';
import type { CapeSimulation, PackedCapeState } from './CapeSimulation';
import {
  deserializeCapeAnchors,
  serializeCapeAnchors,
  serializeCapsuleColliders,
  serializeCapsuleEndpoints,
  serializeVector3,
  serializeWorldColliders,
  type CapeWorkerRequest,
  type CapeWorkerResponse,
  type CapeWorkerStepFrame,
} from './CapeWorkerProtocol';
import type { CapsuleCollider, WorldCollider } from './colliders';
import type * as THREE from 'three';

export interface WebGlCapeStepInput {
  readonly capeId: number;
  readonly anchors: CapeAnchors;
  readonly bodyColliders: readonly CapsuleCollider[];
  readonly characterVelocity: THREE.Vector3;
}

export interface WebGlCapeWorkerDiagnostics {
  readonly active: boolean;
  readonly workers: number;
  readonly busyWorkers: number;
  readonly queuedSteps: number;
  readonly failure: string | null;
  readonly capeResultHz: number;
  readonly workerStepHz: number;
  readonly averageBatchMilliseconds: number;
  readonly averageStepMilliseconds: number | null;
  readonly logicalCores: number;
  readonly workerLimit: number;
  readonly selectionRule: string;
  readonly simulatedStepMilliseconds: number | null;
  readonly utilisationPercent: number | null;
  readonly cpuMillisecondsPerSecond: number | null;
  readonly deliveredParticleStepsPerSecond: number | null;
  readonly assignments: ReadonlyArray<{ worker: number; capes: number; particles: number; timing: ReturnType<WorkerTelemetry['getSnapshot']> }>;

}

interface CapeRegistration {
  readonly slot: WorkerSlot;
  revision: number;
  latestState: AnchoredCapeState | null;
}

export interface AnchoredCapeState extends PackedCapeState {
  readonly anchors: CapeAnchors;
  readonly previousAnchors: CapeAnchors;
  readonly time: number;
  readonly deltaTime: number;
}

// Keep both queued work and result latency bounded when a crowd overloads CPUs.
const MAXIMUM_BATCH_STEPS = 1;

interface WorkerSlot {
  readonly worker: Worker;
  readonly capeIds: Set<number>;
  readonly pendingFrames: CapeWorkerStepFrame[];
  busy: boolean;
  nextRequestId: number;
  dispatchedAt: number;
  readonly telemetry: WorkerTelemetry;
}

export function workerLimit(threads = navigator.hardwareConcurrency || 4): number {
  const hardwareThreads = Math.max(1, threads);
  return Math.max(1, Math.min(10, hardwareThreads - 2));
}

export class WebGlCapeWorkerPool {
  private readonly serializedWorldColliders;
  private readonly maximumWorkers = workerLimit();
  private readonly slots: WorkerSlot[] = [];
  private readonly registrations = new Map<number, CapeRegistration>();
  private readonly drainWaiters = new Set<() => void>();
  private measurementEpoch = 0;
  private failure: string | null = null;
  private disposed = false;

  public constructor(worldColliders: readonly WorldCollider[]) {
    this.serializedWorldColliders = serializeWorldColliders(worldColliders);
  }

  public registerCape(
    capeId: number,
    cape: CapeSimulation,
    anchors: CapeAnchors,
    bodyColliders: readonly CapsuleCollider[],
  ): boolean {
    if (this.disposed || this.failure || typeof Worker === 'undefined') return false;
    this.unregisterCape(capeId);
    const slot = this.slots.length < this.maximumWorkers
      ? this.createSlot()
      : this.leastLoadedSlot();
    const registration: CapeRegistration = {
      slot,
      revision: 0,
      latestState: null,
    };
    this.registrations.set(capeId, registration);
    slot.capeIds.add(capeId);
    slot.telemetry.reset();
    const state = cape.copyPackedState();
    this.post(slot.worker, {
      type: 'add-cape',
      capeId,
      revision: registration.revision,
      anchors: serializeCapeAnchors(anchors),
      bodyColliders: serializeCapsuleColliders(bodyColliders),
      settings: cape.getSettings(),
      positions: state.positions,
      previous: state.previous,
    }, [state.positions.buffer, state.previous.buffer]);
    return !this.failure;
  }

  public updateCape(
    capeId: number,
    cape: CapeSimulation,
    anchors: CapeAnchors,
  ): void {
    const registration = this.registrations.get(capeId);
    if (!registration || this.failure) return;
    registration.revision += 1;
    registration.latestState = null;
    const state = cape.copyPackedState();
    this.post(registration.slot.worker, {
      type: 'update-cape',
      capeId,
      revision: registration.revision,
      anchors: serializeCapeAnchors(anchors),
      settings: cape.getSettings(),
      positions: state.positions,
      previous: state.previous,
    }, [state.positions.buffer, state.previous.buffer]);
  }

  public unregisterCape(capeId: number): void {
    const registration = this.registrations.get(capeId);
    if (!registration) return;
    this.registrations.delete(capeId);
    registration.slot.capeIds.delete(capeId);
    registration.slot.telemetry.reset();
    this.post(registration.slot.worker, { type: 'remove-cape', capeId });
  }

  public enqueueStep(
    deltaTime: number,
    time: number,
    inputs: readonly WebGlCapeStepInput[],
  ): void {
    if (this.failure || this.disposed || this.registrations.size === 0) return;
    const byCapeId = new Map(inputs.map((input) => [input.capeId, input]));
    for (const slot of this.slots) {
      const capes = [...slot.capeIds].flatMap((capeId) => {
        const input = byCapeId.get(capeId);
        if (!input) return [];
        return [{
          capeId,
          anchors: serializeCapeAnchors(input.anchors),
          bodyColliderEndpoints: serializeCapsuleEndpoints(input.bodyColliders),
          characterVelocity: serializeVector3(input.characterVelocity),
        }];
      });
      if (capes.length > 0) {
        slot.pendingFrames.push({ deltaTime, time, capes });
        if (slot.pendingFrames.length > MAXIMUM_BATCH_STEPS) {
          slot.pendingFrames.shift();
        }
      }
    }
  }

  /** Submits at most one in-flight batch per worker; later steps stay coalesced locally. */
  public flush(): void {
    if (this.failure || this.disposed) return;
    this.slots.forEach((slot) => this.dispatch(slot));
  }

  public consumeLatestState(capeId: number): AnchoredCapeState | null {
    const registration = this.registrations.get(capeId);
    if (!registration) return null;
    const state = registration.latestState;
    registration.latestState = null;
    return state;
  }

  public isDrivingCape(capeId: number): boolean {
    return !this.failure && this.registrations.has(capeId);
  }

  /** Harness barrier only. The animation loop never waits for worker completion. */
  public async synchronize(): Promise<void> {
    this.flush();
    if (this.failure || this.isDrained()) return;
    await new Promise<void>((resolve) => this.drainWaiters.add(resolve));
  }

  public resetPerformance(): void {
    this.measurementEpoch++;
    for (const slot of this.slots) {
      slot.telemetry.reset();
      this.post(slot.worker, { type: 'reset-performance', epoch: this.measurementEpoch });
    }
  }
  public getDiagnostics(): WebGlCapeWorkerDiagnostics {
    const activeSlots = this.slots.filter((slot) => slot.capeIds.size > 0);
    const assignments = activeSlots.map((slot, index) => ({ worker: index + 1, capes: slot.capeIds.size,
      particles: slot.capeIds.size * (CAPE.columns * CAPE.rows), timing: slot.telemetry.getSnapshot() }));
    const complete = assignments.length > 0 && assignments.every(item => item.timing.stepHz !== null);
    const mean = (get: (item: typeof assignments[number]) => number | null): number | null =>
      assignments.length && assignments.every(item => get(item) !== null)
        ? assignments.reduce((sum, item) => sum + get(item)!, 0) / assignments.length : null;
    return {
      active: !this.disposed && !this.failure && this.registrations.size > 0,
      workers: activeSlots.length,
      busyWorkers: activeSlots.filter((slot) => slot.busy).length,
      queuedSteps: activeSlots.reduce((sum, slot) => sum + slot.pendingFrames.length, 0),
      failure: this.failure,
      logicalCores: navigator.hardwareConcurrency || 4, workerLimit: this.maximumWorkers,
      selectionRule: 'min(10, max(1, logical cores - 2)); unknown cores: assume 4',
      assignments,
      workerStepHz: mean(item => item.timing.stepHz) ?? 0,
      capeResultHz: complete ? assignments.reduce((sum, item) => sum + item.timing.capeStepsPerSecond!, 0) / Math.max(1, this.registrations.size) : 0,
      averageStepMilliseconds: mean(item => item.timing.computeMilliseconds),
      simulatedStepMilliseconds: mean(item => item.timing.simulatedStepMilliseconds),
      utilisationPercent: mean(item => item.timing.utilisationPercent),
      cpuMillisecondsPerSecond: complete ? assignments.reduce((sum, item) => sum + item.timing.utilisationPercent! * 10, 0) : null,
      deliveredParticleStepsPerSecond: complete ? assignments.reduce((sum, item) => sum + item.timing.capeStepsPerSecond! * (CAPE.columns * CAPE.rows), 0) : null,
      averageBatchMilliseconds: mean(item => item.timing.batchLatencyMilliseconds) ?? 0,
    };
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const slot of this.slots) {
      this.post(slot.worker, { type: 'dispose' });
      slot.worker.terminate();
    }
    this.slots.length = 0;
    this.registrations.clear();
    this.resolveDrainWaiters();
  }

  private createSlot(): WorkerSlot {
    const worker = new Worker(new URL('./CapePhysicsWorker.ts', import.meta.url), {
      type: 'module',
      name: `cape-physics-${this.slots.length + 1}`,
    });
    const slot: WorkerSlot = {
      worker,
      capeIds: new Set(),
      pendingFrames: [],
      busy: false,
      nextRequestId: 1,
      dispatchedAt: 0,
      telemetry: new WorkerTelemetry(),
    };
    worker.onmessage = (event: MessageEvent<CapeWorkerResponse>) => {
      this.handleResponse(slot, event.data);
    };
    worker.onerror = (event) => {
      event.preventDefault();
      this.disable(`Cape worker failed: ${event.message || 'unknown worker error'}`);
    };
    worker.onmessageerror = () => {
      this.disable('Cape worker returned an unreadable message.');
    };
    this.slots.push(slot);
    this.post(worker, {
      type: 'initialize',
      worldColliders: this.serializedWorldColliders,
    });
    return slot;
  }

  private leastLoadedSlot(): WorkerSlot {
    const slot = [...this.slots].sort((left, right) => (
      left.capeIds.size - right.capeIds.size
    ))[0];
    if (!slot) throw new Error('Cape worker pool has no worker slots.');
    return slot;
  }

  private dispatch(slot: WorkerSlot): void {
    if (slot.busy || slot.pendingFrames.length === 0 || this.failure) return;
    const frames = slot.pendingFrames.splice(0);
    const transfer = frames.flatMap((frame) => frame.capes.map(
      (cape) => cape.bodyColliderEndpoints.buffer,
    ));
    slot.busy = true;
    slot.dispatchedAt = performance.now();
    this.post(slot.worker, {
      type: 'step-batch',
      requestId: slot.nextRequestId,
      measurementEpoch: this.measurementEpoch,
      frames,
    }, transfer);
    slot.nextRequestId += 1;
  }

  private handleResponse(slot: WorkerSlot, response: CapeWorkerResponse): void {
    if (response.type === 'failure') {
      this.disable(`Cape worker solver failed: ${response.message}`);
      return;
    }
    slot.busy = false;
    const solveTime = response.simulationStepMilliseconds;
    const now = performance.now();
    const batchMilliseconds = now - slot.dispatchedAt;
    if ((response.measurementEpoch ?? this.measurementEpoch) === this.measurementEpoch) {
      slot.telemetry.record({ time: now, compute: solveTime, latency: batchMilliseconds,
        simulatedStep: response.states.length ? response.states.reduce((sum, state) => sum + state.deltaTime * 1000, 0) / response.states.length : 0,
        capes: response.states.length, profile: response.profile });
    }
    for (const state of response.states) {
      const registration = this.registrations.get(state.capeId);
      if (!registration || registration.slot !== slot) continue;
      if (registration.revision !== state.revision) continue;
      registration.latestState = {
        anchors: deserializeCapeAnchors(state.anchors),
        previousAnchors: deserializeCapeAnchors(state.previousAnchors),
        time: state.time,
        deltaTime: state.deltaTime,
        positions: state.positions,
        previous: state.previous,
      };
    }
    this.dispatch(slot);
    if (this.isDrained()) this.resolveDrainWaiters();
  }

  private post(worker: Worker, message: CapeWorkerRequest, transfer: Transferable[] = []): void {
    if (this.failure || this.disposed) return;
    try {
      worker.postMessage(message, { transfer });
    } catch (error) {
      this.disable(`Could not submit cape worker work: ${
        error instanceof Error ? error.message : String(error)
      }`);
    }
  }

  private disable(message: string): void {
    if (this.failure) return;
    this.failure = message;
    console.error(message);
    this.slots.forEach((slot) => slot.worker.terminate());
    this.resolveDrainWaiters();
  }

  private isDrained(): boolean {
    return this.slots.every((slot) => !slot.busy && slot.pendingFrames.length === 0);
  }

  private resolveDrainWaiters(): void {
    this.drainWaiters.forEach((resolve) => resolve());
    this.drainWaiters.clear();
  }
}
