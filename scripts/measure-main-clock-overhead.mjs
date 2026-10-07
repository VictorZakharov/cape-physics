import { spawn, execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { closeBrowserProcess, connectDebugger, evaluate, fetchJsonWithRetry, reservePort, runCleanupSteps, waitForExpression } from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'main-clock-browser-'));
let browser, connection, server;
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  const fixture = resolve('scripts/audit/cloth-fixture.ts').replaceAll('\\', '/');
  writeFileSync(join(root, 'entry.ts'), `
import { CapeSimulation } from './src/physics/CapeSimulation';
import { MainThreadPhaseTelemetry } from './src/core/MainThreadPhaseTelemetry';
import { workerStepTiming } from './src/physics/WorkerStepTiming';
import { registerStaticWorldColliderIndex } from './src/physics/StaticWorldColliderIndex';
import { serializeCapeAnchors, serializeCapsuleEndpoints } from './src/physics/CapeWorkerProtocol';
import { createClothFixture } from '${fixture}';
self.onmessage = () => {
 let plain, observed;
 try {
  workerStepTiming.isWorker = true; workerStepTiming.enabled = false;
  plain = createClothFixture(CapeSimulation, 51, false); observed = createClothFixture(CapeSimulation, 51, false);
  registerStaticWorldColliderIndex(plain.worldColliders); registerStaticWorldColliderIndex(observed.worldColliders);
  const observer = new MainThreadPhaseTelemetry(); observer.reset(0, 0);
  const totals = { plain: 0, observed: 0 }, checksums = { plain: 0, observed: 0 };
  for (let frame = 1; frame <= 690; frame++) {
   for (const stage of frame % 4 < 2 ? ['plain', 'observed'] : ['observed', 'plain']) {
    const fixture = stage === 'plain' ? plain : observed, clock = stage === 'plain' ? undefined : observer;
    const timestamp = frame * 1000 / 60;
    if (frame === 91 && clock) clock.reset(timestamp, 0);
    const start = performance.now(); clock?.beginFrame(timestamp);
    for (let substep = 0; substep < 2; substep++) {
      const step = (frame - 1) * 2 + substep + 1;
      let phaseStart = clock?.begin() ?? 0;
      fixture.prepareInputs(step, 1/120); clock?.end(1, phaseStart);
      phaseStart = clock?.begin() ?? 0;
      fixture.solveCape(fixture.bots[0], step, 1/120); clock?.end(0, phaseStart);
      phaseStart = clock?.begin() ?? 0;
      for (let index = 1; index < fixture.bots.length; index++) {
        const character = fixture.bots[index].character;
        const anchors = serializeCapeAnchors(character.getCapeAnchors()), endpoints = serializeCapsuleEndpoints(character.getCapeColliders());
        checksums[stage] += anchors.left[0] + endpoints[0];
      }
      clock?.end(2, phaseStart);
    }
    clock?.finishFrame(timestamp, performance.now() - start);
    if (frame % 15 === 0) clock?.getSnapshot(timestamp);
    const duration = performance.now() - start;
    if (frame > 90) totals[stage] += duration;
   }
   const old = plain.bots[0].simulation.positions, current = observed.bots[0].simulation.positions;
   for (let particle = 0; particle < 234; particle++) {
     if (!Object.is(old[particle].x, current[particle].x) || !Object.is(old[particle].y, current[particle].y) || !Object.is(old[particle].z, current[particle].z)) throw Error('Observer changed a particle');
   }
  }
  const before = totals.plain / 600, after = totals.observed / 600;
  if (!Object.is(checksums.plain, checksums.observed)) throw Error('Observer changed input data');
  self.postMessage({ result: { warmup: 90, callbacks: 600, physicsStepsPerCallback: 2, controllers: 51, cpuCapes: 1, packedBotInputs: 50,
    withoutObserverMilliseconds: before, withObserverMilliseconds: after, overheadMilliseconds: after - before, overheadPercent: (after / before - 1) * 100,
    phases: observer.getSnapshot(690 * 1000 / 60), bitIdentical: true,
    method: 'ABBA paired Chromium CPU fixture, identical paths, two 120Hz steps per callback, player solving plus 51 controllers and 50 input packs; observer samples every fourth callback, snapshots every 15 callbacks; no async worker results or rendering' } });
 } catch (error) { self.postMessage({error: String(error)}); }
 finally { plain?.dispose(); observed?.dispose(); }
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
  mkdirSync('artifacts/vertex-only', { recursive: true }); writeFileSync('artifacts/vertex-only/main-clock-overhead.json', JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
} finally {
 await runCleanupSteps([
  ['browser shutdown', async () => { if (!browser) return; try { await closeBrowserProcess(browser, connection); } catch (error) { await new Promise(resolve => setTimeout(resolve, 500)); if (browser.exitCode === null) throw error; console.warn('Browser already exited during taskkill; verified process exit:', browser.exitCode); } }],
  ['server shutdown', () => server && close(server)],
  ['temporary fixture/profile', () => { if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }); }],
 ]);
}
