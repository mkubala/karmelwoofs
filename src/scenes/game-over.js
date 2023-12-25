import Phaser from 'phaser';
import { EventEmitter } from './event-emitter';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'game-over',
            pack: {
                files: [
                    { type: 'image', key: 'title-game-over', url: './assets/game-over-800x800.jpg' }
                ]
            }
        });
        this.score = 0;
        EventEmitter.on('score', (score) => {
            this.score = score
        });
    }

    create() {
        this.add.image(400, 400, 'title-game-over');

        const scoreText = this.add.text(300, 300, `Your score: ${this.score}`, { fontSize: '32px', fill: '#FFFFFF' });
        scoreText.setPosition((800 - scoreText.width) / 2, 300);
        scoreText.setShadow(2, 2, '#000000', 2, true, true);

        const text = this.add.text(250, 700, 'Press ENTER to restart', { fontSize: '28px', fill: '#FFFFFF' });
        this.time.addEvent({
            delay: 600,
            callback: () => text.visible = !text.visible,
            callbackScope: this,
            loop: true
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.input.stopPropagation();
            this.cameras.main.fadeOut(500, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            EventEmitter.emit('restart');
            this.scene.start('game');
            this.scene.stop();
        });
    }
}

export default GameOverScene;