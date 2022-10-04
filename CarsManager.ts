import { RoadManager } from "./road";
import { Car } from "./car";

type coord = { x: number; y: number };

type segment = {
  start: coord;
  end: coord;
};

class CarsManager {
  roadManager: RoadManager;
  carList: Car[] = [];
  constructor(carCount: number, roadManager: RoadManager) {
    this.roadManager = roadManager;

    for (let i = 0; i < carCount; i++) {
      let { x, y } = roadManager.getAspawnLocation();

      let duplicate = this.carList.find((car) => car._x == x && car._y == y);
      // if (duplicate) {
      //   continue;
      // }
      if (i % 100 == 0) {
        this.carList.push(new Car(x, y, "PLAYER"));
      } else this.carList.push(new Car(x, y, "AI"));
    }
  }

  private getAllCarsIntersectionSegments(currentCar: Car): segment[] {
    let segs: segment[] = [];
    if (currentCar.type == "PLAYER") return segs;
    this.carList.forEach((car) => {
      if (car.id != currentCar.id && car.type != "AI" && !car.damaged)
        segs.push(...car.getIntersectionSegments());
    });

    return segs;
  }

  updateAllCars(ctx: CanvasRenderingContext2D) {
    this.carList.forEach((car) => {
      car.update(ctx, [
        ...this.roadManager.getIntersectionSegments(),
        ...this.getAllCarsIntersectionSegments(car),
      ]);
    });
  }
}

export { CarsManager };
