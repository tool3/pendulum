import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

import Experience from '../experience';

export default class Plane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterials();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
  }

  setTextures() {
    this.textures = {};
    this.textures.normal = this.resources.items.normal;
    this.textures.normal.repeat.set(2, 2);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;

    this.textures.roughness = this.resources.items.roughness;
    this.textures.roughness.repeat.set(2, 2);
    this.textures.roughness.wrapS = THREE.RepeatWrapping;
    this.textures.roughness.wrapT = THREE.RepeatWrapping;
  }

  setMaterials() {
    const displacementShader = {
      uniforms: {
        tDiffuse: { value: null },
        uNormalMap: { value: this.textures.normal }
      },
      vertexShader: `
            varying vec2 vUv;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vUv = uv;
            }
            `,
      fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform sampler2D uNormalMap;

            varying vec2 vUv;

            void main() {
                vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
                vec2 newUv = vUv + normalColor.xy * 0.1;
                vec4 color = texture2D(tDiffuse, newUv);

                vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
                float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
                color += lightness;

                gl_FragColor = color;
            }
            `
    };
    this.material = new THREE.MeshPhysicalMaterial({
      normalMap: this.textures.normal,
      roughnessMap: this.textures.roughness,
      reflectivity: 1,
      specular: 0xffffff,
      shininess: 100,
      roughness: 0,
      normalScale: new THREE.Vector2(1, 1),
      metalness: 0,
      displacementScale: 0.2,
      color: 0x000000
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.rotation.z = -Math.PI * 0.5;
    this.mesh.position.set(0, -10, -15);
    this.mesh.scale.set(5, 5, 5);
    this.mesh.material.opacity = 0;

    // this.mirror = new Reflector(this.geometry, {
    //   clipBias: 0.003,
    //   textureWidth: window.innerWidth * window.devicePixelRatio,
    //   textureHeight: window.innerHeight * window.devicePixelRatio,
    //   color: 0x777777
    // });

    // this.mirror.rotation.copy(this.mesh.rotation);
    // this.mirror.position.copy(this.mesh.position);
    // this.mesh.position.y -= 0.1;
    // this.mirror.scale.copy(this.mesh.scale);
    // this.mirror.material = new THRE();
    // this.mirror.rotateX(-Math.PI / 2);D
    // this.mirror.position.y = 0.1;
    // this.mirror.material.transparent = true;
    // this.mirror.material.alpha = 0.1;
    // this.mirror.material.map = this.resources.items.normal;

    // this.mirror.position.y -= 0.3;
    // this.mirror.mirror = 1;
    // mirror={1} blur={[500, 100]} mixBlur={12} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position-y={-0.8}

    this.scene.add(this.mesh);

    // this.helper = new THREE.PlaneHelper(this.geometry, 1, 0xffff00);
    // this.scene.add(this.helper);
    // this.scene.add(this.mirror);
  }
}
