class e2Lollipop extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //this.jumpSpeed = 50;
        this.scale = 0.2;
        this.hp = 3;
        this.damage = 1;

        this.jumpState = false;
        this.jumpTimer = 100;
        this.jumpRate = 170;
        this.jumpForce = 50000;
        this.decelerate = 0.9;
        
        this.velocity = new Phaser.Math.Vector2();
    }

    jump() {
        let playerX = this.player.x + this.scene.cameras.main.scrollX;
        let playerY = this.player.y + this.scene.cameras.main.scrollY;
        let thisX = this.x + this.scene.cameras.main.scrollX;
        let thisY = this.y + this.scene.cameras.main.scrollY;

        var angle = Phaser.Math.Angle.Between(thisX, thisY, playerX, playerY);

        if (angle > Math.PI / 2 || angle < -Math.PI / 2) this.flipX = true;
        else this.flipX = false;

        this.forceX = Math.cos(angle) * this.jumpForce;
        this.forceY = Math.sin(angle) * this.jumpForce;

        this.body.setAcceleration(this.forceX, this.forceY);
    }
    
    update() {
        if (this.x < this.player.x - 0.5) {
            this.flipX = false;
        }
        else if (this.x > this.player.x + 0.5) {
            this.flipX = true;
        }

        if (Math.abs(this.x - this.player.x) < this.player.width*this.player.scale && Math.abs(this.y - this.player.y) < this.player.height*this.player.scale) {
            this.player.takeDamage(this.damage, 150);
        }

        this.jumpTimer--;
        if(this.jumpTimer < 0){
            this.jump();
            this.jumpTimer = this.jumpRate;
        }

        super.update();

        this.decelUpdate();

        //console.log(this.body.acceleration);
        if(this.body.acceleration.x < 100 && this.body.acceleration.y < 100){
            // console.log("1");
            this.setTexture('lollipop1');
            this.body.setSize(this.width, this.height);
        } else {
            // console.log("1");
            this.setTexture('lollipop2');
            this.body.setSize(this.width, this.height);
        }
    }

    decelUpdate() {
        this.body.setVelocity(0, 0);

        if (this.forceX != 0 && 1 < Math.abs(this.forceX)) this.forceX *= this.decelerate;
        else this.forceX = 0;
        if (this.forceY != 0 && 1 < Math.abs(this.forceY)) this.forceY *= this.decelerate;
        else this.forceY = 0;

        this.body.setAcceleration(this.forceX, this.forceY);
    }
}