import { invariant } from '../utils/assert';
import type { RendererStartupDiagnostics } from '../core/RendererStartupRecovery';
import { rendererPreferenceUrl } from '../core/RendererPreference';

export class LoadingScreen {
  private readonly root: HTMLElement;
  private readonly bar: HTMLElement;
  private readonly status: HTMLElement;
  private readonly progress: HTMLElement;
  private readonly errorPanel: HTMLElement;
  private readonly errorDetail: HTMLElement;
  private readonly retryButton: HTMLButtonElement;
  private readonly copyButton: HTMLButtonElement;
  private estimateFrame: number | null = null;

  public constructor() {
    this.root = invariant(document.querySelector<HTMLElement>('[data-loading]'), 'Loading screen is missing.');
    this.bar = invariant(document.querySelector<HTMLElement>('[data-loading-bar]'), 'Loading bar is missing.');
    this.status = invariant(document.querySelector<HTMLElement>('[data-loading-status]'), 'Loading status is missing.');
    this.progress = invariant(document.querySelector<HTMLElement>('[data-loading-progress]'), 'Loading progress is missing.');
    this.errorPanel = invariant(document.querySelector<HTMLElement>('[data-loading-error]'), 'Loading error panel is missing.');
    this.errorDetail = invariant(document.querySelector<HTMLElement>('[data-loading-error-detail]'), 'Loading error detail is missing.');
    this.retryButton = invariant(document.querySelector<HTMLButtonElement>('[data-loading-retry-webgl]'), 'WebGL retry button is missing.');
    this.copyButton = invariant(document.querySelector<HTMLButtonElement>('[data-loading-copy-diagnostics]'), 'Diagnostics copy button is missing.');
  }

  public async update(progress: number, message: string): Promise<void> {
    this.cancelEstimate();
    const percentage = Math.round(Math.max(0, Math.min(1, progress)) * 100);
    this.bar.style.transitionDuration = '450ms';
    this.bar.style.transitionTimingFunction = 'ease';
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
    const startedAt = performance.now();
    const startProgress = Math.max(0, Math.min(1, progress));
    const endProgress = Math.max(startProgress, Math.min(1, anticipatedProgress));
    this.bar.style.transitionDuration = `${estimatedMilliseconds}ms`;
    this.bar.style.transitionTimingFunction = 'cubic-bezier(0.16, 0.72, 0.25, 1)';
    this.bar.style.width = `${(endProgress * 100).toFixed(1)}%`;
    const animateEstimate = (timestamp: number): void => {
      const elapsedRatio = Math.max(
        0,
        Math.min(1, (timestamp - startedAt) / Math.max(1, estimatedMilliseconds)),
      );
      const easedRatio = 1 - (1 - elapsedRatio) ** 3;
      const estimatedProgress = startProgress
        + (endProgress - startProgress) * easedRatio;
      this.progress.textContent = `${(estimatedProgress * 100).toFixed(1)}%`;
      if (elapsedRatio < 1) {
        this.estimateFrame = requestAnimationFrame(animateEstimate);
      } else {
        this.estimateFrame = null;
      }
    };
    this.estimateFrame = requestAnimationFrame(animateEstimate);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  public async reveal(): Promise<void> {
    await this.update(1, 'Enter the deep');
    document.body.classList.add('is-ready');
  }

  public fail(
    error?: unknown,
    diagnostics?: RendererStartupDiagnostics,
  ): void {
    this.cancelEstimate();
    this.root.classList.add('has-error');
    const latest = diagnostics?.failures.at(-1);
    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : latest?.message ?? 'Unknown graphics initialization error';
    this.status.textContent = 'Graphics initialization failed';
    this.progress.textContent = 'FAILED';
    this.errorDetail.textContent = latest
      ? `${latest.renderer.toUpperCase()} failed at ${latest.stage}: ${latest.message}`
      : message;
    this.errorPanel.hidden = false;
    this.retryButton.onclick = () => {
      window.location.replace(rendererPreferenceUrl(window.location.href, 'webgl'));
    };
    this.copyButton.onclick = () => {
      const report = JSON.stringify({
        capturedAt: new Date().toISOString(),
        error: message,
        diagnostics: diagnostics ?? null,
        platform: navigator.platform || 'Unknown platform',
        userAgent: navigator.userAgent || 'Unavailable',
        page: window.location.href,
      }, null, 2);
      if (!navigator.clipboard) {
        this.copyButton.textContent = 'COPY UNAVAILABLE — USE CONSOLE';
        return;
      }
      void navigator.clipboard.writeText(report).then(() => {
        this.copyButton.textContent = 'DIAGNOSTICS COPIED';
      }).catch(() => {
        this.copyButton.textContent = 'COPY FAILED — USE CONSOLE';
      });
    };
  }

  private cancelEstimate(): void {
    if (this.estimateFrame === null) return;
    cancelAnimationFrame(this.estimateFrame);
    this.estimateFrame = null;
  }
}
