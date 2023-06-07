class e4Marshmallow extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scale = 0.075;
        this.minScale = 0.075;
        this.maxScale = 0.2;
        this.hp = 3;
        this.damage = 2;
        this.body.setImmovable();
    }
    
    update() {
        if (this.x < this.player.x - 0.5) {
            this.flipX = false;
        }
        else if (this.x > this.player.x + 0.5) {
            this.flipX = true;
        }

        // If enemy collides with player, player takes damage
        if (Math.abs(this.x - this.player.x) < this.width*this.scale && Math.abs(this.y - this.player.y) < this.height*this.scale) {
            this.player.takeDamage(this.damage, 150);
        }

        // Increase in size rapidly when player is near
        if(Math.abs(this.x - this.player.x) < 150 && Math.abs(this.y - this.player.y) < 150){
            if (this.scale < this.maxScale){
                this.scale += 0.0025;
            }
        }
        else {
            if (this.scale > this.minScale){
                this.scale -= 0.0025;
            }
        }

        super.update();
    }

}