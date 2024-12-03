let player;
let zombies = [];
let coins = [];
let zombieSpawnTime = 300;
let zombieMaxSpeed = 2;
let frame = 0
let score = 0;

let bg;
let gameAssets = {};

function preload() {
    gameAssets.playerImg = loadImage('./img/player.png');
    gameAssets.zombieImg = loadImage('./img/zombie.png');
    gameAssets.bulletImg = loadImage('./img/bullet.png');
    gameAssets.coinImg = loadImage('./img/coin.png');
    gameAssets.bloodImg = loadImage('./img/blood.png');
    gameAssets.bg = loadImage('./img/background.jpg');
}

function setup(){
    let canvasContainer = select('#game-container')
    let cnv = createCanvas(700, 700);
    cnv.parent(canvasContainer);
    bg = loadImage('./img/background.jpg');
    player = new Player();
}

function draw(){
    // Limitar el número máximo de zombies
    const MAX_ZOMBIES = 100;
    if (zombies.length >= MAX_ZOMBIES) {
        zombieSpawnTime = Math.max(zombieSpawnTime, 300);
    }

    background(bg);
    
    rectMode(CENTER);
    player.draw();
    player.update();

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
            zombies[i].died(zombies[i].pos)
            coins.push(new Coin(random(10), zombies[i].pos));
            
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

    if(frame >= zombieSpawnTime){
        zombies.push(new Zombie(random(zombieMaxSpeed)));
        zombieSpawnTime *=0.95;
        frame = 0;
    }

    if(frameCount % 1000 == 0){
        zombieMaxSpeed += 0.1
    }
    frame++;



    // Update the score and zombies alive in the HTML
    document.querySelector('#score').textContent = score.toString().padStart(6, '0');
    document.querySelector('#zombies-alive').textContent = zombies.length;
}

function restart(){
    player = new Player();
    zombies = [];
    coins = [];
    zombieSpawnTime = 300;
    zombieMaxSpeed = 2;
    score = 0;
}

function mouseClicked(){
    player.shoot();
}