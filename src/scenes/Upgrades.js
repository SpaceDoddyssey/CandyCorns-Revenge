class Upgrades extends Phaser.Scene {
    constructor() {
        super({ key: 'upgradesScene' })
    }

    preload() {
        this.load.path = './assets/';
        this.load.image('damageup', 'damageup.png');
        this.load.image('firerateup', 'firerateup.png');
    }

    create() {
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F0000C',
            color: '#000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        let mainText = this.add.text(centerX, centerY - 200, ' Select an upgrade to continue (Not implemented) ', textConfig).setOrigin(0.5);

        this.add.sprite(centerX - 90, centerY - 100, 'damageup').setScale(2).setOrigin(0.5).setScale(0.45);
        let success;
        let upgrade1 = new Button(centerX, centerY - 100, 'Damage Up', this, () => {
            if (playerBulletDamage < 5) {
                playerBulletDamage += 1;
                success = true;
            }
            else success = false;
            this.scene.resume('playScene').stop()
            player.upgrade(1, "damage", success);
        })
        let upgrade2 = new Button(centerX, centerY , 'Bullet Speed Up', this, () => {
            if (playerBulletSpeed < 17) {
                playerBulletSpeed += 2;
                success = true;
            }
            else success = false;
            this.scene.resume('playScene').stop()
            player.upgrade(2, "bullet speed", success);
        })
        this.add.sprite(centerX - 100, centerY + 100, 'firerateup').setScale(2).setOrigin(0.5).setScale(0.2);
        let upgrade3 = new Button(centerX, centerY + 100, 'Fire Rate Up', this, () => {
            if (player.gun.fireRate > 10) {
                player.gun.fireRate -= 2;
                success = true;
            }
            else success = false;
            this.scene.resume('playScene').stop()
            player.upgrade(2, "fire rate", success);
        })

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }
}