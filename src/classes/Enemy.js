
//NOTE: DO NOT EVER INSTANTIATE AN ENEMY OBJECT. 
//Enemy is a BASE CLASS that has features common to all enemies
//It should NEVER BE SPAWNED, ONLY SUBCLASSES

class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.scene = scene;

        //scene.input.on('pointerdown', this.fire.bind(this));
    }

    update(){

    }

    die(){
        this.destroy(); //this can be fleshed out later, add animations, sfx, maybe some particular effects or something
    }
} 