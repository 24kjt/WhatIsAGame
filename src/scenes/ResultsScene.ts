export class ResultsScene extends Phaser.Scene {
    constructor() {
        super("ResultsScene");

    }

    preload() {

    }

    create(){
        let { width, height } = this.sys.game.canvas;

        this.add.image(0,0, 'paperBG');

        this.recorder = this.scene.get("RecorderScene")
        this.text = [];
        this.text[0] = this.add.text(width/2, 100, "Your Defition Says A Game Is An Activitiy...", { fontSize: '42px', color: '#1C1C1C' });
        this.text[0].setAlign("center").setOrigin(0.5);

        this.CompileResults();

        console.log("check1"+this.recorder.scene.needsToBeNotPaid);
        console.log("check2"+this.recorder.needsToBeNotPaid);
    }

    CompileResults()
    {
        let { width, height } = this.sys.game.canvas;

        var textBuf;

        if(this.recorder.needsLosing == true)
        {
            textBuf = "Where you can lose"    
            this.text.push(textBuf);
        }
        if(this.recorder.needsWinning == true)
        {
            textBuf = "Where you can win"    
            this.text.push(textBuf);
        }


        if(this.recorder.needsAnyInteraction == true)
        {
            textBuf = "That you can interact with"    
            this.text.push(textBuf);
        }
        if(this.recorder.interactionNeedsToBeInGame == true)
        {
            textBuf = "and the interaction is within a boundaries of a game"    
            this.text.push(textBuf);
        }
        if(this.recorder.needsChoice == true)
        {
            textBuf = "and which the interaction has influence on state of the game"    
            this.text.push(textBuf);
        }


        if(this.recorder.needsToBeNotPaid == true)
            {
                textBuf = "That is not productive"    
                this.text.push(textBuf);
            }    
        if(this.recorder.needsToBeEnjoyed == true)
            {
                textBuf = "That is enjoyed"    
                this.text.push(textBuf);
            }  
        if(this.recorder.needsToBeFictional == true)
            {
                textBuf = "That is fictional"    
                this.text.push(textBuf);
            }  
        if(this.recorder.needsToBeVoluntary == true)
            {
                textBuf = "That is participated willingly"    
                this.text.push(textBuf);
            }  
    
        if(this.text.length >1)
        {
            for(var i = 1; i < this.text.length; i++)
            {
                console.log('adding'+this.text[i])
                this.add.text(width/2, 175+i*50, this.text[i], { fontSize: '32px', color: '#1C1C1C' })
                .setAlign("center").setOrigin(0.5);
            }
        }
    }

    update(time: number, delta: number): void {

    }

    EnterResults()
    {
        const timeline = this.add.timeline([
            {
                at: 4000,

                run: () => {
                   
                }
            }
        ]);

        timeline.play();
    }
}