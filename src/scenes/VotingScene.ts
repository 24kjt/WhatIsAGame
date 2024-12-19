import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { UpdateVotingMatterInput } from '../API'; 
import { voteYesVotingMatter }  from '../graphql/mutations';
const client = generateClient();

const voteDetails = {
  id: 'questionTest',
  yesCount: 0,
  noCount: 0,
};


//import config from 'amplifyconfiguration.json';
//Amplify.configure(config);





//import { type CreateVoteInput } from './API'; //
//import { UpdateVotingMatterMutation, UpdateVotingMatterInput } from 'src/API.ts';


// GraphQL mutations

/*
const GetVotingMatterQuery = `
  query GetVotingMatter($id: ID!) {
    getVotingMatter(id: $id) {
      id
      yesCount
      noCount
      # Add other fields you need
    }
  }
`;

const GetVotingInputMutation = `
mutation GetVotingMatter($id: ID!, $yesCount: YesCount!, $noCount: NoCount!) {
    getVotingInputMutation(id: $id, yesCount: $yesCount, noCount: $noCount) {
      id
      yesCount
      noCount
      # Add other fields you need
    }
  }
  `;

const client = generateClient<Schema>({
  authMode: 'apiKey',
}); 
*/


interface VotingMatter {
  id: string;
  yesCount: number;
  noCount: number;
  // Add other properties as needed
}




export class VotingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VotingScene' });
		this.hasVoted = false;
	}

    create() {
		// Check if user has already voted
		//this.hasVoted = localStorage.getItem('hasVoted') === 'true';
        
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
        noButton.on('pointerdown', () => this.submitVote('NO'));
    }

  async voteYes()
  {
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
      return response.data.voteYesVotingMatter;
    } catch (error) {
      console.error('Full Error updating vote:', JSON.stringify(error, null, 2));
      throw error;
    }
  }



	async submitVote(choice) {
        if (this.hasVoted) {
          console.log('aaaaaaa');
            this.add.text(200, 200, 'You have already voted!', {
                fontSize: '18px',
                fill: '#ff0000'
            }).setOrigin(0.5);
            return;
        }
        console.log('aaaaaaa');
        try {
            // ... previous voting logic ...
            
            // Set the vote flag after successful submission
            this.hasVoted = true;
            console.log('aaaaaaa');
            // Store in local storage to persist across sessions
            localStorage.setItem('hasVoted', 'true');
            this.updateVote();
            //this.displayResults();
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    }



  
  async displayResults() {
	  try {
		  const voteData = await client.graphql({
        query: queries.getVotingMatter,
        variables: {
          id: "questionTest"
        }
      });
		  console.log('aaaaaaa');
      

		  const votes = voteData.data.getVotingMatter;
		  
		  const yesVotes = votes.yesCount;
		  const noVotes = votes.noCount;
		  
		  // Display results in your Phaser scene
		  this.add.text(200, 300, `Results: Yes: ${yesVotes} No: ${noVotes}`, {
			  fontSize: '18px',
			  fill: '#ff0000'
		  }).setOrigin(0.5);
		  
	  } catch (error) {
		  console.error('Error fetching votes:', error);
	  }
  }

  async updateVote() {
    try {
      const updateDetails: UpdateVotingMatterInput = {
        id: "questionTest",
        votingMatterName: "DDD",
        yesCount: 1,
        noCount: 1
      };

		  console.log('bbbbbb');

		  const voteData = await client.graphql({
        query: mutations.updateVotingMatter,
        variables: {
          input: updateDetails
        }
      });

		  console.log('cccccc');

/*
      const response = await ApiError.graphql({
        query: mutations.updateVotingMatter,
        variables: {
          input: voteData
        }
      });
      console.log('Vote updated successfully:', response);
*/

    } catch (error) {
      console.error('Full Error updating vote:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
  
}
