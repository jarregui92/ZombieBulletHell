class Bomb {
    constructor(pos) {
        this.pos = pos;
        this.img = gameAssets.bombImg;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        imageMode(CENTER);
        image(this.img, 0, 0, 30, 30);
        pop();
    }

    getBomb() {
        return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 20;
    }
}
