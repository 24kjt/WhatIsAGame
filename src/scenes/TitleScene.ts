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
    }

    preload() {

    }

    create(){
        const style = {
            font: "24px Arial",
            fill: "#ffffff",
            wordWrap: {
                width: this.sceneWidth*0.8, // Set the maximum width for wrapping
                useAdvancedWrap: true // Optional, for more precise wrapping
            },
            align: 'center', // Text alignment

        };


        let { width, height } = this.sys.game.canvas;

        this.startText = this.add.text(width/2, height/2, "Click to Start", style);


    }

    update(time: number, delta: number): void {
        switch(this.stage)
        {
            case IntroStage.PreStart:
                if(this.input.activePointer.isDown)
                {
                    this.startText.destroy();
                    this.stage = IntroStage.Intro;
                    this.CreateSnake();
                }
                break;
            case IntroStage.Intro:

                break;
            case IntroStage.Done:
                
                break;
            case IntroStage.ZoomOut:

                break;
            case IntroStage.TitleIn:

                break;
            case IntroStage.Done:

                break;
        }
    }

    CreateSnake()
    {

    }
}