import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  connectDebugger,
  delay,
  evaluate,
  fetchJsonWithRetry,
  reservePort,
  waitForExpression,
} from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(repositoryRoot, 'dist');
const outputRoot = join(repositoryRoot, 'artifacts', 'visual-audit');
if (!existsSync(join(distRoot, 'index.html'))) {
  throw new Error('Production build missing. Run bun run build before audit:visual.');
}
mkdirSync(outputRoot, { recursive: true });

const programFilesX86 = process.env['ProgramFiles(x86)'];
const browserCandidates = [
  process.env.CAPE_EDGE_PATH,
  process.env.ProgramFiles && join(process.env.ProgramFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  programFilesX86 && join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  process.env.ProgramFiles && join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
].filter(Boolean);
const browserExecutable = browserCandidates.find(existsSync);
if (!browserExecutable) throw new Error('Edge or Chrome was not found; set CAPE_EDGE_PATH for the visual harness.');

function assert(condition, message) {
  if (!condition) throw new Error(`Visual audit invariant failed: ${message}`);
}

const server = createStaticServer(distRoot);
const temporaryRoot = mkdtempSync(join(tmpdir(), 'cape-physics-audit-'));
const staticPort = await listen(server);
const debugPort = await reservePort();
const profile = join(temporaryRoot, 'browser-profile');
const pageUrl = `http://127.0.0.1:${staticPort}/?harness=1`;
const browser = spawn(browserExecutable, [
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-background-networking',
  '--disable-breakpad',
  '--disable-crash-reporter',
  '--disable-features=CalculateNativeWinOcclusion',
  '--enable-webgl',
  '--enable-gpu',
  '--ignore-gpu-blocklist',
  '--use-angle=d3d11',
  '--force-device-scale-factor=1',
  '--window-size=1600,900',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  pageUrl,
], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });

let browserLog = '';
browser.stdout.on('data', (chunk) => { browserLog += chunk; });
browser.stderr.on('data', (chunk) => { browserLog += chunk; });
let debuggerConnection;

try {
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debugPort}/json/list`, 40_000);
  const page = targets.find((target) => target.type === 'page' && target.url.includes('harness=1'));
  if (!page?.webSocketDebuggerUrl) throw new Error('Headless browser did not expose the audit page.');
  debuggerConnection = await connectDebugger(page.webSocketDebuggerUrl);
  const { command, events } = debuggerConnection;
  await Promise.all([
    command('Runtime.enable'),
    command('Log.enable'),
    command('Page.enable'),
    command('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    }),
  ]);
  await waitForExpression(command, 'window.__CAPE_DEMO__?.ready === true', 60_000);
  await evaluate(command, `(() => {
    const style = document.createElement('style');
    style.textContent = '.performance-panel,.controls,.title-card,.quality-badge,.onboarding,.loading,.film-grain{display:none!important}';
    document.head.append(style);
    return true;
  })()`);

  const captureOptions = {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  };
  const captures = [];
  const capture = async (name) => {
    const screenshot = await command('Page.captureScreenshot', captureOptions);
    const frame = Buffer.from(screenshot.data, 'base64');
    writeFileSync(join(outputRoot, `${name}.png`), frame);
    captures.push(name);
    return frame;
  };
  const diagnostics = () => evaluate(command, 'window.__CAPE_DEMO__.getDiagnostics()');
  const setView = (yaw, pitch, distance) => evaluate(
    command,
    `window.__CAPE_DEMO__.setView(${JSON.stringify({ yaw, pitch, distance })})`,
  );
  const setCameraPose = (position, target) => evaluate(
    command,
    `window.__CAPE_DEMO__.setCameraPose(${JSON.stringify({ position, target })})`,
  );
  const setMovement = (horizontal, forward) => evaluate(
    command,
    `window.__CAPE_DEMO__.setMovement(${horizontal}, ${forward})`,
  );
  const advance = (duration, frameStep = 1 / 60) => evaluate(
    command,
    `window.__CAPE_DEMO__.advance(${JSON.stringify({ duration, frameStep })})`,
  );

  const initial = await diagnostics();
  assert(initial.ready, 'demo harness did not report ready');
  assert(initial.water.puddles === 5, 'procedural puddles are missing');
  assert(initial.water.drops >= 10, 'ceiling drips are missing');
  await advance(1.2);
  await setView(0.08, 0.22, 4.5);
  await capture('rear-cape');

  await setView(1.33, 0.16, 4.35);
  await capture('side-cape');

  // Movement is camera-relative. Reset from the side-study camera to the
  // forward traversal heading before exercising the W input path.
  await setView(0.08, 0.22, 4.5);
  const beforeWalk = await diagnostics();
  await setMovement(0, 1);
  await advance(1.72, 1 / 120);
  await setMovement(0, 0);
  await advance(0.18, 1 / 120);
  const afterWalk = await setView(0.18, 0.46, 4.65);
  assert(afterWalk.player.position[2] < beforeWalk.player.position[2] - 4, 'W movement did not traverse the cave');
  assert(afterWalk.player.inWater, 'visual traversal did not stop inside the first puddle');
  assert(afterWalk.water.footstepRipples >= 2, 'walking did not emit footstep ripples');
  assert(afterWalk.cape.maximumStructuralError < 0.04, 'cape constraints drifted during visual traversal');
  assert(
    Math.abs(afterWalk.cape.hemCenter[2] - beforeWalk.cape.hemCenter[2]) > 1,
    'cape hem did not respond dynamically to traversal',
  );
  await capture('water-footsteps');

  const beforeDrips = await diagnostics();
  const dynamicBefore = await capture('water-dynamic-before');
  await advance(2.6, 1 / 120);
  const afterDrips = await diagnostics();
  const dynamicAfter = await capture('water-dynamic-after');
  assert(afterDrips.water.dripRipples > beforeDrips.water.dripRipples, 'natural drops emitted no new ripples');
  assert(!dynamicBefore.equals(dynamicAfter), 'water and torch render did not change across simulated time');
  const settledRepeat = await capture('water-dynamic-settled-repeat');
  assert(dynamicAfter.equals(settledRepeat), 'a paused deterministic frame changed without simulation advancing');

  await setMovement(0, 1);
  await advance(1.72, 1 / 120);
  await setMovement(0, 0);
  await advance(0.2, 1 / 120);
  const mineralState = await diagnostics();
  assert(mineralState.player.position[2] < 1.5, 'visual traversal did not reach the first mineral formation');
  const mineralTarget = mineralState.minerals.clusters[0];
  assert(mineralTarget?.length === 3, 'primary mineral inspection target is missing');
  await setCameraPose(
    [mineralTarget[0] + 5, mineralTarget[1] + 0.85, mineralTarget[2] + 4.4],
    mineralTarget,
  );
  await capture('mineral-veins');

  await setView(Math.PI, 0.15, 4.2);
  await capture('front-character');

  const runtimeFailures = events.filter((event) => (
    event.method === 'Runtime.exceptionThrown'
    || event.method === 'Inspector.targetCrashed'
    || (event.method === 'Log.entryAdded' && event.params.entry.level === 'error')
  ));
  assert(runtimeFailures.length === 0, `browser runtime errors: ${JSON.stringify(runtimeFailures)}`);

  const final = await diagnostics();
  const manifest = {
    generatedAt: new Date().toISOString(),
    browser: browserExecutable,
    captures,
    initial,
    beforeWalk,
    afterWalk,
    beforeDrips,
    afterDrips,
    final,
  };
  writeFileSync(join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Cape Physics visual audit: PASS (${captures.length} frames)`);
  console.log(`Ripple emissions: ${initial.water.rippleEmissions} -> ${final.water.rippleEmissions}`);
  console.log(`Output: ${outputRoot}`);
} catch (error) {
  throw new Error(`${error.message}\nHeadless browser log:\n${browserLog}`);
} finally {
  debuggerConnection?.socket.close();
  browser.kill();
  if (browser.exitCode === null) {
    await Promise.race([
      new Promise((resolve) => browser.once('exit', resolve)),
      delay(1_500),
    ]);
  }
  await close(server);
  try {
    rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 12, retryDelay: 200 });
  } catch (error) {
    console.warn(`Temporary audit profile will be removed later: ${error.message}`);
  }
}
