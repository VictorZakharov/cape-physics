import { expect, test } from 'bun:test';
import { WorkerTelemetry } from '../src/physics/WorkerTelemetry';
test('separates compute, simulated timestep, latency, utilization, and actual delivery', () => {
  const timer = new WorkerTelemetry(); timer.reset(0, 0);
  for (const time of [0, 40, 80]) timer.record({ time, compute: 30, latency: 40, simulatedStep: 33.333, capes: 5 });
  const snapshot = timer.getSnapshot(80);
  expect(snapshot.computeMilliseconds).toBe(30);
  expect(snapshot.simulatedStepMilliseconds).toBeCloseTo(33.333);
  expect(snapshot.batchLatencyMilliseconds).toBe(40);
  expect(snapshot.stepHz).toBe(25);
  expect(snapshot.utilisationPercent).toBe(75);
  expect(snapshot.capeStepsPerSecond).toBe(125);
  expect(timer.getSnapshot(160).stepHz).toBe(12.5);
  expect(timer.getSnapshot(160).utilisationPercent).toBe(37.5);
  expect(timer.getSnapshot(16000).sampleCount).toBe(0);
  timer.reset(17000, 1000);
  timer.record({ time: 17500, compute: 99, latency: 99, simulatedStep: 33, capes: 5 });
  expect(timer.getSnapshot(17500).computeMilliseconds).toBeNull();
});
