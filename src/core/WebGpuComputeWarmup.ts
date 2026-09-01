import type * as THREE from 'three/webgpu';

export interface WebGpuComputeWarmupProgress {
  readonly loaded: number;
  readonly total: number;
  readonly name: string;
  readonly milliseconds: number;
}

export interface WebGpuComputeWarmupObserver {
  readonly onPipelineStart?: (
    progress: WebGpuComputeWarmupProgress,
  ) => void | Promise<void>;
  readonly onProgress?: (
    progress: WebGpuComputeWarmupProgress,
  ) => void | Promise<void>;
}

interface ComputeNodeInternal {
  readonly isComputeNode: true;
  readonly name: string;
  readonly version: number;
  readonly onInitFunction: ((context: { renderer: THREE.WebGPURenderer }) => void) | null;
  addEventListener(type: 'dispose', listener: () => void): void;
  removeEventListener(type: 'dispose', listener: () => void): void;
}

interface ComputeNodeBuilderInternal {
  buildAsync(): Promise<void>;
}

interface NodeManagerInternal {
  readonly backend: ComputeBackendInternal;
  readonly renderer: THREE.WebGPURenderer;
  get(node: ComputeNodeInternal): {
    nodeBuilderState?: unknown;
    version?: number;
  };
  delete(node: ComputeNodeInternal): void;
  updateForCompute(node: ComputeNodeInternal): void;
  _createNodeBuilderState(builder: ComputeNodeBuilderInternal): unknown;
}

interface BindingsInternal {
  deleteForCompute(node: ComputeNodeInternal): void;
  updateForCompute(node: ComputeNodeInternal): void;
  getForCompute(node: ComputeNodeInternal): readonly object[];
}

interface ComputeProgramInternal {
  readonly stage: string;
  readonly name: string;
  readonly module: GPUShaderModule;
}

interface ComputePipelineInternal {
  readonly computeProgram: ComputeProgramInternal;
}

interface ComputeBackendInternal {
  readonly device: GPUDevice;
  createNodeBuilder(
    node: ComputeNodeInternal,
    renderer: THREE.WebGPURenderer,
  ): ComputeNodeBuilderInternal;
  createComputePipeline(
    pipeline: ComputePipelineInternal,
    bindings: readonly object[],
  ): void;
  get(object: object): Record<string, unknown>;
}

interface PipelinesInternal {
  readonly backend: ComputeBackendInternal;
  has(node: ComputeNodeInternal): boolean;
  delete(node: ComputeNodeInternal): void;
  getForCompute(node: ComputeNodeInternal, bindings: readonly object[]): unknown;
}

interface RendererComputeInternals {
  readonly _nodes: NodeManagerInternal;
  readonly _bindings: BindingsInternal;
  readonly _pipelines: PipelinesInternal;
}

const activeWarmups = new WeakSet<object>();

function errorDescription(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : JSON.stringify(error);
}

async function yieldToBrowser(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function buildComputeNodeAsync(
  nodes: NodeManagerInternal,
  computeNode: ComputeNodeInternal,
): Promise<void> {
  const computeData = nodes.get(computeNode);
  if (
    computeData.nodeBuilderState !== undefined
    && computeData.version === computeNode.version
  ) {
    return;
  }

  const nodeBuilder = nodes.backend.createNodeBuilder(computeNode, nodes.renderer);
  await nodeBuilder.buildAsync();
  computeData.nodeBuilderState = nodes._createNodeBuilderState(nodeBuilder);
  computeData.version = computeNode.version;
}

async function createComputePipelineAsync(
  backend: ComputeBackendInternal,
  pipeline: ComputePipelineInternal,
  bindings: readonly object[],
): Promise<void> {
  const { device } = backend;
  if (typeof device.createComputePipelineAsync !== 'function') {
    throw new Error('This WebGPU implementation does not expose createComputePipelineAsync().');
  }
  const computeStage = pipeline.computeProgram;
  const computeProgram = backend.get(computeStage).module as GPUProgrammableStage;
  if (!computeProgram) throw new Error('Three.js did not create the compute shader module.');
  const pipelineData = backend.get(pipeline);
  const bindGroupLayouts = bindings.map((bindingGroup) => {
    const bindingData = backend.get(bindingGroup);
    const layout = bindingData.layout as { readonly layoutGPU?: GPUBindGroupLayout } | undefined;
    if (!layout?.layoutGPU) throw new Error('Three.js did not create a compute bind-group layout.');
    return layout.layoutGPU;
  });
  const pipelineLabel = `computePipeline_${computeStage.stage}${computeStage.name
    ? `_${computeStage.name}`
    : ''}`;

  device.pushErrorScope('validation');
  let asynchronousError: unknown = null;
  try {
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts });
    pipelineData.pipeline = await device.createComputePipelineAsync({
      label: pipelineLabel,
      compute: computeProgram,
      layout: pipelineLayout,
    });
  } catch (error) {
    asynchronousError = error;
  }
  const validationError = await device.popErrorScope();
  if (validationError || asynchronousError) {
    pipelineData.error = true;
    throw new Error(
      `Async compute pipeline creation failed (${pipelineLabel}): ${validationError?.message
        ?? errorDescription(asynchronousError)}`,
    );
  }
}

/**
 * Application-local backport of Three.js r186's compileComputeAsync().
 *
 * Three r185.1 synchronously builds every TSL compute pipeline inside the first
 * compute() call. Chrome/Dawn can defer that cold work into the first queue
 * submission, freezing the browser for seconds. This adapter uses the same
 * renderer caches but asks WebGPU for asynchronous pipeline creation and yields
 * between unique kernels. Remove it after upgrading to a Three release that
 * includes mrdoob/three.js#32551.
 *
 * Call only during startup, before the animation loop begins.
 */
export async function compileWebGpuComputePipelines(
  renderer: THREE.WebGPURenderer,
  requestedNodes: readonly THREE.ComputeNode[],
  observer: WebGpuComputeWarmupObserver = {},
): Promise<void> {
  const rendererKey = renderer as unknown as object;
  if (activeWarmups.has(rendererKey)) {
    throw new Error('A WebGPU compute-pipeline warm-up is already running.');
  }
  const computeNodes = [...new Set(requestedNodes)] as unknown as ComputeNodeInternal[];
  if (computeNodes.length === 0 || computeNodes.some((node) => node.isComputeNode !== true)) {
    throw new Error('WebGPU compute-pipeline warm-up expects at least one ComputeNode.');
  }
  const internals = renderer as unknown as RendererComputeInternals;
  const { _nodes: nodes, _bindings: bindings, _pipelines: pipelines } = internals;
  if (!nodes || !bindings || !pipelines) {
    throw new Error('Three.js compute-pipeline internals are unavailable.');
  }
  const backend = pipelines.backend;
  if (!backend?.device || backend !== nodes.backend) {
    throw new Error('Three.js WebGPU backend internals are inconsistent.');
  }

  activeWarmups.add(rendererKey);
  try {
    for (let index = 0; index < computeNodes.length; index += 1) {
      const computeNode = computeNodes[index]!;
      const startedAt = performance.now();
      await observer.onPipelineStart?.({
        loaded: index,
        total: computeNodes.length,
        name: computeNode.name || `kernel ${index + 1}`,
        milliseconds: 0,
      });
      if (!pipelines.has(computeNode)) {
        const dispose = (): void => {
          computeNode.removeEventListener('dispose', dispose);
          pipelines.delete(computeNode);
          bindings.deleteForCompute(computeNode);
          nodes.delete(computeNode);
        };
        computeNode.addEventListener('dispose', dispose);
        computeNode.onInitFunction?.call(computeNode, { renderer });
      }

      await buildComputeNodeAsync(nodes, computeNode);
      nodes.updateForCompute(computeNode);
      bindings.updateForCompute(computeNode);
      const computeBindings = bindings.getForCompute(computeNode);
      const originalCreateComputePipeline = backend.createComputePipeline;
      let pipelineCreation: Promise<void> | null = null;
      backend.createComputePipeline = (pipeline, pipelineBindings): void => {
        pipelineCreation = createComputePipelineAsync(backend, pipeline, pipelineBindings);
      };
      try {
        pipelines.getForCompute(computeNode, computeBindings);
      } finally {
        backend.createComputePipeline = originalCreateComputePipeline;
      }
      if (pipelineCreation) await pipelineCreation;

      const loaded = index + 1;
      await observer.onProgress?.({
        loaded,
        total: computeNodes.length,
        name: computeNode.name || `kernel ${loaded}`,
        milliseconds: performance.now() - startedAt,
      });
      if (loaded < computeNodes.length) await yieldToBrowser();
    }
  } finally {
    activeWarmups.delete(rendererKey);
  }
}
