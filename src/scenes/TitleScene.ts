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
            fill: "#000000",
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

        this.playButton.visible = false;

        let { width, height } = this.sys.game.canvas;

        this.startText = this.add.text(width/2-300, height/2, "Click to Start", style);
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
            console.log('snakehead y' + this.snakeHead.y );

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

                    this.scene.launch('NarrationManager'); // true means start immediately
                    var narration = this.scene.get('NarrationManager');
                    narration.scene.dialogueKey = "title";
                    //narration.scene.dialogueKey = "versus_y";
                    narration.scene.originalScene = this;
                    narration.startDialogue();
                   
                }
                break;
            case IntroStage.Intro:
                this.MoveSnakeBody(delta);

                if(!this.resolveStateEntry)
                {
                    this.timer = this.time.addEvent({
                        delay: 0, // milliseconds
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
                    this.timer = this.time.addEvent({
                        delay: 10000, // milliseconds
                        callback: () => {
                            this.ZoomOut();

                        } ,
                        callbackScope: this,
                        loop: false
                    });
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
        //ship
        var ship = this.add.image(-100,-100, 'title_spaceShip');
        var follower = { t: 0, vec: new Phaser.Math.Vector2() };
        var tangentFollower = {}
        var path = new Phaser.Curves.Path(-450, 0);
        path.lineTo(-500, 50);
        path.cubicBezierTo(1500, 800, 200, -300, 1000, 0);
        ship.setTint(0x000000);


        //tank
        var tank = this.add.image(-49, 1000, 'title_tankBody');
        var tankTop = this.add.image(-49, 1000, 'title_tankHead');

        //cards
        var cards = [];
        cards.push(this.add.image(1000, 1000, 'title_cardJ').setScale(4,4));
        cards.push(this.add.image(1300, 1000, 'title_cardQ').setScale(4,4));
        cards.push(this.add.image(1600, 1000, 'title_cardK').setScale(4,4));

        //pawn
        var pawn2 = this.add.image(-300, -375, 'title_pawnB');
        var pawn = this.add.image(-500, -375, 'title_pawnW');

        //target practice
        var shootTarget = [];
        shootTarget.push(this.add.image(-1500, 1100, 'title_target').setScale(3,3));
        shootTarget.push(this.add.image(-1000, 1100, 'title_target').setScale(3,3));
        shootTarget.push(this.add.image(-500, 1100, 'title_target').setScale(3,3));
        var crosshair = this.add.image(-400, 800, 'title_crosshair').setTint(0x000000);

        //monster attack
        var monster = this.add.image(2100, 1200, 'title_monster').setScale(3,3);
        var monsterEye = this.add.image(2100, 1200, 'title_monsterEye').setScale(3,3);
        var hpBarBacking = this.add.rectangle(2100, 800, 300, 40, 0x000000);
        var hpBar = this.add.rectangle(2100 - 140, 800, 280, 30, 0xFFFFFF);
        hpBar.setOrigin(0,0.5);


        //about 5 things should be enough
        const timeline = this.add.timeline([
            {   //ship
                at: 1500,
                
                tween: {
                    targets: follower,
                    t:1,
                    duration: 5000,
                    yoyo:false,
                    repeat: 0,
                    onUpdate: function(tween, target)
                    {
                        path.getPoint(follower.t, follower.vec);
                        
                        ship.x = follower.vec.x;
                        ship.y = follower.vec.y;

                        path.getTangent(follower.t, follower.vec);
                        console.log('slope '+follower.vec.x);

                        ship.angle = 90+ Math.atan2(follower.vec.y, follower.vec.x) * 180 / Math.PI;
                        
                        console.log('x '+follower.vec.x);
                        console.log('y '+follower.vec.y);
                    },
                    onComplete: () => {
                        ship.destroy();
                    }
                }
            },
            {   //tank
                at: 6000,

                tween: {
                    targets: [tank, tankTop],
                    x: -49,
                    y: 400,
                    duration: 2000
                }
            },
            {
                at: 8000,

                tween: {
                    targets: tankTop,
                    angle: 45,
                    duration: 1000
                }
            },
            {
                at: 10000,

                run: () => {
                    var bullet = this.add.image(-49, 400, 'title_tankBullet');
                    bullet.angle = 45;

                    this.tweens.add({
                        targets: bullet,
                        x: 1049,
                        y: -1000,
                        duration: 2000,
                        onComplete: () => {
                            bullet.destroy();
                        }
                    });
                }
            },
            {
                at: 12000,

                tween: {
                    targets: tankTop,
                    angle:0,
                    duration: 1000
                }
            },
            {
                at: 12000,

                tween: {
                    targets: [tank, tankTop],
                    x: -49,
                    y: -1000,
                    duration: 3000
                }
            },
            {   //card
                at: 8000,

                tween: {
                    targets: cards[0],
                    y : 700,
                    ease : 'Cubic.in',
                    duration: 500
                }
            },
            {
                at: 8400,

                tween: {
                    targets: cards[1],
                    y : 700,
                    ease : 'Cubic.in',
                    duration: 500
                }
            },
            {
                at: 8800,

                tween: {
                    targets: cards[2],
                    y : 700,
                    ease : 'Cubic.in',
                    duration: 500
                }
            },
            {   //pawn
                at: 13000,

                tween:{
                    targets: pawn,
                    x: -300,
                    duration: 400,
                    onComplete: () => {
                        pawn2.destroy();
                    }
                }
            },
            {
                at: 9000,

                tween: {
                    targets: crosshair,
                    x: -1500,
                    duration: 3000,
                    loop: 0,
                    yoyo: true
                }
            },
            {
                at: 16000,

                tween: {
                    targets: crosshair,
                    x: shootTarget[0].x,
                    y: 1270,
                    duration: 300,
                    onComplete: () => {
                        var targetHit = this.tweens.create({
                            targets: shootTarget[0],
                            scaleX: 0,
                            duration: 75,
                            repeat: 7,
                            yoyo: true,
                            onComplete: () => {
                                shootTarget[0].destroy();
                            }
                        });
            
                        this.tweens.existing(targetHit);
                    }
                }
            },
            {
                at: 16400,

                tween: {
                    targets: crosshair,
                    x: shootTarget[1].x,
                    y: 1270,
                    duration: 300,
                    onComplete: () => {
                        var targetHit = this.tweens.create({
                            targets: shootTarget[1],
                            scaleX: 0,
                            duration: 75,
                            repeat: 7,
                            yoyo: true,
                            onComplete: () => {
                                shootTarget[1].destroy();
                            }
                        });
            
                        this.tweens.existing(targetHit);
                    }
                }
            },
            {
                at: 16800,

                tween: {
                    targets: crosshair,
                    x: shootTarget[2].x,
                    y: 1270,
                    duration: 300,
                    onComplete: () => {
                        var targetHit = this.tweens.create({
                            targets: shootTarget[2],
                            scaleX: 0,
                            duration: 75,
                            repeat: 7,
                            yoyo: true,
                            onComplete: () => {
                                shootTarget[0].destroy();
                            }
                        });
            
                        this.tweens.existing(targetHit);
                    }
                }
            },
            { //monster
                at:14700,

                run: () => {
                    //hit effect for monster
                    monsterEye.setTexture('title_monsterEyeDead');
                    monster.x += 50;
                    monsterEye.x += 50;
                }
            },
            { //monster
                at:14800,

                run: () => {
                    //hit effect for monster
                    monster.x -= 100;
                    monsterEye.x -= 100;
                }
            },
            { //monster
                at:14900,

                run: () => {
                    //hit effect for monster
                    monster.x += 75;
                    monsterEye.x += 75;
                }
            },
            { //monster
                at:15000,

                run: () => {
                    //hit effect for monster
                    monster.x -= 75;
                    monsterEye.x -= 75;
                }
            },
            { //monster
                at:15100,

                run: () => {
                    //hit effect for monster
                    monster.x += 50;
                    monsterEye.x += 50;
                }
            },
            { //monster
                at:15200,

                run: () => {
                    //hit effect for monster
                    monster.x -= 50;
                    monsterEye.x -= 50;
                }
            },
            { //monster
                at:15300,

                run: () => {
                    //hit effect for monster
                    monster.x += 50;
                    monsterEye.x += 50;
                }
            },
            { 
                at: 15000,

                tween: {
                    targets: hpBar,
                    scaleX: 0,
                    duration: 1200
                }
            },
            {   //everybody exit
                at: 18000,

                run: () => {
                    //hit effect for monster
                    [ship, tank, tankTop, cards[0], cards[1], cards[2], pawn, crosshair, monster, hpBarBacking, hpBar, shootTarget[0], shootTarget[1], shootTarget[2], monsterEye].
                    forEach(object => {
                        var exitTween = this.tweens.create({
                            targets: object,
                            x: Math.sign(object.x-640)*10000,
                            y: Math.sign(object.y-360)*10000,
                            ease: 'Quad.easeIn',
                            duration: 1000,
                            repeat: 0,
                            yoyo: false
                        });
            
                        this.tweens.existing(exitTween);
                    })
                }
            },
            { //show start
                at: 20000,

                run: () => {
                    this.playButton.visible = true;
                }
            }
        ]);

        timeline.play();
    }

    ClickPlay()
    {   //screen transition
        //this.scene.start('BackgroundScene'); paper added transition
        this.scene.start('VersusGameScene');

        var narration = this.scene.get('NarrationManager');
        narration.scene.stop();
    }




}