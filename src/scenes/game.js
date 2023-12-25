import Phaser from 'phaser';
import { EventEmitter } from './event-emitter';

const debugMode = false;
const numberOfLives = 5;

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'game',
            pack: {
                files: [
                    { type: 'image', key: 'game-set', url: './assets/game-set-800x800.png' },
                    { type: 'image', key: 'bomb', url: './assets/bomb.png' },
                    { type: 'image', key: 'heart', url: './assets/heart.png' }
                ]
            }
        });
        this.score = 0;
        this.lastDirection = 'left';
        this.jumps = false;
        this.respawning = false;
    }

    preload() {
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
        this.add.image(400, 400, 'game-set');
        
        const platforms = this.#createPlatforms();

        this.player = this.physics.add.sprite(100, 450, 'dog');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'iluminating-bone',
            frames: this.anims.generateFrameNumbers('bone', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dog', { start: 10, end: 17 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn-left',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 3 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'turn-right',
            frames: this.anims.generateFrameNumbers('dog', { start: 20, end: 23 }),
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dog', { start: 37, end: 30 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'jump-left',
            frames: this.anims.generateFrameNumbers('dog', { frames: [14] }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'jump-right',
            frames: this.anims.generateFrameNumbers('dog', { frames: [33] }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'sit-left',
            frames: this.anims.generateFrameNumbers('dog', { frames: [41] }),
            frameRate: 10
        });
        this.anims.create({
            key: 'sit-right',
            frames: this.anims.generateFrameNumbers('dog', { frames: [40] }),
            frameRate: 10
        });

        this.player.body.setGravityY(390);
        this.input.setHitAreaRectangle(this.player, 20, 20, 52, 80);
        this.physics.add.collider(this.player, platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.bones = this.#createBones();

        this.physics.add.collider(this.bones, platforms);

        this.physics.add.overlap(this.player, this.bones, this.#collectBone, null, this);

        this.scoreText = this.add.text(16, 12, 'score: 0', { fontSize: '24px', fill: '#000' });
        this.scoreText.setPosition(800 - this.scoreText.width - 30, 16);

        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, platforms);
        this.bombCollider = this.physics.add.collider(this.player, this.bombs, this.#hitBomb, null, this);

        this.lives = this.#createLives();
    }

    #createLives() {
        return this.lives = this.physics.add.staticGroup({
            key: 'heart',
            repeat: numberOfLives - 1,
            setXY: {
                x: 24,
                y: 24,
                stepX: 40
            }
        });
    }

    #collectBone(player, bone) {
        this.score += 1;
        this.scoreText.setText(`score: ${this.score}`);
        bone.disableBody(true, true);

        if (this.bones.countActive(true) === 0) {
            const offsetX = Phaser.Math.Between(-30, 30);
            this.bones.children.iterate(function (child) {
                const x = child.x + offsetX
                child.enableBody(true, x < 10 ? 10 : x > 790 ? 790 : x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    };

    #createBones() {
        const numOfbones = 5;
        const bonesGroup = this.physics.add.group({
            key: 'bone',
            repeat: numOfbones,
            setXY: {
                x: Phaser.Math.Between(10, 200),
                y: 0,
                stepX: 120
            }
        });

        bonesGroup.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
            child.anims.play('iluminating-bone');
        });
        return bonesGroup;
    }

    #createPlatforms() {
        const platformsGroup = this.physics.add.staticGroup();
        // Ground
        platformsGroup.add(this.#createPlatform(0, 666, 800, 800));
        // Level 1
        platformsGroup.add(this.#createPlatform(451, 505, 730, 542));
        // Level 2
        platformsGroup.add(this.#createPlatform(49, 360, 345, 408));
        // Level 3
        platformsGroup.add(this.#createPlatform(456, 243, 751, 279));
        // Level 4 - Left
        platformsGroup.add(this.#createPlatform(70, 106, 282, 153));
        // Level 4 - Right
        platformsGroup.add(this.#createPlatform(580, 100, 700, 136));
        return platformsGroup;
    }

    #createPlatform(x1, y1, x2, y2) {
        const width = x2 - x1;
        const height = y2 - y1;
        const xAnchorPoint = (x1 + x2) / 2;
        const yAnchorPoint = (y1 + y2) / 2;
        return this.add.rectangle(xAnchorPoint, yAnchorPoint, width, height, debugMode ? 0xFF0000 : undefined, debugMode ? 0.4 : 0);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.lastDirection = 'left';
            this.player.setVelocityX(-290);
            this.player.anims.play(this.jumps ? 'jump-left' : 'left', true);
        } else if (this.cursors.right.isDown) {
            this.lastDirection = 'right';
            this.player.setVelocityX(290);
            this.player.anims.play(this.jumps ? 'jump-right' : 'right', true);
        } else if (this.cursors.down.isDown && this.player.body.touching.down) {
            this.player.setVelocity(0);
            this.player.anims.play(this.lastDirection === 'left' ? 'sit-left' : 'sit-right');
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play((this.lastDirection === 'left') ? this.jumps ? 'jump-left' : 'turn-left' : this.jumps ? 'jump-right' : 'turn-right');
        }

        if ((this.cursors.space.isDown || this.cursors.up.isDown) && !this.jumps)
        {
            this.player.setVelocityY(-485);
        }
        
        this.jumps = !this.player.body.touching.down;
    }

    #hitBomb() {
        if (this.respawning) {
            return;
        }
        if (this.lives.countActive(true) > 1) {
            this.lives.children.entries[this.lives.countActive(true) - 1].disableBody(true, true);
            this.#respawn();
        } else {
            this.#gameOver(this);
        }
    }

    #respawn() {
        this.player
        this.respawning = true;
        var isTransparent = false;

        function toggleTransparency(self) {
            self.player.setAlpha(isTransparent ? 0.2 : 1);
            isTransparent = !isTransparent;
        }

        toggleTransparency(this);

        const event = this.time.addEvent({
            delay: 100,
            callback: () => toggleTransparency(this),
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: 1200,
            callback: () => {
                event.destroy();
                this.player.setAlpha(1);
                this.respawning = false;
            },
            callbackScope: this,
            loop: false
        });
    }

    #gameOver() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play(this.lastDirection === 'left' ? 'turn-left' : 'turn-right');

        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.input.stopPropagation();
            this.scene.start('game-over');
            EventEmitter.emit('score', this.score);
            this.score = 0;
            this.lives = this.#createLives();
            this.scene.stop();
        });
    }
}

export default GameScene;