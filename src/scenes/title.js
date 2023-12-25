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

        const text = this.add.text(250, 700, 'Press ENTER to start', { fontSize: '28px', fill: '#FFFFFF' });
        this.time.addEvent({
            delay: 600,
            callback: () => text.visible = !text.visible,
            callbackScope: this,
            loop: true
        });
    }
}

export default TitleScene;