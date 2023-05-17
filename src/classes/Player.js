class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scale = 0.5;  
        this.isFiring = false;      
        this.moveSpeed = 15;         // pixels per frame
        this.gun;

        scene.input.on('pointerdown', this.fire.bind(this));

        this.velocity = new Phaser.Math.Vector2();
    }

    fire(){
        this.gun.fire();
    }

    update() {
        this.gun.update(); 

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