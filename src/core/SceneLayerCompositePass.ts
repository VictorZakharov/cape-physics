import * as THREE from 'three';
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js';

const compositeVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const compositeFragmentShader = /* glsl */ `
  uniform sampler2D tWorld;
  uniform sampler2D tLayer;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 world = texture2D(tWorld, vUv);
    vec4 layer = texture2D(tLayer, vUv);
    float layerAlpha = layer.a * uOpacity;
    vec3 color = world.rgb * (1.0 - layerAlpha) + layer.rgb * uOpacity;
    gl_FragColor = vec4(color, world.a);
  }
`;

export class SceneLayerCompositePass extends Pass {
  private readonly layerTarget: THREE.WebGLRenderTarget;
  private readonly material: THREE.ShaderMaterial;
  private readonly quad: FullScreenQuad;
  private readonly savedClearColor = new THREE.Color();

  public constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
    private readonly layer: number,
  ) {
    super();
    this.layerTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      depthBuffer: true,
      stencilBuffer: false,
    });
    this.layerTarget.texture.name = 'Character fade layer';
    this.layerTarget.samples = 2;
    this.material = new THREE.ShaderMaterial({
      name: 'Depth-resolved character composite',
      uniforms: {
        tWorld: { value: null },
        tLayer: { value: this.layerTarget.texture },
        uOpacity: { value: 1 },
      },
      vertexShader: compositeVertexShader,
      fragmentShader: compositeFragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new FullScreenQuad(this.material);
  }

  public setOpacity(opacity: number): void {
    this.material.uniforms.uOpacity!.value = THREE.MathUtils.clamp(opacity, 0, 1);
  }

  public getOpacity(): number {
    return this.material.uniforms.uOpacity!.value as number;
  }

  public override setSize(width: number, height: number): void {
    this.layerTarget.setSize(width, height);
  }

  public override render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
  ): void {
    const previousLayerMask = this.camera.layers.mask;
    const previousBackground = this.scene.background;
    const previousClearAlpha = renderer.getClearAlpha();
    const previousShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    const previousRenderTarget = renderer.getRenderTarget();
    renderer.getClearColor(this.savedClearColor);

    try {
      this.camera.layers.set(this.layer);
      this.scene.background = null;
      renderer.shadowMap.autoUpdate = false;
      renderer.setRenderTarget(this.layerTarget);
      renderer.setClearColor(0x000000, 0);
      renderer.clear(true, true, false);
      renderer.render(this.scene, this.camera);
    } finally {
      this.camera.layers.mask = previousLayerMask;
      this.scene.background = previousBackground;
      renderer.shadowMap.autoUpdate = previousShadowAutoUpdate;
      renderer.setClearColor(this.savedClearColor, previousClearAlpha);
      renderer.setRenderTarget(previousRenderTarget);
    }

    this.material.uniforms.tWorld!.value = readBuffer.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    if (this.clear) renderer.clear();
    this.quad.render(renderer);
  }

  public override dispose(): void {
    this.layerTarget.dispose();
    this.material.dispose();
    this.quad.dispose();
  }
}
