class b1Jawbreaker extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.boss = true;
        this.scoreValue = 20;

        this.scale = 0.6;
        this.hp = 100;

        this.moveSpeed = 30;
        this.damage = 5;
        
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

        this.forceX = Math.cos(angle) * this.moveSpeed;
        this.forceY = Math.sin(angle) * this.moveSpeed;

        this.body.setVelocity(this.forceX, this.forceY);
    }
    
    update() {

        if (Math.abs(this.x - this.player.x) < this.player.width*this.player.scale && Math.abs(this.y - this.player.y) < this.player.height*this.player.scale) {
            this.player.takeDamage(this.damage, 150);
        }
        this.followPlayer();

        if (this.hp <= 50 && this.hp > 20) {
            this.setTexture('jawbreakerHurt');
        }
        if (this.hp <= 20) {
            this.setTexture('jawbreakerDead');
        }

        super.update();
    }

}