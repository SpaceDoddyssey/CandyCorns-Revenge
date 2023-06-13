class b1Jawbreaker extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.boss = true;
        this.scoreValue = 20;

        this.scale = 0.7;
        this.hp = 250;

        this.moveSpeed = 30;
        this.damage = 3;

        this.jumpState = false;
        this.jumpTimer = 300;
        this.jumpRate = 500;
        this.jumpForce = 70000;
        this.jumpNumber = 0;
        this.decelerate = 0.9;

        this.moveX = 0;
        this.moveY = 0;

        this.forceX = 0;
        this.forceY = 0;
        
        this.velocity = new Phaser.Math.Vector2();
    }

    followPlayer() {
        let playerX = this.player.x + this.scene.cameras.main.scrollX;
        let playerY = this.player.y + this.scene.cameras.main.scrollY;
        let thisX = this.x + this.scene.cameras.main.scrollX;
        let thisY = this.y + this.scene.cameras.main.scrollY;

        var angle = Phaser.Math.Angle.Between(thisX, thisY, playerX, playerY);
        if (angle > Math.PI / 2 + 0.01 || angle < -Math.PI / 2 - 0.01){
            this.flipY = true;
        } else {
            this.flipY = false;
        }

        this.rotation = angle;

        this.moveX = Math.cos(angle) * this.moveSpeed;
        this.moveY = Math.sin(angle) * this.moveSpeed;

        this.body.setVelocity(this.moveX, this.moveY);
    }
    
    update() {

        if (Math.abs(this.x - this.player.x) < this.player.width*this.player.scale && Math.abs(this.y - this.player.y) < this.player.height*this.player.scale) {
            this.player.takeDamage(this.damage, 150);
        }

        if (this.hp <= 150 && this.hp > 50) {
            this.setTexture('jawbreakerHurt');
        }
        if (this.hp <= 50) {
            this.setTexture('jawbreakerDead');
        }

        this.jumpTimer--;
        if (this.jumpTimer < 0 && this.forceX == 0 && this.forceY == 0){
            this.jumpNumber++;
            this.jump(this.jumpNumber);
            if (this.jumpNumber == 3) {
                this.jumpTimer = this.jumpRate;
                this.jumpNumber = 0;
            }
        }
        else {  
            this.followPlayer();
        }

        super.update();

        this.decelUpdate();
    }

    jump(num) {
        let playerX = this.player.x + this.scene.cameras.main.scrollX;
        let playerY = this.player.y + this.scene.cameras.main.scrollY;
        let thisX = this.x + this.scene.cameras.main.scrollX;
        let thisY = this.y + this.scene.cameras.main.scrollY;

        var angle = Phaser.Math.Angle.Between(thisX, thisY, playerX, playerY);
        if (num == 1) {
            angle *= 1.3;
            this.jumpForce = 50000;
            this.decelerate = 0.8;
        }
        if (num == 2) {
            angle *= 0.6;
            this.jumpForce = 40000;
            this.decelerate = 0.85;
        }
        if (num == 3) {
            angle *= 1.5;
            this.jumpForce = 60000;
            this.decelerate = 0.9;
        }

        this.forceX = Math.cos(angle) * this.jumpForce;
        this.forceY = Math.sin(angle) * this.jumpForce;

        this.body.setAcceleration(this.forceX, this.forceY);
    }

    decelUpdate() {

        if (this.forceX != 0 && 1 < Math.abs(this.forceX)) this.forceX *= this.decelerate;
        else {
            this.forceX = 0;
        }
        if (this.forceY != 0 && 1 < Math.abs(this.forceY)) this.forceY *= this.decelerate;
        else {
            this.forceY = 0;
        } 

        this.body.setAcceleration(this.forceX, this.forceY);
    }

}