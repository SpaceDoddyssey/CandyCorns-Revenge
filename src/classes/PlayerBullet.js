class PlayerBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, rotation) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scale = 0.3;
        
        const circleRadius = Math.max(this.width, this.height) / 2;
        this.body.setCircle(circleRadius);
        
        this.damage = 1;
        this.speed = 7 ;
        this.rotation = rotation;
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
        