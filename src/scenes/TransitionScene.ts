export class TransitionScene extends Phaser.Scene {
    constructor() {
        super("TransitionScene");

    }

    preload() {

    }

    create(){
        //this.nextScene = 'TitleScene'
        this.OffAndOn();
    }

    CompileResults()
    {

    }

    update(time: number, delta: number): void {

    }

    OffAndOn()
    {
        const timeline = this.add.timeline([
            {
                at: 0,

                run: () => {
                    let sndClip = this.sound.add('lightOff')
                    sndClip.play({
                        volume: 0.5,
                        loop: false
                    });
                }
            },
            {
                at: 2400,

                run: () => {
                    let sndClip = this.sound.add('lightOn')
                    sndClip.play({
                        volume: 0.5,
                        loop: false
                    });

                    this.scene.launch(this.nextScene);
                    console.log('launching '+this.nextScene);
                }
            },
            {
                at: 3000,

                run: () => {
                    this.scene.stop();
                    
                }
            }
        ]);

        timeline.play();
    }
}