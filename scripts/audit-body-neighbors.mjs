import { execFileSync, spawn } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
const repository = resolve('.'), parent = resolve('artifacts/.tmp');
mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'neighbor-audit-'));
const mode = process.argv[2] ?? 'timing';
function run(command, args, env = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { cwd: root, windowsHide: true, stdio: 'inherit', env: { ...process.env, TEMP: root, TMP: root, ...env } });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolveRun() : reject(Error(`${command} exited ${code}`)));
  });
}
try {
  if (!['timing', 'regression', 'reports', 'overflow'].includes(mode)) throw Error('Mode must be timing, regression, overflow or reports');
  for (const name of ['src', 'scripts', 'public', 'index.html', 'package.json', 'vite.config.ts', 'tsconfig.json']) cpSync(join(repository, name), join(root, name), { recursive: true });
  // Freeze the entire simulation baseline, including fixture inputs, for future replays.
  const archive = execFileSync('git', ['archive', '--format=tar', 'd4530db', 'src', 'scripts/audit/cloth-fixture.ts'], { cwd: repository, windowsHide: true, maxBuffer: 32 * 1024 * 1024 });
  execFileSync('tar', ['-xf', '-', '-C', root], { input: archive, windowsHide: true, env: { ...process.env, TEMP: root, TMP: root } });
  const patch = resolve('docs/body-neighbor-evidence/candidate-lists.patch');
  if (!existsSync(patch)) throw Error('Archived candidate-list patch is missing');
  execFileSync('git', ['apply', '--unidiff-zero', `--directory=${relative(repository, root).split(sep).join('/')}`, patch], { cwd: repository, windowsHide: true });
  if (mode === 'regression') await run('bun', ['scripts/verify-body-neighbors.ts'], { CAPE_BODY_ALL: '1' });
  else if (mode === 'overflow') await run('bun', ['scripts/verify-body-neighbors.ts'], { CAPE_BODY_OVERFLOW_ONLY: '1' });
  else if (mode === 'reports') await run('node', ['scripts/capture-body-neighbors.mjs']);
  else for (const skin of ['0.026', '0.052', '0.104']) await run('node', ['scripts/measure-body-neighbors.mjs'], { CAPE_BODY_SKIN: skin });
  const destination = resolve('artifacts/body-neighbor-audit'); mkdirSync(destination, { recursive: true });
  for (const name of ['body-collision', 'performance-instrumentation']) {
    const source = join(root, 'artifacts', name);
    if (existsSync(source)) cpSync(source, join(destination, name), { recursive: true });
  }
  console.log(`Evidence saved in ${destination}`);
} finally {
  if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path');
  rmSync(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
}
