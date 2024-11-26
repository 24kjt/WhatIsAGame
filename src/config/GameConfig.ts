// config/GameConfig.ts
import { VersusGameScene } from '../scenes/VersusGameScene';
import { TitleScene } from '../scenes/TitleScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container', // Add a div with this ID in your HTML
    },
    scene: [TitleScene, VersusGameScene]
};
