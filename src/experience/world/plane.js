import * as THREE from 'three';
import Experience from '../experience';

export default class Plane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterials();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
  }

  setTextures() {
    this.textures = {};
    this.textures.normal = this.resources.items.normal;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterials() {
    this.material = new THREE.MeshPhysicalMaterial({
      normalMap: this.textures.normal,
      displacementScale: 0.1,
      color: 'black',
      roughness: 0.3,
      metalness: 0
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.set(0, -3.5, -15)
    this.scene.add(this.mesh);
  }
}
