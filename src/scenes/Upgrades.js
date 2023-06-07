class Upgrades extends Phaser.Scene {
    constructor() {
        super({ key: 'upgradesScene' })
    }

    preload() {
        this.load.path = './assets/';
        this.load.image('damageup', 'uDamageUp.png');
        this.load.image('firerateup', 'uFireRateUp.png');
        this.load.image('bulletspeedup', 'uBulletSpeedUp.png');
    }

    create() {
        this.maxUpgrades = 3;
        this.currentUpgrades = 0;
        this.verticalSpacing = -100;
        this.potentialUpgrades = [1, 2, 3, 4];

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

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update() {
        console.log("Current upgrades: ", this.currentUpgrades);
        if (this.currentUpgrades < this.maxUpgrades) {
            let upgrade = this.potentialUpgrades[Math.floor(Math.random() * this.potentialUpgrades.length)];
            this.upgradeSelection(upgrade);
            this.potentialUpgrades.splice(this.potentialUpgrades.indexOf(upgrade), 1);
            this.currentUpgrades++;
            this.verticalSpacing += 100;
        }
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }

    upgradeSelection(num) {
        let success;
        if (num == 1) { 
            this.add.sprite(centerX - 90, centerY + this.verticalSpacing, 'damageup').setScale(2).setOrigin(0.5).setScale(0.45);
            let upgrade1 = new Button(centerX, centerY + this.verticalSpacing, 'Damage Up', this, () => {
                if (playerBulletDamage < 5) {
                    playerBulletDamage += 1;
                    success = true;
                }
                else success = false;
                this.scene.resume('playScene').stop()
                player.upgrade(1, "damage", success);
                if (gameDifficulty < 5) gameDifficulty++;
            })
        }
        else if (num == 2) {
            this.add.sprite(centerX - 130, centerY + this.verticalSpacing, 'bulletspeedup').setScale(2).setOrigin(0.5).setScale(0.2);
            let upgrade2 = new Button(centerX, centerY + this.verticalSpacing, 'Bullet Speed Up', this, () => {
                if (playerBulletSpeed < 17) {
                    playerBulletSpeed += 2;
                    success = true;
                }
                else success = false;
                this.scene.resume('playScene').stop()
                player.upgrade(2, "bullet speed", success);
                if (gameDifficulty < 5) gameDifficulty++;
            })
        }
        else if (num == 3) {
            this.add.sprite(centerX - 100, centerY + this.verticalSpacing, 'firerateup').setScale(2).setOrigin(0.5).setScale(0.2);
            let upgrade3 = new Button(centerX, centerY + this.verticalSpacing, 'Fire Rate Up', this, () => {
                let upgradeValue = 0;
                if (player.gun.type == "gun" && player.gun.fireRate > 10) {
                    player.gun.fireRate -= 2;
                    upgradeValue = 2;
                    success = true;
                }
                else if (player.gun.type == "minigun" && player.gun.fireRateCap > 4) {
                    player.gun.fireRateCap -= 1;
                    upgradeValue = 1;
                    success = true;
                }
                else success = false;
                this.scene.resume('playScene').stop()
                player.upgrade(upgradeValue, "fire rate", success);
                if (gameDifficulty < 5) gameDifficulty++;
            })
        }
        else if (num == 4) {
            this.add.sprite(centerX - 100, centerY + this.verticalSpacing, 'minigun').setScale(2).setOrigin(0.5).setScale(0.2);
            let upgrade4 = new Button(centerX, centerY + this.verticalSpacing, 'Minigun', this, () => {
                if (player.gun.type != "minigun") {
                    player.gun.fireRateCap = 10;
                    success = true;
                }
                else success = false;
                player.gun.setTexture('minigun');
                player.gun.setScale(0.2);
                player.gun.recoil = -35000;
                player.gun.type = "minigun";
                player.gun.spread = 0.05;
                this.scene.resume('playScene').stop()
                player.upgrade(1, "minigun", success);
                if (gameDifficulty < 5) gameDifficulty++;
            })
        }
    }
}