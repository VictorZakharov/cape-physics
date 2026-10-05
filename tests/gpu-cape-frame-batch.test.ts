import { expect, test } from 'bun:test';
import { FixedStepClock } from '../src/core/FixedStepClock';
import { GpuCapeFrameBatch } from '../src/physics/GpuCapeFrameBatch';
import { PHYSICS_STEP } from '../src/config';

test('a six-step scene catch-up submits one bounded cloth step with the final pose', () => {
  const batch = new GpuCapeFrameBatch(), clock = new FixedStepClock();
  const delivered: { step: number; pose: number }[] = [];
  let pose = 0;
  const submit = (step: number) => delivered.push({ step, pose });
  clock.reset(0);
  const timing = batch.run(() => clock.advance(60, step => {
    pose++;
    batch.enqueue(step, submit);
  }), submit);
  expect(timing.physicsSteps).toBe(6);
  expect(delivered).toEqual([{ step: 1 / 30, pose: 6 }]);
});

test('normal frames preserve elapsed time and empty frames submit no cloth work', () => {
  const batch = new GpuCapeFrameBatch(), delivered: number[] = [];
  const submit = (step: number) => delivered.push(step);
  for (const count of [0, 1, 2, 1]) batch.run(() => {
    for (let index = 0; index < count; index++) batch.enqueue(PHYSICS_STEP, submit);
  }, submit);
  expect(delivered).toEqual([PHYSICS_STEP, 2 * PHYSICS_STEP, PHYSICS_STEP]);
  expect(delivered.reduce((sum, step) => sum + step, 0)).toBeCloseTo(4 * PHYSICS_STEP);
});

test('harness steps remain immediate and failed frames cannot leak accumulated time', () => {
  const batch = new GpuCapeFrameBatch(), delivered: number[] = [];
  const submit = (step: number) => delivered.push(step);
  expect(() => batch.run(() => {
    batch.enqueue(PHYSICS_STEP, submit);
    throw Error('frame failed');
  }, submit)).toThrow('frame failed');
  batch.enqueue(PHYSICS_STEP, submit);
  batch.run(() => {}, submit);
  expect(delivered).toEqual([PHYSICS_STEP]);
});
