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
    scene: [ Menu, Play, GameOver, Pause, Upgrades, Credits ]
}

let game = new Phaser.Game(config);

// set UI

let borderUISize = game.config.height / 35;
let borderPadding = borderUISize / 10;

let centerX = game.config.width/2;
let centerY = game.config.height/2;

const textSpacer = 64;

let player;
let startingHp = 30;
let playerHp = startingHp;
let playerBullets = [];
let playerBulletDamage = 1;
let playerBulletSpeed = 6;
let maxedUpgrades = [];

let highScore = 0;
let newHighScore = false;
let score = 0;

let enemyBullets = [];
let enemies = [];

let skulls = [];

let manualMoveSpeed = 30;

let keyUP, keyLEFT, keyDOWN, keyRIGHT, keyESC, keyR, keyPause, keyFullscreen;

let menuAudio = false;
let gameAudio = false;

let map = null;
let spikesLayer = null;
let skullsLayer = null;
//let speedLayer = null;
let objectLayer = null;
let borderLayer = null;

let gameDifficulty = 1;
let maxDifficulty = 6;

let bossActive = false;
let boss = null;
let playResume = false;

const popUpConfig = {
    fontFamily: 'Courier',
    fontSize: '18px',
    color: '#000',
    align: 'center'
}

const diffConfig = Object.assign({}, popUpConfig, { fontSize: '24px', color:'#ff0000' });

const bossIntroConfig = {
    fontFamily: 'Courier',
    fontSize: '48px',
    color: '#FF0000',
    align: 'center'
}

let textConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F0000C',
    color: '#000',
    align: 'center',
    padding: {
        top: 5,
        bottom: 5,
    },
    fixedWidth: 0
}

// Score text
const scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    fixedWidth: 170,
    setDepth: 0
}

const timeConfig = Object.assign({}, scoreConfig, { fixedWidth: 160 });
const gameOverConfig = Object.assign({}, scoreConfig, { fontSize: '56px', align: 'center', fixedWidth: 375 });
const restartConfig = Object.assign({}, scoreConfig, { align: 'center', fixedWidth: 380 });
const difficultyConfig = Object.assign({}, scoreConfig, { align: 'center', fixedWidth: 250 });