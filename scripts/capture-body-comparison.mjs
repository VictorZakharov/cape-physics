import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { resolve, join, sep } from 'node:path';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'body-comparison-'));
function run(command, args, cwd = process.cwd(), env = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { cwd, windowsHide: true, env: { ...process.env, TEMP: root, TMP: root, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = ''; child.stdout.on('data', chunk => { output += chunk; }); child.stderr.on('data', chunk => { output += chunk; });
    child.on('error', reject); child.on('exit', code => resolveRun({ code, output }));
  });
}
try {
  const baseline = join(root, 'baseline'); mkdirSync(baseline);
  for (const name of ['src', 'index.html', 'public', 'package.json', 'vite.config.ts', 'tsconfig.json']) cpSync(name, join(baseline, name), { recursive: true });
  for (const file of ['core/PerformanceMonitor.ts', 'core/PerformanceReport.ts', 'physics/CapeContactSolver.ts', 'physics/ClothBodyCollision.ts', 'physics/WebGlCapeWorkerPool.ts', 'physics/WorkerStepTiming.ts', 'physics/WorkerTelemetry.ts']) writeFileSync(join(baseline, 'src', file), execFileSync('git', ['show', `2432d53:src/${file}`]));
  const before = await run('bun', ['run', resolve('node_modules/vite/bin/vite.js'), 'build'], baseline); if (before.code !== 0) throw Error(before.output);
  const after = await run('bun', ['run', 'build']); if (after.code !== 0) throw Error(after.output);
  // Use the existing native-loop report capture, keeping all its temporary data on G:.
  for (const [stage, renderer, workers] of [['before', 'webgl', ''], ['before', 'webgl', '3'], ['after', 'webgl', ''], ['after', 'webgl', '3'], ['after', 'webgpu', '']]) {
    console.log(`Body report ${stage}: ${renderer}, ${workers || 'automatic'} workers`);
    const captured = await run('node', [resolve('scripts/capture-performance-evidence.mjs')], process.cwd(), {
      CAPE_PROFILE_DIST_ROOT: stage === 'before' ? join(baseline, 'dist') : resolve('dist'), CAPE_EVIDENCE_STAGE: `body-${stage}`,
      CAPE_PROFILE_RENDERER: renderer, CAPE_PROFILE_WORKERS: workers, CAPE_PROFILE_LIVE_SECONDS: '16', CAPE_PROFILE_STARTUP_SECONDS: renderer === 'webgpu' ? '180' : '90',
    });
    console.log(captured.output.split('\n').filter(line => /^(Cape worker execution:|Worker phase mean:|Worker body candidates:|Worker simulated timestep:|Error:)/.test(line)).join('\n'));
    if (captured.code !== 0) throw Error(captured.output);
  }
} finally {
  if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
}
