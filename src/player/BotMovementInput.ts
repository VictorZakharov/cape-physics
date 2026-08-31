import * as THREE from 'three';
import type { CharacterMovementInput } from './CharacterController';

export const BOT_COUNT_RANGE = Object.freeze({ min: 0, max: 10, step: 1 });

const CYCLE_SECONDS = 8;
const PHASE_OFFSET_SECONDS = 0.61;
const WALK_SECONDS = 1.15;
const PAUSE_SECONDS = 0.85;
const QUARTER_TURN = Math.PI / 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function normalizeBotCount(value: number): number {
  if (!Number.isFinite(value)) return BOT_COUNT_RANGE.min;
  return THREE.MathUtils.clamp(
    Math.round(value),
    BOT_COUNT_RANGE.min,
    BOT_COUNT_RANGE.max,
  );
}

/**
 * Deterministic closed patrol: walk one side of a square, pause, then turn.
 * Per-bot phase and heading offsets prevent the stress crowd from moving in
 * lockstep while guaranteeing that every bot returns toward its spawn area.
 */
export class BotMovementInput implements CharacterMovementInput {
  private readonly movement = new THREE.Vector2();
  private readonly headingOffset: number;
  private readonly phaseOffset: number;

  public constructor(index: number) {
    this.headingOffset = index * GOLDEN_ANGLE;
    this.phaseOffset = index * PHASE_OFFSET_SECONDS;
  }

  public update(time: number): void {
    const cycleTime = THREE.MathUtils.euclideanModulo(
      time + this.phaseOffset,
      CYCLE_SECONDS,
    );
    const leg = Math.floor(cycleTime / (WALK_SECONDS + PAUSE_SECONDS));
    const legTime = cycleTime - leg * (WALK_SECONDS + PAUSE_SECONDS);
    if (legTime >= WALK_SECONDS) {
      this.movement.set(0, 0);
      return;
    }

    const heading = this.headingOffset + leg * QUARTER_TURN;
    this.movement.set(Math.sin(heading), Math.cos(heading));
  }

  public getMovement(): THREE.Vector2 {
    return this.movement;
  }

  public isRunning(): boolean {
    return false;
  }

  public consumeJump(): boolean {
    return false;
  }
}
