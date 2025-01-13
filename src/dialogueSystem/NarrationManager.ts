import { SubtitleShower } from '../dialogueSystem/SubtitleShower';
import dialogueData from '../dialogueSystem/dialogueJson/dialogueCollection';

import test1 from '../dialogueSystem/dialogueJson/dialogue_test1';
import test2 from '../dialogueSystem/dialogueJson/dialogue_test2';
import test3 from '../dialogueSystem/dialogueJson/dialogue_test3';

import title from '../dialogueSystem/dialogueJson/dialogue_title'


import versusNarration from '../dialogueSystem/dialogueJson/dialogue_versus'
import versusNarration_y from '../dialogueSystem/dialogueJson/dialogue_versus_y'
import versusNarration_yy from '../dialogueSystem/dialogueJson/dialogue_versus_yy'
import versusNarration_yn from '../dialogueSystem/dialogueJson/dialogue_versus_yn'
import versusNarration_n from '../dialogueSystem/dialogueJson/dialogue_versus_n'
import versusNarration_ny from '../dialogueSystem/dialogueJson/dialogue_versus_ny'
import versusNarration_nn from '../dialogueSystem/dialogueJson/dialogue_versus_nn'

import storyNarration from '../dialogueSystem/dialogueJson/dialogue_story'
import storyNarration_y from '../dialogueSystem/dialogueJson/dialogue_story_y'
import storyNarration_n from '../dialogueSystem/dialogueJson/dialogue_story_n'
import storyNarration_ny from '../dialogueSystem/dialogueJson/dialogue_story_ny'
import storyNarration_nyy from '../dialogueSystem/dialogueJson/dialogue_story_nyy'
import storyNarration_nyn from '../dialogueSystem/dialogueJson/dialogue_story_nyn'
import storyNarration_nn from '../dialogueSystem/dialogueJson/dialogue_story_nn'
import storyNarration_nny from '../dialogueSystem/dialogueJson/dialogue_story_nny'
import storyNarration_nnn from '../dialogueSystem/dialogueJson/dialogue_story_nnn'

import externalNarration from '../dialogueSystem/dialogueJson/dialogue_external'
import externalNarration_y from '../dialogueSystem/dialogueJson/dialogue_external_y'
import externalNarration_yy from '../dialogueSystem/dialogueJson/dialogue_external_yy'
import externalNarration_yyy from '../dialogueSystem/dialogueJson/dialogue_external_yyy'
import externalNarration_yyn from '../dialogueSystem/dialogueJson/dialogue_external_yyn'
import externalNarration_yn from '../dialogueSystem/dialogueJson/dialogue_external_yn'
import externalNarration_n from '../dialogueSystem/dialogueJson/dialogue_external_n'
import externalNarration_ny from '../dialogueSystem/dialogueJson/dialogue_external_ny'
import externalNarration_nn from '../dialogueSystem/dialogueJson/dialogue_external_nn'
import externalNarration_nny from '../dialogueSystem/dialogueJson/dialogue_external_nnn'


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

                        this.scene.get('VotingScene').events.off("voted");

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
            case "title":{
                console.log('versus');
               returnValue = title;
                break
            }
            case "versus":{
                console.log('versus');
               returnValue = versusNarration;
                break
            }
            case "versus_y":{
                console.log('versus y');
               returnValue = versusNarration_y;
                break
            }
            case "versus_yy":{
                console.log('versus yy');
               returnValue = versusNarration_yy;
                break
            }
            case "versus_yn":{
                console.log('versus yn');
               returnValue = versusNarration_yn;
                break
            }
            case "versus_n":{
                console.log('versus n');
               returnValue = versusNarration_n;
                break
            }
            case "versus_ny":{
                console.log('versus ny');
               returnValue = versusNarration_ny;
                break
            }
            case "versus_nn":{
                console.log('versus nn');
               returnValue = versusNarration_nn;
                break
            }
            case "story":{
                console.log('story');
               returnValue = storyNarration;
                break
            }
            case "story_y":{
                console.log('story_y');
               returnValue = storyNarration_y;
                break
            }
            case "story_n":{
                console.log('story_n');
               returnValue = storyNarration_n;
                break
            }
            case "story_ny":{
                console.log('story_ny');
               returnValue = storyNarration_ny;
                break
            }
            case "story_nyy":{
                console.log('story_nyy');
               returnValue = storyNarration_nyy;
                break
            }
            case "story_nyn":{
                console.log('story_nyn');
               returnValue = storyNarration_nyn;
                break
            }
            case "story_nn":{
                console.log('story_nn');
               returnValue = storyNarration_nn;
                break
            }
            case "story_nny":{
                console.log('story_nny');
               returnValue = storyNarration_nny;
                break
            }
            case "story_nnn":{
                console.log('story_nny');
               returnValue = storyNarration_nnn;
                break
            }
            case "external":{
                console.log('external');
               returnValue = externalNarration;
                break
            }
            case "external_y":{
                console.log('external_');
               returnValue = externalNarration_y;
                break
            }
            case "external_yy":{
                console.log('external_');
               returnValue = externalNarration_yy;
                break
            }
            case "external_yyy":{
                console.log('external_');
               returnValue = externalNarration_yyy;
                break
            }
            case "external_yyn":{
                console.log('external_');
               returnValue = externalNarration_yyn;
                break
            }
            case "external_yn":{
                console.log('external_');
               returnValue = externalNarration_yn;
                break
            }
            case "external_n":{
                console.log('external_n');
               returnValue = externalNarration_n;
                break
            }
            case "external_ny":{
                console.log('external_ny');
               returnValue = externalNarration_ny;
                break
            }
            case "external_nn":{
                console.log('external_nn');
               returnValue = externalNarration_nn;
                break
            }
            case "external_nnn":{
                console.log('external_nnn');
               returnValue = externalNarration_nnn;
                break
            }
            case "external_nny":{
                console.log('external_nny');
               returnValue = externalNarration_nny;
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