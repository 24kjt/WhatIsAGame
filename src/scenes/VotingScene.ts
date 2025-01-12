import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { UpdateVotingMatterInput } from '../API'; 
import { voteYesVotingMatter }  from '../graphql/mutations';
import { voteNoVotingMatter }  from '../graphql/mutations';

const client = generateClient();


export class VotingScene extends Phaser.Scene {

  public voteKey: string;

    constructor() {
        super({ key: 'VotingScene' });
		this.hasVoted = false;
	}

    create() {
      let screenWidth = this.scale.gameSize.width;
      let screenHeight = this.scale.gameSize.height;

      this.background = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000);
      this.background.setOrigin(0,0);
      this.background.alpha = 0.5;
     // console.log("vote key: "+ this.voteKey);
		// Create voting buttons
        this.question = this.add.image(screenWidth/2, screenHeight/4, 'vote_question');

        this.yesButton = this.add.image(screenWidth/4+50,screenHeight/2, 'vote_yes');
        this.yesButton.setTint(0x8FFF6E);
        
        this.noButton = this.add.image(3*screenWidth/4-50,screenHeight/2, 'vote_no');
        this.noButton.setTint(0xFF6553);

        // Make buttons interactive
        this.yesButton.setInteractive();
        this.noButton.setInteractive();

        this.yesButton.on('pointerover', () => {
          this.yesButton.setTint(0x59C03B);
        });
        this.yesButton.on('pointerout', () => 
        {
          this.yesButton.setTint(0x8FFF6E);
        });

        this.noButton.on('pointerover', () => {
          this.noButton.setTint(0xC54D3F);
        });
        this.noButton.on('pointerout', () => 
        {
          this.noButton.setTint(0xFF6553);
        });

        // Add click handlers
        this.yesButton.on('pointerdown', () => this.voteYes());
        this.noButton.on('pointerdown', () => this.voteNo());
    
        [this.background, this.yesButton, this.noButton, this.question].
        forEach(item => {
          item.y -= 1280;
          item.angle = -20;
        })

        const timeline = this.add.timeline([
          {
            at: 100,
              tween: {
                targets: [this.background, this.yesButton, this.noButton, this.question],
                y: '+= 1280',
                angle: 0,
                ease: 'Cubic.InOut',
                duration: 2000,
                yoyo:false,
                repeat: 0
              }
          }
        ]);


          timeline.play();
      }

  async voteYes()
  {
    this.UninteractiveButtons();

    var exitTween = this.tweens.create({
      targets: this.noButton,
      x: '+= 1200',
      ease: 'Quad.easeIn',
      duration: 1000,
      repeat: 0,
      yoyo: false
    });

    this.tweens.existing(exitTween);


    this.playerVote = true;
    
    this.events.emit("voted");

    console.log('voted yes');
    try{
      const voteID = {
        id: this.scene.voteKey
      };

      const response = await client.graphql({
        query: voteYesVotingMatter,
        variables: {
          id: this.scene.voteKey
        }
      });
      
      this.displayResults(response.data.voteYesVotingMatter);

      return response.data.voteYesVotingMatter;
    } catch (error) {
      console.error('Full Error updating vote:', JSON.stringify(error, null, 2));
      throw error;
    }
  }


  async voteNo()
  {
    this.UninteractiveButtons();

    var exitTween = this.tweens.create({
      targets: this.yesButton,
      x: '-= 1200',
      ease: 'Quad.easeIn',
      duration: 1000,
      repeat: 0,
      yoyo: false
    });

    this.tweens.existing(exitTween);

    console.log('voted no');
    this.playerVote = false;
    this.events.emit("voted",this.playerVote);
    try{
      const voteID = {
        id: this.scene.voteKey
      };

      const response = await client.graphql({
        query: voteNoVotingMatter,
        variables: {
          id: this.scene.voteKey
        }
      });


      this.displayResults(response.data.voteNoVotingMatter);
      return response.data.voteNoVotingMatter;
    } catch (error) {
      console.error('Full Error updating vote:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  UninteractiveButtons()
  {
    this.yesButton.removeListener('pointerover');
    this.yesButton.removeListener('pointerout');
    this.yesButton.removeListener('pointerdown');

    this.yesButton.setTint(0x8FFF6E);
    this.noButton.setTint(0xFF6553);

    this.noButton.removeListener('pointerover');
    this.noButton.removeListener('pointerout');
    this.noButton.removeListener('pointerdown');
  }

  async displayResults(voteData) {
    let screenWidth = this.scale.gameSize.width;
    let screenHeight = this.scale.gameSize.height;

    console.log('displaying results');
    console.log('YES: '+voteData.yesCount);
    console.log('NO: '+voteData.noCount);

    this.container = this.add.image(screenWidth/2, screenHeight+500, 'vote_container');
    this.yesBar = this.add.image(screenWidth/2,screenHeight+500, 'vote_voteBar');
    this.noBar = this.add.image(screenWidth/2,screenHeight+500, 'vote_voteBar');

    this.yesBar.setOrigin(0,0.5);
    this.noBar.setOrigin(1,0.5);

    this.yesBar.setTint(0x8FFF6E)
    this.noBar.setTint(0xFF6553)

    this.yesBar.x -= this.yesBar.width/2;
    this.noBar.x += this.noBar.width/2;

    this.yesBar.scaleX = 0;
    this.noBar.scaleX = 0;

    this.yesBar.scaleY = 0.4;
    this.noBar.scaleY = 0.4;
    this.container.scaleY = 0.4;

    var style = {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2  
    }


    this.textCountYes = this.add.text(this.yesBar.x, this.yesBar.y-80 , "0", ).setOrigin(0, 0);
    this.textCountYes.setAlign('left');
    this.textCountYes.setFont('56px');
    this.textCountYes.setColor('#8FFF6E');

    
    this.textCountNo = this.add.text(this.noBar.x, this.yesBar.y-80, "0", ).setOrigin(1, 0);
    this.textCountNo.setAlign('right');
    this.textCountNo.setFont('56px');
    this.textCountNo.setColor('#FF6553');

    this.textPercentYes = this.add.text(this.yesBar.x, this.yesBar.y-15, "0%", style).setOrigin(0, 0);
    this.textPercentYes.setAlign('left');

    this.textPercentNo = this.add.text(this.noBar.x, this.yesBar.y-15, "0%",style ).setOrigin(1, 0);
    this.textPercentNo.setAlign('right');

    //calculate yes/no ratio    
    let totalCount = voteData.yesCount + voteData.noCount;
    let yesRatio = 0;
    let noRatio = 0;

    if(totalCount > 0 )
    {
      yesRatio = voteData.yesCount/totalCount;
      noRatio = voteData.noCount/totalCount;
    }


    const timeline = this.add.timeline([
      {   //possess opponent
          at: 0,
          
          tween: {
              targets: [this.container,this.yesBar,this.noBar,this.textCountYes,this.textCountYes,this.textCountNo,this.textPercentYes,this.textPercentNo],
              y:'-= 690',
              ease: 'Cubic.InOut',
              duration: 1500,
              yoyo:false,
              repeat: 0,
          },
          
      },
      {
        at: 500,

          tween: {
            targets: this.yesBar,
            scaleX: yesRatio,
            ease: 'Sine.Out',
            duration: 1500,
            yoyo: false,
            repeat:0,
            onUpdate: (tween, target) =>
              {
                let value = target.scaleX*totalCount;
                this.textCountYes.setText(value.toFixed(0));
  
                value = target.scaleX*100;
                this.textPercentYes.setText(value.toFixed(2)+'%');
              }
          }
      },
      {
        at: 500,

          tween: {
            targets: this.noBar,
            scaleX: noRatio,
            ease: 'Sine.Out', //find smoother 
            duration: 1500,
            yoyo: false,
            repeat:0, //randomly flip y to simulate changing outline?
            onUpdate: (tween, target) =>
              {
                let value = target.scaleX*totalCount;
                this.textCountNo.setText(value.toFixed(0));
  
                value = target.scaleX*100;
                this.textPercentNo.setText(value.toFixed(2)+'%');
              }
          }
      },
      {
        at: 3000,
          tween: {
            targets: [this.background,this.container,this.yesBar,this.noBar,this.textCountYes,this.textCountYes,this.textCountNo,this.textPercentYes,this.textPercentNo, this.yesButton, this.noButton,this.question],
            y: -800, 
            angle: -30,
            ease: 'Cubic.InOut',
            duration: 1500,
            yoyo:false,
            repeat: 0,
            onComplete: () => 
            {
              console.log('voting scene close');
              //this.scene.events.removeAllListeners(); 
              this.scene.stop();
            }

          }
      }
      
  ]);

  timeline.play();

  }

  GetVoteResults()
  {
    return this.playerVote;
  }
  
}
