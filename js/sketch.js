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
    return new Promise((resolve) => {
        const modal = document.getElementById('nameModal');
        const modalContent = document.getElementById('modalContent');
        const input = document.getElementById('playerNameInput');
        const saveBtn = document.getElementById('saveNameBtn');

        // Deshabilitar temporalmente el canvas de p5.js
        noLoop();
        
        // Mostrar modal con animación
        modal.style.display = 'flex';
        setTimeout(() => {
            modalContent.classList.add('opacity-100', 'scale-100');
            modalContent.classList.remove('opacity-0', 'scale-95');
            // Forzar el foco en el input
            input.focus();
        }, 10);

        input.value = '';

        function saveName() {
            const name = input.value.trim().toUpperCase();
            if (name) {
                playerName = name.substring(0, 3);
                modal.style.display = 'none';
                modalContent.classList.remove('opacity-100', 'scale-100');
                loop(); // Reactivar el canvas
                resolve(true);
            } else {
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        }

        // Event listeners
        saveBtn.onclick = saveName;
        input.onkeydown = (e) => {
            e.stopPropagation(); // Prevenir que p5.js capture el evento
            if (e.key === 'Enter') saveName();
        };
    });
}

async function restart() {
    if (await askPlayerName()) {
        saveScore();
        // Asegurarse de que el modal esté completamente cerrado
        const modal = document.getElementById('nameModal');
        const modalContent = document.getElementById('modalContent');
        
        modal.style.display = 'none';
        modalContent.classList.remove('opacity-100', 'scale-100');
        modalContent.classList.add('opacity-0', 'scale-95');
        
        // Reiniciar todo el estado del juego
        gameStarted = false;
        gameOver = false;
        zombieSpawnTime = 300;
        zombieMaxSpeed = 2;
        player = null;
        zombies = [];
        coins = [];
        hearts = [];
        bombs = [];
        score = 0;
        gameTime = 0;
        frameCount = 0;
        frame = 0;
        
        // Reactivar el bucle de p5.js y mostrar el botón de inicio
        loop();
        const startButton = document.getElementById('start-button');
        startButton.style.display = 'block';

        // Forzar una actualización de los high scores
        updateHighScoresDisplay();
    }
}

function saveScore() {
    const scoreData = {
        name: playerName,
        score: score,
        time: gameTime,
        date: new Date().toISOString()
    };

    fetch('scores.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData)
    })
    .then(response => response.json())
    .then(() => updateHighScoresDisplay())
    .catch(error => console.error('Error:', error));
}

function updateHighScoresDisplay() {
    fetch('scores.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Respuesta del servidor:', text);
                    throw new Error('Error al parsear JSON');
                }
            });
        })
        .then(scores => {
            if (!Array.isArray(scores)) {
                console.error('Formato de scores inválido:', scores);
                scores = [];
            }
            
            const medals = ['🥇', '🥈', '🥉'];
            const rows = medals.map((medal, index) => {
                if (scores && scores[index]) {
                    const score = scores[index];
                    const name = score.name ? (score.name + '___').slice(0, 3) : '___';
                    const scoreStr = score.score.toString().padStart(6, '0');
                    const minutes = Math.floor(score.time/60).toString().padStart(2, '0');
                    const seconds = (score.time%60).toString().padStart(2, '0');
                    const timeStr = `${minutes}:${seconds}`;
                    
                    return `<div class="flex items-center justify-center space-x-2 py-1 font-arcade">
                        <span>${medal}</span>
                        <span>${name}</span>
                        <span>${scoreStr}</span>
                        <span class="text-gray-500">${timeStr}</span>
                    </div>`;
                }
                return '';
            }).join('');
            
            const highScoresElement = document.getElementById('highScores');
            if (highScoresElement) {
                highScoresElement.innerHTML = rows || 'No hay puntuaciones';
            }
        })
        .catch(error => {
            console.error('Error al cargar scores:', error);
            const highScoresElement = document.getElementById('highScores');
            if (highScoresElement) {
                highScoresElement.innerHTML = '<div class="text-red-500 text-center">Error al cargar puntuaciones</div>';
            }
        });
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

function mouseClicked() {
    // Solo disparar si el juego está activo
    if (gameStarted) {
        player.shoot();
    }
}

// Modificar keyPressed para que no interfiera con el input
function keyPressed(e) {
    if (document.activeElement.tagName === 'INPUT') {
        return false; // Importante: retornar false para prevenir el comportamiento por defecto
    }
    return true;
}

// Llamar a esta función al inicio para mostrar las puntuaciones guardadas
document.addEventListener('DOMContentLoaded', updateHighScoresDisplay);