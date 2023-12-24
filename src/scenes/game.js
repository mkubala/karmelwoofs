import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'game',
            pack: {
                files: [
                    { type: 'image', key: 'sky', url: './assets/sky.png' },
                    { type: 'image', key: 'ground', url: './assets/platform.png' },
                    { type: 'image', key: 'star', url: './assets/star.png' },
                    { type: 'image', key: 'bomb', url: './assets/bomb.png' }
                ]
            }
        });
        this.score = 0;
        this.lastDirection = 'left';
        this.jumps = false;
    }

    preload() {
        this.load.spritesheet('dog', 
            'assets/dog/dog.png',
            { frameWidth: 100, frameHeight: 60 }
        );
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dog');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        // this.player.setScale(1.2).refreshBody();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dog', { start: 10, end: 17 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn-left',
            frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 3 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'turn-right',
            frames: this.anims.generateFrameNumbers('dog', { start: 20, end: 23 }),
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dog', { start: 37, end: 30 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'jump-left',
            frames: this.anims.generateFrameNumbers('dog', { frames: [15] }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'jump-right',
            frames: this.anims.generateFrameNumbers('dog', { frames: [35] }),
            frameRate: 20,
            repeat: -1
        });

        this.player.body.setGravityY(500);
        this.physics.add.collider(this.player, platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        const stars = this.physics.add.group({
            key: 'star',
            repeat: 2,
            setXY: { x: 362, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(this.player, stars, collectStar, null, this);

        const scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        function collectStar(player, star) {
            this.score += 1;
            scoreText.setText('score: ' + this.score);
            star.disableBody(true, true);

            if (stars.countActive(true) === 0) {
                stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                });

                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        };

        const bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(this.player, bombs, this.#hitBomb, null, this);
    }

    update() {
        if (this.cursors.left.isDown)
        {
            this.lastDirection = 'left';
            this.player.setVelocityX(-220);
            this.player.anims.play(this.jumps ? 'jump-left' : 'left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.lastDirection = 'right';
            this.player.setVelocityX(220);
            this.player.anims.play(this.jumps ? 'jump-right' : 'right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            
            this.player.anims.play((this.lastDirection === 'left') ? this.jumps ? 'jump-left' : 'turn-left' : this.jumps ? 'jump-right' : 'turn-right');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-500);
            this.jumps = true;
        }
        
        if (!this.cursors.up.isDown && this.player.body.touching.down) {
            this.jumps = false;
        }
        if (!this.player.body.touching.down) {
            this.jumps = true;
        }
        console.log(`Jumps? ${this.jumps}`);
    }

    #hitBomb() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.#gameOver(this);
    }

    #gameOver() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.input.stopPropagation();
            this.scene.start('game-over');
            this.scene.stop();
        });
    }
}

export default GameScene;