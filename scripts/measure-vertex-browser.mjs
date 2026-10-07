import { spawn, execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { closeBrowserProcess, connectDebugger, evaluate, fetchJsonWithRetry, reservePort, runCleanupSteps, waitForExpression } from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'vertex-browser-'));
let browser, connection, server;
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  cpSync('src', join(root, 'after/src'), { recursive: true });
  for (const file of ['CapeContactSolver.ts', 'CapeBodyColliderPreparation.ts', 'ClothBodyCollision.ts']) writeFileSync(join(root, 'src/physics', file), execFileSync('git', ['show', `15f268a:src/physics/${file}`]));
  const current = './after/src', fixture = resolve('scripts/audit/cloth-fixture.ts').replaceAll('\\', '/');
  writeFileSync(join(root, 'entry.ts'), `
import { CapeSimulation as Before } from './src/physics/CapeSimulation';
import { workerStepTiming as beforeTiming } from './src/physics/WorkerStepTiming';
import { registerStaticWorldColliderIndex as beforeIndex } from './src/physics/StaticWorldColliderIndex';
import { CapeSimulation as After } from '${current}/physics/CapeSimulation';
import { workerStepTiming as afterTiming } from '${current}/physics/WorkerStepTiming';
import { registerStaticWorldColliderIndex as afterIndex } from '${current}/physics/StaticWorldColliderIndex';
import { ClothBodyCollision as BeforeFace } from './src/physics/ClothBodyCollision';
import { ClothBodyCollision as AfterFace } from '${current}/physics/ClothBodyCollision';
import { bodyVertexDebug as bodyCandidateDebug } from '${current}/physics/VertexBodyCandidates';
import { createClothFixture } from '${fixture}';
bodyCandidateDebug.skin = ${Number(process.env.CAPE_VERTEX_SKIN ?? '0.026')};
self.onmessage = () => {
 let before, after;
 try {
  beforeTiming.isWorker = afterTiming.isWorker = true; beforeTiming.enabled = afterTiming.enabled = true;
  before = createClothFixture(Before, ${Number(process.env.CAPE_VERTEX_CAPES ?? '5')}, true); after = createClothFixture(After, ${Number(process.env.CAPE_VERTEX_CAPES ?? '5')}, true);
  beforeIndex(before.worldColliders); afterIndex(after.worldColliders);
  const faceTimes = { before: 0, after: 0 };
  for (const [stage, Face, clock] of [['before', BeforeFace, beforeTiming], ['after', AfterFace, afterTiming]]) {
    const solve = Face.prototype.solve;
    Face.prototype.solve = function (...args) { const start = clock.sampling ? performance.now() : 0; try { return solve.apply(this, args); } finally { if (clock.sampling) faceTimes[stage] += performance.now() - start; } };
  }
  const counts = { before: { particles: 0, vertexTests: 0, vertexCorrections: 0, triangleTests: 0, triangleCorrections: 0 }, after: { particles: 0, vertexTests: 0, vertexCorrections: 0, triangleTests: 0, triangleCorrections: 0 } };
  const totals = { before: { compute: 0, body: 0, triangle: 0, samples: 0 }, after: { compute: 0, body: 0, triangle: 0, samples: 0 } };
  for (let step = 1; step <= 690; step++) {
   for (const stage of step % 4 < 2 ? ['before', 'after'] : ['after', 'before']) {
    const fixture = stage === 'before' ? before : after, clock = stage === 'before' ? beforeTiming : afterTiming;
    fixture.prepareInputs(step); clock.beginBatch();
    const faceStart = faceTimes[stage]; const start = performance.now(); fixture.solve(step); const duration = performance.now() - start;
    const split = clock.finishBatch(duration);
    if (step > 90) { totals[stage].compute += duration; if (split) { totals[stage].body += split.phases.body; totals[stage].triangle += faceTimes[stage] - faceStart; totals[stage].samples++; for (const key of Object.keys(counts[stage])) counts[stage][key] += split.bodyTests[key]; } }
   }
  }
  self.postMessage({ result: { baseline: '15f268a', capes: ${Number(process.env.CAPE_VERTEX_CAPES ?? '5')}, warmup: 90, measured: 600, delta: 1/30,
   before: { compute: totals.before.compute/600, body: totals.before.body/totals.before.samples, triangle: totals.before.triangle/totals.before.samples, vertex: (totals.before.body - totals.before.triangle)/totals.before.samples },
   after: { compute: totals.after.compute/600, body: totals.after.body/totals.after.samples, triangle: totals.after.triangle/totals.after.samples, vertex: (totals.after.body - totals.after.triangle)/totals.after.samples },
   skin: bodyCandidateDebug.skin, counts, method: 'same-state paired ABBA ordering in a dedicated Chromium worker' } });
 } catch (error) { self.postMessage({error: String(error)}); }
 finally { before?.dispose(); after?.dispose(); }
};`);
  execFileSync('bun', ['build', join(root, 'entry.ts'), '--target=browser', `--outfile=${join(root, 'worker.js')}`], { windowsHide: true, env: { ...process.env, TEMP: root, TMP: root } });
  writeFileSync(join(root, 'index.html'), `<!doctype html><title>Body culling audit</title><script>const worker=new Worker('./worker.js');worker.onmessage=e=>{if(e.data.result)window.result=e.data.result;if(e.data.error)window.error=e.data.error;};worker.postMessage({});</script>`);
  server = createStaticServer(root); const port = await listen(server), debug = await reservePort();
  browser = spawn(process.env.CAPE_BROWSER_PATH ?? 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', [
   '--headless=new', '--no-sandbox', '--no-first-run', '--disable-background-networking', '--disable-component-update', '--disable-breakpad', '--disable-crash-reporter',
   '--disable-features=AutoDeElevate', `--user-data-dir=${join(root, 'profile')}`, `--remote-debugging-port=${debug}`, `http://127.0.0.1:${port}/`,
  ], { windowsHide: true, stdio: 'ignore', env: { ...process.env, TEMP: root, TMP: root } });
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debug}/json/list`, 40000);
  connection = await connectDebugger(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await waitForExpression(connection.command, 'window.result !== undefined || window.error !== undefined', 600000);
  const error = await evaluate(connection.command, 'window.error'); if (error) throw Error(error);
  const result = await evaluate(connection.command, '({...window.result,runtime:navigator.userAgent})');
  if (!(result.before.body > 0 && result.after.body > 0)) throw Error('Invalid phase clocks; both module clocks must record body time');
  mkdirSync('artifacts/vertex-only', { recursive: true }); writeFileSync(`artifacts/vertex-only/paired-${process.env.CAPE_VERTEX_CAPES ?? "5"}capes-${process.env.CAPE_VERTEX_SKIN ?? 'default'}.json`, JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
} finally {
 await runCleanupSteps([
  ['browser shutdown', async () => { if (!browser) return; try { await closeBrowserProcess(browser, connection); } catch (error) { await new Promise(resolve => setTimeout(resolve, 500)); if (browser.exitCode === null) throw error; console.warn('Browser already exited during taskkill; verified process exit:', browser.exitCode); } }],
  ['server shutdown', () => server && close(server)],
  ['temporary fixture/profile', () => { if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }); }],
 ]);
}
