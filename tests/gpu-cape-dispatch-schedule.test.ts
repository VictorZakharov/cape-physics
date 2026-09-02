import { describe, expect, test } from 'bun:test';
import { CAPE } from '../src/config';
import { createGpuCapeDispatchSchedule } from '../src/physics/GpuCapeDispatchSchedule';

const kernels = {
  resetMaterialContactFlags: 'reset-contact-flags',
  predict: 'predict',
  recoverIdleDrape: 'recover-idle-drape',
  constrainPosition: 'constrain-position',
  constrainScratch: 'constrain-scratch',
  scratchToPosition: 'scratch-to-position',
  positionToScratch: 'position-to-scratch',
  scratchToPositionWithoutContacts: 'copy-scratch-to-position',
  positionToScratchWithoutContacts: 'copy-position-to-scratch',
  hardScratchToPosition: 'hard-scratch-to-position',
  hardPositionToScratch: 'hard-position-to-scratch',
  finalSelfPositionToScratch: 'final-self-position-to-scratch',
  finalContactScratchToPosition: 'final-contact-scratch-to-position',
  positionVirtualBodyContacts: 'position-virtual-body-contacts',
  scratchVirtualBodyContacts: 'scratch-virtual-body-contacts',
  positionRockFaces: 'position-rock-faces',
  positionSweptRockFaces: 'position-swept-rock-faces',
  scratchRockFaces: 'scratch-rock-faces',
  reconcileBodyContactVelocity: 'reconcile-body-contact-velocity',
  reconcileProjectionVerticalVelocity: 'reconcile-projection-vertical-velocity',
} as const;

describe('WebGPU cape dispatch schedule', () => {
  test('locks the exact production ping-pong and reconciliation order', () => {
    const schedule = createGpuCapeDispatchSchedule(kernels, CAPE.solverIterations);
    expect(schedule).toHaveLength(46);
    expect(schedule).toEqual([
      'reset-contact-flags',
      'predict',
      'recover-idle-drape',
      'constrain-scratch', 'scratch-to-position',
      'constrain-position', 'copy-position-to-scratch',
      'constrain-scratch', 'copy-scratch-to-position',
      'constrain-position', 'copy-position-to-scratch',
      'constrain-scratch', 'copy-scratch-to-position',
      'constrain-position', 'copy-position-to-scratch',
      'constrain-scratch', 'copy-scratch-to-position',
      'constrain-position', 'position-to-scratch',
      'scratch-virtual-body-contacts',
      'constrain-scratch', 'scratch-to-position',
      'position-virtual-body-contacts',
      'constrain-position', 'position-to-scratch',
      'scratch-virtual-body-contacts',
      'hard-scratch-to-position', 'position-swept-rock-faces',
      'hard-position-to-scratch', 'scratch-rock-faces',
      'hard-scratch-to-position', 'position-rock-faces',
      'hard-position-to-scratch',
      'hard-scratch-to-position',
      'position-rock-faces',
      'final-self-position-to-scratch',
      'final-contact-scratch-to-position',
      'position-virtual-body-contacts',
      'constrain-position',
      'position-virtual-body-contacts',
      'hard-position-to-scratch',
      'hard-scratch-to-position',
      'position-rock-faces',
      'position-virtual-body-contacts',
      'reconcile-body-contact-velocity',
      'reconcile-projection-vertical-velocity',
    ]);
  });

  test('rejects schedules whose parity cannot end in the render buffer', () => {
    expect(() => createGpuCapeDispatchSchedule(kernels, 1)).toThrow(
      'GPU cape projection schedule must finish in the render position buffer.',
    );
  });
});
