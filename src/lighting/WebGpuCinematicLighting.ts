import * as THREE from 'three/webgpu';
import { vec3 } from 'three/tsl';

export class WebGpuCinematicLighting {
  public readonly group = new THREE.Group();
  private readonly rimLight: THREE.SpotLight;
  private readonly capeFill: THREE.PointLight;
  private readonly target = new THREE.Object3D();
  private readonly environmentNode = vec3(0.055, 0.078, 0.074);
  private readonly scene: THREE.Scene;
  private readonly rimOffset = new THREE.Vector3(-2.8, 4.7, 3.2);
  private readonly targetOffset = new THREE.Vector3(0, 1.05, 0);
  private readonly fillOffset = new THREE.Vector3(0, 1.4, 0.85);

  public constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group.name = 'Cinematic fill lighting';
    const hemisphere = new THREE.HemisphereLight(0x789c91, 0x170c09, 0.36);
    const ambient = new THREE.AmbientLight(0x50756e, 0.15);
    this.rimLight = new THREE.SpotLight(0x72cdbf, 13, 15, 0.63, 0.9, 1.5);
    this.rimLight.target = this.target;
    this.capeFill = new THREE.PointLight(0xc93b2b, 2.8, 4.5, 2);
    this.group.add(hemisphere, ambient, this.rimLight, this.target, this.capeFill);

    // Avoid runtime PMREM generation on the WebGPU device. Three.js currently
    // tracks intermittent Dawn device losses around its WebGPU PMREM path. A
    // constant environment node retains low-level PBR fill and the reflections
    // control without submitting the unstable texture preprocessing job.
    scene.environment = null;
    scene.environmentNode = this.environmentNode;
    scene.environmentIntensity = 0.24;
  }

  public update(playerPosition: THREE.Vector3, time: number): void {
    this.rimLight.position.copy(playerPosition).add(this.rimOffset);
    this.target.position.copy(playerPosition).add(this.targetOffset);
    this.capeFill.position.copy(playerPosition).add(this.fillOffset);
    this.capeFill.intensity = 2.6 + Math.sin(time * 1.7) * 0.18;
  }

  public dispose(): void {
    if (this.scene.environmentNode === this.environmentNode) {
      this.scene.environmentNode = null;
    }
  }
}
