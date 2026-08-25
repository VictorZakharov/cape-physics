import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(repositoryRoot, 'dist', 'index.html'), 'utf8');
const repositoryBase = '/cape-physics/';
const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
const localReferences = references.filter((reference) => (
  reference
  && !reference.startsWith('data:')
  && !reference.startsWith('http:')
  && !reference.startsWith('https:')
  && !reference.startsWith('#')
));
const invalidReferences = localReferences.filter((reference) => !reference.startsWith(repositoryBase));

if (localReferences.length === 0) {
  throw new Error('Pages build contains no local asset references.');
}
if (invalidReferences.length > 0) {
  throw new Error(`Pages-unsafe asset paths: ${invalidReferences.join(', ')}`);
}

console.log(`GitHub Pages asset paths: PASS (${localReferences.length} references)`);
