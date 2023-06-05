class e1ChocoBar extends Enemy {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scale = 0.125;
        this.hp = 2;
        this.gun;
        this.hasGun = true;
        this.moveSpeed = 30;
    }

    followPlayer() {
        let playerX = this.player.x + this.scene.cameras.main.scrollX;
        let playerY = this.player.y + this.scene.cameras.main.scrollY;
        let thisX = this.x + this.scene.cameras.main.scrollX;
        let thisY = this.y + this.scene.cameras.main.scrollY;

        var angle = Phaser.Math.Angle.Between(thisX, thisY, playerX, playerY);

        this.forceX = Math.cos(angle) * this.moveSpeed;
        this.forceY = Math.sin(angle) * this.moveSpeed;

        this.body.setVelocity(this.forceX, this.forceY);
    }

    update() {
        this.followPlayer();

        super.update();
        this.gun.update();
    }
}