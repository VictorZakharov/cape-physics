import * as THREE from 'three';

export interface LocalLightSource {
  readonly position: THREE.Vector3;
  readonly color: THREE.Color;
  readonly range: number;
  intensity: number;
}

export interface LightPoolDiagnostics {
  readonly lights: number;
  readonly visibleLights: number;
  readonly activeLights: number;
}

// Three.js bakes visible light counts into PBR shader program keys. Pool lights
// therefore stay visible while their intensity reaches zero; only assignments
// change as the viewer moves, avoiding traversal-time shader recompilation.
export class NearestPointLightPool {
  public readonly lights: THREE.PointLight[];
  private readonly selectedIndices: Int32Array;
  private readonly selectedDistances: Float64Array;

  public constructor(size: number, name: string) {
    this.lights = Array.from({ length: size }, (_, index) => {
      const light = new THREE.PointLight(0xffffff, 0, 1, 2);
      light.name = `${name} pooled light ${index + 1}`;
      return light;
    });
    this.selectedIndices = new Int32Array(size);
    this.selectedDistances = new Float64Array(size);
  }

  public update(viewer: THREE.Vector3, sources: readonly LocalLightSource[]): void {
    this.selectedIndices.fill(-1);
    this.selectedDistances.fill(Number.POSITIVE_INFINITY);

    for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex += 1) {
      const source = sources[sourceIndex];
      if (!source) continue;
      const distanceSquared = source.position.distanceToSquared(viewer);
      for (let slot = 0; slot < this.lights.length; slot += 1) {
        if (distanceSquared >= (this.selectedDistances[slot] ?? Number.POSITIVE_INFINITY)) continue;
        for (let shift = this.lights.length - 1; shift > slot; shift -= 1) {
          this.selectedIndices[shift] = this.selectedIndices[shift - 1] ?? -1;
          this.selectedDistances[shift] = this.selectedDistances[shift - 1] ?? Number.POSITIVE_INFINITY;
        }
        this.selectedIndices[slot] = sourceIndex;
        this.selectedDistances[slot] = distanceSquared;
        break;
      }
    }

    this.lights.forEach((light, slot) => {
      const sourceIndex = this.selectedIndices[slot] ?? -1;
      const source = sourceIndex >= 0 ? sources[sourceIndex] : undefined;
      if (!source) {
        light.position.copy(viewer);
        light.intensity = 0;
        return;
      }

      const distance = Math.sqrt(this.selectedDistances[slot] ?? 0);
      const fadeStart = source.range * 0.68;
      const fadeRange = Math.max(0.001, source.range - fadeStart);
      const fadeProgress = THREE.MathUtils.clamp((distance - fadeStart) / fadeRange, 0, 1);
      const distanceFade = 1 - fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
      light.position.copy(source.position);
      light.color.copy(source.color);
      light.distance = source.range;
      light.intensity = source.intensity * distanceFade;
    });
  }

  public getDiagnostics(): LightPoolDiagnostics {
    return {
      lights: this.lights.length,
      visibleLights: this.lights.filter((light) => light.visible).length,
      activeLights: this.lights.filter((light) => light.intensity > 0.001).length,
    };
  }
}
