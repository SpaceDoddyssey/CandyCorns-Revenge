let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 560,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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

let player;
let playerBullets = [];
let enemies = [];

let manualMoveSpeed = 1;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC;

let map = null;