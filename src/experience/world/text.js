import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import Experience from '../experience';
import gsap from 'gsap';

export default class Text {
  constructor(text) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.font;
    this.text = text;

    this.setGeometry();
    this.setTextures();
    this.setMaterials();
    this.setMesh();
    this.setAnimation();
  }

  setGeometry() {
    this.geometry = new TextGeometry(this.text.toUpperCase(), {
      font: this.resource,
      size: 9,
      height: 0.2,
      curveSegments: 200,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
  }

  setTextures() {
    this.textures = {};
  }

  setMaterials() {
    this.material = new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 1,
      color: 0xffffff
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(23, -9.9, 0);
    this.mesh.rotateY(Math.PI / 2);
    this.mesh.rotateY(Math.PI / 2);
    this.scene.add(this.mesh);
  }

  setAnimation() {
    gsap.from(this.camera.instance.position, { z: -1, ease: 'expo.out', duration: 3 })
  }
}
