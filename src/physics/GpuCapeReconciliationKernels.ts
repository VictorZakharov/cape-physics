import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  atomicLoad,
  atomicStore,
  instanceIndex,
  mix,
  smoothstep,
  uint,
  vec4,
} from 'three/tsl';
import { CAPE } from '../config';
import {
  BODY_CONTACT_RECONCILIATION_FULL,
  BODY_CONTACT_RECONCILIATION_START,
} from './CapeSolverConstants';

export interface GpuCapeReconciliationResources {
  readonly activeCapeCountUniform: THREE.UniformNode<'uint', number>;
  readonly materialContactFlagBuffer: THREE.StorageBufferNode<'uint'>;
  readonly positionBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly predictedVerticalBuffer: THREE.StorageBufferNode<'float'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly packedParticleCount: number;
  readonly particleCount: number;
  readonly maximumCapeCount: number;
}

export function createGpuCapeMaterialContactFlagResetKernel(
  resources: GpuCapeReconciliationResources,
): THREE.ComputeNode {
  return Fn(() => {
    const capeIndex = instanceIndex;
    If(capeIndex.lessThan(resources.activeCapeCountUniform), () => {
      atomicStore(resources.materialContactFlagBuffer.element(capeIndex), uint(0));
    });
  })().compute(resources.maximumCapeCount).setName('Cape reset material contact flag');
}

export function createGpuCapeBodyContactReconciliationKernel(
  resources: GpuCapeReconciliationResources,
): THREE.ComputeNode {
  return Fn(() => {
    const index = instanceIndex;
    const capeIndex = index.div(uint(resources.particleCount));
    const localIndex = index.mod(uint(resources.particleCount));
    If(capeIndex.lessThan(resources.activeCapeCountUniform), () => {
    If(localIndex.greaterThanEqual(uint(CAPE.columns)), () => {
      const position = resources.positionBuffer.element(index);
      const correction = position.w;
      If(correction.greaterThan(BODY_CONTACT_RECONCILIATION_START), () => {
        const previous = resources.previousBuffer.element(index);
        const strength = smoothstep(
          BODY_CONTACT_RECONCILIATION_START,
          BODY_CONTACT_RECONCILIATION_FULL,
          correction,
        );
        resources.previousBuffer.element(index).assign(vec4(
          mix(previous.xyz, position.xyz, strength),
          previous.w,
        ));
      });
      resources.positionBuffer.element(index).assign(vec4(position.xyz, 0));
    });
    });
  })().compute(resources.packedParticleCount).setName('Cape reconcile body contact velocity');
}

/**
 * Match CapeSimulation.reconcileProjectionVerticalVelocity. If physical
 * prediction was falling, a later positional length repair must not become
 * upward Verlet velocity. Material contact disables the phase for the whole
 * step because world/body projection may legitimately need upward motion.
 */
export function createGpuCapeProjectionVerticalVelocityReconciliationKernel(
  resources: GpuCapeReconciliationResources,
): THREE.ComputeNode {
  return Fn(() => {
    const index = instanceIndex;
    const capeIndex = index.div(uint(resources.particleCount));
    const localIndex = index.mod(uint(resources.particleCount));
    If(capeIndex.lessThan(resources.activeCapeCountUniform), () => {
    const hasMaterialContact = atomicLoad(
      resources.materialContactFlagBuffer.element(capeIndex),
    ).greaterThan(uint(0));
    If(
      localIndex.greaterThanEqual(uint(CAPE.columns))
        .and(hasMaterialContact.not())
        .and(resources.predictedVerticalBuffer.element(index).lessThan(0)),
      () => {
        const position = resources.positionBuffer.element(index);
        const previous = resources.previousBuffer.element(index);
        If(position.y.greaterThan(previous.y), () => {
          resources.previousBuffer.element(index).assign(vec4(
            previous.x,
            position.y,
            previous.z,
            previous.w,
          ));
        });
      },
    );
    });
  })().compute(resources.packedParticleCount)
    .setName('Cape reconcile projection vertical velocity');
}
