import type { RendererPreference } from './RendererPreference';

export const RENDERER_STARTUP_STORAGE_KEY = 'cape-physics.renderer-startup.v1';
const MAX_FAILURES = 4;
const ABANDONED_ATTEMPT_WINDOW_MS = 5 * 60_000;

export interface RendererStartupAttempt {
  readonly id: string;
  readonly renderer: RendererPreference;
  readonly stage: string;
  readonly startedAt: number;
  readonly updatedAt: number;
}

export interface RendererStartupFailure {
  readonly attemptId: string;
  readonly renderer: RendererPreference;
  readonly stage: string;
  readonly name: string;
  readonly message: string;
  readonly stack: string | null;
  readonly occurredAt: number;
  readonly userAgent: string;
  readonly pageUrl: string;
  readonly recoveredWith: RendererPreference | null;
  readonly recoveredAt: number | null;
}

export interface RendererStartupDiagnostics {
  readonly current: RendererStartupAttempt | null;
  readonly failures: readonly RendererStartupFailure[];
  readonly automaticReloads: number;
  readonly recoveryPending: boolean;
}

export type RendererRecoveryDecision =
  | { readonly action: 'reload-webgl'; readonly delayMilliseconds: number }
  | { readonly action: 'show-error'; readonly delayMilliseconds: 0 };

interface PersistedRendererStartupState extends RendererStartupDiagnostics {
  readonly version: 1;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RendererStartupRecoveryOptions {
  readonly storage?: StorageLike | null;
  readonly now?: () => number;
  readonly createId?: () => string;
  readonly userAgent?: string;
  readonly pageUrl?: string;
}

function initialState(): PersistedRendererStartupState {
  return {
    version: 1,
    current: null,
    failures: [],
    automaticReloads: 0,
    recoveryPending: false,
  };
}

function errorDetails(error: unknown): {
  readonly name: string;
  readonly message: string;
  readonly stack: string | null;
} {
  if (error instanceof Error) {
    return {
      name: error.name || 'Error',
      message: error.message || String(error),
      stack: error.stack ?? null,
    };
  }
  return {
    name: 'Error',
    message: typeof error === 'string' ? error : JSON.stringify(error),
    stack: null,
  };
}

function isPreference(value: unknown): value is RendererPreference {
  return value === 'webgpu' || value === 'webgl';
}

function parseState(value: string | null): PersistedRendererStartupState {
  if (!value) return initialState();
  try {
    const candidate = JSON.parse(value) as Partial<PersistedRendererStartupState>;
    if (candidate.version !== 1 || !Array.isArray(candidate.failures)) return initialState();
    return {
      version: 1,
      current: candidate.current && isPreference(candidate.current.renderer)
        ? candidate.current
        : null,
      failures: candidate.failures.filter(
        (failure): failure is RendererStartupFailure => isPreference(failure?.renderer),
      ).slice(-MAX_FAILURES),
      automaticReloads: Number.isInteger(candidate.automaticReloads)
        ? Math.max(0, Number(candidate.automaticReloads))
        : 0,
      recoveryPending: candidate.recoveryPending === true,
    };
  } catch {
    return initialState();
  }
}

export class RendererStartupRecovery {
  private readonly storage: StorageLike | null;
  private readonly now: () => number;
  private readonly createId: () => string;
  private readonly userAgent: string;
  private readonly pageUrl: string;
  private state: PersistedRendererStartupState;
  private lastStage: string | null;

  public constructor(options: RendererStartupRecoveryOptions = {}) {
    this.storage = options.storage ?? null;
    this.now = options.now ?? (() => Date.now());
    this.createId = options.createId ?? (() => `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    this.userAgent = options.userAgent ?? 'Unavailable';
    this.pageUrl = options.pageUrl ?? 'Unavailable';
    let stored: string | null = null;
    try {
      stored = this.storage?.getItem(RENDERER_STARTUP_STORAGE_KEY) ?? null;
    } catch {
      // Privacy modes can expose sessionStorage while rejecting access. The
      // in-memory state machine must still keep startup safe.
    }
    this.state = parseState(stored);
    this.lastStage = this.state.current?.stage ?? null;
  }

  public begin(renderer: RendererPreference, explicitSelection = false): void {
    const timestamp = this.now();
    const previous = this.state.current;
    if (
      previous
      && timestamp - previous.updatedAt <= ABANDONED_ATTEMPT_WINDOW_MS
    ) {
      this.appendFailure(previous, new Error(
        `The page ended before ${previous.renderer.toUpperCase()} startup completed.`,
      ));
    }
    if (renderer === 'webgpu' && explicitSelection) {
      this.state = {
        ...this.state,
        automaticReloads: 0,
        recoveryPending: false,
      };
    }
    this.state = {
      ...this.state,
      current: {
        id: this.createId(),
        renderer,
        stage: 'construct-demo',
        startedAt: timestamp,
        updatedAt: timestamp,
      },
    };
    this.lastStage = 'construct-demo';
    this.persist();
  }

  public stage(stage: string): void {
    if (!this.state.current) return;
    this.lastStage = stage;
    this.state = {
      ...this.state,
      current: {
        ...this.state.current,
        stage,
        updatedAt: this.now(),
      },
    };
    this.persist();
  }

  /** Records an in-page WebGPU failure before constructing legacy WebGL. */
  public fallbackToWebGl(error: unknown, failedStage: string): void {
    const current = this.state.current;
    if (current) {
      this.appendFailure({ ...current, stage: failedStage }, error);
    }
    const timestamp = this.now();
    this.state = {
      ...this.state,
      current: {
        id: this.createId(),
        renderer: 'webgl',
        stage: 'initialize-webgl-fallback',
        startedAt: timestamp,
        updatedAt: timestamp,
      },
      recoveryPending: false,
    };
    this.persist();
  }

  public fail(error: unknown): RendererRecoveryDecision {
    const current = this.state.current;
    if (current) this.appendFailure(current, error);
    const canReload = current?.renderer === 'webgpu'
      && this.state.automaticReloads < 1
      && !this.state.recoveryPending;
    this.state = {
      ...this.state,
      current: null,
      automaticReloads: canReload
        ? this.state.automaticReloads + 1
        : this.state.automaticReloads,
      recoveryPending: canReload || this.state.recoveryPending,
    };
    this.persist();
    return canReload
      ? { action: 'reload-webgl', delayMilliseconds: 1_200 }
      : { action: 'show-error', delayMilliseconds: 0 };
  }

  public failActiveRenderer(
    renderer: RendererPreference,
    stage: string,
    error: unknown,
    allowReload = true,
  ): RendererRecoveryDecision {
    const timestamp = this.now();
    this.state = {
      ...this.state,
      current: {
        id: this.createId(),
        renderer,
        stage,
        startedAt: timestamp,
        updatedAt: timestamp,
      },
    };
    if (!allowReload) {
      const current = this.state.current;
      if (current) this.appendFailure(current, error);
      this.state = {
        ...this.state,
        current: null,
        recoveryPending: false,
      };
      this.persist();
      return { action: 'show-error', delayMilliseconds: 0 };
    }
    return this.fail(error);
  }

  public complete(actualRenderer: RendererPreference): void {
    const timestamp = this.now();
    const failures = actualRenderer === 'webgpu'
      ? []
      : this.state.failures.map((failure) => (
          failure.renderer === 'webgpu' && failure.recoveredWith === null
            ? { ...failure, recoveredWith: 'webgl' as const, recoveredAt: timestamp }
            : failure
        ));
    this.state = {
      ...this.state,
      current: null,
      failures,
      automaticReloads: 0,
      recoveryPending: false,
    };
    this.persist();
  }

  public getDiagnostics(): RendererStartupDiagnostics {
    return {
      current: this.state.current,
      failures: [...this.state.failures],
      automaticReloads: this.state.automaticReloads,
      recoveryPending: this.state.recoveryPending,
    };
  }

  /** Last application stage reached, retained after successful startup. */
  public getLastStage(): string | null {
    return this.state.current?.stage ?? this.lastStage;
  }

  private appendFailure(attempt: RendererStartupAttempt, error: unknown): void {
    const details = errorDetails(error);
    this.state = {
      ...this.state,
      failures: [
        ...this.state.failures,
        {
          attemptId: attempt.id,
          renderer: attempt.renderer,
          stage: attempt.stage,
          name: details.name,
          message: details.message,
          stack: details.stack,
          occurredAt: this.now(),
          userAgent: this.userAgent,
          pageUrl: this.pageUrl,
          recoveredWith: null,
          recoveredAt: null,
        },
      ].slice(-MAX_FAILURES),
    };
  }

  private persist(): void {
    try {
      this.storage?.setItem(RENDERER_STARTUP_STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Keep the in-memory state functional when storage is unavailable.
    }
  }
}

export function browserRendererStartupRecovery(): RendererStartupRecovery {
  let storage: Storage | null = null;
  try {
    storage = window.sessionStorage;
  } catch {
    // Access can be denied in hardened or private browsing contexts.
  }
  return new RendererStartupRecovery({
    storage,
    userAgent: navigator.userAgent || 'Unavailable',
    pageUrl: window.location.href,
  });
}

export function readBrowserRendererStartupDiagnostics(): RendererStartupDiagnostics {
  return browserRendererStartupRecovery().getDiagnostics();
}
