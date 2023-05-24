class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('player_idle',  'Candy_Corn_Idle.png');
        this.load.image('player_firing','Candy_Corn_Firing.png');
        this.load.image('background',   'ph_background.png');
        this.load.image('gun',          'player_gun.png');
        this.load.image('playerbullet', 'ph_bullet.png');
        this.load.image('enemybullet',  'ph_enemy_bullet.png');
        this.load.image('chocobar',     'e1_chocobar.png');
        this.load.image('e1_gun',    'e1_gun.png');
        this.load.image('tilesetImage', 'tileset.png');
        this.load.tilemapTiledJSON('tilemapJSON', 'tilemap.json');
    }
    
    create() {
        enemyBullets = [];
        enemies = [];
        playerBullets = [];
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

        //Set up tilemap
        map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('tileset', 'tilesetImage');
        const bgLayer = map.createLayer('Background', tileset, 0, 0);
        const treeLayer = map.createLayer('Trees', tileset, 0, 0);

        treeLayer.setCollisionByProperty({collide: true});

        // spawn player
        const playerSpawn = map.findObject('Spawns', obj => obj.name === 'playerSpawn');
        player = new Player(this, playerSpawn.x, playerSpawn.y, 'player_idle').setOrigin(0.5, 0.5);
        player.firingSprite = 'player_firing';
        player.gun = new Gun(this, 0, 0, 'gun').setOrigin(0.5, 0.5);
        player.gun.playerSprite = player;

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player, true, 0.25, 0.25);
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        player.body.setCollideWorldBounds(true);
        this.physics.add.collider(player, treeLayer);

        this.enemySpawnTimer = 200;
        this.enemySpawnRate = 300;
        this.enemiesPerSpawn = 3;

        this.initCanvasAndUI();
    }

    spawnEnemy(){
        var minDistFromPlayer = 150;

        var spawnPoint = new Phaser.Math.Vector2();
        do {
          spawnPoint.x = Phaser.Math.RND.between(0, map.widthInPixels);
          spawnPoint.y = Phaser.Math.RND.between(0, map.heightInPixels);
        } while (Phaser.Math.Distance.Between(player.x, player.y, spawnPoint.x, spawnPoint.y) <= minDistFromPlayer);
        
        var enemy = new ChocoBar(this, spawnPoint.x, spawnPoint.y, 'chocobar').setOrigin(0.5, 0.5);
        enemy.player = player;
        enemy.gun = new ChocoGun(this, 0, 0, 'e1_gun');
        enemy.gun.chocoSprite = enemy;
        enemies.push(enemy);
    }

    update() {
        this.uiUpdate();
        if (this.gameOver) {
            this.scene.start("gameOverScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.game.sound.stopAll();
            this.scene.start("menuScene");
        } 

        player.update();
        this.hpCounter.text = 'HP: ' + playerHp;
        if (playerHp == 0) this.gameOver = true;
        playerBullets.forEach(bullet => {
            bullet.update(); })
        enemyBullets.forEach(bullet => {
            bullet.update(); })
        enemies.forEach((enemy, index, array) => {
            enemy.update(); 
            if (enemy.markedForDeath) {
                array.splice(index, 1);
                enemy.destroy();
                enemy.gun.destroy();
                //console.log(this);
                this.addScore(enemy.scoreValue);
            }
        })

        this.enemySpawnTimer--;
        if(this.enemySpawnTimer < 0){
            for(let i = 0; i < this.enemiesPerSpawn; i++){
                this.spawnEnemy();
            }
            this.enemySpawnTimer = this.enemySpawnRate;
        }
    }

    uiUpdate() {
        this.scoreCounter.x = this.cameras.main.scrollX;
        this.scoreCounter.y = this.cameras.main.scrollY;

        // 170 is the Fixed Width value of scoreConfig, if there's a better way of grabbing that value, please replace the value
        
        this.hpCounter.x = this.cameras.main.scrollX + game.config.width - 170;
        this.hpCounter.y = this.cameras.main.scrollY;
    }

    addScore(points){
        score += points;
        this.scoreCounter.text = 'Score: ' + score;
    }

    initCanvasAndUI(){
        // white borders
        this.gameOver = false;

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

        // With a beyond borders map, UI should be later be constantly updated at a distance away from the player rather than a constant fixed distance.

        this.scoreCounter = this.add.text(this.cameras.main.scrollX, this.cameras.main.scrollY, 'Score: ' + score, scoreConfig);
        this.hpCounter = this.add.text(this.cameras.main.scrollX + 500, this.cameras.main.scrollY, 'HP: ' + score, scoreConfig);
    }
}