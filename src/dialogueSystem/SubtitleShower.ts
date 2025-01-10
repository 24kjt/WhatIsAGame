export class SubtitleShower{

    private scene: Phaser.Scene;
    private text: Phaser.GameObjects.Text;
    
    private gameSize: Phaser.Structs.Size;
    private sceneWidth: number;
    private sceneHeight: number;
    private timer: Phaser.Time.TimerEvent;
    private rect: Phaser.Geom.Rectangle;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x00aaaa }, fillStyle: { color: 0x0000aa } });

        this.gameSize = scene.scale.gameSize;
        this.sceneWidth = this.gameSize.width; 
        this.sceneHeight = this.gameSize.height;
        this.timer;


        const style = {
            font: "32px Arial",
            fill: "#ffffff",
            wordWrap: {
                width: this.sceneWidth*0.8, // Set the maximum width for wrapping
                useAdvancedWrap: true // Optional, for more precise wrapping
            },
            align: 'center', // Text alignment

        };

        this.text = scene.add.text(this.sceneWidth/2, this.sceneHeight*0.9, "", style);
        this.text.setOrigin(0.5, 0);
    }

    displayText(newText: string, displayDuration: number)
    {
        this.graphics.clear();

        this.text.text = newText;
        this.rect = new Phaser.Geom.Rectangle(this.sceneWidth/2-this.text.width/2, this.sceneHeight*0.9, this.text.width, this.text.height);
        this.graphics.fillStyle( 0x000000, 1.0);
        this.graphics.fillRectShape(this.rect);



        this.timer = this.scene.time.addEvent({
            delay: displayDuration, // milliseconds
            callback: () => this.hideText() ,
            callbackScope: this,
            loop: false
        });

        
    }

    hideText()
    {
        this.graphics.clear();
        this.text.text = '';
        this.rect.width = 0;
    }



}