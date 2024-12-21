import { SubtitleShower } from '../dialogueSystem/SubtitleShower';


export class NarrationManager extends Phaser.Scene {
    constructor() {
        super({ key: 'NarrationManager' });
    }

    create() {
        this.scene.bringToTop();

        //make subtitle
        this.subtitleSystem = new SubtitleShower(this);
    }

    update() {
                if (this.input.keyboard.addKey('R').isDown) {
            this.subtitleSystem.displayText('bbb', 2)
        }
    }
}