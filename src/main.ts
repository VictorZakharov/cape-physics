import './styles/base.css';
import './styles/hud.css';
import './styles/mobile-controls.css';
import './styles/loading.css';
import { shouldRunWebGpuIsolationProbe } from './testing/WebGpuIsolationProbeQuery';
import { appendStartupScreenLog } from './core/StartupScreenLog';

appendStartupScreenLog('Application module entry');

async function main(): Promise<void> {
  if (shouldRunWebGpuIsolationProbe(window.location.search)) {
    appendStartupScreenLog('Loading isolated WebGPU probe');
    const { runWebGpuIsolationProbe } = await import('./testing/WebGpuIsolationProbe');
    appendStartupScreenLog('Starting isolated WebGPU probe');
    runWebGpuIsolationProbe();
    return;
  }
  try {
    appendStartupScreenLog('Loading the cape demo module');
    const { CapeDemo } = await import('./CapeDemo');
    appendStartupScreenLog('Constructing the cape demo');
    const demo = new CapeDemo();
    appendStartupScreenLog('Starting renderer initialization');
    await demo.start();
  } catch (error) {
    appendStartupScreenLog(`Startup exception: ${error instanceof Error ? error.message : String(error)}`);
    const [
      { readBrowserRendererStartupDiagnostics },
      { LoadingScreen },
    ] = await Promise.all([
      import('./core/RendererStartupRecovery'),
      import('./ui/LoadingScreen'),
    ]);
    const diagnostics = readBrowserRendererStartupDiagnostics();
    console.error('Unable to start the cape physics demo.', error, diagnostics);
    new LoadingScreen().fail(error, diagnostics);
  }
}

void main();
