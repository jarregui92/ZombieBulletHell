class Player {
    constructor() {
      this.pos = createVector(width / 2, height / 2)
      this.angle = 0;
      this.bullets = [];
      this.img = gameAssets.playerImg; // Usar imagen precargada
      this.life = 50;
      this.totalLife = 50;
      this.maxBullets = 50; // Limitar cantidad de balas
    }
    
    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        //F
        fill(0,0,0);
        rect(-35, 0, 5, this.totalLife);
        fill(255,0,0);
        rect(-35, 0, 5, this.life);
        image(this.img, -25, -35, 50, 50);
        pop();

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].isExpired()) {
                this.bullets.splice(i, 1);
            } else {
                this.bullets[i].update();
                this.bullets[i].draw();
            }
        }
    }
  
    update(){
        let xSpeed = 0;
        let ySpeed = 0;

        if(keyIsDown(65)){
            xSpeed = -2;
        }

        if(keyIsDown(68)){
            xSpeed = 2;
        }

        if(keyIsDown(87)){
            ySpeed = -2;
        }

        if(keyIsDown(83)){
            ySpeed = 2;
        }

        this.pos.add(xSpeed, ySpeed);
        this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    }

    shoot(){
        if (this.bullets.length < this.maxBullets) {
            this.bullets.push(new Bullet(this.pos.x, this.pos.y, this.angle));
        }
    }

    hasShot(zombie) {
        for (let i = 0; i < this.bullets.length; i++) {
          if (dist(this.bullets[i].x, this.bullets[i].y, zombie.pos.x, zombie.pos.y) < 15) {
            this.bullets.splice(i, 1);
            
            return true;
          }
        }
        return false;
    }
}
