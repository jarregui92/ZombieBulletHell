let player;
let zombies = [];
let coins = [];
let hearts = [];
let bombs = []; // Add bombs array
let zombieSpawnTime = 300;
let zombieMaxSpeed = 2;
let frame = 0
let score = 0;
let gameTime = 0; // Add game time counter
let playerName = '';
let gameStarted = false; // Cambiar a false por defecto
let gameOver = false;

let bg;
let gameAssets = {};

function preload() {
    gameAssets.playerImg = loadImage('./img/player.png');
    gameAssets.zombieImg = loadImage('./img/zombie.png');
    gameAssets.bulletImg = loadImage('./img/bullet.png');
    gameAssets.coinImg = loadImage('./img/coin.png');
    gameAssets.heartImg = loadImage('./img/heart.png');
    gameAssets.bloodImg = loadImage('./img/blood.png');
    gameAssets.bg = loadImage('./img/background.jpg');
    gameAssets.bombImg = loadImage('./img/bomb.png'); // Add bomb image
}

function setup(){
    let canvasContainer = select('#game-container')
    let cnv = createCanvas(700, 700);
    cnv.parent(canvasContainer);
    bg = loadImage('./img/background.jpg');
}

function draw(){
    if (!gameStarted) {
        background(0);
        return;
    }
    // Limitar el número máximo de zombies
    const MAX_ZOMBIES = 100;
    if (zombies.length >= MAX_ZOMBIES) {
        zombieSpawnTime = Math.max(zombieSpawnTime, 300);
    }

    background(bg);
    
    rectMode(CENTER);
    player.draw();
    player.update();

    // Dibujar y actualizar corazones
    for (let h = hearts.length - 1; h >= 0; h--) {
        hearts[h].draw();
        if(hearts[h].getHeart()){
            player.life = Math.min(player.life + 50, player.totalLife); // No exceder vida máxima
            hearts.splice(h, 1);
        }
    }

    //ESTO MANTIENE CON VIDA LOS ZOMBIES MIENTRAS ESTEN EN EL ARRAY
    for (let i = zombies.length - 1; i >= 0; i--) {
        zombies[i].draw();
        zombies[i].update();
        
        if(zombies[i].ateYou()){
            if(player.life > 0){
                player.life -= 1;
            }else{
            restart();
            break;
            }

        }

        if (player.hasShot(zombies[i])) {
            zombies[i].died(zombies[i].pos);
            
            let chance = random(1);
            if (chance < 0.1) {
                hearts.push(new Heart(50, zombies[i].pos));
            } else if (chance < 0.2) {
                bombs.push(new Bomb(zombies[i].pos));
            } else {
                coins.push(new Coin(random(10), zombies[i].pos));
            }
            
            zombies.splice(i, 1);
        }
    }
    
    //ESTO MANTIENE CON VIDA LAS MONEDAS MIENTRAS ESTEN EN EL ARRAY
    for (let c = coins.length -1; c >= 0; c--) {
        coins[c].draw();

        if(coins[c].getCoin()){
            score += Math.ceil(coins[c].value);
            coins.splice(c, 1);
        }
    }

    // After handling coins, handle bombs
    for (let b = bombs.length -1; b >= 0; b--) {
        bombs[b].draw();
        if(bombs[b].getBomb()){
            // Kill all zombies and create coins
            for (let z = zombies.length - 1; z >= 0; z--) {
                coins.push(new Coin(random(10), zombies[z].pos));
            }
            zombies = [];
            bombs.splice(b, 1);
        }
    }

    if(frame >= zombieSpawnTime){
        zombies.push(new Zombie(random(zombieMaxSpeed)));
        zombieSpawnTime *=0.95;
        frame = 0;
    }

    if(frameCount % 1000 == 0){
        zombieMaxSpeed += 0.1
    }
    frame++;

    // Update game time (convert frames to seconds)
    gameTime = Math.floor(frameCount / 60);
    
    // Format time as mm:ss
    let minutes = Math.floor(gameTime / 60);
    let seconds = gameTime % 60;
    let timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the UI
    document.querySelector('#score').textContent = score.toString().padStart(6, '0');
    document.querySelector('#zombies-alive').textContent = zombies.length;
    document.querySelector('#game-time').textContent = timeString;
}

function askPlayerName() {
    playerName = prompt('Enter your name (3 chars max):');
    if (playerName) {
        playerName = playerName.substring(0, 3).toUpperCase();
        return true;
    }
    return false;
}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores') || '[]');
    
    scores.push({
        name: playerName,
        score: score,
        time: gameTime,
        date: new Date().toISOString()
    });

    // Ordenar por puntuación más alta
    scores.sort((a, b) => b.score - a.score);
    
    // Mantener solo los 3 mejores scores
    scores = scores.slice(0, 3);
    
    localStorage.setItem('scores', JSON.stringify(scores));
    updateHighScoresDisplay();
}

function updateHighScoresDisplay() {
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    const scoresHtml = scores.map(score => 
        `<p class="text-sm">${score.name}: ${score.score} (${Math.floor(score.time/60)}:${(score.time%60).toString().padStart(2,'0')})</p>`
    ).join('');
    
    document.getElementById('highScores').innerHTML = scoresHtml || '<p class="text-sm">No scores yet!</p>';
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    player = new Player();
    zombies = [];
    coins = [];
    hearts = [];
    bombs = [];
    zombieSpawnTime = 300;
    zombieMaxSpeed = 2;
    score = 0;
    gameTime = 0;
    frameCount = 0;
}

function restart(){
    if (askPlayerName()) {
        saveScore();
        gameStarted = false;
        gameOver = true;
    }
}

function mouseClicked(){
    player.shoot();
}

// Llamar a esta función al inicio para mostrar las puntuaciones guardadas
document.addEventListener('DOMContentLoaded', updateHighScoresDisplay);