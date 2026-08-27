import {
  RENDERER_STORAGE_KEY,
  rendererPreferenceUrl,
  type RendererPreference,
} from '../core/RendererPreference';
import { invariant } from '../utils/assert';

export interface RendererSwitchEnvironment {
  readonly storage: Pick<Storage, 'setItem'>;
  readonly location: Pick<Location, 'href' | 'replace'>;
}

export class RendererSwitch {
  private readonly root: HTMLElement;
  private readonly buttons: readonly HTMLButtonElement[];

  public constructor(
    requested: RendererPreference,
    webGPUAvailable: boolean,
    private readonly environment: RendererSwitchEnvironment = {
      storage: window.localStorage,
      location: window.location,
    },
  ) {
    this.root = invariant(
      document.querySelector<HTMLElement>('[data-renderer-switch]'),
      'Renderer switch is missing.',
    );
    this.buttons = Array.from(
      this.root.querySelectorAll<HTMLButtonElement>('[data-renderer-option]'),
    );
    const webGPUButton = this.buttons.find(
      (button) => button.dataset.rendererOption === 'webgpu',
    );
    if (webGPUButton && !webGPUAvailable) {
      webGPUButton.disabled = true;
      webGPUButton.title = 'WebGPU is not available in this browser';
    }
    this.setActive(requested, requested);
    for (const button of this.buttons) {
      button.addEventListener('click', this.handleSelection);
    }
  }

  public setActive(
    actual: RendererPreference,
    requested: RendererPreference,
  ): void {
    this.root.dataset.rendererBackend = actual;
    this.root.dataset.rendererFallback = String(actual !== requested);
    for (const button of this.buttons) {
      const active = button.dataset.rendererOption === actual;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    this.root.title = actual === requested
      ? `${actual.toUpperCase()} renderer active`
      : 'WebGPU was requested but unavailable; WebGL is active';
  }

  public dispose(): void {
    for (const button of this.buttons) {
      button.removeEventListener('click', this.handleSelection);
    }
  }

  private readonly handleSelection = (event: Event): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const preference = button.dataset.rendererOption;
    if ((preference !== 'webgpu' && preference !== 'webgl') || button.disabled) return;
    try {
      this.environment.storage.setItem(RENDERER_STORAGE_KEY, preference);
    } catch {
      // A private or locked-down context can still switch for this URL.
    }
    this.environment.location.replace(
      rendererPreferenceUrl(this.environment.location.href, preference),
    );
  };
}
