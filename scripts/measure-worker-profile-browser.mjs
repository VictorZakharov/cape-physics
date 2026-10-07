import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { closeBrowserProcess, connectDebugger, evaluate, fetchJsonWithRetry, reservePort, runCleanupSteps, waitForExpression } from './audit/cdp-client.mjs';
import { close, createStaticServer, listen } from './audit/static-server.mjs';
const parent=resolve('artifacts/.tmp');mkdirSync(parent,{recursive:true});
const root=mkdtempSync(join(parent,'worker-profile-overhead-'));
let browser,connection,server;
try {
  execFileSync('bun',['build','scripts/audit/profile-overhead-worker.ts','--target=browser',`--outfile=${join(root,'worker.js')}`],{windowsHide:true,env:{...process.env,TEMP:root,TMP:root}});
  writeFileSync(join(root,'index.html'),`<!doctype html><title>Worker timing audit</title><script>const worker=new Worker('./worker.js');worker.onmessage=e=>{if(e.data.result)window.result=e.data.result;if(e.data.error)window.error=e.data.error;};worker.postMessage({});</script>`);
  server=createStaticServer(root);const port=await listen(server),debug=await reservePort();
  browser=spawn(process.env.CAPE_BROWSER_PATH??'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',[
    '--headless=new','--no-sandbox','--no-first-run','--disable-background-networking','--disable-component-update','--disable-breakpad','--disable-crash-reporter',
    '--disable-features=AutoDeElevate',`--user-data-dir=${join(root,'profile')}`,`--remote-debugging-port=${debug}`,`http://127.0.0.1:${port}/`,
  ],{windowsHide:true,stdio:'ignore',env:{...process.env,TEMP:root,TMP:root}});
  const targets=await fetchJsonWithRetry(`http://127.0.0.1:${debug}/json/list`,40000);
  connection=await connectDebugger(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
  await waitForExpression(connection.command,'window.result !== undefined || window.error !== undefined',600000);
  const error=await evaluate(connection.command,'window.error');if(error)throw Error(error);
  const result=await evaluate(connection.command,'({...window.result,runtime:navigator.userAgent})');
  mkdirSync('artifacts/worker-collision',{recursive:true});writeFileSync('artifacts/worker-collision/profile-overhead-browser.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
  if(!result.underTwoPercent)throw Error(`Browser-worker phase profiler overhead ${result.overheadPercent.toFixed(2)}% exceeds 2%`);
} finally {
  await runCleanupSteps([
    ['browser shutdown',()=>browser&&closeBrowserProcess(browser,connection)],
    ['server shutdown',()=>server&&close(server)],
    ['temporary fixture/profile',()=>{if(!root.startsWith(parent+sep))throw Error('Unexpected temporary path');rmSync(root,{recursive:true,force:true,maxRetries:8,retryDelay:250});}],
  ]);
}
