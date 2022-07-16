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
    this.setDebug();
  }

  setModel() {
    this.model = this.resource.scene;
    this.animations = this.resource.animations;
    this.model.scale.set(0.4, 0.4, 0.4);
    this.model.position.set(0, -10, -10);

    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        if (child.material.name !== 'metal') {
          child.material.emissiveIntensity = 1;
          child.material.emissive = new THREE.Color('#fb8b23');
        }
      }
    });

    this.model.position.copy(this.camera.instance.position);
    // this.model.rotation.copy(this.camera.instance.rotation);
    this.model.translateZ(-40);
    this.model.translateY(-28);
    this.model.updateMatrix();

    this.camera.instance.position.y = 30;
    this.camera.instance.position.z = -120;
    this.camera.controls.target.set(0, -13, -9);
    this.camera.controls.maxPolarAngle = Math.PI / 2 - 0.1;
  }

  setDebug() {
    this.debugObject = {
      speed: 2,
      swing: false
    };
    if (this.debug.active) {
      this.debugFolder.addInput(this.debugObject, 'speed', { min: 0.00001, max: 10, step: 0.001 });
      this.debugFolder.addButton({ title: 'swing' }).on('click', () => {
        this.debugObject.swing = !this.debugObject.swing;
      });
    }
  }

  setAnimation() {}

  update() {
    this.model.children.forEach((child, index) => {
      const amplitude = (3 - 0.4) / 2;
      const time = this.time.getElapsedTime() * this.debugObject.speed;
      const i = index * this.rate;
      child.rotation.z = (amplitude / 3) * Math.sin(i + time * 1.5);
    });

    this.rate += 0.001;

    if (this.debugObject.swing) {
      const amplitude = (3 - 0.4) / 2;
      this.camera.instance.rotation.y = (amplitude / 30) * Math.cos(this.rate + this.time.getElapsedTime());
    }
  }
}
