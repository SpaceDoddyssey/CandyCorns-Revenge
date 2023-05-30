class e1ChocoBar extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scale = 0.125;
        this.hp = 2;
        this.gun;
        this.hasGun = true;
        this.movespeed = 0.5;
    }

    update() {
        if      (this.x < this.player.x - 1) this.x += this.movespeed;
        else if (this.x > this.player.x + 1) this.x -= this.movespeed;
        if      (this.y < this.player.y - 1) this.y += this.movespeed;
        else if (this.y > this.player.y + 1) this.y -= this.movespeed;

        super.update();
        this.gun.update();
    }
}