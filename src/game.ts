// game.ts
import { GameConfig } from './config/GameConfig';

export class Game extends Phaser.Game {
    constructor() {
        super(GameConfig);
    }
}

// Start the game
window.onload = () => {
    new Game();
};
