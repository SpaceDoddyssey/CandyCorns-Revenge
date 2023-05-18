class Gun extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;

        this.recoil = -50000; 
        this.fireRate = 20;
        this.fireCooldown = 0;  

        //Adjust decelerate to change how fast the player declerates from the recoil
        //  - decelerate should be within the range 0 < decelerate < 1
        //  - the smaller decelerate is, the faster the player will slow down, and vice versa.
        this.distanceFromPlayer = 66; 
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

    aimTowardsCursor(){
        var pointer = this.scene.input.activePointer;

        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, pointer.x, pointer.y);
        if (angle > Math.PI / 2 || angle < -Math.PI / 2){
            this.flipY = true;
        } else {
            this.flipY = false;
        }
        
        this.rotation = angle;
        
        // Calculate the position of the moving sprite based on the angle and distance
        var targetX = this.playerSprite.x + Math.cos(angle) * this.distanceFromPlayer;
        var targetY = this.playerSprite.y + Math.sin(angle) * this.distanceFromPlayer;

        this.x = targetX;
        this.y = targetY;
    }
}