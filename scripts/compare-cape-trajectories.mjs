import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  closeBrowserProcess,
  connectDebugger,
  evaluate,
  fetchJsonWithRetry,
  reservePort,
  runCleanupSteps,
  waitForExpression,
} from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';
import {
  measureAverageCenterlineShapeChange,
  validateNecklineAttachment,
  validateTravellingWave,
} from './cape-trajectory-invariants.mjs';
import { CAPE } from '../src/config.ts';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporaryParent = join(repositoryRoot, 'artifacts', '.tmp');
const trajectoryInvariantsPath = fileURLToPath(
  new URL('./cape-trajectory-invariants.mjs', import.meta.url),
);
const validationSourcePaths = [
  ...readdirSync(join(repositoryRoot, 'src', 'physics'))
    .filter((name) => name.endsWith('.ts'))
    .map((name) => join(repositoryRoot, 'src', 'physics', name)),
  join(repositoryRoot, 'src', 'CapeDemo.ts'),
  fileURLToPath(import.meta.url),
  trajectoryInvariantsPath,
].sort();
const validationSourceHash = validationSourcePaths.reduce(
  (hash, path) => hash
    .update(relative(repositoryRoot, path).replaceAll('\\', '/'))
    .update('\0')
    .update(readFileSync(path))
    .update('\0'),
  createHash('sha256'),
).digest('hex');
const distRoot = resolve(process.env.CAPE_TRAJECTORY_DIST_ROOT ?? join(repositoryRoot, 'dist'));
if (!existsSync(join(distRoot, 'index.html'))) throw new Error(`Production build missing at ${distRoot}.`);

const outputPath = resolve(
  process.env.CAPE_TRAJECTORY_OUTPUT
    ?? join(repositoryRoot, 'artifacts', 'trajectories', 'webgl-webgpu.json'),
);
const requestedScenarios = (process.env.CAPE_TRAJECTORY_SCENARIOS
  ?? 'raised-drop,falling-forward-start,forward-start,forward-stop,reverse,back-and-forth,lightweight-stop')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const enforce = (process.env.CAPE_TRAJECTORY_ENFORCE ?? 'true').trim().toLowerCase() !== 'false';
const sampleEvery = Number.parseInt(process.env.CAPE_TRAJECTORY_SAMPLE_EVERY ?? '1', 10);
if (!Number.isInteger(sampleEvery) || sampleEvery < 1 || sampleEvery > 12) {
  throw new Error('CAPE_TRAJECTORY_SAMPLE_EVERY must be an integer from 1 to 12.');
}
const packedBatchBots = Number.parseInt(process.env.CAPE_TRAJECTORY_BATCH_BOTS ?? '2', 10);
if (!Number.isInteger(packedBatchBots) || packedBatchBots < 1 || packedBatchBots > 10) {
  throw new Error('CAPE_TRAJECTORY_BATCH_BOTS must be an integer from 1 to 10.');
}
const scenarioFrames = {
  'raised-drop': 120,
  'falling-forward-start': 180,
  'forward-start': 300,
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
  process.env.CAPE_BROWSER_PATH,
  process.env.ProgramFiles && join(process.env.ProgramFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  programFilesX86 && join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
  process.env.CAPE_EDGE_PATH,
  process.env.ProgramFiles && join(process.env.ProgramFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  programFilesX86 && join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
].filter(Boolean);
const browserExecutable = browserCandidates.find(existsSync);
if (!browserExecutable) throw new Error('Chrome or Edge was not found; set CAPE_BROWSER_PATH.');
const deferredCleanupErrors = [];

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
  let maximumRowTwistRange = 0;
  let rowTwistRangeTotal = 0;
  let maximumNecklineAttachmentError = 0;
  let maximumBodyPenetration = 0;
  let maximumStructuralError = 0;
  let minimumSelfSeparation = Number.POSITIVE_INFINITY;
  let maximumUpwardFold = 0;
  let minimumLowerCapeSpanRatio = Number.POSITIVE_INFINITY;
  let maximumLowerCapeRowCurlRatio = 0;
  let postTransitionMaximumParticleStep = 0;
  let postTransitionMaximumParticleAcceleration = 0;
  let minimumPostTransitionHemDrop = Number.POSITIVE_INFINITY;
  let maximumPostTransitionLowerParticleHeight = Number.NEGATIVE_INFINITY;
  let maximumPostTransitionHorizontalOffset = 0;
  let maximumUpwardParticleStep = 0;
  let transitionMaximumUpwardParticleStep = 0;
  let postTransitionMaximumUpwardParticleStep = 0;
  let maximumParticleStepDetail = null;
  let maximumParticleAccelerationDetail = null;
  const priorDisplacements = new Float64Array(report.samples[0]?.particles.length || 0);
  for (const sample of report.samples) {
    maximumCenterlineDeviation = Math.max(
      maximumCenterlineDeviation,
      sample.centerlineDeviation,
    );
    centerlineDeviationTotal += sample.centerlineDeviation;
    maximumRowTwistRange = Math.max(maximumRowTwistRange, sample.rowTwistRange);
    rowTwistRangeTotal += sample.rowTwistRange;
    maximumNecklineAttachmentError = Math.max(
      maximumNecklineAttachmentError,
      sample.maximumNecklineAttachmentError,
    );
    maximumBodyPenetration = Math.max(maximumBodyPenetration, sample.maximumBodyPenetration);
    maximumStructuralError = Math.max(maximumStructuralError, sample.maximumStructuralError);
    minimumSelfSeparation = Math.min(minimumSelfSeparation, sample.minimumSelfSeparation);
    maximumUpwardFold = Math.max(maximumUpwardFold, sample.maximumUpwardFold);
    minimumLowerCapeSpanRatio = Math.min(minimumLowerCapeSpanRatio, sample.lowerCapeSpanRatio);
    maximumLowerCapeRowCurlRatio = Math.max(
      maximumLowerCapeRowCurlRatio,
      sample.lowerCapeRowCurlRatio,
    );
  }
  for (let sampleIndex = 1; sampleIndex < report.samples.length; sampleIndex += 1) {
    const previous = report.samples[sampleIndex - 1];
    const current = report.samples[sampleIndex];
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
      if (inTransition) {
        transitionMaximumUpwardParticleStep = Math.max(
          transitionMaximumUpwardParticleStep,
          stepY,
        );
      }
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
    transitionMaximumUpwardParticleStep,
    postTransitionMaximumUpwardParticleStep,
    maximumCenterlineDeviation,
    maximumRowTwistRange,
    averageRowTwistRange: rowTwistRangeTotal / Math.max(1, report.samples.length),
    maximumNecklineAttachmentError,
    maximumBodyPenetration,
    maximumStructuralError,
    minimumSelfSeparation: Number.isFinite(minimumSelfSeparation) ? minimumSelfSeparation : 0,
    maximumUpwardFold,
    minimumLowerCapeSpanRatio: Number.isFinite(minimumLowerCapeSpanRatio)
      ? minimumLowerCapeSpanRatio
      : 0,
    maximumLowerCapeRowCurlRatio,
    averageCenterlineDeviation: centerlineDeviationTotal / Math.max(1, report.samples.length),
    averageCenterlineShapeChange: measureAverageCenterlineShapeChange({
      samples: report.samples,
      columns: CAPE.columns,
      rows: CAPE.rows,
      startFrame: transitionFrame ?? Number.NEGATIVE_INFINITY,
    }),
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
  const finalGl = webgl.samples.at(-1);
  const finalGpu = webgpu.samples.at(-1);
  assert(finalGl, `${scenario} has no WebGL samples`);
  assert(finalGpu, `${scenario} has no WebGPU samples`);
  for (const [renderer, motion] of [
    ['WebGL', webglMotion],
    ['WebGPU', webgpuMotion],
  ]) {
    validateNecklineAttachment({
      scenario,
      renderer,
      maximumError: motion.maximumNecklineAttachmentError,
    });
    assert(
      motion.maximumBodyPenetration <= 0.01,
      `${scenario} ${renderer} penetrated the animated body by `
        + `${motion.maximumBodyPenetration.toFixed(4)} m`,
    );
    assert(
      motion.maximumStructuralError <= 0.1,
      `${scenario} ${renderer} stretched a structural link by `
        + `${motion.maximumStructuralError.toFixed(4)} m`,
    );
    assert(
      motion.minimumSelfSeparation >= 0.045,
      `${scenario} ${renderer} collapsed self-separation to `
        + `${motion.minimumSelfSeparation.toFixed(4)} m`,
    );
    assert(
      motion.maximumUpwardFold <= (
        scenario === 'raised-drop' || scenario === 'falling-forward-start' ? 0.23 : 0.08
      ),
      `${scenario} ${renderer} folded upward by ${motion.maximumUpwardFold.toFixed(4)} m`,
    );
    assert(
      motion.maximumLowerCapeRowCurlRatio <= 0.22,
      `${scenario} ${renderer} left a curled lower row `
        + `(${motion.maximumLowerCapeRowCurlRatio.toFixed(3)})`,
    );
  }
  if (scenario === 'forward-start') {
    assert(
      finalGpu.hemDrop >= Math.max(1.05, finalGl.hemDrop * 0.78),
      `forward-start WebGPU remained too horizontal (${finalGpu.hemDrop.toFixed(3)} m drop)`,
    );
    assert(
      finalGpu.hemBackOffset <= finalGl.hemBackOffset + 0.3,
      `forward-start WebGPU trailed ${finalGpu.hemBackOffset.toFixed(3)} m behind`,
    );
    assert(
      finalGpu.maximumLowerHorizontalOffset <= 1.15,
      `forward-start WebGPU held a Superman pose `
        + `${finalGpu.maximumLowerHorizontalOffset.toFixed(3)} m from the neckline`,
    );
  }
  if (scenario === 'falling-forward-start') {
    for (const [renderer, motion] of [
      ['WebGL', webglMotion],
      ['WebGPU', webgpuMotion],
    ]) {
      assert(
        motion.transitionMaximumUpwardParticleStep <= 0.035,
        `falling-forward-start ${renderer} reversed downward momentum by `
          + `${motion.transitionMaximumUpwardParticleStep.toFixed(4)} m/frame`,
      );
    }
  }
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
    validateTravellingWave({
      scenario,
      webglAverageRowTwist: webglMotion.averageRowTwistRange,
      webgpuAverageRowTwist: webgpuMotion.averageRowTwistRange,
      webglAverageShapeChange: webglMotion.averageCenterlineShapeChange,
      webgpuAverageShapeChange: webgpuMotion.averageCenterlineShapeChange,
    });
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
        motion.minimumPostTransitionHemDrop >= 0.6,
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
        >= Math.max(0.05, webglMotion.averageCenterlineDeviation * 0.45),
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

function summarizePackedBatch(report) {
  const capeCount = report.botCount + 1;
  const maximumNecklineAttachmentErrors = Array(capeCount).fill(0);
  const maximumLocalParticleSteps = Array(capeCount).fill(0);
  const previousParticles = Array(capeCount).fill(null);
  for (const sample of report.samples) {
    assert(
      sample.capes.length === capeCount,
      `packed WebGPU batch returned ${sample.capes.length} capes instead of ${capeCount}`,
    );
    for (const cape of sample.capes) {
      const capeIndex = cape.capeIndex;
      assert(capeIndex >= 0 && capeIndex < capeCount, `packed WebGPU lane ${capeIndex} is invalid`);
      assert(
        cape.particles.length === CAPE.columns * CAPE.rows * 3,
        `packed WebGPU lane ${capeIndex} returned an incomplete particle grid`,
      );
      assert(
        cape.particles.every(Number.isFinite),
        `packed WebGPU lane ${capeIndex} produced non-finite particles`,
      );
      maximumNecklineAttachmentErrors[capeIndex] = Math.max(
        maximumNecklineAttachmentErrors[capeIndex],
        cape.maximumNecklineAttachmentError,
      );
      const previous = previousParticles[capeIndex];
      if (previous) {
        for (let offset = CAPE.columns * 3; offset < cape.particles.length; offset += 3) {
          maximumLocalParticleSteps[capeIndex] = Math.max(
            maximumLocalParticleSteps[capeIndex],
            particleDistance(previous, cape.particles, offset),
          );
        }
      }
      previousParticles[capeIndex] = cape.particles;
    }
  }
  return {
    capeCount,
    samples: report.samples.length,
    maximumNecklineAttachmentErrors,
    maximumLocalParticleSteps,
  };
}

function validatePackedBatch(summary) {
  assert(summary.samples >= 2, 'packed WebGPU batch did not produce enough samples');
  summary.maximumNecklineAttachmentErrors.forEach((maximumError, capeIndex) => {
    validateNecklineAttachment({
      scenario: `packed-batch lane ${capeIndex}`,
      renderer: 'WebGPU',
      maximumError,
    });
  });
  summary.maximumLocalParticleSteps.forEach((maximumStep, capeIndex) => {
    assert(
      Number.isFinite(maximumStep) && maximumStep >= 0.001,
      `packed WebGPU lane ${capeIndex} remained frozen (${maximumStep} m local step)`,
    );
  });
}

async function captureRenderer(renderer, staticPort) {
  mkdirSync(temporaryParent, { recursive: true });
  const configuredRoot = process.env[
    `CAPE_TRAJECTORY_${renderer.toUpperCase()}_PROFILE_ROOT`
  ];
  const temporaryRoot = configuredRoot
    ? resolve(configuredRoot)
    : mkdtempSync(join(temporaryParent, `cape-trajectory-${renderer}-`));
  if (!temporaryRoot.toLowerCase().startsWith(`${temporaryParent.toLowerCase()}\\`)) {
    throw new Error(`Trajectory profile root must stay under ${temporaryParent}: ${temporaryRoot}`);
  }
  mkdirSync(temporaryRoot, { recursive: true });
  const debugPort = await reservePort();
  const pageUrl = `http://127.0.0.1:${staticPort}/?harness=1&renderer=${renderer}`;
  const browser = spawn(browserExecutable, [
    '--headless=new',
    // This local-only harness loads the repository build with background
    // networking disabled. On Windows, Chromium's sandbox gives generated
    // profile files ACLs that the launching account cannot remove afterward.
    '--no-sandbox',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-breakpad',
    '--disable-crash-reporter',
    '--disable-gpu-shader-disk-cache',
    '--disable-skia-graphite',
    '--disable-features=CalculateNativeWinOcclusion,AutofillAiServerModel,WebGPUBlobCache',
    '--enable-webgl',
    '--enable-gpu',
    '--ignore-gpu-blocklist',
    '--use-angle=d3d11',
    '--force-device-scale-factor=1',
    '--window-size=1280,720',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${join(temporaryRoot, 'browser-profile')}`,
    '--profile-directory=CapeHarness',
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
  try {
    const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debugPort}/json/list`, 40_000);
    const page = targets.find((target) => target.type === 'page' && target.url.includes('harness=1'));
    if (!page?.webSocketDebuggerUrl) throw new Error('Browser did not expose the trajectory page.');
    debuggerConnection = await connectDebugger(page.webSocketDebuggerUrl);
    const { command } = debuggerConnection;
    await Promise.all([
      command('Runtime.enable'),
      command('Page.enable'),
      command('Log.enable'),
    ]);
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
    if (renderer === 'webgpu') {
      reports.packedBatch = await evaluate(
        command,
        `window.__CAPE_DEMO__.tracePackedCapeBatch(${JSON.stringify({
          bots: packedBatchBots,
          frames: 90,
          sampleEvery: 6,
        })})`,
      );
    }
    return reports;
  } catch (error) {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    const runtimeLog = (debuggerConnection?.events ?? [])
      .filter((event) => (
        event.method === 'Runtime.consoleAPICalled'
        || event.method === 'Runtime.exceptionThrown'
        || event.method === 'Log.entryAdded'
      ))
      .map((event) => {
        if (event.method === 'Runtime.consoleAPICalled') {
          return (event.params?.args ?? [])
            .map((argument) => argument.value ?? argument.description ?? '')
            .join(' ');
        }
        if (event.method === 'Runtime.exceptionThrown') {
          return event.params?.exceptionDetails?.exception?.description
            ?? event.params?.exceptionDetails?.text
            ?? '';
        }
        return event.params?.entry?.text ?? '';
      })
      .filter(Boolean)
      .join('\n');
    throw new Error(
      `${renderer} trajectory capture failed: ${error.message}`
      + `${runtimeLog ? `\nRuntime diagnostics:\n${runtimeLog}` : ''}`
      + `\n${browserLog}`,
    );
  } finally {
    try {
      await runCleanupSteps([
        ['browser shutdown', () => closeBrowserProcess(browser, debuggerConnection)],
        ['temporary browser profile', async () => {
          rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
          if (existsSync(temporaryRoot)) throw new Error(`Directory remains: ${temporaryRoot}`);
        }],
      ]);
    } catch (error) {
      deferredCleanupErrors.push(error);
      console.error(`${renderer} cleanup failed: ${error.message}`);
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
    'falling-forward-start': 30,
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
  const packedBatch = summarizePackedBatch(webgpu.packedBatch);
  const result = {
    generatedAt: new Date().toISOString(),
    validationReceipt: {
      sourceHashAlgorithm: 'sha256',
      sourceHash: validationSourceHash,
      sourceFiles: validationSourcePaths.map(
        (path) => relative(repositoryRoot, path).replaceAll('\\', '/'),
      ),
      passed: false,
    },
    browser: browserExecutable,
    scenarios: requestedScenarios,
    enforced: enforce,
    sampleEvery,
    packedBatch,
    comparisons,
    traces: { webgl, webgpu },
  };
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  let validationError;
  if (enforce) {
    try {
      for (const scenario of requestedScenarios) {
        validateScenario(scenario, webgl[scenario], webgpu[scenario], comparisons[scenario]);
      }
      validatePackedBatch(packedBatch);
      result.validationReceipt.passed = true;
      writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      validationError = error;
    }
  }
  console.log(JSON.stringify({ generatedAt: result.generatedAt, comparisons }, null, 2));
  console.log(`Cape trajectory report written to ${outputPath}`);
  if (validationError || deferredCleanupErrors.length > 0) {
    throw new AggregateError(
      [validationError, ...deferredCleanupErrors].filter(Boolean),
      'Cape trajectory audit failed.',
    );
  }
} finally {
  await close(server);
}
