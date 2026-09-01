import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  float,
  localId,
  select,
  storageBarrier,
  uint,
  vec3,
  vec4,
  workgroupId,
} from 'three/tsl';
import { CAPE } from '../config';
import {
  CAPE_ROW_CURL_RELAXATION,
  CAPE_ROW_SPAN_RELAXATION,
  MAXIMUM_CAPE_ROW_CURL_RATIO,
  MINIMUM_CAPE_ROW_SPAN_RATIO,
} from './CapeRestShape';
import { FOLD_RELAXATION, MAXIMUM_LOCAL_UPWARD_FOLD } from './ClothFoldGuard';
import { CLOTH_THICKNESS } from './ClothSelfCollision';
import { GPU_CAPE_TOPOLOGY_METADATA_STRIDE } from './GpuCapeTopology';

export interface GpuCapeConstraintResources {
  readonly activeCapeCountUniform: THREE.UniformNode<'uint', number>;
  readonly anchorUniform: THREE.UniformArrayNode<'vec4'>;
  readonly constraintBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly stiffnessUniform: THREE.UniformNode<'float', number>;
  readonly topologyBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly constraintCount: number;
  readonly packedParticleCount: number;
  readonly particleCount: number;
}

export function createGpuCapeConstraintKernel(
  resources: GpuCapeConstraintResources,
  buffer: THREE.StorageBufferNode<'vec4'>,
  name: string,
  includeSelfCollision = true,
  includeFoldGuard = true,
): THREE.ComputeNode {
  return Fn(() => {
    // Use workgroup-uniform built-ins around barriers. Deriving the cape
    // lane from global_invocation_id is mathematically uniform here, but the
    // WGSL validator cannot prove that division is workgroup-uniform.
    const capeIndex = workgroupId.x;
    const constraintIndex = localId.x;
    const capeBase = capeIndex.mul(uint(resources.particleCount));
    If(capeIndex.lessThan(resources.activeCapeCountUniform), () => {
    // This small fixed grid spends the overwhelming majority of its GPU
    // time in collision work, not 1,626 distance links. One invocation can
    // therefore reproduce WebGL's exact row-major Gauss-Seidel stream while
    // the expensive self/body/world phases below remain parallel.
    If(constraintIndex.equal(uint(0)), () => {
      Loop(
        {
          start: uint(0),
          end: uint(resources.constraintCount),
          type: 'uint',
          condition: '<',
        },
        ({ i }) => {
          const definition = resources.constraintBuffer.element(i);
          const firstIndex = uint(definition.x);
          const secondIndex = uint(definition.y);
          const firstGlobalIndex = capeBase.add(firstIndex);
          const secondGlobalIndex = capeBase.add(secondIndex);
          const firstState = buffer.element(firstGlobalIndex);
          const secondState = buffer.element(secondGlobalIndex);
          const first = firstState.xyz.toVar('orderedConstraintFirst');
          const second = secondState.xyz.toVar('orderedConstraintSecond');
          const delta = second.sub(first).toVar('orderedConstraintDelta');
          const length = delta.length().toVar('orderedConstraintLength');
          const firstWeight = select(firstIndex.lessThan(uint(CAPE.columns)), 0, 1);
          const secondWeight = select(secondIndex.lessThan(uint(CAPE.columns)), 0, 1);
          const totalWeight = firstWeight.add(secondWeight);
          If(length.greaterThan(0.000_001).and(totalWeight.greaterThan(0)), () => {
            const stiffness = definition.w.mul(resources.stiffnessUniform).min(0.999);
            const correction = delta.mul(
              length.sub(definition.z).div(length).mul(stiffness),
            ).toVar('orderedConstraintCorrection');
            const firstCorrection = correction.mul(firstWeight.div(totalWeight));
            const secondCorrection = correction.mul(secondWeight.div(totalWeight));
            first.addAssign(firstCorrection);
            second.subAssign(secondCorrection);
            buffer.element(firstGlobalIndex).assign(vec4(first, firstState.w));
            buffer.element(secondGlobalIndex).assign(vec4(second, secondState.w));
          });
        },
      );
    });
    storageBarrier();

    if (includeSelfCollision) {
      const rotatingParticleCount = uint(resources.particleCount - 1);
      Loop(
        {
          start: uint(0),
          end: rotatingParticleCount,
          type: 'uint',
          condition: '<',
        },
        ({ i: round }) => {
          If(constraintIndex.lessThan(uint(resources.particleCount / 2)), () => {
            const pairFirst = select(
              constraintIndex.equal(uint(0)),
              uint(resources.particleCount - 1),
              round.add(constraintIndex).mod(rotatingParticleCount),
            );
            const pairSecond = select(
              constraintIndex.equal(uint(0)),
              round,
              round.add(rotatingParticleCount).sub(constraintIndex)
                .mod(rotatingParticleCount),
            );
            const firstIndex = select(
              pairFirst.greaterThan(pairSecond),
              pairFirst,
              pairSecond,
            ).toVar('selfFirstIndex');
            const secondIndex = select(
              pairFirst.greaterThan(pairSecond),
              pairSecond,
              pairFirst,
            ).toVar('selfSecondIndex');
            const firstRow = firstIndex.div(uint(CAPE.columns));
            const secondRow = secondIndex.div(uint(CAPE.columns));
            const firstColumn = firstIndex.mod(uint(CAPE.columns));
            const secondColumn = secondIndex.mod(uint(CAPE.columns));
            const rowDifference = firstRow.sub(secondRow);
            const columnDifference = select(
              firstColumn.greaterThan(secondColumn),
              firstColumn.sub(secondColumn),
              secondColumn.sub(firstColumn),
            );
            const topologicalNeighbor = rowDifference.lessThanEqual(uint(2))
              .and(columnDifference.lessThanEqual(2));
            If(topologicalNeighbor.not(), () => {
              const firstGlobalIndex = capeBase.add(firstIndex);
              const secondGlobalIndex = capeBase.add(secondIndex);
              const firstState = buffer.element(firstGlobalIndex);
              const secondState = buffer.element(secondGlobalIndex);
              const first = firstState.xyz.toVar('selfFirst');
              const second = secondState.xyz.toVar('selfSecond');
              const separation = first.sub(second).toVar('selfSeparation');
              const distanceSquared = separation.dot(separation).toVar('selfDistanceSquared');
              If(distanceSquared.lessThan(CLOTH_THICKNESS ** 2), () => {
                const distance = distanceSquared.sqrt().toVar('selfDistance');
                const normal = vec3(1, 0, 0).toVar('selfNormal');
                If(distance.greaterThan(0.000_001), () => {
                  normal.assign(separation.div(distance));
                }).Else(() => {
                  const phase = float(firstIndex)
                    .mul(0.754_877_666)
                    .add(float(secondIndex).mul(0.569_840_291));
                  normal.assign(vec3(
                    phase.sin(),
                    phase.mul(1.37).cos(),
                    phase.mul(0.73).add(1.1).sin(),
                  ).normalize());
                });
                const firstWeight = select(firstIndex.lessThan(uint(CAPE.columns)), 0, 1);
                const secondWeight = select(secondIndex.lessThan(uint(CAPE.columns)), 0, 1);
                const totalWeight = firstWeight.add(secondWeight);
                If(totalWeight.greaterThan(0), () => {
                  const correction = normal
                    .mul(float(CLOTH_THICKNESS).sub(distance).div(totalWeight));
                  const firstCorrection = correction.mul(firstWeight);
                  const secondCorrection = correction.mul(secondWeight);
                  first.addAssign(firstCorrection);
                  second.subAssign(secondCorrection);
                  buffer.element(firstGlobalIndex).assign(vec4(first, firstState.w));
                  buffer.element(secondGlobalIndex).assign(vec4(second, secondState.w));
                  const firstPreviousState = resources.previousBuffer.element(firstGlobalIndex);
                  const secondPreviousState = resources.previousBuffer.element(secondGlobalIndex);
                    resources.previousBuffer.element(firstGlobalIndex).assign(vec4(
                    firstPreviousState.xyz.add(firstCorrection),
                    firstPreviousState.w,
                  ));
                    resources.previousBuffer.element(secondGlobalIndex).assign(vec4(
                    secondPreviousState.xyz.sub(secondCorrection),
                    secondPreviousState.w,
                  ));
                });
              });
            });
          });
          storageBarrier();
        },
      );
    }

    if (includeFoldGuard) {
    for (let foldColor = 0; foldColor < 2; foldColor += 1) {
      const foldRowCount = Math.ceil((CAPE.rows - 1 - foldColor) / 2);
      If(constraintIndex.lessThan(uint(foldRowCount * CAPE.columns)), () => {
        const pairRow = constraintIndex.div(uint(CAPE.columns));
        const column = constraintIndex.mod(uint(CAPE.columns));
        const upperRow = pairRow.mul(uint(2)).add(uint(foldColor));
        const upperIndex = upperRow.mul(uint(CAPE.columns)).add(column);
        const lowerIndex = upperIndex.add(uint(CAPE.columns));
        const upperGlobalIndex = capeBase.add(upperIndex);
        const lowerGlobalIndex = capeBase.add(lowerIndex);
        const upperState = buffer.element(upperGlobalIndex);
        const lowerState = buffer.element(lowerGlobalIndex);
        const upper = upperState.xyz.toVar();
        const lower = lowerState.xyz.toVar();
        const excess = lower.y.sub(upper.y).sub(MAXIMUM_LOCAL_UPWARD_FOLD);
        If(excess.greaterThan(0), () => {
          const upperWeight = select(upperIndex.lessThan(uint(CAPE.columns)), 0, 1);
          const lowerWeight = float(1);
          const totalWeight = upperWeight.add(lowerWeight);
          const correction = excess.mul(FOLD_RELAXATION);
          const upperCorrection = correction.mul(upperWeight.div(totalWeight));
          const lowerCorrection = correction.mul(lowerWeight.div(totalWeight));
          upper.y.addAssign(upperCorrection);
          lower.y.subAssign(lowerCorrection);
          buffer.element(upperGlobalIndex).assign(vec4(upper, upperState.w));
          buffer.element(lowerGlobalIndex).assign(vec4(lower, lowerState.w));
          const upperPreviousState = resources.previousBuffer.element(upperGlobalIndex);
          const lowerPreviousState = resources.previousBuffer.element(lowerGlobalIndex);
            resources.previousBuffer.element(upperGlobalIndex).assign(vec4(
            upperPreviousState.xyz.add(vec3(0, upperCorrection, 0)),
            upperPreviousState.w,
          ));
            resources.previousBuffer.element(lowerGlobalIndex).assign(vec4(
            lowerPreviousState.xyz.sub(vec3(0, lowerCorrection, 0)),
            lowerPreviousState.w,
          ));
        });
      });
      storageBarrier();
    }
    }

    If(constraintIndex.lessThan(uint(CAPE.rows - 1)), () => {
      const row = constraintIndex.add(1);
      const leftIndex = row.mul(uint(CAPE.columns));
      const rightIndex = leftIndex.add(uint(CAPE.columns - 1));
      const leftGlobalIndex = capeBase.add(leftIndex);
      const rightGlobalIndex = capeBase.add(rightIndex);
      const leftState = buffer.element(leftGlobalIndex);
      const rightState = buffer.element(rightGlobalIndex);
      const left = leftState.xyz.toVar('spanLeft');
      const right = rightState.xyz.toVar('spanRight');
      const anchorBase = capeIndex.mul(uint(CAPE.columns));
      const shoulderAxis = resources.anchorUniform.element(
        anchorBase.add(uint(CAPE.columns - 1)),
      ).xyz
        .sub(resources.anchorUniform.element(anchorBase).xyz)
        .normalize();
      const restSpan = resources.topologyBuffer.element(
        leftIndex.mul(uint(GPU_CAPE_TOPOLOGY_METADATA_STRIDE)),
      ).x;
      const lateralSpan = right.sub(left).dot(shoulderAxis);
      const deficit = restSpan.mul(MINIMUM_CAPE_ROW_SPAN_RATIO)
        .sub(lateralSpan)
        .max(0);
      const correction = shoulderAxis.mul(
        deficit.mul(CAPE_ROW_SPAN_RELAXATION * 0.5),
      );
      left.subAssign(correction);
      right.addAssign(correction);
      buffer.element(leftGlobalIndex).assign(vec4(left, leftState.w));
      buffer.element(rightGlobalIndex).assign(vec4(right, rightState.w));
      const leftPreviousState = resources.previousBuffer.element(leftGlobalIndex);
      const rightPreviousState = resources.previousBuffer.element(rightGlobalIndex);
      resources.previousBuffer.element(leftGlobalIndex).assign(vec4(
        leftPreviousState.xyz.sub(correction),
        leftPreviousState.w,
      ));
      resources.previousBuffer.element(rightGlobalIndex).assign(vec4(
        rightPreviousState.xyz.add(correction),
        rightPreviousState.w,
      ));

      // Endpoint span alone still allows all interior particles to curl into
      // a U-shaped tube. Constrain only excessive departure from the current
      // row chord; the chord itself remains free to trail and twist.
      for (let column = 1; column < CAPE.columns - 1; column += 1) {
        const particleIndex = leftIndex.add(uint(column));
        const particleGlobalIndex = capeBase.add(particleIndex);
        const particleState = buffer.element(particleGlobalIndex);
        const position = particleState.xyz.toVar('rowCurl' + column);
        const chordPoint = left.add(
          right.sub(left).mul(column / (CAPE.columns - 1)),
        );
        const curlDelta = position.sub(chordPoint).toVar('rowCurlDelta' + column);
        const curlLength = curlDelta.length().toVar('rowCurlLength' + column);
        const maximumCurl = restSpan.mul(MAXIMUM_CAPE_ROW_CURL_RATIO);
        If(curlLength.greaterThan(maximumCurl).and(curlLength.greaterThan(0.000_001)), () => {
          const curlCorrection = curlDelta.mul(
            curlLength.sub(maximumCurl)
              .div(curlLength)
              .mul(CAPE_ROW_CURL_RELAXATION),
          );
          position.subAssign(curlCorrection);
          buffer.element(particleGlobalIndex).assign(vec4(position, particleState.w));
          const previousState = resources.previousBuffer.element(particleGlobalIndex);
            resources.previousBuffer.element(particleGlobalIndex).assign(vec4(
            previousState.xyz.sub(curlCorrection),
            previousState.w,
          ));
        });
      }
    });
    storageBarrier();
    });
  })().compute(resources.packedParticleCount, [resources.particleCount]).setName(name);
}
