import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  appendStartupScreenLogEntry,
  normalizeStartupScreenLogEntries,
  STARTUP_SCREEN_LOG_LIMIT,
  type StartupScreenLogEntry,
} from '../src/core/StartupScreenLog';

function entry(index: number): StartupScreenLogEntry {
  return {
    navigationId: `navigation-${Math.floor(index / 10)}`,
    recordedAt: new Date(index).toISOString(),
    elapsedMilliseconds: index,
    message: `stage ${index}`,
  };
}

describe('on-screen startup log', () => {
  test('retains the latest bounded history across renderer recovery navigations', () => {
    let entries: StartupScreenLogEntry[] = [];
    for (let index = 0; index < STARTUP_SCREEN_LOG_LIMIT + 7; index += 1) {
      entries = appendStartupScreenLogEntry(entries, entry(index));
    }
    expect(entries).toHaveLength(STARTUP_SCREEN_LOG_LIMIT);
    expect(entries[0]?.message).toBe('stage 7');
    expect(entries.at(-1)?.message).toBe(`stage ${STARTUP_SCREEN_LOG_LIMIT + 6}`);
  });

  test('drops malformed persisted data instead of breaking the loading screen', () => {
    expect(normalizeStartupScreenLogEntries([
      entry(1),
      { message: 'missing timing fields' },
      null,
    ])).toEqual([entry(1)]);
    expect(normalizeStartupScreenLogEntries({ entries: [] })).toEqual([]);
  });

  test('is visible before module startup and remains copyable after a renderer failure', () => {
    const root = resolve(import.meta.dir, '..');
    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    const main = readFileSync(resolve(root, 'src/main.ts'), 'utf8');
    const loadingScreen = readFileSync(resolve(root, 'src/ui/LoadingScreen.ts'), 'utf8');
    const loadingStyles = readFileSync(resolve(root, 'src/styles/loading.css'), 'utf8');

    expect(html).toContain('data-loading-log');
    expect(html).toContain('HTML shell ready');
    expect(html).toContain(
      '<link rel="icon" href="%BASE_URL%favicon.svg" type="image/svg+xml" />',
    );
    expect(readFileSync(resolve(root, 'public/favicon.svg'), 'utf8')).toContain('<svg');
    expect(main.indexOf("appendStartupScreenLog('Application module entry')"))
      .toBeLessThan(main.indexOf("await import('./CapeDemo')"));
    expect(loadingScreen).toContain('appendStartupScreenLog(`${percentage}% · ${message}`)');
    expect(loadingScreen).toContain('startupLog: getStartupScreenLog()');
    expect(loadingStyles).toMatch(
      /\.loading__log\s*\{[^}]*height:\s*clamp\(112px, 25vh, 210px\);/s,
    );
    expect(loadingStyles).toMatch(/\.loading__log\s*\{[^}]*overflow-y:\s*auto;/s);
    expect(loadingStyles).toMatch(/\.loading__log\s*\{[^}]*scrollbar-gutter:\s*stable;/s);
    expect(loadingStyles).not.toContain('max-height: min(25vh, 210px)');
  });
});
