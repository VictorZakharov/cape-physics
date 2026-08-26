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

function numericSetting(name, fallback, minimum, maximum) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be a finite number from ${minimum} to ${maximum}.`);
  }
  return value;
}

const profileDurationSeconds = numericSetting('CAPE_AUDIT_PROFILE_SECONDS', 12, 2, 12);
const p95FrameBudget = numericSetting('CAPE_AUDIT_P95_BUDGET_MS', 120, 1, 1_000);
const maximumFrameBudget = numericSetting('CAPE_AUDIT_MAX_FRAME_BUDGET_MS', 750, 1, 5_000);

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
    window.__COPIED_CAPE_PERFORMANCE_REPORT__ = null;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__COPIED_CAPE_PERFORMANCE_REPORT__ = text;
        },
      },
    });
    document.querySelector('[data-performance-panel]')?.click();
    return true;
  })()`);
  await waitForExpression(
    command,
    'typeof window.__COPIED_CAPE_PERFORMANCE_REPORT__ === "string"',
    5_000,
  );
  const copiedPerformanceReport = await evaluate(
    command,
    'window.__COPIED_CAPE_PERFORMANCE_REPORT__',
  );
  assert(copiedPerformanceReport.includes('Cape Physics performance report'), 'FPS panel copied no diagnostic report');
  assert(copiedPerformanceReport.includes('Renderer:'), 'copied performance report omitted renderer data');
  assert(copiedPerformanceReport.includes('Scene:'), 'copied performance report omitted scene data');
  const copyFeedback = await evaluate(
    command,
    'document.querySelector("[data-performance-copy]")?.textContent?.trim()',
  );
  assert(copyFeedback === 'COPIED 15S REPORT', 'FPS panel did not show successful copy feedback');
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
  const setPlayerPose = (position, yaw = 0) => evaluate(
    command,
    `window.__CAPE_DEMO__.setPlayerPose(${JSON.stringify({ position, yaw })})`,
  );
  const setMovement = (horizontal, forward) => evaluate(
    command,
    `window.__CAPE_DEMO__.setMovement(${horizontal}, ${forward})`,
  );
  const setRunning = (running) => evaluate(
    command,
    `window.__CAPE_DEMO__.setRunning(${running})`,
  );
  const pressSpace = async () => {
    const keyEvent = {
      key: ' ',
      code: 'Space',
      windowsVirtualKeyCode: 32,
      nativeVirtualKeyCode: 32,
    };
    await command('Input.dispatchKeyEvent', { type: 'keyDown', ...keyEvent });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', ...keyEvent });
  };
  const advance = (duration, frameStep = 1 / 60) => evaluate(
    command,
    `window.__CAPE_DEMO__.advance(${JSON.stringify({ duration, frameStep })})`,
  );
  const profile = (duration, frameStep = 1 / 60) => evaluate(
    command,
    `window.__CAPE_DEMO__.profile(${JSON.stringify({ duration, frameStep })})`,
  );
  const dragOrbit = async (button, fromY, toY) => {
    const buttons = button === 'left' ? 1 : 2;
    await command('Input.dispatchMouseEvent', {
      type: 'mousePressed', x: 800, y: fromY, button, buttons, clickCount: 1,
    });
    await command('Input.dispatchMouseEvent', {
      type: 'mouseMoved', x: 800, y: toY, button, buttons,
    });
    await command('Input.dispatchMouseEvent', {
      type: 'mouseReleased', x: 800, y: toY, button, buttons: 0, clickCount: 1,
    });
  };

  const initial = await diagnostics();
  assert(initial.ready, 'demo harness did not report ready');
  assert(
    Math.abs(initial.camera.initialProjectionAspect - initial.camera.initialViewportAspect) < 0.000_001,
    'camera projection did not match the viewport on the first frame',
  );
  assert(
    Math.abs(initial.camera.aspect - initial.camera.viewportAspect) < 0.000_001,
    'camera projection did not track the current viewport',
  );
  assert(initial.water.puddles === 5, 'procedural puddles are missing');
  assert(initial.water.drops >= 10, 'ceiling drips are missing');
  assert(initial.torches.lights.visibleLights === initial.torches.lights.lights, 'torch light pool is not compile-stable');
  assert(initial.minerals.lights.visibleLights === initial.minerals.lights.lights, 'mineral light pool is not compile-stable');
  assert(initial.cape.worldColliders >= 1_800, 'geometry-derived cave-object collision proxies are missing');
  assert(initial.cave.contactRocks.length === 6, 'mixed-size cape contact rock course is missing');
  assert(
    initial.cave.contactRocks.some(({ size }) => size === 'large')
      && initial.cave.contactRocks.some(({ size }) => size === 'small'),
    'cape contact course lost its large/small size range',
  );
  assert(
    initial.cave.contactRocks.every(({ size, walkable }) => walkable === (size === 'small')),
    'large contact rocks do not block the player or small rocks are not walkable',
  );
  assert(
    initial.cave.contactRocks.every(({ openLaneWidth }) => openLaneWidth > 0.93),
    'cape contact course blocks a player-width traversal lane',
  );
  assert(initial.cape.maximumBodyPenetration < 0.002, 'pinned cape neckline starts inside the character');
  assert(initial.player.capeAttachment.meshes === 2, 'batched shoulder yoke or cape ties are missing');
  assert(initial.player.capeAttachment.maximumAnchorGap < 0.001, 'rendered cape attachment does not overlap both simulation anchors');
  assert(initial.water.surfaceAlphaRange[1] <= 0.6, 'water surface is too opaque');
  assert(initial.water.minimumInteriorDepth > 0.04, 'water is not seated inside a terrain basin');
  assert(initial.water.minimumRimClearance > 0.02, 'water surface rises above its containing rim');

  await command('Emulation.setDeviceMetricsOverride', {
    width: 3840,
    height: 2160,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await evaluate(command, 'window.dispatchEvent(new Event("resize")); true');
  await delay(120);
  const highDensity = await diagnostics();
  assert(
    Math.abs(highDensity.camera.aspect - highDensity.camera.viewportAspect) < 0.000_001,
    'camera projection did not track the high-density viewport resize',
  );
  assert(highDensity.renderer.sizing.renderPixels <= 3_600_000, 'high-density render targets exceeded their memory budget');
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate(command, 'window.dispatchEvent(new Event("resize")); true');
  await delay(120);
  await advance(1.2);

  await setView(0.08, 0, 4.5);
  const leftDragBefore = await diagnostics();
  await dragOrbit('left', 470, 280);
  const sharpLookUp = await advance(0.04, 1 / 120);
  assert(sharpLookUp.camera.pitch < leftDragBefore.camera.pitch - 0.55, 'LMB upward drag was not reversed');
  assert(sharpLookUp.camera.groundClearance >= 0.17, 'sharp look-up put the camera through the cave floor');
  await capture('camera-sharp-look-up');

  await setView(0.08, 0, 4.5);
  const rightDragBefore = await diagnostics();
  await dragOrbit('right', 310, 430);
  const rightDragAfter = await advance(0.04, 1 / 120);
  assert(rightDragAfter.camera.pitch > rightDragBefore.camera.pitch + 0.3, 'RMB downward drag was not reversed');

  const closeCamera = await setView(0.08, -0.82, 1.15);
  assert(closeCamera.camera.distance >= 0.45, 'close orbit collapsed into the player');
  assert(closeCamera.camera.groundClearance >= 0.17, 'close orbit fell through the ground');
  assert(closeCamera.player.opacity >= 0.11 && closeCamera.player.opacity < 0.5, 'player did not become sufficiently transparent near the camera');
  await capture('camera-close-fade');

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
  assert(afterWalk.cape.maximumBodyPenetration < 0.002, 'cape penetrated the animated character');
  assert(afterWalk.cape.maximumEnvironmentPenetration < 0.002, 'cape penetrated the cave during visual traversal');
  assert(afterWalk.cape.maximumEnvironmentFacePenetration < 0.002, 'a cave object pierced a cape triangle during visual traversal');
  assert(afterWalk.cape.hemBackOffset < 0.75, 'walking pulled the cape into a running-length trail');
  assert(
    Math.abs(afterWalk.cape.hemCenter[2] - beforeWalk.cape.hemCenter[2]) > 1,
    'cape hem did not respond dynamically to traversal',
  );
  await capture('water-footsteps');

  await setCameraPose(
    [afterWalk.player.position[0] + 2.35, afterWalk.player.position[1] + 0.72, afterWalk.player.position[2] + 1.65],
    [afterWalk.player.position[0], afterWalk.player.position[1] + 0.04, afterWalk.player.position[2]],
  );
  await capture('water-smooth-close');
  await setCameraPose(
    [afterWalk.player.position[0] + 3.1, afterWalk.player.position[1] + 0.28, afterWalk.player.position[2] + 1.35],
    [afterWalk.player.position[0], afterWalk.player.position[1] - 0.07, afterWalk.player.position[2]],
  );
  await capture('water-contained-basin');

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

  // Keep the locomotion airflow baseline independent from the deliberate rock
  // contact course below. Otherwise collision drag correctly shortens the cape
  // and makes a clean walk-versus-run trail comparison meaningless.
  await setPlayerPose([-2.38, 0, -15], 0);
  await setView(0, 0.2, 4.4);
  await advance(0.45, 1 / 120);
  await setRunning(true);
  await setMovement(0, 1);
  const runState = await advance(0.85, 1 / 120);
  assert(runState.player.running, 'Shift running state did not engage');
  assert(runState.player.speed > 5.5, 'running did not exceed walking speed');
  assert(runState.player.gait.runningBlend > 0.85, 'running gait animation did not engage');
  assert(
    runState.cape.hemBackOffset > afterWalk.cape.hemBackOffset + 0.5,
    'running did not produce a materially stronger cape trail than walking',
  );
  await setView(1.18, 0.12, 4.1);
  await capture('character-running');
  const frameProfile = await profile(profileDurationSeconds, 1 / 144);
  await setMovement(0, 0);
  await setRunning(false);
  console.log(
    `144 Hz profile: ${frameProfile.frames} frames, `
    + `${frameProfile.averageFrameMilliseconds.toFixed(2)} ms avg, `
    + `${frameProfile.p95FrameMilliseconds.toFixed(2)} ms p95, `
    + `${frameProfile.maximumFrameMilliseconds.toFixed(2)} ms max`,
  );
  const expectedProfileFrames = Math.round(profileDurationSeconds * 144);
  assert(frameProfile.frames === expectedProfileFrames, '144 Hz traversal did not render every requested frame');
  assert(frameProfile.programsAfter === frameProfile.programsBefore, 'light traversal compiled new shader programs');
  assert(
    frameProfile.p95FrameMilliseconds < p95FrameBudget,
    `rendered p95 ${frameProfile.p95FrameMilliseconds.toFixed(2)} ms exceeded ${p95FrameBudget} ms`,
  );
  assert(
    frameProfile.maximumFrameMilliseconds < maximumFrameBudget,
    `rendered maximum ${frameProfile.maximumFrameMilliseconds.toFixed(2)} ms exceeded ${maximumFrameBudget} ms`,
  );
  assert(frameProfile.diagnostics.cape.maximumBodyPenetration < 0.002, 'cape penetrated the body during profiled traversal');
  assert(frameProfile.diagnostics.cape.maximumEnvironmentFacePenetration < 0.002, 'a formation pierced a cape face during profiled traversal');

  await setView(1.33, 0.16, 4.35);
  await setMovement(0, -1);
  await advance(0.9, 1 / 120);
  await setMovement(0, 0);
  const wrapState = await advance(0.12, 1 / 120);
  assert(wrapState.cape.maximumBodyPenetration < 0.002, 'cape penetrated the body during visual reversal');
  await capture('cape-wrap-reversal');

  const settledCape = await advance(3.2, 1 / 120);
  await setView(0.08, 0.2, 4.25);
  await capture('cape-wrap-settled');
  assert(
    settledCape.cape.maximumBodyPenetration < 0.002,
    `settled cape penetrated the character (${settledCape.cape.maximumBodyPenetration.toFixed(5)} m; `
      + `${JSON.stringify(settledCape.cape.bodyPenetrationByCollider)})`,
  );
  assert(settledCape.cape.maximumEnvironmentPenetration < 0.002, 'settled cape penetrated cave geometry');
  assert(settledCape.cape.minimumSelfSeparation > 0.05, 'settled cape collapsed through itself');
  assert(settledCape.cape.hemDrop > 0.72, 'cape retained a physically impossible inverted resting pose');
  assert(settledCape.cape.minimumLowerCapeDrop > 0.48, 'a lower cape panel remained suspended in mid-air');
  assert(
    settledCape.cape.maximumLowerCapeLateralOffset < 0.18,
    `settled cape remained swept sideways (${settledCape.cape.maximumLowerCapeLateralOffset.toFixed(4)} m; `
      + `${settledCape.cape.worldContacts.lastStep} contacts; sleeping=${settledCape.cape.sleeping})`,
  );
  assert(settledCape.cape.minimumHemGroundClearance >= 0.032, 'cape hem penetrated the cave floor');
  assert(settledCape.cape.minimumHemGroundClearance < 0.09, 'cape hem floated above the cave floor');
  assert(
    settledCape.cape.maximumParticleMotion < 0.001,
    `idle cape motion ${settledCape.cape.maximumParticleMotion.toFixed(6)} exceeded the settling budget`,
  );
  assert(settledCape.cape.sleeping, 'idle cape did not enter its stable rest state');

  await setPlayerPose(settledCape.player.position, 0);
  await advance(0.45, 1 / 120);
  await setView(Math.PI, 0.12, 3.1);
  await capture('front-character');
  await setView(0, 0.12, 3.1);
  await capture('cape-neckline');
  const obliqueAttachment = await setView(-0.72, 0.52, 3.25);
  assert(obliqueAttachment.player.capeAttachment.maximumAnchorGap < 0.001, 'cape detached in the oblique attachment study');
  await capture('cape-attachment-oblique');

  const firstBasinCenter = afterWalk.water.basinCenters[0];
  assert(firstBasinCenter?.length === 3, 'first water-basin test position is missing');
  await setPlayerPose(
    [firstBasinCenter[0], afterWalk.player.position[1], firstBasinCenter[2]],
    0,
  );
  const waterJumpStart = await advance(0.35, 1 / 120);
  assert(waterJumpStart.player.inWater, 'jump audit did not start inside the first pool');
  await setView(0, 0.08, 4.05);
  await setMovement(0, 1);
  await advance(0.12, 1 / 120);
  const beforeJump = await diagnostics();
  await pressSpace();
  await advance(0.1, 1 / 120);
  await setView(0.88, 0.08, 4.05);
  await setMovement(1, 0);
  const jumpAscent = await advance(0.14, 1 / 120);
  await setMovement(0, 0);
  assert(!jumpAscent.player.grounded, 'Space did not launch the player');
  assert(jumpAscent.player.verticalSpeed > 1.5, 'jump lost upward velocity too early');
  assert(jumpAscent.player.groundClearance > 0.45, 'jump did not clear the cave floor');
  assert(jumpAscent.player.gait.airborneBlend > 0.9, 'procedural airborne pose did not engage');
  assert(Math.max(...jumpAscent.player.gait.armAngles) > 0.65, 'jump did not animate the arms');
  assert(Math.max(...jumpAscent.player.gait.legAngles) > 0.4, 'jump did not animate the legs');
  assert(
    Math.max(...jumpAscent.player.gait.footAngles.map((angle) => Math.abs(angle))) > 0.15,
    'jump did not animate the feet',
  );
  const jumpYawDelta = Math.abs(Math.atan2(
    Math.sin(jumpAscent.player.yaw - beforeJump.player.yaw),
    Math.cos(jumpAscent.player.yaw - beforeJump.player.yaw),
  ));
  assert(jumpYawDelta > 0.08, 'moving jump did not exercise an airborne turn');
  assert(
    Math.hypot(
      jumpAscent.player.position[0] - beforeJump.player.position[0],
      jumpAscent.player.position[2] - beforeJump.player.position[2],
    ) > 0.25,
    'jump audit remained static instead of traversing the lower-body contact path',
  );
  assert(jumpAscent.cape.hemCenter[1] > beforeJump.cape.hemCenter[1] + 0.08, 'cape hem did not follow the jump');
  assert(jumpAscent.cape.maximumBodyPenetration < 0.002, 'jumping cape penetrated the player');
  assert(jumpAscent.cape.maximumEnvironmentPenetration < 0.002, 'jumping cape penetrated cave geometry');
  await capture('character-jump-ascent');
  const jumpLanded = await advance(0.9, 1 / 120);
  assert(jumpLanded.player.grounded, 'player did not land after jumping');
  assert(jumpLanded.player.inWater, 'moving jump did not land inside the tested pool');
  assert(
    jumpLanded.water.landingRipples === beforeJump.water.landingRipples + 1,
    'water landing did not emit exactly one impact ripple',
  );
  assert(Math.abs(jumpLanded.player.groundClearance) < 0.002, 'landed player clipped through or floated above terrain');
  assert(jumpLanded.cape.maximumBodyPenetration < 0.002, 'cape penetrated the player on landing');
  assert(jumpLanded.cape.maximumEnvironmentPenetration < 0.002, 'cape penetrated cave geometry on landing');
  await capture('character-jump-landed');

  await setPlayerPose([0.8, 0, -8], 0);
  await advance(0.35, 1 / 120);
  await setView(0, 0.16, 4.1);
  const bankBefore = await diagnostics();
  await setMovement(1, 0);
  await advance(0.38, 1 / 120);
  await setMovement(0, 0);
  const bankAfter = await advance(0.24, 1 / 120);
  assert(bankAfter.player.position[0] > bankBefore.player.position[0] + 0.65, 'player did not move onto the cave bank');
  assert(bankAfter.player.position[1] > bankBefore.player.position[1] + 0.35, 'player clipped into the bank instead of climbing it');
  assert(Math.abs(bankAfter.player.groundClearance) < 0.002, 'player feet detached from the procedural bank');
  await advance(0.65, 1 / 120);
  await setCameraPose(
    [bankAfter.player.position[0] - 3.1, bankAfter.player.position[1] + 0.35, bankAfter.player.position[2] + 2.35],
    [bankAfter.player.position[0], bankAfter.player.position[1] + 0.62, bankAfter.player.position[2]],
  );
  await capture('terrain-bank-walk');

  const courseRocks = initial.cave.contactRocks;
  const courseFirst = courseRocks[0];
  const smallRock = courseRocks[1];
  const courseLast = courseRocks.at(-1);
  assert(courseFirst && smallRock?.size === 'small' && courseLast, 'cape contact course has no traversal endpoints');
  const courseCenterX = courseFirst.position[0] - courseFirst.lateralOffset;
  const coursePathX = courseCenterX + 1.75;
  await setPlayerPose([coursePathX, 0, courseFirst.position[2] + 1.15], 0);
  await setView(0, 0.18, 4.3);
  await setMovement(0, 1);
  await advance(3.7, 1 / 120);
  await setMovement(0, 0);
  const courseTraversal = await advance(0.2, 1 / 120);
  assert(
    courseTraversal.player.position[2] < courseLast.position[2] - 0.35,
    'player could not traverse the center-path rock course',
  );
  assert(Math.abs(courseTraversal.player.groundClearance) < 0.002, 'rock-course traversal detached the player from support');
  assert(courseTraversal.cape.maximumBodyPenetration < 0.002, 'rock contact pushed the cape through the player');
  assert(courseTraversal.cape.maximumEnvironmentPenetration < 0.002, 'cape passed through a rock during course traversal');
  await capture('cape-rock-course-traversal');

  await setPlayerPose(
    [courseFirst.position[0] + 0.62, 0, courseFirst.position[2] - 0.62],
    0,
  );
  const largeContactsBefore = (await diagnostics()).cape.worldContacts.total;
  const largeRockContact = await advance(1.8, 1 / 120);
  assert(largeRockContact.cape.worldContacts.total > largeContactsBefore, 'cape never contacted the large test rock');
  assert(
    largeRockContact.cape.maximumBodyPenetration < 0.002,
    `large rock pushed the cape through the player (${largeRockContact.cape.maximumBodyPenetration.toFixed(4)})`,
  );
  assert(
    largeRockContact.cape.maximumEnvironmentPenetration < 0.002,
    `cape penetrated the large test rock (${largeRockContact.cape.maximumEnvironmentPenetration.toFixed(4)})`,
  );
  assert(largeRockContact.cape.maximumEnvironmentFacePenetration < 0.002, 'large test rock pierced a cape triangle');
  await setCameraPose(
    [
      largeRockContact.player.position[0] + 2.45,
      largeRockContact.player.position[1] + 1.1,
      largeRockContact.player.position[2] + 2.15,
    ],
    [
      largeRockContact.player.position[0],
      largeRockContact.player.position[1] + 0.76,
      largeRockContact.player.position[2] + 0.25,
    ],
  );
  await capture('cape-rock-contact-large');

  await setPlayerPose(
    [smallRock.position[0] + 0.32, 0, smallRock.position[2] - 0.57],
    0,
  );
  const smallContactsBefore = (await diagnostics()).cape.worldContacts.total;
  const smallRockContact = await advance(1.8, 1 / 120);
  assert(smallRockContact.cape.worldContacts.total > smallContactsBefore, 'cape never contacted the small test rock');
  assert(
    smallRockContact.cape.maximumBodyPenetration < 0.002,
    `small rock pushed the cape through the player (${smallRockContact.cape.maximumBodyPenetration.toFixed(4)})`,
  );
  assert(
    smallRockContact.cape.maximumEnvironmentPenetration < 0.002,
    `cape penetrated the small test rock (${smallRockContact.cape.maximumEnvironmentPenetration.toFixed(4)})`,
  );
  assert(smallRockContact.cape.maximumEnvironmentFacePenetration < 0.002, 'small test rock pierced a cape triangle');
  await setCameraPose(
    [
      smallRockContact.player.position[0] - 2.25,
      smallRockContact.player.position[1] + 0.92,
      smallRockContact.player.position[2] + 1.85,
    ],
    [
      smallRockContact.player.position[0],
      smallRockContact.player.position[1] + 0.68,
      smallRockContact.player.position[2] + 0.2,
    ],
  );
  await capture('cape-rock-contact-small');

  const contactsBefore = (await diagnostics()).cape.worldContacts.total;
  await setPlayerPose([1.68, 0, -31.6], 0);
  await advance(2.4, 1 / 120);
  const formationContact = await setView(-1.3, 0.14, 3.25);
  assert(formationContact.cape.worldContacts.total > contactsBefore, 'cape never contacted the nearby stalagmite proxy');
  assert(formationContact.cape.maximumEnvironmentPenetration < 0.002, 'cape passed through the contacted stalagmite');
  assert(formationContact.cape.maximumEnvironmentFacePenetration < 0.002, 'stalagmite pierced the middle of a cape triangle');
  await capture('cape-formation-contact');
  await setCameraPose(
    [
      formationContact.player.position[0] + 0.35,
      formationContact.player.position[1] + 1.15,
      formationContact.player.position[2] + 2.45,
    ],
    [
      formationContact.player.position[0],
      formationContact.player.position[1] + 0.75,
      formationContact.player.position[2] + 0.18,
    ],
  );
  await capture('cape-formation-contact-opposite');

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
    highDensity,
    beforeWalk,
    afterWalk,
    beforeDrips,
    afterDrips,
    runState,
    frameProfile,
    profileSettings: {
      durationSeconds: profileDurationSeconds,
      expectedFrames: expectedProfileFrames,
      p95FrameBudget,
      maximumFrameBudget,
    },
    wrapState,
    settledCape,
    sharpLookUp,
    closeCamera,
    beforeJump,
    jumpAscent,
    jumpLanded,
    bankBefore,
    bankAfter,
    courseTraversal,
    largeRockContact,
    smallRockContact,
    formationContact,
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
