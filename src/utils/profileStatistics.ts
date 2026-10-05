import { percentile } from './math';

export function averageOrNull(values: readonly number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export function percentileOrNull(values: readonly number[], ratio: number): number | null {
  return values.length ? percentile(values, ratio) : null;
}
