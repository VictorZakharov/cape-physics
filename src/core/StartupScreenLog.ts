export const STARTUP_SCREEN_LOG_STORAGE_KEY = 'cape-physics.startup-screen-log.v1';
export const STARTUP_SCREEN_LOG_COMPLETE_KEY = 'cape-physics.startup-screen-log.complete.v1';
export const STARTUP_SCREEN_LOG_LIMIT = 80;

export interface StartupScreenLogEntry {
  readonly navigationId: string;
  readonly recordedAt: string;
  readonly elapsedMilliseconds: number;
  readonly message: string;
}

const navigationId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const navigationStartedAt = typeof performance === 'undefined' ? 0 : performance.now();

export function normalizeStartupScreenLogEntries(value: unknown): StartupScreenLogEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is StartupScreenLogEntry => (
    typeof entry === 'object'
    && entry !== null
    && typeof (entry as StartupScreenLogEntry).navigationId === 'string'
    && typeof (entry as StartupScreenLogEntry).recordedAt === 'string'
    && Number.isFinite((entry as StartupScreenLogEntry).elapsedMilliseconds)
    && typeof (entry as StartupScreenLogEntry).message === 'string'
  )).slice(-STARTUP_SCREEN_LOG_LIMIT);
}

export function appendStartupScreenLogEntry(
  entries: readonly StartupScreenLogEntry[],
  entry: StartupScreenLogEntry,
): StartupScreenLogEntry[] {
  return [...entries, entry].slice(-STARTUP_SCREEN_LOG_LIMIT);
}

function readStoredEntries(): StartupScreenLogEntry[] {
  try {
    if (globalThis.sessionStorage?.getItem(STARTUP_SCREEN_LOG_COMPLETE_KEY) === '1') {
      globalThis.sessionStorage.removeItem(STARTUP_SCREEN_LOG_STORAGE_KEY);
      globalThis.sessionStorage.removeItem(STARTUP_SCREEN_LOG_COMPLETE_KEY);
      return [];
    }
    const value = globalThis.sessionStorage?.getItem(STARTUP_SCREEN_LOG_STORAGE_KEY);
    if (!value) return [];
    return normalizeStartupScreenLogEntries(JSON.parse(value));
  } catch {
    return [];
  }
}

let entries = readStoredEntries();

function storeEntries(): void {
  try {
    globalThis.sessionStorage?.setItem(
      STARTUP_SCREEN_LOG_STORAGE_KEY,
      JSON.stringify(entries),
    );
  } catch {
    // The on-screen log must remain useful when storage is unavailable.
  }
}

function renderEntries(): void {
  if (typeof document === 'undefined') return;
  const list = document.querySelector<HTMLOListElement>('[data-loading-log]');
  if (!list) return;
  const fragment = document.createDocumentFragment();
  for (const entry of entries.slice(-24)) {
    const item = document.createElement('li');
    item.classList.toggle('is-previous-navigation', entry.navigationId !== navigationId);
    const timing = document.createElement('time');
    timing.dateTime = entry.recordedAt;
    timing.textContent = `${Math.round(entry.elapsedMilliseconds)} ms`;
    const message = document.createElement('span');
    message.textContent = entry.message;
    item.append(timing, message);
    fragment.append(item);
  }
  list.replaceChildren(fragment);
  list.scrollTop = list.scrollHeight;
}

export function appendStartupScreenLog(message: string): void {
  const normalizedMessage = message.trim();
  if (!normalizedMessage) return;
  entries = appendStartupScreenLogEntry(entries, {
    navigationId,
    recordedAt: new Date().toISOString(),
    elapsedMilliseconds: Math.max(
      0,
      (typeof performance === 'undefined' ? 0 : performance.now()) - navigationStartedAt,
    ),
    message: normalizedMessage,
  });
  try {
    globalThis.sessionStorage?.removeItem(STARTUP_SCREEN_LOG_COMPLETE_KEY);
  } catch {
    // The visible log still works without session storage.
  }
  storeEntries();
  renderEntries();
}

export function getStartupScreenLog(): readonly StartupScreenLogEntry[] {
  return entries.slice();
}

export function markStartupScreenLogComplete(): void {
  try {
    globalThis.sessionStorage?.setItem(STARTUP_SCREEN_LOG_COMPLETE_KEY, '1');
  } catch {
    // Successful startup does not depend on storage bookkeeping.
  }
}
