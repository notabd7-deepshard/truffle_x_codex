const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let birdY = 300;
let birdVelocity = 0;
let gravity = 0.5;
let jumpStrength = -8;
let pipes = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;

function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(100, birdY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(105, birdY - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(115, birdY);
    ctx.lineTo(130, birdY + 5);
    ctx.lineTo(115, birdY + 10);
    ctx.fill();
}

function drawPipes() {
    ctx.fillStyle = '#32CD32';
    
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
        ctx.strokeRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (Math.random() < 0.02) {
        const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        const bottomHeight = canvas.height - pipeGap - topHeight;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: bottomHeight
        });
    }
    
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;
        
        // Collision detection
        if (
            birdY - 20 < pipe.top ||
            birdY + 20 > canvas.height - pipe.bottom ||
            birdY - 20 < pipe.top + 10 ||
            birdY + 20 > canvas.height - pipe.bottom - 10
        ) {
            if (pipe.x < 120 && pipe.x + pipeWidth > 80) {
                gameOver = true;
            }
        }
        
        // Score
        if (pipe.x + pipeWidth < 80 && !pipe.passed) {
            score++;
            pipe.passed = true;
            document.getElementById('score').textContent = `Score: ${score}`;
        }
        
        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
        }
    });
}

function updateBird() {
    birdVelocity += gravity;
    birdY += birdVelocity;
    
    if (birdY < 0 || birdY > canvas.height) {
        gameOver = true;
    }
}

function drawGame() {
    // Sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    drawBird();
    drawPipes();
    
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FF6347';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 70);
    }
}

function resetGame() {
    birdY = 300;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('start-screen').style.display = 'block';
}

function gameLoop() {
    if (!gameStarted || gameOver) {
        drawGame();
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateBird();
    updatePipes();
    drawGame();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        
        if (gameOver) {
            resetGame();
            return;
        }
        
        if (!gameStarted) {
            gameStarted = true;
            document.getElementById('start-screen').style.display = 'none';
        }
        
        birdVelocity = jumpStrength;
    }
});

resetGame();
requestAnimationFrame(gameLoop);
