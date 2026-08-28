export type RendererPreference = 'webgpu' | 'webgl';

export const RENDERER_QUERY_PARAMETER = 'renderer';

export interface RendererPreferenceEnvironment {
  readonly search: string;
}

export function parseRendererPreference(value: string | null): RendererPreference | null {
  return value === 'webgpu' || value === 'webgl' ? value : null;
}

export function resolveRendererPreference(
  environment: RendererPreferenceEnvironment,
): RendererPreference {
  const queryPreference = parseRendererPreference(
    new URLSearchParams(environment.search).get(RENDERER_QUERY_PARAMETER),
  );
  if (queryPreference !== null) return queryPreference;

  // A supported API is not evidence that a browser/driver combination will
  // outperform the mature path. Keep WebGPU opt-in until real-device results
  // show a repeatable end-to-end win.
  return 'webgl';
}

export function rendererDefaultUrl(href: string): string {
  const url = new URL(href);
  url.searchParams.delete(RENDERER_QUERY_PARAMETER);
  return url.href;
}

export function rendererPreferenceUrl(
  href: string,
  preference: RendererPreference,
): string {
  const url = new URL(href);
  url.searchParams.set(RENDERER_QUERY_PARAMETER, preference);
  return url.href;
}

export function browserSupportsWebGPU(navigatorValue: Navigator = navigator): boolean {
  return 'gpu' in navigatorValue && navigatorValue.gpu !== undefined;
}
