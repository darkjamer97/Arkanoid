$(document).ready(() => {
    var canvas = $("canvas");
    var ctx = canvas[0].getContext("2d");
    var ballRadius = 10;
    var x = canvas.width() / 2;
    var y = canvas.height() - 30;
    var dx = 3;
    var dy = -3;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width() - paddleWidth) / 2;
    var canvasStart = canvas.offset().left;
    var frames;
    var endFrames = false;
    var bricks = [];
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var bricksBroken = 0;
    var bricksColors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];

    canvas.mousemove(evt => {
        if (evt.pageX > (canvasStart - paddleWidth))
            paddleX = Math.max((evt.pageX - canvasStart) - (paddleWidth), 0);
    });

    function createBricks() {
        for (c = 0; c < brickColumnCount; c++) {
            bricks[c] = new Array(brickRowCount);
            for (r = 0; r < brickRowCount; r++)
                bricks[c][r] = { x: 0, y: 0, status: 1};
        }
    }

    function drawBricks() {
        for (c = 0; c < brickColumnCount; c++)
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = bricksColors[r];
                    ctx.fill();
                    ctx.closePath();
                }
            }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height() - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++)
            for (r = 0; r < brickRowCount; r++)
                if (bricks[c][r].status == 1)
                    if (x > bricks[c][r].x && x < bricks[c][r].x + brickWidth && y > bricks[c][r].y && y < bricks[c][r].y + brickHeight) {
                        dy = -dy;
                        bricks[c][r].status = 0;
                        bricksBroken++;

                        if (bricksBroken == brickColumnCount*brickRowCount)
                            endFrames = true;
                    }
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
    }

    function draw() {
        clear();
        drawBall();
        drawPaddle();
        collisionDetection();
        drawBricks();

        if (x + dx > canvas.width() - ballRadius || x + dx < ballRadius) dx = -dx;

        if (y + dy < ballRadius) dy = -dy;

        else if (y + dy > canvas.height() - ballRadius)

            if (x > paddleX && x < paddleX + paddleWidth) {
                dx = 4 * ((x - (paddleX + paddleWidth / 2)) / paddleWidth);
                dy = -dy;
            }
            else {
                cancelAnimationFrame(frames);
                endFrames = true;
            }

        x += dx;
        y += dy;

        if (!endFrames)
            frames = requestAnimationFrame(draw);
    }

    createBricks();

    requestAnimationFrame(draw);
});

