import { spawn, execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { closeBrowserProcess, connectDebugger, evaluate, fetchJsonWithRetry, reservePort, runCleanupSteps, waitForExpression } from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';

const parent=resolve('artifacts/.tmp');mkdirSync(parent,{recursive:true});
const root=mkdtempSync(join(parent,'startup-resize-'));
const output=resolve('artifacts/startup-resize');mkdirSync(output,{recursive:true});
const results=[];
try {
  const baseline=join(root,'baseline');mkdirSync(baseline);
  for(const name of ['src','index.html','public','package.json','vite.config.ts','tsconfig.json'])cpSync(name,join(baseline,name),{recursive:true});
  writeFileSync(join(baseline,'src/CapeDemo.ts'),execFileSync('git',['show','d7864fe:src/CapeDemo.ts']));
  execFileSync('bun',['run',resolve('node_modules/vite/bin/vite.js'),'build'],{cwd:baseline,windowsHide:true,env:{...process.env,TEMP:root,TMP:root},stdio:'pipe'});
  execFileSync('bun',['run','build'],{windowsHide:true,env:{...process.env,TEMP:root,TMP:root},stdio:'pipe'});
  for(const [stage,backend] of [['before','webgl'],['after','webgl'],['after','webgpu']]) {
    let browser,connection,server;
    try {
      const fixture=join(root,`${stage}-${backend}`);mkdirSync(fixture);
      cpSync(stage==='before'?join(baseline,'dist'):resolve('dist'),join(fixture,'dist'),{recursive:true});
      const assets=join(fixture,'dist/assets'),asset=readdirSync(assets).find(name=>/^CapeDemo-.*\.js$/.test(name));
      const file=join(assets,asset),source=readFileSync(file,'utf8'),hook='async initializeSelectedRenderer(){';
      if(!source.includes(hook))throw Error('Startup gate injection point missing');
      writeFileSync(file,source.replace(hook,hook+'window.__STARTUP_DEMO__=this;await new Promise(resolve=>window.__RESUME_STARTUP__=resolve);'));
      server=createStaticServer(join(fixture,'dist'));const port=await listen(server),debug=await reservePort();
      browser=spawn(process.env.CAPE_BROWSER_PATH??'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',[
        '--headless=new','--no-sandbox','--disable-gpu-sandbox','--no-first-run','--no-default-browser-check',
        '--disable-background-networking','--disable-component-update','--disable-breakpad','--disable-crash-reporter','--disable-gpu-shader-disk-cache',
        '--disable-skia-graphite','--disable-features=AutoDeElevate,CalculateNativeWinOcclusion,WebGPUBlobCache',
        '--enable-webgl','--enable-gpu','--ignore-gpu-blocklist','--use-angle=d3d11','--window-size=1600,850',
        `--user-data-dir=${join(fixture,'profile')}`,`--remote-debugging-port=${debug}`,`http://127.0.0.1:${port}/?harness=1&renderer=${backend}`,
      ],{windowsHide:true,stdio:'ignore',env:{...process.env,TEMP:root,TMP:root}});
      const targets=await fetchJsonWithRetry(`http://127.0.0.1:${debug}/json/list`,40000);
      connection=await connectDebugger(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
      await waitForExpression(connection.command,'typeof window.__RESUME_STARTUP__ === "function"');
      const initial=await evaluate(connection.command,'({width:innerWidth,height:innerHeight,aspect:window.__STARTUP_DEMO__.camera.aspect})');
      await connection.command('Emulation.setDeviceMetricsOverride',{width:1600,height:1000,deviceScaleFactor:1,mobile:false});
      await waitForExpression(connection.command,'innerWidth===1600 && innerHeight===1000');
      await evaluate(connection.command,'window.__RESUME_STARTUP__()');
      console.log(`${stage} ${backend}: viewport changed while startup was paused; waiting for ready`);
      await waitForExpression(connection.command,'window.__CAPE_DEMO__?.ready === true',120000);
      const actual=await evaluate(connection.command,'({backend:window.__STARTUP_DEMO__.pipeline.getActualBackend(),aspect:window.__STARTUP_DEMO__.camera.aspect,viewportAspect:innerWidth/innerHeight,canvasWidth:document.querySelector("canvas").width,canvasHeight:document.querySelector("canvas").height,cssWidth:innerWidth,cssHeight:innerHeight})');
      await evaluate(connection.command, 'new Promise(resolve => setTimeout(resolve, 1500))');
      const screenshot=await connection.command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
      writeFileSync(join(output,`${stage}-${backend}.png`),Buffer.from(screenshot.data,'base64'));
      const matches=Math.abs(actual.aspect-actual.viewportAspect)<1e-6;
      const sizingMatches=Math.abs(actual.canvasWidth/actual.canvasHeight-actual.viewportAspect)<0.003;
      const result={stage,requestedBackend:backend,initial,actual,matches,sizingMatches};results.push(result);console.log(JSON.stringify(result));
      if(actual.backend!==backend)throw Error('Unexpected renderer fallback');
      if(stage==='before'&&matches)throw Error('Baseline did not reproduce the missed startup resize');
      if(stage==='after'&&(!matches||!sizingMatches))throw Error('Startup projection or render sizing remains stale');
    } finally {
      await runCleanupSteps([['browser shutdown',()=>browser&&closeBrowserProcess(browser,connection)],['server shutdown',()=>server&&close(server)]]);
    }
  }
  writeFileSync(join(output,'results.json'),JSON.stringify(results,null,2));
} finally {
  if(!root.startsWith(parent+sep))throw Error('Unexpected temporary path');
  rmSync(root,{recursive:true,force:true,maxRetries:8,retryDelay:250});
}
