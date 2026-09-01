import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  cross,
  float,
  instanceIndex,
  smoothstep,
  uint,
  vec3,
  vec4,
} from 'three/tsl';
import { CAPE } from '../config';
import { CAPE_FLUTTER_ACCELERATION } from './CapeAerodynamics';
import {
  IDLE_DRAPE_RECOVERY_PER_STEP,
  IDLE_DRAPE_RECOVERY_TARGET,
  MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED,
  MAXIMUM_VERTICAL_CAPE_PARTICLE_SPEED,
} from './CapeSolverConstants';
import { GPU_CAPE_TOPOLOGY_METADATA_STRIDE } from './GpuCapeTopology';

export interface GpuCapePredictionResources {
  readonly activeCapeCountUniform: THREE.UniformNode<'uint', number>;
  readonly anchorStateUniform: THREE.UniformArrayNode<'vec4'>;
  readonly anchorUniform: THREE.UniformArrayNode<'vec4'>;
  readonly dampingUniform: THREE.UniformNode<'float', number>;
  readonly deltaTimeUniform: THREE.UniformNode<'float', number>;
  readonly dragPerSecondUniform: THREE.UniformNode<'float', number>;
  readonly dynamicsUniform: THREE.UniformArrayNode<'vec4'>;
  readonly positionBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly predictedVerticalBuffer: THREE.StorageBufferNode<'float'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly scratchBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly timeUniform: THREE.UniformNode<'float', number>;
  readonly topologyBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly weightUniform: THREE.UniformNode<'float', number>;
  readonly maximumCapeCount: number;
  readonly packedParticleCount: number;
  readonly particleCount: number;
}

export function createGpuCapeIdleDrapeRecoveryKernel(
  resources: GpuCapePredictionResources,
): THREE.ComputeNode {
  return Fn(() => {
    const capeIndex = instanceIndex.div(uint(CAPE.rows));
    const row = instanceIndex.mod(uint(CAPE.rows));
    const capeBase = capeIndex.mul(uint(resources.particleCount));
    const anchorState = resources.anchorStateUniform.element(capeIndex);
    If(
      capeIndex.lessThan(resources.activeCapeCountUniform)
        .and(anchorState.w.greaterThan(0))
        .and(row.greaterThan(uint(0)))
        .and(row.lessThan(uint(CAPE.rows))),
      () => {
        const rowCenter = vec3(0).toVar('idleDrapeRowCenter');
        for (let column = 0; column < CAPE.columns; column += 1) {
          rowCenter.addAssign(resources.scratchBuffer.element(
            capeBase.add(row.mul(uint(CAPE.columns))).add(uint(column)),
          ).xyz);
        }
        rowCenter.divAssign(CAPE.columns);
        const horizontalOffset = rowCenter
          .sub(anchorState.xyz)
          .mul(vec3(1, 0, 1))
          .toVar('idleDrapeHorizontalOffset');
        If(
          rowCenter.y.lessThan(anchorState.y)
            .and(horizontalOffset.length().greaterThan(IDLE_DRAPE_RECOVERY_TARGET)),
          () => {
            const down = float(row).div(CAPE.rows - 1);
            const correction = horizontalOffset.mul(
              float(-IDLE_DRAPE_RECOVERY_PER_STEP)
                .mul(anchorState.w)
                .mul(smoothstep(0.05, 1, down)),
            );
            for (let column = 0; column < CAPE.columns; column += 1) {
              const particleIndex = capeBase
                .add(row.mul(uint(CAPE.columns)))
                .add(uint(column));
              const predicted = resources.scratchBuffer.element(particleIndex);
              resources.scratchBuffer.element(particleIndex).assign(vec4(
                predicted.xyz.add(correction),
                predicted.w,
              ));
              const previous = resources.previousBuffer.element(particleIndex);
              resources.previousBuffer.element(particleIndex).assign(vec4(
                previous.xyz.add(correction),
                previous.w,
              ));
            }
          },
        );
      },
    );
  })().compute(
    CAPE.rows * resources.maximumCapeCount,
    [CAPE.rows],
  ).setName('Cape idle drape recovery');
}

export function createGpuCapePredictionKernel(
  resources: GpuCapePredictionResources,
): THREE.ComputeNode {
  return Fn(() => {
    const index = instanceIndex;
    const capeIndex = index.div(uint(resources.particleCount));
    const localIndex = index.mod(uint(resources.particleCount));
    If(capeIndex.lessThan(resources.activeCapeCountUniform), () => {
    const capeBase = capeIndex.mul(uint(resources.particleCount));
    const dynamics = resources.dynamicsUniform.element(capeIndex);
    const current = resources.positionBuffer.element(index);
    const previous = resources.previousBuffer.element(index);
    const target = resources.scratchBuffer.element(index);
    If(localIndex.lessThan(uint(CAPE.columns)), () => {
      const anchor = resources.anchorUniform.element(
        capeIndex.mul(uint(CAPE.columns)).add(localIndex),
      );
      target.assign(anchor);
      previous.assign(anchor);
      resources.predictedVerticalBuffer.element(index).assign(float(0));
    }).Else(() => {

    // Match WebGL's world-space Verlet predictor. Only the pinned row above
    // receives the new anchors; translating every free particle here would
    // bypass the cloth constraints and preserve a rigid sheet while walking.
    const currentPosition = current.xyz.toVar('currentPosition');
    const previousPosition = previous.xyz;
    const velocity = currentPosition.sub(previousPosition).toVar('velocity');
    const drag = resources.dragPerSecondUniform.mul(resources.dampingUniform);
    velocity.mulAssign(drag.mul(resources.deltaTimeUniform).negate().exp());
    const maximumPlanarDisplacement = resources.deltaTimeUniform
      .mul(MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED);
    const planarVelocityLength = velocity.x.mul(velocity.x)
      .add(velocity.z.mul(velocity.z))
      .sqrt()
      .toVar('planarVelocityLength');
    If(planarVelocityLength.greaterThan(maximumPlanarDisplacement), () => {
      const planarScale = maximumPlanarDisplacement.div(planarVelocityLength);
      velocity.x.mulAssign(planarScale);
      velocity.z.mulAssign(planarScale);
    });
    const maximumVerticalDisplacement = resources.deltaTimeUniform
      .mul(MAXIMUM_VERTICAL_CAPE_PARTICLE_SPEED);
    velocity.y.assign(velocity.y.clamp(
      maximumVerticalDisplacement.negate(),
      maximumVerticalDisplacement,
    ));
    previous.assign(vec4(currentPosition, 0));

    const topologyMetadata = resources.topologyBuffer.element(
      localIndex.mul(uint(GPU_CAPE_TOPOLOGY_METADATA_STRIDE)),
    );
    const topologyNeighbors = resources.topologyBuffer.element(
      localIndex.mul(uint(GPU_CAPE_TOPOLOGY_METADATA_STRIDE)).add(1),
    );
    const left = resources.positionBuffer.element(
      capeBase.add(uint(topologyMetadata.z)),
    ).xyz;
    const right = resources.positionBuffer.element(
      capeBase.add(uint(topologyMetadata.w)),
    ).xyz;
    const up = resources.positionBuffer.element(capeBase.add(uint(topologyNeighbors.x))).xyz;
    const down = resources.positionBuffer.element(capeBase.add(uint(topologyNeighbors.y))).xyz;
    const normal = cross(down.sub(up), right.sub(left)).normalize().toVar('normal');
    const pressure = dynamics.xyz.dot(normal).toVar('pressure');
    const row = localIndex.div(uint(CAPE.columns));
    const column = localIndex.mod(uint(CAPE.columns));
    const turbulence = resources.timeUniform.mul(4.3)
      .add(float(row).mul(0.83))
      .add(float(column).mul(1.71))
      .sin()
      .mul(0.42);
    const across = float(column).div(CAPE.columns - 1).sub(0.5);
    const flutterEnvelope = float(row)
      .div(CAPE.rows - 1)
      .mul(Math.PI)
      .sin()
      .pow(2);
    const flutterProfile = float(0.3).add(across.mul(0.4));
    const flutterDirection = vec3(normal.x, 0, normal.z);
    const fabricFlutter = resources.timeUniform.mul(3.4)
      .add(float(row).mul(0.28))
      .sin()
      .mul(flutterProfile)
      .mul(flutterEnvelope);
    const deltaSquared = resources.deltaTimeUniform.mul(resources.deltaTimeUniform);
    const predicted = currentPosition.add(velocity).toVar('predicted');
    predicted.y.subAssign(
      deltaSquared.mul(9.81).mul(resources.weightUniform),
    );
    predicted.addAssign(normal.mul(
      pressure.mul(pressure.abs()).mul(0.026).mul(deltaSquared),
    ));
    // Match WebGL's symmetry breaker without letting a horizontal cape's
    // vertical normal turn deterministic flutter into sustained lift.
    predicted.addAssign(flutterDirection.mul(
      fabricFlutter
        .mul(dynamics.w)
        .mul(CAPE_FLUTTER_ACCELERATION)
        .mul(deltaSquared),
    ));
    predicted.addAssign(
      dynamics.xyz
        .mul(float(0.048).add(turbulence.mul(0.011)))
        .mul(deltaSquared),
    );
    resources.predictedVerticalBuffer.element(index).assign(
      predicted.y.sub(currentPosition.y),
    );
    // The state lane accumulates body-contact work for final reconciliation.
    target.assign(vec4(predicted, 0));
    });
    });
  })().compute(resources.packedParticleCount).setName('Cape predict');
}
