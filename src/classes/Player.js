class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Player Object
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scale = 0.1;  
        this.idleSprite = texture;
        this.iframes = 100;
        //this.scene.time.addEvent({delay: 2000, callback: this.iframes = false, callbackScope: this, loop: true });

        // Gun Vars
        this.firingSprite;
        this.isFiring = false;            
        this.gun;

        // Movement

        //Adjust decelerate to change how fast the player declerates from the recoil
        //  - decelerate should be within the range 0 < decelerate < 1
        //  - the smaller decelerate is, the faster the player will slow down, and vice versa.
        this.decelerate = 0.8;
        this.moveSpeed = manualMoveSpeed; //pixels per frame
        this.velocity = new Phaser.Math.Vector2();
    }

    // Player Functions

    takeDamage(amount, iframesGiven) {
        if (this.iframes == 0) {
            //damage sprite
            this.scene.sound.play('hit');
            if (playerHp > 0) {
                playerHp -= amount;
            }
            else playerHp = 0;

            this.iframes = iframesGiven;
        }
    }

    fire() {
        // Fires the Player's gun

        this.gun.fire();

        var pointer = this.scene.input.activePointer;
        var angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY);
        this.forceX = Math.cos(angle) * this.gun.recoil;
        this.forceY = Math.sin(angle) * this.gun.recoil;
        //console.log("forceX: ", this.forceX, " forceY: ", this.forceY)

        this.body.setAcceleration(this.forceX, this.forceY);
    }

    update() {
        if (this.iframes > 0) {
            this.iframes--;
        } else {
            //recover
        }

        this.gunUpdate();

        this.moveUpdate();

        this.decelUpdate();

        enemyBullets.forEach(bullet => {
            this.scene.physics.overlap(this, bullet, (enemy, collidedBullet) => {
                collidedBullet.destroy();
                this.takeDamage(bullet.damage, 100);
            }, null, this);
        });

        // enemies.forEach(enemy => {
        //     this.scene.physics.overlap(this, enemy, (collided) => {
        //         collided.destroy();
        //         this.takeDamage(2);
        //     }, null, this);
        // });
    }

    // Player Updates

    gunUpdate() {
        // Player Firing Logic
        this.gun.update(); 

        if (game.input.activePointer.isDown){
            //console.log("firing")
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
    }

    moveUpdate() {
        // Player Directional Movement

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

    decelUpdate() {
        // Decelerates the Player after recoil movement

        if (this.forceX != 0 && 1 < Math.abs(this.forceX)) this.forceX *= this.decelerate;
        else this.forceX = 0;
        if (this.forceY != 0 && 1 < Math.abs(this.forceY)) this.forceY *= this.decelerate;
        else this.forceY = 0;

        this.body.setAcceleration(this.forceX, this.forceY);
    }
}