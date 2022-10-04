import { Drivable } from "./drivable";

class Controler {
  direction = 0b0000; //wasd

  constructor() {}

  setKeyBoardControlers() {
    this.registerKeyBoardListners();
  }

  private registerKeyBoardListners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "w":
          this.direction |= 0b1000;
          break;

        case "a":
          this.direction |= 0b0100;
          break;

        case "s":
          this.direction |= 0b0010;
          break;

        case "d":
          this.direction |= 0b0001;
          break;

        default:
          break;
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "w":
          this.direction &= 0b0111;
          break;

        case "a":
          this.direction &= 0b1011;
          break;

        case "s":
          this.direction &= 0b1101;
          break;

        case "d":
          this.direction &= 0b1110;
          break;

        default:
          break;
      }
    });
  }

  getState() {
    return this.direction;
  }

  setState(state: number) {
    if (state <= (state & 0b1111) && state >= (state & 0b0000)) {
      this.direction = state;
    }
  }
}

export { Controler };
