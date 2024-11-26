
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export class TitleScene extends Phaser.Scene {
    private button!: Phaser.GameObjects.Sprite; // or Image, depending on what you're using

	constructor() {
		super("TitleScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// fufuSuperDino
		this.add.image(560, 316, "FufuSuperDino");

		// button
		this.button = this.add.image(814, 523, "button");

		this.events.emit("scene-awake");
	}



	/* START-USER-CODE */
    preload() {
         this.load.image('button', 'assets/button.png'); // correct
        this.load.image('FufuSuperDino', 'assets/FufuSuperDino.png'); // correct
    }
	// Write your code here

	create() {

		this.editorCreate();
		this.setupButtonInteractions();
	}

	update() {
		if(this.input.keyboard.addKey('N').isDown) {
            this.scene.start('VersusGameScene');
        }
	}

    private setupButtonInteractions(): void {
        this.button.setInteractive()
            .on('pointerover', () => this.button.setTint(0xe0e0e0))
            .on('pointerout', () => this.button.clearTint())
            .on('pointerdown', () => this.button.setTint(0xcccccc))
            .on('pointerup', () => {
                this.button.clearTint();
                this.scene.start('VersusGameScene');
            });
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
