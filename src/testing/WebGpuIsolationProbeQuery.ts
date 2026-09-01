export function shouldRunWebGpuIsolationProbe(search: string): boolean {
  return new URLSearchParams(search).get('webgpuProbe') === '1';
}

export type WebGpuIsolationProbeWorkload = 'minimal' | 'three-cloth';

export function readWebGpuIsolationProbeWorkload(search: string): WebGpuIsolationProbeWorkload {
  return new URLSearchParams(search).get('probeWorkload') === 'three-cloth'
    ? 'three-cloth'
    : 'minimal';
}
