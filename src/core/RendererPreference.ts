export type RendererPreference = 'webgpu' | 'webgl';

export const RENDERER_QUERY_PARAMETER = 'renderer';
export const RENDERER_STORAGE_KEY = 'cape-physics.renderer';

export interface RendererPreferenceEnvironment {
  readonly search: string;
  readonly storedPreference: string | null;
  readonly webGPUAvailable: boolean;
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
  const storedPreference = parseRendererPreference(environment.storedPreference);
  const requested = queryPreference ?? storedPreference;

  if (requested !== null) return requested;

  return environment.webGPUAvailable ? 'webgpu' : 'webgl';
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
