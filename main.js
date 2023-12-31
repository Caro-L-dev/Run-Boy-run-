const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_LEVEL = 300;

const OBSTACLE_SIZE = 40;
const BIRD_SIZE = 40;
const CHARACTER_SIZE = 80;

const CHARACTER_POSITION_X = 50;

const GROUND_COLOR = "green";
const SKY_COLOR = "skyblue";
const SCORE_COLOR = "black";
const TRAIL_COLOR = "white";
const GAME_OVER_MSG_COLOR = "#78350f";

const CHARACTER_IMAGE = new Image();
CHARACTER_IMAGE.src = "chara.png";

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

    //draw collide box
    // context.strokeStyle = "#ff000050";
    // context.lineWidth = 2;
    // context.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Character extends Entity {
  constructor(x, y) {
    super(x, y, CHARACTER_SIZE, CHARACTER_SIZE, CHARACTER_IMAGE);
    this.jumpVelocity = 0;
    this.trail = [];
  }
  update() {
    this.y += this.jumpVelocity;
    this.jumpVelocity += 1;

    if (this.y > GROUND_LEVEL) {
      this.y = GROUND_LEVEL;
      this.jumpVelocity = 0;
    }

    this.trail.forEach((trail) => {
      trail.x -= 5;
    });

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 20) {
      this.trail.shift();
    }
  }

  draw(context) {
    context.fillStyle = TRAIL_COLOR;
    this.trail.forEach((position) => {
      context.fillRect(
        position.x + this.width / 2,
        position.y + this.height / 2,
        5,
        5
      );
    });
    super.draw(context);
  }

  jump() {
    if (this.y === GROUND_LEVEL) {
      this.jumpVelocity = -20;
    }
  }
}

class Bird extends Entity {
  constructor(x, speed) {
    super(x, GROUND_LEVEL - CHARACTER_SIZE, BIRD_SIZE, BIRD_SIZE, BIRD_IMAGE);
    this.speed = speed;

    this.time = 0;
  }

  update() {
    this.x -= this.speed;

    this.y += Math.sin(this.time) * 2;
    this.time += 0.1;
  }
}

class Obstacle extends Entity {
  constructor(x, speed) {
    super(
      x,
      GROUND_LEVEL + OBSTACLE_SIZE,
      OBSTACLE_SIZE,
      OBSTACLE_SIZE,
      OBSTACLE_IMAGE
    );
    this.speed = speed;
  }
  update() {
    this.x -= this.speed;
  }
}

const collides = (entity1, entity2) => {
  return (
    entity1.x < entity2.x + entity2.width &&
    entity1.x + entity1.width > entity2.x &&
    entity1.y < entity2.y + entity2.height &&
    entity1.y + entity1.height > entity2.y
  );
};

class Game {
  constructor(context) {
    this.context = context;
    this.character = new Character(CHARACTER_POSITION_X, GROUND_LEVEL);
    this.entities = [this.character];
    this.score = 0;
    this.speed = 5;
    this.play = true;

    this.spawnObstacle();

    document.addEventListener("keydown", () => {
      this.character.jump();
    });

    this.scoreInterval = setInterval(() => {
      this.increaseScore();
    }, 100);
    this.speedInterval = setInterval(() => {
      this.increaseSpeed();
    }, 1000);
  }

  increaseScore() {
    this.score++;
  }

  increaseSpeed() {
    this.speed += 0.1;
  }

  spawnObstacle() {
    if (Math.random() < 0.5) {
      this.entities.push(new Obstacle(GAME_WIDTH, this.speed));
    } else {
      this.entities.push(new Bird(GAME_WIDTH, this.speed));
    }

    setTimeout(() => {
      if (this.play) {
        this.spawnObstacle();
      }
    }, Math.max(500, 2000 - this.speed * 20));
  }

  update() {
    this.context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.context.fillStyle = SKY_COLOR;
    this.context.fillRect(0, 0, GAME_WIDTH, GROUND_LEVEL + CHARACTER_SIZE);

    this.drawScore();
    this.context.fillStyle = GROUND_COLOR;
    this.context.fillRect(
      0,
      GROUND_LEVEL + CHARACTER_SIZE,
      GAME_WIDTH,
      GAME_HEIGHT - (GROUND_LEVEL + CHARACTER_SIZE)
    );

    this.entities.forEach((entity) => {
      entity.update();
      entity.draw(this.context);
    });

    const isCollides = this.entities.some((entity) => {
      if (entity === this.character) return false;
      return collides(this.character, entity);
    });

    if (isCollides) {
      this.play = false;
      clearInterval(this.scoreInterval);
      clearInterval(this.speedInterval);

      const rectWidth = GAME_WIDTH / 2;
      const rectHeight = 60;
      const rectX = GAME_WIDTH / 4;
      const rectY = GAME_HEIGHT / 2 - rectHeight / 2;

      const cornerRadius = 10;

      // Dessiner le rectangle avec des coins arrondis
      this.context.fillStyle = GAME_OVER_MSG_COLOR;
      this.context.beginPath();
      this.context.moveTo(rectX + cornerRadius, rectY);
      this.context.lineTo(rectX + rectWidth - cornerRadius, rectY);
      this.context.arcTo(
        rectX + rectWidth,
        rectY,
        rectX + rectWidth,
        rectY + cornerRadius,
        cornerRadius
      );
      this.context.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
      this.context.arcTo(
        rectX + rectWidth,
        rectY + rectHeight,
        rectX + rectWidth - cornerRadius,
        rectY + rectHeight,
        cornerRadius
      );
      this.context.lineTo(rectX + cornerRadius, rectY + rectHeight);
      this.context.arcTo(
        rectX,
        rectY + rectHeight,
        rectX,
        rectY + rectHeight - cornerRadius,
        cornerRadius
      );
      this.context.lineTo(rectX, rectY + cornerRadius);
      this.context.arcTo(
        rectX,
        rectY,
        rectX + cornerRadius,
        rectY,
        cornerRadius
      );
      this.context.closePath();
      this.context.fill();

      // Dessiner le message au centre du rectangle
      this.context.font = "24px Rocher";
      this.context.fillStyle = "white";

      const text = "GAME OVER DUDE!";
      const textWidth = this.context.measureText(text).width;
      const textX = rectX + (rectWidth - textWidth) / 2;
      const textY = rectY + rectHeight / 2 + 10;

      this.context.fillText(text, textX, textY);
    }
  }

  drawScore() {
    this.context.font = "20px Arial";
    this.context.fillStyle = SCORE_COLOR;
    this.context.fillText(`Score: ${this.score}`, 10, 30);
  }
}

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const game = new Game(context);

const frame = () => {
  if (game.play) {
    game.update();
    requestAnimationFrame(frame);
  }
};

requestAnimationFrame(frame);
