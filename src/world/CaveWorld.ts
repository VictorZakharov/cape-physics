import * as THREE from 'three';
import { CAVE } from '../config';
import type { SurfaceTextures } from '../graphics/proceduralTextures';
import type { WorldSphereCollider } from '../physics/colliders';
import { SeededRandom, periodicFbm } from '../utils/random';
import { CaveColliderBuilder } from './CaveColliderBuilder';
import { caveCeiling, caveCenterX, caveHalfWidth, floorHeightAt } from './caveProfile';
import { createSpeleothemGeometry } from './SpeleothemGeometry';

export class CaveWorld {
  public readonly group = new THREE.Group();
  public readonly cameraColliders: THREE.Object3D[];
  public readonly worldColliders: readonly WorldSphereCollider[];

  private readonly walls: THREE.Mesh;
  private readonly floor: THREE.Mesh;
  private readonly colliderBuilder = new CaveColliderBuilder();

  public constructor(textures: SurfaceTextures) {
    this.group.name = 'Procedural cave';
    this.walls = this.createWalls(textures);
    this.floor = this.createFloor(textures);
    this.group.add(this.walls, this.floor);
    this.createFormations(textures);
    this.createRockScatter(textures);
    this.cameraColliders = [this.walls];
    this.worldColliders = this.colliderBuilder.colliders;
  }

  private createMaterial(textures: SurfaceTextures, wet = false): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      map: textures.color,
      normalMap: textures.normal,
      normalScale: new THREE.Vector2(wet ? 0.72 : 1.05, wet ? 0.72 : 1.05),
      roughnessMap: textures.roughness,
      roughness: wet ? 0.58 : 0.91,
      metalness: wet ? 0.08 : 0.015,
      color: wet ? 0x67716e : 0x7b7b73,
    });
    return material;
  }

  private createWalls(textures: SurfaceTextures): THREE.Mesh {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const { segments, radialSegments, startZ, endZ } = CAVE;

    for (let segment = 0; segment <= segments; segment += 1) {
      const progress = segment / segments;
      const z = THREE.MathUtils.lerp(startZ, endZ, progress);
      const centerX = caveCenterX(z);
      const ceiling = caveCeiling(z);
      const centerY = ceiling * 0.5 - 0.25;
      const verticalRadius = ceiling * 0.5 + 0.45;
      const horizontalRadius = caveHalfWidth(z);

      for (let radial = 0; radial <= radialSegments; radial += 1) {
        const around = radial / radialSegments;
        const angle = around * Math.PI * 2;
        const detail = periodicFbm(progress * 11.5, around * 8, 8, 0x782f) - 0.5;
        const ridges = Math.sin(z * 0.42 + angle * 5.0) * 0.12;
        const displacement = detail * 0.72 + ridges;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        positions.push(
          centerX + cos * (horizontalRadius + displacement),
          centerY + sin * (verticalRadius + displacement * 0.66),
          z,
        );
        uvs.push(around * 4, progress * 16);
      }
    }

    const stride = radialSegments + 1;
    for (let segment = 0; segment < segments; segment += 1) {
      for (let radial = 0; radial < radialSegments; radial += 1) {
        const a = segment * stride + radial;
        const b = a + stride;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    const material = this.createMaterial(textures);
    material.side = THREE.BackSide;
    material.normalScale.set(-1.05, -1.05);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Cave shell';
    mesh.receiveShadow = true;
    return mesh;
  }

  private createFloor(textures: SurfaceTextures): THREE.Mesh {
    const widthSegments = 36;
    const lengthSegments = 180;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let lengthIndex = 0; lengthIndex <= lengthSegments; lengthIndex += 1) {
      const progress = lengthIndex / lengthSegments;
      const z = THREE.MathUtils.lerp(CAVE.startZ, CAVE.endZ, progress);
      const center = caveCenterX(z);
      const halfWidth = caveHalfWidth(z) * 1.015;
      for (let widthIndex = 0; widthIndex <= widthSegments; widthIndex += 1) {
        const across = widthIndex / widthSegments;
        const x = center + (across * 2 - 1) * halfWidth;
        positions.push(x, floorHeightAt(x, z), z);
        uvs.push(across * 5, progress * 18);
      }
    }

    const stride = widthSegments + 1;
    for (let row = 0; row < lengthSegments; row += 1) {
      for (let column = 0; column < widthSegments; column += 1) {
        const a = row * stride + column;
        const b = a + stride;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    const mesh = new THREE.Mesh(geometry, this.createMaterial(textures, true));
    mesh.name = 'Wet cave floor';
    mesh.receiveShadow = true;
    return mesh;
  }

  private createFormations(textures: SurfaceTextures): void {
    const random = new SeededRandom(0x5ca1e);
    const material = this.createMaterial(textures, true);
    material.color.multiplyScalar(0.9);
    material.roughness = 0.64;
    const variantGeometries = [0x51a1, 0x51a2, 0x51a3].map(createSpeleothemGeometry);
    const ceilingFormations = variantGeometries.map((geometry, variant) => {
      const mesh = new THREE.InstancedMesh(geometry, material, 18);
      mesh.name = `Stalactites organic variant ${variant + 1}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    });
    const attachmentGeometry = new THREE.DodecahedronGeometry(0.38, 1);
    const attachments = new THREE.InstancedMesh(attachmentGeometry, material, 82);
    attachments.name = 'Flowstone formation collars';
    attachments.castShadow = true;
    attachments.receiveShadow = true;

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();
    const attachmentPosition = new THREE.Vector3();
    const attachmentScale = new THREE.Vector3();
    for (let index = 0; index < 54; index += 1) {
      const z = random.range(CAVE.endZ + 2, CAVE.startZ - 2);
      const spread = random.range(-0.92, 0.92);
      const x = caveCenterX(z) + caveHalfWidth(z) * spread;
      position.set(x, caveCeiling(z) - Math.abs(spread) * 0.65, z);
      quaternion.setFromEuler(new THREE.Euler(random.range(-0.12, 0.12), random.range(0, Math.PI), random.range(-0.12, 0.12)));
      scale.set(random.range(0.55, 1.6), random.range(0.55, 2.25), random.range(0.55, 1.6));
      matrix.compose(position, quaternion, scale);
      const variant = index % ceilingFormations.length;
      this.colliderBuilder.addSpeleothem(variantGeometries[variant]!, matrix);
      ceilingFormations[variant]?.setMatrixAt(Math.floor(index / ceilingFormations.length), matrix);
      attachmentPosition.copy(position);
      attachmentPosition.y -= 0.08;
      attachmentScale.set(
        scale.x * random.range(0.9, 1.35),
        random.range(0.2, 0.38),
        scale.z * random.range(0.9, 1.35),
      );
      matrix.compose(attachmentPosition, quaternion, attachmentScale);
      attachments.setMatrixAt(index, matrix);
      this.colliderBuilder.addCollar(attachmentPosition, attachmentScale);
    }
    ceilingFormations.forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
      this.group.add(mesh);
    });

    const floorCounts = [10, 9, 9];
    const floorGeometries = variantGeometries.map((geometry) => {
      const floorGeometry = geometry.clone();
      floorGeometry.rotateZ(Math.PI);
      return floorGeometry;
    });
    const floorFormations = floorGeometries.map((geometry, variant) => {
      const mesh = new THREE.InstancedMesh(geometry, material, floorCounts[variant] ?? 0);
      mesh.name = `Stalagmites organic variant ${variant + 1}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    });
    const floorCursors = [0, 0, 0];
    for (let index = 0; index < 28; index += 1) {
      const z = random.range(CAVE.endZ + 2, CAVE.startZ - 2);
      const side = random.next() > 0.5 ? 1 : -1;
      const x = caveCenterX(z) + side * caveHalfWidth(z) * random.range(0.7, 0.94);
      position.set(x, floorHeightAt(x, z), z);
      quaternion.setFromEuler(new THREE.Euler(random.range(-0.08, 0.08), random.range(0, Math.PI), random.range(-0.08, 0.08)));
      scale.set(random.range(0.55, 1.35), random.range(0.45, 1.75), random.range(0.55, 1.35));
      matrix.compose(position, quaternion, scale);
      const variant = index % floorFormations.length;
      this.colliderBuilder.addSpeleothem(floorGeometries[variant]!, matrix);
      const cursor = floorCursors[variant] ?? 0;
      floorFormations[variant]?.setMatrixAt(cursor, matrix);
      floorCursors[variant] = cursor + 1;
      attachmentPosition.copy(position);
      attachmentPosition.y += 0.06;
      attachmentScale.set(
        scale.x * random.range(0.86, 1.25),
        random.range(0.18, 0.34),
        scale.z * random.range(0.86, 1.25),
      );
      matrix.compose(attachmentPosition, quaternion, attachmentScale);
      attachments.setMatrixAt(54 + index, matrix);
      this.colliderBuilder.addCollar(attachmentPosition, attachmentScale);
    }
    floorFormations.forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
      this.group.add(mesh);
    });
    attachments.instanceMatrix.needsUpdate = true;
    this.group.add(attachments);
  }

  private createRockScatter(textures: SurfaceTextures): void {
    const random = new SeededRandom(0xb01de7);
    const geometry = new THREE.DodecahedronGeometry(0.42, 1);
    const material = this.createMaterial(textures, true);
    material.color.multiplyScalar(0.72);
    const rocks = new THREE.InstancedMesh(geometry, material, 72);
    rocks.name = 'Rock scatter';
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();

    for (let index = 0; index < rocks.count; index += 1) {
      const z = random.range(CAVE.endZ + 1.5, CAVE.startZ - 1.5);
      const side = random.next() > 0.5 ? 1 : -1;
      const x = caveCenterX(z) + side * caveHalfWidth(z) * random.range(0.64, 0.94);
      position.set(x, floorHeightAt(x, z) + random.range(0.02, 0.12), z);
      quaternion.setFromEuler(new THREE.Euler(random.range(0, Math.PI), random.range(0, Math.PI), random.range(0, Math.PI)));
      scale.set(random.range(0.25, 1.25), random.range(0.18, 0.72), random.range(0.35, 1.4));
      matrix.compose(position, quaternion, scale);
      rocks.setMatrixAt(index, matrix);
      this.colliderBuilder.addRock(geometry, matrix);
    }
    rocks.instanceMatrix.needsUpdate = true;
    this.group.add(rocks);
  }
}
