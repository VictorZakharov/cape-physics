import { invariant } from '../utils/assert';

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly bar: HTMLElement;
  private readonly status: HTMLElement;
  private readonly progress: HTMLElement;

  public constructor() {
    this.root = invariant(document.querySelector<HTMLElement>('[data-loading]'), 'Loading screen is missing.');
    this.bar = invariant(document.querySelector<HTMLElement>('[data-loading-bar]'), 'Loading bar is missing.');
    this.status = invariant(document.querySelector<HTMLElement>('[data-loading-status]'), 'Loading status is missing.');
    this.progress = invariant(document.querySelector<HTMLElement>('[data-loading-progress]'), 'Loading progress is missing.');
  }

  public async update(progress: number, message: string): Promise<void> {
    const percentage = Math.round(Math.max(0, Math.min(1, progress)) * 100);
    this.bar.style.transitionDuration = '450ms';
    this.bar.style.width = `${percentage}%`;
    this.status.textContent = message;
    this.progress.textContent = `${percentage}%`;
    performance.mark('cape-loading-stage', {
      detail: { progress: percentage / 100, message },
    });
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  /**
   * Starts a compositor-driven estimate before an expensive synchronous stage.
   * The real milestone update that follows remains authoritative, but the bar
   * no longer appears frozen while JavaScript builds the WebGPU node graph.
   */
  public async beginLongStage(
    progress: number,
    anticipatedProgress: number,
    message: string,
    estimatedMilliseconds = 7_000,
  ): Promise<void> {
    await this.update(progress, message);
    this.bar.style.transitionDuration = `${estimatedMilliseconds}ms`;
    this.bar.style.transitionTimingFunction = 'cubic-bezier(0.16, 0.72, 0.25, 1)';
    this.bar.style.width = `${Math.round(anticipatedProgress * 100)}%`;
    this.progress.textContent = `${Math.round(progress * 100)}–`
      + `${Math.round(anticipatedProgress * 100)}%`;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  public async reveal(): Promise<void> {
    await this.update(1, 'Enter the deep');
    document.body.classList.add('is-ready');
  }

  public fail(): void {
    this.root.classList.add('has-error');
    this.status.textContent = 'Graphics initialization failed — see console for details';
  }
}
