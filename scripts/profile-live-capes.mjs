import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { closeBrowserProcess, connectDebugger, evaluate, fetchJsonWithRetry, reservePort, runCleanupSteps, waitForExpression } from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';

const parent = resolve('artifacts/.tmp');
mkdirSync(parent, { recursive: true });
const root = mkdtempSync(join(parent, 'live-cape-profile-'));
const renderer = process.env.CAPE_PROFILE_RENDERER ?? 'webgl';
const duration = Number(process.env.CAPE_PROFILE_LIVE_SECONDS ?? 8);
const warmup = Number(process.env.CAPE_PROFILE_LIVE_WARMUP_SECONDS ?? 1);
let browser, connection, server;
try {
  if (!['webgl', 'webgpu'].includes(renderer)) throw Error('CAPE_PROFILE_RENDERER must be webgl or webgpu.');
  if (!Number.isFinite(duration) || duration < 1 || duration > 30) throw Error('CAPE_PROFILE_LIVE_SECONDS must be between 1 and 30.');
  if (!Number.isFinite(warmup) || warmup < 0 || warmup > 60) throw Error('CAPE_PROFILE_LIVE_WARMUP_SECONDS must be between 0 and 60.');
  cpSync(resolve(process.env.CAPE_PROFILE_DIST_ROOT ?? 'dist'), join(root, 'dist'), { recursive: true });
  const assets = join(root, 'dist', 'assets');
  // The disposable fixture can serve either production or Pages output locally.
  for (const name of ['index.html', ...readdirSync(assets).filter((name) => name.endsWith('.js')).map((name) => join('assets', name))]) {
    const file = join(root, 'dist', name);
    writeFileSync(file, readFileSync(file, 'utf8').replaceAll('/cape-physics/', '/'));
  }
  const asset = readdirSync(assets).find((name) => /^CapeDemo-.*\.js$/.test(name));
  if (!asset) throw Error('Build the production bundle before profiling.');
  const path = join(assets, asset);
  const source = readFileSync(path, 'utf8');
  if (!source.includes('installHarness(){')) throw Error('Cannot expose the local profiling fixture.');
  writeFileSync(path, source.replace('installHarness(){', 'installHarness(){window.__CAPE_INTERNAL__=this;'));
  server = createStaticServer(join(root, 'dist'));
  const port = await listen(server), debug = await reservePort();
  browser = spawn(process.env.CAPE_BROWSER_PATH ?? 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-sandbox', '--disable-gpu-sandbox', '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-breakpad', '--disable-crash-reporter', '--disable-gpu-shader-disk-cache',
    '--disable-skia-graphite', '--disable-features=CalculateNativeWinOcclusion,AutofillAiServerModel,WebGPUBlobCache',
    '--enable-webgl', '--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--window-size=1600,900',
    `--user-data-dir=${join(root, 'profile')}`, `--remote-debugging-port=${debug}`,
    `http://127.0.0.1:${port}/?harness=1&renderer=${renderer}`,
  ], { windowsHide: true, stdio: 'ignore', env: { ...process.env, TEMP: root, TMP: root } });
  const targets = await fetchJsonWithRetry(`http://127.0.0.1:${debug}/json/list`, 40000);
  connection = await connectDebugger(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await waitForExpression(connection.command, 'window.__CAPE_DEMO__?.ready === true', 120000);
  await evaluate(connection.command, `(async()=>{
    const demo=window.__CAPE_INTERNAL__;
    await window.__CAPE_DEMO__.setBotCount(50);
    demo.clock.reset(performance.now());
    const until=performance.now()+${warmup * 1000};
    while(performance.now()<until) demo.frame(await new Promise(requestAnimationFrame));
  })()`);
  await connection.command('Profiler.enable');
  await connection.command('Profiler.start');
  const result = await evaluate(connection.command, `(async()=>{
    const demo=window.__CAPE_INTERNAL__,intervals=[],counts=new Map(),last=new Map();
    let phases={};const totals={};
    for(const [object,method,label] of [[demo,'simulateStep','simulation'],[demo.cape,'step','playerCape'],
      [demo.worldCollision,'resolvePlayer','characterCollision'],[demo,'applyWorkerCapeResults','workerResults'],
      [demo,'syncCapeGeometries','capeMeshes'],[demo,'updateScene','scene'],[demo.pipeline,'render','render'],[demo,'applyQuality','qualityResize']]){
      const original=object[method].bind(object);
      object[method]=(...args)=>{const start=performance.now();const result=original(...args);phases[label]=(phases[label]||0)+performance.now()-start;return result;};
    }
    for(const bot of demo.performanceBots){
      if(!bot.capePresentation)continue;
      const accept=bot.capePresentation.accept.bind(bot.capePresentation);
      bot.capePresentation.accept=state=>{
        const now=performance.now();if(last.has(bot.id))intervals.push(now-last.get(bot.id));
        last.set(bot.id,now);counts.set(bot.id,(counts.get(bot.id)||0)+1);accept(state);
      };
    }
    const start=performance.now(),simulationStart=demo.fixedTime,frames=[],cpu=[],stalls=[];
    let preceding=null;
    while(performance.now()-start<${duration * 1000}){
      const timestamp=await new Promise(requestAnimationFrame);
      if(preceding!==null)frames.push(timestamp-preceding);preceding=timestamp;
      phases={};const before=performance.now();demo.frame(timestamp);cpu.push(performance.now()-before);
      for(const [label,time] of Object.entries(phases))totals[label]=(totals[label]||0)+time;
      if(cpu.at(-1)>=30)stalls.push({interval:frames.at(-1),cpu:cpu.at(-1),time:demo.fixedTime,phases});
    }
    await demo.pipeline.synchronizeForLocalProfile();
    const elapsed=performance.now()-start,sorted=intervals.sort((a,b)=>a-b);
    const avg=values=>values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length);
    const sortedFrames=[...frames].sort((a,b)=>a-b);
    return {renderer:${JSON.stringify(renderer)},hardwareThreads:navigator.hardwareConcurrency,frames:cpu.length,fps:cpu.length*1000/elapsed,
      simulationRate:(demo.fixedTime-simulationStart)*1000/elapsed,p99FrameMs:sortedFrames[Math.floor(sortedFrames.length*.99)],worstFrameMs:Math.max(...frames),longFrames:frames.filter(value=>value>=50).length,stalls,
      phases:Object.fromEntries(Object.entries(totals).map(([key,value])=>[key,value/cpu.length])),
      meanCpuFrameMs:avg(cpu),meanWorkerIntervalMs:avg(intervals),p95WorkerIntervalMs:sorted[Math.floor(sorted.length*.95)]??null,
      minimumCapeResults:counts.size?Math.min(...counts.values()):null,
      meanCapeResultHz:counts.size?avg([...counts.values()])*1000/elapsed:null,
      performance:demo.performance.getSnapshot(),workers:demo.webGlCapeWorkers?.getDiagnostics()??null};
  })()`);
  const profile = (await connection.command('Profiler.stop')).profile;
  const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
  const times = new Map();
  profile.samples.forEach((id, index) => times.set(id, (times.get(id) ?? 0) + profile.timeDeltas[index]));
  result.cpuTop = [...times].sort((a,b)=>b[1]-a[1]).slice(0,15).map(([id,time])=>({
    function: nodes.get(id).callFrame.functionName, line: nodes.get(id).callFrame.lineNumber+1, ms: time/1000,
  }));
  console.log(JSON.stringify(result));
} catch (error) {
  console.error('Primary profiling error:', error);
  if(connection) try { console.error(await evaluate(connection.command, 'document.body.innerText.slice(-2000)')); } catch {}
  throw error;
} finally {
  await runCleanupSteps([
    ['browser shutdown', () => browser && closeBrowserProcess(browser, connection)],
    ['server shutdown', () => server && close(server)],
    ['temporary fixture and profile', () => rmSync(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 })],
  ]);
}
