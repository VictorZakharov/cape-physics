export function shouldRunWebGpuIsolationProbe(search: string): boolean {
  return new URLSearchParams(search).get('webgpuProbe') === '1';
}

export type WebGpuIsolationProbeWorkload = 'minimal' | 'three-cloth' | 'app-cape';

export function readWebGpuIsolationProbeWorkload(search: string): WebGpuIsolationProbeWorkload {
  const workload = new URLSearchParams(search).get('probeWorkload');
  if (workload === 'three-cloth' || workload === 'app-cape') return workload;
  return 'minimal';
}
