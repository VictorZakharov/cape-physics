import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
const distRoot = resolve(process.env.CAPE_TRAJECTORY_DIST_ROOT ?? join(repositoryRoot, 'dist'));
if (!existsSync(join(distRoot, 'index.html'))) throw new Error(`Production build missing at ${distRoot}.`);

const outputPath = resolve(
  process.env.CAPE_TRAJECTORY_OUTPUT
    ?? join(repositoryRoot, 'artifacts', 'trajectories', 'webgl-webgpu.json'),
);
const requestedScenarios = (process.env.CAPE_TRAJECTORY_SCENARIOS
  ?? 'raised-drop,forward-start,forward-stop,reverse,back-and-forth,lightweight-stop')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const enforce = (process.env.CAPE_TRAJECTORY_ENFORCE ?? 'true').trim().toLowerCase() !== 'false';
const sampleEvery = Number.parseInt(process.env.CAPE_TRAJECTORY_SAMPLE_EVERY ?? '1', 10);
if (!Number.isInteger(sampleEvery) || sampleEvery < 1 || sampleEvery > 12) {
  throw new Error('CAPE_TRAJECTORY_SAMPLE_EVERY must be an integer from 1 to 12.');
}
const scenarioFrames = {
  'raised-drop': 120,
  'forward-start': 120,
  'forward-stop': 130,
  reverse: 130,
  'back-and-forth': 360,
  'lightweight-stop': 360,
};
for (const scenario of requestedScenarios) {
  if (!(scenario in scenarioFrames)) throw new Error(`Unknown cape trajectory scenario: ${scenario}`);
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

function particleDistance(first, second, offset) {
  return Math.hypot(
    first[offset] - second[offset],
    first[offset + 1] - second[offset + 1],
    first[offset + 2] - second[offset + 2],
  );
}

function summarizeMotion(report, transitionFrame) {
  let maximumParticleStep = 0;
  let maximumParticleAcceleration = 0;
  let maximumHemStep = 0;
  let transitionMaximumParticleStep = 0;
  let transitionMaximumParticleAcceleration = 0;
  let maximumCenterlineDeviation = 0;
  let centerlineDeviationTotal = 0;
  let postTransitionMaximumParticleStep = 0;
  let postTransitionMaximumParticleAcceleration = 0;
  let minimumPostTransitionHemDrop = Number.POSITIVE_INFINITY;
  let maximumPostTransitionLowerParticleHeight = Number.NEGATIVE_INFINITY;
  let maximumPostTransitionHorizontalOffset = 0;
  let maximumUpwardParticleStep = 0;
  let postTransitionMaximumUpwardParticleStep = 0;
  let maximumParticleStepDetail = null;
  let maximumParticleAccelerationDetail = null;
  const priorDisplacements = new Float64Array(report.samples[0]?.particles.length || 0);
  for (let sampleIndex = 1; sampleIndex < report.samples.length; sampleIndex += 1) {
    const previous = report.samples[sampleIndex - 1];
    const current = report.samples[sampleIndex];
    maximumCenterlineDeviation = Math.max(
      maximumCenterlineDeviation,
      current.centerlineDeviation,
    );
    centerlineDeviationTotal += current.centerlineDeviation;
    maximumHemStep = Math.max(maximumHemStep, Math.abs(current.hemDrop - previous.hemDrop));
    const inTransition = transitionFrame !== null
      && current.frame >= transitionFrame
      && current.frame <= transitionFrame + 18;
    const afterTransition = transitionFrame !== null && current.frame >= transitionFrame;
    if (afterTransition) {
      minimumPostTransitionHemDrop = Math.min(
        minimumPostTransitionHemDrop,
        current.hemDrop,
      );
      maximumPostTransitionLowerParticleHeight = Math.max(
        maximumPostTransitionLowerParticleHeight,
        current.maximumLowerParticleHeight,
      );
      maximumPostTransitionHorizontalOffset = Math.max(
        maximumPostTransitionHorizontalOffset,
        current.maximumLowerHorizontalOffset,
      );
    }
    const physicsSteps = Math.max(1, current.frame - previous.frame);
    for (let offset = 0; offset < current.particles.length; offset += 3) {
      const stepX = (current.particles[offset] - previous.particles[offset]) / physicsSteps;
      const stepY = (current.particles[offset + 1] - previous.particles[offset + 1]) / physicsSteps;
      const stepZ = (current.particles[offset + 2] - previous.particles[offset + 2]) / physicsSteps;
      const step = Math.hypot(stepX, stepY, stepZ);
      maximumUpwardParticleStep = Math.max(maximumUpwardParticleStep, stepY);
      if (afterTransition) {
        postTransitionMaximumUpwardParticleStep = Math.max(
          postTransitionMaximumUpwardParticleStep,
          stepY,
        );
      }
      const acceleration = Math.hypot(
        stepX - priorDisplacements[offset],
        stepY - priorDisplacements[offset + 1],
        stepZ - priorDisplacements[offset + 2],
      );
      if (step > maximumParticleStep) {
        maximumParticleStep = step;
        maximumParticleStepDetail = {
          frame: current.frame,
          particleIndex: offset / 3,
          displacement: [stepX, stepY, stepZ],
          solverMotion: current.particleMotion,
        };
      }
      if (acceleration > maximumParticleAcceleration) {
        maximumParticleAcceleration = acceleration;
        maximumParticleAccelerationDetail = {
          frame: current.frame,
          particleIndex: offset / 3,
          acceleration,
          solverMotion: current.particleMotion,
        };
      }
      if (inTransition) {
        transitionMaximumParticleStep = Math.max(transitionMaximumParticleStep, step);
        transitionMaximumParticleAcceleration = Math.max(
          transitionMaximumParticleAcceleration,
          acceleration,
        );
      }
      if (afterTransition) {
        postTransitionMaximumParticleStep = Math.max(
          postTransitionMaximumParticleStep,
          step,
        );
        postTransitionMaximumParticleAcceleration = Math.max(
          postTransitionMaximumParticleAcceleration,
          acceleration,
        );
      }
      priorDisplacements[offset] = stepX;
      priorDisplacements[offset + 1] = stepY;
      priorDisplacements[offset + 2] = stepZ;
    }
  }
  return {
    maximumParticleStep,
    maximumParticleStepDetail,
    maximumParticleAcceleration,
    maximumParticleAccelerationDetail,
    maximumHemStep,
    transitionMaximumParticleStep,
    transitionMaximumParticleAcceleration,
    postTransitionMaximumParticleStep,
    postTransitionMaximumParticleAcceleration,
    minimumPostTransitionHemDrop: Number.isFinite(minimumPostTransitionHemDrop)
      ? minimumPostTransitionHemDrop
      : 0,
    maximumPostTransitionLowerParticleHeight:
      Number.isFinite(maximumPostTransitionLowerParticleHeight)
        ? maximumPostTransitionLowerParticleHeight
        : 0,
    maximumPostTransitionHorizontalOffset,
    maximumUpwardParticleStep,
    postTransitionMaximumUpwardParticleStep,
    maximumCenterlineDeviation,
    averageCenterlineDeviation: centerlineDeviationTotal
      / Math.max(1, report.samples.length - 1),
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(`Cape trajectory audit failed: ${message}`);
}

function validateScenario(scenario, webgl, webgpu, comparison) {
  const { webglMotion, webgpuMotion, parity } = comparison;
  assert(parity.maximumPlayerPositionDifference < 0.000_001, `${scenario} player paths diverged`);
  assert(Number.isFinite(parity.particleRmsDistance), `${scenario} produced non-finite particles`);
  assert(
    webgpuMotion.transitionMaximumParticleStep
      <= Math.max(0.08, webglMotion.transitionMaximumParticleStep * 1.35),
    `${scenario} WebGPU transition stepped ${webgpuMotion.transitionMaximumParticleStep.toFixed(4)} m`,
  );
  assert(
    webgpuMotion.transitionMaximumParticleAcceleration
      <= Math.max(0.075, webglMotion.transitionMaximumParticleAcceleration * 2.5),
    `${scenario} WebGPU transition acceleration spiked to `
      + `${webgpuMotion.transitionMaximumParticleAcceleration.toFixed(4)} m/frame²`,
  );
  const finalGpu = webgpu.samples.at(-1);
  assert(finalGpu, `${scenario} has no WebGPU samples`);
  if (
    scenario !== 'raised-drop'
    && scenario !== 'lightweight-stop'
    && scenario !== 'back-and-forth'
  ) {
    assert(
      finalGpu.hemDrop >= 0.6 && finalGpu.hemDrop <= 1.7,
      `${scenario} ended with non-draping WebGPU hem drop ${finalGpu.hemDrop.toFixed(3)} m`,
    );
    assert(
      finalGpu.hemBackOffset >= 0.4 && finalGpu.hemBackOffset <= 1.75,
      `${scenario} ended with WebGPU trail ${finalGpu.hemBackOffset.toFixed(3)} m`,
    );
  }
  if (scenario === 'raised-drop') {
    assert(
      webgpuMotion.maximumParticleStep <= webglMotion.maximumParticleStep * 1.25,
      `raised cape dropped too abruptly (${webgpuMotion.maximumParticleStep.toFixed(4)} m/frame)`,
    );
    assert(
      finalGpu.hemDrop >= 0.39,
      `raised cape did not descend into a hanging pose (${finalGpu.hemDrop.toFixed(3)} m)`,
    );
  }
  if (scenario === 'reverse' || scenario === 'back-and-forth') {
    for (const [renderer, motion] of [
      ['WebGL', webglMotion],
      ['WebGPU', webgpuMotion],
    ]) {
      assert(
        motion.postTransitionMaximumParticleStep <= 0.11,
        `${scenario} ${renderer} carried an unstable `
          + `${motion.postTransitionMaximumParticleStep.toFixed(4)} m particle step`,
      );
      assert(
        motion.postTransitionMaximumParticleAcceleration <= 0.12,
        `${scenario} ${renderer} accelerated a particle by `
          + `${motion.postTransitionMaximumParticleAcceleration.toFixed(4)} m/frame²`,
      );
      assert(
        motion.postTransitionMaximumUpwardParticleStep <= 0.05,
        `${scenario} ${renderer} launched a particle upward by `
          + `${motion.postTransitionMaximumUpwardParticleStep.toFixed(4)} m/frame`,
      );
      assert(
        motion.maximumPostTransitionLowerParticleHeight <= 0.08,
        `${scenario} ${renderer} flipped the lower cape above the neckline`,
      );
      assert(
        motion.minimumPostTransitionHemDrop >= 0.68,
        `${scenario} ${renderer} lifted the hem to only `
          + `${motion.minimumPostTransitionHemDrop.toFixed(3)} m below the neckline`,
      );
    }
  }
  if (scenario === 'back-and-forth') {
    assert(
      finalGpu.hemDrop >= 1.4,
      `back-and-forth did not return to a hanging WebGPU pose (${finalGpu.hemDrop.toFixed(3)} m)`,
    );
    assert(
      finalGpu.maximumLowerHorizontalOffset <= 0.62,
      `back-and-forth left the WebGPU cape `
        + `${finalGpu.maximumLowerHorizontalOffset.toFixed(3)} m from its neckline`,
    );
    assert(
      webgpuMotion.averageCenterlineDeviation
        >= webglMotion.averageCenterlineDeviation * 0.75,
      'back-and-forth WebGPU motion lost the travelling cloth wave',
    );
  }
  if (scenario === 'lightweight-stop') {
    for (const [renderer, report] of [['WebGL', webgl], ['WebGPU', webgpu]]) {
      const final = report.samples.at(-1);
      assert(final, `lightweight-stop has no ${renderer} samples`);
      assert(
        final.hemDrop >= 1.05,
        `lightweight-stop ${renderer} stalled at ${final.hemDrop.toFixed(3)} m of drop`,
      );
      assert(
        final.maximumLowerHorizontalOffset <= 0.42,
        `lightweight-stop ${renderer} remained suspended `
          + `${final.maximumLowerHorizontalOffset.toFixed(3)} m from its neckline`,
      );
    }
  }
}

function compareReports(webgl, webgpu) {
  let squaredDistance = 0;
  let comparedParticles = 0;
  let maximumParticleDistance = 0;
  let maximumHemDropDifference = 0;
  let maximumPlayerPositionDifference = 0;
  const sampleCount = Math.min(webgl.samples.length, webgpu.samples.length);
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const glSample = webgl.samples[sampleIndex];
    const gpuSample = webgpu.samples[sampleIndex];
    maximumHemDropDifference = Math.max(
      maximumHemDropDifference,
      Math.abs(glSample.hemDrop - gpuSample.hemDrop),
    );
    maximumPlayerPositionDifference = Math.max(
      maximumPlayerPositionDifference,
      Math.hypot(...glSample.playerPosition.map((value, index) => value - gpuSample.playerPosition[index])),
    );
    for (let offset = 0; offset < glSample.particles.length; offset += 3) {
      const distance = particleDistance(glSample.particles, gpuSample.particles, offset);
      squaredDistance += distance * distance;
      comparedParticles += 1;
      maximumParticleDistance = Math.max(maximumParticleDistance, distance);
    }
  }
  return {
    samples: sampleCount,
    particleRmsDistance: Math.sqrt(squaredDistance / Math.max(1, comparedParticles)),
    maximumParticleDistance,
    maximumHemDropDifference,
    maximumPlayerPositionDifference,
  };
}

async function captureRenderer(renderer, staticPort) {
  const temporaryRoot = mkdtempSync(join(tmpdir(), `cape-trajectory-${renderer}-`));
  const debugPort = await reservePort();
  const pageUrl = `http://127.0.0.1:${staticPort}/?harness=1&renderer=${renderer}`;
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
    '--window-size=1280,720',
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
    if (!page?.webSocketDebuggerUrl) throw new Error('Browser did not expose the trajectory page.');
    debuggerConnection = await connectDebugger(page.webSocketDebuggerUrl);
    const { command } = debuggerConnection;
    await Promise.all([command('Runtime.enable'), command('Page.enable')]);
    await waitForExpression(command, 'window.__CAPE_DEMO__?.ready === true', 60_000);
    const diagnostics = await evaluate(command, 'window.__CAPE_DEMO__.getDiagnostics()');
    if (diagnostics.renderer.actual !== renderer) {
      throw new Error(`${renderer} requested but ${diagnostics.renderer.actual} is active.`);
    }
    const reports = {};
    for (const scenario of requestedScenarios) {
      reports[scenario] = await evaluate(
        command,
        `window.__CAPE_DEMO__.traceCapeScenario(${JSON.stringify({
          scenario,
          frames: scenarioFrames[scenario],
          sampleEvery,
        })})`,
      );
    }
    return reports;
  } catch (error) {
    throw new Error(`${renderer} trajectory capture failed: ${error.message}\n${browserLog}`);
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
    try {
      rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
    } catch (error) {
      console.warn(`Host denied temporary profile cleanup: ${error.message}`);
    }
  }
}

const server = createStaticServer(distRoot);
const staticPort = await listen(server);
try {
  const webgl = await captureRenderer('webgl', staticPort);
  const webgpu = await captureRenderer('webgpu', staticPort);
  const transitions = {
    'raised-drop': 0,
    'forward-start': 30,
    'forward-stop': 90,
    reverse: 90,
    'back-and-forth': 60,
    'lightweight-stop': 90,
  };
  const comparisons = Object.fromEntries(requestedScenarios.map((scenario) => [
    scenario,
    {
      webglMotion: summarizeMotion(webgl[scenario], transitions[scenario]),
      webgpuMotion: summarizeMotion(webgpu[scenario], transitions[scenario]),
      parity: compareReports(webgl[scenario], webgpu[scenario]),
    },
  ]));
  if (enforce) {
    for (const scenario of requestedScenarios) {
      validateScenario(scenario, webgl[scenario], webgpu[scenario], comparisons[scenario]);
    }
  }
  const result = {
    generatedAt: new Date().toISOString(),
    browser: browserExecutable,
    scenarios: requestedScenarios,
    enforced: enforce,
    sampleEvery,
    comparisons,
    traces: { webgl, webgpu },
  };
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ generatedAt: result.generatedAt, comparisons }, null, 2));
  console.log(`Cape trajectory report written to ${outputPath}`);
} finally {
  await close(server);
}
