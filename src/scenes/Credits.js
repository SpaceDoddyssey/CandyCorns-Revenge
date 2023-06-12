class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        this.load.image('CreditsBG', './assets/creditsBG.png');
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

        this.add.image(centerX, centerY, 'CreditsBG').setOrigin(0.5);

        this.add.text(centerX, centerY - 160, ' Programming: \n Cameron Dodd    Hung Nguyen ', creditsConfig).setOrigin(0.5);
        this.add.text(centerX, centerY - 80,  ' Art: \n Jorge Gomez    Matthew Guo ', creditsConfig).setOrigin(0.5);
        
        creditsConfig.fontSize = '14px';
        this.add.text(centerX, centerY, ' Menu music: \n Run Amok by Kevin MacLeod | https://incompetech.com/ \n Music promoted by https://www.chosic.com/free-music/all/ \n Creative Commons CC BY 3.0 \n https://creativecommons.org/licenses/by/3.0/ ', creditsConfig).setOrigin(0.5);;
        this.add.text(centerX, centerY + 90, ' Game music: \n Glory Eternal by Darren Curtis | https://www.darrencurtismusic.com/\n Music promoted by https://www.chosic.com/free-music/all/ \n Creative Commons CC BY 3.0 \n https://creativecommons.org/licenses/by/3.0/ ', creditsConfig).setOrigin(0.5);

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