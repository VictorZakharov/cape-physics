import { runTechDemoHarness } from '../src/testing/TechDemoHarness';

try {
  const report = runTechDemoHarness();
  console.log('Cape Physics deterministic harness: PASS');
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error('Cape Physics deterministic harness: FAIL');
  console.error(error);
  process.exitCode = 1;
}
