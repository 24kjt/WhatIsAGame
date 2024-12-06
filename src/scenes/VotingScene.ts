import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { type CreateVoteInput } from './API'; //

// GraphQL mutations
const GetVotingMatterQuery = /* GraphQL */ `
  query GetVotingMatter($id: ID!) {
    getVotingMatter(id: $id) {
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
        yesButton.on('pointerdown', () => this.submitVote('YES'));
        noButton.on('pointerdown', () => this.submitVote('NO'));
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

            this.displayResults();
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    }



  
  async displayResults() {
	  try {
		  const voteData = await client.graphql({
        query: GetVotingMatterQuery,
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
  
}
