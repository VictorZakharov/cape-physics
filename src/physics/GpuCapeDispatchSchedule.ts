export interface GpuCapeDispatchKernels<T> {
  readonly resetMaterialContactFlags: T;
  readonly predict: T;
  readonly recoverIdleDrape: T;
  readonly constrainPosition: T;
  readonly constrainScratch: T;
  readonly scratchToPosition: T;
  readonly positionToScratch: T;
  readonly hardScratchToPosition: T;
  readonly hardPositionToScratch: T;
  readonly finalSelfPositionToScratch: T;
  readonly finalContactScratchToPosition: T;
  readonly positionVirtualBodyContacts: T;
  readonly scratchVirtualBodyContacts: T;
  readonly positionRockFaces: T;
  readonly positionSweptRockFaces: T;
  readonly scratchRockFaces: T;
  readonly reconcileBodyContactVelocity: T;
  readonly reconcileProjectionVerticalVelocity: T;
}

/**
 * Preserves the production solver's ordered buffer ping-pong and final
 * reconciliation passes independently of how each WebGPU kernel is built.
 */
export function createGpuCapeDispatchSchedule<T>(
  kernels: GpuCapeDispatchKernels<T>,
  solverIterations: number,
): T[] {
  const sequence: T[] = [
    kernels.resetMaterialContactFlags,
    kernels.predict,
    kernels.recoverIdleDrape,
  ];

  let currentBufferIsPosition = false;
  for (let iteration = 0; iteration < solverIterations; iteration += 1) {
    sequence.push(
      currentBufferIsPosition ? kernels.constrainPosition : kernels.constrainScratch,
      currentBufferIsPosition ? kernels.positionToScratch : kernels.scratchToPosition,
    );
    currentBufferIsPosition = !currentBufferIsPosition;
    if (iteration >= solverIterations - 3) {
      sequence.push(
        currentBufferIsPosition
          ? kernels.positionVirtualBodyContacts
          : kernels.scratchVirtualBodyContacts,
      );
    }
  }
  for (let reconciliation = 0; reconciliation < 3; reconciliation += 1) {
    sequence.push(
      currentBufferIsPosition
        ? kernels.hardPositionToScratch
        : kernels.hardScratchToPosition,
    );
    currentBufferIsPosition = !currentBufferIsPosition;
    if (reconciliation === 0) {
      sequence.push(kernels.positionSweptRockFaces);
    } else {
      sequence.push(
        currentBufferIsPosition ? kernels.positionRockFaces : kernels.scratchRockFaces,
      );
    }
  }
  if (!currentBufferIsPosition) {
    throw new Error('GPU cape projection schedule must finish in the render position buffer.');
  }

  sequence.push(
    kernels.hardPositionToScratch,
    kernels.hardScratchToPosition,
    kernels.positionRockFaces,
    kernels.finalSelfPositionToScratch,
    kernels.finalContactScratchToPosition,
    kernels.positionVirtualBodyContacts,
    // Triangle contact uses the standard barycentric PBD gradient, so repair
    // stretch locally and then recheck the body before the final point pass.
    kernels.constrainPosition,
    kernels.positionVirtualBodyContacts,
    // A virtual face correction moves all three real vertices. Re-run the
    // authoritative particle contacts afterward so that correction cannot
    // leave a vertex inside a different animated limb capsule.
    kernels.hardPositionToScratch,
    kernels.hardScratchToPosition,
    kernels.positionRockFaces,
    // Particle and rock reconciliation can leave the interior of a coarse
    // cloth triangle across an animated boot even when all three vertices
    // are outside. End body contact with the exact deformable face constraint.
    kernels.positionVirtualBodyContacts,
    kernels.reconcileBodyContactVelocity,
    kernels.reconcileProjectionVerticalVelocity,
  );
  return sequence;
}
