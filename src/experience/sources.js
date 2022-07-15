import { TextureLoader, CubeTextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default [
  {
    name: 'envMap',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg'
    ],
    loader: CubeTextureLoader
  },
  {
    name: 'pendulum',
    path: ['models/pendulum.glb'],
    loader: GLTFLoader
  },
  {
    name: 'normal',
    path: ['textures/surface_normal.jpg'],
    loader: TextureLoader
  },
  {
    name: 'roughness',
    path: ['textures/surface_roughness.jpg'],
    loader: TextureLoader
  },

];
