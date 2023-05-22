class Gun extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;

        this.recoil = -50000; 
        this.fireRate = 20;
        this.fireCooldown = 0;  


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
        let bullet = new PlayerBullet(this.scene, this.x, this.y, 'playerbullet').setOrigin(0.5, 0.5);
        bullet.rotation = this.rotation;
        playerBullets.push(bullet);
        this.fireCooldown = this.fireRate;
    }

    aimTowardsCursor() {
        var pointer = this.scene.input.activePointer;

        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY);
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