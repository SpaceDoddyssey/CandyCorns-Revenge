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
        this.potentialUpgrades = ['Damage Up', 'Bullet Speed Up', 'Fire Rate Up', 'Minigun', 'Double Gun'];

        // Splice potential upgrades by all elements inside of maxedUpgrades
        for (let i = 0; i < maxedUpgrades.length; i++) {
            this.potentialUpgrades.splice(this.potentialUpgrades.indexOf(maxedUpgrades[i]), 1);
        }

        let mainText = this.add.text(centerX, centerY - 200, 'Select an upgrade to continue', textConfig).setOrigin(0.5);

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        this.maxDamage = 5;
        this.damageUpIncrease = 1;

        this.maxBulletSpeed = 17;
        this.bulletSpeedInc = 2;

        this.maxGunFireRate = 10;
        this.gunFireRateInc = -2;

        this.maxMinigunFireRateCap = 4;
        this.minigunFireRateInc = -1;

        this.maxDoubleFireRate = 15;
        this.doubleFireRateInc = -1;

        this.SkipButton = false;
    }

    update() {
        if (this.currentUpgrades < this.maxUpgrades) {
            let upgrade = this.potentialUpgrades[Math.floor(Math.random() * this.potentialUpgrades.length)];
            this.upgradeSelection(upgrade);
            this.potentialUpgrades.splice(this.potentialUpgrades.indexOf(upgrade), 1);
            this.currentUpgrades++;
            this.verticalSpacing += 100;
        } else {
            this.SkipButton = true;
        }

        if (this.SkipButton) {
            let Skip = new Button(centerX, centerY + this.verticalSpacing, 'Skip', this, () => {
                this.scene.resume('playScene').stop();
                if (gameDifficulty < maxDifficulty) gameDifficulty++;
            })
        }

        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }

    upgradeSelection(upgrade) {
        let success;
        if (upgrade == 'Damage Up') { 
            this.add.sprite(centerX - 90, centerY + this.verticalSpacing, 'damageup').setScale(2).setOrigin(0.5).setScale(0.45);
            let upgrade1 = new Button(centerX, centerY + this.verticalSpacing, 'Damage Up', this, () => {
                playerBulletDamage += this.damageUpIncrease;
                if (playerBulletDamage != this.maxDamage) success = true;
                else {
                    success = false;
                    maxedUpgrades.push('Damage Up');
                }
                
                this.scene.resume('playScene').stop();
                player.upgrade(this.damageUpIncrease, "damage", success);
            })
        }
        else if (upgrade == 'Bullet Speed Up') {
            this.add.sprite(centerX - 130, centerY + this.verticalSpacing, 'bulletspeedup').setScale(0.2).setOrigin(0.5);
            let upgrade2 = new Button(centerX, centerY + this.verticalSpacing, 'Bullet Speed Up', this, () => {
                playerBulletSpeed += this.bulletSpeedInc;
                if (playerBulletSpeed < this.maxBulletSpeed) success = true;
                else {
                    success = false;
                    maxedUpgrades.push('Bullet Speed Up');
                }
                
                this.scene.resume('playScene').stop();
                player.upgrade(this.bulletSpeedInc, "bullet speed", success);
            })
        }
        else if (upgrade == 'Fire Rate Up') {
            this.add.sprite(centerX - 100, centerY + this.verticalSpacing, 'firerateup').setScale(0.2).setOrigin(0.5);
            let upgrade3 = new Button(centerX, centerY + this.verticalSpacing, 'Fire Rate Up', this, () => {
                let upgradeValue = 0;
                if (player.type == "gun" && player.gun.fireRate > this.maxGunFireRate) {
                    player.gun.fireRate += this.gunFireRateInc;
                    upgradeValue = -this.gunFireRateInc;
                    if (player.gun.fireRate > this.maxGunFireRate) success = true;
                    else {
                        success = false;
                        maxedUpgrades.push('Fire Rate Up');
                    }
                }
                else if (player.type == "minigun" && player.gun.fireRateCap > this.maxMinigunFireRateCap) {
                    player.gun.fireRateCap += this.minigunFireRateInc;
                    upgradeValue = -this.minigunFireRateInc;
                    if (player.gun.fireRateCap > this.maxMinigunFireRateCap) success = true;
                    else {
                        success = false;
                        maxedUpgrades.push('Fire Rate Up');
                    }
                }
                else if (player.type == "double" && player.gun.fireRate > this.maxDoubleFireRate) {
                    player.gun.fireRate += this.doubleFireRateInc;
                    player.gun2.fireRate = player.gun.fireRate;
                    upgradeValue = -this.doubleFireRateInc;
                    if (player.gun.fireRate > this.maxDoubleFireRate) success = true;
                    else {
                        success = false;
                        maxedUpgrades.push('Fire Rate Up');
                    }
                }
                
                this.scene.resume('playScene').stop();
                player.upgrade(upgradeValue, "fire rate", success);
            })
        }
        else if (upgrade == 'Minigun') {
            this.add.sprite(centerX - 100, centerY + this.verticalSpacing, 'minigun').setScale(0.2).setOrigin(0.5);
            let upgrade4 = new Button(centerX, centerY + this.verticalSpacing, 'Minigun', this, () => {
                if (player.type != "minigun") {
                    if (player.type == "double") {
                        player.gun2.destroy();
                        player.gun2 = null;
                        maxedUpgrades.splice(maxedUpgrades.indexOf('Double Gun'));
                    }
                    player.gun.fireRateCap = 10;
                    success = true;
                    if (maxedUpgrades.includes('Fire Rate Up') && player.gun.fireRateCap > this.minigunFireRateCap) maxedUpgrades.splice(maxedUpgrades.indexOf('Fire Rate Up'));
                    maxedUpgrades.push('Minigun');
                }
                player.firingGun = 'gun1';
                player.gun.setTexture('minigun');
                player.gun.setScale(0.2);
                player.gun.recoil = -35000;
                player.type = "minigun";
                player.gun.spread = 0.05;
                
                this.scene.resume('playScene').stop();
                player.upgrade(1, "minigun", success);
            })
        }
        else if (upgrade == 'Double Gun') {
            this.add.sprite(centerX - 100, centerY + this.verticalSpacing - 15, 'gun').setScale(0.125).setOrigin(0.5);
            this.add.sprite(centerX - 100, centerY + this.verticalSpacing, 'gun').setScale(0.1).setOrigin(0.5);
            let upgrade5 = new Button(centerX, centerY + this.verticalSpacing, 'Double Gun', this, () => {
                if (player.type != "double") {
                    success = true;
                    maxedUpgrades.push('Double Gun');
                    if (player.type == "minigun") {
                        maxedUpgrades.splice(maxedUpgrades.indexOf('Minigun'));
                    }
                    if (player.gun.fireRate < 15) {
                        player.gun.fireRate = 15;
                        maxedUpgrades.push('Fire Rate Up');
                    }
                }
                player.gun.setTexture('gun');
                player.gun.spread = 0.03;
                player.gun.recoil = -40000;
                
                player.doubleGun();
                player.gun2.spread = 0.03;
                player.gun2.recoil = -40000;
                
                this.scene.resume('playScene').stop();
                player.upgrade(1, "double gun", success);
            })
        }
    }
}