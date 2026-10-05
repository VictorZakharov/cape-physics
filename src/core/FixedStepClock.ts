import { MAX_FRAME_DELTA, MAX_PHYSICS_STEPS, PHYSICS_STEP } from '../config';

export interface FrameTiming {
  readonly delta: number;
  readonly elapsed: number;
  readonly interpolation: number;
  readonly physicsSteps: number;
}

export class FixedStepClock {
  private lastTimestamp: number | null = null;
  private accumulator = 0;
  private elapsed = 0;

  public advance(timestamp: number, simulate: (step: number) => void, maximumSteps = MAX_PHYSICS_STEPS): FrameTiming {
    const stepLimit = Math.max(1, Math.min(MAX_PHYSICS_STEPS, Math.floor(maximumSteps)));
    if (this.lastTimestamp === null) this.lastTimestamp = timestamp;
    const delta = Math.min(MAX_FRAME_DELTA, Math.max(0, (timestamp - this.lastTimestamp) / 1_000));
    this.lastTimestamp = timestamp;
    this.accumulator += delta;
    this.elapsed += delta;
    let physicsSteps = 0;

    while (this.accumulator >= PHYSICS_STEP && physicsSteps < stepLimit) {
      simulate(PHYSICS_STEP);
      this.accumulator -= PHYSICS_STEP;
      physicsSteps += 1;
    }
    if (physicsSteps === stepLimit) this.accumulator = Math.min(this.accumulator, PHYSICS_STEP);

    return {
      delta,
      elapsed: this.elapsed,
      interpolation: this.accumulator / PHYSICS_STEP,
      physicsSteps,
    };
  }

  public reset(timestamp: number | null = null): void {
    this.lastTimestamp = timestamp;
    this.accumulator = 0;
  }
}
