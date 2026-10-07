import { measureWorkerProfileOverhead } from './profile-overhead-fixture';
self.onmessage = () => { try { self.postMessage({result: measureWorkerProfileOverhead(message => self.postMessage({progress:message}))}); } catch(error) { self.postMessage({error:String(error)}); } };
