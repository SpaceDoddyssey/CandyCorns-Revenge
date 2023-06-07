let config = {
    type: Phaser.WEBGL,
    width: 960,
    height: 540,
    scale: {
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.RESIZE
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 60
        }
    },
    scene: [ Menu, Play, GameOver, Pause, Upgrades ]
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
let startingHp = 30;
let playerHp = startingHp;
let playerBullets = [];
let playerBulletDamage = 1;
let playerBulletSpeed = 7;

let highScore = 0;
let newHighScore = false;
let score = 0;

let enemyBullets = [];
let enemies = [];

let manualMoveSpeed = 30;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC, keyR, keyPause, keyFullscreen;

let map = null;
let spikesLayer = null;
let speedLayer = null;
let objectLayer = null;
let borderLayer = null;