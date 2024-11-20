// objects/Paddle.ts
export class Paddle extends Phaser.Physics.Arcade.Sprite {
    private readonly MOVEMENT_SPEED = 5;
    private readonly MIN_Y = 50;
    private readonly MAX_Y = 550;

    constructor(scene: Phaser.Scene, x: number, y: number, side: 'left' | 'right') {
        super(scene, x, y, 'paddle');
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
    }

    moveUp(): void {
        this.y -= this.MOVEMENT_SPEED;
        this.clampPosition();
    }

    moveDown(): void {
        this.y += this.MOVEMENT_SPEED;
        this.clampPosition();
    }

    private clampPosition(): void {
        this.y = Phaser.Math.Clamp(this.y, this.MIN_Y, this.MAX_Y);
    }
}
