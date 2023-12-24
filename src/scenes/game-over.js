import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'game-over',
            pack: {
                files: [
                    { type: 'image', key: 'title-game-over', url: './assets/game-over-800x800.png' }
                ]
            }
        });
    }

    create() {
        this.add.image(400, 400, 'title-game-over');
        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.stopPropagation();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('title');
            this.scene.stop();
        });
    }
}

export default GameOverScene;