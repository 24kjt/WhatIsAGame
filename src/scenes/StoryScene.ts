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
        
        
        this.cutsceneImage = this.add.image(width/2, height*1/4, '');
        
        //this.add.image(0, 0, 'Cutscene_test2');
        //dialogue

        //dialogue options
        
        this.dialogueText = this.add.text(width/2, height*3/4, "", this.style).setOrigin(0.5, 0);
        
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
        this.showingChoices = false;

        this.SetHonkButton(this.modeHonkButton);
    }

    update(time: number, delta: number): void {

        //pointer
        this.input.on('pointerdown', function (pointer)
        {
            if(!this.pointerWasDown && !this.modeAutoPlay)
            {
                this.ProgressDialogue();
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
}
