// Behaviorally adapted from the official Three.js r185 WebGPU compute-cloth example:
// https://github.com/mrdoob/three.js/blob/r185/examples/webgpu_compute_cloth.html

export interface ThreeComputeClothProbe {
  readonly scene: import('three/webgpu').Scene;
  readonly camera: import('three/webgpu').PerspectiveCamera;
  readonly computeNodes: readonly import('three/webgpu').ComputeNode[];
  dispose(): void;
}

interface VerletVertex {
  readonly id: number;
  readonly position: import('three/webgpu').Vector3;
  readonly isFixed: boolean;
  readonly springIds: number[];
}

interface VerletSpring {
  readonly id: number;
  readonly vertex0: VerletVertex;
  readonly vertex1: VerletVertex;
}

export function createThreeComputeClothProbe(
  THREE: typeof import('three/webgpu'),
  TSL: typeof import('three/tsl'),
): ThreeComputeClothProbe {
  const clothWidth = 1;
  const clothHeight = 1;
  const segmentColumns = 30;
  const segmentRows = 30;
  const sphereRadius = 0.15;
  const vertices: VerletVertex[] = [];
  const springs: VerletSpring[] = [];
  const columns: VerletVertex[][] = [];

  const addVertex = (x: number, y: number, z: number, isFixed: boolean): VerletVertex => {
    const vertex: VerletVertex = {
      id: vertices.length,
      position: new THREE.Vector3(x, y, z),
      isFixed,
      springIds: [],
    };
    vertices.push(vertex);
    return vertex;
  };
  const addSpring = (vertex0: VerletVertex, vertex1: VerletVertex): void => {
    const spring: VerletSpring = {
      id: springs.length,
      vertex0,
      vertex1,
    };
    vertex0.springIds.push(spring.id);
    vertex1.springIds.push(spring.id);
    springs.push(spring);
  };

  for (let columnIndex = 0; columnIndex <= segmentColumns; columnIndex += 1) {
    const column: VerletVertex[] = [];
    for (let rowIndex = 0; rowIndex <= segmentRows; rowIndex += 1) {
      column.push(addVertex(
        columnIndex * (clothWidth / segmentColumns) - clothWidth * 0.5,
        clothHeight * 0.5,
        rowIndex * (clothHeight / segmentRows),
        rowIndex === 0 && columnIndex % 5 === 0,
      ));
    }
    columns.push(column);
  }

  for (let columnIndex = 0; columnIndex <= segmentColumns; columnIndex += 1) {
    for (let rowIndex = 0; rowIndex <= segmentRows; rowIndex += 1) {
      const vertex = columns[columnIndex]![rowIndex]!;
      if (columnIndex > 0) addSpring(vertex, columns[columnIndex - 1]![rowIndex]!);
      if (rowIndex > 0) addSpring(vertex, columns[columnIndex]![rowIndex - 1]!);
      if (columnIndex > 0 && rowIndex > 0) {
        addSpring(vertex, columns[columnIndex - 1]![rowIndex - 1]!);
      }
      if (columnIndex > 0 && rowIndex < segmentRows) {
        addSpring(vertex, columns[columnIndex - 1]![rowIndex + 1]!);
      }
    }
  }

  const springList: number[] = [];
  const vertexPositions = new Float32Array(vertices.length * 3);
  const vertexParameters = new Uint32Array(vertices.length * 3);
  vertices.forEach((vertex, index) => {
    vertexPositions.set(vertex.position.toArray(), index * 3);
    vertexParameters[index * 3] = vertex.isFixed ? 1 : 0;
    if (!vertex.isFixed) {
      vertexParameters[index * 3 + 1] = vertex.springIds.length;
      vertexParameters[index * 3 + 2] = springList.length;
      springList.push(...vertex.springIds);
    }
  });

  const springVertexIds = new Uint32Array(springs.length * 2);
  const springRestLengths = new Float32Array(springs.length);
  springs.forEach((spring, index) => {
    springVertexIds[index * 2] = spring.vertex0.id;
    springVertexIds[index * 2 + 1] = spring.vertex1.id;
    springRestLengths[index] = spring.vertex0.position.distanceTo(spring.vertex1.position);
  });

  const vertexPositionBuffer = TSL.instancedArray(vertexPositions, 'vec3').setPBO(true);
  const vertexForceBuffer = TSL.instancedArray(vertices.length, 'vec3');
  const vertexParamsBuffer = TSL.instancedArray(vertexParameters, 'uvec3');
  const springListBuffer = TSL.instancedArray(new Uint32Array(springList), 'uint').setPBO(true);
  const springVertexIdBuffer = TSL.instancedArray(springVertexIds, 'uvec2').setPBO(true);
  const springRestLengthBuffer = TSL.instancedArray(springRestLengths, 'float');
  const springForceBuffer = TSL.instancedArray(springs.length * 3, 'vec3').setPBO(true);
  const dampeningUniform = TSL.uniform(0.99);
  const spherePositionUniform = TSL.uniform(new THREE.Vector3(0, 0, 0));
  const sphereUniform = TSL.uniform(1);
  const windUniform = TSL.uniform(1);
  const stiffnessUniform = TSL.uniform(0.2);

  const computeSpringForces = TSL.Fn(() => {
    const vertexIds = springVertexIdBuffer.element(TSL.instanceIndex);
    const restLength = springRestLengthBuffer.element(TSL.instanceIndex);
    const vertex0Position = vertexPositionBuffer.element(vertexIds.x);
    const vertex1Position = vertexPositionBuffer.element(vertexIds.y);
    const delta = vertex1Position.sub(vertex0Position).toVar();
    const distance = delta.length().max(0.000_001).toVar();
    const force = distance.sub(restLength).mul(stiffnessUniform).mul(delta).mul(0.5).div(distance);
    springForceBuffer.element(TSL.instanceIndex).assign(force);
  })().compute(springs.length).setName('Three reference spring forces');

  const computeVertexForces = TSL.Fn(() => {
    const parameters = vertexParamsBuffer.element(TSL.instanceIndex).toVar();
    const isFixed = parameters.x;
    const springCount = parameters.y;
    const springPointer = parameters.z;
    TSL.If(isFixed, () => {
      TSL.Return();
    });

    const position = vertexPositionBuffer.element(TSL.instanceIndex).toVar('vertexPosition');
    const force = vertexForceBuffer.element(TSL.instanceIndex).toVar('vertexForce');
    force.mulAssign(dampeningUniform);
    const pointerStart = springPointer.toVar('pointerStart');
    const pointerEnd = pointerStart.add(springCount).toVar('pointerEnd');
    TSL.Loop(
      { start: pointerStart, end: pointerEnd, type: 'uint', condition: '<' },
      ({ i }) => {
        const springId = springListBuffer.element(i).toVar('springId');
        const springForce = springForceBuffer.element(springId);
        const ids = springVertexIdBuffer.element(springId);
        const factor = TSL.select(ids.x.equal(TSL.instanceIndex), 1, -1);
        force.addAssign(springForce.mul(factor));
      },
    );
    force.y.subAssign(0.000_05);
    const noise = TSL.triNoise3D(position, 1, TSL.time).sub(0.2).mul(0.000_1);
    force.z.subAssign(noise.mul(windUniform));
    const sphereDelta = position.add(force).sub(spherePositionUniform);
    const sphereDistance = sphereDelta.length();
    const sphereForce = TSL.float(sphereRadius)
      .sub(sphereDistance)
      .max(0)
      .mul(sphereDelta)
      .div(sphereDistance)
      .mul(sphereUniform);
    force.addAssign(sphereForce);
    vertexForceBuffer.element(TSL.instanceIndex).assign(force);
    vertexPositionBuffer.element(TSL.instanceIndex).addAssign(force);
  })().compute(vertices.length).setName('Three reference vertex forces');

  const surfaceVertexIds = new Uint32Array(segmentColumns * segmentRows * 4);
  const indices: number[] = [];
  const surfaceIndex = (column: number, row: number): number => row * segmentColumns + column;
  for (let columnIndex = 0; columnIndex < segmentColumns; columnIndex += 1) {
    for (let rowIndex = 0; rowIndex < segmentRows; rowIndex += 1) {
      const index = surfaceIndex(columnIndex, rowIndex);
      surfaceVertexIds.set([
        columns[columnIndex]![rowIndex]!.id,
        columns[columnIndex + 1]![rowIndex]!.id,
        columns[columnIndex]![rowIndex + 1]!.id,
        columns[columnIndex + 1]![rowIndex + 1]!.id,
      ], index * 4);
      if (columnIndex > 0 && rowIndex > 0) {
        indices.push(
          surfaceIndex(columnIndex, rowIndex),
          surfaceIndex(columnIndex - 1, rowIndex),
          surfaceIndex(columnIndex - 1, rowIndex - 1),
          surfaceIndex(columnIndex, rowIndex),
          surfaceIndex(columnIndex - 1, rowIndex - 1),
          surfaceIndex(columnIndex, rowIndex - 1),
        );
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array(segmentColumns * segmentRows * 3),
    3,
  ));
  geometry.setAttribute('vertexIds', new THREE.BufferAttribute(surfaceVertexIds, 4));
  geometry.setIndex(indices);
  const material = new THREE.MeshPhysicalNodeMaterial({
    color: new THREE.Color(0x20_40_80),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(0xff_ff_ff),
  });
  material.positionNode = TSL.Fn(({ material: materialContext }) => {
    const ids = TSL.attribute<'uvec4'>('vertexIds', 'uvec4');
    const vertex0 = vertexPositionBuffer.element(ids.x).toVar();
    const vertex1 = vertexPositionBuffer.element(ids.y).toVar();
    const vertex2 = vertexPositionBuffer.element(ids.z).toVar();
    const vertex3 = vertexPositionBuffer.element(ids.w).toVar();
    const tangent = vertex1.add(vertex3).sub(vertex0.add(vertex2)).normalize();
    const bitangent = vertex2.add(vertex3).sub(vertex0.add(vertex1)).normalize();
    const normal = TSL.cross(tangent, bitangent);
    (materialContext as import('three/webgpu').MeshPhysicalNodeMaterial).normalNode = TSL
      .transformNormalToView(normal)
      .toVarying();
    return vertex0.add(vertex1).add(vertex2).add(vertex3).mul(0.25);
  })();

  const cloth = new THREE.Mesh(geometry, material);
  cloth.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07_10_12);
  scene.add(cloth);
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.01, 10);
  camera.position.set(-1.6, -0.1, -1.6);
  camera.lookAt(0, -0.1, 0);

  return {
    scene,
    camera,
    computeNodes: [computeSpringForces, computeVertexForces],
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
