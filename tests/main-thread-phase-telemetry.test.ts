import { expect, test, spyOn } from 'bun:test';
import { MainThreadPhaseTelemetry, MAIN_THREAD_PHASES } from '../src/core/MainThreadPhaseTelemetry';
import { formatMainThreadPhases } from '../src/core/PerformanceReport';

test('coarse main-thread phases share callback scope, exclude warm-up, reset and expire', () => {
  const telemetry = new MainThreadPhaseTelemetry(); telemetry.reset(0, 3000);
  let now = 0; const clock = spyOn(performance, 'now').mockImplementation(() => now);
  const frame = (time: number) => {
    telemetry.beginFrame(time);
    for (let phase = 0; phase < 5; phase++) { const start = telemetry.begin(); now += phase + 1; telemetry.end(phase, start); }
    telemetry.finishFrame(time, 20);
  };
  try {
    for (let index = 0; index < 120; index++) frame(index * 20);
    expect(telemetry.getSnapshot(2400)).toBeNull();
    for (let index = 0; index < 119; index++) frame(3000 + index * 20);
    expect(telemetry.getSnapshot(5380)).toBeNull();
    frame(5380);
    const snapshot = telemetry.getSnapshot(5380)!;
    expect(snapshot.sampleCount).toBe(30); expect(snapshot.averageMilliseconds).toBe(20);
    expect(snapshot.phases).toEqual({ player: 1, controllers: 2, workerInputs: 3, workerResults: 4, presentation: 5, other: 5 });
    expect(MAIN_THREAD_PHASES.reduce((sum, phase) => sum + snapshot.phases[phase], 0)).toBe(20);
    expect(formatMainThreadPhases(snapshot)).toContain('sum 20.00 ms / sampled simulation phase 20.00 ms');
    expect(formatMainThreadPhases(snapshot)).toContain('not rescaled');
    expect(telemetry.sampling).toBe(false);
    expect(telemetry.getSnapshot(21000)).toBeNull();
    telemetry.reset(22000, 0); telemetry.enabled = false;
    for (let index = 0; index < 160; index++) frame(22000 + index);
    expect(telemetry.getSnapshot(22160)).toBeNull();
    expect(formatMainThreadPhases(null, false)).toContain('profiling disabled');
  } finally { clock.mockRestore(); }
});
