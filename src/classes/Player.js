class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Player Object
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.scale = 0.1;  
        this.idleSprite = 'player_idle';
        this.hurtSprite = 'player_hurt';
        this.iframes = 0;
        this.depth = 1;
        //this.takeDamage(0, 100);//This is so there is flashing when you spawn and not JUST iframes

        this.heroColor = new Phaser.Display.Color(255, 255, 255);
        this.invincibleColor = new Phaser.Display.Color(255, 4, 9);

        // Gun Vars
        this.firingSprite = 'player_firing';
        this.isFiring = false;            
        this.gun;
        this.gun2;
        this.type;

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
            this.setTexture(this.hurtSprite);
            if (playerHp > 0) {
                playerHp -= amount;
            }
            else playerHp = 0;

            if(playerHp > 0){
                this.scene.sound.play('hit');
            } else {
                this.scene.sound.play('playerDeath');
            }

            this.iframes = iframesGiven;

            this.scene.tweens.addCounter({
                from: 0,
                to: 20,
                duration: iframesGiven,
                yoyo: true,
                repeat: 5,
                onUpdate: (tween) => {
                    var value = Math.floor(tween.getValue());
                    var newColorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                        { r: this.heroColor.r,       g: this.heroColor.g,       b: this.heroColor.b },
                        { r: this.invincibleColor.r, g: this.invincibleColor.g, b: this.invincibleColor.b },
                        100,
                        value
                    );
                    var color = Phaser.Display.Color.GetColor(newColorObject.r, newColorObject.g, newColorObject.b);
                    this.setTint(color);
                    //console.log("in onupdate, this = ", this);
                }
            });
        }
    }

    doubleGun() {
        this.gun2 = new Gun(this.scene, 0, 0, 'gun').setOrigin(0.5, 0.5);
        this.gun2.player = player;
        this.gun2.distanceFromPlayer = 20;
        this.gun2.offsetY = 5;
        this.gun2.scale = 0.075;
        this.gun.scale = 0.075;
        this.type = "double";
    }

    upgrade(value, type, success){

        console.log("Picked upgrade ", type);
        console.log("Scene = ", this.scene);
        
        let Upgraded;
        if (success) Upgraded = this.scene.add.text(player.x + player.width*this.scale, player.y - player.height*this.scale + 5, '+' + value + " " + type, popUpConfig).setOrigin(0, 0.5).setDepth(3);
        else Upgraded = this.scene.add.text(player.x + player.width*this.scale, player.y - player.height*this.scale + 5, 'Maxed Out!', popUpConfig).setOrigin(0, 0.5).setDepth(3);
        this.scene.tweens.add({
            targets: Upgraded,
            alpha: 0,
            duration: 2000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                Upgraded.destroy();
            }
        });

        this.scene.sound.play('powerUp', { volume: 0.9 });

        // Place difficulty increase notification at the top of the screen
        let DiffText;
        if (gameDifficulty < 6) DiffText = this.scene.add.text(this.scene.cameras.main.scrollX + game.config.width/2.75, this.scene.cameras.main.scrollY + 150, 'Difficulty Increased!', diffConfig).setOrigin(0, 0.5).setDepth(3);
        else DiffText = this.scene.add.text(this.scene.cameras.main.scrollX + game.config.width/2.75, this.scene.cameras.main.scrollY + 150, 'Difficulty Maxed!', diffConfig).setOrigin(0, 0.5).setDepth(3);
        this.scene.tweens.add({
            targets: DiffText,
            alpha: 0,
            duration: 3000,
            ease: 'Linear',
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                DiffText.destroy();
            }
        });
    }

    fire(gun) {
        // Fires the Player's gun

        if (gun == 'gun1') this.gun.fire();
        else if (gun == 'gun2') this.gun2.fire();

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
            this.setTexture(this.idleSprite);
            //recover
        }

        this.gunUpdate();

        this.moveUpdate();

        this.decelUpdate();

        this.hurtUpdate();

        enemyBullets.forEach(bullet => {
            this.scene.physics.overlap(this, bullet, (enemy, collidedBullet) => {
                collidedBullet.destroy();
                this.takeDamage(bullet.damage, 100);
            }, null, this);
        });
    }

    // Player Updates

    gunUpdate() {
        // Player Firing Logic
        this.gun.update();
        if (this.gun2 != null) {
            this.gun2.update();
        }

        if (game.input.activePointer.isDown){
            //console.log("firing")
            if(this.isFiring){
                this.setTexture(this.firingSprite);
            }
            this.isFiring = true;
        } else {
            if (this.type == "minigun") this.gun.fireRate = 35;
            this.isFiring = false;
        }

        if(this.isFiring) {
            if (this.iframes == 0) this.setTexture(this.firingSprite); 
            else this.setTexture(this.hurtSprite);
            if (this.gun.fireCooldown <= 0 || (this.gun2 != null && this.gun2.fireCooldown <= 0)) {
                if (this.firingGun == 'gun1' && this.gun.fireCooldown <= 0) this.fire(this.firingGun);

                else if (this.firingGun == 'gun2' && this.gun2.fireCooldown <= 0) this.fire(this.firingGun);

                if (this.type == "minigun") {
                    if (this.gun.fireRate > this.gun.fireRateCap) this.gun.fireRate -= 5;
                    else this.gun.fireRate = this.gun.fireRateCap;
                }
                if (this.firingGun == 'gun1' && this.type == "double") {
                    this.firingGun = 'gun2';
                    this.gun2.fireCooldown = this.gun2.fireRate/2;
                }
                else if (this.firingGun == 'gun2' && this.type == "double") {
                    this.firingGun = 'gun1';
                    this.gun.fireCooldown = this.gun.fireRate/2;
                }
            }
        } else if (this.iframes == 0) {
            this.setTexture(this.idleSprite);
        }
    }

    moveUpdate() {
        // Player Directional Movement

        this.velocity.set(0,0);

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

    hurtUpdate() {
        spikesLayer.objects.forEach(
            (spike) => {
                const spikeRect = new Phaser.Geom.Rectangle(spike.x, spike.y, spike.width, spike.height);
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), spikeRect)) {
                    this.takeDamage(1, 100);
                }
            }
        )
        
        speedLayer.objects.forEach(
            (speedTile) => {
                const speedTileRect = new Phaser.Geom.Rectangle(speedTile.x, speedTile.y, speedTile.width, speedTile.height);
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), speedTileRect)) {
                    this.y -= 100;
                }
            }
        )
    }
}