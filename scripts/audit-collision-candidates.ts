import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { collisionProbe as probe, phases, type Phase } from './audit/collision-probe';
import { createClothFixture } from './audit/cloth-fixture';
const parent = resolve('artifacts/.tmp'); mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'collision-candidates-'));
let fixture: ReturnType<typeof createClothFixture> | undefined;
try {
  cpSync('src', join(root, 'src'), { recursive: true });
  if (process.env.CAPE_COLLISION_AUDIT_STAGE !== 'after') {
    for (const file of ['CapeContactSolver.ts', 'ClothBodyCollision.ts', 'ClothSelfCollision.ts']) writeFileSync(join(root, 'src/physics', file), execFileSync('git', ['show', `e643183:src/physics/${file}`]));
  }
  const header = `import { collisionProbe as audit } from '${resolve('scripts/audit/collision-probe.ts').replaceAll('\\', '/')}';\n`;
  function patch(file: string, changes: Array<[string, string]>) {
    const path = join(root, 'src/physics', file); let source = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
    for (const [before, after] of changes) {
      if (!source.includes(before)) throw Error('Probe site missing: ' + file + ': ' + before);
      source = source.replace(before, after);
    } writeFileSync(path, header + source);
  }
  patch('ClothSelfCollision.ts', [
    ['while (second >= 0) {', 'while (second >= 0) { if (audit.enabled) audit.buckets++;'],
    ['const distanceSquared = this.delta.lengthSq();', "const distanceSquared = this.delta.lengthSq(); audit.count('self', first, distanceSquared < minimumSquared); audit.count('self', second, distanceSquared < minimumSquared);"],
  ]);
  patch('ClothFoldGuard.ts', [['const excess = lower.y - upper.y - MAXIMUM_LOCAL_UPWARD_FOLD;', "const excess = lower.y - upper.y - MAXIMUM_LOCAL_UPWARD_FOLD; audit.count('fold', lower, excess > 0); audit.count('fold', upper, excess > 0);"]]);
  patch('CapeContactSolver.ts', [
    ['const range = WORLD_QUERY_RADIUS + collider.radius;', 'if (audit.enabled) audit.worldScans++; const range = WORLD_QUERY_RADIUS + collider.radius;'],
    ['this.nearbyWorldColliders.push(collider);', 'this.nearbyWorldColliders.push(collider); if (audit.enabled) audit.worldNearby++;'],
    ["if (position.y < floor) this.applyAxisCorrection", "audit.count('cave', position, position.y < floor); if (position.y < floor) this.applyAxisCorrection"],
    ["if (position.y > ceiling) this.applyAxisCorrection", "audit.count('cave', position, position.y > ceiling); if (position.y > ceiling) this.applyAxisCorrection"],
    ["if (clampedZ !== position.z) this.applyAxisCorrection", "audit.count('cave', position, clampedZ !== position.z); if (clampedZ !== position.z) this.applyAxisCorrection"],
    ["if (clampedX !== position.x) this.applyAxisCorrection", "audit.count('cave', position, clampedX !== position.x); if (clampedX !== position.x) this.applyAxisCorrection"],
  ]);
  const { CapeSimulation } = await import(pathToFileURL(join(root, 'src/physics/CapeSimulation.ts')).href);
  fixture = createClothFixture(CapeSimulation,50,true);
  if (process.env.CAPE_COLLISION_AUDIT_STAGE === 'after') {
    const { registerStaticWorldColliderIndex } = await import(pathToFileURL(join(root, 'src/physics/StaticWorldColliderIndex.ts')).href);
    registerStaticWorldColliderIndex(fixture.worldColliders);
  }
  const totals = Object.fromEntries(phases.map(key => [key, { tests: 0, hits: 0, worst: 0, milliseconds: 0 }])) as Record<Phase, { tests: number; hits: number; worst: number; milliseconds: number }>;
  const timings = Object.fromEntries(phases.map(key => [key, 0])) as Record<Phase, number>;
  function wrap(target: any, key: string, callback: (args: any[], invoke: () => any) => any) {
    const original = target[key]; target[key] = function (...args: any[]) { return callback(args, () => original.apply(this, args)); };
  }
  for (const bot of fixture.bots) {
    const sim = bot.simulation as any, contact = sim.contactSolver, guards = sim.shapeGuards;
    for (const [target, key, phase] of [[contact,'solveBody','body'],[contact,'solveWorld','world'],[contact,'solvePostCaveWorldContacts','world'],[contact,'solveCave','cave'],[guards,'solveSelfCollision','self'],[guards,'solveFoldAndRows','fold']] as const) {
      wrap(target,key,(_args,invoke) => { const start = performance.now(); const result=invoke(); if(probe.enabled) timings[phase]+=performance.now()-start; return result; });
    }
    let insideBody = false;
    wrap(contact, 'solveBody', (_args, invoke) => { insideBody = true; try { return invoke(); } finally { insideBody = false; } });
    wrap(contact,'getCapsulePenetration',(args,invoke)=>{const value=invoke();if(insideBody)probe.count('body',args[0],value>0);return value;});
    wrap(contact,'solveWorldSphere',(args,invoke)=>{const value=invoke();probe.count('world',args[0],value===true);return value;});
    wrap(contact,'solveWorldRock',(args,invoke)=>{const value=invoke();probe.count('world',args[1],value===true);return value;});
    let bodyTriangle: number[] = [];
    wrap(contact.bodyFaceCollision,'solveTriangle',(args,invoke)=>{
      bodyTriangle=args.slice(0,3);bodyTriangle.forEach(index=>probe.count('body',index));try{return invoke();}finally{bodyTriangle=[];}
    });
    wrap(contact.bodyFaceCollision,'oneSidedPenetration',(args,invoke)=>{
      const value=invoke();if(value>0) bodyTriangle.forEach(index=>probe.mark('body',index));return value;
    });
    for(const target of [contact.faceCollision,contact.rockFaceCollision]) wrap(target,'solveTriangle',(args,invoke)=>{
      const result=invoke();for(const index of args.slice(0,3))probe.count('world',index,result>0);return result;
    });
    let caveTriangle:number[]=[];
    wrap(contact.caveFaceCollision,'solveTriangle',(args,invoke)=>{caveTriangle=args.slice(0,3);return invoke();});
    wrap(contact.caveFaceCollision,'getSampleCorrection',(args,invoke)=>{
      const value=invoke();caveTriangle.forEach(index=>probe.count('cave',index,Math.abs(value)>1e-6));return value;
    });
  }
  for(let step=1;step<=90;step++) fixture.advance(step);
  console.log('Candidate probe: full-scene warm-up complete');
  const measuredSteps=60;
  probe.enabled=true;
  for(let step=91;step<91+measuredSteps;step++) {
    fixture.prepareInputs(step);
    for(const bot of fixture.bots) {
      probe.begin((bot.simulation as any).positions); phases.forEach(key=>timings[key]=0);
      fixture.solveCape(bot,step);
      for(const phase of phases) {
        const total=totals[phase];total.tests+=probe.tests[phase].reduce((sum,value)=>sum+value,0);
        total.hits+=probe.hits[phase].reduce((sum,value)=>sum+value,0);
        total.worst=Math.max(total.worst,...probe.tests[phase]);total.milliseconds+=timings[phase];
      }
    }
  }
  const capeSteps=measuredSteps*fixture.bots.length;
  const output={stage:process.env.CAPE_COLLISION_AUDIT_STAGE??'before', scene:{seed:'authored CaveWorld seeds',bots:50,delta:1/30,warmupSteps:90,measuredSteps,worldColliders:fixture.worldColliders.length,
    inventory:Object.fromEntries([...new Set(fixture.worldColliders.map(item=>item.kind))].map(kind=>[kind,fixture!.worldColliders.filter(item=>item.kind===kind).length])),bodyCapsules:fixture.bots[0]!.character.getCapeColliders().length},
    worldAnchorPrefilter:{testedPerCapeStep:probe.worldScans/capeSteps,acceptedPerCapeStep:probe.worldNearby/capeSteps},
    selfHashChainVisitsPerParticleStep:probe.buckets/(capeSteps*234),
    phases:Object.fromEntries(phases.map(phase=>[phase,{testsPerParticleStep:totals[phase].tests/(capeSteps*234),positiveRangeTestsPerParticleStep:totals[phase].hits/(capeSteps*234),worstParticleTestsPerStep:totals[phase].worst,auditedMillisecondsPerCapeStep:totals[phase].milliseconds/capeSteps}]))};
  // Replay the same paths with fresh capes and coarse clocks only. Candidate counters and their monkey patches are absent.
  probe.enabled=false;fixture.dispose();fixture=createClothFixture(CapeSimulation,50,true);
  const timingModule=await import(pathToFileURL(join(root,'src/physics/WorkerStepTiming.ts')).href);
  timingModule.workerStepTiming.isWorker=true;timingModule.workerStepTiming.enabled=false;
  if(process.env.CAPE_COLLISION_AUDIT_STAGE==='after') {
    const {registerStaticWorldColliderIndex}=await import(pathToFileURL(join(root,'src/physics/StaticWorldColliderIndex.ts')).href);registerStaticWorldColliderIndex(fixture.worldColliders);
  }
  let measuring=false,inputMilliseconds=0;
  const coarse=Object.fromEntries(phases.map(phase=>[phase,0])) as Record<Phase,number>;
  for(const bot of fixture.bots) {
    const sim=bot.simulation as any,contact=sim.contactSolver,guards=sim.shapeGuards;
    for(const [target,key,phase] of [[contact,'solveBody','body'],[contact,'solveWorld','world'],[contact,'solvePostCaveWorldContacts','world'],[contact,'solveCave','cave'],[guards,'solveSelfCollision','self'],[guards,'solveFoldAndRows','fold']] as const) {
      wrap(target,key,(_args,invoke)=>{if(!measuring)return invoke();const start=performance.now();const result=invoke();coarse[phase]+=performance.now()-start;return result;});
    }
  }
  for(let step=1;step<=90;step++)fixture.advance(step);
  measuring=true;
  for(let step=91;step<=150;step++){fixture.advance(step);inputMilliseconds+=fixture.inputUpdateMilliseconds;}
  Object.assign(output,{coarseTimingWithoutCounters:{runtime:`Bun ${Bun.version}`,inputUpdateMillisecondsPerCapeStep:inputMilliseconds/capeSteps,millisecondsPerCapeStep:Object.fromEntries(phases.map(phase=>[phase,coarse[phase]/capeSteps]))}});
  mkdirSync('artifacts/worker-collision' ,{recursive:true});writeFileSync(`artifacts/worker-collision/candidate-audit-${process.env.CAPE_COLLISION_AUDIT_STAGE==='after'?'after':'before'}.json`,JSON.stringify(output,null,2));console.log(JSON.stringify(output,null,2));
} finally {
  probe.enabled=false;
  try { fixture?.dispose(); } finally {
    if(!root.startsWith(parent+sep))throw Error('Unexpected temporary path');
    rmSync(root,{recursive:true,force:true});
  }
}
