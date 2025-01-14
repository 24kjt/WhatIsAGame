export class RecorderScene extends Phaser.Scene {
    constructor() {
        super("RecorderScene");

    }

    preload() {

    }

    create(){
        this.needsLosing = "undefined"
        this.needsWinning = "undefined"

        this.needsAnyInteraction = "undefined"
        this.anyInteractionIsInteraction = "undefined"
        this.interactionNeedsToBeInGame = "undefined"
        this.needsChoice = "undefined"

        this.needsToBeNotPaid = "undefined"
        this.needsToBeEnjoyed = "undefined"
        this.needsToBeFictional = "undefined"
        this.needsToBeVoluntary = "undefined"


/*
        this.needsLosing = true
        this.needsWinning = true

        this.needsAnyInteraction = true
        this.anyInteractionIsInteraction = true
        this.interactionNeedsToBeInGame = true
        this.needsChoice = true

        this.needsToBeNotPaid = true
        this.needsToBeEnjoyed = true
        this.needsToBeFictional = true
        this.needsToBeVoluntary = true*/
    }

    SetValue(key, value)
    {
        switch(key)
        {
            case "needsLosing":
                this.needsLosing = value;
                break;
            case "needsWinning":
                this.needsWinning = value;
                break;


            case "needsAnyInteraction":
                this.needsAnyInteraction = value;
                break;
            case "anyInteractionIsInteraction":
                this.anyInteractionIsInteraction = value;
                break;
            case "interactionNeedsToBeInGame":
                this.interactionNeedsToBeInGame = value;
                break;
            case "needsChoice":
                this.needsChoice = value;
                break;


            case "needsToBeNotPaid":
                this.needsToBeNotPaid = value;
                break;
            case "needsToBeEnjoyed":
                this.needsToBeEnjoyed = value;
                break;
            case "needsToBeFictional":
                this.needsToBeFictional = value;
                break;
            case "needsToBeVoluntary":
                this.needsToBeVoluntary = value;
                break;
        }
    }

    update(time: number, delta: number): void {
        if (this.input.keyboard.addKey('m').isDown) {
            console.log("m pressed")
            console.log(this.needsLosing )
            console.log(this.needsWinning )
    
            console.log(this.needsAnyInteraction )
            console.log(this.anyInteractionIsInteraction )
            console.log(this.interactionNeedsToBeInGame )
            console.log(this.needsChoice )
    
            console.log(this.needsToBeNotPaid)
            console.log(this.needsToBeEnjoyed)
            console.log(this.needsToBeFictional)
            console.log(this.needsToBeVoluntary )
          }
    }
}