import Phaser from "phaser";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";
import {VersusGameScene} from "./scenes/VersusGameScene";	


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

window.addEventListener('load', function () {
	
	const game = new Phaser.Game({
		type: Phaser.AUTO,
    width: 800, //prob change to 1280x720
    height: 600,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 }, // Set to 0 for a pong-like game
				debug: false
			}
		},
		
		scale: {
			mode: Phaser.Scale.ScaleModes.FIT,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH,
			parent: "game-container",
		},
		scene: [Boot, Preload, Level, VersusGameScene]
	});

	game.scene.start("Boot");
});