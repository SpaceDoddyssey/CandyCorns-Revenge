class e2Lollipop extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //this.jumpSpeed = 50;
        this.scale = 0.2;
        this.hp = 3;
        this.anims.create({
            key: 'lollipop',
            frames: this.anims.generateFrameNames('lollipop', {
                prefix: 'lollipop',
                start: 1,
                end: 2,
            }),
            defaultTextureKey: 'lollipop',
            frameRate: 2,
            repeat: -1
        });
        this.anims.play('lollipop', true);

        /*this.jumpTimer = 100;
        this.jumpRate = 200;
        
        this.velocity = new Phaser.Math.Vector2();*/
    }

    jump() {
        /*
                var angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);

        if (angle > Math.PI / 2 || angle < -Math.PI / 2) this.flipX = true;
        else this.flipX = false;

        if (Math.cos(angle) > 0) this.velocity.x = 1;
        else if (Math.cos(angle) < 0) this.velocity.x = -1;

        if (Math.sin(angle) > 0) this.velocity.y = -1;
        else if (Math.sin(angle) < 0) this.velocity.y = 1;

        this.velocity.normalize();

        

        this.body.setVelocity(this.velocity.x * this.jumpSpeed, this.velocity.y * this.jumpSpeed);

        */
    }
    
    update() {
        if (this.x < this.player.x) this.x += 0.5;
        else this.x -= 0.5;
        if (this.y < this.player.y) this.y += 0.5;
        else this.y -= 0.5;

        /*if (Math.abs(this.x - this.player.x) < 3 && Math.abs(this.y - this.player.y) < 3) {
            this.player.takeDamage();
        }*/

        /*this.velocity.set(0,0);

        this.jumpTimer--;
        if(this.jumpTimer < 0){
            this.jump();
            this.jumpTimer = this.jumpRate;
        }*/

        super.update();
    }
}