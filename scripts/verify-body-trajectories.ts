import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { registerStaticWorldColliderIndex } from '../src/physics/StaticWorldColliderIndex';
import { workerStepTiming } from '../src/physics/WorkerStepTiming';
import { createClothFixture } from './audit/cloth-fixture';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'body-trajectories-'));
let before: ReturnType<typeof createClothFixture> | undefined, after: typeof before;
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  for (const file of ['CapeContactSolver.ts', 'CapeBodyColliderPreparation.ts', 'ClothBodyCollision.ts']) writeFileSync(join(root, 'src/physics', file), execFileSync('git', ['show', `2432d53:src/physics/${file}`]));
  const baseline = await import(pathToFileURL(join(root, 'src/physics/CapeSimulation.ts')).href);
  const index = await import(pathToFileURL(join(root, 'src/physics/StaticWorldColliderIndex.ts')).href);
  const timing = (await import(pathToFileURL(join(root, 'src/physics/WorkerStepTiming.ts')).href)).workerStepTiming;
  before = createClothFixture(baseline.CapeSimulation, 50, true); after = createClothFixture(CapeSimulation, 50, true);
  index.registerStaticWorldColliderIndex(before.worldColliders); registerStaticWorldColliderIndex(after.worldColliders);
  timing.isWorker = workerStepTiming.isWorker = true; timing.enabled = workerStepTiming.enabled = true;
  const steps = 600, capes = 50, particles = 234;
  const recorded = new Float64Array(steps * capes * particles * 3);
  const contact = { normal: { steps: 0, vertexCorrections: 0, triangleCorrections: 0 }, stress: { steps: 0, vertexCorrections: 0, triangleCorrections: 0 } };
  function advance(fixture: NonNullable<typeof before>, step: number) {
    fixture.prepareInputs(step);
    // Drive cloth into the body without altering solver margins or collision shapes.
    // Repeat during the stress window so contact does not disappear after one recovery.
    if (step >= 181 && step <= 240 && step % 5 === 1) {
      for (const bot of fixture.bots) {
        const sim = bot.simulation as any;
        for (let particle = 13; particle < particles; particle++) {
          sim.positions[particle].addScaledVector(bot.anchors.back, -0.22);
          sim.previous[particle].addScaledVector(bot.anchors.back, -0.22);
        }
      }
    }
    fixture.solve(step);
  }
  let offset = 0;
  for (let step = 1; step <= steps; step++) {
    timing.beginBatch(); advance(before, step);
    for (const bot of before.bots) for (const point of (bot.simulation as any).positions) for (const value of [point.x, point.y, point.z]) recorded[offset++] = value;
    if (step % 100 === 0) console.log(`Baseline ${step}/${steps}`);
  }
  let compared = 0, maximumDeviation = 0;
  for (let step = 1; step <= steps; step++) {
    workerStepTiming.beginBatch(); advance(after, step);
    const stats = workerStepTiming.bodyTests;
    if (workerStepTiming.sampling) {
      const group = step >= 181 && step <= 240 ? contact.stress : contact.normal;
      group.steps += capes; group.vertexCorrections += stats.vertexCorrections; group.triangleCorrections += stats.triangleCorrections;
    }
    for (const bot of after.bots) for (const point of (bot.simulation as any).positions) for (const value of [point.x, point.y, point.z]) {
      const old = recorded[compared++]!;
      if (!Number.isFinite(value)) throw Error('Non-finite particle position');
      maximumDeviation = Math.max(maximumDeviation, Math.abs(old - value));
      if (!Object.is(old, value)) throw Error(`Particle coordinates differ bit for bit at step ${step}, coordinate ${compared}: ${old} / ${value}`);
    }
    if (step % 100 === 0) console.log(`Instrumented ${step}/${steps}: bit-identical`);
  }
  const result = { baseline: '2432d53', steps, capes, particles, delta: 1 / 30, coordinatesCompared: compared, maximumDeviation, bitIdentical: true,
    stress: 'steps 181-240: all 50 capes driven 0.22 scene units into the body every five steps; same fixed bot paths', contact,
    assertionMode: 'not applicable: rejected culling is absent from production; no pairs are skipped by this change' };
  mkdirSync('artifacts/body-collision', { recursive: true }); writeFileSync('artifacts/body-collision/trajectory-regression.json', JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
} finally {
  workerStepTiming.isWorker = workerStepTiming.enabled = false;
  try { before?.dispose(); } finally { try { after?.dispose(); } finally { if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true }); } }
}
