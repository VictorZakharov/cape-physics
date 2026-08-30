import { describe, expect, test } from 'bun:test';
import * as THREE from 'three/webgpu';
import { CAPE } from '../src/config';
import { CapeContactSolver } from '../src/physics/CapeContactSolver';
import type { CapsuleCollider } from '../src/physics/colliders';
import { CapsuleColliderHistory } from '../src/physics/MovingCapsuleColliders';

function createPointContactFixture() {
  const positions = Array.from(
    { length: CAPE.columns + 1 },
    () => new THREE.Vector3(10, 10, 10),
  );
  positions[CAPE.columns]!.set(0, 0, 0.1);
  const previous = positions.map((position) => position.clone());
  const inverseMass = new Float32Array(positions.length).fill(1);
  const solver = new CapeContactSolver(positions, previous, inverseMass);
  const collider: CapsuleCollider = {
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    radius: 0.3,
    name: 'moving test body',
  };
  const back = new THREE.Vector3(0, 0, 1);
  const anchorCenter = new THREE.Vector3();
  return { positions, previous, solver, collider, back, anchorCenter };
}

describe('CapeContactSolver moving body response', () => {
  test('keeps static depenetration out of Verlet velocity', () => {
    const fixture = createPointContactFixture();
    fixture.solver.beginStep(
      fixture.anchorCenter,
      [],
      [fixture.collider],
      fixture.back,
    );
    fixture.solver.solveBody(fixture.back);
    fixture.solver.reconcileBodyContactVelocity();

    const position = fixture.positions[CAPE.columns]!;
    const previous = fixture.previous[CAPE.columns]!;
    expect(position.z).toBeGreaterThan(0.32);
    expect(position.distanceTo(previous)).toBeLessThan(0.000_001);
  });

  test('transfers only inward normal motion from an animated capsule', () => {
    const fixture = createPointContactFixture();
    fixture.solver.beginStep(
      fixture.anchorCenter,
      [],
      [fixture.collider],
      fixture.back,
    );
    fixture.solver.solveBody(fixture.back);
    fixture.solver.reconcileBodyContactVelocity();

    fixture.collider.start.set(0.04, 0, 0.02);
    fixture.collider.end.copy(fixture.collider.start);
    fixture.solver.beginStep(
      fixture.anchorCenter,
      [],
      [fixture.collider],
      fixture.back,
    );
    fixture.solver.solveBody(fixture.back);
    fixture.solver.reconcileBodyContactVelocity();

    const position = fixture.positions[CAPE.columns]!;
    const previous = fixture.previous[CAPE.columns]!;
    const velocity = position.clone().sub(previous);
    expect(velocity.z).toBeCloseTo(0.02, 5);
    expect(Math.abs(velocity.x)).toBeLessThan(0.000_001);
    expect(Math.abs(velocity.y)).toBeLessThan(0.000_001);
  });
});

describe('CapsuleColliderHistory', () => {
  test('advances mutable character capsules once per simulation capture', () => {
    const history = new CapsuleColliderHistory();
    const collider: CapsuleCollider = {
      start: new THREE.Vector3(1, 2, 3),
      end: new THREE.Vector3(4, 5, 6),
      radius: 0.2,
      name: 'history test',
    };
    const first = history.capture([collider])[0]!;
    expect(first.previousStart.equals(first.start)).toBe(true);
    collider.start.add(new THREE.Vector3(0.1, 0.2, 0.3));
    collider.end.add(new THREE.Vector3(0.4, 0.5, 0.6));
    const second = history.capture([collider])[0]!;
    expect(second.previousStart.toArray()).toEqual([1, 2, 3]);
    expect(second.previousEnd.toArray()).toEqual([4, 5, 6]);
  });
});
