import { Drivable } from "./drivable";
import { Sensor, segment } from "./Sensor";
import { getIntersection, Intersection, createNuralNet, lerp } from "./utility";
import { Network } from "./network";

class Car extends Drivable {
  type: "AI" | "DUMMY" | "PLAYER";
  damaged = false;
  brain?: Network;

  static count = 0;
  id = 0;
  _sensor: Sensor = new Sensor(this);

  constructor(x: number, y: number, type: "AI" | "DUMMY" | "PLAYER") {
    super(x, y, 10, 20, 1, 0.5);
    this.type = type;
    Car.count++;
    this.id = Car.count;

    if (type == "PLAYER") {
      this._controler.setKeyBoardControlers();
    }

    if (type == "AI" || type == "DUMMY") {
      this.brain = createNuralNet(
        localStorage,
        this._sensor.rayCount + 1,
        Math.round(
          lerp(
            this._sensor.rayCount + 1,
            this._sensor.rayCount + 20,
            Math.random()
          )
        ),
        4,
        Math.round(lerp(2, 10, Math.random()))
      );
    }

    if (this.type == "DUMMY") {
      this.MAX_SPEED = 0.5;
    }
  }

  update(ctx: CanvasRenderingContext2D, segments: segment[]) {
    this.colitionDetection(segments);
    if (!this.damaged) {
      this.updatePosition();
      this._sensor.update(segments);

      if (this.brain) {
        let output = this.brain.forward([
          ...this._sensor.readings.map((r) => (r == null ? 0 : 1 - r.offset)),
          this.speed / this.MAX_SPEED,
        ]);
        let con = 0;

        let pow = 3;

        output.forEach((v) => {
          con += Math.pow(2, pow) * v;
          pow--;
        });

        this._controler.setState(con);
      }
    } else {
      // this.stop();
    }

    let color = "#A52A2A";
    if (this.type == "PLAYER") {
      color = "#0073e6";
    }
    if (this.type == "AI") {
      color = "#00e673";
    }
    if (this.type == "DUMMY") {
      color = "#A52A2A";
    }
    if (this.damaged) color = "#737373";

    if (!this.damaged && this.type == "PLAYER") this._sensor.draw(ctx);
    this.draw(ctx, color);
  }

  private colitionDetection(segments: segment[]): void {
    for (let i = 0; i < segments.length; i++) {
      for (let j = 0; j < this.coords.length; j++) {
        let collition = getIntersection(segments[i], {
          start: this.coords[j],
          end: this.coords[(j + 1) % this.coords.length],
        });

        if (collition) this.collitionManage(collition);
      }
    }
  }

  private collitionManage(collition: Intersection) {
    this.damaged = true;
  }
}

export { Car };
