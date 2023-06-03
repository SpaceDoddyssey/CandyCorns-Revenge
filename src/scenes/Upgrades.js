class Upgrades extends Phaser.Scene {
    constructor(player) {
        super({ key: 'upgradesScene' })
        this.player = player;
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

        let upgrade1 = new Button(centerX, centerY - 100, 'upgrade 1', this, () => {
            this.scene.resume('playScene').stop()
        })
        let upgrade2 = new Button(centerX, centerY , 'upgrade 2', this, () => {
            this.scene.resume('playScene').stop()
        })
        let upgrade3 = new Button(centerX, centerY + 100, 'upgrade 3', this, () => {
            this.scene.resume('playScene').stop()
        })

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }
}