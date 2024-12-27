export class Target extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'FufuSuperDino');
        
        // Add the sprite to the scene
        this.parentScene = scene;
        scene.add.existing(this);


        // Make buttons interactive
        this.setInteractive();

        // Add click handlers
        this.on('pointerdown', () => this.GetShot());
    }

    // Add your custom methods here
    update() {
        // Custom update logic
    }

    GetShot(){
        console.log('target shot');
        this.destroy();
    }


    
}