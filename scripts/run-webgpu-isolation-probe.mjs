import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  closeBrowserProcess,
  connectDebugger,
  delay,
  evaluate,
  fetchJsonWithRetry,
  reservePort,
  runCleanupSteps,
  waitForExpression,
} from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'dist');
const temporaryParent = join(repositoryRoot, 'artifacts', '.tmp');
if (!existsSync(join(distRoot, 'index.html'))) {
  throw new Error('Production build missing. Run bun run build before probe:webgpu.');
}

const programFilesX86 = process.env['ProgramFiles(x86)'];
const browserCandidates = [
  process.env.CAPE_PROBE_BROWSER_PATH,
  process.env.CAPE_EDGE_PATH,
  process.env.ProgramFiles
    && join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  programFilesX86
    && join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  process.env.ProgramFiles
    && join(process.env.ProgramFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  programFilesX86
    && join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
].filter(Boolean);
const browserExecutable = browserCandidates.find(existsSync);
if (!browserExecutable) {
  throw new Error('Edge or Chrome was not found; set CAPE_PROBE_BROWSER_PATH.');
}

const workload = (process.env.CAPE_PROBE_WORKLOAD ?? 'app-cape').trim().toLowerCase();
if (!['minimal', 'three-cloth', 'app-cape'].includes(workload)) {
  throw new Error('CAPE_PROBE_WORKLOAD must be minimal, three-cloth, or app-cape.');
}

function assert(condition, message) {
  if (!condition) throw new Error(`WebGPU isolation probe invariant failed: ${message}`);
}

function relevantEvents(events, levels = ['error']) {
  return [...new Set(events.flatMap(({ method, params }) => {
    if (method === 'Runtime.exceptionThrown') {
      return [`exception: ${params.exceptionDetails?.exception?.description
        ?? params.exceptionDetails?.text}`];
    }
    if (method === 'Log.entryAdded' && levels.includes(params.entry?.level)) {
      return [`${params.entry?.source} ${params.entry?.level}: ${params.entry?.text}`];
    }
    return [];
  }))].slice(0, 20).map((message) => message.slice(0, 4_000));
}

mkdirSync(temporaryParent, { recursive: true });
const temporaryRoot = mkdtempSync(join(temporaryParent, 'webgpu-isolation-probe-'));
const server = createStaticServer(distRoot);
const staticPort = await listen(server);
const debugPort = await reservePort();
const profile = join(temporaryRoot, 'browser-profile');
const pageUrl = `http://127.0.0.1:${staticPort}/?webgpuProbe=1&probeWorkload=${workload}`;
const browser = spawn(browserExecutable, [
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-background-mode',
  '--disable-background-networking',
  '--disable-breakpad',
  '--disable-crash-reporter',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-extensions',
  '--disable-gpu-shader-disk-cache',
  '--disable-skia-graphite',
  '--disable-sync',
  '--disable-features=CalculateNativeWinOcclusion,AutofillAiServerModel,WebGPUBlobCache',
  '--enable-gpu',
  '--ignore-gpu-blocklist',
  '--use-angle=d3d11',
  '--force-device-scale-factor=1',
  '--window-size=900,700',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  '--profile-directory=WebGpuIsolationProbe',
  pageUrl,
], {
  windowsHide: true,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, TEMP: temporaryRoot, TMP: temporaryRoot },
});

let browserLog = '';
browser.stdout.on('data', (chunk) => { browserLog += chunk; });
browser.stderr.on('data', (chunk) => { browserLog += chunk; });
let debuggerConnection;
let debuggerEvents = [];
let lastReport = null;

try {
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debugPort}/json/list`, 30_000);
  const page = targets.find((target) => (
    target.type === 'page' && target.url.includes('webgpuProbe=1')
  ));
  if (!page?.webSocketDebuggerUrl) {
    throw new Error('Headless browser did not expose the WebGPU probe page.');
  }
  debuggerConnection = await connectDebugger(page.webSocketDebuggerUrl);
  const { command, events } = debuggerConnection;
  debuggerEvents = events;
  await Promise.all([
    command('Runtime.enable'),
    command('Log.enable'),
    command('Page.enable'),
  ]);
  await waitForExpression(
    command,
    'window.__WEBGPU_ISOLATION_PROBE__?.getReport().status === "idle"',
    20_000,
  );
  const initialReport = await evaluate(
    command,
    'window.__WEBGPU_ISOLATION_PROBE__.getReport()',
  );
  assert(initialReport.workload === workload, 'page selected the wrong diagnostic workload');
  assert(initialReport.stages.length === 0, 'the page touched the GPU before explicit start');
  assert(initialReport.cleanup.deviceDestroyed === false, 'the idle report claimed a device existed');

  await evaluate(command, `(() => {
    document.querySelector('[data-probe-start]').click();
    return true;
  })()`);
  await waitForExpression(
    command,
    '["passed", "failed", "stopped"].includes(window.__WEBGPU_ISOLATION_PROBE__?.getReport().status)',
    50_000,
  );
  await delay(500);
  lastReport = await evaluate(command, 'window.__WEBGPU_ISOLATION_PROBE__.getReport()');

  const expectedStages = [
    'request-adapter',
    'request-minimal-device',
    'load-three-webgpu-module',
    'initialize-empty-renderer',
    'compile-and-submit-one-cube',
    'wait-for-submitted-work',
    ...(workload === 'three-cloth' ? [
      'load-three-reference-cloth-modules',
      'build-three-reference-cloth',
      'submit-one-three-reference-cloth-step',
      'compile-and-submit-three-reference-cloth-frame',
      'wait-for-three-reference-cloth-work',
    ] : workload === 'app-cape' ? [
      'load-application-cape-module',
      'build-application-cape-graph',
      'submit-one-application-cape-step',
      'wait-for-application-cape-compute',
      'compile-and-submit-application-cape-position-frame',
      'compile-and-submit-application-cape-frame',
      'wait-for-application-cape-work',
    ] : []),
  ];
  assert(lastReport.status === 'passed', `probe ended as ${lastReport.status}`);
  assert(
    JSON.stringify(lastReport.stages.map(({ name }) => name)) === JSON.stringify(expectedStages),
    `unexpected stages: ${lastReport.stages.map(({ name }) => name).join(', ')}`,
  );
  assert(lastReport.stages.every(({ status }) => status === 'passed'), 'a probe stage failed');
  assert(lastReport.stages.every(({ milliseconds }) => milliseconds <= 10_500), 'a stage exceeded its deadline');
  assert(lastReport.uncapturedErrors.length === 0, 'WebGPU emitted an uncaptured error');
  if (workload === 'app-cape') {
    assert(
      lastReport.workloadMetrics.applicationCapeDispatchNodes > 0,
      'application cape reported no dispatch nodes',
    );
    assert(
      lastReport.workloadMetrics.applicationCapeUniqueComputeNodes > 0
        && lastReport.workloadMetrics.applicationCapeUniqueComputeNodes
          <= lastReport.workloadMetrics.applicationCapeDispatchNodes,
      'application cape reported invalid unique compute-node metrics',
    );
  }
  assert(lastReport.cleanup.rendererDisposed, 'Three.js renderer was not disposed');
  assert(lastReport.cleanup.deviceDestroyed, 'external GPUDevice was not destroyed');
  assert(lastReport.cleanup.canvasReleased, 'probe canvas was not released');
  assert(
    lastReport.deviceLost === null || lastReport.deviceLost.reason === 'destroyed',
    `unexpected device loss: ${JSON.stringify(lastReport.deviceLost)}`,
  );
  const scrollLayout = await evaluate(command, `(() => {
    const root = document.documentElement;
    const before = window.scrollY;
    window.scrollTo(0, root.scrollHeight);
    const after = window.scrollY;
    return {
      before,
      after,
      scrollHeight: root.scrollHeight,
      viewportHeight: window.innerHeight,
      htmlOverflowY: getComputedStyle(root).overflowY,
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      appOverflow: getComputedStyle(document.querySelector('[data-app]')).overflow,
    };
  })()`);
  assert(
    scrollLayout.scrollHeight <= scrollLayout.viewportHeight || scrollLayout.after > 0,
    `overflowing probe page cannot scroll: ${JSON.stringify(scrollLayout)}`,
  );
  assert(scrollLayout.htmlOverflowY === 'auto', 'document root does not permit vertical scrolling');
  assert(scrollLayout.bodyOverflowY === 'auto', 'document body does not permit vertical scrolling');
  assert(scrollLayout.appOverflow === 'visible', 'shared app shell still clips the probe');
  assert(relevantEvents(debuggerEvents).length === 0, 'browser logged an exception or error');

  console.log('WebGPU isolated lifecycle probe: PASS');
  console.log(JSON.stringify(lastReport, null, 2));
} catch (error) {
  throw new Error(
    `${error.message}\nProbe report:\n${JSON.stringify(lastReport, null, 2)}`
      + `\nHeadless browser log:\n${browserLog}`
      + `\nPage diagnostics:\n${relevantEvents(debuggerEvents, ['error', 'warning']).join('\n')}`,
    { cause: error },
  );
} finally {
  await runCleanupSteps([
    ['browser shutdown', () => closeBrowserProcess(browser, debuggerConnection)],
    ['static server shutdown', () => close(server)],
    ['temporary browser profile', async () => {
      rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
      if (existsSync(temporaryRoot)) throw new Error(`Directory remains: ${temporaryRoot}`);
    }],
  ]);
}
