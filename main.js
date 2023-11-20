const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_LEVEL = 300;

const OBSTACLE_SIZE = 40;
const BIRD_SIZE = 40;
const CHARACTER_SIZE_X = 120;
const CHARACTER_SIZE_Y = 160;

const CHARACTER_IMAGE = new Image();
CHARACTER_IMAGE.src = "robot.png";

const BIRD_IMAGE = new Image();
BIRD_IMAGE.src = "bird.png";

const OBSTACLE_IMAGE = new Image();
OBSTACLE_IMAGE.src = "cactus.png";

class Entity {
  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);

    context.strokeStyle = "#ff000050";
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(context) {
    this.context = context;

    const entityTest = new Entity(
      50,
      50,
      CHARACTER_SIZE_X,
      CHARACTER_SIZE_Y,
      CHARACTER_IMAGE
    );
    entityTest.draw(this.context);
    setInterval(() => {
      entityTest.draw(this.context);
    }, 100);
  }
}

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const game = new Game(context);
