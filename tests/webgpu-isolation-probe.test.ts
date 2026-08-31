import { describe, expect, test } from 'bun:test';
import { shouldRunWebGpuIsolationProbe } from '../src/testing/WebGpuIsolationProbeQuery';

describe('isolated WebGPU diagnostic probe', () => {
  test('requires an explicit probe query', () => {
    expect(shouldRunWebGpuIsolationProbe('?webgpuProbe=1')).toBe(true);
    expect(shouldRunWebGpuIsolationProbe('?renderer=webgpu')).toBe(false);
    expect(shouldRunWebGpuIsolationProbe('')).toBe(false);
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
});
