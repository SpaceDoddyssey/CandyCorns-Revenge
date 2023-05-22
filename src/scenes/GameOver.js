class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    preload() {
        
    }

    create() {
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        let textConfig = {
            fontFamily: 'Georgia',
            fontSize: '40px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 15,
                bottom: 15,
                right: 15,
                left: 15
            },
            fixedWidth: 0
        }

        // check for high score in local storage
        // uncomment console.log statements if you need to debug local storage
        if(localStorage.getItem('highscore') != null) {
            let storedScore = parseInt(localStorage.getItem('highscore'));
            //console.log(`storedScore: ${storedScore}`);
            // see if current score is higher than stored score
            if(score > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('highscore', score.toString());
                highScore = score;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('highscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = score;
            localStorage.setItem('highscore', highScore.toString());
            newHighScore = true;
        }

        // add GAME OVER text
        if(newHighScore) {
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding - 220, 'New High Score!', textConfig).setOrigin(0.5);
        }

        this.add.text(centerX, centerY + textSpacer, `${score} number of enemies defeated`, textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*2,`This browser's best: ${highScore}`, textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*3, `Press R to Restart`, textConfig).setOrigin(0.5);
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(keyR)) {

            // start next scene
            score = 0;
            playerHp = startingHp;
            this.scene.start('playScene');
        }
    }
}
