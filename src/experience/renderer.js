import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Experience from './experience';

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    this.usePostprocess = true;

    if (this.debug.active) {
      console.log(this.debug);
      this.debugFolder = this.debug.ui.addFolder({
        title: 'renderer'
      });
    }

    this.setInstance();
    this.setPostProcess();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas
    });

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  setPostProcess() {
    this.postProcess = {};
    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(1);
    this.darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance);

    // Bloom pass
    this.postProcess.unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      1,
      0.0,
      0
    );
    this.postProcess.unrealBloomPass.enabled = true;
    this.postProcess.unrealBloomPass.tintColor = {};
    this.postProcess.unrealBloomPass.tintColor.value = '#b1a884';
    this.postProcess.unrealBloomPass.tintColor.instance = new THREE.Color(
      this.postProcess.unrealBloomPass.tintColor.value
    );

    this.postProcess.unrealBloomPass.compositeMaterial.uniforms.uTintColor = {
      value: this.postProcess.unrealBloomPass.tintColor.instance
    };
    this.postProcess.unrealBloomPass.compositeMaterial.uniforms.uTintStrength = { value: 0.205 };
    this.postProcess.unrealBloomPass.compositeMaterial.fragmentShader = `
varying vec2 vUv;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;
uniform sampler2D dirtTexture;
uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];
uniform vec3 uTintColor;
uniform float uTintStrength;

float lerpBloomFactor(const in float factor) {
    float mirrorFactor = 1.2 - factor;
    return mix(factor, mirrorFactor, bloomRadius);
}

void main() {
    vec4 color = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
        lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
        lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
        lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
        lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );

    color.rgb = mix(color.rgb, uTintColor, uTintStrength);
    gl_FragColor = color;
}
        `;

    if (this.debug.active) {
      const debugFolder = this.debugFolder.addFolder({
        title: 'UnrealBloomPass'
      });

      debugFolder.addInput(this.postProcess.unrealBloomPass, 'enabled', {});
      debugFolder.addInput(this.postProcess.unrealBloomPass, 'strength', { min: 0, max: 3, step: 0.001 });
      debugFolder.addInput(this.postProcess.unrealBloomPass, 'radius', { min: 0, max: 1, step: 0.001 });
      debugFolder.addInput(this.postProcess.unrealBloomPass, 'threshold', { min: 0, max: 1, step: 0.001 });

      debugFolder
        .addInput(this.postProcess.unrealBloomPass.tintColor, 'value', { view: 'uTintColor', label: 'color' })
        .on('change', () => {
          this.postProcess.unrealBloomPass.tintColor.instance.set(this.postProcess.unrealBloomPass.tintColor.value);
        });

      debugFolder.addInput(this.postProcess.unrealBloomPass.compositeMaterial.uniforms.uTintStrength, 'value', {
        label: 'uTintStrength',
        min: 0,
        max: 1,
        step: 0.001
      });
    }

    /**
     * Effect composer
     */
    const RenderTargetClass = this.sizes.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget;
    this.renderTarget = new RenderTargetClass(this.sizes.width, this.sizes.height, {
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      encoding: THREE.sRGBEncoding
    });
    this.postProcess.composer = new EffectComposer(this.instance);
    this.postProcess.composer.renderToScreen = false;

    this.postProcess.composer.setSize(this.sizes.width, this.sizes.height);
    this.postProcess.composer.setPixelRatio(this.sizes.pixelRatio);

    this.postProcess.composer.addPass(this.postProcess.renderPass);
    this.postProcess.composer.addPass(this.postProcess.unrealBloomPass);
    console.log(this.postProcess.composer.renderTarget2);
    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.postProcess.composer.renderTarget2.texture }
        },
        vertexShader: `
        varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
        `,
        fragmentShader: `
			uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}
        `,
        defines: {}
      }),
      'baseTexture'
    );
    finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer(this.instance);
    this.finalComposer.addPass(this.postProcess.renderPass);
    this.finalComposer.addPass(finalPass);
  }

  darkenNonBloomed(obj) {
    this.materials = {};
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material;
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (this.usePostprocess) {
      this.postProcess.composer.render();
      this.scene.traverse((child) => this.darkenNonBloomed(child));
      this.finalComposer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
