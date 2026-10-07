import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { registerStaticWorldColliderIndex } from '../src/physics/StaticWorldColliderIndex';
import { workerStepTiming } from '../src/physics/WorkerStepTiming';
import { createClothFixture } from './audit/cloth-fixture';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'body-paired-'));
let before: ReturnType<typeof createClothFixture> | undefined, after: typeof before;
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  for (const file of ['CapeContactSolver.ts', 'CapeBodyColliderPreparation.ts', 'ClothBodyCollision.ts']) writeFileSync(join(root, 'src/physics', file), execFileSync('git', ['show', `2432d53:src/physics/${file}`]));
  const baseline = await import(pathToFileURL(join(root, 'src/physics/CapeSimulation.ts')).href);
  const index = await import(pathToFileURL(join(root, 'src/physics/StaticWorldColliderIndex.ts')).href);
  const timing = (await import(pathToFileURL(join(root, 'src/physics/WorkerStepTiming.ts')).href)).workerStepTiming;
  timing.isWorker = workerStepTiming.isWorker = true; timing.enabled = workerStepTiming.enabled = true;
  before = createClothFixture(baseline.CapeSimulation, 5, true); after = createClothFixture(CapeSimulation, 5, true);
  index.registerStaticWorldColliderIndex(before.worldColliders); registerStaticWorldColliderIndex(after.worldColliders);
  const total = { before: { compute: 0, body: 0, samples: 0 }, after: { compute: 0, body: 0, samples: 0 } };
  for (let step = 1; step <= 390; step++) {
    for (const stage of step % 4 < 2 ? ['before', 'after'] as const : ['after', 'before'] as const) {
      const fixture = stage === 'before' ? before : after, clock = stage === 'before' ? timing : workerStepTiming;
      fixture.prepareInputs(step); clock.beginBatch(); const start = performance.now(); fixture.solve(step); const duration = performance.now() - start;
      const split = clock.finishBatch(duration);
      if (step > 90) { total[stage].compute += duration; if (split) { total[stage].body += split.phases.body; total[stage].samples++; } }
    }
  }
  const result = { baseline: '2432d53', capes: 5, delta: 1 / 30, warmup: 90, measured: 300, before: { compute: total.before.compute / 300, body: total.before.body / total.before.samples }, after: { compute: total.after.compute / 300, body: total.after.body / total.after.samples }, caveat: 'Bun matched-state ABBA ordering; live Chrome reports remain required' };
  mkdirSync('artifacts/body-collision', { recursive: true }); writeFileSync('artifacts/body-collision/paired-timing.json', JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
} finally {
  workerStepTiming.isWorker = workerStepTiming.enabled = false;
  try { before?.dispose(); } finally { try { after?.dispose(); } finally { if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true }); } }
}
