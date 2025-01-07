enum IntroStage {
    PreStart,  // 0
    Intro,   // 1
    ZoomOut,  // 2
    TitleIn,    // 3
    Done
};

export class TitleScene extends Phaser.Scene {
    
    constructor() {
        super("TitleScene");
        this.stage = IntroStage.PreStart;
        this.snakeHead;
        this.pointerDown = false
        this.snakePellet;
        this.resolveStateEntry = false;
    }

    

    preload() {
        this.CreateSnake();
    }

    create(){
        let worldSize = 100000;
        this.physics.world.setBounds(-worldSize/2, -worldSize/2, worldSize, worldSize);
        //this.cameras.main.setBounds(0, 0, 800, 700);
        this.cameras.main.centerOn(400, 350);


        const style = {
            font: "24px Arial",
            fill: "#ffffff",
            wordWrap: {
                width: this.sceneWidth*0.8, // Set the maximum width for wrapping
                useAdvancedWrap: true // Optional, for more precise wrapping
            },
            align: 'center', // Text alignment

        };



        this.add.image(0,0, 'paperBG');
        this.add.image(1500,-380, 'title').setScale(1/0.3, 1/0.3);
        this.playButton = this.add.image(2000,1200, 'title_button');
        this.playButton.setScale(1/0.3, 1/0.3);
        this.buttonQuestion = this.add.image(2300,1200, 'title_buttonQuestion').setScale(1/0.3,1/0.3);
        this.buttonQuestion.visible = false;

        this.playButton.setTint(0x000000);

        this.playButton.setInteractive();
        this.playButton.on('pointerdown', () => this.ClickPlay());

        this.playButton.on('pointerover', () => {
            this.playButton.setTint(0x2C2C2C);
            this.buttonQuestion.visible = true
        });
        this.playButton.on('pointerout', () => 
            {
                this.buttonQuestion.visible = false
                this.playButton.setTint(0x000000);
            });

        let { width, height } = this.sys.game.canvas;

        this.startText = this.add.text(width/2, height/2, "Click to Start", style);
        this.snakeSpeed = 0.5;
        this.snakeIsSpawnwed = false;
    }

    update(time: number, delta: number): void {
        console.log( this.cameras.main.x);


        if (this.input.keyboard.addKey('W').isDown) {
            this.AddSnakeBody();
        }
        if (this.input.keyboard.addKey('Q').isDown) {
            this.MoveSnakeBody(delta);
            console.log('snakehead x' + this.snakeHead.x );
        }

       // console.log('x mouse'+this.input.mousePointer.x);
       // console.log('y mouse'+this.input.mousePointer.y);

        switch(this.stage)
        {
            case IntroStage.PreStart:
                this.MoveSnakeBody(delta);
                if(this.input.activePointer.isDown && !this.pointerDown)
                {
                    this.pointerDown = true;
                    this.startText.destroy();
                    //this.CreateSnake();
                    this.stage = IntroStage.Intro;
                    this.snakeHead.visible = true;
                    
                    for(let i = 0; i<10; i++)
                    {
                        this.AddSnakeBody();
                    }

                    this.AddSnakePellet();
                   
                }
                break;
            case IntroStage.Intro:
                this.MoveSnakeBody(delta);

                if(!this.resolveStateEntry)
                {
                    this.timer = this.time.addEvent({
                        delay: 3000, // milliseconds
                        callback: () => {
                            this.stage = IntroStage.ZoomOut;
                            this.resolveStateEntry = false;
                        } ,
                        callbackScope: this,
                        loop: false
                    });

                    this.resolveStateEntry = true;
                }

                break;

            case IntroStage.ZoomOut:
                this.MoveSnakeBody(delta);

                if(!this.resolveStateEntry)
                {
                    this.ZoomOut();
                    this.resolveStateEntry = true;
                }
                break;

            case IntroStage.TitleIn:
                
                if(!this.resolveStateEntry)
                {
                        
                    this.resolveStateEntry = true;
                }
                break;
            case IntroStage.Done:
                
                if(!this.resolveStateEntry)
                {
                    
                    this.resolveStateEntry = true;
                }
                break;

        } 
    }

    CreateSnake()
    {
        const worldPoint = this.cameras.main.getWorldPoint(this.input.mousePointer.x, this.input.mousePointer.y);
        let targetX = worldPoint.x;
        let targetY = worldPoint.y;

        this.snake = new Phaser.Curves.Path(50, 500);
        this.snakeHead = this.add.circle(targetX, targetY, 10, 0xFFFFFF);
        this.snakeHead.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.snakeHead);
        
        this.snakeBody = [];

        this.snakeHead.visible = false;
        //this.MoveSnakeBody(1);
    }

    AddSnakeBody()
    {
        var snakePart = this.add.circle(this.snakeHead.x, this.snakeHead.y, 10, 0x41424C);
        snakePart.setOrigin(0.5, 0.5);
        this.physics.add.existing(snakePart);

        if(this.snakeBody.length > 0)
        {
            //snakePart.x = this.snakeBody[this.snakeBody.length - 1].x;
            //snakePart.y = this.snakeBody[this.snakeBody.length - 1].y;
        }
 
        this.snakeBody.push(snakePart);
    }

    MoveSnakeBody(delta)
    {


        
        if(isNaN(this.snakeHead.x))
        {
            console.log("aaabbbb");
        }
        else
        {
            //console.log("x "+this.snakeHead.x);
            //console.log("y "+this.snakeHead.y);
        }

        let time = delta/1.5;
        //head
        const worldPoint = this.cameras.main.getWorldPoint(this.input.mousePointer.x, this.input.mousePointer.y);
        let targetX = worldPoint.x;
        let targetY = worldPoint.y;

        let xDist = targetX - this.snakeHead.x;
        let yDist = targetY - this.snakeHead.y;

        let length = Math.sqrt(xDist*xDist + yDist*yDist);

        //console.log('AAA'+ this.snakeHead.x);
       // console.log('BBB'+ this.snakeHead.y);

        if(length>15)
        {
            this.snakeHead.x += time*xDist/length;
            this.snakeHead.y += time*yDist/length;
        }

        //body
        for(let i = 0; i<this.snakeBody.length; i++)
        {
            if(i == 0)
            {
                targetX = this.snakeHead.x;
                targetY = this.snakeHead.y;
            }
            else
            {
                targetX = this.snakeBody[i-1].x;
                targetY = this.snakeBody[i-1].y;
            }

            xDist = targetX - this.snakeBody[i].x;
            yDist = targetY - this.snakeBody[i].y;

            length = Math.sqrt(xDist*xDist + yDist*yDist);

            if(length > 15)
            {
                this.snakeBody[i].x += time*xDist/length;
                this.snakeBody[i].y += time*yDist/length;
            }
        }
    }

    AddSnakePellet()
    {
        let { width, height } = this.sys.game.canvas;
        const visibleBounds = {
            left: this.cameras.main.scrollX,
            right: this.cameras.main.scrollX + (this.cameras.main.width / this.cameras.main.zoom),
            top: this.cameras.main.scrollY,
            bottom: this.cameras.main.scrollY + (this.cameras.main.height / this.cameras.main.zoom)
        };

        console.log('left'+visibleBounds.left);
        console.log('right'+visibleBounds.right);
        console.log('top'+visibleBounds.top);
        console.log('bottom'+visibleBounds.bottom);

        let xPos = Phaser.Math.Between(-visibleBounds.right/2, visibleBounds.right/2 )
        let yPos = Phaser.Math.Between(visibleBounds.bottom/2, visibleBounds.top/2 )

        if(this.stage == IntroStage.Intro)
        {
            xPos = Phaser.Math.Between(0, width );
            yPos = Phaser.Math.Between(0, height );
        }

        this.snakePellet = this.add.circle(xPos, yPos, 10, 0x41424C);
        this.snakePellet.setOrigin(0.5, 0.5);
        this.physics.add.existing(this.snakePellet);
        this.physics.add.collider(this.snakePellet, this.snakeHead, this.EatSnakePellet, undefined, this);

    }

    EatSnakePellet()
    {  
        this.snakePellet.destroy();
        this.AddSnakeBody();
        this.AddSnakePellet();
    }

    ZoomOut()
    {
        const cam = this.cameras.main;
        cam.zoomTo(0.3, 20000, Phaser.Math.Easing.Cubic.InOut);

        this.PlaySequenceTween();
    }

    PlaySequenceTween()
    {
        var tank = this.add.image(-100,-100, 'title_buttonQuestion');

        //about 5 things should be enough
        const timeline = this.add.timeline({   
            at: 5000,
            
            tween: {
                targets: tank,
                x: 3000,
                y: 3000,
                duration: 15000
            }
        });

        timeline.play();
    }

    ClickPlay()
    {
        this.scene.start('VersusGameScene');
    }




}