import { describe, expect, test } from 'bun:test';
import {
  BotMovementInput,
  normalizeBotCount,
} from '../src/player/BotMovementInput';

describe('performance bot movement', () => {
  test('normalizes the UI count to the supported integer range', () => {
    expect(normalizeBotCount(-4)).toBe(0);
    expect(normalizeBotCount(4.6)).toBe(5);
    expect(normalizeBotCount(99)).toBe(10);
    expect(normalizeBotCount(Number.NaN)).toBe(0);
  });

  test('alternates deterministic walking and standing phases', () => {
    const first = new BotMovementInput(0);
    first.update(0.4);
    expect(first.getMovement().length()).toBeCloseTo(1);
    first.update(1.5);
    expect(first.getMovement().length()).toBe(0);
    first.update(2.4);
    expect(first.getMovement().length()).toBeCloseTo(1);

    const repeated = new BotMovementInput(0);
    repeated.update(2.4);
    expect(repeated.getMovement().toArray()).toEqual(first.getMovement().toArray());
  });

  test('offsets bots so the crowd does not move in lockstep', () => {
    const first = new BotMovementInput(0);
    const second = new BotMovementInput(1);
    first.update(0.2);
    second.update(0.2);
    expect(second.getMovement().toArray()).not.toEqual(first.getMovement().toArray());
  });
});
