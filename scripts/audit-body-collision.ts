import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { applySerializedCapsuleEndpoints, serializeCapsuleEndpoints } from '../src/physics/CapeWorkerProtocol';
import { createClothFixture } from './audit/cloth-fixture';
import type { CapeSimulation } from '../src/physics/CapeSimulation';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'body-investigation-'));
let clock: any;

const capes = 50, warmup = 90, measured = 60, particles = 234;
let fixture: ReturnType<typeof createClothFixture> | undefined;
const totals = { calls: 0, faceCalls: 0, vertexTests: 0, vertexCorrections: 0, faceTests: 0, faceCorrections: 0, worstVertex: 0, worstFace: 0 };
const clocks = { body: 0, faces: 0, preparation: 0, input: 0, character: 0 };
function wrap(target: any, key: string, callback: (args: any[], invoke: () => any) => any) {
  const original = target[key];
  target[key] = function (...args: any[]) { return callback(args, () => original.apply(this, args)); };
}
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  for (const file of ['CapeContactSolver.ts', 'CapeBodyColliderPreparation.ts', 'ClothBodyCollision.ts']) writeFileSync(join(root, 'src/physics', file), execFileSync('git', ['show', `2432d53:src/physics/${file}`]));
  const { CapeSimulation } = await import(pathToFileURL(join(root, 'src/physics/CapeSimulation.ts')).href);
  const { registerStaticWorldColliderIndex } = await import(pathToFileURL(join(root, 'src/physics/StaticWorldColliderIndex.ts')).href);
  clock = (await import(pathToFileURL(join(root, 'src/physics/WorkerStepTiming.ts')).href)).workerStepTiming;
  clock.isWorker = true;
  for (const counters of process.env.CAPE_BODY_MICRO_ONLY ? [] : [true, false]) {
    fixture = createClothFixture(CapeSimulation, capes, true);
    registerStaticWorldColliderIndex(fixture.worldColliders);
    let measuring = false;
    for (const bot of fixture.bots) {
      const sim = bot.simulation as any, contact = sim.contactSolver, face = contact.bodyFaceCollision;
      let inBody = false;
      const perVertex = new Uint32Array(particles), perFace = new Uint32Array(particles);
      if (counters) {
        wrap(contact, 'solveBody', (_args, invoke) => {
          if (!measuring) return invoke();
          totals.calls++; inBody = true;
          try { return invoke(); } finally { inBody = false; }
        });
        wrap(contact, 'getCapsulePenetration', (args, invoke) => {
          const value = invoke();
          if (measuring && inBody) {
            const index = sim.positions.indexOf(args[0]);
            if (index >= 0) perVertex[index]++;
            totals.vertexTests++; if (value > 0) totals.vertexCorrections++;
          }
          return value;
        });
        wrap(face, 'solve', (_args, invoke) => { if (measuring) totals.faceCalls++; return invoke(); });
        wrap(face, 'solveTriangle', (args, invoke) => {
          if (!measuring) return invoke();
          const indices = args.slice(0, 3);
          const before = indices.reduce((sum: number, index: number) => sum + face.getCorrectionUsed(index), 0);
          indices.forEach((index: number) => perFace[index]++); totals.faceTests++;
          const result = invoke();
          if (indices.reduce((sum: number, index: number) => sum + face.getCorrectionUsed(index), 0) > before) totals.faceCorrections++;
          return result;
        });
        wrap(sim, 'step', (_args, invoke) => {
          perVertex.fill(0); perFace.fill(0); const result = invoke();
          if (measuring) { totals.worstVertex = Math.max(totals.worstVertex, ...perVertex); totals.worstFace = Math.max(totals.worstFace, ...perFace); }
          return result;
        });
      } else {
        for (const [target, key, clock] of [[contact, 'solveBody', 'body'], [face, 'solve', 'faces'], [contact, 'prepareBodyColliders', 'preparation'], [bot.character, 'getCapeColliders', 'character']] as const) {
          wrap(target, key, (_args, invoke) => { if (!measuring) return invoke(); const start = performance.now(); const result = invoke(); clocks[clock] += performance.now() - start; return result; });
        }
      }
    }
    for (let step = 1; step <= warmup; step++) fixture.advance(step);
    measuring = true;
    for (let step = warmup + 1; step <= warmup + measured; step++) { fixture.advance(step); if (!counters) clocks.input += fixture.inputUpdateMilliseconds; }
    fixture.dispose(); fixture = undefined;
    console.log(counters ? 'Body candidate counters complete' : 'Coarse timing replay complete');
  }
  fixture = createClothFixture(CapeSimulation, 1, true);
  registerStaticWorldColliderIndex(fixture.worldColliders);
  for (let step = 1; step <= 90; step++) fixture.advance(step);
  const bot = fixture.bots[0]!, contact = (bot.simulation as any).contactSolver;
  const prepared = contact.preparedBodyColliders;
  const groups = { sphere: prepared.filter((item: any) => item.axisX ** 2 + item.axisY ** 2 + item.axisZ ** 2 < 1e-12), capsule: prepared.filter((item: any) => item.axisX ** 2 + item.axisY ** 2 + item.axisZ ** 2 >= 1e-12) };
  const typeCost: Record<string, unknown> = {};
  const datasets = Object.fromEntries(Object.entries(groups).map(([type, colliders]) => [type, colliders.flatMap((collider: any) => [
    { collider, point: (bot.simulation as any).positions[180] },
    { collider, point: { x: collider.startX + collider.axisX * 0.5 + bot.anchors.back.x * collider.depthRadius * 0.25,
      y: collider.startY + collider.axisY * 0.5, z: collider.startZ + collider.axisZ * 0.5 + bot.anchors.back.z * collider.depthRadius * 0.25 } },
  ])]));
  for (const pairs of Object.values(datasets)) for (let repeat = 0; repeat < 10000; repeat++) for (const pair of pairs) contact.getCapsulePenetration(pair.point, pair.collider, bot.anchors.back);
  const costs = { sphere: { calls: 0, milliseconds: 0, hits: 0 }, capsule: { calls: 0, milliseconds: 0, hits: 0 } };
  for (let trial = 0; trial < 8; trial++) for (const type of trial % 4 < 2 ? ['sphere', 'capsule'] as const : ['capsule', 'sphere'] as const) {
    const pairs = datasets[type]!, total = costs[type], start = performance.now();
    for (let repeat = 0; repeat < 100000; repeat++) for (const pair of pairs) { if (contact.getCapsulePenetration(pair.point, pair.collider, bot.anchors.back) > 0) total.hits++; total.calls++; }
    total.milliseconds += performance.now() - start;
  }
  for (const type of ['sphere', 'capsule'] as const) typeCost[type] = { colliders: groups[type].length, calls: costs[type].calls,
    nanosecondsPerCall: costs[type].milliseconds * 1e6 / costs[type].calls, correctionPercent: costs[type].hits * 100 / costs[type].calls,
    scope: 'isolated paired ABBA microbenchmark: equal numbers of an actual hem particle and an interior point for each collider; primed before timing; not the live contact distribution' };
  const repeats = 100000;
  let start = performance.now();
  for (let repeat = 0; repeat < repeats; repeat++) applySerializedCapsuleEndpoints(bot.packet.endpoints, bot.bodyColliders);
  const endpointCopy = (performance.now() - start) / repeats;
  start = performance.now();
  for (let repeat = 0; repeat < repeats; repeat++) serializeCapsuleEndpoints(bot.bodyColliders);
  const endpointPack = (performance.now() - start) / repeats;
  const steps = capes * measured;
  const result = { baseline: '2432d53', runtime: `Bun ${Bun.version}`, capes, particles, warmup, measured, delta: 1 / 30,
    inventory: '8 capsule segments and 7 degenerate spheres, with some anisotropic radii; no boxes',
    isolatedTypeMicrobench: typeCost, endpointCopyMilliseconds: endpointCopy, endpointPackingMilliseconds: endpointPack, endpointBytes: fixture.bots[0]!.packet.endpoints.byteLength,
    bodyCallsPerCapeStep: totals.calls / steps, faceCallsPerCapeStep: totals.faceCalls / steps,
    vertex: { testsPerParticleStep: totals.vertexTests / (steps * particles), worstPerParticleStep: totals.worstVertex, correctionPercent: totals.vertexCorrections / totals.vertexTests * 100, millisecondsPerCapeStep: (clocks.body - clocks.faces) / steps },
    faces: { triangleSampleTestsPerCapeStep: totals.faceTests / steps, incidentTestsPerParticleStep: totals.faceTests * 3 / (steps * particles), worstIncidentPerParticleStep: totals.worstFace, correctionPercent: totals.faceCorrections / totals.faceTests * 100, millisecondsPerCapeStep: clocks.faces / steps },
    bodyMillisecondsPerCapeStep: clocks.body / steps, preparationMillisecondsPerCapeStep: clocks.preparation / steps, workerInputUpdateMillisecondsPerCapeStep: clocks.input / steps, characterColliderAccessMillisecondsPerCapeStep: clocks.character / steps,
    caveat: 'Counts and coarse timings use separate deterministic replays. Input time includes anchor rebase/copies plus body endpoint copies; endpoint copy/packing and type costs also have separate microbenchmarks, which exclude message delivery and do not represent in-loop cost. No clocks per particle, collider or triangle.' };
  mkdirSync('artifacts/body-collision', { recursive: true });
  const output = process.env.CAPE_BODY_MICRO_ONLY ? { baseline: result.baseline, runtime: result.runtime, isolatedTypeMicrobench: typeCost, endpointCopyMilliseconds: endpointCopy, endpointPackingMilliseconds: endpointPack, endpointBytes: result.endpointBytes } : result;
  writeFileSync(`artifacts/body-collision/${process.env.CAPE_BODY_MICRO_ONLY ? 'type-and-input-cost' : 'investigation'}.json`, JSON.stringify(output, null, 2) + '\n'); console.log(JSON.stringify(output, null, 2));
} finally { if (clock) clock.isWorker = false; try { fixture?.dispose(); } finally { if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true }); } }
