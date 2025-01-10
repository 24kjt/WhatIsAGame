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
        this.opponentMovementActive = false;
        this.playerMovementActive = true;

        this.selectionTree = [];
    }


    preload() {
        this.load.audio('ballBounce', 'assets/audio/PumpSound.wav'); // correct
        this.load.spritesheet('robotWalk', 'assets/sprites/versusScene/robotWalkCycle.png', { frameWidth: 96, frameHeight: 128 });

    }


    create() {
        let screenWidth = this.scale.gameSize.width;

        this.backgroundPaper = this.add.image(0,0, 'paperBG');


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
        this.leftPaddle = this.add.rectangle(300, 300, 20, 60, 0x1C1C1C);
        this.rightPaddle = this.add.rectangle(screenWidth-300, 300, 20, 60, 0x1C1C1C);
        this.rightPaddle.setOrigin(0.5, 0.5);

        // Create ball
        this.ball = this.add.circle(400, 300, 10, 0x1C1C1C);
        this.snd_ballBounce = this.sound.add('ballBounce');

        //Create center line
        for(let i =0; i<30;i++)
        {
            this.add.rectangle(this.scale.gameSize.width/2, 30*i, 5, 15, 0x1C1C1C);
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
        this.scoreTextLeft = this.add.text(400, 50, '0', {
            fontSize: '48px',
            color: '#1C1C1C'
        });
        this.scoreTextRight = this.add.text(screenWidth-400, 50, '0', {
            fontSize: '48px',
            color: '#1C1C1C'
        });

        // Start the game
        //this.resetBall();
        //this.StartSequence();

        // In your VersusGameScene or any other scene
        //this.scene.launch('VotingScene'); // true means start immediately
        this.scene.launch('NarrationManager'); // true means start immediately
        var narration = this.scene.get('NarrationManager');
        narration.scene.dialogueKey = "versus";
        narration.scene.originalScene = this;
        narration.startDialogue();

        this.OpponentSetLingeringPosition();


        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('robotWalk', { frames: [ 0, 1, 2, 3,4,5,6,7 ] }),
            frameRate: 8,
            repeat: -1
        });


        this.coverBGPaper = this.add.image(640,360, 'versus_pseudoBG');
        this.coverPaddle = this.add.sprite(this.leftPaddle.x, this.leftPaddle.y);
        this.coverPaddle.setScale(1.25);
        this.coverPaddle.play('walk');
        this.coverPaddle2 = this.add.sprite(this.rightPaddle.x, this.rightPaddle.y);
        this.coverPaddle2.setScale(1.25);
        this.coverPaddle2.play('walk');
        this.coverPaddle2.flipX = true;
        this.coverBall = this.add.image(this.ball.x, this.ball.y,'versus_soccerBall');
        

        //
    }

    update(time, delta) {
        if(this.coverPaddle)
        {
            this.coverPaddle.y = this.leftPaddle.y;
        }
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
            volume: 0.15,
            loop: false
        });

        ball.body.setVelocityX(ball.body.velocity.x + 20 * Math.sign(ball.body.velocity.x));
    }

    private constrainPaddle(paddle: Phaser.GameObjects.Rectangle) {
        paddle.y = Phaser.Math.Clamp(
            paddle.y,
            paddle.height / 2,
            720 - paddle.height / 2
        );
    }

    private checkScore() {
        if (this.ball.x < 20) {
            // Right player scores
            this.scoreRight++;
            this.scoreTextRight.setText(this.scoreRight.toString());
            this.resetBall();
        } else if (this.ball.x > 1260) {
            // Left player scores
            this.scoreLeft++;
            this.scoreTextLeft.setText(this.scoreLeft.toString());
            this.resetBall();
        }
    }

    private resetBall() {
        let screenWidth = this.scale.gameSize.width;
        this.ball.setPosition(screenWidth/2, 300);
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

        if(this.ball.x < this.rightPaddle.x)
        {
            speedConstant *= (this.rightPaddle.x - this.leftPaddle.x)/(100+this.rightPaddle.x - this.ball.x);
        }

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
            this.playerWall = this.add.rectangle(-50, 0, 50, this.scale.gameSize.height*2, 0x1C1C1C);
            this.physics.add.existing(this.playerWall);
            const wall = this.playerWall.body as Phaser.Physics.Arcade.Body;
            wall.setImmovable(true);
            this.physics.add.collider(this.ball, this.playerWall, null, undefined, this);

        
            //entry animation
            var tween = this.tweens.create({
                targets: this.playerWall,
                x: { from: -50, to: 200 },
                ease: 'Linear',
                duration: 6000,
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
                this.opponentWall = this.add.rectangle(width+25, 0, 50, this.scale.gameSize.height*2, 0x1C1C1C);
                this.physics.add.existing(this.opponentWall);
                const wall = this.opponentWall.body as Phaser.Physics.Arcade.Body;
                wall.setImmovable(true);
                this.physics.add.collider(this.ball, this.opponentWall, null, undefined, this);
                //entry animation
                var tween = this.tweens.create({
                    targets: this.opponentWall,
                    x: { from: width+25 , to: width-200 },
                    ease: 'Linear',
                    duration: 6000,
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

    PossessOpponent()
    {
        const timeline = this.add.timeline([
            {   //possess opponent
                at: 0,
                
                tween: {
                    targets: this.rightPaddle,
                    angle:50,
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 1500,
                
                tween: {
                    targets: this.rightPaddle,
                    y: '-=30',
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 2700,
                
                tween: {
                    targets: this.rightPaddle,
                    y: '+=70',
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 3700,
                
                tween: {
                    targets: this.rightPaddle,
                    angle:-50,
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 4700,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: 40,
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 4850,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: -30,
                    duration: 70,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 5000,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: 20,
                    duration: 70,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 5100,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: -20,
                    duration: 40,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 6500,
                
                tween: {
                    targets: this.rightPaddle,
                    y:100,
                    ease: 'Sine.inOut', 
                    duration: 150,
                    yoyo: true,
                    repeat: 1.5,
                }
            },
            {
                at: 7500,

                run: () => {
                    this.opponentMovementActive = true;
                },
                tween: {
                    targets: this.rightPaddle,
                    angle: 0,
                    duration: 100,
                    yoyo:false,
                    repeat: 0
                }
            }
            
        ]);

        timeline.play();
    }

    EnterComplicated()
    {
        this.welcomeBody = this.add.image(1700,500-150, 'versus_welcomeBody');
        this.welcomeHeader = this.add.image(1700,300-150, 'versus_welcomeHeader');

        this.progressionBody = this.add.image(-500, 500-150, 'versus_progressionBody');
        this.progressionHeader = this.add.image(-500,380-150, 'versus_progressionHeader');

        this.star = this.add.image(700,1500,'versus_star');
        //add star velocity

        const timeline = this.add.timeline([
            {
                at: 500,
                
                run: () => {
                    //play audio
                    //CONTINUE HERE CONTINUE HERE CONTINUE HERE
                    //add star gravity and launch up
                }
            },
            {
                at: 3400,
                
                tween: {
                    targets: [this.welcomeHeader, this.welcomeBody],
                    x:1000,
                    ease: 'Sine.inOut', 
                    duration: 1000,
                    yoyo: false,
                    repeat: 0,
                }
            },
            {
                at: 2800,
                
                tween: {
                    targets: [this.progressionHeader, this.progressionBody],
                    x:300,
                    ease: 'Sine.inOut', 
                    duration: 1000,
                    yoyo: false,
                    repeat: 0,
                }
            }
        ]);

        timeline.play();
    }

    ExitComplicated()
    {
        const timeline = this.add.timeline([
            {
                at: 1500,

                run: () => {
                    this.progressionHeader.destroy(); 
                    this.progressionBody.destroy();
                    this.welcomeHeader.destroy();
                    this.welcomeBody.destroy();
                }
            }
        ]);

        timeline.play();
    }

    RemoveBG()
    {
        const timeline = this.add.timeline([
            {
                at: 500,

                run: () => {
                    this.coverBGPaper.destroy();
                }
            },
            {
                at: 2800,

                run: () => {
                    this.coverPaddle.destroy();
                    this.coverPaddle2.destroy();
                    this.coverBall.destroy();

                }
            }
        ]);

        timeline.play();
    }

    PlaySceneAction(actionKey)
    {
        switch(actionKey)
        {
            case "possessOpponent":
                this.PossessOpponent();
                break;
            case "wallOffPlayer":
                this.WallOffPlayerSide(true);
                break;
            case "wallOffOpponent":
                this.WallOffOpponentSide(true);
                break;
            case "turnOpponentIntoWall":
                this.TurnEnemyIntoWall();
                break;
            case "freePongMovement":
                this.FreePongMovementAxis();
                break;
            case "takeAwayPlayerControl":
                this.TakeAwayPlayerControl();
                break;
            case "takeAwayAIControl":
                this.TakeAwayAIControl();
                break;
            case "addCheerFunction":
                this.AddCheerFunction();
                break;
            case "startGame":
                this.resetBall();
                break;
            case "complicatedEntry":
                this.EnterComplicated();
                break;
            case "complicatedExit":
                this.ExitComplicated();
                break;
            case "removeBG":
                this.RemoveBG();
                break;
            default:
                console.log("Action not found");
                break;
        }
    }
    /*votedYes()
    {
        console.log("Scene voted yes");
        this.selectionTree.push(true);
        this.votingReaction();
    }

    votedNo()
    {
        console.log("scene voted no");
        this.selectionTree.push(false);
        this.votingReaction();
    }*/



    StartSequence()
    {
        //starting sequence to possess opponent
        const timeline = this.add.timeline([
            {   //possess opponent
                at: 1500,
                
                tween: {
                    targets: this.rightPaddle,
                    angle:50,
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 3000,
                
                tween: {
                    targets: this.rightPaddle,
                    y: '-=30',
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 4200,
                
                tween: {
                    targets: this.rightPaddle,
                    y: '+=70',
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 5200,
                
                tween: {
                    targets: this.rightPaddle,
                    angle:-50,
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 6200,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: 40,
                    duration: 100,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 6350,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: -30,
                    duration: 70,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 6500,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: 20,
                    duration: 70,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 6600,
                
                tween: {
                    targets: this.rightPaddle,
                    angle: -20,
                    duration: 40,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 8000,
                
                tween: {
                    targets: this.rightPaddle,
                    y:100,
                    ease: 'Sine.inOut', 
                    duration: 150,
                    yoyo: true,
                    repeat: 1.5,
                }
            },
            {
                at: 9000,

                run: () => {
                    this.opponentMovementActive = true;
                },
                tween: {
                    targets: this.rightPaddle,
                    angle: 0,
                    duration: 100,
                    yoyo:false,
                    repeat: 0
                }
            },
            {
                at: 15000,

                run: () => {
                    this.resetBall();
                }
            },
            {
                at: 18000,

                run: () => {
                    this.WallOffPlayerSide(true);                
                }
            },
            {
                at: 20000,

                run: () => {
                    //ask is this a game vote
                    //this.scene.start('VotingScene', "questionTest");
                }
            }
            
        ]);

        timeline.play();

    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */
