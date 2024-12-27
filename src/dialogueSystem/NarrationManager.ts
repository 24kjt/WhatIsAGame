import { SubtitleShower } from '../dialogueSystem/SubtitleShower';
import dialogueData from '../dialogueSystem/dialogueJson/dialogueCollection';

import test1 from '../dialogueSystem/dialogueJson/dialogue_test1';
import test2 from '../dialogueSystem/dialogueJson/dialogue_test2';
import test3 from '../dialogueSystem/dialogueJson/dialogue_test3';

export class NarrationManager extends Phaser.Scene {
    constructor() {
        super({ key: 'NarrationManager' });
    }


    create() {
        this.scene.bringToTop();

        //make subtitle
        this.subtitleSystem = new SubtitleShower(this);
        this.dialogue = dialogueData;


        console.log('AAAA ' + dialogueData.test1);

        this.playDialogueSegment("test1", "start");
    }

    /*
    update() {
        //test function
                if (this.input.keyboard.addKey('R').isDown) {
            this.subtitleSystem.displayText('the quick brown fox jumped over the lazy fox', 2)
        
            this.snd_ballBounce.play({
                volume: 0.5,
                loop: false
            });
        }
    }
    */

    playDialogueSegment(dialogueKey, dialogueID) {

        var dialogueJson = this.keyToJsonFile(dialogueKey);
        var data = dialogueJson[dialogueID];

        this.playDialogue(dialogueJson, dialogueID);

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
                console.log(voteScene);
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
                        }
                        else
                        {
                            var temp = dialogueData[dialogueKey];
                            nextDialogue = temp.no;
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

        var sndClip = this.sound.add(data.audioFile)
        sndClip.play({
            volume: 0.5,
            loop: false
        });

        this.subtitleSystem.displayText(data.text, data.duration);
    }

    keyToJsonFile(key: string) {
        var returnValue;

        switch(key) { 
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