export interface JoystickSample {
  readonly horizontal: number;
  readonly forward: number;
  readonly visualX: number;
  readonly visualY: number;
}

export interface TouchGestureDelta {
  readonly orbitX: number;
  readonly orbitY: number;
  readonly zoom: number;
}

interface TouchPoint {
  x: number;
  y: number;
}

const JOYSTICK_DEAD_ZONE = 0.12;
const PINCH_PIXELS_PER_ZOOM_UNIT = 72;
const NO_GESTURE_DELTA: TouchGestureDelta = {
  orbitX: 0,
  orbitY: 0,
  zoom: 0,
};

export function sampleJoystick(
  clientX: number,
  clientY: number,
  centerX: number,
  centerY: number,
  radius: number,
): JoystickSample {
  const safeRadius = Math.max(1, radius);
  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;
  const distance = Math.hypot(deltaX, deltaY);
  if (distance < 0.000_001) {
    return { horizontal: 0, forward: 0, visualX: 0, visualY: 0 };
  }

  const directionX = deltaX / distance;
  const directionY = deltaY / distance;
  const rawStrength = Math.min(1, distance / safeRadius);
  const strength = rawStrength <= JOYSTICK_DEAD_ZONE
    ? 0
    : (rawStrength - JOYSTICK_DEAD_ZONE) / (1 - JOYSTICK_DEAD_ZONE);
  const visualDistance = Math.min(distance, safeRadius);

  return {
    horizontal: strength === 0 ? 0 : directionX * strength,
    forward: strength === 0 ? 0 : -directionY * strength,
    visualX: directionX * visualDistance,
    visualY: directionY * visualDistance,
  };
}

export function shouldEnableTouchControls(
  maximumTouchPoints: number,
  hasCoarsePointer: boolean,
): boolean {
  return maximumTouchPoints > 0 || hasCoarsePointer;
}

export class TouchGestureState {
  private readonly points = new Map<number, TouchPoint>();

  public start(pointerId: number, x: number, y: number): boolean {
    if (!this.points.has(pointerId) && this.points.size >= 2) return false;
    this.points.set(pointerId, { x, y });
    return true;
  }

  public move(pointerId: number, x: number, y: number): TouchGestureDelta {
    const point = this.points.get(pointerId);
    if (!point) return NO_GESTURE_DELTA;

    if (this.points.size === 1) {
      const orbitX = x - point.x;
      const orbitY = y - point.y;
      point.x = x;
      point.y = y;
      return { orbitX, orbitY, zoom: 0 };
    }

    const previousDistance = this.getPinchDistance();
    point.x = x;
    point.y = y;
    const nextDistance = this.getPinchDistance();
    const zoom = previousDistance === null || nextDistance === null
      ? 0
      : (previousDistance - nextDistance) / PINCH_PIXELS_PER_ZOOM_UNIT;
    return { orbitX: 0, orbitY: 0, zoom };
  }

  public end(pointerId: number): void {
    this.points.delete(pointerId);
  }

  public clear(): void {
    this.points.clear();
  }

  public get pointerCount(): number {
    return this.points.size;
  }

  private getPinchDistance(): number | null {
    let first: TouchPoint | undefined;
    let second: TouchPoint | undefined;
    for (const point of this.points.values()) {
      if (!first) first = point;
      else {
        second = point;
        break;
      }
    }
    return first && second ? Math.hypot(second.x - first.x, second.y - first.y) : null;
  }
}
