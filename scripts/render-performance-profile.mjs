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
const cpuProfileEnabled = (process.env.CAPE_PROFILE_CPU_PROFILE ?? 'false')
  .trim()
  .toLowerCase() === 'true';
if (!existsSync(join(distRoot, 'index.html'))) {
  throw new Error(`Production build missing at ${distRoot}.`);
}

function numericSetting(name, fallback, minimum, maximum) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be a finite number from ${minimum} to ${maximum}.`);
  }
  return value;
}

const durationSeconds = numericSetting('CAPE_PROFILE_DURATION_SECONDS', 12, 1 / 144, 12);
const settleSeconds = numericSetting('CAPE_PROFILE_SETTLE_SECONDS', 0.45, 0, 2);
const runningWarmupSeconds = numericSetting('CAPE_PROFILE_RUNNING_WARMUP_SECONDS', 0.85, 0, 2);
const kernelProfileSamples = numericSetting('CAPE_PROFILE_KERNEL_SAMPLES', 0, 0, 16);
if (kernelProfileSamples > 0 && (!gpuTimestamps || rendererPreference !== 'webgpu')) {
  throw new Error('CAPE_PROFILE_KERNEL_SAMPLES requires WebGPU and GPU timestamps.');
}
const frameStep = 1 / 144;
const expectedFrames = Math.ceil(durationSeconds / frameStep - 0.000_000_1);
const outputPath = resolve(
  process.env.CAPE_PROFILE_OUTPUT
    ?? join(repositoryRoot, 'artifacts', 'performance', `${rendererPreference}.json`),
);

function summarizeCpuProfile(profile) {
  const nodeById = new Map(profile.nodes.map((node) => [node.id, node]));
  const selfMicroseconds = new Map();
  let totalMicroseconds = 0;
  for (let index = 0; index < profile.samples.length; index += 1) {
    const duration = profile.timeDeltas[index] ?? 0;
    const nodeId = profile.samples[index];
    totalMicroseconds += duration;
    selfMicroseconds.set(nodeId, (selfMicroseconds.get(nodeId) ?? 0) + duration);
  }
  const topSelf = [...selfMicroseconds.entries()]
    .map(([nodeId, duration]) => {
      const callFrame = nodeById.get(nodeId)?.callFrame;
      return {
        functionName: callFrame?.functionName || '(anonymous)',
        url: callFrame?.url || '',
        line: (callFrame?.lineNumber ?? -1) + 1,
        column: (callFrame?.columnNumber ?? -1) + 1,
        selfMilliseconds: duration / 1_000,
        selfPercent: totalMicroseconds > 0 ? duration / totalMicroseconds * 100 : 0,
      };
    })
    .sort((first, second) => second.selfMilliseconds - first.selfMilliseconds)
    .slice(0, 40);
  return {
    samplingIntervalMicroseconds: 100,
    samples: profile.samples.length,
    sampledMilliseconds: totalMicroseconds / 1_000,
    topSelf,
  };
}

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
    const scripts = resources.filter((entry) => {
      try {
        return new URL(entry.name, window.location.href).pathname.endsWith('.js');
      } catch {
        return false;
      }
    });
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
  await evaluate(
    command,
    `window.__CAPE_DEMO__.advance(${JSON.stringify({
      duration: settleSeconds,
      frameStep: 1 / 120,
    })})`,
  );
  await evaluate(command, 'window.__CAPE_DEMO__.setRunning(true)');
  await evaluate(command, 'window.__CAPE_DEMO__.setMovement(0, 1)');
  await evaluate(
    command,
    `window.__CAPE_DEMO__.advance(${JSON.stringify({
      duration: runningWarmupSeconds,
      frameStep: 1 / 120,
    })})`,
  );
  if (cpuProfileEnabled) {
    await command('Profiler.enable');
    await command('Profiler.setSamplingInterval', { interval: 100 });
    await command('Profiler.start');
  }
  const profile = await evaluate(
    command,
    `window.__CAPE_DEMO__.profile(${JSON.stringify({
      duration: durationSeconds,
      frameStep,
      synchronizationInterval,
      includeDiagnostics: !cpuProfileEnabled,
    })})`,
  );
  const cpuProfile = cpuProfileEnabled
    ? summarizeCpuProfile((await command('Profiler.stop')).profile)
    : null;
  if (profile.diagnostics === null) {
    profile.diagnostics = await evaluate(command, 'window.__CAPE_DEMO__.getDiagnostics()');
  }
  const gpuKernelBreakdown = kernelProfileSamples > 0
    ? await evaluate(
      command,
      `window.__CAPE_DEMO__.profileGpuKernels(${JSON.stringify({
        samples: kernelProfileSamples,
      })})`,
    )
    : null;
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
      scenePhaseMilliseconds: profile.scenePhaseMilliseconds,
      synchronizedFramesPerSecond: 1_000 / profile.averageFrameMilliseconds,
    },
    rendererCounters: {
      drawCalls: profile.diagnostics.renderer.calls,
      triangles: profile.diagnostics.renderer.triangles,
      programsBefore: profile.programsBefore,
      programsAfter: profile.programsAfter,
    },
    gpuKernelBreakdown,
    cpuProfile,
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
