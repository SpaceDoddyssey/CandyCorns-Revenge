class EnemyGun1 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;

        this.fireRate = 250;
        this.fireCooldown = 20;  
        this.isFiring = false;

        this.distanceFromChoco = 36; 
        this.chocoSprite; //Set by Play

        //scene.input.on('pointerdown', this.fire.bind(this));
    }

    update() {
        this.aimTowardsPlayer();
        if(this.fireCooldown > 0){
            this.fireCooldown--;
        }

        if (Math.abs(this.x - this.chocoSprite.player.x) < 300 && Math.abs(this.y - this.chocoSprite.player.y)) {
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
        enemyBullets.push(bullet);
        this.fireCooldown = this.fireRate;
    }

    aimTowardsPlayer() {
        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.x, this.y, this.chocoSprite.player.x, this.chocoSprite.player.y);
        if (angle > Math.PI / 2 || angle < -Math.PI / 2){
            this.flipY = true;
            this.chocoSprite.flipX = true;
        } else {
            this.flipY = false;
            this.chocoSprite.flipX = false;
        }
        
        this.rotation = angle;

        var targetX = this.chocoSprite.x + Math.cos(angle) * this.distanceFromChoco;
        var targetY = this.chocoSprite.y + Math.sin(angle) * this.distanceFromChoco;

        this.x = targetX;
        this.y = targetY;
    }
}