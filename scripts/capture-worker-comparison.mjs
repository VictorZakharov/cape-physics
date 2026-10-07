import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { join, resolve, sep } from 'node:path';
const parent=resolve('artifacts/.tmp');mkdirSync(parent,{recursive:true});
const root=mkdtempSync(join(parent,'worker-baseline-'));
const failures=[];
async function run(command,args,cwd,env={}) {
  return await new Promise((resolveRun,reject)=>{
    const child=spawn(command,args,{cwd,windowsHide:true,env:{...process.env,TEMP:root,TMP:root,...env},stdio:['ignore','pipe','pipe']});
    let output='';child.stdout.on('data',chunk=>{output+=chunk;});child.stderr.on('data',chunk=>{output+=chunk;});
    child.on('error',reject);child.on('exit',code=>resolveRun({code,output}));
  });
}
try {
  cpSync('src',join(root,'src'),{recursive:true});
  for(const name of ['index.html','package.json','vite.config.ts','tsconfig.json','public'])if(existsSync(name))cpSync(name,join(root,name),{recursive:true});
  for(const name of ['ClothBodyCollision.ts','ClothSelfCollision.ts'])writeFileSync(join(root,'src/physics',name),execFileSync('git',['show',`e643183:src/physics/${name}`]));
  const worker=join(root,'src/physics/CapePhysicsWorker.ts');
  writeFileSync(worker,readFileSync(worker,'utf8').replace(/import.*registerStaticWorldColliderIndex.*\r?\n/,'').replace(/\s*registerStaticWorldColliderIndex\(worldColliders\);/,''));
  const built=await run('bun',['run',resolve('node_modules/vite/bin/vite.js'),'build'],root);
  if(built.code!==0)throw Error(built.output);
  console.log('Baseline fixture built; collision candidate search uses e643183 behavior.');
  for(const stage of ['worker-before','worker-after']) {
    if(stage==='worker-after') {
      const builtAfter=await run('bun',['run','build'],process.cwd());
      if(builtAfter.code!==0)throw Error(builtAfter.output);
    }
    const captures=process.env.CAPE_COMPARE_BACKEND==='webgpu' ? [['webgpu','']] : [['webgl',''],['webgl','3'],['webgpu','']];
    for(const [renderer,workers] of captures) {
      console.log(`Capture ${stage}: ${renderer}, workers=${workers||'automatic'}`);
      const result=await run('node',[resolve('scripts/capture-performance-evidence.mjs')],process.cwd(),{
        CAPE_PROFILE_DIST_ROOT:stage==='worker-before'?join(root,'dist'):resolve('dist'),
        CAPE_EVIDENCE_STAGE:process.env.CAPE_COMPARE_TAG ? stage.replace('worker-',process.env.CAPE_COMPARE_TAG+'-') : stage,CAPE_PROFILE_RENDERER:renderer,CAPE_PROFILE_WORKERS:workers,CAPE_PROFILE_LIVE_SECONDS:'16',
      });
      console.log(result.output.split('\n').filter(line=>/^(Rendered FPS:|Quality:|Cape worker execution:|Worker simulated timestep:|Worker phase mean:|Simulation delivery:|Error:)/.test(line)).join('\n'));
      if(result.code!==0){failures.push({stage,renderer,workers,output:result.output.slice(-4000)});console.error('Capture exited with an error; raw report may have been saved before cleanup failed.');}
    }
  }
  const errorFile=`artifacts/worker-collision/capture-errors${process.env.CAPE_COMPARE_TAG?'-'+process.env.CAPE_COMPARE_TAG:''}.json`;
  mkdirSync('artifacts/worker-collision',{recursive:true});writeFileSync(errorFile,JSON.stringify(failures,null,2));
  if(failures.length)throw Error(`${failures.length} capture/cleanup failures; see ${errorFile}`);
} finally {
  if(!root.startsWith(parent+sep))throw Error('Unexpected baseline path');
  rmSync(root,{recursive:true,force:true});
}
