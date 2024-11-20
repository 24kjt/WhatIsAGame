// objects/Ball.ts
export class Ball extends Phaser.Physics.Arcade.Sprite {
    private readonly INITIAL_VELOCITY = 300;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ball');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setupPhysics();
    }

    private setupPhysics(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setBounce(1, 1);
        body.setVelocity(this.INITIAL_VELOCITY, 200);
    }

    reset(): void {
        this.setPosition(400, 300);
        const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
        const velocity = this.INITIAL_VELOCITY;
        this.setVelocity(
            Math.cos(angle) * velocity * (Math.random() < 0.5 ? 1 : -1),
            Math.sin(angle) * velocity
        );
    }
}
