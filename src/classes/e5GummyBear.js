class e5GummyBear extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scale = 0.3;
        this.hp = 4;
        this.moveSpeed = 10;
        this.firingAngle = 0;
        this.recoil = -100000;
        this.decelerate = 0.8;

        this.damage = 3;

        this.fireRate = 1000;
        this.fireCooldown = 500;
        this.forceX = 0;
        this.forceY = 0;
    }

    followPlayer() {
        let playerX = this.player.x + this.scene.cameras.main.scrollX;
        let playerY = this.player.y + this.scene.cameras.main.scrollY;
        let thisX = this.x + this.scene.cameras.main.scrollX;
        let thisY = this.y + this.scene.cameras.main.scrollY;

        this.firingAngle = Phaser.Math.Angle.Between(thisX, thisY, playerX, playerY);

        this.moveX = Math.cos(this.firingAngle) * this.moveSpeed;
        this.moveY = Math.sin(this.firingAngle) * this.moveSpeed;

        this.body.setVelocity(this.moveX, this.moveY);

        // Flip sprite to face player
        if (this.firingAngle > Math.PI / 2 + 0.01 || this.firingAngle < -Math.PI / 2 - 0.01){
            this.flipX = true;
        } else {
            this.flipX = false;
        }

        // if above player, swap to sprite 2
        if (this.firingAngle > 0.01) {
            this.setTexture('gummybear2');
        }

        // if below player, swap to sprite 3
        if (this.firingAngle < -0.01) {
            this.setTexture('gummybear3');
        }

        // if left or right of player, swap to sprite 1
        if (this.firingAngle < Math.PI / 2 + 0.01 && this.firingAngle > Math.PI / 2 - 0.01) {
            this.setTexture('gummybear1');
        }

    }

    update() {
        this.followPlayer();

        super.update();

        if (this.fireCooldown > 0) {
            this.fireCooldown -= 1;
        }
        else {
            this.fire();
        }

        this.decelUpdate();
    }

    fire() {
        this.offsetX = this.width*this.scale/2;

        //change offset to negative if sprite is flipped
        if (this.flipX) {
            this.offsetX = -this.offsetX;
        }

        let bullet = new EnemyBullet(this.scene, this.x + this.offsetX, this.y, 'enemybullet').setOrigin(0.5, 0.5).setScale(0.6);
        bullet.speed = 3;
        bullet.damage = this.damage;
        bullet.rotation = this.firingAngle;
        enemyBullets.push(bullet);
        this.fireCooldown = this.fireRate;

        this.forceX = Math.cos(this.firingAngle) * this.recoil;
        this.forceY = Math.sin(this.firingAngle) * this.recoil;

        this.body.setAcceleration(this.forceX, this.forceY);
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