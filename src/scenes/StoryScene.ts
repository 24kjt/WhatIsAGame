import storyDialogue from '../dialogueSystem/StoryScene/storySceneDialogue';


export class StoryScene extends Phaser.Scene {
    
	constructor() {
		super("StoryScene");

        this.style = {
            font: "24px Arial",
            fill: "#ffffff",
            wordWrap: {
                width: this.sceneWidth*0.8, // Set the maximum width for wrapping
                useAdvancedWrap: true // Optional, for more precise wrapping
            },
            align: 'center', // Text alignment

        };
        
        this.cutsceneImage;
        this.cutsceneText;


        //special conditions
        this.modeAutoPlay = false;
        this.modeStartButton = false;
        this.modeHonkButton = false;
        this.modeSometimesWins = false;
        
    }


    preload() {
        this.canvas = this.sys.game.canvas;
        this.snd_honk = this.sound.add('PumpSound');
    }

    create() {
        //scene
        let { width, height } = this.sys.game.canvas;

        console.log('width' + width);
        console.log('height' + height);
        
        this.backgroundPaper = this.add.image(0,0, 'paperBG');
        this.cutsceneImage = this.add.image(width/2-245, height*1.5/4-500+177, '');

        var entryTween = this.tweens.create({
            targets: this.cutsceneImage,
            y: '+= 500',
            ease: 'Quad.easeInOut',
            duration: 1000,
            repeat: 0,
            yoyo: false
          });
      
          this.tweens.existing(entryTween);

        this.cutsceneIndex = 1;
        //this.add.image(0, 0, 'Cutscene_test2');
        //dialogue

        //dialogue options
        
       // this.dialogueText = this.add.text(width/2, height*3/4, "", this.style).setOrigin(0.5, 0);
        

       /*
        if(this.modeStartButton)
        {
            this.SetStartButton(true, "playerAlwaysWins");
        }
        else
        {
            this.StartDialogueSegment("playerAlwaysWins"); //TODO REPLACE WITH GLOBAL VAIRABLE
        }
        
        console.log( storyDialogue);
        console.log( storyDialogue['playerAlwaysWins']);
        */
        this.showingChoices = false;

        //this.SetHonkButton(this.modeHonkButton);

        //start narration
        this.scene.launch('NarrationManager'); // true means start immediately
        var narration = this.scene.get('NarrationManager');
        narration.scene.dialogueKey = "story";
        narration.scene.originalScene = this;
        narration.startDialogue();

    }

    update(time: number, delta: number): void {

        //pointer
        this.input.on('pointerdown', function (pointer)
        {
            if(!this.pointerWasDown && !this.modeAutoPlay)
            {
                //this.ProgressDialogue();
            }

            this.pointerWasDown = true;
            console.log('pointerdown');
        }, this);


        this.input.on('pointerup', function (pointer)
        {
            this.pointerWasDown = false;
            console.log('pointerup');
        }, this);
    }

    StartDialogueSegment (storyVersion)
    {
        this.storyJson = storyDialogue[storyVersion];
        console.log('aaaa' + this.storyDialogue);
        this.dialogueIndex = 0;
        this.LoadDialogue();
    }

    ProgressDialogue()
    {
        //this.cutsceneIndex += 1;
        var narration = this.scene.get('NarrationManager');

        narration.continueDialogue();
        //this.ShowCutscene(this.cutsceneIndex );

        /*
        if(this.storyJson.hasOwnProperty(String(this.dialogueIndex +1)))
        {
            console.log("next dialogue");
            this.dialogueIndex += 1;
        }
        
        if(this.storyJson[String(this.dialogueIndex)].hasOwnProperty("choice") && !this.showingChoices)
        {   
            this.ShowChoices(this.storyJson[String(this.dialogueIndex)].choice);
        }

        this.LoadDialogue(); 
        */
    }

    LoadDialogue()
    {
        this.dialogueText.setText(this.storyJson[String(this.dialogueIndex)].dialogue);
        this.cutsceneImage.setTexture(this.storyJson[String(this.dialogueIndex)].imageKey);
    
        if(this.modeAutoPlay && this.storyJson[String(this.dialogueIndex)].hasOwnProperty("progressTime"))
        {   //auto play
            this.timer = this.time.addEvent({
                delay: this.storyJson[String(this.dialogueIndex)].progressTime * 1000, // milliseconds
                callback: () => this.ProgressDialogue() ,
                callbackScope: this,
                loop: false
            });
        }
    }

    ShowChoices(choiceJson)
    {
        this.showingChoices = true;
        console.log("show choices");
        console.log(choiceJson);

        this.dialogueButtons = Array(3);

        for(let i = 0; i < Object.keys(choiceJson).length; i++)
        {
            var dialogueOption = this.add.text(this.dialogueText.x, this.dialogueText.y + 50*i, 'Option', { 
                backgroundColor: '#4CAF50',
                padding: { x: 10, y: 5 },
                fontSize: '24px'
            });

            dialogueOption.setInteractive();
            dialogueOption.on('pointerdown', () => this.ChooseOption(choiceJson[String(i)].nextDialogue));

            this.dialogueButtons[i] = dialogueOption;
        }

    }

    ChooseOption(nextDialogue)
    {
        this.HideChoices();
        this.StartDialogueSegment(nextDialogue);
    }

    HideChoices()
    {
        this.showingChoices = false;
        console.log("hide choices");

        this.dialogueButtons.forEach(Button =>
            {
                Button.destroy();
            }
        )
    }


    //Special Events
    SetAutoPlay(mode)
    {
        this.modeAutoPlay = mode;
    }

    SetStartButton(mode, storyVersion)
    {
        let { width, height } = this.sys.game.canvas;
        this.modeStartButton = mode;
    
        if(mode)
        {
            this.startButton = this.add.text(width/2, height/2, 'Start', { 
                backgroundColor: '#4CAF50',
                padding: { x: 10, y: 5 },
                fontSize: '24px'
            });

            this.startButton.setInteractive();
            this.startButton.on('pointerdown', () => 
            {
                this.startButton.destroy();
                this.StartDialogueSegment(storyVersion);
            });

        }
        else
        {
            this.startButton.destroy();
        }
    }

    SetHonkButton(mode)
    {
        this.modeHonkButton = mode;
    
        if(mode)
        {
            this.honkButton = this.add.text(100, 400, 'Honk', { 
                backgroundColor: '#4CAF50',
                padding: { x: 10, y: 5 },
                fontSize: '24px'
            });

            this.honkButton.setInteractive();
            this.honkButton.on('pointerdown', () =>
                { 
                    this.snd_honk.play({
                        volume: 0.5,
                        loop: false
                    });
                });
        }
        else if(this.honkButton != null)
        {
            this.honkButton.destroy();
        }
    }

    SometimesWinsCheck()
    {
        let randomValue = Phaser.Math.Between(-1, 1);

        if(randomValue > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }


    PlaySceneAction(actionKey)
    {
        switch(actionKey)
        {
            case "progressDialogue":
                this.ProgressDialogue();
                break;
            case "showCutscene1":
                this.ShowCutscene(1);
                 break
            case "showCutscene2":
                this.ShowCutscene(2);
                break
            case "showCutscene3":
                this.ShowCutscene(3);
                break
            case "showCutscene4":
                this.ShowCutscene(4);
                break
            case "showCutscene5":
                this.ShowCutscene(5);
                break
            case "showCutscene6":
                this.ShowCutscene(6);
                break    
            case "endOfScene":
                this.EndOfScene();
                break   
            case "dropContinue":
                this.IsAnythingAGame()
                break  
            case "bringLeftButton":
                this.BringLeftButton()
                break  
            case "bringRightButton":
                this.BringRightButton()
                break  
        }
    }

    BringLeftButton()
    {
        this.continueButton.destroy();

        let { width, height } = this.sys.game.canvas;

        this.leftButton = this.add.image(width/4,3*height/4, 'story_button_left')

        this.leftButton.setTint(0x000000);



    }

    BringRightButton()
    {
        let { width, height } = this.sys.game.canvas;


        this.leftButton.setInteractive();
        this.leftButton.on('pointerdown', () =>
        {
            this.RandomOutcome();
        });

        this.leftButton.on('pointerover', () => {
            this.leftButton.setTint(0x2C2C2C);

        });
        this.leftButton.on('pointerout', () => 
        {
            this.leftButton.setTint(0x000000);
        });


        this.rightButton = this.add.image(3*width/4,3*height/4, 'story_button_right')

        this.rightButton.setTint(0x000000);

        this.rightButton.setInteractive();
        this.rightButton.on('pointerdown', () =>
        {
            this.RandomOutcome();
        });

        this.rightButton.on('pointerover', () => {
            this.rightButton.setTint(0x2C2C2C);

        });
        this.rightButton.on('pointerout', () => 
        {
            this.rightButton.setTint(0x000000);
        });
    }

    RandomOutcome()
    {
        var value = Phaser.Math.Between(5, 6);

        this.leftButton.destroy();
        this.rightButton.destroy();

        this.ShowCutscene(value);
        this.ProgressDialogue();
    }

    EndOfScene()
    {
        const timeline = this.add.timeline([
            {
                at: 4000,

                run: () => {
                    this.scene.launch('TransitionScene')
                    this.scene.get('TransitionScene').nextScene = 'TicTacToeScene'
            
                    this.scene.get('NarrationManager').scene.stop();
                    //this.scene.start('TicTacToeScene');
                    this.scene.stop();
                }
            }
        ]);

        timeline.play();
    }

    ShowCutscene(number)
    {
        this.cutsceneIndex = number;

        this.cutsceneImage.setOrigin(0,1)
        var entryTween = this.tweens.create({
            targets: this.cutsceneImage,
            angle:  -10,
            ease: 'Quad.easeInOut',
            duration: 100,
            repeat: 0,
            yoyo: true
          });
      
          this.tweens.existing(entryTween);


        switch(number)
        {
            case 1:
                this.cutsceneImage.setTexture('story_cutscene_1');
                break;
            case 2:
                this.cutsceneImage.setTexture('story_cutscene_2');
                break;
            case 3:
                this.cutsceneImage.setTexture('story_cutscene_3');
                break;
            case 4:
                this.cutsceneImage.setTexture('story_cutscene_4');
                break;
            case 5:
                this.cutsceneImage.setTexture('story_cutscene_5_lose');
                break;
            case 6:
                this.cutsceneImage.setTexture('story_cutscene_5_win');
                break;
        }
    }

    BringContinueButton()
    {
        if(this.continueButton != null)
        {
            this.continueButton.destroy();
        }

        let { width, height } = this.sys.game.canvas;

        this.continueButton = this.add.image(width/2, height*3/4, 'story_button_continue')
        this.continueButton.setTint(0x000000);

        this.continueButton.setInteractive();
        this.continueButton.on('pointerdown', () =>
        {
            //this.continueButton.destroy();
            this.ProgressDialogue();
        });

        this.continueButton.on('pointerover', () => {
            this.continueButton.setTint(0x2C2C2C);

        });
        this.continueButton.on('pointerout', () => 
        {
            this.continueButton.setTint(0x000000);
        });
    }

    IsAnythingAGame()
    {
        const timeline = this.add.timeline([
            {   //possess opponent
                at: 1500,
                
                tween: {
                    targets: this.continueButton,
                    y: '+= 500',
                    duration: 2000,
                    yoyo:false,
                    repeat: 0,
                }
            },
            {   //possess opponent
                at: 14000,
                
                run: () => {
                    var chair = this.add.image(100,-140, 'story_object_chair');
                    this.physics.add.existing(chair)
                    chair.body.setGravity(0,1000);
                }
            },
            {   //possess opponent
                at: 17000,
                
                run: () => {
                    var computer = this.add.image(1000,-140, 'story_object_computer');
                    this.physics.add.existing(computer)
                    computer.body.setGravity(0,1000);
                }
            },
            {   //possess opponent
                at: 19000,
                
                run: () => {
                    var door = this.add.image(150,-140, 'story_object_door');
                    this.physics.add.existing(door)
                    door.body.setGravity(0,1000);
                }
            }
            
        ]);

        timeline.play();
    }

}
