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
const distRoot = resolve(process.env.CAPE_PROFILE_DIST_ROOT ?? join(repositoryRoot, 'dist'));
const rendererPreference = (process.env.CAPE_PROFILE_RENDERER ?? 'webgl').trim().toLowerCase();
if (rendererPreference !== 'webgl' && rendererPreference !== 'webgpu') {
  throw new Error('CAPE_PROFILE_RENDERER must be webgl or webgpu.');
}
const synchronizationInterval = Number.parseInt(
  process.env.CAPE_PROFILE_SYNC_INTERVAL ?? '12',
  10,
);
if (!Number.isInteger(synchronizationInterval) || synchronizationInterval < 1 || synchronizationInterval > 120) {
  throw new Error('CAPE_PROFILE_SYNC_INTERVAL must be an integer from 1 to 120.');
}
const gpuTimestamps = (process.env.CAPE_PROFILE_GPU_TIMESTAMPS ?? 'false').trim().toLowerCase() === 'true';
if (!existsSync(join(distRoot, 'index.html'))) {
  throw new Error(`Production build missing at ${distRoot}.`);
}

const durationSeconds = 12;
const frameStep = 1 / 144;
const expectedFrames = Math.round(durationSeconds / frameStep);
const outputPath = resolve(
  process.env.CAPE_PROFILE_OUTPUT
    ?? join(repositoryRoot, 'artifacts', 'performance', `${rendererPreference}.json`),
);

const programFilesX86 = process.env['ProgramFiles(x86)'];
const browserCandidates = [
  process.env.CAPE_EDGE_PATH,
  process.env.ProgramFiles && join(process.env.ProgramFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  programFilesX86 && join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  process.env.ProgramFiles && join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
].filter(Boolean);
const browserExecutable = browserCandidates.find(existsSync);
if (!browserExecutable) throw new Error('Edge or Chrome was not found; set CAPE_EDGE_PATH.');

const server = createStaticServer(distRoot);
const temporaryRoot = mkdtempSync(join(tmpdir(), 'cape-physics-profile-'));
const staticPort = await listen(server);
const debugPort = await reservePort();
const pageUrl = `http://127.0.0.1:${staticPort}/?harness=1&renderer=${rendererPreference}`
  + (gpuTimestamps ? '&gpuTimestamps=1' : '');
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
  `--user-data-dir=${join(temporaryRoot, 'browser-profile')}`,
  pageUrl,
], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });

let browserLog = '';
browser.stdout.on('data', (chunk) => { browserLog += chunk; });
browser.stderr.on('data', (chunk) => { browserLog += chunk; });
let debuggerConnection;

try {
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debugPort}/json/list`, 40_000);
  const page = targets.find((target) => target.type === 'page' && target.url.includes('harness=1'));
  if (!page?.webSocketDebuggerUrl) throw new Error('Headless browser did not expose the profile page.');
  debuggerConnection = await connectDebugger(page.webSocketDebuggerUrl);
  const { command } = debuggerConnection;
  await Promise.all([
    command('Runtime.enable'),
    command('Page.enable'),
    command('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    }),
  ]);
  await waitForExpression(command, 'window.__CAPE_DEMO__?.ready === true', 60_000);

  const startup = await evaluate(command, `(() => {
    const resources = performance.getEntriesByType('resource');
    const scripts = resources.filter((entry) => entry.initiatorType === 'script');
    return {
      readyMilliseconds: performance.now(),
      scriptTransferBytes: scripts.reduce((sum, entry) => sum + entry.transferSize, 0),
      scriptDecodedBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
      scriptResourceMilliseconds: scripts.reduce((sum, entry) => sum + entry.duration, 0),
    };
  })()`);

  const initial = await evaluate(command, 'window.__CAPE_DEMO__.getDiagnostics()');
  const activeRenderer = initial.renderer.actual ?? 'webgl';
  if (activeRenderer !== rendererPreference) {
    throw new Error(
      `${rendererPreference.toUpperCase()} was requested but ${activeRenderer.toUpperCase()} is active.`,
    );
  }

  await evaluate(command, `window.__CAPE_DEMO__.setPlayerPose(${JSON.stringify({
    position: [-2.38, 0, -15],
    yaw: 0,
  })})`);
  await evaluate(command, `window.__CAPE_DEMO__.setView(${JSON.stringify({
    yaw: 0,
    pitch: 0.2,
    distance: 4.4,
  })})`);
  await evaluate(command, 'window.__CAPE_DEMO__.advance({ duration: 0.45, frameStep: 1 / 120 })');
  await evaluate(command, 'window.__CAPE_DEMO__.setRunning(true)');
  await evaluate(command, 'window.__CAPE_DEMO__.setMovement(0, 1)');
  await evaluate(command, 'window.__CAPE_DEMO__.advance({ duration: 0.85, frameStep: 1 / 120 })');
  const profile = await evaluate(
    command,
    `window.__CAPE_DEMO__.profile(${JSON.stringify({
      duration: durationSeconds,
      frameStep,
      synchronizationInterval,
    })})`,
  );
  await evaluate(command, 'window.__CAPE_DEMO__.clearMovement()');
  await evaluate(command, 'window.__CAPE_DEMO__.setRunning(false)');

  if (profile.frames !== expectedFrames) {
    throw new Error(`Expected ${expectedFrames} profiled frames but received ${profile.frames}.`);
  }
  if (profile.programsAfter !== profile.programsBefore) {
    throw new Error('The profiled route compiled new shader programs after warm-up.');
  }

  const browserVersion = await command('Browser.getVersion');
  const result = {
    generatedAt: new Date().toISOString(),
    browser: {
      executable: browserExecutable,
      product: browserVersion.product,
      userAgent: browserVersion.userAgent,
    },
    renderer: {
      requested: rendererPreference,
      actual: activeRenderer,
      backend: initial.renderer.backend ?? 'Legacy WebGLRenderer',
      vendor: initial.renderer.vendor ?? 'Unavailable in legacy diagnostics',
      device: initial.renderer.device ?? 'Unavailable in legacy diagnostics',
      fallback: initial.renderer.fallback ?? false,
    },
    startup,
    workload: {
      route: 'warmed running traversal',
      viewport: '1600x900',
      devicePixelRatio: 1,
      quality: initial.quality.label,
      resolutionScale: initial.quality.scale,
      simulatedSeconds: durationSeconds,
      frames: profile.frames,
      frameStepSeconds: frameStep,
      synchronizationInterval,
      synchronization: gpuTimestamps
        ? `render + compute timestamp-query resolution every ${synchronizationInterval} frames`
        : activeRenderer === 'webgpu'
          ? `GPUQueue.onSubmittedWorkDone every ${synchronizationInterval} frames`
          : `WebGL finish every ${synchronizationInterval} frames`,
    },
    timing: {
      averageFrameMilliseconds: profile.averageFrameMilliseconds,
      p95FrameMilliseconds: profile.p95FrameMilliseconds,
      maximumFrameMilliseconds: profile.maximumFrameMilliseconds,
      averagePhysicsMilliseconds: profile.averagePhysicsMilliseconds,
      averageSceneMilliseconds: profile.averageSceneMilliseconds,
      averageSubmissionMilliseconds: profile.averageSubmissionMilliseconds,
      p95SubmissionMilliseconds: profile.p95SubmissionMilliseconds,
      maximumSubmissionMilliseconds: profile.maximumSubmissionMilliseconds,
      averageGpuRenderMilliseconds: profile.averageGpuRenderMilliseconds,
      p95GpuRenderMilliseconds: profile.p95GpuRenderMilliseconds,
      averageGpuComputeMilliseconds: profile.averageGpuComputeMilliseconds,
      p95GpuComputeMilliseconds: profile.p95GpuComputeMilliseconds,
      averageGpuTotalMilliseconds: profile.averageGpuTotalMilliseconds,
      p95GpuTotalMilliseconds: profile.p95GpuTotalMilliseconds,
      gpuTimestampSamples: profile.gpuTimestampSamples,
      synchronizedFramesPerSecond: 1_000 / profile.averageFrameMilliseconds,
    },
    rendererCounters: {
      drawCalls: profile.diagnostics.renderer.calls,
      triangles: profile.diagnostics.renderer.triangles,
      programsBefore: profile.programsBefore,
      programsAfter: profile.programsAfter,
    },
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  console.log(`Profile written to ${outputPath}`);
} catch (error) {
  throw new Error(`${error.message}\nHeadless browser log:\n${browserLog}`);
} finally {
  if (debuggerConnection) {
    await Promise.race([
      debuggerConnection.command('Browser.close').catch(() => undefined),
      delay(1_500),
    ]);
  }
  debuggerConnection?.socket.close();
  if (browser.exitCode === null) {
    await Promise.race([
      new Promise((resolveExit) => browser.once('exit', resolveExit)),
      delay(2_000),
    ]);
  }
  if (browser.exitCode === null) browser.kill();
  await close(server);
  try {
    rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
  } catch (error) {
    console.warn(`Host denied temporary profile cleanup: ${error.message}`);
  }
}
