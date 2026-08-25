import { CAVE } from '../config';
import { periodicFbm } from '../utils/random';

interface CaveProfileFunctions {
  readonly centerX: (z: number) => number;
  readonly halfWidth: (z: number) => number;
  readonly ceiling: (z: number) => number;
}

const LOWER_RADIAL_START = Math.floor(CAVE.radialSegments / 2);
const LOWER_SAMPLE_COUNT = CAVE.radialSegments - LOWER_RADIAL_START + 1;

export class CaveShellSampler {
  private readonly xSamples = new Float32Array((CAVE.segments + 1) * LOWER_SAMPLE_COUNT);
  private readonly ySamples = new Float32Array((CAVE.segments + 1) * LOWER_SAMPLE_COUNT);

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

  private build(): void {
    for (let segment = 0; segment <= CAVE.segments; segment += 1) {
      const progress = segment / CAVE.segments;
      const z = CAVE.startZ + (CAVE.endZ - CAVE.startZ) * progress;
      const centerX = this.profile.centerX(z);
      const ceiling = this.profile.ceiling(z);
      const centerY = ceiling * 0.5 - 0.25;
      const verticalRadius = ceiling * 0.5 + 0.45;
      const horizontalRadius = this.profile.halfWidth(z);

      for (let sample = 0; sample < LOWER_SAMPLE_COUNT; sample += 1) {
        const radial = LOWER_RADIAL_START + sample;
        const around = radial / CAVE.radialSegments;
        const angle = around * Math.PI * 2;
        const detail = periodicFbm(progress * 11.5, around * 8, 8, 0x782f) - 0.5;
        const ridges = Math.sin(z * 0.42 + angle * 5) * 0.12;
        const displacement = detail * 0.72 + ridges;
        const index = segment * LOWER_SAMPLE_COUNT + sample;
        this.xSamples[index] = centerX + Math.cos(angle) * (horizontalRadius + displacement);
        this.ySamples[index] = centerY + Math.sin(angle) * (verticalRadius + displacement * 0.66);
      }
    }
  }

  private sampleRow(segment: number, x: number): number {
    const start = segment * LOWER_SAMPLE_COUNT;
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
