var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var startText = document.getElementById("start");
var loseText = document.getElementById("lose");
var winText = document.getElementById("win");
var platformX
var platformY
var x;
var y;
var radius;
var dx;
var dy;
var bricks = [];
var bWidth = 80;
var bHeight = 20;
var pWidth = 70;
var interval;
var started = 0;
var left = 0;
var right = 0;
window.addEventListener("keydown", keyActionDown);
window.addEventListener("keyup", keyActionUp);

function setBricks() {
    for (let i = 0; i < 20; i++) {
        bricks[i] = [0, 0, 1];
    }
}

function drawRectangles() {
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
    ctx.beginPath();
    ctx.rect(platformX, platformY, pWidth, 10);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function keyActionUp(key) {
    if (key.keyCode == 37) {
        left = 0;
    }
    else if (key.keyCode == 39) {
        right = 0;
    }
}

function keyActionDown(key) {
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

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function detectCollision() {
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

function checkWin() {
    for (let i = 0; i < bricks.length; i++) {
        if (bricks[i][2] == 1) {
            return false;
        }
    }
    return true;
}

function announceWin(win) {
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

function draw() {
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

function resetGame(key) {
    if (key.keyCode == 82) {
        loseText.style.display = "none";
        winText.style.display = "none";
        setGame()
    }
}

function setGame() {
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

setGame()