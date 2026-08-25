import './styles/base.css';
import './styles/hud.css';
import './styles/loading.css';
import { CapeDemo } from './CapeDemo';
import { LoadingScreen } from './ui/LoadingScreen';

const demo = new CapeDemo();

demo.start().catch((error: unknown) => {
  console.error('Unable to start the cape physics demo.', error);
  new LoadingScreen().fail();
});
