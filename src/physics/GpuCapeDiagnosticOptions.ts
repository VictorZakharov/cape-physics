export interface GpuCapeDiagnosticOptions {
  readonly bodyFaceContactsEnabled: boolean;
}

export const DEFAULT_GPU_CAPE_DIAGNOSTIC_OPTIONS: GpuCapeDiagnosticOptions = {
  bodyFaceContactsEnabled: true,
};

export function resolveGpuCapeDiagnosticOptions(
  search: string,
): GpuCapeDiagnosticOptions {
  const parameters = new URLSearchParams(search);
  return {
    bodyFaceContactsEnabled: parameters.get('gpuBodyFaces') !== 'off',
  };
}
