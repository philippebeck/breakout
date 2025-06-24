'use strict';

//! ********** CONSTANTS **********

//! CANVAS
const canvas = document.getElementById("breakout");
const ctx = canvas.getContext("2d");

//! BALL
const BALL_RADIUS = 10;
const BALL_SPEED = 5;

const BALL_BACKGROUND_COLOR = "Crimson";
const BALL_COLOR = "FireBrick";

//! PADDLE
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;
const PADDLE_SPEED = 7;

const PADDLE_BACKGROUND_COLOR = "RoyalBlue";
const PADDLE_COLOR = "MidnightBlue";

//! BRICKS
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 50;
const BRICK_ROW_COUNT = 3;
const BRICK_COLUMN_COUNT = 6;

const BRICK_WIDTH = 100;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 20;

const BRICK_BACKGROUND_COLOR = "LimeGreen";
const BRICK_COLOR = "DarkGreen";

const bricks = [];

//! INTERFACE
const INTERFACE_FONT = "16px Arial";
const INTERFACE_COLOR = "DodgerBlue";

//! ********** VARIABLES **********

//! CANVAS
let x = canvas.width / 2;
let y = canvas.height - 30;

//! BALL
let ballX = BALL_SPEED;
let ballY = -BALL_SPEED;

//! PADDLE
let paddleX = (canvas.width - PADDLE_WIDTH) / 2;

let isRightPressed = false;
let isLeftPressed = false;

//! INTERFACE
let lives = 3;
let score = 0;

//! ********** FUNCTIONS **********

//! EVENT LISTENERS

/**
 * ? KEY DOWN HANDLER
 * Handles the keydown event for the arrow keys.
 * Sets the isRightPressed or isLeftPressed flag to true
 * when the corresponding arrow key is pressed.
 * 
 * @param {KeyboardEvent} e - The keydown event.
 */
function keyDownHandler(e) {
  if (e.code === "ArrowRight") isRightPressed = true;
  else if (e.code === "ArrowLeft") isLeftPressed = true;
}

/**
 * ? KEY UP HANDLER
 * Handles the keyup event for the arrow keys.
 * Sets the isRightPressed or isLeftPressed flag to false
 * when the corresponding arrow key is released.
 * 
 * @param {KeyboardEvent} e - The keyup event.
 */
function keyUpHandler(e) {
  if (e.code === "ArrowRight") isRightPressed = false;
  else if (e.code === "ArrowLeft") isLeftPressed = false;
}

/**
 * ? MOUSE MOVE HANDLER
 * Handles the mousemove event.
 * Updates the paddleX coordinate by taking the relativeX position
 * of the mouse & subtracting half of the PADDLE_WIDTH to center
 * the paddle.
 * 
 * @param {MouseEvent} e - The mousemove event.
 */
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;

  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - PADDLE_WIDTH / 2;
  }
}

/**
 * ? ADD LISTENERS
 * Attaches event listeners to the document for handling keyboard 
 * and mouse events.
 * Listens for keydown and keyup events to update paddle movement
 * flags, and mousemove events to update the paddle's position.
 */
function addListeners() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
}

//! ELEMENTS

/**
 * ? DRAW BALL
 * Draws the ball on the canvas at the current x & y coordinates.
 * Uses the current BALL_RADIUS for the size, & fills the ball with
 * the specified fillStyle color.
 */
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);

  ctx.fillStyle = BALL_BACKGROUND_COLOR;
  ctx.strokeStyle = BALL_COLOR;

  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

/**
 * ? DRAW PADDLE
 * Draws the paddle on the canvas at the current paddleX & paddleY coordinates.
 * Uses the current PADDLE_WIDTH & PADDLE_HEIGHT for the size, & fills the paddle with
 * the specified fillStyle color.
 */
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

  ctx.fillStyle = PADDLE_BACKGROUND_COLOR;
  ctx.strokeStyle = PADDLE_COLOR;

  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

/**
 * ? DRAW BRICKS
 * Draws all the bricks on the canvas.
 * Each brick is drawn at a fixed position from the top left corner of the canvas,
 * using the current BRICK_WIDTH & BRICK_HEIGHT for the size, & fills the brick with
 * the specified fillStyle color.
 */
function drawBricks() {
  for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
    for (let row = 0; row < BRICK_ROW_COUNT; row++) {

      if (bricks[col][row].status === 1) {
        let brickX = col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
        let brickY = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;

        bricks[col][row].x = brickX;
        bricks[col][row].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);

        ctx.fillStyle = BRICK_BACKGROUND_COLOR;
        ctx.strokeStyle = BRICK_COLOR;

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

/**
 * ? DRAW SCORE
 * Renders the current score on the canvas at a fixed position.
 * The score is displayed using a specified font & color.
 */
function drawScore() {
  ctx.font = INTERFACE_FONT;
  ctx.fillStyle = INTERFACE_COLOR;

  ctx.fillText("🎯 = " + score, 8, 20);
}

/**
 * ? DRAW LIVES
 * Renders the current number of lives remaining on the canvas at a fixed position.
 * The lives are displayed using a specified font & color.
 */
function drawLives() {
  ctx.font = INTERFACE_FONT;
  ctx.fillStyle = INTERFACE_COLOR;

  ctx.fillText("❤️ x " + lives, canvas.width - 65, 20);
}

//! LOGIC

/**
 * ? INIT BRICKS
 * Initializes the bricks array.
 * Each element of the array is an object with properties x, y, and status.
 * The x and y properties are the coordinates of the brick, and the status
 * property is a boolean indicating whether the brick is active (1) or not (0).
 */
function initBricks() {
  for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    bricks[c] = [];
  
    for (let r = 0; r < BRICK_ROW_COUNT; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

/**
 * ? COLLISION DETECTION
 * Checks for collisions between the ball & the bricks.
 * If a collision is detected, the ball's ballY value is negated
 * to reverse the direction of the ball, & the brick's status
 * is set to 0 to remove it from the game.
 */
function collisionDetection() {
  for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for (let r = 0; r < BRICK_ROW_COUNT; r++) {

      let b = bricks[c][r];

      if (b.status === 1) {
        if (x > b.x && x < b.x + BRICK_WIDTH && y > b.y && y < b.y + BRICK_HEIGHT) {

          ballY = -ballY;
          b.status = 0;
          score++;

          if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
            alert("C'est gagné, Bravo!");
            document.location.reload();
          }
        }
      }
    }
  }
}

/**
 * ? MANAGE BOTTOM IMPACT
 * Manages the impact of the ball on the bottom of the canvas.
 * If the ball hits the paddle, the ball's ballY value is negated
 * to reverse the direction of the ball.
 * If the ball hits the bottom of the canvas, the lives counter is decremented,
 * & if the lives counter hits 0, the game is over & the user is prompted
 * to reload the page.
 * Otherwise, the ball is reset to the center of the canvas, the paddle is reset
 * to the center of the canvas, & the ball's direction is reset to its initial
 * state.
 */
function manageBottomImpact() {
  if (y + ballY > canvas.height - BALL_RADIUS) {

    if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
      ballY = -ballY;

    } else {
      lives--;

      if (!lives) {
        alert("GAME OVER");
        document.location.reload();

      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;

        ballX = BALL_SPEED;
        ballY = -BALL_SPEED;

        paddleX = (canvas.width - PADDLE_WIDTH) / 2;
      }
    }
  }
}

/**
 * ? UPDATE BALL
 * Updates the ball's position based on its ballX and ballY velocity components.
 * Checks for collisions with the top and sides of the canvas, and reverses the
 * direction of the ball when a collision is detected.
 * Checks for collisions with the bottom of the canvas, and calls manageBottomImpact
 * to handle the impact.
 */
function updateBall() {
  x += ballX;
  y += ballY;

  if (y + ballY < BALL_RADIUS) {
    ballY = -ballY;

  } else if (y + ballY > canvas.height - BALL_RADIUS) {
    manageBottomImpact();
  }

  if (x + ballX > canvas.width - BALL_RADIUS || x + ballX < BALL_RADIUS) {
    ballX = -ballX;
  }
}

/**
 * ? UPDATE PADDLE
 * Updates the paddle's position.
 * If the isRightPressed flag is true & the paddle is not at the right edge of the canvas,
 * the paddle is moved to the right by PADDLE_SPEED.
 * If the isLeftPressed flag is true & the paddle is not at the left edge of the canvas,
 * the paddle is moved to the left by PADDLE_SPEED.
 */
function updatePaddle() {
  if (isRightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
    paddleX += PADDLE_SPEED;

  } else if (isLeftPressed && paddleX > 0) {
    paddleX -= PADDLE_SPEED;
  }
}

/**
 * ? DRAW
 * Main game loop.
 * Clears the canvas, updates the game state (ball, paddle, bricks, score, lives),
 * draws the game elements, and schedules the next frame using requestAnimationFrame.
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.cursor = 'none';

  collisionDetection();
  updateBall();
  updatePaddle();

  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();

  requestAnimationFrame(draw);
}

//! ********** MAIN **********

initBricks();
addListeners();
draw();
