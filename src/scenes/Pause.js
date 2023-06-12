class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' })
    }

    create() {
        let pauseButton = new Button(centerX, centerY + 100, '(P)ause', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume('playScene').stop()
        })

        let restartButton = new Button(centerX, centerY, '(R)estart', this, () => {
            // .resume will start the update loop of the target scene again
            // .stop will shutdown this scene, clear its display list, timers, etc.
            this.scene.resume('playScene').stop();
            var sceneRestart = this.scene.get('playScene');
            this.sound.stopAll();
            gameAudio = false;
            sceneRestart.scene.restart();
        })

        // input
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            // same as above
            this.scene.resume('playScene').stop()
        }
        if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            // same as above
            this.scene.resume('playScene').stop();
            var sceneRestart = this.scene.get('playScene');
            this.sound.stopAll();
            gameAudio = false;
            sceneRestart.scene.restart();
        }
    }
}