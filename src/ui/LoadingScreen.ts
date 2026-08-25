import { invariant } from '../utils/assert';

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly bar: HTMLElement;
  private readonly status: HTMLElement;

  public constructor() {
    this.root = invariant(document.querySelector<HTMLElement>('[data-loading]'), 'Loading screen is missing.');
    this.bar = invariant(document.querySelector<HTMLElement>('[data-loading-bar]'), 'Loading bar is missing.');
    this.status = invariant(document.querySelector<HTMLElement>('[data-loading-status]'), 'Loading status is missing.');
  }

  public async update(progress: number, message: string): Promise<void> {
    this.bar.style.width = `${Math.round(progress * 100)}%`;
    this.status.textContent = message;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  public async reveal(): Promise<void> {
    await this.update(1, 'Enter the deep');
    document.body.classList.add('is-ready');
  }

  public fail(): void {
    this.root.classList.add('has-error');
    this.status.textContent = 'WebGL initialization failed — see console for details';
  }
}
