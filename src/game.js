import Phaser from 'phaser';
import GameOverScene from './scenes/game-over';
import TitleScene from './scenes/title';
import GameScene from './scenes/game';
import LoaderScreen from './scenes/loader';

const config = { 
    type: Phaser.AUTO,
    width: 800, 
    height: 800,
    parent: 'divId', 
    dom: { 
        createContainer: true, 
    }, 
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { 
                y: 300
            }, 
            debug: false, 
        }, 
    }, 
    scene: [
        LoaderScreen,
        TitleScene,
        GameScene,
        GameOverScene
    ]
}; 

const game = new Phaser.Game(config);