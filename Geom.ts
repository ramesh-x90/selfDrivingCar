class Geom {
  static findDistence(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  static getSinTheta(opp: number, hyp: number): number {
    return opp / hyp;
  }

  static findLineEq(x1: number, y1: number, x2: number, y2: number) {
    let slop = (y1 - y2) / (x1 - x2);
    let c = y1 - slop * x1;
    return [slop, c];
  }

  static imageOfaPoint(x: number, y: number, slop: number, c: number) {
    let A = [
      [slop, 1],
      [-1, slop],
    ];

    let det = 1 + Math.pow(slop, 2);

    let exp = [y - x * slop - 2 * c, x + slop * y];

    let xy_metri: number[] = [];

    A.forEach((value, index) => {
      xy_metri[index] = value[0] * exp[0] + value[1] * exp[1];
    });

    xy_metri = xy_metri.map((value) => value / det);

    return xy_metri;
  }
}

export { Geom };
