class ChocoBar extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scale = 0.3;
        this.fireRate = 250;
        this.fireCooldown = 0;  
        this.isFiring = false;
    }

    fire() {
        let bullet = new EnemyBullet(this.scene, this.x, this.y, 'enemybullet').setOrigin(0.5, 0.5);
        bullet.rotation = this.rotation;
        enemyBullets.push(bullet);
        this.fireCooldown = this.fireRate;
    }

    update() {
        super.update();
        this.aimTowardsPlayer();
        if(this.fireCooldown > 0){
            this.fireCooldown--;
        }

        if (Math.abs(this.x - this.player.x) < 300 && Math.abs(this.y - this.player.y)) {
            console.log("firing")
            this.isFiring = true;
        } else {
            this.isFiring = false;
        }

        if (this.isFiring) {
            if (this.fireCooldown == 0){
                this.fire();
            }
        }
    }

    aimTowardsPlayer() {
        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        if (angle > Math.PI / 2 || angle < -Math.PI / 2){
            this.flipY = true;
        } else {
            this.flipY = false;
        }
        
        this.rotation = angle;
    }
}