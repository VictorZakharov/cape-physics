import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Loop,
  atan,
  cameraPosition,
  dFdx,
  dFdy,
  exp,
  float,
  floor,
  fract,
  fwidth,
  max,
  mix,
  modelWorldMatrix,
  oneMinus,
  positionLocal,
  sin,
  smoothstep,
  uniform,
  uniformArray,
  uv,
  varying,
  vec2,
  vec3,
  vec4,
} from 'three/tsl';
import { RIPPLE_CAPACITY } from '../config';

export interface ProceduralWaterMaterial {
  readonly material: THREE.MeshBasicNodeMaterial;
  readonly timeNode: THREE.UniformNode<'float', number>;
}

export function createProceduralWaterMaterial(
  ripples: readonly THREE.Vector4[],
  minimumAlpha: number,
  maximumAlpha: number,
): ProceduralWaterMaterial {
  const timeNode = uniform(0);
  const rippleNodes = uniformArray<'vec4'>([...ripples], 'vec4');
  const deepColor = uniform(new THREE.Color(0x031820));
  const shallowColor = uniform(new THREE.Color(0x185652));
  const fogColor = uniform(new THREE.Color(0x071012));

  const rippleHeight = Fn<[THREE.Node<'vec2'>], THREE.Node<'float'>>(
    ([worldPosition]) => {
      const height = float(0).toVar();
      Loop(RIPPLE_CAPACITY, ({ i }) => {
        const ripple = rippleNodes.element(i);
        const age = timeNode.sub(ripple.z);
        If(age.greaterThan(0).and(age.lessThan(4)), () => {
          const distanceToImpact = worldPosition.sub(ripple.xy).length();
          const front = oneMinus(smoothstep(
            age.mul(2.1).sub(0.1),
            age.mul(2.1).add(0.2),
            distanceToImpact,
          ));
          const wake = sin(distanceToImpact.mul(13).sub(age.mul(13.5)));
          const fade = exp(age.mul(-0.86)).mul(exp(distanceToImpact.mul(-0.48)));
          height.addAssign(wake.mul(fade).mul(front).mul(ripple.w));
        });
      });
      return height;
    },
  );

  const surfaceHeight = Fn<[THREE.Node<'vec2'>], THREE.Node<'float'>>(
    ([worldPosition]) => rippleHeight(worldPosition).add(
      sin(worldPosition.x.mul(2.4).add(timeNode.mul(0.7)))
        .mul(THREE.TSL.cos(worldPosition.y.mul(2.1).sub(timeNode.mul(0.55))))
        .mul(0.0025),
    ),
  );

  const flatWorldPosition = modelWorldMatrix.mul(vec4(positionLocal, 1)).xyz;
  const wave = surfaceHeight(flatWorldPosition.xz);
  const slopeEpsilon = 0.035;
  const slope = varying(vec2(
    surfaceHeight(flatWorldPosition.xz.add(vec2(slopeEpsilon, 0)))
      .sub(wave)
      .div(slopeEpsilon),
    surfaceHeight(flatWorldPosition.xz.add(vec2(0, slopeEpsilon)))
      .sub(wave)
      .div(slopeEpsilon),
  ), 'waterSlope');
  const displacedPosition = positionLocal.add(vec3(0, 0, wave));
  const worldPosition = varying(
    modelWorldMatrix.mul(vec4(displacedPosition, 1)).xyz,
    'waterWorldPosition',
  );
  const waveVarying = varying(wave, 'waterWave');

  const hash = Fn<[THREE.Node<'vec2'>], THREE.Node<'float'>>(
    ([point]) => fract(sin(point.dot(vec2(127.1, 311.7))).mul(43_758.545_312_3)),
  );
  const valueNoise = Fn<[THREE.Node<'vec2'>], THREE.Node<'float'>>(
    ([point]) => {
      const cell = floor(point);
      const local = fract(point);
      const eased = local.mul(local).mul(vec2(3).sub(local.mul(2)));
      const a = hash(cell);
      const b = hash(cell.add(vec2(1, 0)));
      const c = hash(cell.add(vec2(0, 1)));
      const d = hash(cell.add(vec2(1, 1)));
      return mix(mix(a, b, eased.x), mix(c, d, eased.x), eased.y);
    },
  );
  const microGradient = Fn<[THREE.Node<'vec2'>], THREE.Node<'vec2'>>(
    ([point]) => {
      const firstDirection = vec2(0.828_849, 0.559_473);
      const secondDirection = vec2(-0.419_058, 0.907_959);
      const thirdDirection = vec2(0.970_142, -0.240_035);
      const first = THREE.TSL.cos(
        point.dot(firstDirection).mul(4.1).add(timeNode.mul(1.18)),
      ).mul(0.019);
      const second = THREE.TSL.cos(
        point.dot(secondDirection).mul(7.7).sub(timeNode.mul(1.62)),
      ).mul(0.011);
      const third = THREE.TSL.cos(
        point.dot(thirdDirection).mul(13.4).add(timeNode.mul(2.05)),
      ).mul(0.005);
      const breakup = mix(
        0.72,
        1.18,
        valueNoise(point.mul(1.8).add(vec2(timeNode.mul(0.08), timeNode.mul(-0.05)))),
      );
      return firstDirection.mul(first)
        .add(secondDirection.mul(second))
        .add(thirdDirection.mul(third))
        .mul(breakup);
    },
  );

  const centered = uv().mul(2).sub(1);
  const angle = atan(centered.y, centered.x);
  const irregularEdge = sin(angle.mul(5)).mul(0.035)
    .add(sin(angle.mul(9)).mul(0.025))
    .add(0.91);
  const edgeDistance = centered.length();
  const edgeAntialias = max(
    fwidth(edgeDistance.sub(irregularEdge)).mul(1.5),
    0.002,
  );
  const alphaEdge = oneMinus(smoothstep(
    irregularEdge.sub(0.09).sub(edgeAntialias),
    irregularEdge.add(edgeAntialias),
    edgeDistance,
  ));

  const detailGradient = microGradient(worldPosition.xz);
  const normal = vec3(
    slope.x.add(detailGradient.x).negate(),
    1,
    slope.y.add(detailGradient.y).negate(),
  ).normalize();
  const viewDirection = cameraPosition.sub(worldPosition).normalize();
  const viewFacing = normal.dot(viewDirection).clamp(0, 1);
  const fresnel = oneMinus(viewFacing).pow(5).mul(0.975).add(0.025);
  const torchDirection = vec3(-0.35, 0.72, 0.48).normalize();
  const halfDirection = viewDirection.add(torchDirection).normalize();
  const dx = dFdx(normal);
  const dy = dFdy(normal);
  const normalVariance = max(dx.dot(dx), dy.dot(dy));
  const roughness = normalVariance.mul(0.38).add(0.11).clamp(0.11, 0.28);
  const alphaSquared = roughness.mul(roughness);
  const normalDotHalf = max(normal.dot(halfDirection), 0);
  const denominator = normalDotHalf.mul(normalDotHalf)
    .mul(alphaSquared.sub(1))
    .add(1);
  const specularRaw = alphaSquared.div(
    max(denominator.mul(denominator).mul(Math.PI), 0.0001),
  );
  const specular = specularRaw.div(specularRaw.add(1));
  const mineralGlint = max(
    sin(worldPosition.x.mul(1.7).add(worldPosition.z.mul(0.8))),
    0,
  ).pow(16);
  const depthTint = smoothstep(0.2, 0.92, edgeDistance);
  const waterBody = mix(deepColor, shallowColor, depthTint.mul(0.24));
  const caveReflection = mix(
    vec3(0.012, 0.048, 0.072),
    vec3(0.075, 0.22, 0.26),
    normal.y.mul(0.5).add(0.5),
  );
  const waterColor = mix(
    waterBody,
    caveReflection,
    fresnel.mul(0.58).add(0.025).clamp(0, 0.68),
  )
    .add(
      vec3(1, 0.38, 0.075)
      .mul(specular)
      .mul(max(normal.dot(torchDirection), 0))
      .mul(1.45),
    )
    .add(vec3(0.15, 0.9, 0.76).mul(mineralGlint).mul(fresnel).mul(0.16))
    .add(vec3(0.58, 0.92, 0.9).mul(waveVarying.abs()).mul(0.9));
  const wetRim = smoothstep(0.73, 0.93, edgeDistance)
    .mul(oneMinus(smoothstep(0.93, 1, edgeDistance)));
  const rimmedWaterColor = waterColor.add(
    vec3(0.08, 0.2, 0.2).mul(wetRim).mul(0.16),
  );
  const distanceToCamera = cameraPosition.sub(worldPosition).length();
  const fogFactor = oneMinus(exp(distanceToCamera.mul(distanceToCamera).mul(-0.0032)));

  const material = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: false,
  });
  material.positionNode = displacedPosition;
  material.colorNode = mix(rimmedWaterColor, fogColor, fogFactor);
  material.opacityNode = alphaEdge.mul(mix(minimumAlpha, maximumAlpha, fresnel));
  material.maskNode = alphaEdge.greaterThanEqual(0.015);
  material.name = 'TSL procedural ripple water';

  return { material, timeNode };
}
