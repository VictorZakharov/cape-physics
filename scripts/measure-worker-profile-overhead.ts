import { mkdirSync, writeFileSync } from 'node:fs';
import { measureWorkerProfileOverhead } from './audit/profile-overhead-fixture';
const result={runtime: `Bun ${Bun.version}; CPU fixture, not browser-runtime overhead proof`, ...measureWorkerProfileOverhead(console.log)};
mkdirSync('artifacts/worker-collision',{recursive:true});writeFileSync('artifacts/worker-collision/profile-overhead.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
if(!result.underTwoPercent)throw Error(`Measured phase profiler overhead ${result.overheadPercent.toFixed(2)}% is not under 2%`);
