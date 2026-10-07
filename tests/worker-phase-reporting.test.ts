import { expect, test } from 'bun:test';
import * as THREE from 'three';
import { chooseWorkerConfiguration } from '../src/physics/WorkerConfiguration';
import { StaticWorldColliderIndex } from '../src/physics/StaticWorldColliderIndex';
import type { WorldCollider } from '../src/physics/colliders';
import { WorkerTelemetry } from '../src/physics/WorkerTelemetry';
import { formatBodyCandidates, formatWorkerPhaseSplit } from '../src/core/PerformanceReport';

test('worker override is bounded and explicitly preserves the actual CPU', () => {
  const override=chooseWorkerConfiguration(24,'?workers=3');
  expect(override.workers).toBe(3);expect(override.overridden).toBe(true);expect(override.rule).toContain('CPU speed unchanged');
  expect(chooseWorkerConfiguration(4,'?workers=999').workers).toBe(3);
  expect(chooseWorkerConfiguration(24,'?workers=bad').workers).toBe(10);
  expect(chooseWorkerConfiguration(1,'?workers=3').workers).toBe(1);
  expect(chooseWorkerConfiguration(24,'?workerProfile=0').profiling).toBe(false);
});
test('sampled phase shares are apportioned to all-step compute and sum to it', () => {
  const telemetry=new WorkerTelemetry();telemetry.reset(0,0);
  const phases={constraints:1,body:4,selfFold:2,worldCave:2,other:1};
  for(let index=0;index<7;index++)telemetry.record({time:index*40,compute:10,latency:40,simulatedStep:33, capes:5,stepPhases:{computeMilliseconds:10,phases}});
  expect(telemetry.getSnapshot(240).stepPhases).toBeNull();
  telemetry.record({time:280,compute:10,latency:40,simulatedStep:33,capes:5,stepPhases:{computeMilliseconds:10,phases}});
  const split=telemetry.getSnapshot(280).stepPhases!;
  expect(Object.values(split.phases).reduce((sum,value)=>sum+value,0)).toBeCloseTo(telemetry.getSnapshot(280).computeMilliseconds!,10);
  expect(formatWorkerPhaseSplit(split)).toContain('body 4.00 ms (40.0%)');
  expect(formatWorkerPhaseSplit(split)).toContain('sum 10.00 ms / compute 10.00 ms');
});
test('static grid conservatively includes every legacy hit and retains collider order with reused storage', () => {
  let seed=124943;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const colliders:WorldCollider[]=Array.from({length:500},()=>({kind:'formation',walkable:false,center:new THREE.Vector3(random()*100-50,random()*8,random()*120-60),radius:random()*3}));
  const grid=new StaticWorldColliderIndex(colliders),indices=grid.indices;
  for(let sample=0;sample<150;sample++){
    const center=new THREE.Vector3(random()*100-50,random()*8,random()*120-60),radius=5.24;
    const result=grid.query(center,radius);expect(result.indices).toBe(indices);
    const candidates=Array.from(result.indices.subarray(0,result.count));
    expect(candidates).toEqual([...candidates].sort((a,b)=>a-b));
    colliders.forEach((collider,index)=>{if(collider.center.distanceToSquared(center)<=(radius+collider.radius)**2)expect(candidates).toContain(index);});
  }
});

test('body counts retain particle weighting and are not rescaled with phase time', () => {
  const telemetry = new WorkerTelemetry(); telemetry.reset(0, 0);
  const phases = { constraints: 1, body: 4, selfFold: 2, worldCave: 2, other: 1 };
  for (let index = 0; index < 8; index++) telemetry.record({ time: index * 40, compute: 10, latency: 40, simulatedStep: 33, capes: 5,
    stepPhases: { computeMilliseconds: 10, phases, bodyTests: { particles: 1170, vertexTests: 11700, vertexCorrections: 117,
      triangleTests: 3900, triangleCorrections: 39 } } });
  for (let index = 8; index < 16; index++) telemetry.record({ time: index * 40, compute: 30, latency: 40, simulatedStep: 33, capes: 5 });
  const split = telemetry.getSnapshot(600).stepPhases!;
  expect(split.phases.body).toBe(8);
  expect(split.bodyTests!.vertexTests).toBe(11700);
  expect(formatBodyCandidates(split)).toContain('20.00 tests/particle/step');
  expect(formatBodyCandidates(split)).toContain('vertex 10.00 (1.000% correcting)');
  expect(formatBodyCandidates(split)).toContain('triangle incidence 10.00 (1.000% correcting');
  expect(formatBodyCandidates({ ...split, bodyTests: undefined })).toBe('insufficient samples');
  telemetry.reset(700, 0);
  expect(telemetry.getSnapshot(700).stepPhases).toBeNull();
});
