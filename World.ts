import { Car } from "./car";
import { RoadManager } from "./road";
import { CarsManager } from "./CarsManager";

class World {
  roadM = new RoadManager();
  private ctx: CanvasRenderingContext2D;
  carManager = new CarsManager(1000, this.roadM);

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  render() {
    let ctx = this.ctx;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.roadM.draw(ctx);

    this.carManager.updateAllCars(ctx);
  }
}

export { World };
