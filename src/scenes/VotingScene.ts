import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { UpdateVotingMatterInput } from '../API'; 
import { voteYesVotingMatter }  from '../graphql/mutations';
import { voteNoVotingMatter }  from '../graphql/mutations';

const client = generateClient();


export class VotingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VotingScene' });
		this.hasVoted = false;
	}

    create() {
		// Create voting buttons
        const yesButton = this.add.text(100, 100, 'Vote Yes', { 
            backgroundColor: '#4CAF50',
            padding: { x: 10, y: 5 },
            fontSize: '24px'
        });
        
        const noButton = this.add.text(300, 100, 'Vote No', {
            backgroundColor: '#f44336',
            padding: { x: 10, y: 5 },
            fontSize: '24px'
        });

        // Make buttons interactive
        yesButton.setInteractive();
        noButton.setInteractive();

        // Add click handlers
        yesButton.on('pointerdown', () => this.voteYes());
        noButton.on('pointerdown', () => this.voteNo());
    }

  async voteYes()
  {
    this.playerVote = true;
    
    this.events.emit("voted");

    console.log('voted yes');
    try{
      const voteID = {
        id: "questionTest"
      };

      const response = await client.graphql({
        query: voteYesVotingMatter,
        variables: {
          id: "questionTest"
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
    console.log('voted no');
    this.playerVote = false;
    this.events.emit("voted",this.playerVote);
    try{
      const voteID = {
        id: "questionTest"
      };

      const response = await client.graphql({
        query: voteNoVotingMatter,
        variables: {
          id: "questionTest"
        }
      });


      this.displayResults(response.data.voteNoVotingMatter);
      return response.data.voteNoVotingMatter;
    } catch (error) {
      console.error('Full Error updating vote:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  
  async displayResults(voteData) {
    console.log('displaying results');
    console.log('YES: '+voteData.yesCount);
    console.log('NO: '+voteData.noCount);

  }

  GetVoteResults()
  {
    return this.playerVote;
  }
  
}
