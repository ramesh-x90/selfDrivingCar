import { WorldObject } from "./worldObject";
import { Geom } from "./Geom";
import { lerp } from "./utility";

type coord = { x: number; y: number };
type segment = {
  start: coord;
  end: coord;
};

class RoadPice extends WorldObject {
  _x2 = 0;
  _y2 = 0;
  _x3 = 0;
  _y3 = 0;
  _x4 = 0;
  _y4 = 0;
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
  }

  getBundingBox() {
    let box = [
      [this._x, this._y],
      [this._x2, this._y2],
      [this._x3, this._y3],
      [this._x4, this._y4],
    ];

    return box;
  }
  getIntersectionSegments(): segment[] {
    return [];
  }
  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(this._x, this._y);

    let [, ...box] = this.getBundingBox();

    box.forEach((coord, index) => {
      ctx.lineTo(coord[0], coord[1]);
    });
    ctx.closePath();
    ctx.fill();
  }
}

class VRoadPice extends RoadPice {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this._x2 = x + w;
    this._y2 = y;
    this._x3 = x + w;
    this._y3 = y + h;
    this._x4 = x;
    this._y4 = y + h;
  }

  getIntersectionSegments(): segment[] {
    return [
      { start: { x: this._x, y: this._y }, end: { x: this._x4, y: this._y4 } },
      {
        start: { x: this._x2, y: this._y2 },
        end: { x: this._x3, y: this._y3 },
      },
    ];
  }
}

class HRoadPice extends RoadPice {
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this._x2 = x + h;
    this._y2 = y;
    this._x3 = x + h;
    this._y3 = y + w;
    this._x4 = x;
    this._y4 = y + w;
  }

  getIntersectionSegments(): segment[] {
    return [
      { start: { x: this._x, y: this._y }, end: { x: this._x2, y: this._y2 } },
      {
        start: { x: this._x4, y: this._y4 },
        end: { x: this._x3, y: this._y3 },
      },
    ];
  }
}

class CurvedRoad {
  _x1 = 0;
  _y1 = 0;
  _x2 = 0;
  _y2 = 0;
  _x3 = 0;
  _y3 = 0;
  _x4 = 0;
  _y4 = 0;
  _r = 0;
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this._x3 = x3;
    this._y3 = y3;
    this._r = Geom.findDistence(this._x1, this._y1, this._x2, this._y2);

    let [slop, c] = Geom.findLineEq(this._x1, this._y1, this._x3, this._y3);

    [this._x4, this._y4] = Geom.imageOfaPoint(this._x2, this._y2, slop, c);
  }
  draw(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(this._x1, this._y1);
    ctx.arcTo(this._x2, this._y2, this._x3, this._y3, this._r);
    ctx.lineTo(this._x4, this._y4);
    ctx.fill();
  }

  getIntersectionSegments(): segment[] {
    return [
      {
        start: { x: this._x1, y: this._y1 },
        end: { x: this._x3, y: this._y3 },
      },
    ];
  }
}

class RoadManager {
  startX = 10;
  startY = 110;
  w = 120;
  h = 700;

  laneCount = 5;

  roadParts: RoadPice[] = [];
  curvedRoadParts: CurvedRoad[] = [];

  boarderColor = "";

  constructor(boarderColor: string = "#333333") {
    this.boarderColor = boarderColor;

    //rect parts
    this.roadParts.push(
      new VRoadPice(this.startX, this.startY, this.w, this.h)
    );
    this.roadParts.push(
      new HRoadPice(this.startX + this.w, this.startY - this.w, this.w, this.h)
    );
    this.roadParts.push(
      new VRoadPice(this.startX + this.h + this.w, this.startY, this.w, this.h)
    );
    this.roadParts.push(
      new HRoadPice(this.startX + this.w, this.startY + this.h, this.w, this.h)
    );

    //curved parts

    this.curvedRoadParts.push(
      new CurvedRoad(
        this.startX,
        this.startY,
        this.startX,
        this.startY - this.w,
        this.startX + this.w,
        this.startY - this.w
      )
    );

    this.curvedRoadParts.push(
      new CurvedRoad(
        this.roadParts[1]._x2,
        this.roadParts[1]._y2,
        this.roadParts[2]._x2,
        this.roadParts[1]._y2,
        this.roadParts[2]._x2,
        this.roadParts[2]._y2
      )
    );
    this.curvedRoadParts.push(
      new CurvedRoad(
        this.roadParts[2]._x3,
        this.roadParts[2]._y3,
        this.roadParts[2]._x3,
        this.roadParts[3]._y3,
        this.roadParts[3]._x3,
        this.roadParts[3]._y3
      )
    );
    this.curvedRoadParts.push(
      new CurvedRoad(
        this.roadParts[3]._x4,
        this.roadParts[3]._y4,
        this.roadParts[0]._x4,
        this.roadParts[3]._y4,
        this.roadParts[0]._x4,
        this.roadParts[0]._y4
      )
    );
  }
  draw(ctx: CanvasRenderingContext2D): void {
    this.roadParts.forEach((roadItem) => {
      roadItem.draw(ctx, this.boarderColor);
    });

    this.curvedRoadParts.forEach((item) => {
      item.draw(ctx, this.boarderColor);
    });
  }

  getIntersectionSegments(): segment[] {
    let rectRoadIntSegs: segment[] = [];

    this.roadParts.forEach((item) => {
      rectRoadIntSegs.push(...item.getIntersectionSegments());
    });

    this.curvedRoadParts.forEach((item) => {
      rectRoadIntSegs.push(...item.getIntersectionSegments());
    });

    return rectRoadIntSegs;
  }

  getAspawnLocation() {
    let i = 0;

    let randLane =
      (Math.round(Math.random() * this.laneCount) % (this.laneCount - 1)) + 1;

    let x = lerp(
      this.roadParts[i]._x,
      this.roadParts[i]._x2,
      randLane / this.laneCount
    );

    let y = lerp(
      this.roadParts[i]._y,
      this.roadParts[i]._y4,
      Math.round(Math.random() * 30) / 30
    );

    return { x, y };
  }
}

export { RoadManager };
