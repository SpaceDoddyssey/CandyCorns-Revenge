class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.audio('gunfire', 'player_gun_sound.wav');
        this.load.audio('hit', 'player_damaged.wav');
        this.load.audio('death', 'enemydeath.wav');
        
        this.load.image('TitleScreen', 'TitleScreen.png');
        this.load.image('TitleBackground', 'TitleBackground.png');
    }

    create() {
        // Add background image to the center of the screen
        this.add.image(centerX, centerY, 'TitleBackground');
        this.add.image(centerX + 10, centerY, 'TitleScreen').setScale(1.1);
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '12px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // show menu text
        let storyText    = this.add.text(centerX, centerY - borderUISize * 4, ' Candy Corn is tired of\n being called not a real candy. \n Now he takes his vengeance! ', menuConfig).setOrigin(0.5);
        let tutorialText = this.add.text(centerX, centerY - borderUISize * 1.4, ' Click to fire \n Hold to continue firing \n P to Pause, F to toggle Fullscreen ', menuConfig).setOrigin(0.5, 0);
        menuConfig.backgroundColor = '#FF0000';
        menuConfig.fontSize = '24px';


        let PlayButton = new Button(centerX, centerY + borderUISize * 4, ' Play ', this, () =>
        {
          game.settings = {
            audioPlaying: true
          }
          this.scene.stop().start('playScene');
        });

        const CreditsButton = new Button(centerX, centerY + borderUISize * 7, ' Credits ', this, () =>
        {
          game.settings = {
            audioPlaying: true
          }
          this.scene.stop().start('creditsScene');
        });
    }

    update() {
      if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
        this.scale.toggleFullscreen();
      }
    }
}