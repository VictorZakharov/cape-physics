import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CapeSimulation } from '../src/physics/CapeSimulation';
import { registerStaticWorldColliderIndex } from '../src/physics/StaticWorldColliderIndex';
import { workerStepTiming } from '../src/physics/WorkerStepTiming';
import { createClothFixture } from './audit/cloth-fixture';
const parent=resolve('artifacts/.tmp');mkdirSync(parent,{recursive:true});
const root=mkdtempSync(join(parent,'worker-trajectories-'));
let before: ReturnType<typeof createClothFixture>|undefined, after: ReturnType<typeof createClothFixture>|undefined;
try {
  cpSync('src',join(root,'src'),{recursive:true});
  for(const file of ['CapeContactSolver.ts','ClothBodyCollision.ts','ClothSelfCollision.ts']) {
    writeFileSync(join(root,'src/physics',file),execFileSync('git',['show',`e643183:src/physics/${file}`]));
  }
  const { CapeSimulation: BaselineSimulation }=await import(pathToFileURL(join(root,'src/physics/CapeSimulation.ts')).href);
  before=createClothFixture(BaselineSimulation,50,true);after=createClothFixture(CapeSimulation,50,true);
  registerStaticWorldColliderIndex(after.worldColliders);
  workerStepTiming.isWorker=true; workerStepTiming.enabled=false;
  const steps=600, capes=50, particles=234;
  // Float64 stores every coordinate from every cape after every step; comparison never rounds to packed Float32.
  const positions=new Float64Array(steps*capes*particles*3);
  let offset=0;
  console.log('Recording baseline: 50 capes x 600 fixed 1/30 s steps');
  for(let step=1;step<=steps;step++) {
    before.advance(step);
    for(const bot of before.bots) for(const point of (bot.simulation as any).positions) {
      positions[offset++]=point.x;positions[offset++]=point.y;positions[offset++]=point.z;
    }
    if(step%100===0)console.log(`Baseline ${step}/${steps}`);
  }
  let maximumDeviation=0, worst={step:0,cape:0,particle:0,axis:0}, compared=0;
  console.log('Comparing optimized trajectories without loosening 1e-5 tolerance');
  for(let step=1;step<=steps;step++) {
    after.advance(step);
    for(let cape=0;cape<capes;cape++) {
      const points=(after.bots[cape]!.simulation as any).positions;
      for(let particle=0;particle<particles;particle++) {
        const point=points[particle];
        for(let axis=0;axis<3;axis++) {
          const deviation=Math.abs(positions[compared++]!-(axis===0?point.x:axis===1?point.y:point.z));
          if(!Number.isFinite(deviation))throw Error('Non-finite trajectory difference');
          if(deviation>maximumDeviation){maximumDeviation=deviation;worst={step,cape,particle,axis};}
        }
      }
    }
    if(step%100===0)console.log(`Optimized ${step}/${steps}, max deviation ${maximumDeviation}`);
  }
  const result={baseline:'e643183',seed:'authored CaveWorld seeds; deterministic BotMovementInput paths',steps,capes,particles,delta:1/30,coordinatesCompared:compared,maximumDeviation,tolerance:1e-5,passed:maximumDeviation<=1e-5,worst};
  mkdirSync('artifacts/worker-collision',{recursive:true});writeFileSync('artifacts/worker-collision/trajectory-regression.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
  if(!result.passed)throw Error(`Trajectory deviation ${maximumDeviation} exceeds 1e-5; tolerance not changed`);
} finally {
  workerStepTiming.isWorker=false;workerStepTiming.enabled=false;
  try { before?.dispose(); } finally {
    try { after?.dispose(); } finally {
      if(!root.startsWith(parent+sep))throw Error('Unexpected trajectory fixture path');
      rmSync(root,{recursive:true,force:true});
    }
  }
}
