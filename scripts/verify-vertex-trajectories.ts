import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { bodyVertexDebug as bodyCandidateDebug, VertexBodyCandidates } from '../src/physics/VertexBodyCandidates';
import { CapeContactSolver } from '../src/physics/CapeContactSolver';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { registerStaticWorldColliderIndex } from '../src/physics/StaticWorldColliderIndex';
import { workerStepTiming } from '../src/physics/WorkerStepTiming';
import { createClothFixture } from './audit/cloth-fixture';
bodyCandidateDebug.assertions = process.env.CAPE_VERTEX_ASSERT === '1';
if (process.env.CAPE_VERTEX_SKIN) bodyCandidateDebug.skin = Number(process.env.CAPE_VERTEX_SKIN);
const bodyCandidateMetrics = { builds: 0, rebuilds: 0, candidates: 0, worstCandidates: 0, worstBuilds: 0, overflows: 0 };
const listStates = new WeakMap<object, { builds: Uint16Array; overflow: Uint8Array }>();
const listBegin = VertexBodyCandidates.prototype.beginStep, listMask = VertexBodyCandidates.prototype.mask;
VertexBodyCandidates.prototype.beginStep = function () {
  const state = listStates.get(this) ?? { builds: new Uint16Array(234), overflow: new Uint8Array(234) };
  state.builds.fill(0); state.overflow.fill(0); listStates.set(this, state); listBegin.call(this);
};
VertexBodyCandidates.prototype.mask = function (index, point, colliders) {
  const state = listStates.get(this)!, list = this as any, offset = index * 3;
  const dx = point.x - list.reference[offset], dy = point.y - list.reference[offset + 1], dz = point.z - list.reference[offset + 2];
  const rebuild = colliders.length <= 32 && (!list.valid[index] || dx * dx + dy * dy + dz * dz >= bodyCandidateDebug.skin ** 2);
  if (colliders.length > 32 && !state.overflow[index]) { state.overflow[index] = 1; bodyCandidateMetrics.overflows++; }
  const valid = list.valid[index], mask = listMask.call(this, index, point, colliders);
  if (rebuild) {
    bodyCandidateMetrics.builds++; if (valid) bodyCandidateMetrics.rebuilds++;
    state.builds[index] = state.builds[index]! + 1; bodyCandidateMetrics.worstBuilds = Math.max(bodyCandidateMetrics.worstBuilds, state.builds[index]!);
    let count = 0; for (let bits = mask >>> 0; bits; bits = (bits & (bits - 1)) >>> 0) count++;
    bodyCandidateMetrics.candidates += count; bodyCandidateMetrics.worstCandidates = Math.max(bodyCandidateMetrics.worstCandidates, count);
  }
  return mask;
};
let bodyCalls = 0, stepsChecked = 0;
const originalBegin = CapeContactSolver.prototype.beginStep, originalSolve = CapeContactSolver.prototype.solveBody;
const signatures = new WeakMap<CapeContactSolver, string>();
function signature(colliders: any, back: any) { return JSON.stringify([back.toArray(), colliders.map((c: any) => [c.start.toArray(), c.end.toArray(), c.radius, c.depthRadius, c.clearance, c.faceSampleSpacing])]); }
CapeContactSolver.prototype.beginStep = function (anchor, world, body, back) { stepsChecked++; signatures.set(this, signature(body, back)); originalBegin.call(this, anchor, world, body, back); };
CapeContactSolver.prototype.solveBody = function (body, back) { bodyCalls++; if (signature(body, back) !== signatures.get(this)) throw Error('Body collider state changed within step'); originalSolve.call(this, body, back); };
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'vertex-trajectories-'));
let before: ReturnType<typeof createClothFixture> | undefined, after: typeof before;
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  for (const file of ['CapeContactSolver.ts', 'CapeBodyColliderPreparation.ts', 'ClothBodyCollision.ts']) writeFileSync(join(root, 'src/physics', file), execFileSync('git', ['show', `15f268a:src/physics/${file}`]));
  const baseline = await import(pathToFileURL(join(root, 'src/physics/CapeSimulation.ts')).href);
  const index = await import(pathToFileURL(join(root, 'src/physics/StaticWorldColliderIndex.ts')).href);
  const timing = (await import(pathToFileURL(join(root, 'src/physics/WorkerStepTiming.ts')).href)).workerStepTiming;
  before = createClothFixture(baseline.CapeSimulation, 50, true); after = createClothFixture(CapeSimulation, 50, true);
  index.registerStaticWorldColliderIndex(before.worldColliders); registerStaticWorldColliderIndex(after.worldColliders);
  timing.isWorker = workerStepTiming.isWorker = true; timing.enabled = workerStepTiming.enabled = true;
  const steps = process.env.CAPE_VERTEX_OVERFLOW_ONLY === '1' ? 0 : 600, capes = 50, particles = 234;
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
  const variants = process.env.CAPE_VERTEX_OVERFLOW_ONLY === '1' ? [] : process.env.CAPE_VERTEX_ALL !== '0' ? [{ skin: 0.026, assertions: false }, { skin: 0.026, assertions: true }, { skin: 0.000001, assertions: true }] : [{ skin: bodyCandidateDebug.skin, assertions: bodyCandidateDebug.assertions }];
  for (const variant of variants) {
  bodyCalls = stepsChecked = 0;
  for (const group of Object.values(contact)) { group.steps = group.vertexCorrections = group.triangleCorrections = 0; }
  bodyCandidateDebug.skin = variant.skin; bodyCandidateDebug.assertions = variant.assertions; bodyCandidateDebug.skippedAssertions = 0;
  for (const key of Object.keys(bodyCandidateMetrics)) bodyCandidateMetrics[key as keyof typeof bodyCandidateMetrics] = 0;
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
  const result = { baseline: '15f268a', steps, capes, particles, delta: 1 / 30, coordinatesCompared: compared, maximumDeviation, bitIdentical: true,
    stress: 'steps 181-240: all 50 capes driven 0.22 scene units into the body every five steps; same fixed bot paths', contact,
    assertionMode: bodyCandidateDebug.assertions, skin: bodyCandidateDebug.skin, colliderConstancy: { stepsChecked, bodyCalls, changed: 0 }, candidates: { ...bodyCandidateMetrics }, skippedPairAssertions: bodyCandidateDebug.skippedAssertions };
  mkdirSync('artifacts/vertex-only', { recursive: true }); writeFileSync(`artifacts/vertex-only/vertex-regression-${bodyCandidateDebug.assertions ? `assert-${bodyCandidateDebug.skin}` : bodyCandidateDebug.skin}.json`, JSON.stringify(result, null, 2)); console.log(JSON.stringify(result, null, 2));
  after.dispose(); after = undefined;
  if (variant !== variants.at(-1)) { after = createClothFixture(CapeSimulation, 50, true); registerStaticWorldColliderIndex(after.worldColliders); }
  }
  before.dispose(); after?.dispose();
  before = createClothFixture(baseline.CapeSimulation, 1, false); after = createClothFixture(CapeSimulation, 1, false);
  index.registerStaticWorldColliderIndex(before.worldColliders); registerStaticWorldColliderIndex(after.worldColliders);
  bodyCandidateDebug.skin = 0.026; bodyCandidateDebug.assertions = true; bodyCandidateDebug.skippedAssertions = 0;
  for (const key of Object.keys(bodyCandidateMetrics)) bodyCandidateMetrics[key as keyof typeof bodyCandidateMetrics] = 0;
  for (const fixture of [before, after]) {
    const character = fixture.bots[0]!.character, get = character.getCapeColliders.bind(character), expanded = [...get(), ...get(), ...get()];
    character.getCapeColliders = () => expanded;
  }
  let overflowCoordinates = 0;
  for (let step = 1; step <= 5; step++) {
    before.advance(step); after.advance(step);
    const old = (before.bots[0]!.simulation as any).positions, current = (after.bots[0]!.simulation as any).positions;
    for (let particle = 0; particle < 234; particle++) for (const axis of ['x', 'y', 'z']) {
      if (!Object.is(old[particle][axis], current[particle][axis])) throw Error('Overflow fallback changed a particle');
      overflowCoordinates++;
    }
  }
  if (bodyCandidateMetrics.overflows === 0) throw Error('Overflow fixture did not exercise fallback');
  const overflow = { capes: 1, steps: 5, colliders: 45, samples: 150, coordinatesCompared: overflowCoordinates, bitIdentical: true, maximumDeviation: 0, candidates: { ...bodyCandidateMetrics }, skippedPairAssertions: bodyCandidateDebug.skippedAssertions };
  mkdirSync('artifacts/vertex-only', { recursive: true }); writeFileSync('artifacts/vertex-only/vertex-overflow.json', JSON.stringify(overflow, null, 2)); console.log(JSON.stringify(overflow, null, 2));
} finally {
  workerStepTiming.isWorker = workerStepTiming.enabled = false;
  try { before?.dispose(); } finally { try { after?.dispose(); } finally { if (!root.startsWith(parent + sep)) throw Error('Unexpected temporary path'); rmSync(root, { recursive: true, force: true }); } }
}
