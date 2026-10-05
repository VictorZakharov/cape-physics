import { normalizeBotCount } from './BotMovementInput';
import type { CustomizationSettings } from '../ui/CustomizationPanel';

export function isPopulationOnlyChange(before: CustomizationSettings, after: CustomizationSettings): boolean {
  return before.length === after.length && before.width === after.width
    && before.stiffness === after.stiffness && before.damping === after.damping
    && before.weight === after.weight && before.lights === after.lights
    && before.shadows === after.shadows && before.reflections === after.reflections;
}

/** Coalesce slider input and perform one population change per scene frame. */
export class BotPopulation {
  private target = 0;

  public constructor(private readonly count: () => number, private readonly reconcile: (count: number) => void) {}

  public request(count: number): void { this.target = normalizeBotCount(count); }

  public tick(): boolean {
    const count = this.count();
    if (count === this.target) return false;
    this.reconcile(count + Math.sign(this.target - count));
    return true;
  }

  /** Harness barrier: let browser input/animation run between activation slices. */
  public async synchronize(): Promise<void> {
    while (this.tick()) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}
