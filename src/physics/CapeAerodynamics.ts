// A deterministic normal flutter keeps motion visible even when a parallel
// constraint sweep preserves perfect grid symmetry. It is shared by both
// solvers so WebGL and WebGPU receive the same physical excitation.
export const CAPE_FLUTTER_ACCELERATION = 10;

// Fixed-step Verlet displacement is an implicit velocity. Constraint
// projection can otherwise feed an arbitrarily large correction into the next
// step, especially after rapid character reversals. Bound that carried motion
// to a physically plausible cloth-tip speed while leaving gravity, airflow,
// and current-step constraint response untouched.
export const MAXIMUM_CAPE_PARTICLE_SPEED = 12;
