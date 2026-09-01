import { describe, expect, test } from 'bun:test';
import {
  DEFAULT_SOURCE_LINE_BUDGET,
  SOURCE_LINE_BUDGETS,
  countSourceLines,
  getSourceLineBudget,
} from '../scripts/check-source-size';

describe('source-size CI budget', () => {
  test('counts physical source lines across newline styles', () => {
    expect(countSourceLines('')).toBe(0);
    expect(countSourceLines('one')).toBe(1);
    expect(countSourceLines('one\ntwo\n')).toBe(2);
    expect(countSourceLines('one\r\ntwo\r\nthree')).toBe(3);
  });

  test('caps new files and keeps every exception explicit', () => {
    expect(getSourceLineBudget('src/new-module.ts')).toBe(DEFAULT_SOURCE_LINE_BUDGET);
    expect(SOURCE_LINE_BUDGETS.size).toBe(4);
    expect(getSourceLineBudget('src/physics/GpuCapeSimulation.ts')).toBe(1_225);
  });
});
