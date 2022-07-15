import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import Experience from '../experience';

export default class Text {
  constructor(text) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.font;
    this.text = text;

    this.setGeometry();
    this.setTextures();
    this.setMaterials();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new TextGeometry(this.text, {
      font: this.resource,
      size: 10,
      height: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4
    });
  }

  setTextures() {
    this.textures = {};
    // this.textures.normal = this.resources.items.normal;
  }

  setMaterials() {
    this.material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      displacementScale: 0.2,
      color: 0xff00ff
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, -10, 0);
    this.mesh.rotateY(Math.PI / 2);
    this.mesh.rotateY(Math.PI / 2);
    this.scene.add(this.mesh);
  }
}
