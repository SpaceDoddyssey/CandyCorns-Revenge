class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('player_idle',  'Candy_Corn_Idle.png');
        this.load.image('player_firing','Candy_Corn_Firing.png');
        this.load.image('player_hurt',  'Candy_Corn_Hurt.png');
        this.load.image('background',   'ph_background.png');
        this.load.image('gun',          'player_gun.png');
        this.load.image('minigun',       'minigun.png');
        this.load.image('playerbullet', 'player_bullet.png');
        this.load.image('enemybullet',  'ph_enemy_bullet.png');
        this.load.image('chocobar',     'e1_chocobar.png');
        this.load.image('e1_gun',       'e1_gun.png');
        this.load.image('lollipop1',    'e2Lollipop1.png');
        this.load.image('lollipop2',    'e2Lollipop2.png');
        this.load.image('jawbreaker',   'e3Jawbreaker.png');  
        this.load.image('marshmallow',  'e4Marshmallow.png');
        this.load.image('gummybear1',    'e5GummyBear1.png');
        this.load.image('gummybear2',   'e5GummyBear2.png');
        this.load.image('gummybear3',   'e5GummyBear3.png');
        this.load.image('jawbreakerHurt', 'b1JawbreakerHurt.png');
        this.load.image('jawbreakerDead', 'b1JawbreakerDead.png');
        this.load.image('spike',        'spike.png');      
        this.load.image('speedTile',    'speedTile.png');
        this.load.image('tilesetImage', 'CandyCornRevenge_Tileset.png');
        this.load.tilemapTiledJSON('tilemapJSON', 'CCR_Tileset.json');
    }
    
    create() {
        maxedUpgrades = [];
        gameDifficulty = 1;
        this.followBoss = false;
        this.followBossTime = 350;
        this.bossIntroText = null;
        enemyBullets = [];
        enemies = [];
        playerBullets = [];
        if (game.settings.audioPlaying == true) {
            /*let backgroundMusic = this.sound.add('sfx_lobby');
            backgroundMusic.loop = true;
            backgroundMusic.play();*/
            game.settings.audioPlaying = true;
        }

        keyUP    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyDOWN  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyFullscreen = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        //Set up tilemap
        map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('CandyCornRevenge_Tileset', 'tilesetImage');
        const groundLayer = map.createLayer('Ground', tileset, 0, 0).setDepth(-1);
        borderLayer = map.createLayer('Border', tileset, 0, 0).setDepth(-1);
        objectLayer = map.createLayer('Objects', tileset, 0, 0).setDepth(-1);

        spikesLayer = map.getObjectLayer('Spikes');
        speedLayer = map.getObjectLayer('SpeedTiles');

        objectLayer.setCollisionByProperty({playerCollidable: true});
        borderLayer.setCollisionByProperty({playerCollidable: true});

        // spawn player
        const playerSpawn = map.findObject('PlayerSpawn', obj => obj.name === 'playerSpawn');
        player = new Player(this, playerSpawn.x, playerSpawn.y, 'player_idle').setOrigin(0.5, 0.5);
        player.gun = new Gun(this, 0, 0, 'gun').setOrigin(0.5, 0.5);
        player.gun.player = player;
        player.type = "gun";
        player.firingGun = 'gun1';

        if(spikesLayer && spikesLayer.objects){
			spikesLayer.objects.forEach(
				(object) => {
                    let spike = this.physics.add.sprite(object.x + object.width/2, object.y - object.height/2, 'spike');
                    //set immovable
                    spike.body.immovable = true;
                    spike.setScale(0.2);
                    spike.setDepth(0);
                    this.physics.add.overlap(player, spike);
				}
			);
		}

        if (speedLayer && speedLayer.objects){  
            speedLayer.objects.forEach(
                (object) => {
                    let speedTile = this.physics.add.sprite(object.x + object.width/2, object.y - object.height/2, 'speedTile');
                    speedTile.body.immovable = true;
                    speedTile.setScale(0.4);
                    speedTile.setDepth(0);
                    this.physics.add.overlap(player, speedTile);
                }
            );
        }

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        player.body.setCollideWorldBounds(true);
        this.physics.add.collider(player, objectLayer);
        this.physics.add.collider(player, borderLayer);

        this.enemySpawnTimer = 20;
        this.enemySpawnRate = 450;
        this.fastestAllowedSpawnRate = 250;
        this.enemiesPerSpawn = 3;

        this.upgradesRate = 3000;
        this.upgradesTimer = this.upgradesRate;

        this.initCanvasAndUI();

        this.frameTime = 0;
    }

    spawnEnemy() {
        var minDistFromPlayer = 250;
        var maxDistFromPlayer = 1350; 

        var spawnPoint = new Phaser.Math.Vector2();
        do {
          spawnPoint.x = Phaser.Math.RND.between(50, map.widthInPixels - 50);
          spawnPoint.y = Phaser.Math.RND.between(50, map.heightInPixels - 50);
        } while (Phaser.Math.Distance.Between(player.x, player.y, spawnPoint.x, spawnPoint.y) <= minDistFromPlayer
              || Phaser.Math.Distance.Between(player.x, player.y, spawnPoint.x, spawnPoint.y) >= maxDistFromPlayer );

        var enemy;

        if (gameDifficulty == 1) {
            enemy = this.difficultyOne(spawnPoint);
        } else if (gameDifficulty == 2) {
            enemy = this.difficultyTwo(spawnPoint);
            enemy.hp += 1;
        } else if (gameDifficulty == 3) {
            enemy = this.difficultyThree(spawnPoint);
            enemy.hp += 2;
            enemy.damage += 1;
        } else if (gameDifficulty == 4) {
            enemy = this.difficultyFour(spawnPoint);
            enemy.hp += 3;
            enemy.damage += 2;
        } else if (gameDifficulty == 5) {
            enemy = this.difficultyFive();
            boss = enemy;
            this.followBoss = true;

            this.bossIntroText = this.add.text(this.cameras.main.scrollX + (game.config.width - 250)/2, this.cameras.main.scrollY, 'JAWBREAKER!!', bossIntroConfig).setOrigin(0, 0.5).setDepth(3);
            this.tweens.add({
                targets: this.bossIntroText,
                alpha: 0,
                duration: 3500,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    this.bossIntroText.destroy();
                }
            });
        } else if (gameDifficulty == 6) {
            enemy = this.difficultySix(spawnPoint);
            enemy.hp += 5;
            enemy.damage += 3;
        }

        if (!enemy.boss) this.physics.add.collider(enemy, objectLayer);
        this.physics.add.collider(enemy, borderLayer);

        enemy.player = player;
        enemies.push(enemy);
    }

    enemyWave() {
        this.enemySpawnTimer--;
        if (this.enemySpawnTimer < 0) {
            for (let i = 0; i < this.enemiesPerSpawn; i++) {
                this.spawnEnemy();
            }
            this.enemySpawnTimer = this.enemySpawnRate;
            if (this.enemySpawnRate > this.fastestAllowedSpawnRate){
                this.enemySpawnRate -= 10;
            }
        }
    }

    difficultyOne(spawnPoint) {
        var enemy;
        enemy = new e2Lollipop(this, spawnPoint.x, spawnPoint.y, 'lollipop').setOrigin(0.5, 0.5);
        return enemy;
    }

    difficultyTwo(spawnPoint) {
        var randomEnemy = Phaser.Math.RND.between(1, 3);
        var enemy;
        if (randomEnemy == 1) {
            enemy = new e1ChocoBar(this, spawnPoint.x, spawnPoint.y, 'chocobar').setOrigin(0.5, 0.5);
            enemy.gun = new e1Gun(this, 0, 0, 'e1_gun');
            enemy.gun.e1Sprite = enemy;
        } else enemy = new e2Lollipop(this, spawnPoint.x, spawnPoint.y, 'lollipop').setOrigin(0.5, 0.5);
        return enemy;
    }

    difficultyThree(spawnPoint) {
        var randomEnemy = Phaser.Math.RND.between(1, 6);
        var enemy;
        if (randomEnemy == 1 || randomEnemy == 2) {
            enemy = new e1ChocoBar(this, spawnPoint.x, spawnPoint.y, 'chocobar').setOrigin(0.5, 0.5);
            enemy.gun = new e1Gun(this, 0, 0, 'e1_gun');
            enemy.gun.e1Sprite = enemy;
        } else if (randomEnemy == 6) {
            enemy = new e4Marshmallow(this, spawnPoint.x, spawnPoint.y, 'marshmallow').setOrigin(0.5, 0.5);
        } 
        else 
            enemy = new e2Lollipop(this, spawnPoint.x, spawnPoint.y, 'lollipop').setOrigin(0.5, 0.5);
        return enemy;
    }

    difficultyFour(spawnPoint) {
        var randomEnemy = Phaser.Math.RND.between(1, 12);
        var enemy;
        if (randomEnemy == 1 || randomEnemy == 2 || randomEnemy == 3) {
            enemy = new e1ChocoBar(this, spawnPoint.x, spawnPoint.y, 'chocobar').setOrigin(0.5, 0.5);
            enemy.gun = new e1Gun(this, 0, 0, 'e1_gun');
            enemy.gun.e1Sprite = enemy;
        }
        else if (randomEnemy == 4 || randomEnemy == 5) {
            enemy = new e4Marshmallow(this, spawnPoint.x, spawnPoint.y, 'marshmallow').setOrigin(0.5, 0.5);
        } else if (randomEnemy == 6 || randomEnemy == 7) {
            enemy = new e5GummyBear(this, spawnPoint.x, spawnPoint.y, 'gummybear1').setOrigin(0.5, 0.5);
            enemy.setTint(Phaser.Math.RND.between(0, 0xffffff));
        }
        else
            enemy = new e2Lollipop(this, spawnPoint.x, spawnPoint.y, 'lollipop').setOrigin(0.5, 0.5);
        return enemy;
    }

    difficultyFive() {
        var enemy;
        enemy = new b1Jawbreaker(this, centerX, centerY, 'jawbreaker').setOrigin(0.5, 0.5);
        return enemy;
    }

    difficultySix(spawnPoint) {
        var randomEnemy = Phaser.Math.RND.between(1, 20);
        var enemy;
        if (randomEnemy == 1 || randomEnemy == 2 || randomEnemy == 3 || randomEnemy == 4) {
            enemy = new e1ChocoBar(this, spawnPoint.x, spawnPoint.y, 'chocobar').setOrigin(0.5, 0.5);
            enemy.gun = new e1Gun(this, 0, 0, 'e1_gun');
            enemy.gun.e1Sprite = enemy;
        }
        else if (randomEnemy == 5 || randomEnemy == 6 || randomEnemy == 7) {
            enemy = new e4Marshmallow(this, spawnPoint.x, spawnPoint.y, 'marshmallow').setOrigin(0.5, 0.5);
        } else if (randomEnemy == 8 || randomEnemy == 9 || randomEnemy == 10) {
            enemy = new e5GummyBear(this, spawnPoint.x, spawnPoint.y, 'gummybear1').setOrigin(0.5, 0.5);
            enemy.setTint(Phaser.Math.RND.between(0, 0xffffff));
        }
        else if (randomEnemy == 11 || randomEnemy == 12) {
            enemy = new e3Jawbreaker(this, spawnPoint.x, spawnPoint.y, 'jawbreaker').setOrigin(0.5, 0.5);
        }
        else
            enemy = new e2Lollipop(this, spawnPoint.x, spawnPoint.y, 'lollipop').setOrigin(0.5, 0.5);
        return enemy;
    }

    update(time, delta) {
        //This code limits the update rate to 60/s
        this.frameTime += delta;
        if(this.frameTime < 16.5){
            return;
        }
        this.frameTime = 0;

        if (!this.followBoss) this.cameras.main.startFollow(player, true, 0.25, 0.25);
        else if (this.followBossTime > 0 ) {
            this.cameras.main.startFollow(boss, true, 0.25, 0.25);
            this.followBossTime--;
        } else this.followBoss = false;

        //This code is for bebugging purposes; It artificially chokes the fps by doing a buttload of unnecessary math each update
        //for(let i = 0; i < 50000000; i++){ let j = 0; j++; j *= 13; j /= 12; }

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
                if (enemy.boss == true) {
                    bossActive = false;
                    boss = null;
                    this.scene.pause().launch('upgradesScene');
                    if (gameDifficulty < maxDifficulty) gameDifficulty++;
                    this.upgradesTimer = this.upgradesRate;
                }
                array.splice(index, 1);
                enemy.destroy();
                if (enemy.hasGun) enemy.gun.destroy();
                //console.log(this);
                this.addScore(enemy.scoreValue);
            }
        })

        if (Phaser.Input.Keyboard.JustDown(keyPause)) {
            // .pause will stop the update step but still render the scene
            // .launch will launch the target scene and run it in parallel with the invoking scene
            this.scene.pause().launch('pauseScene')
        }

        if(Phaser.Input.Keyboard.JustDown(keyFullscreen)){
            this.scale.toggleFullscreen();
        }

        this.upgradesTimer--;   
        console.log(bossActive);
        if(this.upgradesTimer < 0 && bossActive == false) {
            this.upgradesTimer = this.upgradesRate;
            this.scene.pause().launch('upgradesScene');
            if (gameDifficulty < maxDifficulty) gameDifficulty++;
        }

        if (playResume == true && !bossActive && gameDifficulty % 5 == 0) {
            this.spawnEnemy();
            bossActive = true;
            playResume = false;
        } 

        if (gameDifficulty % 5 != 0 && !bossActive) this.enemyWave();
    }

    uiUpdate() {
        this.scoreCounter.x = this.cameras.main.scrollX;
        this.scoreCounter.y = this.cameras.main.scrollY;

        // 170 is the Fixed Width value of scoreConfig, if there's a better way of grabbing that value, please replace the value
        
        this.hpCounter.x = this.cameras.main.scrollX + game.config.width - 170;
        this.hpCounter.y = this.cameras.main.scrollY;

        this.difficultyCounter.x = this.cameras.main.scrollX + (game.config.width - 250)/2;
        this.difficultyCounter.y = this.cameras.main.scrollY;
        this.difficultyCounter.text = 'Difficulty: ' + gameDifficulty;

        if (this.bossIntroText != null) {
            this.bossIntroText.x = this.cameras.main.scrollX + (game.config.width - this.bossIntroText.width)/2;
            this.bossIntroText.y = this.cameras.main.scrollY + 120;
        }
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

        // With a beyond borders map, UI should be later be constantly updated at a distance away from the player rather than a constant fixed distance.

        this.scoreCounter = this.add.text(this.cameras.main.scrollX, this.cameras.main.scrollY, 'Score: ' + score, scoreConfig).setDepth(3);
        this.hpCounter = this.add.text(this.cameras.main.scrollX + 500, this.cameras.main.scrollY, 'HP: ' + score, scoreConfig).setDepth(3);
        this.difficultyCounter = this.add.text(this.cameras.main.scrollX + 250, this.cameras.main.scrollY, 'Difficulty: ' + gameDifficulty, difficultyConfig).setDepth(3);
    }
}