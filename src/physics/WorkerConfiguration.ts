export function chooseWorkerConfiguration(logicalCores: number, search = '') {
  const cores = Math.max(1, logicalCores || 4);
  const automatic = Math.max(1, Math.min(10, cores - 2));
  const parameters = new URLSearchParams(search);
  const raw = parameters.get('workers');
  const requested = raw !== null && /^[1-9][0-9]*$/.test(raw) ? Number(raw) : null;
  const workers = requested !== null ? Math.max(1, Math.min(10, cores - 1, requested)) : automatic;
  return { workers, requested, overridden: requested !== null,
    profiling: parameters.get('workerProfile') !== '0',
    rule: requested !== null ? 'URL workers override, capped at 10 and logical cores - 1 (minimum 1); worker budget only, CPU speed unchanged'
      : 'min(10, max(1, logical cores - 2)); unknown cores: assume 4' };
}
