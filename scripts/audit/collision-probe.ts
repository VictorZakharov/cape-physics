import type * as THREE from 'three';
export const phases = ['body', 'self', 'fold', 'world', 'cave'] as const;
export type Phase = typeof phases[number];
export const collisionProbe = {
  enabled: false,
  worldScans: 0, worldNearby: 0,
  indices: new Map<THREE.Vector3, number>(),
  tests: Object.fromEntries(phases.map(key => [key, new Uint32Array(234)])) as Record<Phase, Uint32Array>,
  hits: Object.fromEntries(phases.map(key => [key, new Uint32Array(234)])) as Record<Phase, Uint32Array>,
  buckets: 0,
  count(phase: Phase, point: THREE.Vector3 | number, hit = false) {
    if (!this.enabled) return;
    const index = typeof point === 'number' ? point : this.indices.get(point);
    if (index === undefined) return;
    this.tests[phase][index]++;
    if (hit) this.hits[phase][index]++;
  },
  mark(phase: Phase, point: THREE.Vector3 | number) {
    if (!this.enabled) return;
    const index = typeof point === 'number' ? point : this.indices.get(point);
    if (index !== undefined) this.hits[phase][index]++;
  },
  begin(positions: THREE.Vector3[]) {
    this.indices.clear(); positions.forEach((point, index) => this.indices.set(point, index));
    phases.forEach(key => { this.tests[key].fill(0); this.hits[key].fill(0); });
  },
};
