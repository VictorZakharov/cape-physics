import { describe, expect, test } from 'bun:test';
import { BotPopulation, isPopulationOnlyChange } from '../src/player/BotPopulation';
import { DEFAULT_CUSTOMIZATION_SETTINGS } from '../src/ui/CustomizationPanel';

describe('incremental bot population', () => {
  test('coalesces rapid slider input without creating work in the input handler', () => {
    let count = 0;
    const changes: number[] = [];
    const population = new BotPopulation(() => count, (next) => { count = next; changes.push(next); });
    population.request(50); population.request(30); population.request(0);
    expect(changes).toEqual([]);
    expect(population.tick()).toBe(false);
    population.request(50);
    for (let frame = 0; frame < 10; frame += 1) population.tick();
    expect(count).toBe(10);
    expect(changes).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    population.request(3);
    for (let frame = 0; frame < 7; frame += 1) population.tick();
    expect(count).toBe(3);
    expect(population.tick()).toBe(false);
  });

  test('keeps the harness barrier responsive and follows a newer request during activation', async () => {
    const original = globalThis.requestAnimationFrame;
    let count = 0;
    let yields = 0;
    const population = new BotPopulation(() => count, (next) => { count = next; });
    globalThis.requestAnimationFrame = (callback) => {
      yields += 1;
      if (yields === 3) population.request(1);
      queueMicrotask(() => callback(yields));
      return yields;
    };
    try {
      population.request(50);
      await population.synchronize();
      expect(count).toBe(1);
      expect(yields).toBe(5);
    } finally { globalThis.requestAnimationFrame = original; }
  });

  test('distinguishes population input from physics or scene changes', () => {
    const settings = DEFAULT_CUSTOMIZATION_SETTINGS;
    expect(isPopulationOnlyChange(settings, { ...settings, bots: 50 })).toBe(true);
    expect(isPopulationOnlyChange(settings, { ...settings, width: 1.1 })).toBe(false);
    expect(isPopulationOnlyChange(settings, { ...settings, shadows: false })).toBe(false);
  });
});
