class e1Gun extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;

        this.fireRate = 150;
        this.fireCooldown = 20;  
        this.isFiring = false;

        this.e1Distance = 36; 
        this.e1Sprite;

        this.damage;

        //scene.input.on('pointerdown', this.fire.bind(this));
    }

    update() {
        this.aimTowardsPlayer();
        if(this.fireCooldown > 0){
            this.fireCooldown--;
        }

        if (Math.abs(this.x - this.e1Sprite.player.x) < 300 && Math.abs(this.y - this.e1Sprite.player.y)) {
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

    fire() {
        let bullet = new EnemyBullet(this.scene, this.x, this.y, 'enemybullet').setOrigin(0.5, 0.5);
        bullet.rotation = this.rotation;
        bullet.damage = this.damage;
        enemyBullets.push(bullet);
        this.fireCooldown = this.fireRate;
    }

    aimTowardsPlayer() {
        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.e1Sprite.x, this.e1Sprite.y, this.e1Sprite.player.x, this.e1Sprite.player.y);
        if (angle > Math.PI / 2 + 0.01 || angle < -Math.PI / 2 - 0.01){
            this.flipY = true;
            this.e1Sprite.flipX = true;
        } else {
            this.flipY = false;
            this.e1Sprite.flipX = false;
        }
        
        this.rotation = angle;

        var targetX = this.e1Sprite.x + Math.cos(angle) * this.e1Distance;
        var targetY = this.e1Sprite.y + Math.sin(angle) * this.e1Distance;

        this.x = targetX;
        this.y = targetY;
    }
}