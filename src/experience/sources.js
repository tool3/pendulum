import { TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default [
  {
    name: 'pendulum',
    path: ['models/pendulum.glb'],
    loader: GLTFLoader
  },
  {
    name: 'normal',
    path: ['textures/normal.png'],
    loader: TextureLoader
  },

];
