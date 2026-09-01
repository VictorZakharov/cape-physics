import { describe, expect, test } from 'bun:test';

function collectPublicMethods(source: string): string[] {
  return [...source.matchAll(/^  public (?:async )?(\w+)\s*\(/gm)]
    .map((match) => match[1]!);
}

function collectPublicReadonlyProperties(source: string): string[] {
  return [...source.matchAll(/^  public readonly (\w+):/gm)]
    .map((match) => match[1]!);
}

function collectExports(source: string): string[] {
  const direct = [...source.matchAll(/^export (?:interface|class|const|function) (\w+)/gm)]
    .map((match) => match[1]!);
  const reexportedTypes = [...source.matchAll(/^export type \{([^}]+)\} from/gms)]
    .flatMap((match) => match[1]!.split(','))
    .map((name) => name.trim())
    .filter(Boolean);
  return [...direct, ...reexportedTypes].sort();
}

describe('cape solver facade contract', () => {
  test('preserves the CPU solver public boundary during decomposition', async () => {
    const source = await Bun.file('src/physics/CapeSimulation.ts').text();

    expect(collectExports(source)).toEqual([
      'CapeSimulation',
      'CapeSimulationOptions',
      'PackedCapeState',
      'createCapeFabricMaterial',
    ].sort());
    expect(collectPublicReadonlyProperties(source)).toEqual(['mesh']);
    expect(collectPublicMethods(source)).toEqual([
      'constructor',
      'step',
      'syncGeometry',
      'refreshDiagnostics',
      'overwriteStateFromGpu',
      'copyPackedState',
      'overwriteStateForHarness',
      'synchronizeAnchorDiagnostics',
      'reset',
      'updateSettings',
      'getSettings',
      'setOpacity',
      'dispose',
      'disposeMaterial',
      'getParticlePosition',
      'getMaximumStructuralError',
      'getMaximumBodyPenetration',
      'getBodyPenetrationDiagnostics',
      'getMaximumEnvironmentPenetration',
      'getEnvironmentPenetrationDiagnostics',
      'getMaximumEnvironmentFacePenetration',
      'getMinimumSelfSeparation',
      'getMaximumUpwardFold',
      'getHemDrop',
      'getMinimumLowerCapeDrop',
      'getMaximumLowerCapeLateralOffset',
      'getMaximumLowerCapeHorizontalOffset',
      'getAverageLowerCapeSpanRatio',
      'getCapeRowTwistRange',
      'getCapeCenterlineDeviation',
      'getMaximumLowerCapeRowCurlRatio',
      'getHemBackOffset',
      'getMinimumHemGroundClearance',
      'getMaximumParticleMotion',
      'getMaximumParticleVerticalMotion',
      'getMaximumParticleMotionDiagnostics',
      'isSleeping',
      'getWorldContactDiagnostics',
      'getPerformanceDiagnostics',
      'getClosestActiveRockSurfaceContact',
    ]);
  });

  test('preserves the WebGPU solver public boundary during decomposition', async () => {
    const source = await Bun.file('src/physics/GpuCapeSimulation.ts').text();

    expect(collectExports(source)).toEqual([
      'GpuCapeBatchHarnessState',
      'GpuCapeKernelTiming',
      'GpuCapeKernelProfile',
      'GpuCapeStepInput',
      'GpuCapeSimulation',
      'MAXIMUM_GPU_CAPES',
    ].sort());
    expect(collectPublicReadonlyProperties(source)).toEqual(['mesh', 'botMesh']);
    expect(collectPublicMethods(source)).toEqual([
      'constructor',
      'step',
      'prepareStep',
      'getComputePipelineNodes',
      'prepareBatchStep',
      'syncGeometry',
      'reset',
      'updateSettings',
      'getSettings',
      'setOpacity',
      'dispose',
      'refreshDiagnostics',
      'readBatchStateForHarness',
      'overwriteStateForHarness',
      'getParticlePosition',
      'getMaximumStructuralError',
      'getMaximumBodyPenetration',
      'getBodyPenetrationDiagnostics',
      'getMaximumEnvironmentPenetration',
      'getEnvironmentPenetrationDiagnostics',
      'getMaximumEnvironmentFacePenetration',
      'getMinimumSelfSeparation',
      'getMaximumUpwardFold',
      'getHemDrop',
      'getMinimumLowerCapeDrop',
      'getMaximumLowerCapeLateralOffset',
      'getMaximumLowerCapeHorizontalOffset',
      'getAverageLowerCapeSpanRatio',
      'getCapeRowTwistRange',
      'getCapeCenterlineDeviation',
      'getMaximumLowerCapeRowCurlRatio',
      'getHemBackOffset',
      'getMinimumHemGroundClearance',
      'getMaximumParticleMotion',
      'getMaximumParticleVerticalMotion',
      'getMaximumParticleMotionDiagnostics',
      'isSleeping',
      'getWorldContactDiagnostics',
      'getPerformanceDiagnostics',
      'profileKernelBreakdown',
      'getClosestActiveRockSurfaceContact',
    ]);
  });
});
