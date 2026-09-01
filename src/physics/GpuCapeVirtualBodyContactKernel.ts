import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  atomicOr,
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
  MAXIMUM_VIRTUAL_BODY_CORRECTION_PER_STEP,
  VIRTUAL_BODY_BARYCENTRIC_WEIGHT,
} from './GpuVirtualBodyContact';

export interface GpuCapeVirtualBodyContactResources {
  readonly anchorStateUniform: THREE.UniformArrayNode<'vec4'>;
  readonly bodyBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly bodyStateUniform: THREE.UniformArrayNode<'vec4'>;
  readonly materialContactFlagBuffer: THREE.StorageBufferNode<'uint'>;
  readonly positionBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly particleCount: number;
}

/**
 * Adds one fixed barycentric cloth sample at each triangle centroid. Unlike
 * the removed inverse body-point sweep, this follows the same point-capsule
 * query as real cloth particles and activates only when every real vertex is
 * already clear. One deepest correction is redistributed to the triangle so
 * overlapping character capsules cannot turn it into a rigid manifold.
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
    const anchorState = resources.anchorStateUniform.element(capeIndex);
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
      const virtualPoint = first.add(second).add(third)
        .mul(VIRTUAL_BODY_BARYCENTRIC_WEIGHT)
        .toVar('virtualBodyPoint');
      const previousVirtualPoint = resources.previousBuffer.element(firstIndex).xyz
        .add(resources.previousBuffer.element(secondIndex).xyz)
        .add(resources.previousBuffer.element(thirdIndex).xyz)
        .mul(VIRTUAL_BODY_BARYCENTRIC_WEIGHT)
        .toVar('previousVirtualBodyPoint');
      const virtualColumn = float(firstLocalIndex.mod(uint(CAPE.columns)))
        .add(float(secondLocalIndex.mod(uint(CAPE.columns))))
        .add(float(thirdLocalIndex.mod(uint(CAPE.columns))))
        .mul(VIRTUAL_BODY_BARYCENTRIC_WEIGHT);
      const topologySide = virtualColumn.div(CAPE.columns - 1).sub(0.5);
      const bodyRight = vec3(
        back.z,
        0,
        back.x.negate(),
      ).normalize().toVar('virtualBodyRight');
      const virtualCorrection = vec3(0).toVar('virtualBodyCorrection');
      const virtualCorrectionLengthSquared = float(0)
        .toVar('virtualBodyCorrectionLengthSquared');

      Loop(
        { start: uint(0), end: uint(bodyState.w), type: 'uint', condition: '<' },
        ({ i }) => {
          const bodyBase = capeIndex
            .mul(uint(MAX_BODY_COLLIDERS * BODY_BUFFER_STRIDE))
            .add(i.mul(uint(BODY_BUFFER_STRIDE)));
          const startRadius = resources.bodyBuffer.element(bodyBase);
          const axisDepth = resources.bodyBuffer.element(bodyBase.add(1));
          const lateralAxis = resources.bodyBuffer.element(bodyBase.add(2));
          const verticalBounds = resources.bodyBuffer.element(bodyBase.add(3));
          const radiusSquared = startRadius.w.mul(startRadius.w);

          const pointPenetrates = (sample: THREE.Node<'vec3'>): THREE.Node<'bool'> => {
            const fromStart = sample.sub(startRadius.xyz);
            const sampleDepth = fromStart.dot(back);
            const sampleLateral = fromStart.sub(back.mul(sampleDepth));
            const progress = select(
              lateralAxis.w.greaterThan(0.000_001),
              sampleLateral.dot(lateralAxis.xyz).div(lateralAxis.w).clamp(0, 1),
              0,
            );
            const closest = startRadius.xyz.add(axisDepth.xyz.mul(progress));
            const delta = sample.sub(closest);
            const depth = delta.dot(back);
            const lateralSquared = delta.dot(delta).sub(depth.mul(depth)).max(0);
            const surfaceDepth = axisDepth.w.mul(
              float(1).sub(lateralSquared.div(radiusSquared).clamp(0, 1)).sqrt(),
            );
            return sample.y.greaterThanEqual(verticalBounds.x)
              .and(sample.y.lessThanEqual(verticalBounds.y))
              .and(lateralSquared.lessThan(radiusSquared))
              .and(surfaceDepth.sub(depth).greaterThan(0))
              .and(depth.greaterThan(axisDepth.w.negate()));
          };

          const triangleHasVertexContact = pointPenetrates(first)
            .or(pointPenetrates(second))
            .or(pointPenetrates(third))
            .toVar('triangleHasVertexContact');
          If(triangleHasVertexContact.not().and(pointPenetrates(virtualPoint)), () => {
            const fromStart = virtualPoint.sub(startRadius.xyz)
              .toVar('virtualBodyFromStart');
            const pointDepth = fromStart.dot(back)
              .toVar('virtualBodyPointDepth');
            const pointLateral = fromStart.sub(back.mul(pointDepth))
              .toVar('virtualBodyPointLateral');
            const progress = select(
              lateralAxis.w.greaterThan(0.000_001),
              pointLateral.dot(lateralAxis.xyz).div(lateralAxis.w).clamp(0, 1),
              0,
            );
            const closest = startRadius.xyz.add(axisDepth.xyz.mul(progress));
            const delta = virtualPoint.sub(closest).toVar('virtualBodyDelta');
            const depth = delta.dot(back).toVar('virtualBodyDepth');
            const lateralSquared = delta.dot(delta).sub(depth.mul(depth)).max(0)
              .toVar('virtualBodyLateralSquared');
            const surfaceDepth = axisDepth.w.mul(
              float(1).sub(lateralSquared.div(radiusSquared).clamp(0, 1)).sqrt(),
            );
            const contactNormal = back.toVar('virtualBodyContactNormal');
            const penetration = surfaceDepth.sub(depth).max(0)
              .toVar('virtualBodyPenetration');
            If(depth.lessThan(0), () => {
              const depthRatio = depth.div(axisDepth.w).clamp(-1, 0);
              const lateralBoundary = startRadius.w.mul(
                float(1).sub(depthRatio.mul(depthRatio)).max(0).sqrt(),
              );
              const spatialSide = previousVirtualPoint
                .sub(anchorState.xyz)
                .dot(bodyRight);
              const preferredSide = select(
                topologySide.abs().greaterThan(0.000_001),
                topologySide,
                spatialSide,
              ).toVar('virtualBodyPreferredSide');
              If(preferredSide.abs().greaterThan(0.000_001), () => {
                contactNormal.assign(bodyRight.mul(
                  select(preferredSide.greaterThan(0), 1, -1),
                ));
              }).Else(() => {
                const preferredDelta = previousVirtualPoint.sub(closest);
                const preferredDepth = preferredDelta.dot(back);
                const preferredLateral = preferredDelta
                  .sub(back.mul(preferredDepth))
                  .mul(vec3(1, 0, 1));
                If(preferredLateral.length().greaterThan(0.000_001), () => {
                  contactNormal.assign(preferredLateral.normalize());
                }).ElseIf(lateralSquared.greaterThan(0.000_001), () => {
                  contactNormal.assign(
                    delta.sub(back.mul(depth)).normalize(),
                  );
                }).Else(() => {
                  contactNormal.assign(bodyRight);
                });
              });
              const lateralCorrection = lateralBoundary.sub(delta.dot(contactNormal));
              penetration.assign(select(
                lateralCorrection.greaterThan(0),
                lateralCorrection,
                penetration,
              ));
            });
            const candidate = contactNormal.mul(penetration)
              .toVar('virtualBodyCandidate');
            const candidateLengthSquared = candidate.dot(candidate);
            If(candidateLengthSquared.greaterThan(virtualCorrectionLengthSquared), () => {
              virtualCorrection.assign(candidate);
              virtualCorrectionLengthSquared.assign(candidateLengthSquared);
            });
          });
        },
      );

      const correctionLength = virtualCorrection.length()
        .toVar('virtualBodyCorrectionLength');
      If(correctionLength.greaterThan(MAXIMUM_VIRTUAL_BODY_CORRECTION_PER_STEP), () => {
        virtualCorrection.mulAssign(
          float(MAXIMUM_VIRTUAL_BODY_CORRECTION_PER_STEP)
            .div(correctionLength.max(0.000_001)),
        );
      });
      const denominator = firstMass.add(secondMass).add(thirdMass)
        .mul(VIRTUAL_BODY_BARYCENTRIC_WEIGHT ** 2)
        .toVar('virtualBodyMassDenominator');
      If(
        virtualCorrectionLengthSquared.greaterThan(0.000_000_1)
          .and(denominator.greaterThan(0.000_001)),
        () => {
          atomicOr(resources.materialContactFlagBuffer.element(capeIndex), uint(1));
          const normal = virtualCorrection.normalize().toVar('virtualBodyMotionNormal');
          const lambdaCorrection = virtualCorrection.div(denominator);
          const applyCorrection = (
            particleIndex: THREE.Node<'uint'>,
            state: THREE.Node<'vec4'>,
            inverseMass: THREE.Node<'float'>,
            declarationSuffix: string,
          ): void => {
            If(inverseMass.greaterThan(0), () => {
              const particleCorrection = lambdaCorrection
                .mul(inverseMass.mul(VIRTUAL_BODY_BARYCENTRIC_WEIGHT));
              const corrected = state.xyz.add(particleCorrection);
              buffer.element(particleIndex).assign(vec4(corrected, state.w));
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
          applyCorrection(firstIndex, firstState, firstMass, 'First');
          applyCorrection(secondIndex, secondState, secondMass, 'Second');
          applyCorrection(thirdIndex, thirdState, thirdMass, 'Third');
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
