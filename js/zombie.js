class Zombie {
    constructor(speed){
        this.speed = speed;
        let y;
        this.img = gameAssets.zombieImg; // Usar imagen precargada
        this.blood = gameAssets.bloodImg;
        

        if(random(1) < 0.5){
            //desde arriba
            y = random (-300, 0);
        }else{
            //desde abajo
            y = (random(height, height + 300))
        }

        let x = random(-300, width + 300);
        this.pos = createVector(x, y)
    }

    draw(){
        push();
        fill(100, 255, 100);
        let angle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        translate(this.pos.x, this.pos.y);
        rotate(angle);
        image(this.img, -25, -35, 50, 50);
        //rect(0, 0, 20, 20);
        pop();
    }

    update(){
        let difference = p5.Vector.sub(player.pos, this.pos);
        difference.limit(this.speed);
        this.pos.add(difference);
    }

    ateYou(){
        return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < 20;
    }

    died(pos){
        image(this.blood, pos.x-35, pos.y-35, 100, 100)
    }
}