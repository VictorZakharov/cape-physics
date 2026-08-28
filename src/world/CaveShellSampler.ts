import { CAVE } from '../config';
import { periodicFbm } from '../utils/random';

interface CaveProfileFunctions {
  readonly centerX: (z: number) => number;
  readonly halfWidth: (z: number) => number;
  readonly ceiling: (z: number) => number;
}

const LOWER_RADIAL_START = Math.floor(CAVE.radialSegments / 2);
const LOWER_SAMPLE_COUNT = CAVE.radialSegments - LOWER_RADIAL_START + 1;
const FULL_SAMPLE_COUNT = CAVE.radialSegments + 1;

export interface CaveHorizontalBounds {
  minimum: number;
  maximum: number;
}

export interface CaveShellSampleData {
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly samplesPerSection: number;
}

export class CaveShellSampler {
  private readonly xSamples = new Float32Array((CAVE.segments + 1) * FULL_SAMPLE_COUNT);
  private readonly ySamples = new Float32Array((CAVE.segments + 1) * FULL_SAMPLE_COUNT);
  private readonly sectionX = new Float32Array(FULL_SAMPLE_COUNT);
  private readonly sectionY = new Float32Array(FULL_SAMPLE_COUNT);

  public constructor(private readonly profile: CaveProfileFunctions) {
    this.build();
  }

  public getLowerHeight(x: number, z: number): number {
    const progress = (CAVE.startZ - z) / (CAVE.startZ - CAVE.endZ);
    const segmentPosition = Math.max(0, Math.min(CAVE.segments, progress * CAVE.segments));
    const firstSegment = Math.floor(segmentPosition);
    const secondSegment = Math.min(CAVE.segments, firstSegment + 1);
    const blend = segmentPosition - firstSegment;
    const firstHeight = this.sampleRow(firstSegment, x);
    const secondHeight = this.sampleRow(secondSegment, x);
    return firstHeight + (secondHeight - firstHeight) * blend;
  }

  public getHorizontalBounds(
    y: number,
    z: number,
    target: CaveHorizontalBounds,
  ): CaveHorizontalBounds {
    const progress = (CAVE.startZ - z) / (CAVE.startZ - CAVE.endZ);
    const segmentPosition = Math.max(0, Math.min(CAVE.segments, progress * CAVE.segments));
    const firstSegment = Math.floor(segmentPosition);
    const secondSegment = Math.min(CAVE.segments, firstSegment + 1);
    const blend = segmentPosition - firstSegment;
    const firstStart = firstSegment * FULL_SAMPLE_COUNT;
    const secondStart = secondSegment * FULL_SAMPLE_COUNT;
    for (let radial = 0; radial < FULL_SAMPLE_COUNT; radial += 1) {
      const firstIndex = firstStart + radial;
      const secondIndex = secondStart + radial;
      const firstX = this.xSamples[firstIndex] ?? 0;
      const firstY = this.ySamples[firstIndex] ?? 0;
      this.sectionX[radial] = firstX + ((this.xSamples[secondIndex] ?? firstX) - firstX) * blend;
      this.sectionY[radial] = firstY + ((this.ySamples[secondIndex] ?? firstY) - firstY) * blend;
    }

    target.minimum = Number.POSITIVE_INFINITY;
    target.maximum = Number.NEGATIVE_INFINITY;
    let nearestLeftX = Number.NEGATIVE_INFINITY;
    let nearestRightX = Number.POSITIVE_INFINITY;
    const center = this.profile.centerX(z);
    for (let radial = 0; radial < CAVE.radialSegments; radial += 1) {
      const next = radial + 1;
      const firstX = this.sectionX[radial] ?? center;
      const secondX = this.sectionX[next] ?? firstX;
      const firstY = this.sectionY[radial] ?? y;
      const secondY = this.sectionY[next] ?? firstY;
      if (firstX <= center) nearestLeftX = Math.max(nearestLeftX, firstX);
      if (firstX >= center) nearestRightX = Math.min(nearestRightX, firstX);
      if (
        y < Math.min(firstY, secondY)
        || y > Math.max(firstY, secondY)
        || Math.abs(secondY - firstY) < 0.000_001
      ) continue;
      const edgeBlend = (y - firstY) / (secondY - firstY);
      const intersectionX = firstX + (secondX - firstX) * edgeBlend;
      target.minimum = Math.min(target.minimum, intersectionX);
      target.maximum = Math.max(target.maximum, intersectionX);
    }

    if (!Number.isFinite(target.minimum)) target.minimum = nearestLeftX;
    if (!Number.isFinite(target.maximum)) target.maximum = nearestRightX;
    if (!Number.isFinite(target.minimum)) target.minimum = center - this.profile.halfWidth(z);
    if (!Number.isFinite(target.maximum)) target.maximum = center + this.profile.halfWidth(z);
    return target;
  }

  public containsPoint(
    x: number,
    y: number,
    z: number,
    clearance: number,
    target: CaveHorizontalBounds,
  ): boolean {
    this.getHorizontalBounds(y, z, target);
    let maximumY = Number.NEGATIVE_INFINITY;
    for (let radial = 0; radial < FULL_SAMPLE_COUNT; radial += 1) {
      maximumY = Math.max(maximumY, this.sectionY[radial] ?? maximumY);
    }
    return y <= maximumY - clearance
      && x >= target.minimum + clearance
      && x <= target.maximum - clearance;
  }

  /** Static shell samples shared with the WebGPU collision lookup buffer. */
  public getSampleData(): CaveShellSampleData {
    return {
      x: this.xSamples,
      y: this.ySamples,
      samplesPerSection: FULL_SAMPLE_COUNT,
    };
  }

  private build(): void {
    for (let segment = 0; segment <= CAVE.segments; segment += 1) {
      const progress = segment / CAVE.segments;
      const z = CAVE.startZ + (CAVE.endZ - CAVE.startZ) * progress;
      const centerX = this.profile.centerX(z);
      const ceiling = this.profile.ceiling(z);
      const centerY = ceiling * 0.5 - 0.25;
      const verticalRadius = ceiling * 0.5 + 0.45;
      const horizontalRadius = this.profile.halfWidth(z);

      for (let radial = 0; radial < FULL_SAMPLE_COUNT; radial += 1) {
        const around = radial / CAVE.radialSegments;
        const angle = around * Math.PI * 2;
        const detail = periodicFbm(progress * 11.5, around * 8, 8, 0x782f) - 0.5;
        const ridges = Math.sin(z * 0.42 + angle * 5) * 0.12;
        const displacement = detail * 0.72 + ridges;
        const index = segment * FULL_SAMPLE_COUNT + radial;
        this.xSamples[index] = centerX + Math.cos(angle) * (horizontalRadius + displacement);
        this.ySamples[index] = centerY + Math.sin(angle) * (verticalRadius + displacement * 0.66);
      }
    }
  }

  private sampleRow(segment: number, x: number): number {
    const start = segment * FULL_SAMPLE_COUNT + LOWER_RADIAL_START;
    let surfaceHeight = Number.NEGATIVE_INFINITY;
    let nearestHeight = this.ySamples[start] ?? 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let sample = 0; sample < LOWER_SAMPLE_COUNT; sample += 1) {
      const index = start + sample;
      const sampleX = this.xSamples[index] ?? x;
      const distance = Math.abs(x - sampleX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestHeight = this.ySamples[index] ?? nearestHeight;
      }
      if (sample + 1 >= LOWER_SAMPLE_COUNT) continue;
      const nextIndex = index + 1;
      const nextX = this.xSamples[nextIndex] ?? sampleX;
      const minimumX = Math.min(sampleX, nextX);
      const maximumX = Math.max(sampleX, nextX);
      if (x < minimumX || x > maximumX || maximumX - minimumX < 0.000_001) continue;
      const blend = (x - sampleX) / (nextX - sampleX);
      const sampleY = this.ySamples[index] ?? nearestHeight;
      const nextY = this.ySamples[nextIndex] ?? sampleY;
      surfaceHeight = Math.max(surfaceHeight, sampleY + (nextY - sampleY) * blend);
    }
    return Number.isFinite(surfaceHeight) ? surfaceHeight : nearestHeight;
  }
}
