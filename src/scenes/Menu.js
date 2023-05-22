class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      
    }

    create() {
        // menu text configuration
        let menuConfig = {
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

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 4 - borderPadding, 'ARTG FINAL', menuConfig).setOrigin(0.5);
        let tutorialText = this.add.text(game.config.width/2, game.config.height/2 + borderUISize, 'WASD to move, click to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        const PlayButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 6, 'PLAY', menuConfig).setOrigin(0.5).setInteractive();
        //-------------------------------------------
        Ready = false; //CHANGE TO REENABLE THE MENU
        //-------------------------------------------
        PlayButton.on('pointerdown', function (pointer)
        {
          this.setTint(0xff0000);
          Ready = true;
        });
        // define keys
    }

    update() {
      if (Ready == true) {
        game.settings = {
          audioPlaying: false //change once we have music
        }
        this.scene.start('playScene');
      }
    }
}