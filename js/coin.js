class Coin {
    constructor(value, pos){
        this.value = value;
        this.pos = pos;
        this.img = loadImage('./img/coin.png');
    }

    draw(){
        push();
        //fill(100, 255, 100);
        //let angle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        //translate(this.pos.x, this.pos.y);
        //rotate(angle);
        image(this.img, this.pos.x-25, this.pos.y-25, 800/25, 491/25);
        //rect(0, 0, 20, 20);
        pop();
    }

    update(){

    }

    getCoin(){
        return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 20;
    }
}