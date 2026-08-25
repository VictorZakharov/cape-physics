import { describe, expect, test } from 'bun:test';
import { runTechDemoHarness } from '../src/testing/TechDemoHarness';

describe('procedural tech demo harness', () => {
  test('survives a representative traversal inside its budgets', () => {
    const report = runTechDemoHarness(4);
    expect(report.capeStateFinite).toBe(true);
    expect(report.water.puddles).toBeGreaterThanOrEqual(5);
    expect(report.scene.shadowCastingLights).toBe(1);
  }, 15_000);
});
