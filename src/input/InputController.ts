import * as THREE from 'three';

export class InputController {
  private readonly pressed = new Set<string>();
  private readonly orbitDelta = new THREE.Vector2();
  private readonly movement = new THREE.Vector2();
  private readonly virtualMovement = new THREE.Vector2();
  private zoomDelta = 0;
  private activePointer: number | null = null;
  private lastPointer = new THREE.Vector2();
  private interacted = false;
  private virtualMovementEnabled = false;
  private virtualRunning = false;
  private jumpQueued = false;
  private virtualJumpQueued = false;

  public constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly onFirstInteraction?: () => void,
  ) {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerUp);
    canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    canvas.addEventListener('contextmenu', this.handleContextMenu);
  }

  public getMovement(): THREE.Vector2 {
    if (this.virtualMovementEnabled) return this.virtualMovement;
    const horizontal = Number(this.pressed.has('KeyD')) - Number(this.pressed.has('KeyA'));
    const forward = Number(this.pressed.has('KeyW')) - Number(this.pressed.has('KeyS'));
    return this.movement.set(horizontal, forward).clampLength(0, 1);
  }

  public setVirtualMovement(horizontal: number, forward: number): void {
    this.virtualMovement.set(horizontal, forward).clampLength(0, 1);
    this.virtualMovementEnabled = true;
  }

  public isRunning(): boolean {
    if (this.virtualMovementEnabled) return this.virtualRunning;
    return this.pressed.has('ShiftLeft') || this.pressed.has('ShiftRight');
  }

  public setVirtualRunning(running: boolean): void {
    this.virtualRunning = running;
  }

  public consumeJump(): boolean {
    const queued = this.jumpQueued || this.virtualJumpQueued;
    this.jumpQueued = false;
    this.virtualJumpQueued = false;
    return queued;
  }

  public queueVirtualJump(): void {
    this.virtualJumpQueued = true;
  }

  public clearVirtualMovement(): void {
    this.virtualMovement.set(0, 0);
    this.virtualMovementEnabled = false;
    this.virtualRunning = false;
    this.virtualJumpQueued = false;
  }

  public consumeOrbitDelta(target: THREE.Vector2): void {
    target.copy(this.orbitDelta);
    this.orbitDelta.set(0, 0);
  }

  public consumeZoomDelta(): number {
    const result = this.zoomDelta;
    this.zoomDelta = 0;
    return result;
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerUp);
    this.canvas.removeEventListener('wheel', this.handleWheel);
    this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
  }

  private markInteracted(): void {
    if (this.interacted) return;
    this.interacted = true;
    this.onFirstInteraction?.();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (
      event.code === 'KeyW'
      || event.code === 'KeyA'
      || event.code === 'KeyS'
      || event.code === 'KeyD'
      || event.code === 'ShiftLeft'
      || event.code === 'ShiftRight'
      || event.code === 'Space'
    ) {
      event.preventDefault();
      this.pressed.add(event.code);
      if (event.code === 'Space' && !event.repeat) this.jumpQueued = true;
      this.markInteracted();
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };

  private readonly handleBlur = (): void => {
    this.pressed.clear();
    this.jumpQueued = false;
    this.activePointer = null;
    document.body.classList.remove('is-orbiting');
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 && event.button !== 2) return;
    this.activePointer = event.pointerId;
    this.lastPointer.set(event.clientX, event.clientY);
    this.canvas.setPointerCapture(event.pointerId);
    document.body.classList.add('is-orbiting');
    this.markInteracted();
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointer) return;
    this.orbitDelta.x += event.clientX - this.lastPointer.x;
    this.orbitDelta.y += event.clientY - this.lastPointer.y;
    this.lastPointer.set(event.clientX, event.clientY);
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointer) return;
    this.activePointer = null;
    document.body.classList.remove('is-orbiting');
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
  };

  private readonly handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.zoomDelta += Math.sign(event.deltaY) * Math.min(1.5, Math.abs(event.deltaY) / 120);
    this.markInteracted();
  };

  private readonly handleContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };
}
