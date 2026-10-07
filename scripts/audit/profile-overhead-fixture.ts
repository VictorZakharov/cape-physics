import { CapeSimulation } from '../../src/physics/CapeSimulation';
import { registerStaticWorldColliderIndex } from '../../src/physics/StaticWorldColliderIndex';
import { workerStepTiming, WORKER_PHASES } from '../../src/physics/WorkerStepTiming';
import { createClothFixture } from './cloth-fixture';
export function measureWorkerProfileOverhead(progress: (message: string) => void = () => {}) {
let fixture: ReturnType<typeof createClothFixture> | undefined;
try {
  workerStepTiming.isWorker=true;
  const trials: Array<{enabled:boolean;milliseconds:number}>=[];
  const phases=Object.fromEntries(WORKER_PHASES.map(phase=>[phase,0]));
  let samples=0,inputMilliseconds=0,endpointBytes=0;
  const collisionDetail={self:0,fold:0,world:0,cave:0};
  // ABBA alternation limits drift. Each run restores cloth and character state and replays the same paths.
  // Prime both clock paths before measurement so initial JIT transitions cannot bias the first off trial.
  for (const enabled of [false, true]) {
    fixture=createClothFixture(CapeSimulation,5,true);registerStaticWorldColliderIndex(fixture.worldColliders);workerStepTiming.enabled=enabled;
    for(let step=1;step<=450;step++){workerStepTiming.beginBatch();fixture.advance(step);}
    fixture.dispose();fixture=undefined;
  }
  // Matched states are solved consecutively; ABBA ordering alternates each step to limit CPU/scheduling drift.
  for(let pair=0;pair<4;pair++) {
    const offFixture=createClothFixture(CapeSimulation,5,true),onFixture=createClothFixture(CapeSimulation,5,true);
    registerStaticWorldColliderIndex(offFixture.worldColliders);registerStaticWorldColliderIndex(onFixture.worldColliders);
    let offDuration=0,onDuration=0;
    try {
      for(let step=1;step<=780;step++) {
        for(const enabled of step%4<2 ? [false,true] : [true,false]) {
          const current=enabled?onFixture:offFixture;
          workerStepTiming.enabled=enabled;current.prepareInputs(step);workerStepTiming.beginBatch();
          const start=performance.now();current.solve(step);const milliseconds=performance.now()-start;
          const split=workerStepTiming.finishBatch(milliseconds);const duration=performance.now()-start;
          if(step<=180)continue;
          if(enabled)onDuration+=duration;else offDuration+=duration;
          if(split){inputMilliseconds+=current.inputUpdateMilliseconds;endpointBytes=current.bots[0]!.packet.endpoints.byteLength;for(const key of Object.keys(collisionDetail) as Array<keyof typeof collisionDetail>)collisionDetail[key]+=split.collisionDetail![key];for(const phase of WORKER_PHASES)phases[phase]!+=split.phases[phase];samples++;}
        }
      }
    } finally {try {offFixture.dispose();}finally{onFixture.dispose();}}
    trials.push({enabled:false,milliseconds:offDuration},{enabled:true,milliseconds:onDuration});
    progress(`Matched pair ${pair+1}: off ${offDuration.toFixed(2)} ms / on ${onDuration.toFixed(2)} ms, 600 identical five-cape steps`);
  }
  const sum=(enabled:boolean)=>trials.filter(trial=>trial.enabled===enabled).reduce((total,trial)=>total+trial.milliseconds,0);
  const off=sum(false),on=sum(true),overheadPercent=(on/off-1)*100;
  const result={order:'matched states; ABBA ordering per step, four pairs; both paths primed 450 steps',trials,offMilliseconds:off,onMilliseconds:on,overheadPercent,underTwoPercent:overheadPercent<2,
    inputUpdateMillisecondsPerWorkerStep: inputMilliseconds / samples, endpointBytesPerCapeStep: endpointBytes,
    collisionDetailPerCapeStep: Object.fromEntries(Object.entries(collisionDetail).map(([key,value])=>[key,value/samples/5])),
    phasesPerWorkerStep:Object.fromEntries(WORKER_PHASES.map(phase=>[phase,phases[phase]!/samples])),samples};
  return result;
} finally {fixture?.dispose();workerStepTiming.isWorker=false;workerStepTiming.enabled=false;}

}
