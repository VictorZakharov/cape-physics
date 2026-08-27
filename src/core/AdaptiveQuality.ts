import type { PerformanceSnapshot } from './PerformanceMonitor';

export interface QualityState {
  readonly scale: number;
  readonly label: string;
}

export class AdaptiveQuality {
  private scale = 1;
  private lastEvaluation = 0;
  private stableSince = 0;
  private lastResize = Number.NEGATIVE_INFINITY;

  public constructor(private readonly apply: (state: QualityState) => void) {}

  public observe(time: number, performance: PerformanceSnapshot): void {
    if (time < 4 || time - this.lastEvaluation < 2.5 || performance.averageFps <= 0) return;
    this.lastEvaluation = time;
    const target = Math.min(138, Math.max(55, performance.refreshEstimate * 0.9));
    const underBudget = performance.averageFps < target * 0.82;
    const comfortablyFast = performance.averageFps > target * 0.98;

    if (underBudget) {
      this.stableSince = 0;
      if (this.scale <= 0.66 || time - this.lastResize < 12) return;
      const severity = performance.averageFps / Math.max(1, target);
      // Pixel fill grows approximately with scale squared. Estimate the scale
      // that would recover the target, but cap a single change at 20% so one
      // transient report cannot collapse image quality.
      const estimatedScale = this.scale * Math.sqrt(severity / 0.96);
      const maximumReduction = severity < 0.72 ? 0.2 : 0.1;
      this.scale = Math.max(
        0.66,
        Math.round(
          Math.max(this.scale - maximumReduction, estimatedScale) * 100,
        ) / 100,
      );
      this.lastResize = time;
      this.emit();
      return;
    }
    if (!comfortablyFast) {
      this.stableSince = time;
      return;
    }
    if (this.stableSince === 0) this.stableSince = time;
    if (time - this.stableSince > 18 && time - this.lastResize >= 12 && this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.05);
      this.stableSince = time;
      this.lastResize = time;
      this.emit();
    }
  }

  public getState(): QualityState {
    return { scale: this.scale, label: this.labelForScale() };
  }

  private emit(): void {
    this.apply(this.getState());
  }

  private labelForScale(): string {
    if (this.scale >= 0.91) return 'ADAPTIVE ULTRA';
    if (this.scale >= 0.76) return 'ADAPTIVE HIGH';
    return 'ADAPTIVE PERFORMANCE';
  }
}
