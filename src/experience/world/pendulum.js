import * as THREE from 'three';
import Experience from '../experience';

export default class Pendulum {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.rate = 0;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: 'pendulum' });
    }

    this.resource = this.resources.items.pendulum;
    // this.setAnimation();
    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.animations = this.resource.animations;
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.position.set(0, -10, -10);
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        if (child.material.name !== 'metal') {
          child.material.emissiveIntensity = 0.5;
          child.material.emissive = new THREE.Color('#fb8b23');
        } else {
          // child.material.metalness 
          console.log(child.material);
        }
      }
    });
  }

  setAnimation() {
    if (this.debug.active) {
    }
  }

  update() {
    this.model.children.forEach((child, index) => {
      const time = this.time.getElapsedTime() * 2;
      const i = index * this.rate;
      child.rotation.z = Math.sin(i + time);
    });

    this.rate += 0.0001;
  }
}
