class PlayerBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 4;
        this.rotation;
    }

    update(){
        this.x += Math.cos(this.rotation) * this.speed;
        this.y += Math.sin(this.rotation) * this.speed;

        if(this.x < -this.width  || this.x > game.config.width + this.width 
            || this.y < -this.height || this.y > game.config.height + this.height){
                this.destroy();
            }
    }
}
        