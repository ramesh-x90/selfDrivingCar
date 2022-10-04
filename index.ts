import { World } from "./World";
import { saveNetwork } from "./utility";

let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let world = new World(ctx);

let button: HTMLButtonElement = document.getElementById(
  "saveButton"
) as HTMLButtonElement;
button.addEventListener("click", (e) => {
  let maxX = Math.max(...world.carManager.carList.map((car) => car._x));

  let bestCar = world.carManager.carList.find(
    (car) =>
      !car.damaged && car._x > maxX - 10 && car.type == "AI" && car.speed != 0
  );

  if (bestCar?.brain) saveNetwork(localStorage, bestCar.brain);
});

let tHnd: number = setInterval(render, 10, ctx);
function render(ctx: CanvasRenderingContext2D) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  world.render();
}
