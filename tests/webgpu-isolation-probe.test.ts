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
});
