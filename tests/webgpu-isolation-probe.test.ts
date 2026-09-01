import { describe, expect, test } from 'bun:test';
import {
  readWebGpuIsolationProbeWorkload,
  shouldRunWebGpuIsolationProbe,
} from '../src/testing/WebGpuIsolationProbeQuery';

describe('isolated WebGPU diagnostic probe', () => {
  test('requires an explicit probe query', () => {
    expect(shouldRunWebGpuIsolationProbe('?webgpuProbe=1')).toBe(true);
    expect(shouldRunWebGpuIsolationProbe('?renderer=webgpu')).toBe(false);
    expect(shouldRunWebGpuIsolationProbe('')).toBe(false);
    expect(readWebGpuIsolationProbeWorkload('?webgpuProbe=1')).toBe('minimal');
    expect(readWebGpuIsolationProbeWorkload(
      '?webgpuProbe=1&probeWorkload=three-cloth',
    )).toBe('three-cloth');
    expect(readWebGpuIsolationProbeWorkload(
      '?webgpuProbe=1&probeWorkload=app-cape',
    )).toBe('app-cape');
    expect(readWebGpuIsolationProbeWorkload('?probeWorkload=unknown')).toBe('minimal');
  });

  test('never loads the full demo or performs backend recovery', async () => {
    const source = await Bun.file('src/testing/WebGpuIsolationProbe.ts').text();
    const entrySource = await Bun.file('src/main.ts').text();
    const styles = await Bun.file('src/styles/webgpu-probe.css').text();
    expect(source).not.toContain('CapeDemo');
    expect(source).not.toContain('location.reload');
    expect(source).not.toContain('location.replace');
    expect(source).not.toContain('WebGLRenderer');
    expect(source).not.toContain('PMREMGenerator');
    expect(source).not.toContain('GpuCapeSimulation');
    expect(source).toContain('onSubmittedWorkDone');
    expect(source).toContain('device.destroy()');
    expect(entrySource).toContain("await import('./testing/WebGpuIsolationProbe')");
    expect(entrySource).toContain("await import('./CapeDemo')");
    expect(entrySource).not.toContain("from './CapeDemo'");
    expect(source).toContain("document.documentElement.classList.add('is-webgpu-probe')");
    expect(styles).toContain('html.is-webgpu-probe');
    expect(styles).toContain('body.is-webgpu-probe .app');
    expect(styles).toContain('overflow: visible');
  });

  test('keeps the Three.js reference workload separate from application cloth', async () => {
    const source = await Bun.file('src/testing/ThreeComputeClothProbe.ts').text();
    expect(source).toContain('mrdoob/three.js/blob/r185/examples/webgpu_compute_cloth.html');
    expect(source).toContain('computeSpringForces');
    expect(source).toContain('computeVertexForces');
    expect(source).not.toContain('GpuCapeSimulation');
    expect(source).not.toContain('CapeSimulation');
    expect(source).not.toContain('PMREMGenerator');
    expect(source).not.toContain('CapeDemo');
  });

  test('keeps the production cape workload isolated from the full scene', async () => {
    const source = await Bun.file('src/testing/ApplicationCapeProbe.ts').text();
    expect(source).toContain("import { GpuCapeSimulation }");
    expect(source).toContain('simulation.prepareStep(');
    expect(source).toContain('simulation.getComputePipelineNodes()');
    expect(source).toContain('usePositionOnlyMaterial');
    expect(source).toContain('useProductionMaterial');
    expect(source).not.toContain('CapeDemo');
    expect(source).not.toContain('Character(');
    expect(source).not.toContain('CaveWorld');
    expect(source).not.toContain('PMREMGenerator');
    expect(source).not.toContain('RenderPipeline');
    expect(source).not.toContain('PostProcessing');
  });

  test('precompiles every production compute kernel before the first cape submission', async () => {
    const source = await Bun.file('src/testing/WebGpuIsolationProbe.ts').text();
    const harness = await Bun.file('scripts/run-webgpu-isolation-probe.mjs').text();
    const compileStage = source.indexOf("stage('compile-application-cape-compute-pipelines'");
    const submitStage = source.indexOf("stage('submit-one-application-cape-step'");
    expect(source).toContain('compileWebGpuComputePipelines(');
    expect(source).toContain('applicationCapeCompiledComputePipelines');
    expect(source).toContain('applicationCapeComputeShader${kernelNumber}Characters');
    expect(source).toContain('applicationCapeComputePipeline${loaded}Milliseconds');
    expect(harness).toContain("relevantEvents(debuggerEvents, ['error', 'warning'])");
    expect(harness).toContain('browser logged an exception, error, or warning');
    expect(compileStage).toBeGreaterThan(-1);
    expect(submitStage).toBeGreaterThan(compileStage);
  });
});
