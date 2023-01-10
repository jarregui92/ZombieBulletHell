class Bullet{
    constructor(x, y, angle){
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 8;
        this.img = loadImage('./img/bullet.png');
    }

    draw(){
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        image(this.img, 18, 0, 18, 5);
        pop();

    }

    update(){
        this.x += this.speed * cos(this.angle);
        this.y += this.speed * sin(this.angle);
    }
}
