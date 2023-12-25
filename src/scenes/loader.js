import Phaser from "phaser";

class LoaderScreen extends Phaser.Scene {
    constructor() {
        super({
            key: 'loader'
        });
    }

    doPreload() {
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
        const loaderText = this.add.text(110, 220, `LOADING...`, { fontSize: '32px', fill: '#999999' });

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(100, 270, 600, 50);

        this.load.on('progress', (value) => {
            const progress = Math.floor(value * 100);
            console.log(`progressing... ${progress}%`);
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(110, 280, 580 * value, 30);
            loaderText.setText(`LOADING... ${progress}%`);
        }, this);
    
        this.load.on('fileprogress', (file) => {
            console.log(file.src);
        }, this);
    
        this.load.on('complete', () => {
            console.log('LOADED');
            this.input.stopPropagation();
            this.scene.start('title');
            this.scene.stop();
        }, this);
    
        this.doPreload();
        this.load.start();
    }
}

export default LoaderScreen;