import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  atomicOr,
  bool,
  cross,
  float,
  mix,
  select,
  uint,
  vec3,
  vec4,
} from 'three/tsl';
import { CAPE, CAVE } from '../config';
import {
  GPU_ROCK_BUFFER_STRIDE as ROCK_BUFFER_STRIDE,
  GPU_ROCK_FACES_PER_COLLIDER as ROCK_FACES_PER_COLLIDER,
  MAX_GPU_WORLD_ROCKS as MAX_WORLD_ROCKS,
  MAX_GPU_WORLD_SPHERES as MAX_WORLD_SPHERES,
} from './GpuCapeColliderPacking';
import { CLOTH_ROCK_CLEARANCE, CLOTH_WORLD_CLEARANCE } from './ClothWorldCollision';

const SWEPT_FACE_SAMPLE_COUNT = 4;

export interface GpuCapeRockFaceResources {
  readonly caveShellBuffer: THREE.StorageBufferNode<'vec2'>;
  readonly materialContactFlagBuffer: THREE.StorageBufferNode<'uint'>;
  readonly positionBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly rockBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly worldCountUniform: THREE.UniformArrayNode<'vec4'>;
  readonly worldSphereBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly particleCount: number;
}

/**
 * Complementary rock-edge/cloth-face contact. Vertex collision handles
 * ordinary contact; this applies bounded, velocity-neutral separation only
 * when a rock crosses the triangle interior while all vertices remain clear.
 */
export function createGpuCapeRockFaceColorFunction(
  resources: GpuCapeRockFaceResources,
  buffer: THREE.StorageBufferNode<'vec4'>,
  passName: string,
  allowSweptFaceRecovery = false,
  includeCaveFaceRecovery = false,
) {
  const intersectsSegmentTriangle = Fn<
    readonly [
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
    ],
    THREE.Node<'bool'>
  >(([start, end, first, second, third]) => {
    const intersects = bool(false).toVar('segmentTriangleIntersects');
    const direction = end.sub(start).toVar('segmentTriangleDirection');
    const firstEdge = second.sub(first).toVar('segmentTriangleFirstEdge');
    const secondEdge = third.sub(first).toVar('segmentTriangleSecondEdge');
    const determinantVector = cross(direction, secondEdge)
      .toVar('segmentTriangleDeterminantVector');
    const determinant = firstEdge.dot(determinantVector)
      .toVar('segmentTriangleDeterminant');
    If(determinant.abs().greaterThan(0.000_01), () => {
      const inverseDeterminant = determinant.reciprocal();
      const vertexOffset = start.sub(first).toVar('segmentTriangleVertexOffset');
      const firstWeight = vertexOffset.dot(determinantVector)
        .mul(inverseDeterminant)
        .toVar('segmentTriangleFirstWeight');
      const barycentricVector = cross(vertexOffset, firstEdge)
        .toVar('segmentTriangleBarycentricVector');
      const secondWeight = direction.dot(barycentricVector)
        .mul(inverseDeterminant)
        .toVar('segmentTriangleSecondWeight');
      const progress = secondEdge.dot(barycentricVector)
        .mul(inverseDeterminant)
        .toVar('segmentTriangleProgress');
      If(
        firstWeight.greaterThanEqual(-0.000_01)
          .and(firstWeight.lessThanEqual(1.000_01))
          .and(secondWeight.greaterThanEqual(-0.000_01))
          .and(firstWeight.add(secondWeight).lessThanEqual(1.000_01))
          .and(progress.greaterThanEqual(-0.000_01))
          .and(progress.lessThanEqual(1.000_01)),
        () => {
          intersects.assign(bool(true));
        },
      );
    });
    return intersects;
  }, 'bool').setLayout({
    name: `capeRockFaceSegmentTriangle${passName}`,
    type: 'bool',
    inputs: [
      { name: 'start', type: 'vec3' },
      { name: 'end', type: 'vec3' },
      { name: 'first', type: 'vec3' },
      { name: 'second', type: 'vec3' },
      { name: 'third', type: 'vec3' },
    ],
  });
  const trianglesIntersect = Fn<
    readonly [
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
    ],
    THREE.Node<'bool'>
  >(([
    clothFirst,
    clothSecond,
    clothThird,
    rockFirst,
    rockSecond,
    rockThird,
  ]) => intersectsSegmentTriangle(
    clothFirst,
    clothSecond,
    rockFirst,
    rockSecond,
    rockThird,
  ).or(intersectsSegmentTriangle(
    clothSecond,
    clothThird,
    rockFirst,
    rockSecond,
    rockThird,
  )).or(intersectsSegmentTriangle(
    clothThird,
    clothFirst,
    rockFirst,
    rockSecond,
    rockThird,
  )).or(intersectsSegmentTriangle(
    rockFirst,
    rockSecond,
    clothFirst,
    clothSecond,
    clothThird,
  )).or(intersectsSegmentTriangle(
    rockSecond,
    rockThird,
    clothFirst,
    clothSecond,
    clothThird,
  )).or(intersectsSegmentTriangle(
    rockThird,
    rockFirst,
    clothFirst,
    clothSecond,
    clothThird,
  )), 'bool').setLayout({
    name: `capeRockFaceTrianglesIntersect${passName}`,
    type: 'bool',
    inputs: [
      { name: 'clothFirst', type: 'vec3' },
      { name: 'clothSecond', type: 'vec3' },
      { name: 'clothThird', type: 'vec3' },
      { name: 'rockFirst', type: 'vec3' },
      { name: 'rockSecond', type: 'vec3' },
      { name: 'rockThird', type: 'vec3' },
    ],
  });
  const sphereIntersectsTriangle = Fn<
    readonly [
      THREE.Node<'vec4'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
      THREE.Node<'vec3'>,
    ],
    THREE.Node<'bool'>
  >(([sphere, first, second, third]) => {
    const center = sphere.xyz;
    const firstEdge = second.sub(first).toVar('sphereFaceFirstEdge');
    const secondEdge = third.sub(first).toVar('sphereFaceSecondEdge');
    const fromFirst = center.sub(first).toVar('sphereFaceFromFirst');
    const firstFirst = firstEdge.dot(fromFirst).toVar('sphereFaceFirstFirst');
    const firstSecond = secondEdge.dot(fromFirst).toVar('sphereFaceFirstSecond');
    const fromSecond = center.sub(second).toVar('sphereFaceFromSecond');
    const secondFirst = firstEdge.dot(fromSecond).toVar('sphereFaceSecondFirst');
    const secondSecond = secondEdge.dot(fromSecond).toVar('sphereFaceSecondSecond');
    const fromThird = center.sub(third).toVar('sphereFaceFromThird');
    const thirdFirst = firstEdge.dot(fromThird).toVar('sphereFaceThirdFirst');
    const thirdSecond = secondEdge.dot(fromThird).toVar('sphereFaceThirdSecond');
    const firstRegion = firstFirst.mul(secondSecond)
      .sub(secondFirst.mul(firstSecond))
      .toVar('sphereFaceFirstRegion');
    const secondRegion = thirdFirst.mul(firstSecond)
      .sub(firstFirst.mul(thirdSecond))
      .toVar('sphereFaceSecondRegion');
    const thirdRegion = secondFirst.mul(thirdSecond)
      .sub(thirdFirst.mul(secondSecond))
      .toVar('sphereFaceThirdRegion');
    const closest = first.toVar('sphereFaceClosest');
    If(firstFirst.lessThanEqual(0).and(firstSecond.lessThanEqual(0)), () => {
      closest.assign(first);
    }).ElseIf(secondFirst.greaterThanEqual(0).and(secondSecond.lessThanEqual(secondFirst)), () => {
      closest.assign(second);
    }).ElseIf(
      firstRegion.lessThanEqual(0)
        .and(firstFirst.greaterThanEqual(0))
        .and(secondFirst.lessThanEqual(0)),
      () => {
        const progress = firstFirst.div(firstFirst.sub(secondFirst).max(0.000_001));
        closest.assign(first.add(firstEdge.mul(progress)));
      },
    ).ElseIf(thirdSecond.greaterThanEqual(0).and(thirdFirst.lessThanEqual(thirdSecond)), () => {
      closest.assign(third);
    }).ElseIf(
      secondRegion.lessThanEqual(0)
        .and(firstSecond.greaterThanEqual(0))
        .and(thirdSecond.lessThanEqual(0)),
      () => {
        const progress = firstSecond.div(firstSecond.sub(thirdSecond).max(0.000_001));
        closest.assign(first.add(secondEdge.mul(progress)));
      },
    ).ElseIf(
      thirdRegion.lessThanEqual(0)
        .and(secondSecond.sub(secondFirst).greaterThanEqual(0))
        .and(thirdFirst.sub(thirdSecond).greaterThanEqual(0)),
      () => {
        const firstDistance = secondSecond.sub(secondFirst);
        const secondDistance = thirdFirst.sub(thirdSecond);
        const progress = firstDistance.div(firstDistance.add(secondDistance).max(0.000_001));
        closest.assign(second.add(third.sub(second).mul(progress)));
      },
    ).Else(() => {
      const denominator = thirdRegion.add(secondRegion).add(firstRegion)
        .max(0.000_001)
        .reciprocal();
      closest.assign(
        first
          .add(firstEdge.mul(secondRegion.mul(denominator)))
          .add(secondEdge.mul(firstRegion.mul(denominator))),
      );
    });
    return closest.sub(center).dot(closest.sub(center))
      .lessThan(sphere.w.mul(sphere.w));
  }, 'bool').setLayout({
    name: `capeSphereFaceTriangle${passName}`,
    type: 'bool',
    inputs: [
      { name: 'sphere', type: 'vec4' },
      { name: 'first', type: 'vec3' },
      { name: 'second', type: 'vec3' },
      { name: 'third', type: 'vec3' },
    ],
  });
  const getCaveWallCorrection = includeCaveFaceRecovery ? Fn<
    readonly [THREE.Node<'vec3'>],
    THREE.Node<'float'>
  >(([sample]) => {
    const segmentPosition = float(CAVE.startZ).sub(sample.z)
      .div(CAVE.startZ - CAVE.endZ)
      .clamp(0, 1)
      .mul(CAVE.segments)
      .toVar('caveFaceSegmentPosition');
    const firstSegment = uint(segmentPosition.floor()).toVar('caveFaceFirstSegment');
    const secondSegment = select(
      firstSegment.lessThan(uint(CAVE.segments)),
      firstSegment.add(1),
      firstSegment,
    ).toVar('caveFaceSecondSegment');
    const blend = segmentPosition.sub(float(firstSegment)).toVar('caveFaceBlend');
    const sectionSamples = uint(CAVE.radialSegments + 1);
    const center = sample.z.sub(10).mul(0.055).sin().mul(2.05)
      .add(sample.z.add(5).mul(0.137).sin().mul(0.38))
      .toVar('caveFaceCenter');
    const minimumIntersection = float(1_000_000).toVar('caveFaceMinimumIntersection');
    const maximumIntersection = float(-1_000_000).toVar('caveFaceMaximumIntersection');
    const nearestLeft = float(-1_000_000).toVar('caveFaceNearestLeft');
    const nearestRight = float(1_000_000).toVar('caveFaceNearestRight');
    Loop(
      { start: uint(0), end: uint(CAVE.radialSegments), type: 'uint', condition: '<' },
      ({ i }) => {
        const firstA = resources.caveShellBuffer.element(
          firstSegment.mul(sectionSamples).add(i),
        );
        const firstB = resources.caveShellBuffer.element(
          secondSegment.mul(sectionSamples).add(i),
        );
        const secondA = resources.caveShellBuffer.element(
          firstSegment.mul(sectionSamples).add(i).add(1),
        );
        const secondB = resources.caveShellBuffer.element(
          secondSegment.mul(sectionSamples).add(i).add(1),
        );
        const firstX = mix(firstA.x, firstB.x, blend).toVar('caveFaceFirstX');
        const firstY = mix(firstA.y, firstB.y, blend).toVar('caveFaceFirstY');
        const secondX = mix(secondA.x, secondB.x, blend).toVar('caveFaceSecondX');
        const secondY = mix(secondA.y, secondB.y, blend).toVar('caveFaceSecondY');
        If(firstX.lessThanEqual(center), () => {
          nearestLeft.assign(nearestLeft.max(firstX));
        });
        If(firstX.greaterThanEqual(center), () => {
          nearestRight.assign(nearestRight.min(firstX));
        });
        const edgeHeight = secondY.sub(firstY);
        If(
          sample.y.greaterThanEqual(firstY.min(secondY))
            .and(sample.y.lessThanEqual(firstY.max(secondY)))
            .and(edgeHeight.abs().greaterThan(0.000_001)),
          () => {
            const edgeBlend = sample.y.sub(firstY).div(edgeHeight);
            const intersection = mix(firstX, secondX, edgeBlend);
            minimumIntersection.assign(minimumIntersection.min(intersection));
            maximumIntersection.assign(maximumIntersection.max(intersection));
          },
        );
      },
    );
    const minimumX = select(
      minimumIntersection.lessThan(500_000),
      minimumIntersection,
      nearestLeft,
    ).add(CLOTH_WORLD_CLEARANCE).toVar('caveFaceMinimumX');
    const maximumX = select(
      maximumIntersection.greaterThan(-500_000),
      maximumIntersection,
      nearestRight,
    ).sub(CLOTH_WORLD_CLEARANCE).toVar('caveFaceMaximumX');
    If(minimumX.greaterThan(maximumX), () => {
      const midpoint = minimumX.add(maximumX).mul(0.5);
      minimumX.assign(midpoint.sub(0.08));
      maximumX.assign(midpoint.add(0.08));
    });
    const correction = float(0).toVar('caveFaceSampleCorrection');
    If(sample.x.lessThan(minimumX), () => {
      correction.assign(minimumX.sub(sample.x));
    }).ElseIf(sample.x.greaterThan(maximumX), () => {
      correction.assign(maximumX.sub(sample.x));
    });
    return correction;
  }, 'float').setLayout({
    name: `capeCaveFaceSample${passName}`,
    type: 'float',
    inputs: [{ name: 'sample', type: 'vec3' }],
  }) : null;

  return Fn<
    readonly [THREE.Node<'uint'>, THREE.Node<'uint'>, THREE.Node<'uint'>],
    THREE.Node<'float'>
  >(([color, triangleSlot, capeIndex]) => {
    const capeBase = capeIndex.mul(uint(resources.particleCount));
    const worldCounts = resources.worldCountUniform.element(capeIndex);
    const orientation = color.mod(uint(2));
    const columnParity = color.div(uint(2)).mod(uint(2));
    const rowParity = color.div(uint(4));
    const coloredColumns = uint(Math.ceil((CAPE.columns - 1) / 2));
    const coloredRows = select(
      rowParity.equal(uint(0)),
      uint(Math.ceil((CAPE.rows - 1) / 2)),
      uint(Math.floor((CAPE.rows - 1) / 2)),
    );
    If(triangleSlot.lessThan(coloredRows.mul(coloredColumns)), () => {
      const localRow = triangleSlot.div(coloredColumns);
      const localColumn = triangleSlot.mod(coloredColumns);
      const cellRow = rowParity.add(localRow.mul(2));
      const cellColumn = columnParity.add(localColumn.mul(2));
      const topLeft = cellRow.mul(uint(CAPE.columns)).add(cellColumn);
      const bottomLeft = topLeft.add(uint(CAPE.columns));
      const firstLocalIndex = select(orientation.equal(uint(0)), topLeft, bottomLeft);
      const secondLocalIndex = select(
        orientation.equal(uint(0)),
        bottomLeft,
        bottomLeft.add(1),
      );
      const thirdLocalIndex = topLeft.add(1);
      const firstIndex = capeBase.add(firstLocalIndex);
      const secondIndex = capeBase.add(secondLocalIndex);
      const thirdIndex = capeBase.add(thirdLocalIndex);
      const first = buffer.element(firstIndex).xyz;
      const second = buffer.element(secondIndex).xyz;
      const third = buffer.element(thirdIndex).xyz;
      const previousFirst = resources.previousBuffer.element(firstIndex).xyz;
      const previousSecond = resources.previousBuffer.element(secondIndex).xyz;
      const previousThird = resources.previousBuffer.element(thirdIndex).xyz;
      const triangleMinimum = first.min(second).min(third)
        .sub(CLOTH_ROCK_CLEARANCE);
      const triangleMaximum = first.max(second).max(third)
        .add(CLOTH_ROCK_CLEARANCE);
      const previousTriangleMinimum = previousFirst.min(previousSecond).min(previousThird);
      const previousTriangleMaximum = previousFirst.max(previousSecond).max(previousThird);
      const sweptTriangleMinimum = triangleMinimum.min(
        previousTriangleMinimum.sub(CLOTH_ROCK_CLEARANCE),
      );
      const sweptTriangleMaximum = triangleMaximum.max(
        previousTriangleMaximum.add(CLOTH_ROCK_CLEARANCE),
      );
      const faceTriangleMinimum = allowSweptFaceRecovery
        ? sweptTriangleMinimum
        : triangleMinimum;
      const faceTriangleMaximum = allowSweptFaceRecovery
        ? sweptTriangleMaximum
        : triangleMaximum;
      const faceCorrection = vec3(0).toVar('rockFaceCorrection');
      const hadFaceContact = bool(false).toVar('rockFaceHadContact');
      Loop(
        {
          start: uint(0),
          end: uint(worldCounts.x),
          type: 'uint',
          condition: '<',
        },
        ({ i: sphereIndex }) => {
          const sphere = resources.worldSphereBuffer.element(
            capeIndex.mul(uint(MAX_WORLD_SPHERES)).add(sphereIndex),
          );
          const sphereRadiusSquared = sphere.w.mul(sphere.w);
          const overlapsSphere = faceTriangleMaximum.x
            .greaterThanEqual(sphere.x.sub(sphere.w))
            .and(faceTriangleMinimum.x.lessThanEqual(sphere.x.add(sphere.w)))
            .and(faceTriangleMaximum.y.greaterThanEqual(sphere.y.sub(sphere.w)))
            .and(faceTriangleMinimum.y.lessThanEqual(sphere.y.add(sphere.w)))
            .and(faceTriangleMaximum.z.greaterThanEqual(sphere.z.sub(sphere.w)))
            .and(faceTriangleMinimum.z.lessThanEqual(sphere.z.add(sphere.w)));
          If(overlapsSphere, () => {
            const intersects = bool(false).toVar('sphereFaceIntersects');
            if (allowSweptFaceRecovery) {
              // Keep the four established quarter-step samples, but express
              // them as one runtime loop. Emitting four copies of the contact
              // query made Dawn/Metal spend unbounded time compiling this
              // otherwise bounded kernel on Apple Silicon.
              Loop(
                {
                  start: uint(1),
                  end: uint(SWEPT_FACE_SAMPLE_COUNT + 1),
                  type: 'uint',
                  condition: '<',
                },
                ({ i: sampleIndex }) => {
                  const progress = float(sampleIndex)
                    .div(SWEPT_FACE_SAMPLE_COUNT)
                    .toVar('sphereFaceSweepProgress');
                  If(sphereIntersectsTriangle(
                    sphere,
                    mix(previousFirst, first, progress),
                    mix(previousSecond, second, progress),
                    mix(previousThird, third, progress),
                  ), () => {
                    intersects.assign(bool(true));
                  });
                },
              );
            } else {
              intersects.assign(sphereIntersectsTriangle(sphere, first, second, third));
            }
            const triangleHasVertexContact = first.sub(sphere.xyz).dot(first.sub(sphere.xyz))
              .lessThanEqual(sphereRadiusSquared.add(0.000_001))
              .or(second.sub(sphere.xyz).dot(second.sub(sphere.xyz))
                .lessThanEqual(sphereRadiusSquared.add(0.000_001)))
              .or(third.sub(sphere.xyz).dot(third.sub(sphere.xyz))
                .lessThanEqual(sphereRadiusSquared.add(0.000_001)))
              .toVar('sphereTriangleHasVertexContact');
            If(intersects.and(triangleHasVertexContact.not()), () => {
              const centroid = first.add(second).add(third).div(3);
              const resolvedNormal = centroid.sub(sphere.xyz)
                .toVar('sphereFaceResolvedNormal');
              If(resolvedNormal.dot(resolvedNormal).greaterThan(0.000_001), () => {
                resolvedNormal.assign(resolvedNormal.normalize());
              }).Else(() => {
                resolvedNormal.assign(vec3(1, 0, 0));
              });
              faceCorrection.addAssign(
                resolvedNormal.mul(CLOTH_WORLD_CLEARANCE * 1.5),
              );
              hadFaceContact.assign(bool(true));
            });
          });
        },
      );
      Loop(
        { start: uint(0), end: uint(worldCounts.y), type: 'uint', condition: '<' },
        ({ i: rockIndex }) => {
          const rockBase = capeIndex
            .mul(uint(MAX_WORLD_ROCKS * ROCK_BUFFER_STRIDE))
            .add(rockIndex.mul(uint(ROCK_BUFFER_STRIDE)));
          const rockMinimum = resources.rockBuffer.element(rockBase.add(1));
          const rockMaximum = resources.rockBuffer.element(rockBase.add(2));
          const overlapsRock = faceTriangleMaximum.x.greaterThanEqual(rockMinimum.x)
            .and(faceTriangleMinimum.x.lessThanEqual(rockMaximum.x))
            .and(faceTriangleMaximum.y.greaterThanEqual(rockMinimum.y))
            .and(faceTriangleMinimum.y.lessThanEqual(rockMaximum.y))
            .and(faceTriangleMaximum.z.greaterThanEqual(rockMinimum.z))
            .and(faceTriangleMinimum.z.lessThanEqual(rockMaximum.z));
          If(overlapsRock, () => {
            const triangleIntersects = bool(false).toVar('rockFaceTriangleIntersects');
            const firstSurfaceDistance = float(-1_000_000)
              .toVar('rockFaceFirstSurfaceDistance');
            const secondSurfaceDistance = float(-1_000_000)
              .toVar('rockFaceSecondSurfaceDistance');
            const thirdSurfaceDistance = float(-1_000_000)
              .toVar('rockFaceThirdSurfaceDistance');
            Loop(
              {
                start: uint(0),
                end: uint(ROCK_FACES_PER_COLLIDER),
                type: 'uint',
                condition: '<',
              },
              ({ i: rockFaceOffset }) => {
                const rockFaceBase = rockBase.add(4).add(rockFaceOffset.mul(4));
                const rockFirst = resources.rockBuffer.element(rockFaceBase).xyz;
                const rockSecond = resources.rockBuffer.element(rockFaceBase.add(1)).xyz;
                const rockThird = resources.rockBuffer.element(rockFaceBase.add(2)).xyz;
                const rockPlane = resources.rockBuffer.element(rockFaceBase.add(3));
                firstSurfaceDistance.assign(
                  firstSurfaceDistance.max(rockPlane.xyz.dot(first).sub(rockPlane.w)),
                );
                secondSurfaceDistance.assign(
                  secondSurfaceDistance.max(rockPlane.xyz.dot(second).sub(rockPlane.w)),
                );
                thirdSurfaceDistance.assign(
                  thirdSurfaceDistance.max(rockPlane.xyz.dot(third).sub(rockPlane.w)),
                );
                const rockFaceMinimum = rockFirst.min(rockSecond).min(rockThird);
                const rockFaceMaximum = rockFirst.max(rockSecond).max(rockThird);
                const overlapsRockFace = faceTriangleMaximum.x
                  .greaterThanEqual(rockFaceMinimum.x)
                  .and(faceTriangleMinimum.x.lessThanEqual(rockFaceMaximum.x))
                  .and(faceTriangleMaximum.y.greaterThanEqual(rockFaceMinimum.y))
                  .and(faceTriangleMinimum.y.lessThanEqual(rockFaceMaximum.y))
                  .and(faceTriangleMaximum.z.greaterThanEqual(rockFaceMinimum.z))
                  .and(faceTriangleMinimum.z.lessThanEqual(rockFaceMaximum.z));
                If(overlapsRockFace, () => {
                  const intersects = bool(false).toVar('rockFaceIntersects');
                  if (allowSweptFaceRecovery) {
                    Loop(
                      {
                        start: uint(1),
                        end: uint(SWEPT_FACE_SAMPLE_COUNT + 1),
                        type: 'uint',
                        condition: '<',
                      },
                      ({ i: sampleIndex }) => {
                        const progress = float(sampleIndex)
                          .div(SWEPT_FACE_SAMPLE_COUNT)
                          .toVar('rockFaceSweepProgress');
                        If(trianglesIntersect(
                          mix(previousFirst, first, progress),
                          mix(previousSecond, second, progress),
                          mix(previousThird, third, progress),
                          rockFirst,
                          rockSecond,
                          rockThird,
                        ), () => {
                          intersects.assign(bool(true));
                        });
                      },
                    );
                  } else {
                    intersects.assign(trianglesIntersect(
                      first,
                      second,
                      third,
                      rockFirst,
                      rockSecond,
                      rockThird,
                    ));
                  }
                  If(intersects, () => {
                    triangleIntersects.assign(bool(true));
                  });
                });
              },
            );
            const triangleHasVertexContact = firstSurfaceDistance
              .lessThanEqual(CLOTH_ROCK_CLEARANCE + 0.000_5)
              .or(secondSurfaceDistance.lessThanEqual(CLOTH_ROCK_CLEARANCE + 0.000_5))
              .or(thirdSurfaceDistance.lessThanEqual(CLOTH_ROCK_CLEARANCE + 0.000_5))
              .toVar('rockTriangleHasVertexContact');
            If(triangleIntersects.and(triangleHasVertexContact.not()), () => {
              const centroid = first.add(second).add(third).div(3)
                .toVar('rockFaceCentroid');
              const resolvedNormal = centroid.sub(
                resources.rockBuffer.element(rockBase).xyz,
              )
                .toVar('rockFaceResolvedNormal');
              If(resolvedNormal.dot(resolvedNormal).greaterThan(0.000_001), () => {
                resolvedNormal.assign(resolvedNormal.normalize());
              }).Else(() => {
                resolvedNormal.assign(vec3(1, 0, 0));
              });
              const belowWalkableShoulder = centroid.y.lessThanEqual(rockMinimum.w);
              const trappedAtFloor = resolvedNormal.y.lessThan(0)
                .and(centroid.y.lessThanEqual(rockMinimum.y.add(CLOTH_ROCK_CLEARANCE * 2)));
              If(belowWalkableShoulder.or(trappedAtFloor), () => {
                resolvedNormal.y.assign(0);
                If(resolvedNormal.dot(resolvedNormal).greaterThan(0.000_001), () => {
                  resolvedNormal.assign(resolvedNormal.normalize());
                }).Else(() => {
                  resolvedNormal.assign(vec3(1, 0, 0));
                });
              });
              faceCorrection.addAssign(
                resolvedNormal.mul(CLOTH_ROCK_CLEARANCE * 1.5),
              );
              hadFaceContact.assign(bool(true));
            });
          });
        },
      );
      if (getCaveWallCorrection) {
        const caveFaceCorrection = getCaveWallCorrection(
          first.add(second).add(third).div(3),
        ).toVar('caveFaceCorrection');
        const keepLargerCaveCorrection = (candidate: THREE.Node<'float'>): void => {
          If(candidate.abs().greaterThan(caveFaceCorrection.abs()), () => {
            caveFaceCorrection.assign(candidate);
          });
        };
        keepLargerCaveCorrection(getCaveWallCorrection(first.add(second).mul(0.5)));
        keepLargerCaveCorrection(getCaveWallCorrection(first.add(third).mul(0.5)));
        keepLargerCaveCorrection(getCaveWallCorrection(second.add(third).mul(0.5)));
        If(caveFaceCorrection.abs().greaterThan(0.000_001), () => {
          faceCorrection.x.addAssign(caveFaceCorrection.clamp(-0.015, 0.015));
          hadFaceContact.assign(bool(true));
        });
      }
      const correctionLength = faceCorrection.length().toVar('rockFaceCorrectionLength');
      If(correctionLength.greaterThan(0.015), () => {
        faceCorrection.mulAssign(float(0.015).div(correctionLength));
      });
      If(hadFaceContact, () => {
        atomicOr(resources.materialContactFlagBuffer.element(capeIndex), uint(1));
      });
      If(hadFaceContact, () => {
        const applyCorrection = (
          particleIndex: THREE.Node<'uint'>,
          declarationSuffix: string,
        ): void => {
          If(
            particleIndex.mod(uint(resources.particleCount)).greaterThanEqual(uint(CAPE.columns)),
            () => {
            const state = buffer.element(particleIndex);
            const corrected = state.xyz.add(faceCorrection)
              .toVar(`correctedRockFace${declarationSuffix}`);
            buffer.element(particleIndex).assign(vec4(
              corrected,
              state.w,
            ));
            const previousState = resources.previousBuffer.element(particleIndex);
            const correctedPrevious = previousState.xyz
              .add(faceCorrection)
              .toVar(`correctedPreviousRockFace${declarationSuffix}`);
            const faceNormal = faceCorrection.normalize()
              .toVar(`rockFaceMotionNormal${declarationSuffix}`);
            const inwardMotion = corrected.sub(correctedPrevious)
              .dot(faceNormal)
              .min(0);
            correctedPrevious.addAssign(faceNormal.mul(inwardMotion));
              resources.previousBuffer.element(particleIndex).assign(vec4(
              correctedPrevious,
              previousState.w,
            ));
            },
          );
        };
        applyCorrection(firstIndex, 'First');
        applyCorrection(secondIndex, 'Second');
        applyCorrection(thirdIndex, 'Third');
      });
    });
    return float(0);
  }, 'float').setLayout({
    name: `capeRockFaceColorPass${passName}`,
    type: 'float',
    inputs: [
      { name: 'color', type: 'uint' },
      { name: 'triangleSlot', type: 'uint' },
      { name: 'capeIndex', type: 'uint' },
    ],
  });
}
