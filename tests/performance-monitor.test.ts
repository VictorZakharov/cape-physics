import { describe, expect, test } from 'bun:test';
import { PerformanceMonitor } from '../src/core/PerformanceMonitor';
import type { PerformanceReportDetails } from '../src/core/PerformanceReport';

class FakeHudElement {
  public textContent = '';
  public readonly dataset: Record<string, string> = {};
  public readonly classList = { toggle: (): void => undefined };
  private readonly attributes = new Map<string, string>();

  public addEventListener(): void {}
  public removeEventListener(): void {}

  public setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
}

const reportDetails: PerformanceReportDetails = {
  renderer: {
    backend: 'WebGL 2.0',
    vendor: 'test',
    device: 'test',
    drawCalls: 1,
    triangles: 1,
    programs: 1,
  },
  canvas: {
    drawingBufferWidth: 1,
    drawingBufferHeight: 1,
    cssWidth: 1,
    cssHeight: 1,
  },
  quality: { label: 'ADAPTIVE ULTRA', scale: 1, targetResizes: 2 },
  workload: {
    averageMainThreadMilliseconds: 0,
    p95MainThreadMilliseconds: 0,
    averagePhysicsMilliseconds: 0,
    averageSceneMilliseconds: 0,
    averageRenderMilliseconds: 0,
    averagePhysicsSteps: 0,
    maximumPhysicsSteps: 0,
    sampleCount: 0,
  },
  capeSolver: null,
  scene: {
    simulationSeconds: 0,
    capeSleeping: false,
    worldColliders: 0,
    activeRipples: 0,
  },
  page: {
    visibility: 'visible',
    focused: true,
    devicePixelRatio: 1,
    multipleScreens: null,
    url: 'https://example.test/',
  },
  runtime: { platform: 'test', userAgent: 'test' },
};

function createMonitor(): PerformanceMonitor {
  const element = new FakeHudElement();
  const root = {
    querySelector: () => element,
  } as unknown as ParentNode;
  return new PerformanceMonitor(() => reportDetails, root);
}

describe('PerformanceMonitor', () => {
  test('keeps a stable 15-second window during a sustained 144 Hz stream', () => {
    const monitor = createMonitor();
    const frameTime = 1_000 / 144;
    monitor.recordFrame(0);
    for (let frame = 1; frame <= 4_320; frame += 1) {
      monitor.recordFrame(frame * frameTime);
    }

    const snapshot = monitor.getSnapshot();
    expect(snapshot.averageFps).toBeCloseTo(144, 5);
    expect(snapshot.onePercentLow).toBeCloseTo(144, 5);
    expect(snapshot.sampleCount).toBeGreaterThan(2_100);
    expect(snapshot.sampleCount).toBeLessThan(2_200);
    expect(snapshot.windowElapsedMilliseconds).toBeGreaterThan(14_900);
    expect(snapshot.windowElapsedMilliseconds).toBeLessThanOrEqual(15_000);
  });

  test('aggregates measured main-thread phases without treating them as FPS', () => {
    const monitor = createMonitor();
    monitor.recordFrame(0);
    for (let frame = 1; frame <= 20; frame += 1) {
      const timestamp = frame * 16;
      monitor.recordFrame(timestamp);
      monitor.recordWorkload(timestamp, {
        physicsMilliseconds: 2,
        sceneMilliseconds: 1,
        renderMilliseconds: 3,
        physicsSteps: 2,
      });
    }

    expect(monitor.getWorkloadSnapshot()).toMatchObject({
      averageMainThreadMilliseconds: 6,
      p95MainThreadMilliseconds: 6,
      averagePhysicsMilliseconds: 2,
      averageSceneMilliseconds: 1,
      averageRenderMilliseconds: 3,
      averagePhysicsSteps: 2,
      maximumPhysicsSteps: 2,
    });
  });
});
