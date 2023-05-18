class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){
        this.load.path = 'assets/';
        this.load.image('player_idle',  'Candy_Corn_Idle.png');
        this.load.image('player_firing','Candy_Corn_Firing.png');
        this.load.image('background',   'ph_background.png');
        this.load.image('gun',          'player_gun.png');
        this.load.image('playerbullet', 'ph_bullet.png');
        this.load.image('enemy',        'ph_enemy.png');
    }
    
    create() {
        if (game.settings.audioPlaying == true) {
            let backgroundMusic = this.sound.add('sfx_lobby');
            backgroundMusic.loop = true;
            backgroundMusic.play();
            game.settings.audioPlaying = true;
        }

        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Initialize score
        this.score = 0;

        this.initCanvasAndUI();

        // event
        //this.input.on('pointerdown',this.startDrag,this);

        //Spawn the background
        this.background = this.add.sprite(game.config.width / 2, game.config.height / 2, 'background');
        this.background.scale = 0.4;
        this.background.setDepth(-100);

        //Spawn player
        player = new Player(this, game.config.width/2, game.config.height/2, 'player_idle').setOrigin(0.5, 0.5);
        player.firingSprite = 'player_firing';
        player.gun = new Gun(this, 0, 0, 'gun').setOrigin(0.5, 0.5);
        player.gun.playerSprite = player;

        this.enemySpawnTimer = 200;
        this.enemySpawnRate = 300;
        this.enemiesPerSpawn = 3;
    }

    spawnEnemy(){
        var minDistFromPlayer = 150;

        var spawnPoint = new Phaser.Math.Vector2();
        do {
          spawnPoint.x = Phaser.Math.RND.between(0, game.config.width);
          spawnPoint.y = Phaser.Math.RND.between(0, game.config.height);
        } while (Phaser.Math.Distance.Between(player.x, player.y, spawnPoint.x, spawnPoint.y) <= minDistFromPlayer);
        
        var enemy = new ChocoBar(this, spawnPoint.x, spawnPoint.y, 'enemy').setOrigin(0.5, 0.5);
        enemies.push(enemy);
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        } 

        player.update();
        playerBullets.forEach(bullet => {
            bullet.update();
        })

        this.enemySpawnTimer--;
        if(this.enemySpawnTimer < 0){
            for(let i = 0; i < this.enemiesPerSpawn; i++){
                this.spawnEnemy();
            }
            this.enemySpawnTimer = this.enemySpawnRate;
        }
    }

    initCanvasAndUI(){
        // white borders
        this.gameOver = false;
        let rec = this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);
        rec = this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);
        rec = this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);
        rec = this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000000).setOrigin(0, 0);
        rec.setDepth(100);

        this.playAreaLeftPad  = 320;
        this.playAreaRightPad = 35;

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

        this.scoreCounter = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding, 'Score: ' + this.score, scoreConfig);
    }
}