import type { WebGPURenderer } from 'three/webgpu';
import '../styles/webgpu-probe.css';
import {
  readWebGpuIsolationProbeWorkload,
  type WebGpuIsolationProbeWorkload,
} from './WebGpuIsolationProbeQuery';
import { compileWebGpuComputePipelines } from '../core/WebGpuComputeWarmup';

const PROBE_TIMEOUT_MS = 10_000;

interface ProbeStage {
  readonly name: string;
  readonly status: 'passed' | 'failed';
  readonly milliseconds: number;
  readonly detail?: unknown;
}

interface ProbeReport {
  capturedAt: string;
  workload: WebGpuIsolationProbeWorkload;
  status: 'idle' | 'running' | 'passed' | 'failed' | 'stopped';
  stages: ProbeStage[];
  adapterInfo: Record<string, unknown> | null;
  requestedFeatures: string[];
  workloadMetrics: Record<string, number>;
  deviceLost: unknown;
  uncapturedErrors: string[];
  cleanup: {
    rendererDisposed: boolean;
    deviceDestroyed: boolean;
    canvasReleased: boolean;
  };
  platform: string;
  userAgent: string;
  page: string;
}

declare global {
  interface Window {
    __WEBGPU_ISOLATION_PROBE__?: {
      getReport(): ProbeReport;
      start(): void;
      stop(): void;
    };
  }
}

function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return typeof error === 'string' ? error : JSON.stringify(error);
}

async function withDeadline<T>(
  label: string,
  operation: Promise<T>,
  timeoutMilliseconds = PROBE_TIMEOUT_MS,
): Promise<T> {
  let handle = 0;
  const timeout = new Promise<never>((_resolve, reject) => {
    handle = window.setTimeout(() => {
      reject(new Error(`${label} exceeded ${timeoutMilliseconds} ms`));
    }, timeoutMilliseconds);
  });
  try {
    return await Promise.race([operation, timeout]);
  } finally {
    window.clearTimeout(handle);
  }
}

export function runWebGpuIsolationProbe(): void {
  const app = document.querySelector<HTMLElement>('[data-app]');
  if (!app) throw new Error('Probe host is missing.');
  document.documentElement.classList.add('is-webgpu-probe');
  document.body.classList.add('is-webgpu-probe');
  const workload = readWebGpuIsolationProbeWorkload(window.location.search);
  const workloadDescription = workload === 'three-cloth'
    ? 'After the minimal cube, this runs one step and one rendered frame adapted from the official Three.js r185 webgpu_compute_cloth example. It still excludes our cape solver, cave, PMREM, post-processing, and WebGL.'
    : workload === 'app-cape'
      ? 'After the minimal cube, this builds the production one-cape compute graph, submits one 120 Hz step, and renders one cape frame. It excludes the character, cave, colliders, PMREM, post-processing, bots, animation loop, and WebGL.'
      : 'This does not load any cloth simulation, the cave, PMREM, post-processing, or WebGL.';
  const workloadLabel = workload === 'three-cloth'
    ? 'THREE.JS R185 COMPUTE CLOTH'
    : workload === 'app-cape'
      ? 'APPLICATION GPU CAPE ONLY'
      : 'MINIMAL CUBE';

  const panel = document.createElement('section');
  panel.className = 'webgpu-probe';
  panel.innerHTML = `
    <span class="webgpu-probe__eyebrow">ISOLATED DIAGNOSTIC</span>
    <h1>WebGPU lifecycle probe</h1>
    <p><b>Workload:</b> ${workloadLabel}</p>
    <p>${workloadDescription}</p>
    <p>It requests one minimal device, initializes one renderer, submits one cube frame, waits for the queue, and destroys everything.</p>
    <canvas width="320" height="180" aria-label="WebGPU probe output"></canvas>
    <strong data-probe-status>Ready — no GPU request has been made</strong>
    <ol data-probe-stages></ol>
    <div class="webgpu-probe__actions">
      <button type="button" data-probe-start>RUN BOUNDED PROBE</button>
      <button type="button" data-probe-stop disabled>STOP &amp; DESTROY</button>
      <button type="button" data-probe-copy>COPY REPORT</button>
    </div>
    <pre data-probe-report></pre>
  `;
  app.replaceChildren(panel);

  const canvas = panel.querySelector<HTMLCanvasElement>('canvas')!;
  const status = panel.querySelector<HTMLElement>('[data-probe-status]')!;
  const stageList = panel.querySelector<HTMLOListElement>('[data-probe-stages]')!;
  const reportOutput = panel.querySelector<HTMLElement>('[data-probe-report]')!;
  const startButton = panel.querySelector<HTMLButtonElement>('[data-probe-start]')!;
  const stopButton = panel.querySelector<HTMLButtonElement>('[data-probe-stop]')!;
  const copyButton = panel.querySelector<HTMLButtonElement>('[data-probe-copy]')!;

  const report: ProbeReport = {
    capturedAt: new Date().toISOString(),
    workload,
    status: 'idle',
    stages: [],
    adapterInfo: null,
    requestedFeatures: [],
    workloadMetrics: {},
    deviceLost: null,
    uncapturedErrors: [],
    cleanup: {
      rendererDisposed: false,
      deviceDestroyed: false,
      canvasReleased: false,
    },
    platform: navigator.platform || 'Unknown platform',
    userAgent: navigator.userAgent || 'Unavailable',
    page: window.location.href,
  };
  let device: GPUDevice | null = null;
  let renderer: WebGPURenderer | null = null;
  let stopping = false;
  let cleanupPromise: Promise<void> | null = null;
  let unexpectedDeviceLoss: Promise<never> | null = null;
  const disposables: Array<{ dispose(): void }> = [];

  const renderReport = (): void => {
    panel.dataset.probeState = report.status;
    reportOutput.textContent = JSON.stringify(report, null, 2);
  };
  const addStage = (
    name: string,
    stageStatus: ProbeStage['status'],
    startedAt: number,
    detail?: unknown,
  ): void => {
    report.stages.push({
      name,
      status: stageStatus,
      milliseconds: performance.now() - startedAt,
      detail,
    });
    const item = document.createElement('li');
    item.dataset.status = stageStatus;
    item.textContent = `${name}: ${stageStatus}`;
    stageList.append(item);
    renderReport();
  };
  const stage = async <T>(name: string, action: () => Promise<T>): Promise<T> => {
    status.textContent = name;
    const startedAt = performance.now();
    try {
      const value = await action();
      addStage(name, 'passed', startedAt);
      return value;
    } catch (error) {
      addStage(name, 'failed', startedAt, describeError(error));
      throw error;
    }
  };
  const assertRunning = (): void => {
    if (stopping) throw new Error('Probe stopped.');
  };
  const boundedGpuOperation = async <T>(
    label: string,
    operation: Promise<T>,
    timeoutMilliseconds = PROBE_TIMEOUT_MS,
  ): Promise<T> => {
    if (!unexpectedDeviceLoss) {
      return await withDeadline(label, operation, timeoutMilliseconds);
    }
    return await withDeadline(
      label,
      Promise.race([operation, unexpectedDeviceLoss]),
      timeoutMilliseconds,
    );
  };
  const cleanup = (): Promise<void> => {
    if (cleanupPromise) return cleanupPromise;
    stopping = true;
    cleanupPromise = (async () => {
      try {
        for (const disposable of disposables.splice(0)) disposable.dispose();
        if (renderer) {
          await renderer.setAnimationLoop(null);
          renderer.dispose();
          renderer = null;
          report.cleanup.rendererDisposed = true;
        }
      } finally {
        if (device) {
          device.destroy();
          device = null;
          report.cleanup.deviceDestroyed = true;
        }
        canvas.width = 1;
        canvas.height = 1;
        report.cleanup.canvasReleased = true;
        stopButton.disabled = true;
        renderReport();
      }
    })();
    return cleanupPromise;
  };

  const execute = async (): Promise<void> => {
    if (report.status !== 'idle') return;
    report.status = 'running';
    report.capturedAt = new Date().toISOString();
    startButton.disabled = true;
    stopButton.disabled = false;
    renderReport();
    try {
      const gpu = navigator.gpu;
      if (!gpu) throw new Error('WebGPU is not exposed by this browser.');
      const adapter = await stage('request-adapter', async () => {
        const result = await withDeadline(
          'Adapter request',
          gpu.requestAdapter(),
        );
        if (!result) throw new Error('Browser returned no WebGPU adapter.');
        return result;
      });
      assertRunning();
      report.adapterInfo = {
        vendor: adapter.info.vendor,
        architecture: adapter.info.architecture,
        device: adapter.info.device,
        description: adapter.info.description,
      };
      const requestedFeatures: GPUFeatureName[] = adapter.features.has('core-features-and-limits')
        ? ['core-features-and-limits']
        : [];
      report.requestedFeatures = [...requestedFeatures];
      renderReport();

      let discardRequestedDevice = false;
      const deviceRequest = adapter.requestDevice({
        requiredFeatures: requestedFeatures,
        requiredLimits: {
          maxStorageBuffersInVertexStage: 1,
          maxStorageBuffersPerShaderStage: 8,
        },
      });
      void deviceRequest.then((lateDevice) => {
        if (discardRequestedDevice) lateDevice.destroy();
      }).catch(() => undefined);
      let requestedDevice: GPUDevice;
      try {
        requestedDevice = await stage('request-minimal-device', async () => await withDeadline(
          'Device request',
          deviceRequest,
        ));
      } catch (error) {
        discardRequestedDevice = true;
        throw error;
      }
      if (stopping) {
        discardRequestedDevice = true;
        requestedDevice.destroy();
        return;
      }
      device = requestedDevice;
      const activeDevice = requestedDevice;
      activeDevice.addEventListener('uncapturederror', (event) => {
        const gpuEvent = event as GPUUncapturedErrorEvent;
        report.uncapturedErrors.push(gpuEvent.error.message);
        renderReport();
      });
      unexpectedDeviceLoss = new Promise<never>((_resolve, reject) => {
        void activeDevice.lost.then((info) => {
          report.deviceLost = { reason: info.reason, message: info.message };
          renderReport();
          if (!stopping && info.reason !== 'destroyed') {
            report.status = 'failed';
            status.textContent = 'DEVICE LOST — fully quit Chrome';
            void cleanup();
            reject(new Error(`Device lost: ${info.reason}: ${info.message}`));
          }
        }).catch(reject);
      });

      const THREE = await stage('load-three-webgpu-module', async () => await import('three/webgpu'));
      assertRunning();
      const initializedRenderer = await stage('initialize-empty-renderer', async () => {
        const value = new THREE.WebGPURenderer({
          canvas,
          device: activeDevice,
          antialias: false,
          alpha: false,
          depth: true,
          stencil: false,
        });
        try {
          await boundedGpuOperation('Renderer initialization', value.init());
          return value;
        } catch (error) {
          value.dispose();
          throw error;
        }
      });
      if (stopping) {
        initializedRenderer.dispose();
        report.cleanup.rendererDisposed = true;
        renderReport();
        return;
      }
      renderer = initializedRenderer;
      await stage('compile-and-submit-one-cube', async () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x071012);
        const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 10);
        camera.position.z = 3;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x77d8c6 });
        disposables.push(geometry, material);
        scene.add(new THREE.Mesh(geometry, material));
        await boundedGpuOperation(
          'Simple pipeline compilation',
          initializedRenderer.compileAsync(scene, camera),
        );
        assertRunning();
        initializedRenderer.render(scene, camera);
      });
      assertRunning();
      await stage('wait-for-submitted-work', async () => await boundedGpuOperation(
        'GPU queue drain',
        activeDevice.queue.onSubmittedWorkDone(),
      ));
      assertRunning();
      if (workload === 'three-cloth') {
        const [TSL, { createThreeComputeClothProbe }] = await stage(
          'load-three-reference-cloth-modules',
          async () => await Promise.all([
            import('three/tsl'),
            import('./ThreeComputeClothProbe'),
          ]),
        );
        assertRunning();
        const clothProbe = await stage('build-three-reference-cloth', async () => (
          createThreeComputeClothProbe(THREE, TSL)
        ));
        disposables.push(clothProbe);
        assertRunning();
        await stage('submit-one-three-reference-cloth-step', async () => {
          const [springForces, vertexForces] = clothProbe.computeNodes;
          if (!springForces || !vertexForces) throw new Error('Reference cloth kernels are missing.');
          await boundedGpuOperation('Reference cloth compute submission', (async () => {
            await initializedRenderer.computeAsync(springForces);
            assertRunning();
            await initializedRenderer.computeAsync(vertexForces);
          })());
        });
        assertRunning();
        await stage('compile-and-submit-three-reference-cloth-frame', async () => {
          await boundedGpuOperation(
            'Reference cloth render pipeline compilation',
            initializedRenderer.compileAsync(clothProbe.scene, clothProbe.camera),
          );
          assertRunning();
          initializedRenderer.render(clothProbe.scene, clothProbe.camera);
        });
        assertRunning();
        await stage('wait-for-three-reference-cloth-work', async () => await boundedGpuOperation(
          'Reference cloth queue drain',
          activeDevice.queue.onSubmittedWorkDone(),
        ));
        assertRunning();
      } else if (workload === 'app-cape') {
        const { createApplicationCapeProbe } = await stage(
          'load-application-cape-module',
          async () => await import('./ApplicationCapeProbe'),
        );
        assertRunning();
        const applicationCape = await stage('build-application-cape-graph', async () => (
          createApplicationCapeProbe(initializedRenderer)
        ));
        disposables.push(applicationCape);
        assertRunning();
        const pipelineNodes = applicationCape.getComputePipelineNodes();
        report.workloadMetrics.applicationCapeUniqueComputeNodes = pipelineNodes.length;
        await stage('compile-application-cape-compute-pipelines', async () => {
          await boundedGpuOperation(
            'Application cape compute pipeline compilation',
            compileWebGpuComputePipelines(
              initializedRenderer,
              pipelineNodes,
              {
                onPipelineStart: ({ loaded, total, name }) => {
                  status.textContent = `Compiling cape kernel ${loaded + 1}/${total}: ${name}`;
                  renderReport();
                },
                onProgress: ({ loaded }) => {
                  report.workloadMetrics.applicationCapeCompiledComputePipelines = loaded;
                  renderReport();
                },
              },
            ),
            30_000,
          );
        });
        assertRunning();
        await stage('submit-one-application-cape-step', async () => {
          const computeNodes = applicationCape.prepareStep();
          if (computeNodes.length === 0) throw new Error('Application cape graph is empty.');
          report.workloadMetrics.applicationCapeDispatchNodes = computeNodes.length;
          renderReport();
          await boundedGpuOperation(
            'Application cape compute submission',
            initializedRenderer.computeAsync(computeNodes),
          );
        });
        assertRunning();
        await stage('wait-for-application-cape-compute', async () => await boundedGpuOperation(
          'Application cape compute queue drain',
          activeDevice.queue.onSubmittedWorkDone(),
        ));
        assertRunning();
        applicationCape.usePositionOnlyMaterial();
        await stage('compile-and-submit-application-cape-position-frame', async () => {
          await boundedGpuOperation(
            'Application cape position-only pipeline compilation',
            initializedRenderer.compileAsync(applicationCape.scene, applicationCape.camera),
          );
          assertRunning();
          initializedRenderer.render(applicationCape.scene, applicationCape.camera);
        });
        assertRunning();
        applicationCape.useProductionMaterial();
        await stage('compile-and-submit-application-cape-frame', async () => {
          await boundedGpuOperation(
            'Application cape render pipeline compilation',
            initializedRenderer.compileAsync(applicationCape.scene, applicationCape.camera),
          );
          assertRunning();
          initializedRenderer.render(applicationCape.scene, applicationCape.camera);
        });
        assertRunning();
        await stage('wait-for-application-cape-work', async () => await boundedGpuOperation(
          'Application cape queue drain',
          activeDevice.queue.onSubmittedWorkDone(),
        ));
        assertRunning();
      }
      report.status = 'passed';
      status.textContent = 'PASS — destroying the isolated device';
      await cleanup();
      renderReport();
    } catch (error) {
      if (stopping) {
        renderReport();
        return;
      }
      report.status = 'failed';
      status.textContent = `${describeError(error)} — fully quit Chrome before another GPU test`;
      await cleanup();
      renderReport();
    }
  };

  const stop = (): void => {
    if (report.status !== 'running') return;
    report.status = 'stopped';
    status.textContent = 'Stopped — destroying the isolated device';
    void cleanup().then(renderReport);
  };

  startButton.onclick = () => { void execute(); };
  stopButton.onclick = stop;
  copyButton.onclick = () => {
    if (!navigator.clipboard) {
      copyButton.textContent = 'COPY UNAVAILABLE';
      return;
    }
    void navigator.clipboard.writeText(JSON.stringify(report, null, 2)).then(() => {
      copyButton.textContent = 'REPORT COPIED';
    }).catch(() => {
      copyButton.textContent = 'COPY FAILED';
    });
  };
  window.addEventListener('beforeunload', () => { void cleanup(); }, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && report.status === 'running') {
      report.status = 'stopped';
      status.textContent = 'Page hidden — probe stopped and device destroyed';
      void cleanup().then(renderReport);
    }
  });
  window.__WEBGPU_ISOLATION_PROBE__ = {
    getReport: () => structuredClone(report),
    start: () => { void execute(); },
    stop,
  };
  renderReport();
}
