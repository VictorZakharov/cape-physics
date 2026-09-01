import { describe, expect, test } from 'bun:test';

const browserHarnesses = [
  'scripts/run-webgpu-isolation-probe.mjs',
  'scripts/render-performance-profile.mjs',
  'scripts/compare-cape-trajectories.mjs',
  'scripts/render-visual-audit.mjs',
] as const;

describe('local browser harness storage', () => {
  for (const path of browserHarnesses) {
    test(`${path} uses disposable Chrome profiles under repository temp`, async () => {
      const source = await Bun.file(path).text();
      const chromeCandidate = source.indexOf("'Google', 'Chrome'");

      expect(source).toContain("join(repositoryRoot, 'artifacts', '.tmp')");
      expect(source).toContain('process.env.CAPE_BROWSER_PATH');
      expect(chromeCandidate).toBeGreaterThan(-1);
      expect(source).not.toContain('process.env.CAPE_EDGE_PATH');
      expect(source).not.toContain("'Microsoft', 'Edge'");
      expect(source).not.toContain('msedge.exe');
      expect(source).toContain('closeBrowserProcess(browser, debuggerConnection)');
      expect(source).toContain('rmSync(temporaryRoot, { recursive: true, force: true');
      expect(source).toContain('if (existsSync(temporaryRoot)) throw new Error');
      expect(source).not.toContain('os.tmpdir');
    });
  }
});
