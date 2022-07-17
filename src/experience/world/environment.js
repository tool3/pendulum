import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import Experience from '../experience';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.envMap;
    this.debug = this.experience.debug;
    this.world = this.experience.world;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: 'env' });
      this.debugObject = {
        background: '#100f10',
        useEnvMap: false
      };
    }

    if (this.resources.sources.length && this.resource) {
      this.setEnvMap();
    }

    this.setSunLight();
    this.setSpotLight();
    // this.setAreaLight();
  }

  setSpotLight() {
    this.spotLight = new THREE.SpotLight('#ffffff', 10);
    this.spotLight.castShadow = true;
    this.spotLight.power = 200;
    this.spotLight.scale.set(0.1, 0.1, 0.1);
    this.spotLight.distance = 30;
    this.spotLight.shadow.camera.far = 100;
    this.spotLight.shadow.normalBias = 0.05;
    this.spotLight.penumbra = 1;
    this.spotLight.position.set(0, 5, -13);
    this.spotLight.target = this.world.plane.mesh;
    this.scene.add(this.spotLight);
    this.spotlightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(this.spotlightHelper);
    if (this.debugFolder) {
      this.debugFolder.addInput(this.spotLight, 'intensity', { label: 'spotLight', min: 0, max: 100 });
    }
  }

  setAreaLight() {
    this.spotLight = new THREE.SpotLight('#ffffff', 10);
    this.spotLight.castShadow = true;
    this.spotLight.power = 200;
    this.spotLight.scale.set(0.1, 0.1, 0.1);
    this.spotLight.distance = 30;
    this.spotLight.shadow.camera.far = 100;
    this.spotLight.shadow.normalBias = 0.05;
    this.spotLight.penumbra = 1;
    this.spotLight.position.set(18, 0, 0);
    this.spotLight.target = this.world.plane.mesh;
    this.scene.add(this.spotLight);
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.intensity = 10;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.background = this.debugObject?.background || '#100f10';
    this.scene.add(this.sunLight);

    if (this.debugFolder) {
      this.debugFolder.addInput(this.sunLight, 'intensity', { label: 'sunlight', min: 0, max: 100 });
      const background = this.debugFolder.addInput(this.scene, 'background', { view: 'color' });
      background.on('change', (val) => {
        this.scene.background = new THREE.Color(val.value);
      });
    }
  }

  setEnvMap() {
    this.envMap = {};
    this.envMap.intensity = 0.3;
    this.envMap.texture = this.resource;
    this.envMap.texture.encoding = THREE.sRGBEncoding;
    this.scene.environment = this.envMap.texture;

    this.envMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.envMap.texture;
          child.material.envMapIntensity = this.envMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    if (this.debugFolder) {
      this.debugFolder.addInput(this.envMap, 'intensity', { label: 'envMapIntensity', min: 0.01, max: 10.0, step: 0.001 }).on('change', (val) => {
        this.envMap.updateMaterials();
      });
      this.debugFolder.addButton({ title: 'use env map' }).on('click', (val) => {
        this.debugObject.useEnvMap = !this.debugObject.useEnvMap;
        if (this.debugObject.useEnvMap) {
          this.scene.background = this.resource;
        } else {
          this.scene.background = this.debugObject.background;
        }
      });
    }

    this.envMap.updateMaterials();
  }

  update() {
    // this.spotlightHelper.update();
    // this.areaLightHelper.update();
  }
}
