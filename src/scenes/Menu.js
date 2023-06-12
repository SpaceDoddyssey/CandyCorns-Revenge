class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.loadingText = this.add.text(centerX, centerY, 'Loading...');
        this.load.path = 'assets/';
        this.load.audio('gunfire', 'player_gun_sound.wav');
        this.load.audio('hit', 'player_damaged.wav');
        this.load.audio('death', 'enemydeath.wav');
        this.load.audio('gunCock', 'gun-cock.wav');
        this.load.audio('powerUp', 'powerUp.wav' );
        this.load.audio('playerDeath', 'playerdeath.wav');
        
        this.load.audio('menuMusic', 'Run-Amok.mp3');
        this.load.audio('gameMusic', 'Glory-Eternal.mp3')

        this.load.image('TitleScreen', 'TitleScreen.png');
        this.load.image('TitleBackground', 'TitleBackground.png');
    }

    create() {
        // Add background image to the center of the screen
        this.add.image(centerX, centerY, 'TitleBackground');
        this.add.rectangle(centerX-10, centerY, 380, 390, 0xFFFFFF);
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


        let PlayButton = new Button(centerX - borderUISize * 4, centerY + borderUISize * 4, ' Play ', this, () =>
        {
          this.sound.play('gunCock', { volume: 1 });
          this.music.stop();
          this.scene.stop().start('playScene');
        });
        let GraderButton = new Button(centerX + borderUISize * 4, centerY + borderUISize * 4, ' Grader Mode ', this, () =>
        {
          playerHp = 999;
          this.sound.play('gunCock', { volume: 1 });
          this.music.stop();
          this.scene.stop().start('playScene');
        });

        const CreditsButton = new Button(centerX, centerY + borderUISize * 7, ' Credits ', this, () =>
        {
          this.scene.stop().start('creditsScene');
        });
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
          this.scale.toggleFullscreen();
        }

        if (menuAudio == false){
          menuAudio = true;
          this.music = this.sound.add('menuMusic', { volume: 0.5 });
          this.music.loop = true;
          this.music.play();
        }
    }
}