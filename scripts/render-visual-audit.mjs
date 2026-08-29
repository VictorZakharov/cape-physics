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
rmSync(outputRoot, { recursive: true, force: true });
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

function booleanSetting(name, fallback) {
  const value = (process.env[name] ?? String(fallback)).trim().toLowerCase();
  if (value === 'true' || value === '1' || value === 'on') return true;
  if (value === 'false' || value === '0' || value === 'off') return false;
  throw new Error(`${name} must be true or false.`);
}

function rendererSetting() {
  const value = (process.env.CAPE_AUDIT_RENDERER ?? 'webgl').trim().toLowerCase();
  if (value === 'webgl' || value === 'webgpu') return value;
  throw new Error('CAPE_AUDIT_RENDERER must be webgl or webgpu.');
}

const rendererPreference = rendererSetting();
const performanceProfileEnabled = booleanSetting('CAPE_AUDIT_PERFORMANCE_PROFILE', true);
const profileDurationSeconds = performanceProfileEnabled
  ? numericSetting('CAPE_AUDIT_PROFILE_SECONDS', 12, 2, 12)
  : 0;
const p95FrameBudget = performanceProfileEnabled
  ? numericSetting('CAPE_AUDIT_P95_BUDGET_MS', 120, 1, 1_000)
  : null;
const maximumFrameBudget = performanceProfileEnabled
  ? numericSetting('CAPE_AUDIT_MAX_FRAME_BUDGET_MS', 750, 1, 5_000)
  : null;

const server = createStaticServer(distRoot);
const temporaryRoot = mkdtempSync(join(tmpdir(), 'cape-physics-audit-'));
const staticPort = await listen(server);
const debugPort = await reservePort();
const profile = join(temporaryRoot, 'browser-profile');
const pageUrl = `http://127.0.0.1:${staticPort}/?harness=1&renderer=${rendererPreference}`;
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
let debuggerEvents = [];

try {
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debugPort}/json/list`, 40_000);
  const page = targets.find((target) => target.type === 'page' && target.url.includes('harness=1'));
  if (!page?.webSocketDebuggerUrl) throw new Error('Headless browser did not expose the audit page.');
  debuggerConnection = await connectDebugger(page.webSocketDebuggerUrl);
  const { command, events } = debuggerConnection;
  debuggerEvents = events;
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
  assert(copiedPerformanceReport.includes('Main thread:'), 'copied performance report omitted workload phases');
  assert(copiedPerformanceReport.includes('Cape solver:'), 'copied performance report omitted sampled cape phases');
  assert(
    copiedPerformanceReport.includes(
      rendererPreference === 'webgpu' ? 'WebGPU compute PBD' : 'sequential CPU PBD',
    ),
    'copied performance report mislabeled the active cape solver',
  );
  assert(copiedPerformanceReport.includes('Scene:'), 'copied performance report omitted scene data');
  assert(
    !copiedPerformanceReport.includes('| 1 draw calls | 1 triangles |'),
    'copied performance report captured only the final fullscreen output pass',
  );
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
  const assertCapeNotRolled = (state, label) => assert(
    state.cape.averageLowerCapeSpanRatio > 0.3
      && state.cape.maximumLowerCapeRowCurlRatio < 0.14,
    `${label} rolled the cape into a tube (`
      + `${state.cape.averageLowerCapeSpanRatio.toFixed(4)} lower-row lateral-span ratio, `
      + `${state.cape.maximumLowerCapeRowCurlRatio.toFixed(4)} maximum row-curl ratio)`,
  );
  const assertCapeWavy = (state, label, minimumDeviation = 0.06) => assert(
    state.cape.capeCenterlineDeviation > minimumDeviation,
    `${label} left the cape as a flat sheet (`
      + `${state.cape.capeCenterlineDeviation.toFixed(4)} m centerline deviation)`,
  );
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
  const clearMovement = () => evaluate(
    command,
    'window.__CAPE_DEMO__.clearMovement()',
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
  const advanceUntilRockContact = async (
    label,
    targetPosition,
    contactsBefore,
    maximumDuration = 2.4,
  ) => {
    const slices = Math.ceil(maximumDuration / 0.05);
    let state = await diagnostics();
    for (let slice = 0; slice < slices; slice += 1) {
      state = await advance(0.05, 1 / 120);
      const closestCenter = state.cape.closestActiveRockCenter;
      const targetMatches = closestCenter !== null
        && Math.hypot(
          closestCenter[0] - targetPosition[0],
          closestCenter[2] - targetPosition[2],
        ) < 0.18;
      if (
        state.cape.worldContacts.total > contactsBefore
        && targetMatches
        && state.cape.minimumActiveRockSurfaceDistance !== null
        && state.cape.minimumActiveRockSurfaceDistance < 0.006
        && state.cape.maximumBodyPenetration < 0.002
        && state.cape.maximumEnvironmentPenetration < 0.002
        && state.cape.maximumEnvironmentFacePenetration < 0.002
        && state.cape.maximumUpwardFold <= 0.055_05
        && state.cape.maximumStructuralError < 0.055
        && state.cape.averageLowerCapeSpanRatio > 0.3
      ) return state;
    }
    throw new Error(
      `Visual audit invariant failed: no exact ${label} rendered-rock contact within ${maximumDuration}s `
        + `(gap=${state.cape.minimumActiveRockSurfaceDistance} m, `
        + `contacts=${state.cape.worldContacts.total - contactsBefore}, `
        + `body=${state.cape.maximumBodyPenetration} m, `
        + `environment=${state.cape.maximumEnvironmentPenetration} m, `
        + `environmentByKind=${JSON.stringify(state.cape.environmentPenetrationByKind)}, `
        + `face=${state.cape.maximumEnvironmentFacePenetration} m, `
        + `fold=${state.cape.maximumUpwardFold} m, `
        + `strain=${state.cape.maximumStructuralError} m, `
        + `closest=${JSON.stringify(state.cape.closestActiveRockCenter)})`,
    );
  };
  const profile = (duration, frameStep = 1 / 60) => evaluate(
    command,
    `window.__CAPE_DEMO__.profile(${JSON.stringify({ duration, frameStep })})`,
  );
  const depthOcclusionProbe = () => evaluate(
    command,
    'window.__CAPE_DEMO__.runDepthOcclusionProbe()',
  );
  const shadowLayerProbe = () => evaluate(
    command,
    'window.__CAPE_DEMO__.runShadowLayerProbe()',
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
  const dispatchTouchPointer = (
    selector,
    type,
    pointerId,
    clientX,
    clientY,
    buttons = type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    isPrimary = true,
  ) => evaluate(command, `(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error('Touch audit target is missing: ' + ${JSON.stringify(selector)});
    return element.dispatchEvent(new PointerEvent(${JSON.stringify(type)}, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: ${pointerId},
      pointerType: 'touch',
      isPrimary: ${isPrimary},
      clientX: ${clientX},
      clientY: ${clientY},
      button: 0,
      buttons: ${buttons},
      pressure: ${buttons === 0 ? 0 : 0.5},
    }));
  })()`);

  const initial = await diagnostics();
  assert(initial.ready, 'demo harness did not report ready');
  const consumedRendererSelection = await evaluate(
    command,
    'new URL(location.href).searchParams.has("renderer")',
  );
  assert(!consumedRendererSelection, 'renderer selection persisted after the one-time reload handoff');
  assert(
    initial.renderer.actual === rendererPreference,
    `${rendererPreference.toUpperCase()} was requested but ${initial.renderer.actual.toUpperCase()} is active`,
  );
  assert(!initial.renderer.fallback, 'visual audit silently activated a renderer fallback');
  assert(
    initial.renderer.calls > 10,
    `full-frame renderer counter captured only ${initial.renderer.calls} draw calls`,
  );
  assert(
    initial.renderer.triangles > 1_000,
    `full-frame renderer counter captured only ${initial.renderer.triangles} triangles`,
  );
  assert(initial.renderer.depthComposite.layerDepthTexture, 'character layer has no resolved depth texture');
  assert(
    initial.renderer.depthComposite.renderMode === 'direct-opaque',
    'opaque character did not share the world MSAA depth pass',
  );
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
  assert(
    initial.cape.maximumBodyPenetration < 0.002,
    `pinned cape neckline starts inside the character (${initial.cape.maximumBodyPenetration.toFixed(5)} m; `
      + `${JSON.stringify(initial.cape.bodyPenetrationByCollider)})`,
  );
  assert(initial.player.capeAttachment.meshes === 2, 'neckline seam or throat ties are missing');
  assert(initial.player.capeAttachment.maximumAnchorGap < 0.001, 'rendered cape attachment does not overlap both simulation anchors');
  assert(initial.water.surfaceAlphaRange[1] <= 0.6, 'water surface is too opaque');
  assert(initial.water.minimumInteriorDepth > 0.04, 'water is not seated inside a terrain basin');
  assert(initial.water.minimumRimClearance > 0.02, 'water surface rises above its containing rim');

  await evaluate(command, `(() => {
    const input = document.querySelector('[data-customization-setting="shadows"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('shadow toggle is missing');
    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  const shadowsDisabled = await diagnostics();
  assert(!shadowsDisabled.cape.settings.shadows, 'shadow toggle did not disable shadows');
  assert(
    shadowsDisabled.renderer.programs === initial.renderer.programs,
    'disabling shadows compiled new renderer programs',
  );
  await evaluate(command, `(() => {
    const input = document.querySelector('[data-customization-setting="shadows"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('shadow toggle is missing');
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  const shadowsRestored = await diagnostics();
  assert(shadowsRestored.cape.settings.shadows, 'shadow toggle did not restore shadows');
  assert(
    shadowsRestored.renderer.programs === initial.renderer.programs,
    'restoring shadows compiled new renderer programs',
  );

  const liveLength = 1.31;
  await evaluate(command, `(() => {
    const input = document.querySelector('[data-customization-setting="length"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('length slider is missing');
    input.value = ${liveLength};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  const liveLengthDiagnostics = await diagnostics();
  assert(
    Math.abs(liveLengthDiagnostics.cape.settings.length - liveLength) < 0.000_001,
    'length slider did not update cape physics during input',
  );
  await evaluate(command, `(() => {
    const input = document.querySelector('[data-customization-setting="length"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('length slider is missing');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('[data-customization-reset]')?.click();
    return true;
  })()`);
  const resetCustomization = await diagnostics();
  assert(
    Math.abs(resetCustomization.cape.settings.length - initial.cape.settings.length) < 0.000_001,
    'customization reset did not restore the default cape length',
  );

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

  const runMobileTouchAudit = async () => {
    await clearMovement();
    await command('Emulation.setDeviceMetricsOverride', {
      width: 844,
      height: 390,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await evaluate(command, 'window.dispatchEvent(new Event("resize")); true');
    await delay(120);
    await dispatchTouchPointer('#scene-canvas', 'pointerdown', 41, 422, 195);
    await dispatchTouchPointer('#scene-canvas', 'pointerup', 41, 422, 195);
    const mobileLayout = await evaluate(command, `(() => {
      const measure = (selector) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error('Mobile layout target is missing: ' + selector);
        const bounds = element.getBoundingClientRect();
        return {
          centerX: bounds.left + bounds.width * 0.5,
          centerY: bounds.top + bounds.height * 0.5,
          width: bounds.width,
          height: bounds.height,
        };
      };
      const root = document.querySelector('[data-mobile-controls]');
      return {
        ariaHidden: root?.getAttribute('aria-hidden'),
        display: root ? getComputedStyle(root).display : 'missing',
        stick: measure('[data-touch-move]'),
        run: measure('[data-touch-run]'),
        jump: measure('[data-touch-jump]'),
      };
    })()`);
    assert(mobileLayout.ariaHidden === 'false', 'touch input did not reveal the mobile controls');
    assert(mobileLayout.display !== 'none', 'mobile controls remained visually hidden after touch');
    assert(
      mobileLayout.stick.width >= 90 && mobileLayout.stick.height >= 90,
      'mobile movement stick is too small to operate',
    );
    assert(
      mobileLayout.run.width >= 54 && mobileLayout.jump.width >= 60,
      'mobile action targets are too small to operate',
    );

    await setPlayerPose(initial.player.position, 0);
    const mobileTouchStart = await setView(0.08, 0.18, 5.5);
    await dispatchTouchPointer('#scene-canvas', 'pointerdown', 42, 340, 190);
    await dispatchTouchPointer('#scene-canvas', 'pointermove', 42, 410, 120);
    const mobileOrbit = await advance(0.05, 1 / 120);
    await dispatchTouchPointer('#scene-canvas', 'pointerup', 42, 410, 120);
    assert(
      mobileOrbit.camera.pitch < mobileTouchStart.camera.pitch - 0.18,
      'one-finger touch drag did not orbit the camera',
    );

    const mobilePinchStart = await setView(0.08, 0.18, 5.5);
    await dispatchTouchPointer('#scene-canvas', 'pointerdown', 43, 330, 180);
    await dispatchTouchPointer('#scene-canvas', 'pointerdown', 44, 510, 180, 1, false);
    await dispatchTouchPointer('#scene-canvas', 'pointermove', 44, 650, 180, 1, false);
    const mobilePinch = await advance(0.24, 1 / 120);
    await dispatchTouchPointer('#scene-canvas', 'pointerup', 44, 650, 180, 0, false);
    await dispatchTouchPointer('#scene-canvas', 'pointerup', 43, 330, 180);
    assert(
      mobilePinch.camera.distance < mobilePinchStart.camera.distance - 0.25,
      'two-finger pinch did not zoom the camera',
    );

    await setPlayerPose(initial.player.position, 0);
    await setView(0.08, 0.22, 4.5);
    const mobileMoveStart = await diagnostics();
    const stickX = mobileLayout.stick.centerX;
    const stickY = mobileLayout.stick.centerY - mobileLayout.stick.height * 0.35;
    await dispatchTouchPointer('[data-touch-move]', 'pointerdown', 45, stickX, stickY);
    await dispatchTouchPointer(
      '[data-touch-run]',
      'pointerdown',
      46,
      mobileLayout.run.centerX,
      mobileLayout.run.centerY,
      1,
      false,
    );
    const mobileRun = await advance(0.72, 1 / 120);
    assert(mobileRun.player.running, 'hold-to-run touch input did not engage');
    assert(mobileRun.player.speed > 5.5, 'touch running did not reach running speed');
    assert(
      Math.hypot(
        mobileRun.player.position[0] - mobileMoveStart.player.position[0],
        mobileRun.player.position[2] - mobileMoveStart.player.position[2],
      ) > 2.5,
      'virtual stick did not move the player through the cave',
    );

    await dispatchTouchPointer(
      '[data-touch-jump]',
      'pointerdown',
      47,
      mobileLayout.jump.centerX,
      mobileLayout.jump.centerY,
      1,
      false,
    );
    const mobileJump = await advance(0.16, 1 / 120);
    assert(!mobileJump.player.grounded, 'tap-to-jump touch input did not leave the ground');
    assert(mobileJump.player.verticalSpeed > 1, 'touch jump had no upward velocity');
    assert(mobileJump.player.gait.airborneBlend > 0.45, 'touch jump did not engage procedural limb animation');
    await capture('mobile-touch-controls');
    await dispatchTouchPointer(
      '[data-touch-jump]',
      'pointerup',
      47,
      mobileLayout.jump.centerX,
      mobileLayout.jump.centerY,
      0,
      false,
    );
    await dispatchTouchPointer(
      '[data-touch-run]',
      'pointerup',
      46,
      mobileLayout.run.centerX,
      mobileLayout.run.centerY,
      0,
      false,
    );
    await dispatchTouchPointer('[data-touch-move]', 'pointerup', 45, stickX, stickY);
    const report = {
      layout: mobileLayout,
      start: mobileTouchStart,
      orbit: mobileOrbit,
      pinch: mobilePinch,
      run: mobileRun,
      jump: mobileJump,
    };

    await command('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(command, `(() => {
      window.dispatchEvent(new Event('resize'));
      document.querySelector('[data-mobile-controls]')?.style.setProperty(
        'display',
        'none',
        'important',
      );
      return true;
    })()`);
    await delay(120);
    await setPlayerPose(initial.player.position, 0);
    await setView(0.08, 0.22, 4.5);
    await advance(0.45, 1 / 120);
    return report;
  };

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
  assert(closeCamera.renderer.depthComposite.renderMode === 'isolated-fade', 'close camera did not isolate the faded character layer');
  assert(closeCamera.renderer.depthComposite.worldDepthConnected, 'close fade did not sample world depth');
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
  const walkMotionState = await advance(1.72, 1 / 120);
  console.log('Walking cape shape:', JSON.stringify({
    centerlineDeviation: walkMotionState.cape.capeCenterlineDeviation,
    hemDrop: walkMotionState.cape.hemDrop,
    hemBackOffset: walkMotionState.cape.hemBackOffset,
    lowerSpanRatio: walkMotionState.cape.averageLowerCapeSpanRatio,
    maximumRowCurlRatio: walkMotionState.cape.maximumLowerCapeRowCurlRatio,
  }));
  await setView(1.18, 0.12, 4.1);
  await capture('character-walking');
  assertCapeWavy(walkMotionState, 'walking');
  await setMovement(0, 0);
  const sampleFallResponse = process.env.CAPE_AUDIT_SAMPLE_FALL_RESPONSE === 'true';
  const postWalkFallResponse = [];
  if (sampleFallResponse) {
    for (let sampleIndex = 0; sampleIndex < 9; sampleIndex += 1) {
      const sample = await advance(0.02, 1 / 120);
      postWalkFallResponse.push({
        elapsed: (sampleIndex + 1) * 0.02,
        hemDrop: sample.cape.hemDrop,
        hemBackOffset: sample.cape.hemBackOffset,
      });
    }
  } else {
    await advance(0.18, 1 / 120);
  }
  const afterWalk = await setView(0.18, 0.46, 4.65);
  console.log('Post-walk cape shape:', JSON.stringify({
    centerlineDeviation: afterWalk.cape.capeCenterlineDeviation,
    hemDrop: afterWalk.cape.hemDrop,
    hemBackOffset: afterWalk.cape.hemBackOffset,
    maximumRowCurlRatio: afterWalk.cape.maximumLowerCapeRowCurlRatio,
    ...(sampleFallResponse ? { fallResponse: postWalkFallResponse } : {}),
  }));
  assert(afterWalk.player.position[2] < beforeWalk.player.position[2] - 4, 'W movement did not traverse the cave');
  assert(afterWalk.player.inWater, 'visual traversal did not stop inside the first puddle');
  assert(afterWalk.water.footstepRipples >= 2, 'walking did not emit footstep ripples');
  assert(
    afterWalk.cape.maximumStructuralError < 0.04,
    `cape constraints drifted during visual traversal (${afterWalk.cape.maximumStructuralError} m; ${JSON.stringify({ beforeHem: beforeWalk.cape.hemCenter, afterHem: afterWalk.cape.hemCenter, player: afterWalk.player.position, body: afterWalk.cape.maximumBodyPenetration, environment: afterWalk.cape.environmentPenetrationByKind })})`,
  );
  assert(
    afterWalk.cape.maximumBodyPenetration < 0.002,
    `cape penetrated the animated character (${afterWalk.cape.maximumBodyPenetration} m; ${JSON.stringify({ kind: afterWalk.cape.bodyPenetrationByKind, collider: afterWalk.cape.bodyPenetrationByCollider })})`,
  );
  assert(
    afterWalk.cape.maximumEnvironmentPenetration < 0.002,
    `cape penetrated the cave during visual traversal (${afterWalk.cape.maximumEnvironmentPenetration} m; ${JSON.stringify({ penetration: afterWalk.cape.environmentPenetrationByKind, beforeHem: beforeWalk.cape.hemCenter, afterHem: afterWalk.cape.hemCenter, beforePlayer: beforeWalk.player.position, afterPlayer: afterWalk.player.position })})`,
  );
  assert(afterWalk.cape.maximumEnvironmentFacePenetration < 0.002, 'a cave object pierced a cape triangle during visual traversal');
  assertCapeNotRolled(afterWalk, 'walking');
  assert(
    afterWalk.cape.hemBackOffset < 1.25,
    `walking pulled the cape almost fully horizontal (${afterWalk.cape.hemBackOffset} m)`,
  );
  assert(
    afterWalk.cape.hemDrop > 0.9,
    `walking failed to preserve a gravity-driven drape (${afterWalk.cape.hemDrop} m)`,
  );
  assert(
    afterWalk.cape.hemDrop - walkMotionState.cape.hemDrop > 0.14,
    `cape descended too slowly after walking (${(afterWalk.cape.hemDrop - walkMotionState.cape.hemDrop).toFixed(4)} m in 0.18 s)`,
  );
  if (sampleFallResponse) {
    const fallIntervals = postWalkFallResponse.map((sample, index) => (
      sample.hemDrop - (index === 0
        ? walkMotionState.cape.hemDrop
        : postWalkFallResponse[index - 1].hemDrop)
    ));
    assert(
      Math.max(...fallIntervals) < 0.045,
      `cape snapped downward after walking (${Math.max(...fallIntervals).toFixed(4)} m maximum 0.02 s drop)`,
    );
  }
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
  console.log('Running cape shape:', JSON.stringify({
    centerlineDeviation: runState.cape.capeCenterlineDeviation,
    hemDrop: runState.cape.hemDrop,
    hemBackOffset: runState.cape.hemBackOffset,
    maximumRowCurlRatio: runState.cape.maximumLowerCapeRowCurlRatio,
  }));
  assert(runState.player.running, 'Shift running state did not engage');
  assert(runState.player.speed > 5.5, 'running did not exceed walking speed');
  assert(runState.player.gait.runningBlend > 0.85, 'running gait animation did not engage');
  assert(
    runState.cape.hemBackOffset > afterWalk.cape.hemBackOffset + 0.5,
    'running did not produce a materially stronger cape trail than walking',
  );
  await setView(1.18, 0.12, 4.1);
  await capture('character-running');
  assertCapeNotRolled(runState, 'running');
  // A running cape trails farther and therefore carries a shallower curve than
  // walking cloth, but must still retain a visible four-centimetre bow.
  assertCapeWavy(runState, 'running', 0.04);
  let frameProfile = null;
  let expectedProfileFrames = 0;
  if (performanceProfileEnabled) {
    frameProfile = await profile(profileDurationSeconds, 1 / 144);
    expectedProfileFrames = Math.round(profileDurationSeconds * 144);
    console.log(
      `144 Hz profile: ${frameProfile.frames} frames, `
      + `${frameProfile.averageFrameMilliseconds.toFixed(2)} ms avg, `
      + `${frameProfile.p95FrameMilliseconds.toFixed(2)} ms p95, `
      + `${frameProfile.maximumFrameMilliseconds.toFixed(2)} ms max`,
    );
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
    assertCapeNotRolled(frameProfile.diagnostics, 'profiled traversal');
  } else {
    console.log('144 Hz wall-clock profile: SKIPPED (deterministic CI mode)');
  }
  await setMovement(0, 0);
  await setRunning(false);

  // Performance profiling is optional. Give the reversal/settling study its
  // own fixed route so profiling cannot change its physical precondition or
  // final cave location.
  await setPlayerPose([-2.38, 0, -15], 0);
  await setView(0, 0.2, 4.4);
  await advance(0.45, 1 / 120);
  await setRunning(true);
  await setMovement(0, 1);
  await advance(0.85, 1 / 120);
  await setMovement(0, 0);
  await setRunning(false);
  await setView(1.33, 0.16, 4.35);
  await setMovement(0, -1);
  await advance(0.9, 1 / 120);
  await setMovement(0, 0);
  const wrapState = await advance(0.12, 1 / 120);
  assert(
    wrapState.cape.maximumBodyPenetration < 0.002,
    `cape penetrated the body during visual reversal `
      + `(${JSON.stringify(wrapState.cape.bodyPenetrationByKind)}; `
      + `${JSON.stringify(wrapState.cape.bodyPenetrationByCollider)})`,
  );
  assertCapeNotRolled(wrapState, 'reversal');
  await capture('cape-wrap-reversal');

  await setPlayerPose([-2.38, 0, -15], 0);
  const settledCape = await advance(3.2, 1 / 120);
  console.log('Settled cape shape:', JSON.stringify({
    sleeping: settledCape.cape.sleeping,
    hemDrop: settledCape.cape.hemDrop,
    lowerDrop: settledCape.cape.minimumLowerCapeDrop,
    centerlineDeviation: settledCape.cape.capeCenterlineDeviation,
    maximumRowCurlRatio: settledCape.cape.maximumLowerCapeRowCurlRatio,
  }));
  await setView(0.08, 0.2, 4.25);
  await capture('cape-wrap-settled');
  assert(
    settledCape.cape.maximumBodyPenetration < 0.002,
    `settled cape penetrated the character (${settledCape.cape.maximumBodyPenetration.toFixed(5)} m; `
      + `${JSON.stringify(settledCape.cape.bodyPenetrationByCollider)})`,
  );
  assert(settledCape.cape.maximumEnvironmentPenetration < 0.002, 'settled cape penetrated cave geometry');
  assert(settledCape.cape.minimumSelfSeparation > 0.05, 'settled cape collapsed through itself');
  assert(settledCape.cape.maximumUpwardFold <= 0.055_05, 'settled cape retained an impossible upward fold');
  assertCapeNotRolled(settledCape, 'settling');
  assert(settledCape.cape.hemDrop > 0.72, 'cape retained a physically impossible inverted resting pose');
  assert(settledCape.cape.minimumLowerCapeDrop > 0.48, 'a lower cape panel remained suspended in mid-air');
  assert(
    settledCape.cape.maximumLowerCapeLateralOffset < 0.18,
    `settled cape remained swept sideways (${settledCape.cape.maximumLowerCapeLateralOffset.toFixed(4)} m; `
      + `${settledCape.cape.worldContacts.lastStep} contacts; sleeping=${settledCape.cape.sleeping})`,
  );
  assert(settledCape.cape.minimumHemGroundClearance >= 0.003_9, 'cape hem penetrated the cave floor');
  assert(settledCape.cape.minimumHemGroundClearance < 0.03, 'cape hem floated above the cave floor');
  assert(
    settledCape.cape.maximumParticleMotion < 0.001,
    `idle cape motion ${settledCape.cape.maximumParticleMotion.toFixed(6)} exceeded the settling budget`,
  );
  if (rendererPreference === 'webgpu') {
    assert(!settledCape.cape.sleeping, 'WebGPU cape unexpectedly froze its idle particle state');
  } else {
    assert(settledCape.cape.sleeping, 'idle cape did not enter its stable rest state');
  }

  await setPlayerPose(settledCape.player.position, 0);
  await advance(0.45, 1 / 120);
  await setView(Math.PI, 0.12, 3.1);
  await capture('front-character');
  await setView(0, 0.12, 3.1);
  await capture('cape-neckline');
  await setView(Math.PI / 2, 0.08, 2.45);
  await capture('cape-neck-mount-side');
  const obliqueAttachment = await setView(-0.72, 0.52, 3.25);
  assert(obliqueAttachment.player.capeAttachment.maximumAnchorGap < 0.001, 'cape detached in the oblique attachment study');
  await capture('cape-attachment-oblique');
  const [attachmentX, attachmentY, attachmentZ] = settledCape.player.position;
  const lowFrontAttachment = await setCameraPose(
    [attachmentX, attachmentY + 1.25, attachmentZ - 2.3],
    [attachmentX, attachmentY + 1.49, attachmentZ],
  );
  assert(lowFrontAttachment.player.opacity === 1, 'low front attachment study triggered close-camera fade');
  assert(lowFrontAttachment.player.capeAttachment.maximumAnchorGap < 0.001, 'cape detached in the low front attachment study');
  await capture('cape-neck-mount-low-front');
  const closeRearAttachment = await setCameraPose(
    [attachmentX + 0.55, attachmentY + 1.5, attachmentZ + 0.95],
    [attachmentX, attachmentY + 1.48, attachmentZ + 0.08],
  );
  assert(closeRearAttachment.player.opacity < 0.5, 'close rear attachment study did not exercise isolated fade');
  assert(closeRearAttachment.player.capeAttachment.maximumAnchorGap < 0.001, 'cape detached in the close rear attachment study');
  await capture('cape-upper-back-close');
  const lowRearBackContact = await setCameraPose(
    [attachmentX + 0.62, attachmentY + 0.38, attachmentZ - 0.42],
    [attachmentX, attachmentY + 1.05, attachmentZ + 0.02],
  );
  assert(lowRearBackContact.player.opacity < 0.5, 'low rear back-contact study did not exercise isolated fade');
  assert(lowRearBackContact.player.capeAttachment.maximumAnchorGap < 0.001, 'cape detached in the low rear back-contact study');
  await capture('cape-back-contact-low-side');

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
  const largeRockContact = await advanceUntilRockContact(
    'large',
    courseFirst.position,
    largeContactsBefore,
  );
  assert(largeRockContact.cape.worldContacts.total > largeContactsBefore, 'cape never contacted the large test rock');
  assert(
    largeRockContact.cape.maximumBodyPenetration < 0.002,
    `large rock pushed the cape through the player (${largeRockContact.cape.maximumBodyPenetration.toFixed(4)})`,
  );
  assert(
    largeRockContact.cape.maximumEnvironmentPenetration < 0.002,
    `cape penetrated the large test rock (${largeRockContact.cape.maximumEnvironmentPenetration.toFixed(4)})`,
  );
  assert(
    largeRockContact.cape.minimumActiveRockSurfaceDistance !== null
      && largeRockContact.cape.minimumActiveRockSurfaceDistance < 0.006,
    `cape hovered visibly above the large test rock (${largeRockContact.cape.minimumActiveRockSurfaceDistance} m)`,
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
    [courseFirst.position[0] + 0.65, 0, courseFirst.position[2] - 0.72],
    0,
  );
  await setView(0, 0.16, 4.1);
  const movingRockContactsBefore = (await diagnostics()).cape.worldContacts.total;
  await setMovement(0, 1);
  const movingFootRockContact = await advance(0.28, 1 / 120);
  assert(movingFootRockContact.player.speed > 2, 'moving foot/rock study did not engage walking gait');
  assert(
    movingFootRockContact.cape.worldContacts.total > movingRockContactsBefore,
    'trailing cape never contacted the nearby rock during walking',
  );
  assert(movingFootRockContact.cape.maximumBodyPenetration < 0.002, 'stone-pinned walking cape penetrated the character');
  assert(
    movingFootRockContact.cape.maximumEnvironmentFacePenetration < 0.002,
    `walking cape penetrated the nearby rock (${movingFootRockContact.cape.maximumEnvironmentFacePenetration} m; `
      + `${JSON.stringify(movingFootRockContact.cape.environmentPenetrationByKind)})`,
  );
  assert(
    movingFootRockContact.cape.maximumUpwardFold <= 0.055_05,
    'small-rock contact folded the lower cape back through itself',
  );
  assert(movingFootRockContact.cape.bodyPenetrationByCollider['left boot'] < 0.002, 'left boot clipped through the walking cape near a rock');
  assert(movingFootRockContact.cape.bodyPenetrationByCollider['right boot'] < 0.002, 'right boot clipped through the walking cape near a rock');
  await setCameraPose(
    [
      movingFootRockContact.player.position[0] + 1.05,
      movingFootRockContact.player.position[1] + 0.78,
      movingFootRockContact.player.position[2] + 2.5,
    ],
    [
      movingFootRockContact.player.position[0],
      movingFootRockContact.player.position[1] + 0.52,
      movingFootRockContact.player.position[2] + 0.28,
    ],
  );
  await capture('cape-moving-foot-rock-contact');
  await setMovement(0, 0);

  await setPlayerPose(
    [smallRock.position[0] + 0.46, 0, smallRock.position[2] - 0.28],
    0,
  );
  await setView(0, 0.16, 4.1);
  let previousSmallRockState = await advance(0.4, 1 / 120);
  const smallContactsBefore = previousSmallRockState.cape.worldContacts.total;
  const smallRockTraversal = {
    maximumRootVerticalStep: 0,
    maximumCapeStep: 0,
    maximumCapeVerticalStep: 0,
    maximumUpwardFold: 0,
    maximumStructuralError: 0,
    maximumBodyPenetration: 0,
    maximumEnvironmentPenetration: 0,
    maximumEnvironmentFacePenetration: 0,
    maximumEnvironmentDetail: null,
    maximumEnvironmentByKind: {
      sphere: 0,
      rock: 0,
      floor: 0,
      wall: 0,
      sphereFace: 0,
      rockFace: 0,
      caveFace: 0,
    },
  };
  let smallRockContact = null;
  let minimumSmallRockGap = Number.POSITIVE_INFINITY;
  let minimumAnyRockGap = Number.POSITIVE_INFINITY;
  let lastClosestRockCenter = null;
  await setMovement(0, 1);
  for (let frame = 0; frame < 110; frame += 1) {
    const state = await advance(1 / 120, 1 / 120);
    smallRockTraversal.maximumRootVerticalStep = Math.max(
      smallRockTraversal.maximumRootVerticalStep,
      Math.abs(state.player.position[1] - previousSmallRockState.player.position[1]),
    );
    smallRockTraversal.maximumCapeStep = Math.max(
      smallRockTraversal.maximumCapeStep,
      state.cape.maximumParticleMotion,
    );
    smallRockTraversal.maximumCapeVerticalStep = Math.max(
      smallRockTraversal.maximumCapeVerticalStep,
      state.cape.maximumParticleVerticalMotion,
    );
    if (
      state.cape.maximumEnvironmentPenetration
      > smallRockTraversal.maximumEnvironmentPenetration
    ) {
      smallRockTraversal.maximumEnvironmentDetail =
        state.cape.environmentPenetrationByKind.rockFaceDetail;
    }
    for (const metric of [
      'maximumUpwardFold',
      'maximumStructuralError',
      'maximumBodyPenetration',
      'maximumEnvironmentPenetration',
      'maximumEnvironmentFacePenetration',
    ]) {
      smallRockTraversal[metric] = Math.max(
        smallRockTraversal[metric],
        state.cape[metric],
      );
    }
    for (const kind of Object.keys(smallRockTraversal.maximumEnvironmentByKind)) {
      smallRockTraversal.maximumEnvironmentByKind[kind] = Math.max(
        smallRockTraversal.maximumEnvironmentByKind[kind],
        state.cape.environmentPenetrationByKind[kind],
      );
    }
    const closestCenter = state.cape.closestActiveRockCenter;
    lastClosestRockCenter = closestCenter;
    if (state.cape.minimumActiveRockSurfaceDistance !== null) {
      minimumAnyRockGap = Math.min(
        minimumAnyRockGap,
        state.cape.minimumActiveRockSurfaceDistance,
      );
    }
    const targetMatches = closestCenter !== null
      && Math.hypot(
        closestCenter[0] - smallRock.position[0],
        closestCenter[2] - smallRock.position[2],
      ) < 0.18;
    if (
      targetMatches
      && state.cape.minimumActiveRockSurfaceDistance !== null
    ) {
      minimumSmallRockGap = Math.min(
        minimumSmallRockGap,
        state.cape.minimumActiveRockSurfaceDistance,
      );
    }
    if (
      smallRockContact === null
      && targetMatches
      && state.cape.minimumActiveRockSurfaceDistance !== null
      && state.cape.minimumActiveRockSurfaceDistance < 0.006
      && state.cape.maximumBodyPenetration < 0.002
      && state.cape.maximumEnvironmentPenetration < 0.002
      && state.cape.maximumEnvironmentFacePenetration < 0.002
      && state.cape.maximumUpwardFold < 0.03
      && state.cape.maximumStructuralError < 0.035
    ) {
      smallRockContact = state;
      await setCameraPose(
        [
          state.player.position[0] + 2.25,
          state.player.position[1] + 0.92,
          state.player.position[2] - 1.65,
        ],
        [
          state.player.position[0],
          state.player.position[1] + 0.68,
          state.player.position[2] + 0.2,
        ],
      );
      await capture('cape-rock-contact-small');
    }
    previousSmallRockState = state;
  }
  await setMovement(0, 0);
  const smallRockTraversalEnd = await advance(0.12, 1 / 120);
  assert(
    smallRockContact !== null,
    'walking cape never made resolved contact with the small test rock '
      + `(targetGap=${minimumSmallRockGap}, anyGap=${minimumAnyRockGap}, `
      + `lastClosest=${JSON.stringify(lastClosestRockCenter)})`,
  );
  assert(smallRockContact.cape.worldContacts.total > smallContactsBefore, 'cape never contacted the small test rock');
  assert(
    smallRockContact.cape.maximumBodyPenetration < 0.002,
    `small rock pushed the cape through the player (${smallRockContact.cape.maximumBodyPenetration.toFixed(4)})`,
  );
  assert(
    smallRockContact.cape.maximumEnvironmentPenetration < 0.002,
    `cape penetrated the small test rock (${smallRockContact.cape.maximumEnvironmentPenetration.toFixed(4)})`,
  );
  assert(
    smallRockContact.cape.minimumActiveRockSurfaceDistance !== null
      && smallRockContact.cape.minimumActiveRockSurfaceDistance < 0.006,
    `cape hovered visibly above the small test rock (${smallRockContact.cape.minimumActiveRockSurfaceDistance} m)`,
  );
  assert(smallRockContact.cape.maximumEnvironmentFacePenetration < 0.002, 'small test rock pierced a cape triangle');
  assert(
    smallRockTraversalEnd.player.position[2] < smallRock.position[2] - 0.65,
    'player did not complete the small-stone traversal',
  );
  assert(smallRockTraversal.maximumRootVerticalStep < 0.035, 'small stone launched the player support');
  assert(
    smallRockTraversal.maximumCapeStep < 0.09,
    'small stone snapped the cape farther than a running cloth step '
      + `(motion=${smallRockTraversal.maximumCapeStep.toFixed(4)}, `
      + `vertical=${smallRockTraversal.maximumCapeVerticalStep.toFixed(4)}, `
      + `fold=${smallRockTraversal.maximumUpwardFold.toFixed(4)}, `
      + `strain=${smallRockTraversal.maximumStructuralError.toFixed(4)})`,
  );
  assert(
    smallRockTraversal.maximumCapeVerticalStep < 0.044,
    'small stone launched the cape like a jump '
      + `(vertical=${smallRockTraversal.maximumCapeVerticalStep.toFixed(4)}, `
      + `motion=${smallRockTraversal.maximumCapeStep.toFixed(4)}, `
      + `root=${smallRockTraversal.maximumRootVerticalStep.toFixed(4)}, `
      + `fold=${smallRockTraversal.maximumUpwardFold.toFixed(4)}, `
      + `strain=${smallRockTraversal.maximumStructuralError.toFixed(4)})`,
  );
  assert(
    smallRockTraversal.maximumUpwardFold < 0.03,
    `small stone crossed or straightened lower cape rows (`
      + `${smallRockTraversal.maximumUpwardFold.toFixed(5)} m)`,
  );
  assert(
    smallRockTraversal.maximumStructuralError < 0.035,
    `small-stone traversal overstretched the cape (${smallRockTraversal.maximumStructuralError.toFixed(4)} m)`,
  );
  assert(
    smallRockTraversal.maximumBodyPenetration < 0.002,
    `small-stone traversal pushed cape through the body (${smallRockTraversal.maximumBodyPenetration.toFixed(4)} m)`,
  );
  assert(
    smallRockTraversal.maximumEnvironmentPenetration < 0.002,
    `small-stone traversal penetrated world geometry `
      + `(${smallRockTraversal.maximumEnvironmentPenetration.toFixed(4)} m, `
      + `face=${smallRockTraversal.maximumEnvironmentFacePenetration.toFixed(4)} m, `
      + `byKind=${JSON.stringify(smallRockTraversal.maximumEnvironmentByKind)}, `
      + `detail=${JSON.stringify(smallRockTraversal.maximumEnvironmentDetail)})`,
  );
  assert(
    smallRockTraversal.maximumEnvironmentFacePenetration < 0.002,
    `small-stone traversal pierced a cape face (${smallRockTraversal.maximumEnvironmentFacePenetration.toFixed(4)} m)`,
  );

  const stressRock = courseRocks[4];
  assert(stressRock?.size === 'large', 'sustained-contact stress boulder is missing');
  await setPlayerPose(
    [stressRock.position[0] + 0.78, 0, stressRock.position[2] - 0.28],
    0,
  );
  const stressContactsBefore = (await diagnostics()).cape.worldContacts.total;
  const stressRockContact = await advanceUntilRockContact(
    'sustained large',
    stressRock.position,
    stressContactsBefore,
  );
  const stressRockStability = {
    maximumCapeStep: 0,
    maximumCapeVerticalStep: 0,
    maximumUpwardFold: 0,
    maximumStructuralError: 0,
    maximumBodyPenetration: 0,
    maximumEnvironmentPenetration: 0,
    maximumEnvironmentFacePenetration: 0,
    maximumEnvironmentDetail: null,
    maximumEnvironmentByKind: null,
  };
  for (let frame = 0; frame < 180; frame += 1) {
    const state = await advance(1 / 120, 1 / 120);
    stressRockStability.maximumCapeStep = Math.max(
      stressRockStability.maximumCapeStep,
      state.cape.maximumParticleMotion,
    );
    stressRockStability.maximumCapeVerticalStep = Math.max(
      stressRockStability.maximumCapeVerticalStep,
      state.cape.maximumParticleVerticalMotion,
    );
    if (
      state.cape.maximumEnvironmentPenetration
      > stressRockStability.maximumEnvironmentPenetration
    ) {
      stressRockStability.maximumEnvironmentDetail = state.cape.environmentPenetrationByKind;
      stressRockStability.maximumEnvironmentByKind = state.cape.environmentPenetrationByKind;
    }
    for (const metric of [
      'maximumUpwardFold',
      'maximumStructuralError',
      'maximumBodyPenetration',
      'maximumEnvironmentPenetration',
      'maximumEnvironmentFacePenetration',
    ]) {
      stressRockStability[metric] = Math.max(
        stressRockStability[metric],
        state.cape[metric],
      );
    }
  }
  assert(stressRockStability.maximumCapeStep < 0.12, 'sustained boulder contact launched or spiked the cape');
  assert(stressRockStability.maximumCapeVerticalStep < 0.07, 'sustained boulder contact kicked the cape vertically');
  assert(stressRockStability.maximumUpwardFold < 0.035, 'sustained boulder contact folded the cape upward');
  assert(stressRockStability.maximumStructuralError < 0.055, 'sustained boulder contact overstretched the cape');
  assert(stressRockStability.maximumBodyPenetration < 0.002, 'sustained boulder contact pushed cape through the body');
  assert(
    stressRockStability.maximumEnvironmentPenetration < 0.002,
    `sustained boulder contact penetrated world geometry (${JSON.stringify(stressRockStability)})`,
  );
  assert(stressRockStability.maximumEnvironmentFacePenetration < 0.002, 'sustained boulder contact pierced a cape face');
  const stressRockSettled = await diagnostics();
  await setCameraPose(
    [
      stressRockSettled.player.position[0] + 2.3,
      stressRockSettled.player.position[1] + 0.95,
      stressRockSettled.player.position[2] - 1.75,
    ],
    [
      stressRockSettled.player.position[0],
      stressRockSettled.player.position[1] + 0.68,
      stressRockSettled.player.position[2] + 0.2,
    ],
  );
  await capture('cape-sustained-rock-contact-a');
  await setCameraPose(
    [
      stressRockSettled.player.position[0] - 2.2,
      stressRockSettled.player.position[1] + 1.05,
      stressRockSettled.player.position[2] + 1.8,
    ],
    [
      stressRockSettled.player.position[0],
      stressRockSettled.player.position[1] + 0.68,
      stressRockSettled.player.position[2] + 0.2,
    ],
  );
  await capture('cape-sustained-rock-contact-b');

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

  // A shadow map is selected from player position only. Orbiting the camera
  // around an unchanged player must therefore preserve the light, target, and
  // intensity exactly; the paired captures make any view-dependent artifact
  // visible during review.
  await setPlayerPose(initial.player.position, 0);
  const shadowStudy = await advance(0.55, 1 / 120);
  assert(shadowStudy.torches.shadow.enabled, 'shadow study has no active torch shadow');
  const shadowTarget = [
    shadowStudy.player.position[0],
    shadowStudy.player.position[1] + 0.68,
    shadowStudy.player.position[2],
  ];
  const shadowFirstAngle = await setCameraPose(
    [
      shadowStudy.player.position[0] + 3.1,
      shadowStudy.player.position[1] + 2.25,
      shadowStudy.player.position[2] + 2.7,
    ],
    shadowTarget,
  );
  await capture('shadow-camera-angle-a');
  const shadowSecondAngle = await setCameraPose(
    [
      shadowStudy.player.position[0] + 3.6,
      shadowStudy.player.position[1] + 2.6,
      shadowStudy.player.position[2] - 1.8,
    ],
    shadowTarget,
  );
  await capture('shadow-camera-angle-b');
  assert(
    JSON.stringify(shadowFirstAngle.torches.shadow)
      === JSON.stringify(shadowSecondAngle.torches.shadow),
    'camera orbit changed the active shadow light at a fixed player position',
  );
  const renderedShadowLayers = await shadowLayerProbe();
  assert(
    renderedShadowLayers.direct.contrast > 18,
    'direct character render produced no measurable cast shadow',
  );
  assert(
    renderedShadowLayers.isolated.contrast > 18,
    'close-camera isolated render dropped the character cast shadow',
  );
  assert(
    renderedShadowLayers.secondAngle.contrast > 18,
    'second camera angle produced no measurable cast shadow',
  );
  assert(
    renderedShadowLayers.contrastDelta < 4,
    `camera render mode changed shadow contrast by ${renderedShadowLayers.contrastDelta.toFixed(2)}`,
  );
  assert(
    renderedShadowLayers.angleContrastDelta < 4,
    `camera angle changed shadow contrast by ${renderedShadowLayers.angleContrastDelta.toFixed(2)}`,
  );

  const occlusionRock = initial.cave.contactRocks.find((rock) => rock.size === 'large');
  assert(occlusionRock, 'real-world depth study has no large occluding rock');
  await setPlayerPose(
    [occlusionRock.position[0], 0, occlusionRock.position[2] - 1.45],
    0,
  );
  const occlusionStudy = await advance(0.45, 1 / 120);
  const occlusionTarget = [
    occlusionStudy.player.position[0],
    occlusionStudy.player.position[1] + 0.72,
    occlusionStudy.player.position[2],
  ];
  await setCameraPose(
    [occlusionRock.position[0], occlusionTarget[1], occlusionRock.position[2] + 2.3],
    occlusionTarget,
  );
  await capture('world-depth-occludes-character');
  const firstDepthOcclusion = await depthOcclusionProbe();
  assertDepthOcclusion(firstDepthOcclusion, 'world-facing rock angle');
  await setCameraPose(
    [
      occlusionStudy.player.position[0],
      occlusionTarget[1],
      occlusionStudy.player.position[2] - 2.3,
    ],
    occlusionTarget,
  );
  await capture('character-depth-occludes-world');
  const oppositeDepthOcclusion = await depthOcclusionProbe();
  assertDepthOcclusion(oppositeDepthOcclusion, 'character-facing rock angle');

  const maximumCapeLength = 2.05;
  await evaluate(command, `(() => {
    const input = document.querySelector('[data-customization-setting="length"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('length slider is missing');
    input.value = ${maximumCapeLength};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  await setPlayerPose([coursePathX, 0, courseFirst.position[2] + 1.15], 0);
  await setView(0, 0.18, 4.3);
  await setMovement(0, 1);
  const longCapeTraversal = {
    maximumEnvironmentPenetration: 0,
    maximumEnvironmentFacePenetration: 0,
    detail: null,
  };
  let longCapeTraversalState = await diagnostics();
  for (let frame = 0; frame < Math.ceil(3.9 * 120); frame += 1) {
    longCapeTraversalState = await advance(1 / 120, 1 / 120);
    if (
      longCapeTraversalState.cape.maximumEnvironmentPenetration
      > longCapeTraversal.maximumEnvironmentPenetration
    ) {
      longCapeTraversal.maximumEnvironmentPenetration
        = longCapeTraversalState.cape.maximumEnvironmentPenetration;
      longCapeTraversal.detail = longCapeTraversalState.cape.environmentPenetrationByKind;
    }
    longCapeTraversal.maximumEnvironmentFacePenetration = Math.max(
      longCapeTraversal.maximumEnvironmentFacePenetration,
      longCapeTraversalState.cape.maximumEnvironmentFacePenetration,
    );
  }
  await setMovement(0, 0);
  assert(
    longCapeTraversalState.player.position[2] < courseLast.position[2] - 0.35,
    'maximum-length cape traversal did not cross the floor-rock course',
  );
  assert(
    longCapeTraversal.maximumEnvironmentPenetration < 0.002,
    `maximum-length cape passed through a floor rock (${longCapeTraversal.maximumEnvironmentPenetration} m; ${JSON.stringify(longCapeTraversal.detail)})`,
  );
  assert(
    longCapeTraversal.maximumEnvironmentFacePenetration < 0.002,
    `floor rock pierced a maximum-length cape triangle (${longCapeTraversal.maximumEnvironmentFacePenetration} m)`,
  );
  await capture('cape-long-rock-course-traversal');

  const mobileTouch = await runMobileTouchAudit();

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
    mobileTouch,
    beforeWalk,
    walkMotionState,
    afterWalk,
    beforeDrips,
    afterDrips,
    runState,
    frameProfile,
    profileSettings: {
      renderer: rendererPreference,
      enabled: performanceProfileEnabled,
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
    longCapeTraversal,
    longCapeTraversalState,
    largeRockContact,
    movingFootRockContact,
    smallRockContact,
    smallRockTraversal,
    stressRockContact,
    stressRockStability,
    formationContact,
    shadowStudy,
    shadowAngles: {
      first: shadowFirstAngle.torches.shadow,
      second: shadowSecondAngle.torches.shadow,
    },
    renderedShadowLayers,
    occlusionStudy,
    depthOcclusion: {
      firstAngle: firstDepthOcclusion,
      oppositeAngle: oppositeDepthOcclusion,
    },
    final,
  };
  writeFileSync(join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Cape Physics visual audit: PASS (${captures.length} frames)`);
  console.log(`Ripple emissions: ${initial.water.rippleEmissions} -> ${final.water.rippleEmissions}`);
  console.log(`Output: ${outputRoot}`);
} catch (error) {
  const relevantDebuggerEvents = [...new Set(debuggerEvents.flatMap(({ method, params }) => {
    if (method === 'Runtime.consoleAPICalled') {
      const message = params.args?.map((argument) => (
        argument.value ?? argument.description ?? argument.type
      )).join(' ');
      return [`console ${params.type}: ${message}`];
    }
    if (method === 'Runtime.exceptionThrown') {
      return [`exception: ${params.exceptionDetails?.exception?.description
        ?? params.exceptionDetails?.text}`];
    }
    if (method === 'Log.entryAdded') {
      return [`${params.entry?.source} ${params.entry?.level}: ${params.entry?.text}`];
    }
    return [];
  }))].slice(0, 20).map((message) => message.slice(0, 4_000));
  throw new Error(
    `${error.message}\nHeadless browser log:\n${browserLog}`
      + `\nPage diagnostics:\n${relevantDebuggerEvents.join('\n')}`,
  );
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
      new Promise((resolve) => browser.once('exit', resolve)),
      delay(2_000),
    ]);
  }
  if (browser.exitCode === null) browser.kill();
  await close(server);
  try {
    rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
  } catch (error) {
    console.warn(`Host denied temporary audit-profile cleanup: ${error.message}`);
  }
}

function assertDepthOcclusion(probe, angle) {
  assert(probe.depthComposite.layerDepthTexture, `${angle} had no character-layer depth texture`);
  assert(probe.depthComposite.worldDepthConnected, `${angle} had no sampled world depth texture`);
  assert(
    probe.visibleLayerDelta >= 24,
    `${angle} did not render a measurable character-layer marker (${probe.visibleLayerDelta})`,
  );
  assert(
    probe.occludedLayerDelta <= 2,
    `${angle} let the character layer overwrite a nearer world object (${probe.occludedLayerDelta})`,
  );
}
