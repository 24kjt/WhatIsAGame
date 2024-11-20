import Phaser from "phaser";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";
import { GameConfig } from './config/GameConfig';

class Boot extends Phaser.Scene {

    constructor() {
        super("Boot");
    }

    preload() {

        this.load.pack("pack", "assets/preload-asset-pack.json");
    }

    create() {

       this.scene.start("Preload");
    }
}

window.addEventListener('load', () => {
    new Phaser.Game(GameConfig);
});