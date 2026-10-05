import * as THREE from 'three';
import type { CapeAnchors } from '../player/Character';
import { getCapeAnchorTransform } from './CapeAnchorTransform';
import type { CapeSimulation } from './CapeSimulation';
import type { AnchoredCapeState } from './WebGlCapeWorkerPool';

const LOCAL_ANCHORS: CapeAnchors = {
  left: new THREE.Vector3(-0.5, 0, 0),
  right: new THREE.Vector3(0.5, 0, 0),
  back: new THREE.Vector3(0, 0, 1),
};
const MAXIMUM_PREDICTION_SECONDS = 0.05;
const MAXIMUM_PREDICTION_DISTANCE = 0.03;
const MAXIMUM_CORRECTION_DISTANCE = 0.03;
const CORRECTION_RATE = 60;

function predictionAge(age: number): number {
  // Fade stale velocity instead of freezing abruptly at the prediction limit.
  return MAXIMUM_PREDICTION_SECONDS * (1 - Math.exp(-Math.max(0, age) / MAXIMUM_PREDICTION_SECONDS));
}

/** Render asynchronous cloth on the scene clock without changing solver state. */
export class CapeWorkerPresentation {
  private readonly positions: THREE.BufferAttribute;
  private readonly normals: THREE.BufferAttribute;
  private readonly target: Float32Array;
  private readonly velocity: Float32Array;
  private readonly correction: Float32Array;
  private readonly targetNormals: Float32Array;
  private readonly normalCorrection: Float32Array;
  private readonly pinned: Uint8Array;
  private readonly toLocal = new THREE.Matrix4();
  private readonly previousToLocal = new THREE.Matrix4();
  private readonly point = new THREE.Vector3();
  private readonly previousPoint = new THREE.Vector3();
  private time = 0;
  private renderTime = 0;
  private correctionTime = 0;

  public constructor(private readonly cape: CapeSimulation, anchors: CapeAnchors, time: number) {
    this.positions = cape.mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    this.normals = cape.mesh.geometry.getAttribute('normal') as THREE.BufferAttribute;
    this.target = new Float32Array(this.positions.array.length);
    this.velocity = new Float32Array(this.target.length);
    this.correction = new Float32Array(this.target.length);
    this.targetNormals = new Float32Array(this.target.length);
    this.normalCorrection = new Float32Array(this.target.length);
    this.pinned = new Uint8Array(this.positions.count);
    this.reset(anchors, time);
  }

  public reset(anchors: CapeAnchors, time: number): void {
    const state = this.cape.copyPackedState();
    this.renderTime = time;
    this.accept({ ...state, previous: state.positions, anchors, previousAnchors: anchors, time, deltaTime: 0 });
    this.update(time, anchors, true);
  }

  public accept(state: AnchoredCapeState): void {
    this.correction.set(this.positions.array);
    this.normalCorrection.set(this.normals.array);
    // Normals are computed only for completed solves, then blended cheaply per frame.
    this.cape.syncGeometry();
    getCapeAnchorTransform(state.anchors, LOCAL_ANCHORS, this.toLocal);
    getCapeAnchorTransform(state.previousAnchors, LOCAL_ANCHORS, this.previousToLocal);
    const age = predictionAge(this.renderTime - state.time);
    for (let index = 0; index < this.positions.count; index += 1) {
      const packed = index * 4;
      const offset = index * 3;
      this.point.fromArray(state.positions, packed).applyMatrix4(this.toLocal);
      this.previousPoint.fromArray(state.previous, packed).applyMatrix4(this.previousToLocal);
      this.pinned[index] = state.positions[packed + 3] === 0 ? 1 : 0;
      this.previousPoint.subVectors(this.point, this.previousPoint);
      this.previousPoint.multiplyScalar(state.deltaTime > 0 ? 1 / state.deltaTime : 0);
      // The two anchor bases remove owner translation, turn, and shoulder tilt
      // from Verlet velocity; the mesh applies the current owner pose separately.
      this.previousPoint.clampLength(0, MAXIMUM_PREDICTION_DISTANCE / MAXIMUM_PREDICTION_SECONDS);
      if (this.pinned[index]) this.previousPoint.set(0, 0, 0);
      this.point.toArray(this.target, offset);
      this.previousPoint.toArray(this.velocity, offset);
      this.previousPoint.multiplyScalar(age).add(this.point);
      this.point.fromArray(this.correction, offset).sub(this.previousPoint);
      this.point.clampLength(0, MAXIMUM_CORRECTION_DISTANCE);
      if (this.pinned[index]) this.point.set(0, 0, 0);
      this.point.toArray(this.correction, offset);
      this.point.fromBufferAttribute(this.normals, index).transformDirection(this.toLocal);
      for (let axis = 0; axis < 3; axis += 1) {
        const component = offset + axis;
        this.normalCorrection[component] = this.normalCorrection[component]! - this.point.getComponent(axis);
        this.targetNormals[component] = this.point.getComponent(axis);
      }
    }
    this.time = state.time;
    this.correctionTime = this.renderTime;
  }

  public update(time: number, anchors: CapeAnchors, snap = false): void {
    if (snap) {
      this.correction.fill(0);
      this.normalCorrection.fill(0);
    }
    this.renderTime = time;
    const age = snap ? 0 : predictionAge(time - this.time);
    const decay = snap ? 0 : Math.exp(-CORRECTION_RATE * Math.max(0, time - this.correctionTime));
    const positions = this.positions.array as Float32Array;
    const normals = this.normals.array as Float32Array;
    for (let component = 0; component < this.target.length; component += 1) {
      positions[component] = this.target[component]! + this.velocity[component]! * age
        + this.correction[component]! * decay;
      normals[component] = this.targetNormals[component]! + this.normalCorrection[component]! * decay;
    }
    this.positions.needsUpdate = true;
    this.normals.needsUpdate = true;
    getCapeAnchorTransform(LOCAL_ANCHORS, anchors, this.cape.mesh.matrix);
  }
}
