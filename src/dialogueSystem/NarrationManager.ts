import { SubtitleShower } from '../dialogueSystem/SubtitleShower';
import dialogueData from '../dialogueSystem/dialogueJson/dialogueCollection';

import test1 from '../dialogueSystem/dialogueJson/dialogue_test1';
import test2 from '../dialogueSystem/dialogueJson/dialogue_test2';
import test3 from '../dialogueSystem/dialogueJson/dialogue_test3';

import versusNarration from '../dialogueSystem/dialogueJson/dialogue_versus'

export class NarrationManager extends Phaser.Scene {
    public dialogueKey: string;
    public originalScene;
    
    constructor() {
        super({ key: 'NarrationManager' });
    }


    create() {
        this.scene.bringToTop();
    }

    startDialogue()
    {
        //make subtitle
        this.subtitleSystem = new SubtitleShower(this);
        this.dialogue = dialogueData;

        console.log('ddddd ' +this.scene.dialogueKey);
        this.playDialogueSegment(this.scene.dialogueKey, "start");
    }

    
    update() {
        //test function
                if (this.input.keyboard.addKey('Enter').isDown) {
                    //next line
                    this.timer.elapsed = this.timer.delay-10;
                    this.sndClip.stop();
        }
    }
    

    playDialogueSegment(dialogueKey, dialogueID) {

        var dialogueJson = this.keyToJsonFile(dialogueKey);
        var data = dialogueJson[dialogueID];

        this.playDialogue(dialogueJson, dialogueID);

        if(data.hasOwnProperty('sceneAction') )
        {
            this.scene.originalScene.PlaySceneAction(data.sceneAction);
        }

        if(data.nextLine != "")
        {
            this.timer = this.time.addEvent({
                delay: data.nextLineDelay, // milliseconds
                callback: () => this.playDialogueSegment(dialogueKey, data.nextLine) ,
                callbackScope: this,
                loop: false
            });
        }
        else
        {//play callback to get attention from voting scene
            if(data.event == "vote")
            {
                this.scene.launch('VotingScene'); // true means start immediately
                var voteScene = this.scene.get('VotingScene');
                voteScene.scene.voteKey = data.voteKey;
                var nextDialogue = ""; //string key for next dialogue
                //attach event listener to voteYes and voteNo
                
                this.scene.get('VotingScene').events.on("voted",
                    () => {
                        var yes = voteScene.GetVoteResults();

                        console.log("voted result event trigger");

                        if(yes)
                        {
                            var temp = dialogueData[dialogueKey];
                            nextDialogue = temp.yes;
                           // this.scene.originalScene.votedYes();
                        }
                        else
                        {
                            var temp = dialogueData[dialogueKey];
                            nextDialogue = temp.no;
                          //  this.scene.originalScene.votedNo();
                        }

                        console.log(nextDialogue);
                        this.playDialogueSegment(nextDialogue, "start");
                    },
                    this
                )
                //call event to for voteScene to exit

                    //start next dialogue path
                    /*
                        boolean yes = voteScene.GetVoteResults();

                        if(yes)
                        {
                            nextDialogue = dialogueData.dialogueKey.yes;
                        }
                        else
                        {
                            nextDialogue = dialogueData.dialogueKey.no;
                        }

                        this.playDialogueSegment(this.keyToJsonFile(nextDialogue), "start");
                    */
            }
        }
    }

    playDialogue(dialogueJson, dialogueID: string){
        var data = dialogueJson[dialogueID];
        console.log(dialogueID)
        if(!this.sound.locked)
        {
            this.sndClip = this.sound.add(data.audioFile)
            this.sndClip.play({
                volume: 1,
                loop: false
            });
        }

        this.subtitleSystem.displayText(data.text, data.duration);
    }

    keyToJsonFile(key: string) {
        var returnValue;

        switch(key) { 
            case "versus":{
                console.log('versus');
               returnValue = versusNarration;
                break
            }
            case "test1": { 
               //statements; 
               console.log('case 1');
               returnValue = test1;
               break; 
            } 
            case "test2": { 
               //statements; 
               console.log('case 2');
               returnValue = test2;
               break; 
            } 
            case "test3": {
               //statements;
               console.log('case 3');
               returnValue = test3;
               break;
            }
            default: { 
               //statements; 
               returnValue = test1;
               console.log('case def');
               break; 
            } 
         } 

        return returnValue;
    }

}