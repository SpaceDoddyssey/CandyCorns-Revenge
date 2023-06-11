class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create(){
        let creditsConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(centerX, centerY - 180, ' Programming: \n Cameron Dodd    Hung Nguyen', creditsConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 60,  ' Art: \n Jorge Gomez    Matthew Guo ', creditsConfig).setOrigin(0.5);
        
        creditsConfig.backgroundColor = '#113311';
        const menuButton = new Button(centerX, centerY + 190, ' Return to Menu ', this, () =>
        {
          this.scene.start('menuScene');
        });

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }
    }
}