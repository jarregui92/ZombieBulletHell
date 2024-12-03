class Heart {
    constructor(value, pos){
        this.value = value;
        this.pos = pos;
        this.img = gameAssets.heartImg; // Usar imagen precargada
    }

    draw(){
        push();
        translate(this.pos.x, this.pos.y);
        imageMode(CENTER);
        // Usar sin() para crear un efecto de pulso, multiplicando el tamaño base por un factor que oscila entre 0.8 y 1.2
        let pulseScale = map(sin(frameCount * 0.05), -1, 1, 0.9, 1.1);
        let baseWidth = 550/25;
        let baseHeight = 491/25;
        image(this.img, 0, 0, baseWidth * pulseScale, baseHeight * pulseScale);
        pop();
    }

    update(){

    }

    getHeart(){
        return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 20;
    }
}