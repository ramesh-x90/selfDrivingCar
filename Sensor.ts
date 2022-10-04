import { Drivable } from "./drivable";
import { lerp, getIntersection, Intersection, segment } from "./utility";

type coord = { x: number; y: number };

class Ray {
  start: coord;
  end: coord;

  constructor(start: coord, end: coord) {
    this.start = start;
    this.end = end;
  }
}

class Sensor {
  obj: Drivable;
  rayCount = 8;
  rayLength = 30;
  raySpred = Math.PI * 0.6;
  rays: Ray[] = [];
  _segments: segment[] = [];

  readings: (Intersection | undefined)[] = [];

  constructor(drivable: Drivable) {
    this.obj = drivable;
  }

  update(segments: segment[]) {
    this._segments = segments;
    this.rays = [];
    this.castRays();
    this.takeReadings();
  }

  private castRays() {
    for (let i = 0; i < this.rayCount; i++) {
      let rayAngle =
        lerp(-this.raySpred / 2, this.raySpred / 2, i / (this.rayCount - 1)) +
        this.obj.angle;
      let start = { x: this.obj._x, y: this.obj._y };
      let end = {
        x: this.obj._x + Math.sin(rayAngle) * this.rayLength,
        y: this.obj._y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push(new Ray(start, end));
    }
  }

  private takeReadings() {
    this.rays.forEach((ray, index) => {
      let intersec = this.scann(ray);
      this.readings[index] = intersec;
    });
  }

  scann(ray: Ray): Intersection | undefined {
    let intersections: Intersection[] = [];
    this._segments.forEach((seg) => {
      let intersection = getIntersection(
        { start: ray.start, end: ray.end },
        seg
      );
      if (intersection) {
        intersections.push(intersection);
      }
    });

    if (intersections.length == 0) return undefined;

    let minOffset = Math.min(...intersections.map((i) => i.offset));
    let intersection = intersections.find((i) => i.offset == minOffset);

    return intersection;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.readings.forEach((intersection, index) => {
      ctx.beginPath();
      ctx.strokeStyle = "#cc0000";

      ctx.moveTo(this.rays[index].start.x, this.rays[index].start.y);

      if (intersection) {
        ctx.lineTo(intersection.x, intersection.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#00e600";
        ctx.moveTo(intersection.x, intersection.y);
        ctx.lineTo(this.rays[index].end.x, this.rays[index].end.y);
        ctx.stroke();
      } else {
        ctx.lineTo(this.rays[index].end.x, this.rays[index].end.y);
        ctx.stroke();
      }
    });
  }
}

export { Sensor, segment };
