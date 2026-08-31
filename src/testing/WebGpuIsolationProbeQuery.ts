export function shouldRunWebGpuIsolationProbe(search: string): boolean {
  return new URLSearchParams(search).get('webgpuProbe') === '1';
}
