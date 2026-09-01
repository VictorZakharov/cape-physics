import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE, PHYSICS_STEP } from '../src/config';
import { CapeSimulation } from '../src/physics/CapeSimulation';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('CPU cape step characterization', () => {
  test('retains selected particle positions and Verlet history after one step', () => {
    const cape = new CapeSimulation(anchors, {}, undefined, { renderResources: false });
    try {
      cape.step(
        PHYSICS_STEP,
        anchors,
        [],
        [],
        new THREE.Vector3(0.75, 0.1, -1.3),
        0.37,
      );
      const state = cape.copyPackedState();
      const samples = [
        CAPE.columns,
        5 * CAPE.columns + 6,
        (CAPE.rows - 1) * CAPE.columns,
        CAPE.rows * CAPE.columns - 1,
      ].map((index) => ({
        index,
        position: [...state.positions.slice(index * 4, index * 4 + 4)],
        previous: [...state.previous.slice(index * 4, index * 4 + 4)],
      }));

      expect(samples).toEqual([
        {
          index: 13,
          position: [-0.28297922015190125, 1.7252739667892456, 0.11147803068161011, 1],
          previous: [-0.2828763723373413, 1.7253764867782593, 0.11164706200361252, 1],
        },
        {
          index: 71,
          position: [-0.000006048890554666286, 1.3255929946899414, 0.1577179878950119, 1],
          previous: [0, 1.3258823156356812, 0.15763062238693237, 1],
        },
        {
          index: 221,
          position: [-0.5683730840682983, 0.21096935868263245, 0.20798687636852264, 1],
          previous: [-0.5684000253677368, 0.21140000224113464, 0.20800000429153442, 1],
        },
        {
          index: 233,
          position: [0.568392813205719, 0.21093976497650146, 0.2079887092113495, 1],
          previous: [0.5684000253677368, 0.21140000224113464, 0.20800000429153442, 1],
        },
      ]);
    } finally {
      cape.dispose();
    }
  });
});
