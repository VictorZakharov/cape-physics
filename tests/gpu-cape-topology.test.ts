import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { CAPE } from '../src/config';
import { CAPE_DISTANCE_CONSTRAINTS } from '../src/physics/CapeConstraintTopology';
import { createPackedCapeInitialState } from '../src/physics/CapeInitialState';
import { DEFAULT_CAPE_PHYSICS_SETTINGS } from '../src/physics/CapeSettings';
import {
  GPU_CAPE_COLORED_CONSTRAINT_INDICES,
  GPU_CAPE_CONSTRAINT_COLOR_BATCHES,
  createGpuCapeTopology,
  GPU_CAPE_TOPOLOGY_METADATA_STRIDE,
} from '../src/physics/GpuCapeTopology';

const anchors = {
  left: new THREE.Vector3(-0.28, 1.82, 0.1),
  right: new THREE.Vector3(0.28, 1.82, 0.1),
  back: new THREE.Vector3(0, 0, 1),
};

describe('WebGPU cape topology packing', () => {
  const initialState = createPackedCapeInitialState(
    anchors,
    DEFAULT_CAPE_PHYSICS_SETTINGS,
  );
  const topology = createGpuCapeTopology(initialState);
  const particleCount = CAPE.columns * CAPE.rows;
  const readPosition = (index: number): THREE.Vector3 => new THREE.Vector3(
    initialState[index * 4]!,
    initialState[index * 4 + 1]!,
    initialState[index * 4 + 2]!,
  );

  test('packs every shared constraint into race-free color batches', () => {
    expect(topology.orderedConstraints).toHaveLength(CAPE_DISTANCE_CONSTRAINTS.length * 4);
    expect(GPU_CAPE_CONSTRAINT_COLOR_BATCHES).toHaveLength(17);
    expect([...GPU_CAPE_COLORED_CONSTRAINT_INDICES].sort((a, b) => a - b)).toEqual(
      CAPE_DISTANCE_CONSTRAINTS.map((_, index) => index),
    );
    GPU_CAPE_COLORED_CONSTRAINT_INDICES.forEach((definitionIndex, index) => {
      const definition = CAPE_DISTANCE_CONSTRAINTS[definitionIndex]!;
      const first = definition.firstRow * CAPE.columns + definition.firstColumn;
      const second = definition.secondRow * CAPE.columns + definition.secondColumn;
      const offset = index * 4;
      expect(topology.orderedConstraints[offset]).toBe(first);
      expect(topology.orderedConstraints[offset + 1]).toBe(second);
      expect(topology.orderedConstraints[offset + 2]).toBeCloseTo(
        readPosition(first).distanceTo(readPosition(second)),
        6,
      );
      expect(topology.orderedConstraints[offset + 3]).toBeCloseTo(
        definition.stiffness,
        6,
      );
    });
    for (const batch of GPU_CAPE_CONSTRAINT_COLOR_BATCHES) {
      const particles = new Set<number>();
      for (let index = batch.offset; index < batch.offset + batch.count; index += 1) {
        const definition = CAPE_DISTANCE_CONSTRAINTS[
          GPU_CAPE_COLORED_CONSTRAINT_INDICES[index]!
        ]!;
        const first = definition.firstRow * CAPE.columns + definition.firstColumn;
        const second = definition.secondRow * CAPE.columns + definition.secondColumn;
        expect(particles.has(first)).toBe(false);
        expect(particles.has(second)).toBe(false);
        particles.add(first);
        particles.add(second);
      }
    }
  });

  test('clamps normal neighbors to the particle grid edges', () => {
    expect(topology.normalNeighbors).toHaveLength(particleCount * 4);
    expect([...topology.normalNeighbors.slice(0, 4)]).toEqual([
      0,
      1,
      0,
      CAPE.columns,
    ]);
    const last = particleCount - 1;
    expect([...topology.normalNeighbors.slice(last * 4, last * 4 + 4)]).toEqual([
      last - 1,
      last,
      last - CAPE.columns,
      last,
    ]);
  });

  test('packs two vec4 metadata records for every particle', () => {
    expect(GPU_CAPE_TOPOLOGY_METADATA_STRIDE).toBe(2);
    expect(topology.packed).toHaveLength(
      particleCount * GPU_CAPE_TOPOLOGY_METADATA_STRIDE * 4,
    );
    expect(topology.packed[2]).toBe(0);
    expect(topology.packed[3]).toBe(1);
    expect(topology.packed[4]).toBe(0);
    expect(topology.packed[5]).toBe(CAPE.columns);
  });
});
