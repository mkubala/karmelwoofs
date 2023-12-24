import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'title',
            pack: {
                files: [
                    { type: 'image', key: 'title', url: './assets/title-800x800.png' }
                ]
            }
        });
    }

    create() {
        this.add.image(400, 400, 'title');
        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.stopPropagation();
            this.scene.start('game');
            this.scene.stop();
        });
    }
}

export default TitleScene;