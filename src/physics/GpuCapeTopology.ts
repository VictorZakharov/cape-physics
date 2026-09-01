import * as THREE from 'three';
import { CAPE } from '../config';
import { CAPE_DISTANCE_CONSTRAINTS } from './CapeConstraintTopology';

interface ConstraintDefinition {
  readonly first: number;
  readonly second: number;
  readonly restLength: number;
  readonly stiffness: number;
}

export const GPU_CAPE_TOPOLOGY_METADATA_STRIDE = 2;

export interface GpuCapeTopology {
  readonly packed: Float32Array;
  readonly normalNeighbors: Uint32Array;
  readonly orderedConstraints: Float32Array;
}

export function createGpuCapeTopology(initialState: Float32Array): GpuCapeTopology {
  const particleCount = CAPE.columns * CAPE.rows;
  const constraints: ConstraintDefinition[] = [];
  const readPosition = (index: number): THREE.Vector3 => new THREE.Vector3(
    initialState[index * 4] ?? 0,
    initialState[index * 4 + 1] ?? 0,
    initialState[index * 4 + 2] ?? 0,
  );
  const addConstraint = (
    firstColumn: number,
    firstRow: number,
    secondColumn: number,
    secondRow: number,
    stiffness: number,
  ): void => {
    const first = firstRow * CAPE.columns + firstColumn;
    const second = secondRow * CAPE.columns + secondColumn;
    constraints.push({
      first,
      second,
      restLength: readPosition(first).distanceTo(readPosition(second)),
      stiffness,
    });
  };
  for (const definition of CAPE_DISTANCE_CONSTRAINTS) {
    addConstraint(
      definition.firstColumn,
      definition.firstRow,
      definition.secondColumn,
      definition.secondRow,
      definition.stiffness,
    );
  }

  const normalNeighbors = new Uint32Array(particleCount * 4);
  for (let row = 0; row < CAPE.rows; row += 1) {
    for (let column = 0; column < CAPE.columns; column += 1) {
      const index = row * CAPE.columns + column;
      normalNeighbors[index * 4] = row * CAPE.columns + Math.max(0, column - 1);
      normalNeighbors[index * 4 + 1] = row * CAPE.columns
        + Math.min(CAPE.columns - 1, column + 1);
      normalNeighbors[index * 4 + 2] = Math.max(0, row - 1) * CAPE.columns + column;
      normalNeighbors[index * 4 + 3] = Math.min(CAPE.rows - 1, row + 1) * CAPE.columns + column;
    }
  }

  const packed = new Float32Array(
    particleCount * GPU_CAPE_TOPOLOGY_METADATA_STRIDE * 4,
  );
  for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
    const metadataOffset = particleIndex * GPU_CAPE_TOPOLOGY_METADATA_STRIDE * 4;
    const neighborOffset = particleIndex * 4;
    const row = Math.floor(particleIndex / CAPE.columns);
    const rowLeft = row * CAPE.columns;
    const rowRight = rowLeft + CAPE.columns - 1;
    packed[metadataOffset] = readPosition(rowLeft).distanceTo(readPosition(rowRight));
    packed[metadataOffset + 1] = row + 1 < CAPE.rows
      ? readPosition(particleIndex).distanceTo(readPosition(particleIndex + CAPE.columns))
      : 0;
    packed[metadataOffset + 2] = normalNeighbors[neighborOffset] ?? particleIndex;
    packed[metadataOffset + 3] = normalNeighbors[neighborOffset + 1] ?? particleIndex;
    packed[metadataOffset + 4] = normalNeighbors[neighborOffset + 2] ?? particleIndex;
    packed[metadataOffset + 5] = normalNeighbors[neighborOffset + 3] ?? particleIndex;
    packed[metadataOffset + 6] = row + 2 < CAPE.rows
      ? readPosition(particleIndex).distanceTo(readPosition(particleIndex + CAPE.columns * 2))
      : 0;
    packed[metadataOffset + 7] = row + 3 < CAPE.rows
      ? readPosition(particleIndex).distanceTo(readPosition(particleIndex + CAPE.columns * 3))
      : 0;
  }

  const orderedConstraints = new Float32Array(constraints.length * 4);
  for (let index = 0; index < constraints.length; index += 1) {
    const constraint = constraints[index]!;
    const offset = index * 4;
    orderedConstraints[offset] = constraint.first;
    orderedConstraints[offset + 1] = constraint.second;
    orderedConstraints[offset + 2] = constraint.restLength;
    orderedConstraints[offset + 3] = constraint.stiffness;
  }
  return {
    packed,
    normalNeighbors,
    orderedConstraints,
  };
}
