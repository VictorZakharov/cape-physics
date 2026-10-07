import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { closeBrowserProcess, connectDebugger, evaluate, fetchJsonWithRetry, reservePort, runCleanupSteps, waitForExpression } from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';

const parent = resolve('artifacts/.tmp');
mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'live-cape-profile-'));
const renderer = process.env.CAPE_PROFILE_RENDERER ?? 'webgl';
const duration = Number(process.env.CAPE_PROFILE_LIVE_SECONDS ?? 8);
const warmup = Number(process.env.CAPE_PROFILE_LIVE_WARMUP_SECONDS ?? 3);
let browser, connection, server;
try {
  if (!['webgl', 'webgpu'].includes(renderer)) throw Error('CAPE_PROFILE_RENDERER must be webgl or webgpu.');
  if (!Number.isFinite(duration) || duration < 1 || duration > 30) throw Error('CAPE_PROFILE_LIVE_SECONDS must be between 1 and 30.');
  if (!Number.isFinite(warmup) || warmup < 0 || warmup > 60) throw Error('CAPE_PROFILE_LIVE_WARMUP_SECONDS must be between 0 and 60.');
  cpSync(resolve(process.env.CAPE_PROFILE_DIST_ROOT ?? 'dist'), join(root, 'dist'), { recursive: true });
  const assets = join(root, 'dist', 'assets');
  // The disposable fixture can serve either production or Pages output locally.
  for (const name of ['index.html', ...readdirSync(assets).filter((name) => name.endsWith('.js')).map((name) => join('assets', name))]) {
    const file = join(root, 'dist', name);
    writeFileSync(file, readFileSync(file, 'utf8').replaceAll('/cape-physics/', '/'));
  }
  const asset = readdirSync(assets).find((name) => /^CapeDemo-.*\.js$/.test(name));
  if (!asset) throw Error('Build the production bundle before profiling.');
  const path = join(assets, asset);
  const source = readFileSync(path, 'utf8');
  if (!source.includes('installHarness(){')) throw Error('Cannot expose the local profiling fixture.');
  writeFileSync(path, source.replace('installHarness(){', 'installHarness(){window.__CAPE_INTERNAL__=this;'));
  server = createStaticServer(join(root, 'dist'));
  const port = await listen(server), debug = await reservePort();
  browser = spawn(process.env.CAPE_BROWSER_PATH ?? 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-sandbox', '--disable-gpu-sandbox', '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-component-update', '--disable-breakpad', '--disable-crash-reporter', '--disable-gpu-shader-disk-cache',
    '--disable-skia-graphite', '--disable-features=AutoDeElevate,CalculateNativeWinOcclusion,AutofillAiServerModel,WebGPUBlobCache',
    '--enable-webgl', '--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--window-size=1600,900',
    `--user-data-dir=${join(root, 'profile')}`, `--remote-debugging-port=${debug}`,
    `http://127.0.0.1:${port}/?harness=1&renderer=${renderer}${process.env.CAPE_PROFILE_WORKERS ? `&workers=${Number(process.env.CAPE_PROFILE_WORKERS)}` : ''}`,
  ], { windowsHide: true, stdio: 'ignore', env: { ...process.env, TEMP: root, TMP: root } });
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debug}/json/list`, 40000);
  connection = await connectDebugger(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  if (process.env.CAPE_PROFILE_THREADS && !/^[1-9][0-9]?$/.test(process.env.CAPE_PROFILE_THREADS)) throw Error('Invalid logical core override');
  if(process.env.CAPE_PROFILE_THREADS) {
    await connection.command('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(navigator,'hardwareConcurrency',{value:${Number(process.env.CAPE_PROFILE_THREADS)}})`});
    await connection.command('Page.reload');
  }
  console.log(`Waiting for ${renderer} scene (${process.env.CAPE_PROFILE_WORKERS ?? 'automatic'} workers)`);
  await waitForExpression(connection.command, `window.__CAPE_DEMO__?.ready === true || document.querySelector('[data-loading-error]')?.hidden === false`, 90000);
  if (!await evaluate(connection.command, 'window.__CAPE_DEMO__?.ready === true')) throw Error(await evaluate(connection.command, `document.querySelector('[data-loading-error-detail]')?.textContent ?? 'Scene startup failed'`));
  await evaluate(connection.command, `(async()=>{
    const demo=window.__CAPE_INTERNAL__;
    await window.__CAPE_DEMO__.setBotCount(50);
    window.__CAPE_DEMO__.setMovement(0, 1);
    demo.clock.reset(performance.now());
    window.__CAPE_WARMUP_EVIDENCE__ = demo.performance.getSnapshot();
    await demo.pipeline.renderer.setAnimationLoop(demo.frame);
    await new Promise(resolve=>setTimeout(resolve,${warmup * 1000}));
  })()`);
  const result = await evaluate(connection.command, `(async()=>{
    const demo=window.__CAPE_INTERNAL__;
    await new Promise(resolve=>setTimeout(resolve,${duration * 1000}));
    await demo.pipeline.renderer.setAnimationLoop(null);
    let report;
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{report=text;}}});
    await demo.performance.copyPerformanceReport();
    const row = document.querySelector('[data-sim-workers]');
    const original = row.innerHTML;
    const workerWidth = {scroll:row.scrollWidth,client:row.clientWidth};
    const numericColors = [...document.querySelectorAll('[data-worker-phases] b')].slice(0,2).map(node=>getComputedStyle(node).color);
    const heights = [];
    try {
      for (const text of ['SIM WORKERS: 10 / COMPUTE\\n9.99 MS/STEP @ 9.9 HZ\\nDT 9.99 MS / 9.9% BUSY\\n16-17 CAPES PER WORKER\\n3,744-3,978 PTCL PER WORKER',
        'SIM WORKERS: 10 / COMPUTE\\n100.00 MS/STEP @ 100.0 HZ\\nDT 33.33 MS / 100.0% BUSY\\n16-17 CAPES PER WORKER\\n3,744-3,978 PTCL PER WORKER']) {
        row.textContent = text;
        heights.push(row.getBoundingClientRect().height);
      }
    } finally { row.innerHTML = original; }
    return {report,diagnostics:demo.getPerformanceReportDetails(),
      warmupReset:window.__CAPE_WARMUP_EVIDENCE__, workerRowHeights:heights, workerWidth, numericColors, panelBounds: (()=>{const panel=document.querySelector('[data-performance-panel]');const box=panel.getBoundingClientRect();return {width:box.width,height:box.height,viewportHeight:innerHeight,phaseScrollWidth:document.querySelector('[data-worker-phases]').scrollWidth,phaseClientWidth:document.querySelector('[data-worker-phases]').clientWidth};})()};
  })()`);
  await evaluate(connection.command, 'window.__CAPE_INTERNAL__.pipeline.synchronizeForLocalProfile()');
  const output=resolve('artifacts/performance-instrumentation');mkdirSync(output,{recursive:true});
  const stage=(process.env.CAPE_EVIDENCE_STAGE??'before')+(process.env.CAPE_PROFILE_THREADS?'-'+process.env.CAPE_PROFILE_THREADS+'threads':'')+(process.env.CAPE_PROFILE_WORKERS?'-'+process.env.CAPE_PROFILE_WORKERS+'workers':'');
  if (!/^[a-z0-9-]+$/.test(stage)) throw Error('Invalid evidence stage');
  writeFileSync(join(output,`${stage}-${renderer}.txt`),result.report+'\n');
  writeFileSync(join(output,`${stage}-${renderer}.json`),JSON.stringify({ ...result.diagnostics, measurementChecks: { warmupReset: result.warmupReset, workerRowHeights: result.workerRowHeights, panelBounds:result.panelBounds, workerWidth:result.workerWidth, numericColors:result.numericColors } },null,2)+'\n');
  console.log(result.report);
} catch (error) {
  console.error(error);
  throw error;
} finally {
  await runCleanupSteps([
    ['browser shutdown', () => browser && closeBrowserProcess(browser, connection)],
    ['server shutdown', () => server && close(server)],
    ['temporary fixture and profile', () => {
      if(!root.startsWith(parent+sep))throw Error('Unexpected temporary path');
      rmSync(root,{recursive:true,force:true,maxRetries:8,retryDelay:250});
    }],
  ]);
}
