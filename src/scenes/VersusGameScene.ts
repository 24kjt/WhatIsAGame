// UserComponent is needed for Phaser Editor 2D
/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */


export class VersusGameScene extends Phaser.Scene {

	constructor() {
		super("VersusGameScene");

		/* START-USER-CTR-CODE */
        this.leftPaddle;
        this.rightPaddle;
        this.ball;
        this.scoreLeft = 0;
        this.scoreRight = 0;
        this.scoreTextLeft;
        this.scoreTextRight;
        this.ballSpeed = 400;
        this.ballSpeedOriginal = 400;
        /* END-USER-CTR-CODE */
        this.freeXMovement = false;
        this.targetPos = 0;
        this.opponentMovementActive = true;
        this.playerMovementActive = true;
    }


    preload() {
        this.load.audio('ballBounce', 'assets/audio/PumpSound.wav'); // correct
    }


    create() {
        //  Input events
        this.freeXMovement = false;
        this.input.on('pointermove', function (pointer)
        {
            if( this.playerMovementActive)
            {
                if(this.freeXMovement)
                {
                    console.log('free');
                    this.leftPaddle.x = Phaser.Math.Clamp(pointer.x, 0, 800 );
                }

                //  Keep the paddle within the game
                this.leftPaddle.y = Phaser.Math.Clamp(pointer.y, 60, 740);
            }
        }, this);

        //this.freeXMovement = false;

        // Create paddles
        this.leftPaddle = this.add.rectangle(50, 300, 20, 60, 0xFFFFFF);
        this.rightPaddle = this.add.rectangle(750, 300, 20, 60, 0xFFFFFF);
        this.rightPaddle.setOrigin(0.5, 0.5);

        // Create ball
        this.ball = this.add.circle(400, 300, 10, 0xFFFFFF);
        this.snd_ballBounce = this.sound.add('ballBounce');

        //Create center line
        for(let i =0; i<20;i++)
        {
            this.add.rectangle(this.scale.gameSize.width/2, 30*i, 5, 15, 0xFFFFFF);
        }

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
        this.physics.add.collider(this.ball, this.leftPaddle, this.handlePaddleHit, undefined, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.handlePaddleHit, undefined, this);


        //set up game state variables
        


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

        // In your VersusGameScene or any other scene
        //this.scene.launch('VotingScene'); // true means start immediately
        this.scene.launch('NarrationManager'); // true means start immediately
        this.OpponentSetLingeringPosition();
    }

    update(time, delta) {
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

        if(this.input.keyboard.addKey('N').isDown) {
            this.scene.start('TitleScene');
        }

        if(this.input.keyboard.addKey('Q').isDown) {
            this.WallOffPlayerSide(true);
        }
        if(this.input.keyboard.addKey('W').isDown) {
            this.WallOffOpponentSide(true);
            console.log('dddddddddddddddddddd');
            
        }

        if(this.input.keyboard.addKey('A').isDown) {
            this.TurnEnemyIntoWall();
            this.TakeAwayAIControl();
        }
        
        if(this.input.keyboard.addKey('E').isDown) {
            this.freeXMovement = true;
        }
        
        if(this.input.keyboard.addKey('F').isDown) {
            this.scene.switch("StoryScene");
            this.scene.stop('VotingScene')
        }
            
        if(this.input.keyboard.addKey('G').isDown) {
            this.scene.switch("ShootingScene");
            this.scene.stop('VotingScene')
        }

        this.OpponentAI(delta);


        // Keep paddles within the game bounds
        this.constrainPaddle(this.leftPaddle);
        this.constrainPaddle(this.rightPaddle);

        // Check if ball goes out of bounds
        this.checkScore();
    }

    private handlePaddleHit(ball: Phaser.GameObjects.GameObject, paddle: Phaser.Physics.Arcade.Sprite): void {
        //todo: add randomizer
        let diff = 0;
        let diffSpeedMultiplier = 20;

        if(ball.y < paddle.y)
        {   //left 
            diff = paddle.y - ball.y;
            ball.body.setVelocityY(-diffSpeedMultiplier*diff);
        }
        else if (ball.y > paddle.y)
        {
            diff = paddle.y - ball.y;
            ball.body.setVelocityY(diffSpeedMultiplier*diff);           
        }
        else
        {
            ball.body.setVelocityY(2 + Math.random() * diffSpeedMultiplier);
        }

        this.snd_ballBounce.play({
            volume: 0.5,
            loop: false
        });

        ball.body.setVelocityX(ball.body.velocity.x + 20 * Math.sign(ball.body.velocity.x));
    }

    private constrainPaddle(paddle: Phaser.GameObjects.Rectangle) {
        paddle.y = Phaser.Math.Clamp(
            paddle.y,
            paddle.height / 2,
            600 - paddle.height / 2
        );
    }

    private checkScore() {
        if (this.ball.x < 20) {
            // Right player scores
            this.scoreRight++;
            this.scoreTextRight.setText(this.scoreRight.toString());
            this.resetBall();
        } else if (this.ball.x > 780) {
            // Left player scores
            this.scoreLeft++;
            this.scoreTextLeft.setText(this.scoreLeft.toString());
            this.resetBall();
        }
    }

    private resetBall() {
        this.ball.setPosition(400, 300);
        this.ballSpeed = this.ballSpeedOriginal;

        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;

        // Random angle between -45 and 45 degrees
        const angle = (Math.random() * Math.PI / 2 - Math.PI / 4);

        // Set initial velocity
        ballBody.setVelocity(
            Math.cos(angle) * this.ballSpeed * (Math.random() < 0.5 ? 1 : -1),
            Math.sin(angle) * this.ballSpeed
        );
    }

    private OpponentAI(delta)
    {   //TODO: SET DIFFICULTY
        if(!this.opponentMovementActive)
        {
            return;
        }

        var speedConstant = 15;
        var accelConstant = 20;
        var noiseConstant = 5;

        if(this.ball.body.velocity.x > 0)
        {   
            this.targetPos = this.ball.y;
        }
        else
        {
            speedConstant = 2;
            accelConstant = 2;
            noiseConstant = 5;   
        }


        speedConstant *= (this.rightPaddle.x - this.leftPaddle.x)/(100+this.rightPaddle.x - this.ball.x);

        var noise = Phaser.Math.Between(-noiseConstant, noiseConstant);


        var targetSpeed = (this.targetPos - this.rightPaddle.y)*speedConstant;
        var accel = (targetSpeed - this.rightPaddle.body.velocity.y)*accelConstant ;

        var speed = this.rightPaddle.body.velocity.y + accel*delta/1000;

        this.rightPaddle.body.setVelocity(0, speed+noise);
        
    }

    private OpponentSetLingeringPosition()
    {
        this.timer = this.time.addEvent({
            delay: Phaser.Math.Between(500, 2500 ), // milliseconds
            callback: () => {
                this.targetPos = Phaser.Math.Between(0, this.scale.gameSize.height );
            },
            callbackScope: this,
            loop: true
        });

    }

    WallOffPlayerSide(trigger)
    {
        if(trigger)
        {
            console.log('wall off player');
        //spawn box on player side
            this.playerWall = this.add.rectangle(-50, 0, 50, this.scale.gameSize.height*2, 0xFFFFFF);
            this.physics.add.existing(this.playerWall);
            const wall = this.playerWall.body as Phaser.Physics.Arcade.Body;
            wall.setImmovable(true);
            this.physics.add.collider(this.ball, this.playerWall, null, undefined, this);

        
            //entry animation
            var tween = this.tweens.create({
                targets: this.playerWall,
                x: { from: -50, to: 0 },
                ease: 'Linear',
                duration: 3000,
                repeat: 0,
                yoyo: false
            });

            this.tweens.existing(tween);

        //set up hit ball collision
        }
        else
        {
            //exit animation

            //destroy
        }

    }

    WallOffOpponentSide(trigger)
    {
        let { width, height } = this.sys.game.canvas;

        if(trigger)
            {
                console.log('wall off opp');
            //spawn box on player side
                this.opponentWall = this.add.rectangle(width+25, 0, 50, this.scale.gameSize.height*2, 0xFFFFFF);
                this.physics.add.existing(this.opponentWall);
                const wall = this.opponentWall.body as Phaser.Physics.Arcade.Body;
                wall.setImmovable(true);
                this.physics.add.collider(this.ball, this.opponentWall, null, undefined, this);
                //entry animation
                var tween = this.tweens.create({
                    targets: this.opponentWall,
                    x: { from: width+25 , to: width },
                    ease: 'Linear',
                    duration: 3000,
                    repeat: 0,
                    yoyo: false
                });
    
                this.tweens.existing(tween);
    
            //set up hit ball collision
            }
            else
            {
                //exit animation
    
                //destroy
            }
    }

    TurnEnemyIntoWall()
    {   //continue here Fix height by velocity. Fix centering
        
        this.rightPaddle.setOrigin(0.5, 0.5);
        var tween = this.tweens.create({
            targets: this.rightPaddle,
            height: { from: this.rightPaddle.body.height , to: this.scale.gameSize.height - 50 },
            ease: 'Linear',
            duration: 3000,
            repeat: 0,
            yoyo: false
        });

        var tween2 = this.tweens.create({
            targets: this.rightPaddle.body,
            height: { from: this.rightPaddle.body.height , to: this.scale.gameSize.height - 50 },
            ease: 'Linear',
            duration: 3000,
            repeat: 0,
            yoyo: false
        });  

        this.tweens.existing(tween);
        this.tweens.existing(tween2);
    }

    FreePongMovementAxis()
    {
        this.freeXMovement = true;
    }

    TakeAwayPlayerControl()
    {
        this.playerMovementActive = false;
    }

    AddCheerFunction()
    {
        const cheerButton = this.add.text(100, 100, 'Cheer', { 
            backgroundColor: '#4CAF50',
            padding: { x: 10, y: 5 },
            fontSize: '24px'
        });
        
        // Make buttons interactive
        cheerButton.setInteractive();

        // Add click handlers
        cheerButton.on('pointerdown', () => this.CheerButtonPressed());
    }

    TakeAwayAIControl()
    {
        this.opponentMovementActive = false;
    }

    CheerButtonPressed()
    {
        console.log('Cheer button pressed');
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */
