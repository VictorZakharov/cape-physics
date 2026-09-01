import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  float,
  select,
  uint,
  vec3,
  vec4,
} from 'three/tsl';
import { CAPE } from '../config';
import {
  GPU_BODY_BUFFER_STRIDE as BODY_BUFFER_STRIDE,
  MAX_GPU_BODY_COLLIDERS as MAX_BODY_COLLIDERS,
} from './GpuCapeColliderPacking';
import {
  MAXIMUM_VIRTUAL_BODY_CONSTRAINT_CORRECTION_PER_PASS,
  MAXIMUM_VIRTUAL_BODY_PARTICLE_CORRECTION_PER_PASS,
} from './GpuVirtualBodyContact';

export interface GpuCapeVirtualBodyContactResources {
  readonly bodyBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly bodyStateUniform: THREE.UniformArrayNode<'vec4'>;
  readonly positionBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly particleCount: number;
}

/**
 * Finds the exact closest point on each cloth triangle to sampled capsule
 * centers. Unlike the removed inverse face sweep, it retains only the single
 * deepest local correction per triangle, then applies the mass-weighted PBD
 * barycentric gradient. Graph coloring keeps shared-vertex writes race-free
 * without turning the cape into a rigid collision manifold.
 */
export function createGpuCapeVirtualBodyContactColorFunction(
  resources: GpuCapeVirtualBodyContactResources,
  buffer: THREE.StorageBufferNode<'vec4'>,
  passName: string,
) {
  return Fn<
    readonly [THREE.Node<'uint'>, THREE.Node<'uint'>, THREE.Node<'uint'>],
    THREE.Node<'float'>
  >(([color, triangleSlot, capeIndex]) => {
    const capeBase = capeIndex.mul(uint(resources.particleCount));
    const bodyState = resources.bodyStateUniform.element(capeIndex);
    const back = bodyState.xyz;
    const orientation = color.mod(uint(2));
    const columnParity = color.div(uint(2)).mod(uint(2));
    const rowParity = color.div(uint(4));
    const coloredColumns = uint(Math.ceil((CAPE.columns - 1) / 2));
    const coloredRows = select(
      rowParity.equal(uint(0)),
      uint(Math.ceil((CAPE.rows - 1) / 2)),
      uint(Math.floor((CAPE.rows - 1) / 2)),
    );
    If(triangleSlot.lessThan(coloredRows.mul(coloredColumns)), () => {
      const localRow = triangleSlot.div(coloredColumns);
      const localColumn = triangleSlot.mod(coloredColumns);
      const cellRow = rowParity.add(localRow.mul(2));
      const cellColumn = columnParity.add(localColumn.mul(2));
      const topLeft = cellRow.mul(uint(CAPE.columns)).add(cellColumn);
      const bottomLeft = topLeft.add(uint(CAPE.columns));
      const firstLocalIndex = select(orientation.equal(uint(0)), topLeft, bottomLeft);
      const secondLocalIndex = select(
        orientation.equal(uint(0)),
        bottomLeft,
        bottomLeft.add(1),
      );
      const thirdLocalIndex = topLeft.add(1);
      const firstIndex = capeBase.add(firstLocalIndex);
      const secondIndex = capeBase.add(secondLocalIndex);
      const thirdIndex = capeBase.add(thirdLocalIndex);
      const firstState = buffer.element(firstIndex);
      const secondState = buffer.element(secondIndex);
      const thirdState = buffer.element(thirdIndex);
      const first = firstState.xyz;
      const second = secondState.xyz;
      const third = thirdState.xyz;
      const firstMass = select(firstLocalIndex.lessThan(uint(CAPE.columns)), 0, 1);
      const secondMass = select(secondLocalIndex.lessThan(uint(CAPE.columns)), 0, 1);
      const thirdMass = select(thirdLocalIndex.lessThan(uint(CAPE.columns)), 0, 1);
      const virtualCorrection = vec3(0).toVar('virtualBodyCorrection');
      const virtualCorrectionLengthSquared = float(0)
        .toVar('virtualBodyCorrectionLengthSquared');
      const correctionBarycentric = vec3(1, 0, 0)
        .toVar('virtualBodyCorrectionBarycentric');
      const triangleMinimum = first.min(second).min(third);
      const triangleMaximum = first.max(second).max(third);

      Loop(
        { start: uint(0), end: uint(bodyState.w), type: 'uint', condition: '<' },
        ({ i }) => {
          const bodyBase = capeIndex
            .mul(uint(MAX_BODY_COLLIDERS * BODY_BUFFER_STRIDE))
            .add(i.mul(uint(BODY_BUFFER_STRIDE)));
          const startRadius = resources.bodyBuffer.element(bodyBase);
          const axisDepth = resources.bodyBuffer.element(bodyBase.add(1));
          const faceInfo = resources.bodyBuffer.element(bodyBase.add(3));
          const faceDepth = resources.bodyBuffer.element(bodyBase.add(4)).x;
          const segments = uint(faceInfo.z);
          const lateralRadius = faceInfo.w;
          const depthRadius = faceDepth;
          const boundsRadius = lateralRadius.max(depthRadius);
          const bodyEnd = startRadius.xyz.add(axisDepth.xyz);
          const bodyMinimum = startRadius.xyz.min(bodyEnd).sub(boundsRadius);
          const bodyMaximum = startRadius.xyz.max(bodyEnd).add(boundsRadius);
          const overlapsBody = bodyMaximum.x.greaterThanEqual(triangleMinimum.x)
            .and(bodyMinimum.x.lessThanEqual(triangleMaximum.x))
            .and(bodyMaximum.y.greaterThanEqual(triangleMinimum.y))
            .and(bodyMinimum.y.lessThanEqual(triangleMaximum.y))
            .and(bodyMaximum.z.greaterThanEqual(triangleMinimum.z))
            .and(bodyMinimum.z.lessThanEqual(triangleMaximum.z));
          If(overlapsBody, () => {
            Loop(
              { start: uint(0), end: segments.add(1), type: 'uint', condition: '<' },
              ({ i: sampleIndex }) => {
                const progress = select(
                  segments.greaterThan(uint(0)),
                  float(sampleIndex).div(float(segments)),
                  0,
                );
                const center = startRadius.xyz.add(axisDepth.xyz.mul(progress));
                const overlapsBounds = center.x.add(boundsRadius)
                  .greaterThanEqual(triangleMinimum.x)
                  .and(center.x.sub(boundsRadius).lessThanEqual(triangleMaximum.x))
                  .and(center.y.add(boundsRadius).greaterThanEqual(triangleMinimum.y))
                  .and(center.y.sub(boundsRadius).lessThanEqual(triangleMaximum.y))
                  .and(center.z.add(boundsRadius).greaterThanEqual(triangleMinimum.z))
                  .and(center.z.sub(boundsRadius).lessThanEqual(triangleMaximum.z));
                If(overlapsBounds, () => {
                  const ab = second.sub(first);
                  const ac = third.sub(first);
                  const ap = center.sub(first);
                  const d1 = ab.dot(ap);
                  const d2 = ac.dot(ap);
                  const bp = center.sub(second);
                  const d3 = ab.dot(bp);
                  const d4 = ac.dot(bp);
                  const cp = center.sub(third);
                  const d5 = ab.dot(cp);
                  const d6 = ac.dot(cp);
                  const vc = d1.mul(d4).sub(d3.mul(d2));
                  const vb = d5.mul(d2).sub(d1.mul(d6));
                  const va = d3.mul(d6).sub(d5.mul(d4));
                  const closest = first.toVar('virtualBodyClosest');
                  const barycentric = vec3(1, 0, 0).toVar('virtualBodyBarycentric');
                  If(d1.lessThanEqual(0).and(d2.lessThanEqual(0)), () => {
                    closest.assign(first);
                  }).ElseIf(d3.greaterThanEqual(0).and(d4.lessThanEqual(d3)), () => {
                    closest.assign(second);
                    barycentric.assign(vec3(0, 1, 0));
                  }).ElseIf(
                    vc.lessThanEqual(0).and(d1.greaterThanEqual(0)).and(d3.lessThanEqual(0)),
                    () => {
                      const edge = d1.div(d1.sub(d3).max(0.000_001));
                      closest.assign(first.add(ab.mul(edge)));
                      barycentric.assign(vec3(float(1).sub(edge), edge, 0));
                    },
                  ).ElseIf(d6.greaterThanEqual(0).and(d5.lessThanEqual(d6)), () => {
                    closest.assign(third);
                    barycentric.assign(vec3(0, 0, 1));
                  }).ElseIf(
                    vb.lessThanEqual(0).and(d2.greaterThanEqual(0)).and(d6.lessThanEqual(0)),
                    () => {
                      const edge = d2.div(d2.sub(d6).max(0.000_001));
                      closest.assign(first.add(ac.mul(edge)));
                      barycentric.assign(vec3(float(1).sub(edge), 0, edge));
                    },
                  ).ElseIf(
                    va.lessThanEqual(0)
                      .and(d4.sub(d3).greaterThanEqual(0))
                      .and(d5.sub(d6).greaterThanEqual(0)),
                    () => {
                      const firstEdge = d4.sub(d3);
                      const secondEdge = d5.sub(d6);
                      const edge = firstEdge.div(firstEdge.add(secondEdge).max(0.000_001));
                      closest.assign(second.add(third.sub(second).mul(edge)));
                      barycentric.assign(vec3(0, float(1).sub(edge), edge));
                    },
                  ).Else(() => {
                    const reciprocal = va.add(vb).add(vc).max(0.000_001).reciprocal();
                    const secondWeight = vb.mul(reciprocal);
                    const thirdWeight = vc.mul(reciprocal);
                    barycentric.assign(vec3(
                      float(1).sub(secondWeight).sub(thirdWeight),
                      secondWeight,
                      thirdWeight,
                    ));
                    closest.assign(first.add(ab.mul(secondWeight)).add(ac.mul(thirdWeight)));
                  });
                  const delta = closest.sub(center);
                  const depth = delta.dot(back);
                  const lateralSquared = delta.dot(delta).sub(depth.mul(depth)).max(0);
                  const normalizedDistanceSquared = lateralSquared
                    .div(lateralRadius.mul(lateralRadius))
                    .add(depth.mul(depth).div(depthRadius.mul(depthRadius)));
                  If(normalizedDistanceSquared.lessThan(1), () => {
                    const candidate = vec3(0).toVar('virtualBodyCandidate');
                    const surfaceDepth = depthRadius.mul(
                      float(1).sub(
                        lateralSquared.div(lateralRadius.mul(lateralRadius)).clamp(0, 1),
                      ).sqrt(),
                    );
                    candidate.assign(back.mul(surfaceDepth.sub(depth).max(0)));
                    const candidateLengthSquared = candidate.dot(candidate);
                    If(candidateLengthSquared.greaterThan(virtualCorrectionLengthSquared), () => {
                      virtualCorrection.assign(candidate);
                      virtualCorrectionLengthSquared.assign(candidateLengthSquared);
                      correctionBarycentric.assign(barycentric);
                    });
                  });
                });
              },
            );
          });
        },
      );

      const correctionLength = virtualCorrection.length()
        .toVar('virtualBodyCorrectionLength');
      If(
        correctionLength.greaterThan(MAXIMUM_VIRTUAL_BODY_CONSTRAINT_CORRECTION_PER_PASS),
        () => {
        virtualCorrection.mulAssign(
          float(MAXIMUM_VIRTUAL_BODY_CONSTRAINT_CORRECTION_PER_PASS)
            .div(correctionLength.max(0.000_001)),
        );
        },
      );
      const denominator = firstMass
        .mul(correctionBarycentric.x.mul(correctionBarycentric.x))
        .add(secondMass.mul(correctionBarycentric.y.mul(correctionBarycentric.y)))
        .add(thirdMass.mul(correctionBarycentric.z.mul(correctionBarycentric.z)))
        .toVar('virtualBodyMassDenominator');
      If(
        virtualCorrectionLengthSquared.greaterThan(0.000_000_1)
          .and(denominator.greaterThan(0.000_001)),
        () => {
          const normal = virtualCorrection.normalize().toVar('virtualBodyMotionNormal');
          const lambdaCorrection = virtualCorrection.div(denominator);
          const applyCorrection = (
            particleIndex: THREE.Node<'uint'>,
            state: THREE.Node<'vec4'>,
            inverseMass: THREE.Node<'float'>,
            barycentricWeight: THREE.Node<'float'>,
            declarationSuffix: string,
          ): void => {
            If(inverseMass.greaterThan(0), () => {
              // Standard PBD contact gradient. A hit near a vertex deforms
              // that part of the cloth; a centered hit shares the response.
              const particleCorrection = lambdaCorrection
                .mul(inverseMass.mul(barycentricWeight))
                .toVar(`virtualBodyParticleCorrection${declarationSuffix}`);
              const particleCorrectionLength = particleCorrection.length();
              // Face projection is a separate, velocity-neutral constraint.
              // Point-capsule work stored in state.w must not starve it; that
              // was the path that let an animated limb cross a triangle.
              const remainingParticleCorrection = float(
                MAXIMUM_VIRTUAL_BODY_PARTICLE_CORRECTION_PER_PASS,
              ).toVar(
                `remainingVirtualBodyParticleCorrection${declarationSuffix}`,
              );
              If(
                particleCorrectionLength.greaterThan(remainingParticleCorrection),
                () => {
                  particleCorrection.mulAssign(
                    remainingParticleCorrection
                      .div(particleCorrectionLength.max(0.000_001)),
                  );
                },
              );
              const corrected = state.xyz.add(particleCorrection);
              buffer.element(particleIndex).assign(vec4(
                corrected,
                state.w,
              ));
              const previousState = resources.previousBuffer.element(particleIndex);
              const correctedPrevious = previousState.xyz.add(particleCorrection)
                .toVar(`correctedPreviousVirtualBody${declarationSuffix}`);
              const inwardMotion = corrected.sub(correctedPrevious)
                .dot(normal)
                .min(0);
              correctedPrevious.addAssign(normal.mul(inwardMotion));
              resources.previousBuffer.element(particleIndex).assign(vec4(
                correctedPrevious,
                previousState.w,
              ));
            });
          };
          applyCorrection(
            firstIndex,
            firstState,
            firstMass,
            correctionBarycentric.x,
            'First',
          );
          applyCorrection(
            secondIndex,
            secondState,
            secondMass,
            correctionBarycentric.y,
            'Second',
          );
          applyCorrection(
            thirdIndex,
            thirdState,
            thirdMass,
            correctionBarycentric.z,
            'Third',
          );
        },
      );
    });
    return float(0);
  }, 'float').setLayout({
    name: `capeVirtualBodyContactColorPass${passName}`,
    type: 'float',
    inputs: [
      { name: 'color', type: 'uint' },
      { name: 'triangleSlot', type: 'uint' },
      { name: 'capeIndex', type: 'uint' },
    ],
  });
}
