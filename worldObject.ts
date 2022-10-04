class WorldObject {
  _x = 0;
  _y = 0;
  _w = 0;
  _h = 0;

  constructor(x: number, y: number, w: number, h: number) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
  }

  protected draw(ctx: CanvasRenderingContext2D, color: string) {}
}

export { WorldObject };
