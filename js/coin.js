class Coin {
    constructor(value, pos){
        this.value = value;
        this.pos = pos;
        this.img = gameAssets.coinImg; // Usar imagen precargada
    }

    draw(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount / 10.0);
    imageMode(CENTER);
    image(this.img, 0, 0, 800/25, 491/25);
    pop();
    }

    update(){

    }

    getCoin(){
        return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 20;
    }
}