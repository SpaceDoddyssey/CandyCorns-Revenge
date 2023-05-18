class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scale = 0.1;  
        this.isFiring = false;    
        this.moveSpeed = 15;         // pixels per frame
        this.gun;
        this.idleSprite = texture;
        this.firingSprite;

        this.velocity = new Phaser.Math.Vector2();
    }

    fire(){
        this.gun.fire();

        var pointer = this.scene.input.activePointer;
        var angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);
        this.forceX = Math.cos(angle) * this.gun.recoil;
        this.forceY = Math.sin(angle) * this.gun.recoil;

        this.body.setAcceleration(this.forceX, this.forceY);
    }

    update() {
        this.gun.update(); 

        //Firing logic
        if (game.input.activePointer.isDown){
            console.log("firing")
            this.isFiring = true;
        } else {
            this.isFiring = false;
        }
        if(this.isFiring){
            this.setTexture(this.firingSprite); 
            if(this.gun.fireCooldown == 0){
                this.fire();
            }
        } else {
            this.setTexture(this.idleSprite);
        }

        this.velocity.set(0,0);

        if(keyUP.isDown) {
            this.velocity.y = -1;
        } else if (keyDOWN.isDown) {
            this.velocity.y = 1;
        }

        if(keyLEFT.isDown){
            this.velocity.x = -1;
        } else if(keyRIGHT.isDown) {
            this.velocity.x = 1;
        }

        this.velocity.normalize();
        
        this.body.setVelocity(this.velocity.x * this.moveSpeed, this.velocity.y * this.moveSpeed);
    }
}