import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export const DEFAULT_SOURCE_LINE_BUDGET = 800;

// Existing architectural debt is explicit and cannot grow past these caps.
// Lower or remove an exception when its file is decomposed further.
export const SOURCE_LINE_BUDGETS = new Map([
  ['src/CapeDemo.ts', 1_750],
  ['src/physics/CapeContactSolver.ts', 950],
  ['src/physics/GpuCapeProjectionKernel.ts', 850],
  ['src/physics/GpuCapeSimulation.ts', 1_225],
]);

export function countSourceLines(source: string): number {
  if (source.length === 0) return 0;
  const lines = source.split(/\r\n|\r|\n/);
  if (lines.at(-1) === '') lines.pop();
  return lines.length;
}

export function getSourceLineBudget(repositoryPath: string): number {
  return SOURCE_LINE_BUDGETS.get(repositoryPath) ?? DEFAULT_SOURCE_LINE_BUDGET;
}

async function collectTypeScriptSources(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectTypeScriptSources(path);
    return entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
  }));
  return nested.flat();
}

export async function checkSourceSizeBudgets(repositoryRoot = process.cwd()) {
  const sourceRoot = resolve(repositoryRoot, 'src');
  const sourceFiles = await collectTypeScriptSources(sourceRoot);
  const results = await Promise.all(sourceFiles.map(async (path) => {
    const repositoryPath = relative(repositoryRoot, path).split(sep).join('/');
    const lines = countSourceLines(await readFile(path, 'utf8'));
    const budget = getSourceLineBudget(repositoryPath);
    return { repositoryPath, lines, budget };
  }));
  const failures = results
    .filter(({ lines, budget }) => lines > budget)
    .sort((first, second) => second.lines - first.lines);
  if (failures.length > 0) {
    const details = failures.map(({ repositoryPath, lines, budget }) => (
      `  ${repositoryPath}: ${lines} lines (budget ${budget}, over by ${lines - budget})`
    ));
    throw new Error([
      'Source-size budget exceeded.',
      ...details,
      'Split responsibilities into focused modules, or explicitly revise the reviewed budget.',
    ].join('\n'));
  }
  const largest = results.sort((first, second) => second.lines - first.lines).slice(0, 5);
  return { checked: results.length, largest };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  try {
    const result = await checkSourceSizeBudgets();
    console.log(`Source-size budgets passed for ${result.checked} TypeScript files.`);
    result.largest.forEach(({ repositoryPath, lines, budget }) => {
      console.log(`  ${repositoryPath}: ${lines}/${budget} lines`);
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
