class e1ChocoBar extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scale = 0.125;
        this.hp = 3;
        this.gun;
    }

    update() {
        if (this.x < this.player.x) this.x += 0.5;
        else this.x -= 0.5;
        if (this.y < this.player.y) this.y += 0.5;
        else this.y -= 0.5;

        super.update();
        this.gun.update();
    }
}