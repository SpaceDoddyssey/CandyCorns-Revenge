let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let PlayButton, Ready;

let playerBullets = [];

let manualMoveSpeed = 1;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC;