class Gun extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;

        this.recoil = -50000; 
        this.fireRate = 20;
        this.fireCooldown = 0;  
        this.depth = 2;

        this.distanceFromPlayer = 36; 
        this.playerSprite; //Set by Play

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
        let bullet = new PlayerBullet(this.scene, this.x, this.y, 'playerbullet', this.rotation).setOrigin(0.5, 0.5);
        playerBullets.push(bullet);
        this.fireCooldown = this.fireRate;
    }

    aimTowardsCursor() {
        var pointer = this.scene.input.activePointer;

        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, 
                                                   pointer.worldX, pointer.worldY);
        if (angle > Math.PI / 2 || angle < -Math.PI / 2){
            this.flipY = true;
            this.playerSprite.flipX = true;
        } else {
            this.flipY = false;
            this.playerSprite.flipX = false;
        }
        
        this.rotation = angle;
        
        // Calculate the position of the moving sprite based on the angle and distance
        var targetX = this.playerSprite.x + Math.cos(angle) * this.distanceFromPlayer;
        var targetY = this.playerSprite.y + Math.sin(angle) * this.distanceFromPlayer;

        this.x = targetX;
        this.y = targetY;
    }
}