import { describe, expect, test } from 'bun:test';
import {
  BODY_CONTACT_RECONCILIATION_FULL,
  BODY_CONTACT_RECONCILIATION_START,
  IDLE_DRAPE_RECOVERY_DELAY_SECONDS,
  IDLE_DRAPE_RECOVERY_HEM_DROP,
  IDLE_DRAPE_RECOVERY_PER_STEP,
  IDLE_DRAPE_RECOVERY_RAMP_SECONDS,
  IDLE_DRAPE_RECOVERY_TARGET,
  MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED,
  MAXIMUM_SETTLED_HORIZONTAL_OFFSET,
  MAXIMUM_SLEEP_BODY_PENETRATION,
  MAXIMUM_VERTICAL_CAPE_PARTICLE_SPEED,
  MINIMUM_SETTLED_LOWER_CAPE_DROP,
  SETTLED_MOTION_THRESHOLD,
  SLEEP_AFTER_SETTLED_SECONDS,
  WAKE_SPEED,
} from '../src/physics/CapeSolverConstants';

describe('shared cape solver policy', () => {
  test('retains the established CPU and WebGPU thresholds exactly', () => {
    expect({
      maximumPlanarSpeed: MAXIMUM_PLANAR_CAPE_PARTICLE_SPEED,
      maximumVerticalSpeed: MAXIMUM_VERTICAL_CAPE_PARTICLE_SPEED,
      bodyReconciliationStart: BODY_CONTACT_RECONCILIATION_START,
      bodyReconciliationFull: BODY_CONTACT_RECONCILIATION_FULL,
      idleRecoveryPerStep: IDLE_DRAPE_RECOVERY_PER_STEP,
      idleRecoveryTarget: IDLE_DRAPE_RECOVERY_TARGET,
      idleRecoveryDelay: IDLE_DRAPE_RECOVERY_DELAY_SECONDS,
      idleRecoveryRamp: IDLE_DRAPE_RECOVERY_RAMP_SECONDS,
      wakeSpeed: WAKE_SPEED,
      sleepAfterSettled: SLEEP_AFTER_SETTLED_SECONDS,
      settledMotionThreshold: SETTLED_MOTION_THRESHOLD,
      minimumSettledLowerDrop: MINIMUM_SETTLED_LOWER_CAPE_DROP,
      maximumSettledHorizontalOffset: MAXIMUM_SETTLED_HORIZONTAL_OFFSET,
      idleRecoveryHemDrop: IDLE_DRAPE_RECOVERY_HEM_DROP,
      maximumSleepBodyPenetration: MAXIMUM_SLEEP_BODY_PENETRATION,
    }).toEqual({
      maximumPlanarSpeed: 9.6,
      maximumVerticalSpeed: 12,
      bodyReconciliationStart: 0.000_5,
      bodyReconciliationFull: 0.025,
      idleRecoveryPerStep: 0.016,
      idleRecoveryTarget: 0.12,
      idleRecoveryDelay: 0.12,
      idleRecoveryRamp: 0.35,
      wakeSpeed: 0.08,
      sleepAfterSettled: 0.55,
      settledMotionThreshold: 0.0025,
      minimumSettledLowerDrop: 0.48,
      maximumSettledHorizontalOffset: 0.18,
      idleRecoveryHemDrop: 1.2,
      maximumSleepBodyPenetration: 0.001,
    });
  });
});
