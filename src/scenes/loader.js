import Phaser from "phaser";

class LoaderScreen extends Phaser.Scene {
    constructor() {
        super({
            key: 'loader'
        });
    }

    preload() {
        this.load.image( 'title', './assets/title-800x800.jpg');
        this.load.image('title-game-over', './assets/game-over-800x800.jpg');
        this.load.image('game-set', './assets/game-set-800x800.jpg');
        this.load.image('bomb', './assets/bomb.png');
        this.load.image('heart', './assets/heart.png');
        this.load.spritesheet('dog', 
            'assets/dog.png',
            { frameWidth: 92, frameHeight: 60 }
        );
        this.load.spritesheet('bone',
            './assets/bone.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    create() {
        this.add.text(400, 220, `LOADING...`, { fontSize: '32px', fill: '#FFFFFF' });

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(200, 270, 600, 50);

        this.load.on('progress', function (value) {
            console.log('progressing...');
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(250, 280, 300 * value, 30);
        }, this);
    
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
    
        this.load.on('complete', function () {
            console.log('LOADED');
        }, this);
    
        this.load.start();
    }
}

export default LoaderScreen;