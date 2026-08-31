import './styles/base.css';
import './styles/hud.css';
import './styles/mobile-controls.css';
import './styles/loading.css';
import { shouldRunWebGpuIsolationProbe } from './testing/WebGpuIsolationProbeQuery';

async function main(): Promise<void> {
  if (shouldRunWebGpuIsolationProbe(window.location.search)) {
    const { runWebGpuIsolationProbe } = await import('./testing/WebGpuIsolationProbe');
    runWebGpuIsolationProbe();
    return;
  }
  try {
    const { CapeDemo } = await import('./CapeDemo');
    const demo = new CapeDemo();
    await demo.start();
  } catch (error) {
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
