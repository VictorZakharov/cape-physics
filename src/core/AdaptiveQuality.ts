import type { PerformanceSnapshot } from './PerformanceMonitor';

export interface QualityState {
  readonly scale: number;
  readonly label: string;
}

export class AdaptiveQuality {
  private scale = 1;
  private lastEvaluation = 0;
  private stableSince = 0;

  public constructor(private readonly apply: (state: QualityState) => void) {}

  public observe(time: number, performance: PerformanceSnapshot): void {
    if (time < 4 || time - this.lastEvaluation < 2 || performance.averageFps <= 0) return;
    this.lastEvaluation = time;
    const target = Math.min(138, Math.max(55, performance.refreshEstimate * 0.9));
    const underBudget = performance.averageFps < target * 0.82;
    const comfortablyFast = performance.averageFps > target * 0.98;

    if (underBudget && this.scale > 0.66) {
      this.scale = Math.max(0.66, this.scale - 0.1);
      this.stableSince = time;
      this.emit();
      return;
    }
    if (!comfortablyFast) {
      this.stableSince = time;
      return;
    }
    if (this.stableSince === 0) this.stableSince = time;
    if (time - this.stableSince > 7 && this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.05);
      this.stableSince = time;
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
