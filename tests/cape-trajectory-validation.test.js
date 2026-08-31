import { describe, expect, test } from 'bun:test';
import {
  MAX_NECKLINE_ATTACHMENT_ERROR,
  measureAverageCenterlineShapeChange,
  MIN_TRAVELLING_WAVE_RATIO,
  MIN_TRAVELLING_WAVE_SHAPE_CHANGE_RATIO,
  validateNecklineAttachment,
  validateTravellingWave,
} from '../scripts/cape-trajectory-invariants.mjs';

describe('local cape trajectory validation', () => {
  test('accepts both neckline endpoints within the attachment tolerance', () => {
    expect(() => validateNecklineAttachment({
      scenario: 'forward-start',
      renderer: 'WebGPU',
      maximumError: MAX_NECKLINE_ATTACHMENT_ERROR,
    })).not.toThrow();
  });

  test('rejects a cape whose internally valid cloth has detached from the character', () => {
    expect(() => validateNecklineAttachment({
      scenario: 'forward-start',
      renderer: 'WebGPU',
      maximumError: 1.25,
    })).toThrow('forward-start WebGPU detached its neckline by 1.2500 m');
  });

  test('rejects non-finite attachment diagnostics', () => {
    expect(() => validateNecklineAttachment({
      scenario: 'raised-drop',
      renderer: 'WebGL',
      maximumError: Number.NaN,
    })).toThrow('raised-drop WebGL detached its neckline by NaN');
  });

  test('accepts WebGPU row twist that retains the WebGL travelling wave', () => {
    expect(() => validateTravellingWave({
      scenario: 'back-and-forth',
      webglAverageRowTwist: 0.2,
      webgpuAverageRowTwist: 0.2 * MIN_TRAVELLING_WAVE_RATIO,
      webglAverageShapeChange: 0.01,
      webgpuAverageShapeChange: 0.01 * MIN_TRAVELLING_WAVE_SHAPE_CHANGE_RATIO,
    })).not.toThrow();
  });

  test('rejects a rigid WebGPU sheet even when its position bounds are valid', () => {
    expect(() => validateTravellingWave({
      scenario: 'reverse',
      webglAverageRowTwist: 0.18,
      webgpuAverageRowTwist: 0.01,
      webglAverageShapeChange: 0.01,
      webgpuAverageShapeChange: 0.01,
    })).toThrow('reverse WebGPU lost its travelling cloth wave');
  });

  test('rejects non-finite WebGPU wave diagnostics', () => {
    expect(() => validateTravellingWave({
      scenario: 'reverse',
      webglAverageRowTwist: 0.18,
      webgpuAverageRowTwist: Number.NaN,
      webglAverageShapeChange: 0.01,
      webgpuAverageShapeChange: 0.01,
    })).toThrow('average row twist NaN');
  });

  test('rejects a rigid sheet even when its static row twist is large', () => {
    expect(() => validateTravellingWave({
      scenario: 'reverse',
      webglAverageRowTwist: 0.18,
      webgpuAverageRowTwist: 0.18,
      webglAverageShapeChange: 0.01,
      webgpuAverageShapeChange: 0.000_01,
    })).toThrow('WebGPU moved as a rigid sheet');
  });

  test('centerline shape change ignores rigid translation and detects deformation', () => {
    const createSample = (frame, translation, bend) => ({
      frame,
      particles: [
        translation, 0, 0,
        translation, 1 + bend, 0,
        translation, 2, 0,
      ],
    });
    const rigid = measureAverageCenterlineShapeChange({
      samples: [createSample(0, 0, 0), createSample(1, 1, 0)],
      columns: 1,
      rows: 3,
    });
    const deforming = measureAverageCenterlineShapeChange({
      samples: [createSample(0, 0, 0), createSample(1, 1, 0.25)],
      columns: 1,
      rows: 3,
    });
    expect(rigid).toBe(0);
    expect(deforming).toBeCloseTo(0.5);
  });
});
