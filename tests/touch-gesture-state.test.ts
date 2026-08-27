import { describe, expect, test } from 'bun:test';
import {
  sampleJoystick,
  shouldEnableTouchControls,
  TouchGestureState,
} from '../src/input/TouchGestureState';

describe('sampleJoystick', () => {
  test('maps an upward touch to forward movement with a centered dead zone', () => {
    expect(sampleJoystick(100, 100, 100, 100, 50)).toEqual({
      horizontal: 0,
      forward: 0,
      visualX: 0,
      visualY: 0,
    });

    const deadZone = sampleJoystick(105, 100, 100, 100, 50);
    expect(deadZone.horizontal).toBe(0);
    expect(deadZone.forward).toBe(0);
    expect(deadZone.visualX).toBeCloseTo(5, 8);

    const forward = sampleJoystick(100, 50, 100, 100, 50);
    expect(forward.horizontal).toBeCloseTo(0, 8);
    expect(forward.forward).toBeCloseTo(1, 8);
    expect(forward.visualY).toBeCloseTo(-50, 8);
  });

  test('clamps diagonal movement and the visual thumb to the stick radius', () => {
    const sample = sampleJoystick(200, 0, 100, 100, 50);
    expect(Math.hypot(sample.horizontal, sample.forward)).toBeCloseTo(1, 8);
    expect(Math.hypot(sample.visualX, sample.visualY)).toBeCloseTo(50, 8);
    expect(sample.horizontal).toBeGreaterThan(0);
    expect(sample.forward).toBeGreaterThan(0);
  });
});

describe('TouchGestureState', () => {
  test('orbits with one pointer and pinches with two without mixing gestures', () => {
    const gesture = new TouchGestureState();
    expect(gesture.start(1, 10, 20)).toBe(true);
    expect(gesture.move(1, 16, 24)).toEqual({
      orbitX: 6,
      orbitY: 4,
      zoom: 0,
    });

    expect(gesture.start(2, 30, 24)).toBe(true);
    const pinch = gesture.move(2, 46, 24);
    expect(pinch.orbitX).toBe(0);
    expect(pinch.orbitY).toBe(0);
    expect(pinch.zoom).toBeCloseTo(-16 / 72, 8);

    gesture.end(2);
    expect(gesture.move(1, 20, 29)).toEqual({
      orbitX: 4,
      orbitY: 5,
      zoom: 0,
    });
  });

  test('tracks at most two pointers and clears cancelled gesture state', () => {
    const gesture = new TouchGestureState();
    expect(gesture.start(1, 0, 0)).toBe(true);
    expect(gesture.start(2, 20, 0)).toBe(true);
    expect(gesture.start(3, 40, 0)).toBe(false);
    expect(gesture.pointerCount).toBe(2);

    gesture.clear();
    expect(gesture.pointerCount).toBe(0);
    expect(gesture.move(1, 5, 5)).toEqual({
      orbitX: 0,
      orbitY: 0,
      zoom: 0,
    });
  });
});

describe('shouldEnableTouchControls', () => {
  test('accepts either touch hardware or a coarse primary environment', () => {
    expect(shouldEnableTouchControls(1, false)).toBe(true);
    expect(shouldEnableTouchControls(0, true)).toBe(true);
    expect(shouldEnableTouchControls(0, false)).toBe(false);
  });
});
