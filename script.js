// The canvas
var canvas = document.getElementById("myCanvas");

// The context
var ctx = canvas.getContext("2d");

// Text variables
var startText = document.getElementById("start");
var loseText = document.getElementById("lose");
var winText = document.getElementById("win");

// Platform variables
var platformX
var platformY
var pWidth = 70;

// Variables for if the paddle should be moving
var left = 0;
var right = 0;

// Ball variables
var x;
var y;
var radius;

// How the ball moves in x and y direction
var dx;
var dy;

// Brick variables
var bricks = [];
var bWidth = 80;
var bHeight = 20;

// If the game has started yet
var started = 0;

// Interval to keep the screen constantly updating
var interval;

// Key listeners
window.addEventListener("keydown", keyActionDown);
window.addEventListener("keyup", keyActionUp);

// Setup the game
setGame()

function setGame() {
    // Setup the game 

    x = canvas.width / 2;
    y = canvas.height - 200;
    radius = 10;
    dx = 0;
    dy = 4;
    platformX = canvas.width / 2 - 30;
    platformY = canvas.height - 18;
    setBricks()
    interval = setInterval(draw, 10);
}

function setBricks() {
    // Initialize the bricks variabe

    for (let i = 0; i < 20; i++) {
        // format of bricks is: x position, y position, and 1 if it has not been hit and 0 if it has
        bricks[i] = [0, 0, 1];
    }
}

function draw() {
    // Draw everything on the screen

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawRectangles();
    drawPlatform();
    detectCollision();

    if (started) {
        if (y + dy + radius == platformY) {
            if (platformX - 2 * radius < x + dx && x + dx < platformX + pWidth + radius && y + dy + radius == platformY) {
                dy = -dy;
                if (dx == 0) {
                    dx = 2;
                }
            }
        }
        else {
            if (x + dx > canvas.width - radius || x + dx < radius) {
                dx = -dx;
            }
            if (y + dy < radius) {
                dy = -dy;
            }
        }
        if (y >= canvas.height + radius) {
            announceWin(0)
        }
        x += dx;
        y += dy;
    }
    if (left) {
        platformX = Math.max(platformX - 6, 0);
    }
    else if (right) {
        platformX = Math.min(platformX + 6, canvas.width - pWidth);
    }
}

function drawBall() {
    // Draw the ball

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function drawRectangles() {
    // Draw the bricks

    for (let i = 0; i < bricks.length; i++) {
        if (bricks[i][2] == 1) {
            let brickX = 0;
            let brickY = 0;
            ctx.beginPath();
            if (i < 5)
            {
                brickX = i * 90 + 10;
                brickY = 5;
                ctx.rect(brickX, brickY, bWidth, bHeight);
                ctx.fillStyle = "purple";
            }
            else if (i < 10) {
                brickX = (i - 5) * 90 + 10;
                brickY = 35;
                ctx.rect(brickX, brickY, bWidth, bHeight);
                ctx.fillStyle = "red";
            }
            else if (i < 15) {
                brickX = (i - 10) * 90 + 10;
                brickY = 65;
                ctx.rect(brickX, brickY, bWidth, bHeight);
                ctx.fillStyle = "green";
            }
            else {
                brickX = (i - 15) * 90 + 10;
                brickY = 95;
                ctx.rect(brickX, brickY, bWidth, bHeight);
                ctx.fillStyle = "yellow";
            }
            ctx.fill();
            ctx.closePath();
            bricks[i] = [brickX, brickY, 1];
        }
    }
}

function drawPlatform() {
    // Draw the platform that the player controls

    ctx.beginPath();
    ctx.rect(platformX, platformY, pWidth, 10);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function detectCollision() {
    // Check if the ball hit a brick and remove the brick if it has

    for (let i = 0; i < bricks.length; i++) {
        if (bricks[i][2] == 1) {
            if (x - radius >= bricks[i][0] && x - radius <= bricks[i][0] + bWidth && y - radius >= bricks[i][1] && y - radius <= bricks[i][1] + bHeight) {
                bricks[i][2] = 0;
                dy = -dy;
                if (checkWin()) {
                    announceWin(1)
                }
            }
        }
    }
}

function keyActionUp(key) {
    // Stop moving the paddle if the left or right key is no longer being pushed

    if (key.keyCode == 37) {
        left = 0;
    }
    else if (key.keyCode == 39) {
        right = 0;
    }
}

function keyActionDown(key) {
    // Start the game if SPACE pushed
    // Move the paddle depending on which button was pressed

    if (key.keyCode == 32) {
        started = 1;
        startText.style.display = "none";
    }
    if (key.keyCode == 37) {
        left = 1;
    }
    else if (key.keyCode == 39) {
        right = 1;
    }
}

function checkWin() {
    // Return true if all the bricks are destroyed and false otherwise

    for (let i = 0; i < bricks.length; i++) {
        if (bricks[i][2] == 1) {
            return false;
        }
    }
    return true;
}

function announceWin(win) {
    // Game over so stop the game, display replay message, and allow player to replay by pressing R

    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatform()
    drawRectangles()
    if (win) {
        winText.style.display = "block";
    }
    else {
        loseText.style.display = "block";
    }  
    window.addEventListener("keydown", resetGame);

}

function resetGame(key) {
    // Reset the game if R key pressed

    if (key.keyCode == 82) {
        loseText.style.display = "none";
        winText.style.display = "none";
        startText.style.display = "block";
        started = 0
        setGame()
    }
}

