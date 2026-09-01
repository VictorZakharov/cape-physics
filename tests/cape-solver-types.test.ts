import { describe, expect, test } from 'bun:test';
import type {
  CapeSimulationOptions,
  GpuCapeBatchHarnessState,
  GpuCapeKernelProfile,
  PackedCapeState,
} from '../src/physics/CapeSolverTypes';

describe('cape solver state contracts', () => {
  test('retains the transferable CPU state and worker options', () => {
    const options = { renderResources: false } satisfies CapeSimulationOptions;
    const state = {
      positions: new Float32Array([1, 2, 3, 0]),
      previous: new Float32Array([0, 1, 2, 0]),
    } satisfies PackedCapeState;

    expect(options.renderResources).toBeFalse();
    expect([...state.positions]).toEqual([1, 2, 3, 0]);
    expect([...state.previous]).toEqual([0, 1, 2, 0]);
  });

  test('retains the GPU diagnostics and harness state shapes', () => {
    const profile = {
      samples: 1,
      noOpMilliseconds: 0,
      separatePassTotalMilliseconds: 1,
      estimatedArithmeticTotalMilliseconds: 1,
      kernels: [],
      projectionComponents: {
        fullMilliseconds: 1,
        contactsMilliseconds: 0.25,
        selfCollisionMilliseconds: 0.25,
        constraintsAndFoldMilliseconds: 0.5,
      },
    } satisfies GpuCapeKernelProfile;
    const harnessState = {
      capeIndex: 0,
      maximumNecklineAttachmentError: 0,
      particles: [0, 0, 0],
    } satisfies GpuCapeBatchHarnessState;

    expect(profile.projectionComponents.constraintsAndFoldMilliseconds).toBe(0.5);
    expect(harnessState.particles).toEqual([0, 0, 0]);
  });
});
