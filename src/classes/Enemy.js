
//NOTE: DO NOT EVER INSTANTIATE AN ENEMY OBJECT. 
//Enemy is a BASE CLASS that has features common to all enemies
//It should NEVER BE SPAWNED, ONLY SUBCLASSES

class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.scoreValue = 1;
        this.player;
        this.markedForDeath = false; //NOTE: This variable is used to kill the enemies during a second pass, since you can't destroy() in a forEach

        this.hp = 2;
        //scene.input.on('pointerdown', this.fire.bind(this));
    }

    update() {
        
        if (this.x < this.player.x) this.x += 0.5;
        else this.x -= 0.5;
        if (this.y < this.player.y) this.y += 0.5;
        else this.y -= 0.5;
        
        playerBullets.forEach(bullet => {
            this.scene.physics.overlap(this, bullet, (enemy, collidedBullet) => {
                collidedBullet.destroy();
                this.takeDamage(bullet.damage);
            }, null, this);
        });
    }

    takeDamage(amount){
        this.hp -= amount;
        if(this.hp <= 0){
            this.die();
        }
    }
    
    die(){
        this.markedForDeath = true;
    }
} 