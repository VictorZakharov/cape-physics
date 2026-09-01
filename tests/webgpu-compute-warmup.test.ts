import { afterEach, describe, expect, test } from 'bun:test';
import type * as THREE from 'three/webgpu';
import { compileWebGpuComputePipelines } from '../src/core/WebGpuComputeWarmup';

const originalRequestAnimationFrame = globalThis.requestAnimationFrame;

afterEach(() => {
  globalThis.requestAnimationFrame = originalRequestAnimationFrame;
});

describe('WebGPU compute pipeline warm-up', () => {
  test('uses async pipeline creation, yields between kernels, and never dispatches them', async () => {
    const events: string[] = [];
    const starts: number[] = [];
    const progress: number[] = [];
    const builtShaders: Array<{ loaded: number; sourceCharacters: number }> = [];
    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback): number => {
      events.push('yield');
      callback(performance.now());
      return 1;
    }) as typeof requestAnimationFrame;

    const device = {
      pushErrorScope: () => { events.push('push-error-scope'); },
      popErrorScope: async () => null,
      createPipelineLayout: () => ({ label: 'layout' }),
      createComputePipelineAsync: async () => {
        events.push('create-pipeline-async');
        return { label: 'pipeline' };
      },
    };
    const program = { stage: 'compute', name: 'test', module: {} };
    const binding = {};
    const nodeData = new WeakMap<object, { nodeBuilderState?: unknown; version?: number }>();
    const backendData = new WeakMap<object, Record<string, unknown>>([
      [program, { module: { module: {}, entryPoint: 'main' } }],
      [binding, { layout: { layoutGPU: {} } }],
    ]);
    let syncPipelineCreations = 0;
    const backend = {
      device,
      createNodeBuilder: () => ({
        buildAsync: async () => { events.push('build-node-async'); },
      }),
      createComputePipeline: (_pipeline: object, _bindings: readonly object[]) => {
        syncPipelineCreations += 1;
      },
      get: (object: object) => {
        let data = backendData.get(object);
        if (!data) {
          data = {};
          backendData.set(object, data);
        }
        return data;
      },
    };
    const compiled = new WeakSet<object>();
    const nodes = {
      backend,
      renderer: null as unknown,
      get: (node: object) => {
        let data = nodeData.get(node);
        if (!data) {
          data = {};
          nodeData.set(node, data);
        }
        return data;
      },
      delete: () => {},
      updateForCompute: () => {},
      _createNodeBuilderState: () => ({ bindings: [binding], computeShader: 'fn main() {}' }),
    };
    const bindings = {
      deleteForCompute: () => {},
      updateForCompute: () => {},
      getForCompute: () => [binding],
    };
    const pipelines = {
      backend,
      has: (node: object) => compiled.has(node),
      delete: () => {},
      getForCompute: (node: object, computeBindings: readonly object[]) => {
        const pipeline = { computeProgram: program };
        compiled.add(node);
        backend.createComputePipeline(pipeline, computeBindings);
        return pipeline;
      },
    };
    const listener = () => {};
    const computeNodes = ['first', 'second'].map((name) => ({
      isComputeNode: true,
      name,
      version: 0,
      onInitFunction: null,
      addEventListener: listener,
      removeEventListener: listener,
    })) as unknown as THREE.ComputeNode[];
    const renderer = {
      backend,
      _nodes: nodes,
      _bindings: bindings,
      _pipelines: pipelines,
    } as unknown as THREE.WebGPURenderer;
    nodes.renderer = renderer;

    await compileWebGpuComputePipelines(renderer, computeNodes, {
      onPipelineStart: ({ loaded }) => {
        starts.push(loaded);
      },
      onProgress: ({ loaded }) => {
        progress.push(loaded);
      },
      onShaderBuilt: ({ loaded, sourceCharacters }) => {
        builtShaders.push({ loaded, sourceCharacters });
      },
    });

    expect(syncPipelineCreations).toBe(0);
    expect(events.filter((event) => event === 'build-node-async')).toHaveLength(2);
    expect(events.filter((event) => event === 'create-pipeline-async')).toHaveLength(2);
    expect(events.filter((event) => event === 'yield')).toHaveLength(1);
    expect(starts).toEqual([0, 1]);
    expect(progress).toEqual([1, 2]);
    expect(builtShaders).toEqual([
      { loaded: 0, sourceCharacters: 12 },
      { loaded: 1, sourceCharacters: 12 },
    ]);
  });
});
