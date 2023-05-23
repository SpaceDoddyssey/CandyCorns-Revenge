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
            debug: false,
        }
    },
    scene: [ Menu, Play, GameOver ]
}

let game = new Phaser.Game(config);

// set UI

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let centerX = game.config.width/2;
let centerY = game.config.height/2;

const textSpacer = 64;

let PlayButton, Ready;

let player;
let startingHp = 10;
let playerHp = startingHp;
let playerBullets = [];
let highScore = 0;
let newHighScore = false;
let score = 0;

let enemyBullets = [];
let enemies = [];

let manualMoveSpeed = 30;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC, keyR;

let map = null;