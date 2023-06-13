class Gun extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;

        this.recoil = -50000; 
        this.fireRate = 21;
        this.fireCooldown = 0;
        this.fireRateCap = 20;
        this.depth = 2;
        this.spread = 0;

        this.distanceFromPlayer = 36; 
        this.player;

        this.offsetY = 0;

        //scene.input.on('pointerdown', this.fire.bind(this));
    }

    update() {
        if(this.fireCooldown > 0){
            this.fireCooldown--;
        }

        this.aimTowardsCursor();
    }

    fire() {
        this.scene.sound.play('gunfire', { volume: 0.3 });
        let randSpread = Phaser.Math.FloatBetween(-this.spread, this.spread);
        let bullet = new PlayerBullet(this.scene, this.x, this.y, 'playerbullet', this.rotation * (1 + randSpread)).setOrigin(0.5, 0.5);
        if (this.player.type == "minigun") {
            bullet.setScale(0.2);
        }
        if (this.player.type == "double") {
            bullet.setScale(0.25);
        }
        playerBullets.push(bullet);
        this.fireCooldown = this.fireRate;
    }

    aimTowardsCursor() {
        var pointer = this.scene.input.activePointer;

        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, 
                                                   pointer.worldX, pointer.worldY);
        if (angle > Math.PI / 2 || angle < -Math.PI / 2){
            this.flipY = true;
            this.player.flipX = true;
        } else {
            this.flipY = false;
            this.player.flipX = false;
        }
        
        this.rotation = angle;
        
        // Calculate the position of the moving sprite based on the angle and distance
        var targetX = this.player.x + Math.cos(angle) * this.distanceFromPlayer;
        var targetY = this.player.y + Math.sin(angle) * this.distanceFromPlayer + this.offsetY;

        this.x = targetX;
        this.y = targetY;
    }
}