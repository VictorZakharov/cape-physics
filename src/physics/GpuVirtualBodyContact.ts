export const MAXIMUM_VIRTUAL_BODY_CONSTRAINT_CORRECTION_PER_PASS = 0.032;
export const MAXIMUM_VIRTUAL_BODY_PARTICLE_CORRECTION_PER_PASS = 0.064;
export const MAXIMUM_GPU_BODY_PARTICLE_CORRECTION_PER_PASS = 0.018;
export const MAXIMUM_GPU_BODY_PARTICLE_CORRECTION_PER_STEP = 0.12;

export function getVirtualBodyContactParticleScales(
  inverseMasses: readonly [number, number, number],
  barycentricWeights: readonly [number, number, number],
): readonly [number, number, number] {
  const denominator = inverseMasses.reduce(
    (sum, inverseMass, index) => {
      const barycentric = barycentricWeights[index] ?? 0;
      return sum + inverseMass * barycentric * barycentric;
    },
    0,
  );
  if (denominator <= 0) return [0, 0, 0];
  return inverseMasses.map(
    (inverseMass, index) => inverseMass * (barycentricWeights[index] ?? 0) / denominator,
  ) as [number, number, number];
}
