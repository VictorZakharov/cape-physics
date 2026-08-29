// A deterministic normal flutter keeps motion visible even when a parallel
// constraint sweep preserves perfect grid symmetry. It is shared by both
// solvers so WebGL and WebGPU receive the same physical excitation.
export const CAPE_FLUTTER_ACCELERATION = 10;

// Cloth loses more relative motion as air speed rises. The old model reduced
// damping while walking, allowing repeated reversals and body contact to pump
// energy into the cape. Keep one backend-independent physical drag curve.
export const CAPE_BASE_DRAG_PER_SECOND = 2.8;
export const CAPE_SPEED_DRAG_PER_METER = 0.5;

export function getCapeDragPerSecond(planarSpeed: number): number {
  return CAPE_BASE_DRAG_PER_SECOND
    + Math.max(0, planarSpeed) * CAPE_SPEED_DRAG_PER_METER;
}

// Fixed-step Verlet displacement is an implicit velocity. Constraint
// projection can otherwise feed an arbitrarily large correction into the next
// step, especially after rapid character reversals. Bound that carried motion
// to a physically plausible cloth-tip speed while leaving gravity, airflow,
// and current-step constraint response untouched.
export const MAXIMUM_CAPE_PARTICLE_SPEED = 12;
