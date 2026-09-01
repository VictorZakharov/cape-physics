import type * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  atomicOr,
  bool,
  float,
  mix,
  select,
  smoothstep,
  uint,
  vec3,
  vec4,
} from 'three/tsl';
import { CAPE, CAVE } from '../config';
import {
  GPU_BODY_BUFFER_STRIDE as BODY_BUFFER_STRIDE,
  GPU_ROCK_BUFFER_STRIDE as ROCK_BUFFER_STRIDE,
  GPU_ROCK_FACES_PER_COLLIDER as ROCK_FACES_PER_COLLIDER,
  MAX_GPU_BODY_COLLIDERS as MAX_BODY_COLLIDERS,
  MAX_GPU_WORLD_ROCKS as MAX_WORLD_ROCKS,
  MAX_GPU_WORLD_SPHERES as MAX_WORLD_SPHERES,
} from './GpuCapeColliderPacking';
import { GPU_CAPE_TOPOLOGY_METADATA_STRIDE } from './GpuCapeTopology';
import { FOLD_RELAXATION, MAXIMUM_LOCAL_UPWARD_FOLD } from './ClothFoldGuard';
import { CLOTH_THICKNESS } from './ClothSelfCollision';
import { CLOTH_ROCK_CLEARANCE, CLOTH_WORLD_CLEARANCE } from './ClothWorldCollision';
import { BODY_CONTACT_RECONCILIATION_START } from './CapeSolverConstants';
import {
  CAVE_SHELL_CONTACT_SKIN,
  WATER_BASINS,
} from '../world/caveProfile';

const MAXIMUM_CONTINUOUS_ROCK_SWEEP = 0.08;
const ROCK_SWEEP_SURFACE_OFFSET = 0.001;
const ROCK_SWEEP_TANGENTIAL_DAMPING = 0.76;
const CAVE_LOWER_RADIAL_START = Math.floor(CAVE.radialSegments / 2);

export interface GpuCapeProjectionResources {
  readonly anchorStateUniform: THREE.UniformArrayNode<'vec4'>;
  readonly bodyBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly bodyStateUniform: THREE.UniformArrayNode<'vec4'>;
  readonly caveShellBuffer: THREE.StorageBufferNode<'vec2'>;
  readonly materialContactFlagBuffer: THREE.StorageBufferNode<'uint'>;
  readonly positionBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly previousBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly rockBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly topologyBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly worldCountUniform: THREE.UniformArrayNode<'vec4'>;
  readonly worldSphereBuffer: THREE.StorageBufferNode<'vec4'>;
  readonly particleCount: number;
}

export function createGpuCapeProjectionFunction(
  resources: GpuCapeProjectionResources,
  source: THREE.StorageBufferNode<'vec4'>,
  target: THREE.StorageBufferNode<'vec4'>,
  passName: string,
  includeSelfCollision = true,
  includeContacts = true,
  includeFoldGuard = true,
) {
  return Fn<
    readonly [THREE.Node<'uint'>, THREE.Node<'bool'>],
    THREE.Node<'float'>
  >(([index, hardRockRecovery]) => {
    const capeIndex = index.div(uint(resources.particleCount));
    const localIndex = index.mod(uint(resources.particleCount));
    const capeBase = capeIndex.mul(uint(resources.particleCount));
    const anchorState = resources.anchorStateUniform.element(capeIndex);
    const bodyState = resources.bodyStateUniform.element(capeIndex);
    const worldCounts = resources.worldCountUniform.element(capeIndex);
    const back = bodyState.xyz;
    If(localIndex.lessThan(uint(CAPE.columns)), () => {
      target.element(index).assign(source.element(index));
    }).Else(() => {
    const position = source.element(index).xyz.toVar('position');
    const bodyCorrectionUsed = source.element(index).w.toVar('bodyCorrectionUsed');
    const previousState = resources.previousBuffer.element(index);
    const previousPosition = previousState.xyz.toVar('previousPosition');
    const rockSweepResolved = previousState.w.greaterThanEqual(0.5)
      .toVar('rockSweepResolved');
    const rockCorrectionUsed = select(
      rockSweepResolved,
      previousState.w.sub(1),
      previousState.w,
    ).toVar('rockCorrectionUsed');
    const particleRow = localIndex.div(uint(CAPE.columns));
    const particleColumn = localIndex.mod(uint(CAPE.columns));

    if (includeFoldGuard) {
    const topologyNeighbors = resources.topologyBuffer.element(
      localIndex.mul(uint(GPU_CAPE_TOPOLOGY_METADATA_STRIDE)).add(1),
    );
    const upper = source.element(capeBase.add(uint(topologyNeighbors.x))).xyz;
    const lower = source.element(capeBase.add(uint(topologyNeighbors.y))).xyz;
    const foldStart = position.toVar('foldStart');
    If(localIndex.greaterThanEqual(uint(CAPE.columns)), () => {
      const upwardExcess = position.y.sub(upper.y)
        .sub(MAXIMUM_LOCAL_UPWARD_FOLD)
        .max(0);
      position.y.subAssign(upwardExcess.mul(FOLD_RELAXATION * 0.5));
    });
    If(localIndex.lessThan(uint(resources.particleCount - CAPE.columns)), () => {
      const lowerExcess = lower.y.sub(position.y)
        .sub(MAXIMUM_LOCAL_UPWARD_FOLD)
        .max(0);
      position.y.addAssign(lowerExcess.mul(FOLD_RELAXATION * 0.5));
    });
    previousPosition.addAssign(position.sub(foldStart));
    }

    if (includeSelfCollision) {
    const selfStart = position.toVar('selfStart');
    const selfCorrection = vec3(0).toVar('selfCorrection');
    const selfContacts = float(0).toVar('selfContacts');
    Loop({ start: uint(0), end: uint(resources.particleCount), type: 'uint', condition: '<' }, ({ i }) => {
      If(i.notEqual(localIndex), () => {
        const otherRow = i.div(uint(CAPE.columns));
        const otherColumn = i.mod(uint(CAPE.columns));
        const rowDifference = select(
          particleRow.greaterThan(otherRow),
          particleRow.sub(otherRow),
          otherRow.sub(particleRow),
        );
        const columnDifference = select(
          particleColumn.greaterThan(otherColumn),
          particleColumn.sub(otherColumn),
          otherColumn.sub(particleColumn),
        );
        const topologicalNeighbor = rowDifference.lessThanEqual(uint(2))
          .and(columnDifference.lessThanEqual(2));
        If(topologicalNeighbor.not(), () => {
          const separation = position.sub(source.element(capeBase.add(i)).xyz)
            .toVar('selfSeparation');
          const distanceSquared = separation.dot(separation).toVar('selfDistanceSquared');
          If(distanceSquared.lessThan(CLOTH_THICKNESS ** 2), () => {
            const distance = distanceSquared.sqrt().toVar('selfDistance');
            const normal = vec3(1, 0, 0).toVar('selfNormal');
            If(distance.greaterThan(0.000_001), () => {
              normal.assign(separation.div(distance));
            }).Else(() => {
              const phase = float(localIndex)
                .mul(0.754_877_666)
                .add(float(i).mul(0.569_840_291));
              normal.assign(vec3(
                phase.sin(),
                phase.mul(1.37).cos(),
                phase.mul(0.73).add(1.1).sin(),
              ).normalize());
            });
            const massShare = select(i.lessThan(uint(CAPE.columns)), 1, 0.5);
            selfCorrection.addAssign(
              normal.mul(float(CLOTH_THICKNESS).sub(distance)).mul(massShare),
            );
            selfContacts.addAssign(1);
          });
        });
      });
    });
    position.addAssign(selfCorrection.div(selfContacts.max(1)));
    previousPosition.addAssign(position.sub(selfStart));
    }

    if (includeContacts) {
    const bodyCorrectionThisPass = float(0).toVar('bodyCorrectionThisPass');
    const topologySide = float(particleColumn)
      .div(CAPE.columns - 1)
      .sub(0.5)
      .toVar('bodyTopologySide');
    const bodyRight = vec3(
      back.z,
      0,
      back.x.negate(),
    ).normalize().toVar('bodyRight');

    Loop(
      { start: uint(0), end: uint(bodyState.w), type: 'uint', condition: '<' },
      ({ i }) => {
        const bodyBase = capeIndex
          .mul(uint(MAX_BODY_COLLIDERS * BODY_BUFFER_STRIDE))
          .add(i.mul(uint(BODY_BUFFER_STRIDE)));
        const startRadius = resources.bodyBuffer.element(bodyBase);
        const axisDepth = resources.bodyBuffer.element(bodyBase.add(1));
        const lateralAxis = resources.bodyBuffer.element(bodyBase.add(2));
        const verticalBounds = resources.bodyBuffer.element(bodyBase.add(3));
        If(
          position.y.greaterThanEqual(verticalBounds.x)
            .and(position.y.lessThanEqual(verticalBounds.y)),
          () => {
            const fromStart = position.sub(startRadius.xyz).toVar('bodyFromStart');
            const particleDepth = fromStart.dot(back).toVar('bodyParticleDepth');
            const particleLateral = fromStart
              .sub(back.mul(particleDepth))
              .toVar('bodyParticleLateral');
            const progress = select(
              lateralAxis.w.greaterThan(0.000_001),
              particleLateral.dot(lateralAxis.xyz).div(lateralAxis.w).clamp(0, 1),
              0,
            );
            const closest = startRadius.xyz.add(axisDepth.xyz.mul(progress));
            const bodyDelta = position.sub(closest).toVar('bodyDelta');
            const depth = bodyDelta.dot(back).toVar('bodyDepth');
            const lateralSquared = bodyDelta.dot(bodyDelta)
              .sub(depth.mul(depth))
              .max(0)
              .toVar('bodyLateralSquared');
            const radiusSquared = startRadius.w.mul(startRadius.w);
            If(lateralSquared.lessThan(radiusSquared), () => {
              const normalizedLateral = lateralSquared.div(radiusSquared).clamp(0, 1);
              const surfaceDepth = axisDepth.w.mul(float(1).sub(normalizedLateral).sqrt());
              const backCorrection = surfaceDepth.sub(depth).max(0);
              If(
                backCorrection.greaterThan(0)
                  .and(depth.greaterThan(axisDepth.w.negate())),
                () => {
                  const contactNormal = back.toVar('bodyContactNormal');
                  const penetration = backCorrection.toVar('bodyPenetration');
                  If(depth.lessThan(0), () => {
                    // A front-side vertex exits laterally instead of being
                    // teleported through the full body depth. Match WebGL's
                    // topology-stable side; the center column falls back to
                    // the particle's prior spatial side.
                    const depthRatio = depth.div(axisDepth.w).clamp(-1, 0);
                    const lateralBoundary = startRadius.w.mul(
                      float(1).sub(depthRatio.mul(depthRatio)).max(0).sqrt(),
                    );
                    const spatialSide = previousPosition
                      .sub(anchorState.xyz)
                      .dot(bodyRight);
                    const preferredSide = select(
                      topologySide.abs().greaterThan(0.000_001),
                      topologySide,
                      spatialSide,
                    ).toVar('bodyPreferredSide');
                    If(preferredSide.abs().greaterThan(0.000_001), () => {
                      contactNormal.assign(bodyRight.mul(
                        select(preferredSide.greaterThan(0), 1, -1),
                      ));
                    }).Else(() => {
                      const preferredDelta = previousPosition.sub(closest)
                        .toVar('bodyPreferredDelta');
                      const preferredDepth = preferredDelta.dot(back);
                      const preferredLateral = preferredDelta
                        .sub(back.mul(preferredDepth))
                        .mul(vec3(1, 0, 1))
                        .toVar('bodyPreferredLateral');
                      If(preferredLateral.length().greaterThan(0.000_001), () => {
                        contactNormal.assign(preferredLateral.normalize());
                      }).ElseIf(lateralSquared.greaterThan(0.000_001), () => {
                        contactNormal.assign(
                          bodyDelta.sub(back.mul(depth)).normalize(),
                        );
                      }).Else(() => {
                        contactNormal.assign(bodyRight);
                      });
                    });
                    const lateralCorrection = lateralBoundary
                      .sub(bodyDelta.dot(contactNormal));
                    penetration.assign(select(
                      lateralCorrection.greaterThan(0),
                      lateralCorrection,
                      backCorrection,
                    ));
                  });
                  If(penetration.greaterThan(0), () => {
                    const correction = contactNormal.mul(penetration);
                    position.addAssign(correction);
                    previousPosition.addAssign(correction);
                    const inwardMotion = position.sub(previousPosition)
                      .dot(contactNormal)
                      .min(0);
                    previousPosition.addAssign(contactNormal.mul(inwardMotion));
                    bodyCorrectionUsed.addAssign(penetration);
                    bodyCorrectionThisPass.addAssign(penetration);
                  });
                },
              );
            });
          },
        );
      },
    );

    const worldContactStart = position.toVar('worldContactStart');

    position.z.assign(position.z.clamp(CAVE.endZ + 0.08, CAVE.startZ - 0.08));
    const caveSegmentPosition = float(CAVE.startZ).sub(position.z)
      .div(CAVE.startZ - CAVE.endZ)
      .clamp(0, 1)
      .mul(CAVE.segments)
      .toVar('caveSegmentPosition');
    const caveFirstSegment = uint(caveSegmentPosition.floor()).toVar('caveFirstSegment');
    const caveSecondSegment = select(
      caveFirstSegment.lessThan(uint(CAVE.segments)),
      caveFirstSegment.add(1),
      caveFirstSegment,
    ).toVar('caveSecondSegment');
    const caveBlend = caveSegmentPosition.sub(float(caveFirstSegment)).toVar('caveBlend');
    const caveSectionSamples = uint(CAVE.radialSegments + 1);

    // Match CaveShellSampler.getLowerHeight exactly: intersect each adjacent
    // z section at the particle's x coordinate, then interpolate the two
    // resulting heights. Interpolating shell vertices first subtly changes
    // the piecewise surface and created centimetre-scale contact gaps.
    const firstLowerSurface = float(-1_000_000).toVar('firstLowerSurface');
    const secondLowerSurface = float(-1_000_000).toVar('secondLowerSurface');
    const firstNearestLowerHeight = float(0).toVar('firstNearestLowerHeight');
    const secondNearestLowerHeight = float(0).toVar('secondNearestLowerHeight');
    const firstNearestLowerDistance = float(1_000_000).toVar('firstNearestLowerDistance');
    const secondNearestLowerDistance = float(1_000_000).toVar('secondNearestLowerDistance');
    Loop(
      {
        start: uint(0),
        end: uint(CAVE.radialSegments - CAVE_LOWER_RADIAL_START + 1),
        type: 'uint',
        condition: '<',
      },
      ({ i }) => {
        const radial = i.add(uint(CAVE_LOWER_RADIAL_START));
        const firstSample = resources.caveShellBuffer.element(
          caveFirstSegment.mul(caveSectionSamples).add(radial),
        );
        const secondSample = resources.caveShellBuffer.element(
          caveSecondSegment.mul(caveSectionSamples).add(radial),
        );
        const firstSampleDistance = position.x.sub(firstSample.x).abs();
        const secondSampleDistance = position.x.sub(secondSample.x).abs();
        If(firstSampleDistance.lessThan(firstNearestLowerDistance), () => {
          firstNearestLowerDistance.assign(firstSampleDistance);
          firstNearestLowerHeight.assign(firstSample.y);
        });
        If(secondSampleDistance.lessThan(secondNearestLowerDistance), () => {
          secondNearestLowerDistance.assign(secondSampleDistance);
          secondNearestLowerHeight.assign(secondSample.y);
        });
        If(
          i.lessThan(uint(CAVE.radialSegments - CAVE_LOWER_RADIAL_START)),
          () => {
            const nextFirst = resources.caveShellBuffer.element(
              caveFirstSegment.mul(caveSectionSamples).add(radial).add(1),
            );
            const nextSecond = resources.caveShellBuffer.element(
              caveSecondSegment.mul(caveSectionSamples).add(radial).add(1),
            );
            const firstEdgeWidth = nextFirst.x.sub(firstSample.x).toVar('firstLowerEdgeWidth');
            If(
              position.x.greaterThanEqual(firstSample.x.min(nextFirst.x))
                .and(position.x.lessThanEqual(firstSample.x.max(nextFirst.x)))
                .and(firstEdgeWidth.abs().greaterThan(0.000_001)),
              () => {
                const edgeBlend = position.x.sub(firstSample.x).div(firstEdgeWidth);
                firstLowerSurface.assign(
                  firstLowerSurface.max(mix(firstSample.y, nextFirst.y, edgeBlend)),
                );
              },
            );
            const secondEdgeWidth = nextSecond.x.sub(secondSample.x).toVar('secondLowerEdgeWidth');
            If(
              position.x.greaterThanEqual(secondSample.x.min(nextSecond.x))
                .and(position.x.lessThanEqual(secondSample.x.max(nextSecond.x)))
                .and(secondEdgeWidth.abs().greaterThan(0.000_001)),
              () => {
                const edgeBlend = position.x.sub(secondSample.x).div(secondEdgeWidth);
                secondLowerSurface.assign(
                  secondLowerSurface.max(mix(secondSample.y, nextSecond.y, edgeBlend)),
                );
              },
            );
          },
        );
      },
    );
    const firstShellFloor = select(
      firstLowerSurface.greaterThan(-500_000),
      firstLowerSurface,
      firstNearestLowerHeight,
    );
    const secondShellFloor = select(
      secondLowerSurface.greaterThan(-500_000),
      secondLowerSurface,
      secondNearestLowerHeight,
    );
    const shellFloor = mix(firstShellFloor, secondShellFloor, caveBlend)
      .add(CAVE_SHELL_CONTACT_SKIN);

    const caveCenter = position.z.sub(10).mul(0.055).sin().mul(2.05)
      .add(position.z.add(5).mul(0.137).sin().mul(0.38))
      .toVar('caveCenter');
    const caveHalfWidth = float(4.7)
      .add(position.z.mul(0.093).add(1.2).sin().mul(0.62))
      .add(position.z.mul(0.031).sin().mul(0.34))
      .toVar('caveHalfWidth');
    const edge = position.x.sub(caveCenter).abs().div(caveHalfWidth);
    const baseFloor = position.x.mul(0.71).add(position.z.mul(0.16)).sin().mul(0.018)
      .add(position.z.mul(0.47).sin().mul(0.014))
      .add(edge.sub(0.68).max(0).pow(2).mul(0.34))
      .toVar('baseFloor');
    const basinFloor = baseFloor.toVar('basinFloor');
    for (const basin of WATER_BASINS) {
      const normalizedX = position.x.sub(basin.centerX).div(basin.radiusX);
      const normalizedZ = position.z.sub(basin.centerZ).div(basin.radiusZ);
      const normalizedDistance = normalizedX.mul(normalizedX)
        .add(normalizedZ.mul(normalizedZ))
        .sqrt();
      const basinBlend = float(1).sub(smoothstep(0.9, 1.08, normalizedDistance));
      basinFloor.assign(basinFloor.min(baseFloor.sub(basinBlend.mul(basin.depth))));
    }
    const caveFloor = shellFloor.max(basinFloor).add(CLOTH_WORLD_CLEARANCE).toVar('caveFloor');

    Loop(
      {
        start: uint(0),
        end: uint(worldCounts.x),
        type: 'uint',
        condition: '<',
      },
      ({ i }) => {
        const sphere = resources.worldSphereBuffer.element(
          capeIndex.mul(uint(MAX_WORLD_SPHERES)).add(i),
        );
        const sphereDelta = position.sub(sphere.xyz).toVar('sphereDelta');
        const sphereDistanceSquared = sphereDelta.dot(sphereDelta).toVar('sphereDistanceSquared');
        If(sphereDistanceSquared.lessThan(sphere.w.mul(sphere.w)), () => {
          const sphereDistance = sphereDistanceSquared.sqrt().toVar('sphereDistance');
          const sphereNormal = vec3(0, 1, 0).toVar('sphereNormal');
          If(sphereDistance.greaterThan(0.000_001), () => {
            sphereNormal.assign(sphereDelta.div(sphereDistance));
          }).Else(() => {
            const previousDelta = previousPosition.sub(sphere.xyz);
            If(previousDelta.dot(previousDelta).greaterThan(0.000_001), () => {
              sphereNormal.assign(previousDelta.normalize());
            });
          });
          const sphereCorrection = sphere.w.sub(sphereDistance).toVar('sphereCorrection');
          If(
            sphereNormal.y.lessThan(0)
              .and(position.y.lessThanEqual(caveFloor.add(0.045))),
            () => {
              const planar = vec3(sphereDelta.x, 0, sphereDelta.z).toVar('spherePlanar');
              const planarDistance = planar.length().toVar('spherePlanarDistance');
              If(planarDistance.greaterThan(0.000_001), () => {
                sphereNormal.assign(planar.div(planarDistance));
              }).Else(() => {
                sphereNormal.assign(vec3(1, 0, 0));
              });
              const requiredPlanar = sphere.w.mul(sphere.w)
                .sub(sphereDelta.y.mul(sphereDelta.y))
                .max(0)
                .sqrt();
              sphereCorrection.assign(requiredPlanar.sub(planarDistance).max(0));
            },
          );
          position.addAssign(sphereNormal.mul(sphereCorrection));
        });
      },
    );

    Loop(
      { start: uint(0), end: uint(worldCounts.y), type: 'uint', condition: '<' },
      ({ i }) => {
        const rockBase = capeIndex
          .mul(uint(MAX_WORLD_ROCKS * ROCK_BUFFER_STRIDE))
          .add(i.mul(uint(ROCK_BUFFER_STRIDE)));
        const rockCenterLimit = resources.rockBuffer.element(rockBase);
        const rockMinimum = resources.rockBuffer.element(rockBase.add(1));
        const rockMaximum = resources.rockBuffer.element(rockBase.add(2));
        const sweepMinimum = position.min(previousPosition);
        const sweepMaximum = position.max(previousPosition);
        const inExpandedBounds = sweepMaximum.x
          .greaterThanEqual(rockMinimum.x.sub(CLOTH_ROCK_CLEARANCE))
          .and(sweepMinimum.x.lessThanEqual(rockMaximum.x.add(CLOTH_ROCK_CLEARANCE)))
          .and(sweepMaximum.y.greaterThanEqual(rockMinimum.y.sub(CLOTH_ROCK_CLEARANCE)))
          .and(sweepMinimum.y.lessThanEqual(rockMaximum.y.add(CLOTH_ROCK_CLEARANCE)))
          .and(sweepMaximum.z.greaterThanEqual(rockMinimum.z.sub(CLOTH_ROCK_CLEARANCE)))
          .and(sweepMinimum.z.lessThanEqual(rockMaximum.z.add(CLOTH_ROCK_CLEARANCE)));
        If(inExpandedBounds, () => {
          const sweepMotion = position.sub(previousPosition).toVar('rockSweepMotion');
          const sweepLengthSquared = sweepMotion.dot(sweepMotion)
            .toVar('rockSweepLengthSquared');
          If(
            rockSweepResolved.not()
              .and(sweepLengthSquared.greaterThan(0.000_000_1))
              .and(sweepLengthSquared.lessThanEqual(MAXIMUM_CONTINUOUS_ROCK_SWEEP ** 2)),
            () => {
              const sweepEntry = float(0).toVar('rockSweepEntry');
              const sweepExit = float(1).toVar('rockSweepExit');
              const sweepStartsInside = bool(true).toVar('rockSweepStartsInside');
              const sweepRejected = bool(false).toVar('rockSweepRejected');
              const sweepEntryFaceFound = bool(false).toVar('rockSweepEntryFaceFound');
              const sweepNormal = vec3(0, 1, 0).toVar('rockSweepNormal');
              Loop(
                { start: uint(0), end: uint(ROCK_FACES_PER_COLLIDER), type: 'uint', condition: '<' },
                ({ i: sweepFaceOffset }) => {
                  const sweepFaceBase = rockBase.add(4).add(sweepFaceOffset.mul(4));
                  const sweepPlane = resources.rockBuffer.element(sweepFaceBase.add(3));
                  const expandedConstant = sweepPlane.w.add(CLOTH_ROCK_CLEARANCE);
                  const startDistance = sweepPlane.xyz.dot(previousPosition)
                    .sub(expandedConstant)
                    .toVar('rockSweepStartDistance');
                  const endDistance = sweepPlane.xyz.dot(position)
                    .sub(expandedConstant)
                    .toVar('rockSweepEndDistance');
                  If(startDistance.greaterThan(0), () => {
                    sweepStartsInside.assign(bool(false));
                  });
                  If(
                    startDistance.greaterThan(0).and(endDistance.greaterThan(0)),
                    () => {
                      sweepRejected.assign(bool(true));
                    },
                  );
                  If(
                    startDistance.lessThanEqual(0).and(endDistance.lessThanEqual(0)).not()
                      .and(startDistance.sub(endDistance).abs().greaterThan(0.000_000_1)),
                    () => {
                      const progress = startDistance
                        .div(startDistance.sub(endDistance))
                        .toVar('rockSweepProgress');
                      If(startDistance.greaterThan(endDistance), () => {
                        If(progress.greaterThan(sweepEntry), () => {
                          sweepEntry.assign(progress);
                          sweepNormal.assign(sweepPlane.xyz);
                          sweepEntryFaceFound.assign(bool(true));
                        });
                      }).Else(() => {
                        sweepExit.assign(sweepExit.min(progress));
                      });
                    },
                  );
                },
              );
              If(
                sweepStartsInside.not()
                  .and(sweepRejected.not())
                  .and(sweepEntryFaceFound)
                  .and(sweepEntry.lessThanEqual(sweepExit))
                  .and(sweepEntry.greaterThanEqual(0))
                  .and(sweepEntry.lessThanEqual(1)),
                () => {
                  rockSweepResolved.assign(bool(true));
                  const sweepHit = previousPosition.add(sweepMotion.mul(sweepEntry))
                    .toVar('rockSweepHit');
                  const belowWalkableShoulder = sweepHit.y.lessThanEqual(rockMinimum.w);
                  const trappedAtFloor = sweepNormal.y.lessThan(0)
                    .and(sweepHit.y.lessThanEqual(caveFloor.add(CLOTH_ROCK_CLEARANCE * 2)));
                  If(belowWalkableShoulder.or(trappedAtFloor), () => {
                    const planarNormal = vec3(
                      sweepHit.x.sub(rockCenterLimit.x),
                      0,
                      sweepHit.z.sub(rockCenterLimit.z),
                    ).toVar('rockSweepPlanarNormal');
                    If(planarNormal.dot(planarNormal).greaterThan(0.000_001), () => {
                      sweepNormal.assign(planarNormal.normalize());
                    }).Else(() => {
                      sweepNormal.assign(vec3(1, 0, 0));
                    });
                  });
                  const remainingMotion = sweepMotion.mul(float(1).sub(sweepEntry))
                    .toVar('rockSweepRemainingMotion');
                  const inwardMotion = remainingMotion.dot(sweepNormal)
                    .toVar('rockSweepInwardMotion');
                  If(inwardMotion.lessThan(0), () => {
                    remainingMotion.subAssign(sweepNormal.mul(inwardMotion));
                  });
                  remainingMotion.mulAssign(ROCK_SWEEP_TANGENTIAL_DAMPING);
                  sweepHit.addAssign(sweepNormal.mul(ROCK_SWEEP_SURFACE_OFFSET));
                  previousPosition.assign(sweepHit);
                  position.assign(sweepHit.add(remainingMotion));
                },
              );
            },
          );

          const insideRock = bool(true).toVar('insideRock');
          const closestDistanceSquared = float(1_000_000).toVar('closestRockDistanceSquared');
          const closestRockPoint = rockCenterLimit.xyz.toVar('closestRockPoint');
          const closestRockFaceNormal = vec3(0, 1, 0).toVar('closestRockFaceNormal');
          Loop(
            { start: uint(0), end: uint(ROCK_FACES_PER_COLLIDER), type: 'uint', condition: '<' },
            ({ i: faceOffset }) => {
              const faceBase = rockBase.add(4).add(faceOffset.mul(4));
              const vertexA = resources.rockBuffer.element(faceBase).xyz;
              const vertexB = resources.rockBuffer.element(faceBase.add(1)).xyz;
              const vertexC = resources.rockBuffer.element(faceBase.add(2)).xyz;
              const facePlane = resources.rockBuffer.element(faceBase.add(3));
              If(facePlane.xyz.dot(position).sub(facePlane.w).greaterThan(0.000_01), () => {
                insideRock.assign(bool(false));
              });

              const faceMinimum = vertexA.min(vertexB).min(vertexC);
              const faceMaximum = vertexA.max(vertexB).max(vertexC);
              const boundsDelta = vec3(
                faceMinimum.x.sub(position.x).max(0)
                  .add(position.x.sub(faceMaximum.x).max(0)),
                faceMinimum.y.sub(position.y).max(0)
                  .add(position.y.sub(faceMaximum.y).max(0)),
                faceMinimum.z.sub(position.z).max(0)
                  .add(position.z.sub(faceMaximum.z).max(0)),
              );
              If(boundsDelta.dot(boundsDelta).lessThan(closestDistanceSquared), () => {
                const ab = vertexB.sub(vertexA).toVar('rockAB');
                const ac = vertexC.sub(vertexA).toVar('rockAC');
                const ap = position.sub(vertexA).toVar('rockAP');
                const d1 = ab.dot(ap).toVar('rockD1');
                const d2 = ac.dot(ap).toVar('rockD2');
                const bp = position.sub(vertexB).toVar('rockBP');
                const d3 = ab.dot(bp).toVar('rockD3');
                const d4 = ac.dot(bp).toVar('rockD4');
                const cp = position.sub(vertexC).toVar('rockCP');
                const d5 = ab.dot(cp).toVar('rockD5');
                const d6 = ac.dot(cp).toVar('rockD6');
                const vc = d1.mul(d4).sub(d3.mul(d2)).toVar('rockVC');
                const vb = d5.mul(d2).sub(d1.mul(d6)).toVar('rockVB');
                const va = d3.mul(d6).sub(d5.mul(d4)).toVar('rockVA');
                const trianglePoint = vertexA.toVar('rockTrianglePoint');
                If(d1.lessThanEqual(0).and(d2.lessThanEqual(0)), () => {
                  trianglePoint.assign(vertexA);
                }).ElseIf(d3.greaterThanEqual(0).and(d4.lessThanEqual(d3)), () => {
                  trianglePoint.assign(vertexB);
                }).ElseIf(
                  vc.lessThanEqual(0).and(d1.greaterThanEqual(0)).and(d3.lessThanEqual(0)),
                  () => {
                    const progress = d1.div(d1.sub(d3).max(0.000_001));
                    trianglePoint.assign(vertexA.add(ab.mul(progress)));
                  },
                ).ElseIf(d6.greaterThanEqual(0).and(d5.lessThanEqual(d6)), () => {
                  trianglePoint.assign(vertexC);
                }).ElseIf(
                  vb.lessThanEqual(0).and(d2.greaterThanEqual(0)).and(d6.lessThanEqual(0)),
                  () => {
                    const progress = d2.div(d2.sub(d6).max(0.000_001));
                    trianglePoint.assign(vertexA.add(ac.mul(progress)));
                  },
                ).ElseIf(
                  va.lessThanEqual(0)
                    .and(d4.sub(d3).greaterThanEqual(0))
                    .and(d5.sub(d6).greaterThanEqual(0)),
                  () => {
                    const first = d4.sub(d3);
                    const second = d5.sub(d6);
                    const progress = first.div(first.add(second).max(0.000_001));
                    trianglePoint.assign(vertexB.add(vertexC.sub(vertexB).mul(progress)));
                  },
                ).Else(() => {
                  const denominator = va.add(vb).add(vc).max(0.000_001).reciprocal();
                  const firstWeight = vb.mul(denominator);
                  const secondWeight = vc.mul(denominator);
                  trianglePoint.assign(
                    vertexA.add(ab.mul(firstWeight)).add(ac.mul(secondWeight)),
                  );
                });

                const pointDelta = position.sub(trianglePoint).toVar('rockPointDelta');
                const pointDistanceSquared = pointDelta.dot(pointDelta)
                  .toVar('rockPointDistanceSquared');
                If(pointDistanceSquared.lessThan(closestDistanceSquared), () => {
                  closestDistanceSquared.assign(pointDistanceSquared);
                  closestRockPoint.assign(trianglePoint);
                  closestRockFaceNormal.assign(facePlane.xyz);
                });
              });
            },
          );

          const rockDistance = closestDistanceSquared.sqrt().toVar('rockDistance');
          const rockNormal = closestRockFaceNormal.toVar('rockNormal');
          If(rockDistance.greaterThan(0.000_001), () => {
            rockNormal.assign(select(
              insideRock,
              closestRockPoint.sub(position).div(rockDistance),
              position.sub(closestRockPoint).div(rockDistance),
            ));
          });
          const signedRockDistance = select(insideRock, rockDistance.negate(), rockDistance);
          If(signedRockDistance.lessThan(CLOTH_ROCK_CLEARANCE), () => {
            const belowWalkableShoulder = position.y.lessThanEqual(rockMinimum.w);
            const trappedAtFloor = rockNormal.y.lessThan(0)
              .and(position.y.lessThanEqual(caveFloor.add(CLOTH_ROCK_CLEARANCE * 2)));
            If(belowWalkableShoulder.or(trappedAtFloor), () => {
              const planarNormal = vec3(
                position.x.sub(rockCenterLimit.x),
                0,
                position.z.sub(rockCenterLimit.z),
              ).toVar('rockPlanarNormal');
              If(planarNormal.dot(planarNormal).greaterThan(0.000_001), () => {
                rockNormal.assign(planarNormal.normalize());
              }).Else(() => {
                rockNormal.assign(vec3(1, 0, 0));
              });
            });
            const remainingAllowance = select(
              hardRockRecovery,
              1_000_000,
              rockCenterLimit.w.sub(rockCorrectionUsed).max(0),
            );
            const rockCorrection = float(CLOTH_ROCK_CLEARANCE)
              .sub(signedRockDistance)
              .min(remainingAllowance)
              .max(0);
            position.addAssign(rockNormal.mul(rockCorrection));
            rockCorrectionUsed.addAssign(rockCorrection);
          });
        });
      },
    );
    position.y.assign(position.y.max(caveFloor));

    const caveCeiling = float(7.3)
      .add(position.z.mul(0.071).add(0.7).sin().mul(0.58))
      .add(position.z.mul(0.21).sin().mul(0.18))
      .add(0.12 - CLOTH_WORLD_CLEARANCE)
      .toVar('caveCeiling');
    position.y.assign(position.y.min(caveCeiling));

    const minimumIntersection = float(1_000_000).toVar('minimumCaveIntersection');
    const maximumIntersection = float(-1_000_000).toVar('maximumCaveIntersection');
    const nearestLeft = float(-1_000_000).toVar('nearestCaveLeft');
    const nearestRight = float(1_000_000).toVar('nearestCaveRight');
    Loop(
      { start: uint(0), end: uint(CAVE.radialSegments), type: 'uint', condition: '<' },
      ({ i }) => {
        const firstA = resources.caveShellBuffer.element(
          caveFirstSegment.mul(caveSectionSamples).add(i),
        );
        const firstB = resources.caveShellBuffer.element(
          caveSecondSegment.mul(caveSectionSamples).add(i),
        );
        const secondA = resources.caveShellBuffer.element(
          caveFirstSegment.mul(caveSectionSamples).add(i).add(1),
        );
        const secondB = resources.caveShellBuffer.element(
          caveSecondSegment.mul(caveSectionSamples).add(i).add(1),
        );
        const firstX = mix(firstA.x, firstB.x, caveBlend).toVar('caveFirstX');
        const firstY = mix(firstA.y, firstB.y, caveBlend).toVar('caveFirstY');
        const secondX = mix(secondA.x, secondB.x, caveBlend).toVar('caveSecondX');
        const secondY = mix(secondA.y, secondB.y, caveBlend).toVar('caveSecondY');
        If(firstX.lessThanEqual(caveCenter), () => {
          nearestLeft.assign(nearestLeft.max(firstX));
        });
        If(firstX.greaterThanEqual(caveCenter), () => {
          nearestRight.assign(nearestRight.min(firstX));
        });
        const edgeHeight = secondY.sub(firstY);
        If(
          position.y.greaterThanEqual(firstY.min(secondY))
            .and(position.y.lessThanEqual(firstY.max(secondY)))
            .and(edgeHeight.abs().greaterThan(0.000_001)),
          () => {
            const edgeBlend = position.y.sub(firstY).div(edgeHeight);
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
    ).add(CLOTH_WORLD_CLEARANCE).toVar('minimumCaveX');
    const maximumX = select(
      maximumIntersection.greaterThan(-500_000),
      maximumIntersection,
      nearestRight,
    ).sub(CLOTH_WORLD_CLEARANCE).toVar('maximumCaveX');
    If(minimumX.greaterThan(maximumX), () => {
      const center = minimumX.add(maximumX).mul(0.5);
      minimumX.assign(center.sub(0.08));
      maximumX.assign(center.add(0.08));
    });
    position.x.assign(position.x.clamp(minimumX, maximumX));
    const worldContactCorrection = position.sub(worldContactStart)
      .toVar('worldContactCorrection');
    If(
      bodyCorrectionThisPass.greaterThan(BODY_CONTACT_RECONCILIATION_START)
        .or(worldContactCorrection.dot(worldContactCorrection).greaterThan(0.000_000_1)),
      () => {
        atomicOr(resources.materialContactFlagBuffer.element(capeIndex), uint(1));
      },
    );
    // Point-body corrections already updated previousPosition sequentially,
    // exactly like WebGL. Only the later fixed-world displacement remains.
    previousPosition.addAssign(worldContactCorrection);
    If(worldContactCorrection.dot(worldContactCorrection).greaterThan(0.000_000_1), () => {
      const contactNormal = worldContactCorrection.normalize().toVar('contactNormal');
      const inwardMotion = position.sub(previousPosition)
        .dot(contactNormal)
        .min(0)
        .toVar('contactInwardMotion');
      previousPosition.addAssign(contactNormal.mul(inwardMotion));
    });
    }
    resources.previousBuffer.element(index).assign(vec4(
      previousPosition,
      rockCorrectionUsed.add(select(rockSweepResolved, 1, 0)),
    ));

      target.element(index).assign(vec4(position, bodyCorrectionUsed));
    });
    return float(0);
  }, 'float').setLayout({
    name: `capeProjection${passName}`,
    type: 'float',
    inputs: [
      { name: 'index', type: 'uint' },
      { name: 'hardRockRecovery', type: 'bool' },
    ],
  });
}
