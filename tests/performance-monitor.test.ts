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

  public getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }
}

const reportDetails: PerformanceReportDetails = {
  renderer: {
    backend: 'WebGL 2.0',
    vendor: 'test',
    device: 'test',
    preference: 'webgl',
    actual: 'webgl',
    fallback: false,
    drawCalls: 1,
    triangles: 138_498,
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
    botCount: 0,
    simulatedCapes: 1,
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

function createMonitorHarness(): {
  readonly monitor: PerformanceMonitor;
  readonly elements: Map<string, FakeHudElement>;
} {
  const elements = new Map<string, FakeHudElement>();
  const root = {
    querySelector: (selector: string) => {
      let element = elements.get(selector);
      if (!element) {
        element = new FakeHudElement();
        elements.set(selector, element);
      }
      return element;
    },
  } as unknown as ParentNode;
  return {
    monitor: new PerformanceMonitor(() => reportDetails, root),
    elements,
  };
}

function createMonitor(): PerformanceMonitor {
  return createMonitorHarness().monitor;
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

  test('calculates 1% low from the average of the slowest one percent of frames', () => {
    const monitor = createMonitor();
    let timestamp = 0;
    monitor.recordFrame(timestamp);
    for (let frame = 0; frame < 990; frame += 1) {
      timestamp += 10;
      monitor.recordFrame(timestamp);
    }
    for (let frame = 0; frame < 5; frame += 1) {
      timestamp += 20;
      monitor.recordFrame(timestamp);
    }
    for (let frame = 0; frame < 5; frame += 1) {
      timestamp += 50;
      monitor.recordFrame(timestamp);
    }

    expect(monitor.getSnapshot().onePercentLow).toBeCloseTo(1_000 / 35, 5);
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

  test('plots and labels the same precise FPS metrics used by the report', () => {
    const { monitor, elements } = createMonitorHarness();
    let timestamp = 0;
    monitor.recordFrame(timestamp);
    for (let frame = 1; frame <= 160; frame += 1) {
      timestamp += frame % 41 === 0 ? 8.1 : 6.9;
      monitor.recordWorkload(timestamp, {
        physicsMilliseconds: 0.15,
        sceneMilliseconds: 0.03,
        renderMilliseconds: 0.83,
        physicsSteps: 1,
      });
      monitor.recordFrame(timestamp);
    }

    const snapshot = monitor.getSnapshot();
    const workload = monitor.getWorkloadSnapshot();
    expect(elements.get('[data-fps]')?.textContent).toBe(snapshot.averageFps.toFixed(2));
    expect(elements.get('[data-fps-average]')?.textContent).toBe(
      snapshot.averageFps.toFixed(2),
    );
    expect(elements.get('[data-fps-low]')?.textContent).toBe(
      snapshot.onePercentLow.toFixed(2),
    );
    expect(elements.get('[data-frame-time]')?.textContent).toBe(
      snapshot.averageFrameTime.toFixed(2),
    );
    expect(elements.get('[data-frame-p95]')?.textContent).toBe(
      snapshot.p95FrameTime.toFixed(2),
    );
    expect(elements.get('[data-main-work]')?.textContent).toBe(
      workload.averageMainThreadMilliseconds.toFixed(2),
    );
    expect(elements.get('[data-main-p95]')?.textContent).toBe(
      workload.p95MainThreadMilliseconds.toFixed(2),
    );
    expect(elements.get('[data-triangles]')?.textContent).toBe('138,498');
    expect(elements.get('[data-fps-average-line]')?.getAttribute('d')).not.toBe('');
    expect(elements.get('[data-fps-low-line]')?.getAttribute('d')).not.toBe('');
  });
});
