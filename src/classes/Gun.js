class Gun extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;

        this.scale = 0.1;
        this.recoil = -5000; 
        this.forceX = 0;
        this.forceY = 0;

        //Adjust decelerate to change how fast the player declerates from the recoil
        //  - decelerate should be within the range 0 < decelerate < 1
        //  - the smaller decelerate is, the faster the player will slow down, and vice versa.

        this.decelerate = 0.98;
        this.distanceFromPlayer = 66; 
        this.playerSprite; //Set by Play

        //scene.input.on('pointerdown', this.fire.bind(this));
    }

    update() {
        this.aimTowardsCursor();
        
        if (this.forceX != 0 && 1 < Math.abs(this.forceX)) this.forceX *= this.decelerate;
        else this.forceX = 0;
        if (this.forceY != 0 && 1 < Math.abs(this.forceY)) this.forceY *= this.decelerate;
        else this.forceY = 0;

        this.playerSprite.body.setAcceleration(this.forceX, this.forceY);
    }

    fire() {
        let bullet = new PlayerBullet(this.scene, this.x, this.y, 'playerbullet').setOrigin(0.5, 0.5);
        bullet.rotation = this.rotation;
        playerBullets.push(bullet);

        var pointer = this.scene.input.activePointer;
        var angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, pointer.x, pointer.y);
        this.forceX = Math.cos(angle) * this.recoil;
        this.forceY = Math.sin(angle) * this.recoil;

        this.playerSprite.body.setAcceleration(this.forceX, this.forceY);
    }

    aimTowardsCursor(){
        var pointer = this.scene.input.activePointer;

        //console.log(this.playerSprite);
        // Calculate angle between player sprite and cursor position
        var angle = Phaser.Math.Angle.Between(this.playerSprite.x, this.playerSprite.y, pointer.x, pointer.y);

        this.rotation = angle;
        
        // Calculate the position of the moving sprite based on the angle and distance
        var targetX = this.playerSprite.x + Math.cos(angle) * this.distanceFromPlayer;
        var targetY = this.playerSprite.y + Math.sin(angle) * this.distanceFromPlayer;

        this.x = targetX;
        this.y = targetY;
    }
}