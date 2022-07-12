import Experience from '../experience';
import Environment from './environment';
import Pendulum from './pendulum';
import Plane from './plane';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    if (this.resources.sources.length) {
      this.resources.on('ready', () => {
        this.setupObjects();
      });
    } else {
      this.setupObjects();
    }
  }

  setupObjects() {
    this.plane = new Plane();
    this.pendulum = new Pendulum();
    this.environment = new Environment();
  }

  update() {
    if (this.pendulum) {
      this.pendulum.update();
      this.environment.update();
    }
  }
}
