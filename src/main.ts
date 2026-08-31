import './styles/base.css';
import './styles/hud.css';
import './styles/mobile-controls.css';
import './styles/loading.css';
import { CapeDemo } from './CapeDemo';
import { readBrowserRendererStartupDiagnostics } from './core/RendererStartupRecovery';
import { LoadingScreen } from './ui/LoadingScreen';

async function main(): Promise<void> {
  try {
    const demo = new CapeDemo();
    await demo.start();
  } catch (error) {
    const diagnostics = readBrowserRendererStartupDiagnostics();
    console.error('Unable to start the cape physics demo.', error, diagnostics);
    new LoadingScreen().fail(error, diagnostics);
  }
}

void main();
