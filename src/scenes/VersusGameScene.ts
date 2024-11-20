// UserComponent is needed for Phaser Editor 2D
/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export class VersusGameScene extends Phaser.Scene {

	constructor() {
		super({ key: 'VersusGameScene'});

		/* START-USER-CTR-CODE */
        this.leftPaddle;
        this.rightPaddle;
        this.ball;
        this.scoreLeft = 0;
        this.scoreRight = 0;
        this.scoreTextLeft;
        this.scoreTextRight;
        this.ballSpeed = 400;
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// fufuSuperDino
		this.add.image(400, 300, "FufuSuperDino");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

    // Write your code here

    create() {
        // Create paddles
        this.leftPaddle = this.add.rectangle(50, 300, 20, 120, 0xFFFFFF);
        this.rightPaddle = this.add.rectangle(750, 300, 20, 120, 0xFFFFFF);

        // Create ball
        this.ball = this.add.circle(400, 300, 10, 0xFFFFFF);

        // Enable physics
        this.physics.add.existing(this.leftPaddle);
        this.physics.add.existing(this.rightPaddle);
        this.physics.add.existing(this.ball);


        const leftPaddleBody = this.leftPaddle.body as Phaser.Physics.Arcade.Body;
        const rightPaddleBody = this.rightPaddle.body as Phaser.Physics.Arcade.Body;


        leftPaddleBody.setImmovable(true);
        rightPaddleBody.setImmovable(true);

        // Setup ball physics
        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
        ballBody.setCollideWorldBounds(true);
        ballBody.setBounce(1, 1);

        // Add collision between ball and paddles
        this.physics.add.collider(this.ball, this.leftPaddle, null, undefined, this);
        this.physics.add.collider(this.ball, this.rightPaddle, null, undefined, this);




        // Add score text
        this.scoreTextLeft = this.add.text(200, 50, '0', {
            fontSize: '48px',
            color: '#FFFFFF'
        });
        this.scoreTextRight = this.add.text(600, 50, '0', {
            fontSize: '48px',
            color: '#FFFFFF'
        });

        // Start the game
        this.resetBall();
    }

    update() {
        // Left paddle controls (W and S keys)
        if (this.input.keyboard.addKey('W').isDown) {
            this.leftPaddle.y -= 7;
        }
        if (this.input.keyboard.addKey('S').isDown) {
            this.leftPaddle.y += 7;
        }

        // Right paddle controls (Up and Down arrows)
        if (this.input.keyboard.addKey('UP').isDown) {
            this.rightPaddle.y -= 7;
        }
        if (this.input.keyboard.addKey('DOWN').isDown) {
            this.rightPaddle.y += 7;
        }

        // Keep paddles within the game bounds
        this.constrainPaddle(this.leftPaddle);
        this.constrainPaddle(this.rightPaddle);

        // Check if ball goes out of bounds
        this.checkScore();
    }

    private handlePaddleHit(ball: Phaser.GameObjects.GameObject) {
        const ballBody = ball.body as Phaser.Physics.Arcade.Body;

        // Increase ball speed slightly on each hit
        this.ballSpeed += 20;

        // Calculate new velocity based on hit position
        const velocity = this.ballSpeed;
        const deltaY = ball.y - (ball.y > 300 ? 350 : 250);

        // Set new velocity
        ballBody.setVelocity(
            (ballBody.velocity.x > 0 ? -1 : 1) * velocity,
            deltaY
        );
    }

    private constrainPaddle(paddle: Phaser.GameObjects.Rectangle) {
        paddle.y = Phaser.Math.Clamp(
            paddle.y,
            paddle.height / 2,
            600 - paddle.height / 2
        );
    }

    private checkScore() {
        if (this.ball.x < 0) {
            // Right player scores
            this.scoreRight++;
            this.scoreTextRight.setText(this.scoreRight.toString());
            this.resetBall();
        } else if (this.ball.x > 800) {
            // Left player scores
            this.scoreLeft++;
            this.scoreTextLeft.setText(this.scoreLeft.toString());
            this.resetBall();
        }
    }

    private resetBall() {
        this.ball.setPosition(400, 300);
        this.ballSpeed = 400;

        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;

        // Random angle between -45 and 45 degrees
        const angle = (Math.random() * Math.PI / 2 - Math.PI / 4);

        // Set initial velocity
        ballBody.setVelocity(
            Math.cos(angle) * this.ballSpeed * (Math.random() < 0.5 ? 1 : -1),
            Math.sin(angle) * this.ballSpeed
        );
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */
