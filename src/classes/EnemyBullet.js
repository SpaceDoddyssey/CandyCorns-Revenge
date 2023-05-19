class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scale = 0.3;
        this.body.setCircle(22);
        this.damage = 1;
        this.speed = 1.5;
        this.rotation;
    }

    update(){
        this.x += Math.cos(this.rotation) * this.speed;
        this.y += Math.sin(this.rotation) * this.speed;

        if(this.x < -this.width  || this.x > map.widthInPixels + this.width 
            || this.y < -this.height || this.y > map.heightInPixels + this.height){
                this.destroy();
            }
    }
}
        