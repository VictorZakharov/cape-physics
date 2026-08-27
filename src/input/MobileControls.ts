import {
  sampleJoystick,
  shouldEnableTouchControls,
  TouchGestureState,
} from './TouchGestureState';

export interface MobileControlInput {
  setTouchMovement(horizontal: number, forward: number): void;
  clearTouchMovement(): void;
  setTouchRunning(running: boolean): void;
  queueTouchJump(): void;
  addTouchOrbitDelta(horizontal: number, vertical: number): void;
  addTouchZoomDelta(delta: number): void;
  clearTouchInput(): void;
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Mobile control element is missing: ${selector}`);
  return element;
}

function isTouchPointer(event: PointerEvent): boolean {
  return event.pointerType === 'touch';
}

export class MobileControls {
  private readonly root = requireElement<HTMLElement>('[data-mobile-controls]');
  private readonly stick = requireElement<HTMLElement>('[data-touch-move]');
  private readonly stickThumb = requireElement<HTMLElement>('[data-touch-move-thumb]');
  private readonly runButton = requireElement<HTMLButtonElement>('[data-touch-run]');
  private readonly jumpButton = requireElement<HTMLButtonElement>('[data-touch-jump]');
  private readonly coarsePointer = window.matchMedia('(any-pointer: coarse)');
  private readonly gesture = new TouchGestureState();
  private movementPointer: number | null = null;
  private runPointer: number | null = null;
  private jumpPointer: number | null = null;
  private active = false;

  public constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly input: MobileControlInput,
  ) {
    this.stick.addEventListener('pointerdown', this.handleMoveStart);
    this.stick.addEventListener('pointermove', this.handleMove);
    this.stick.addEventListener('pointerup', this.handleMoveEnd);
    this.stick.addEventListener('pointercancel', this.handleMoveEnd);
    this.stick.addEventListener('lostpointercapture', this.handleMoveEnd);
    this.runButton.addEventListener('pointerdown', this.handleRunStart);
    this.runButton.addEventListener('pointerup', this.handleRunEnd);
    this.runButton.addEventListener('pointercancel', this.handleRunEnd);
    this.runButton.addEventListener('lostpointercapture', this.handleRunEnd);
    this.jumpButton.addEventListener('pointerdown', this.handleJumpStart);
    this.jumpButton.addEventListener('pointerup', this.handleJumpEnd);
    this.jumpButton.addEventListener('pointercancel', this.handleJumpEnd);
    this.jumpButton.addEventListener('lostpointercapture', this.handleJumpEnd);
    this.canvas.addEventListener('pointerdown', this.handleGestureStart);
    this.canvas.addEventListener('pointermove', this.handleGestureMove);
    this.canvas.addEventListener('pointerup', this.handleGestureEnd);
    this.canvas.addEventListener('pointercancel', this.handleGestureEnd);
    this.canvas.addEventListener('lostpointercapture', this.handleGestureEnd);
    window.addEventListener('blur', this.handleReset);
    window.addEventListener('orientationchange', this.handleReset);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.coarsePointer.addEventListener('change', this.handleCapabilityChange);

    if (shouldEnableTouchControls(navigator.maxTouchPoints, this.coarsePointer.matches)) {
      this.activate();
    }
  }

  public dispose(): void {
    this.reset();
    this.stick.removeEventListener('pointerdown', this.handleMoveStart);
    this.stick.removeEventListener('pointermove', this.handleMove);
    this.stick.removeEventListener('pointerup', this.handleMoveEnd);
    this.stick.removeEventListener('pointercancel', this.handleMoveEnd);
    this.stick.removeEventListener('lostpointercapture', this.handleMoveEnd);
    this.runButton.removeEventListener('pointerdown', this.handleRunStart);
    this.runButton.removeEventListener('pointerup', this.handleRunEnd);
    this.runButton.removeEventListener('pointercancel', this.handleRunEnd);
    this.runButton.removeEventListener('lostpointercapture', this.handleRunEnd);
    this.jumpButton.removeEventListener('pointerdown', this.handleJumpStart);
    this.jumpButton.removeEventListener('pointerup', this.handleJumpEnd);
    this.jumpButton.removeEventListener('pointercancel', this.handleJumpEnd);
    this.jumpButton.removeEventListener('lostpointercapture', this.handleJumpEnd);
    this.canvas.removeEventListener('pointerdown', this.handleGestureStart);
    this.canvas.removeEventListener('pointermove', this.handleGestureMove);
    this.canvas.removeEventListener('pointerup', this.handleGestureEnd);
    this.canvas.removeEventListener('pointercancel', this.handleGestureEnd);
    this.canvas.removeEventListener('lostpointercapture', this.handleGestureEnd);
    window.removeEventListener('blur', this.handleReset);
    window.removeEventListener('orientationchange', this.handleReset);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.coarsePointer.removeEventListener('change', this.handleCapabilityChange);
    document.body.classList.remove('has-touch-controls', 'is-touch-orbiting');
    this.root.setAttribute('aria-hidden', 'true');
  }

  private activate(): void {
    if (this.active) return;
    this.active = true;
    document.body.classList.add('has-touch-controls');
    this.root.setAttribute('aria-hidden', 'false');
    const prompt = document.querySelector<HTMLElement>('[data-onboarding-prompt]');
    const action = document.querySelector<HTMLElement>('[data-onboarding-action]');
    if (prompt) prompt.textContent = 'Touch and drag anywhere';
    if (action) action.textContent = 'SWIPE TO LOOK AROUND';
  }

  private reset(): void {
    this.movementPointer = null;
    this.runPointer = null;
    this.jumpPointer = null;
    this.gesture.clear();
    this.input.clearTouchInput();
    this.stick.classList.remove('is-active');
    this.runButton.classList.remove('is-active');
    this.jumpButton.classList.remove('is-active');
    this.runButton.setAttribute('aria-pressed', 'false');
    this.stickThumb.style.setProperty('--touch-x', '0px');
    this.stickThumb.style.setProperty('--touch-y', '0px');
    this.stick.setAttribute('aria-valuetext', 'Centered');
    document.body.classList.remove('is-touch-orbiting');
  }

  private updateMovement(event: PointerEvent): void {
    const bounds = this.stick.getBoundingClientRect();
    const radius = Math.min(bounds.width, bounds.height) * 0.36;
    const sample = sampleJoystick(
      event.clientX,
      event.clientY,
      bounds.left + bounds.width * 0.5,
      bounds.top + bounds.height * 0.5,
      radius,
    );
    this.stickThumb.style.setProperty('--touch-x', `${sample.visualX.toFixed(2)}px`);
    this.stickThumb.style.setProperty('--touch-y', `${sample.visualY.toFixed(2)}px`);
    this.stick.setAttribute(
      'aria-valuetext',
      `Horizontal ${sample.horizontal.toFixed(2)}, forward ${sample.forward.toFixed(2)}`,
    );
    this.input.setTouchMovement(sample.horizontal, sample.forward);
  }

  private capturePointer(element: Element, pointerId: number): void {
    try {
      element.setPointerCapture(pointerId);
    } catch {
      // Synthetic audit events have no browser-owned pointer to capture.
    }
  }

  private releasePointer(element: Element, pointerId: number): void {
    try {
      if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
    } catch {
      // The pointer can already be gone after cancellation or orientation changes.
    }
  }

  private readonly handleMoveStart = (event: PointerEvent): void => {
    if (!isTouchPointer(event) || this.movementPointer !== null) return;
    event.preventDefault();
    this.activate();
    this.movementPointer = event.pointerId;
    this.capturePointer(this.stick, event.pointerId);
    this.stick.classList.add('is-active');
    this.updateMovement(event);
  };

  private readonly handleMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.movementPointer) return;
    event.preventDefault();
    this.updateMovement(event);
  };

  private readonly handleMoveEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.movementPointer) return;
    event.preventDefault();
    this.releasePointer(this.stick, event.pointerId);
    this.movementPointer = null;
    this.input.clearTouchMovement();
    this.stick.classList.remove('is-active');
    this.stickThumb.style.setProperty('--touch-x', '0px');
    this.stickThumb.style.setProperty('--touch-y', '0px');
    this.stick.setAttribute('aria-valuetext', 'Centered');
  };

  private readonly handleRunStart = (event: PointerEvent): void => {
    if (!isTouchPointer(event) || this.runPointer !== null) return;
    event.preventDefault();
    this.activate();
    this.runPointer = event.pointerId;
    this.capturePointer(this.runButton, event.pointerId);
    this.runButton.classList.add('is-active');
    this.runButton.setAttribute('aria-pressed', 'true');
    this.input.setTouchRunning(true);
  };

  private readonly handleRunEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.runPointer) return;
    event.preventDefault();
    this.releasePointer(this.runButton, event.pointerId);
    this.runPointer = null;
    this.runButton.classList.remove('is-active');
    this.runButton.setAttribute('aria-pressed', 'false');
    this.input.setTouchRunning(false);
  };

  private readonly handleJumpStart = (event: PointerEvent): void => {
    if (!isTouchPointer(event) || this.jumpPointer !== null) return;
    event.preventDefault();
    this.activate();
    this.jumpPointer = event.pointerId;
    this.capturePointer(this.jumpButton, event.pointerId);
    this.jumpButton.classList.add('is-active');
    this.input.queueTouchJump();
  };

  private readonly handleJumpEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.jumpPointer) return;
    event.preventDefault();
    this.releasePointer(this.jumpButton, event.pointerId);
    this.jumpPointer = null;
    this.jumpButton.classList.remove('is-active');
  };

  private readonly handleGestureStart = (event: PointerEvent): void => {
    if (!isTouchPointer(event) || !this.gesture.start(event.pointerId, event.clientX, event.clientY)) return;
    event.preventDefault();
    this.activate();
    this.capturePointer(this.canvas, event.pointerId);
    document.body.classList.add('is-touch-orbiting');
  };

  private readonly handleGestureMove = (event: PointerEvent): void => {
    if (!isTouchPointer(event)) return;
    const delta = this.gesture.move(event.pointerId, event.clientX, event.clientY);
    if (delta.orbitX === 0 && delta.orbitY === 0 && delta.zoom === 0) return;
    event.preventDefault();
    this.input.addTouchOrbitDelta(delta.orbitX, delta.orbitY);
    this.input.addTouchZoomDelta(delta.zoom);
  };

  private readonly handleGestureEnd = (event: PointerEvent): void => {
    if (!isTouchPointer(event)) return;
    this.releasePointer(this.canvas, event.pointerId);
    this.gesture.end(event.pointerId);
    if (this.gesture.pointerCount === 0) document.body.classList.remove('is-touch-orbiting');
  };

  private readonly handleReset = (): void => {
    this.reset();
  };

  private readonly handleVisibilityChange = (): void => {
    if (document.hidden) this.reset();
  };

  private readonly handleCapabilityChange = (event: MediaQueryListEvent): void => {
    if (event.matches) this.activate();
  };
}
