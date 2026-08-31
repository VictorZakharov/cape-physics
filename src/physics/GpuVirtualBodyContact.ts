export const VIRTUAL_BODY_BARYCENTRIC_WEIGHT = 1 / 3;
export const MAXIMUM_VIRTUAL_BODY_CORRECTION_PER_STEP = 0.018;

export function shouldApplyVirtualBodyContact(
  vertexPenetrations: readonly [number, number, number],
  virtualPenetration: number,
): boolean {
  return virtualPenetration > 0
    && vertexPenetrations.every((penetration) => penetration <= 0);
}

export function getVirtualBodyContactParticleScales(
  inverseMasses: readonly [number, number, number],
): readonly [number, number, number] {
  const barycentric = VIRTUAL_BODY_BARYCENTRIC_WEIGHT;
  const denominator = inverseMasses.reduce(
    (sum, inverseMass) => sum + inverseMass * barycentric * barycentric,
    0,
  );
  if (denominator <= 0) return [0, 0, 0];
  return inverseMasses.map(
    (inverseMass) => inverseMass * barycentric / denominator,
  ) as [number, number, number];
}
