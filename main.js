const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_LEVEL = 300;

const OBSTACLE_SIZE = 40;
const BIRD_SIZE = 40;

const CHARACTER_SIZE_X = 120;
const CHARACTER_SIZE_Y = 160;

const CHARACTER_POSITION_X = 50;

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

class Character extends Entity {
  constructor(x, y) {
    super(x, y, CHARACTER_SIZE_X, CHARACTER_SIZE_Y, CHARACTER_IMAGE);
    this.jumpVelocity = 0;
    this.trail = [];
  }
}

class Bird extends Entity {
  constructor(x, speed) {
    super(x, GROUND_LEVEL - CHARACTER_SIZE_X, BIRD_SIZE, BIRD_SIZE, BIRD_IMAGE);
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }
}

class Obstacle extends Entity {
  constructor(x, speed) {
    super(x, GROUND_LEVEL, OBSTACLE_SIZE, OBSTACLE_SIZE, OBSTACLE_IMAGE);
    this.speed = speed;
  }
  update() {
    this.x -= this.speed;
}

class Game {
  constructor(context) {
    this.context = context;
    this.character = new Character(CHARACTER_POSITION_X, GROUND_LEVEL);
    this.entities = [this.character];
    this.score = 0;
    this.speed = 5;
    this.play = true; 
  }
}

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const game = new Game(context);
