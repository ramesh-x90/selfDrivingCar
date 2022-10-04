import { WorldObject } from "./worldObject";
import { Controler } from "./Controler";

type coord = { x: number; y: number };

type segment = {
  start: coord;
  end: coord;
};

class Drivable extends WorldObject {
  speed = 0;
  angle = 0;
  direction = 0;
  MAX_SPEED = 5;
  MAX_REVERSED_SPEED = 3;
  acc = 0.1;
  dAngle = 0.05;
  dacc = 0.1;

  _controler: Controler;

  coords: { x: number; y: number }[] = [];

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    maxSpeed: number = 5,
    maxReversedSpeed = 3
  ) {
    super(x, y, w, h);
    this._controler = new Controler();
    this.MAX_SPEED = maxSpeed;
    this.MAX_REVERSED_SPEED = maxReversedSpeed;
  }

  setKeyBoardControllers() {
    this._controler.setKeyBoardControlers();
  }

  moveTo(toX: number, toY: number): void {
    this._x = toX;
    this._y = toY;
  }

  stop(): void {
    this.speed = 0;
  }

  isMoving(): boolean {
    let moving = this.speed == 0 ? false : true;
    return moving;
  }

  setCntroler(carControler: Controler): void {
    this._controler = carControler;
  }

  private setDirectionForward(): void {
    this.direction = 1;
  }

  private setDirectionBackWord(): void {
    this.direction = -1;
  }

  protected updatePosition() {
    let res = this._controler.getState();

    if (this.speed == 0) this.direction = 0;

    if (res == 0 || !(res & 0b1011) || !(res & 0b1110)) {
      if (this.speed > 0) {
        this.speed -= this.dacc;
        if (this.speed < 0) this.speed = 0;
      }
    }

    if (res & 0b1000) {
      //MOVE W
      this.setDirectionForward();

      this.speed += this.acc;
      if (this.speed > this.MAX_SPEED) this.speed = this.MAX_SPEED;
    }

    if (res & 0b0100) {
      //MOVE A
    }

    if ((res & 0b1000 && res & 0b0100) || (res & 0b0010 && res & 0b0001)) {
      if (this.speed > 0) {
        this.angle -= this.dAngle;
      }
    }

    if ((res & 0b0010 && res & 0b0100) || (res & 0b1000 && res & 0b0001)) {
      if (this.speed > 0) {
        this.angle += this.dAngle;
      }
    }

    if (res & 0b0010) {
      //MOVE S
      this.setDirectionBackWord();

      this.speed -= this.acc;
      if (this.speed < this.MAX_REVERSED_SPEED)
        this.speed = this.MAX_REVERSED_SPEED;
    }

    if (res & 0b1000 && res & 0b0010) {
      this.speed = 0;
    }
    this._y -= this.direction * this.speed * Math.cos(this.angle);
    this._x += this.direction * this.speed * Math.sin(this.angle);

    this.coords = [];

    let rad = Math.hypot(this._w, this._h) / 2;
    let alpha = Math.atan2(this._w, this._h);
    this.coords.push({
      x: this._x + Math.sin(this.angle - alpha) * rad,
      y: this._y - Math.cos(this.angle - alpha) * rad,
    });
    this.coords.push({
      x: this._x + Math.sin(this.angle + alpha) * rad,
      y: this._y - Math.cos(this.angle + alpha) * rad,
    });
    this.coords.push({
      x: this._x + Math.sin(this.angle + Math.PI - alpha) * rad,
      y: this._y - Math.cos(this.angle + Math.PI - alpha) * rad,
    });
    this.coords.push({
      x: this._x + Math.sin(this.angle + Math.PI + alpha) * rad,
      y: this._y - Math.cos(this.angle + Math.PI + alpha) * rad,
    });
  }

  protected draw(ctx: CanvasRenderingContext2D, color: string): void {
    // ctx.save();
    // ctx.fillStyle = color;
    // ctx.translate(this._x, this._y);
    // ctx.rotate(this.angle);
    // ctx.beginPath();
    // ctx.rect(-this._w / 2, -this._h / 2, this._w, this._h);
    ctx.beginPath();
    ctx.fillStyle = color;
    this.coords.forEach((coord, index) => {
      if (index == 0) {
        ctx.moveTo(coord.x, coord.y);
      } else {
        ctx.lineTo(coord.x, coord.y);
      }
    });

    ctx.fill();
    // ctx.restore();
  }

  getIntersectionSegments(): segment[] {
    let segments: segment[] = [];

    for (let i = 0; i < this.coords.length; i++) {
      segments.push({
        start: { x: this.coords[i].x, y: this.coords[i].y },
        end: {
          x: this.coords[(i + 1) % this.coords.length].x,
          y: this.coords[(i + 1) % this.coords.length].y,
        },
      });
    }
    return segments;
  }
}

export { Drivable };
