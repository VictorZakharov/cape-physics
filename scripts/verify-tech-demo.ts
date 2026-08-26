import { runTechDemoHarness } from '../src/testing/TechDemoHarness';

const MAXIMUM_PHYSICS_STEP_MILLISECONDS = 3;

function shouldEnforcePerformanceBudget(): boolean {
  const setting = process.env.CAPE_ENFORCE_PERFORMANCE_BUDGET?.trim().toLowerCase();
  return setting !== 'false' && setting !== '0' && setting !== 'off';
}

try {
  const report = runTechDemoHarness();
  const enforcePerformanceBudget = shouldEnforcePerformanceBudget();
  if (
    enforcePerformanceBudget
    && report.millisecondsPerPhysicsStep >= MAXIMUM_PHYSICS_STEP_MILLISECONDS
  ) {
    throw new Error(
      `Simulation cost ${report.millisecondsPerPhysicsStep.toFixed(3)} ms exceeded `
        + `${MAXIMUM_PHYSICS_STEP_MILLISECONDS} ms local budget`,
    );
  }
  console.log('Cape Physics deterministic harness: PASS');
  console.log(
    `Physics timing: ${report.millisecondsPerPhysicsStep.toFixed(3)} ms/step `
      + `(${enforcePerformanceBudget ? 'local budget enforced' : 'telemetry only'})`,
  );
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error('Cape Physics deterministic harness: FAIL');
  console.error(error);
  process.exitCode = 1;
}
