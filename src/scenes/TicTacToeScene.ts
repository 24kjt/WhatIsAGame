import { GameData } from '../GameData';


export class TicTacToeScene extends Phaser.Scene {
  private board: string[][];
  private placementHitbox;

	constructor() {
		super("TicTacToeScene");

    }

    preload() {

    }

    create(){
      let { width, height } = this.sys.game.canvas;

      this.add.image(0,0, 'paperBG');

      this.playerTurn = true;
      this.playerSide = 'x';

      this.aiPattern = 'random'

      this.boardSprite = this.add.image(width/2, height/2, 'tic_grid');
      this.boardPieces = [];
      
      console.log('Test registry ' + GameData.testBool);
      GameData.testBool = true;
      console.log('Test registry 2' + GameData.testBool);

      this.initializeBoard();

      this.ui_you = this.add.image(150, 60, 'ui_you');
      this.ui_opponent = this.add.image(width+ 150, 50, 'ui_john');

      this.ui_yourTurn  = this.add.image(300, 100, 'ui_yourTurn');
      this.ui_theirTurn  = this.add.image(width- 300, 100, 'ui_yourTurn');
      this.ui_theirTurn.setAlpha(0)

      this.playerScore = 0;
      this.opponentScore = 0;

      this.playerScoreText = this.add.text(250, 25, '0', {
          fontSize: '48px',
          color: '#1C1C1C'
      });
      this.opponentScoreText = this.add.text(width- 275, 25, '0', {
          fontSize: '48px',
          color: '#1C1C1C'
      });

      this.opponentScoreText.setAlign = 'right'


      this.scene.launch('NarrationManager'); // true means start immediately
      var narration = this.scene.get('NarrationManager');
      narration.scene.dialogueKey = "external";
      narration.scene.originalScene = this;
      narration.startDialogue();
    }

    initializeBoard()
    {
      let { width, height } = this.sys.game.canvas;

      this.board = [];
      this.placementHitbox = [];

      for(let i = 0; i<3; i++)
      {
        this.board[i] = [];
        this.placementHitbox[i] = [];

        for (let j =0; j<3; j++)
        {
          this.board[i][j] = "";
          this.placementHitbox[i][j] = this.add.rectangle(width/2 + ((i-1)*150), height/2 + ((j-1)*150), 110, 110, 0x000000);
          this.placementHitbox[i][j].setAlpha(0.01);

          this.placementHitbox[i][j].setInteractive();

          this.placementHitbox[i][j].on('pointerover', () => {
            if(this.playerTurn && this.board[i][j] == "")
            {
              this.placementHitbox[i][j].setAlpha(0.2);
            }
          });
          this.placementHitbox[i][j].on('pointerout', () => 
          {
            this.placementHitbox[i][j].setAlpha(0.01);
          });
  
          // Add click handlers
          this.placementHitbox[i][j].on('pointerdown', () => {
            if(this.playerTurn && this.board[i][j] == "")
            {
              this.playerPlacePiece(i,j);
              this.placementHitbox[i][j].setAlpha(0.01);
            }
          });
        }
      }
    }

    update(time: number, delta: number): void {

      //console.log(this.input.mousePointer.x, this.input.mousePointer.y);
      if (this.input.keyboard.addKey('R').isDown) {
        this.resetBoard();
      }
    }

    playerPlacePiece(x,y)
    {
      var piece;

      if(this.playerSide == 'x')
      {
        piece = this.add.image(0, 0, 'tic_x');
        this.board[x][y] = 'x';
      }
      else
      {
        piece = this.add.image(0, 0, 'tic_o');
        this.board[x][y] = 'o';
      }

      piece.x = this.getGridX(x);
      piece.y = this.getGridY(y);
      this.boardPieces.push(piece)
      this.victoryCheck()

      //this.playerTurn = false;
      //this.aiTurn()
    }

    aiTurn()
    {
      //ADD AI THINKING DELAY
      
      this.timer = this.time.addEvent({
        delay: 1000, // milliseconds
        callback: () => {


        switch(this.aiPattern)
        {
            case 'random':
              var x = Math.floor(Math.random() * 3);
              var y = Math.floor(Math.random() * 3);

              while(this.board[x][y] != "")
              {
                x = Math.floor(Math.random() * 3);
                y = Math.floor(Math.random() * 3);
              }

              this.aiPlacePiece(x, y);
              break;
          }

          this.playerTurn = true;
        },
        callbackScope: this,
        loop: false
        });
    }

    aiPlacePiece(x,y)
    {
      var piece;

      if(this.playerSide == 'x')
      {
        piece = this.add.image(0, 0, 'tic_o');
        this.board[x][y] = 'o';
      }
      else
      {
        piece = this.add.image(0, 0, 'tic_x');
        this.board[x][y] = 'x';
      }

      piece.x = this.getGridX(x);
      piece.y = this.getGridY(y);
      this.boardPieces.push(piece)
      this.victoryCheck()

    }

    victoryCheck()
    {
      //horizontal check
      for(let i = 0; i<3; i++)
      {
        if(this.board[i][0] != "" && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2])
        {
          if(this.board[i][0] == 'x')
          {
            this.playerWin(true);
            console.log('X wins');
            return;
          }
          else
          {
            this.playerWin(false);
            console.log('O wins');
            return;
          }
        }
      }

      //vertical check
      for(let i = 0; i<3; i++)
        {
          if(this.board[0][i] != "" && this.board[0][i] == this.board[1][i] && this.board[1][i] == this.board[2][i])
          {
            if(this.board[0][i] == 'x')
            {
              this.playerWin(true);
              console.log('X wins');
              return;
            }
            else
            {
              this.playerWin(false);
              console.log('O wins');
              return;
            }
          }
        }
      //diagonal check

      for(let i = 0; i<3; i++)
      {
        if(this.board[0][0] != "" && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2])
        {
          if(this.board[0][0] == 'x')
          {
            this.playerWin(true);
            console.log('X wins');
            return;
          }
          else
          {
            this.playerWin(false);
            console.log('O wins');
            return;
          }
        }

        if(this.board[2][0] != "" && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2])
        {
            if(this.board[2][0] == 'x')
            {
              this.playerWin(true);
              console.log('X wins');
              return;
            }
            else
            {
              this.playerWin(false);
              console.log('O wins');
              return;
            }
        }
      }

      this.drawCheck();
    }

    drawCheck()
    {
      let draw = true;

      for(let i = 0; i<3; i++)
      {
        for (let j =0; j<3; j++)
        {
          if(this.board[i][j] == "")
          {
            draw = false
          }
        }
      }

      if(!draw)
      {
        if(this.playerTurn)
          {
            this.aiTurn()
            this.playerTurn = false;
            this.ui_yourTurn.setAlpha(0)
            this.ui_theirTurn.setAlpha(1)

          }
          else
          {
            this.playerTurn = true;
            this.ui_yourTurn.setAlpha(1)
            this.ui_theirTurn.setAlpha(0)

          }
      }
      else{
        console.log('Draw');
        this.resetBoard();
      }

    }

    getGridX(x)
    {
      let { width, height } = this.sys.game.canvas;
      return (width/2 + ((x-1)*150));
    }

    getGridY(y)
    {
      let { width, height } = this.sys.game.canvas;
      return (height/2 + ((y-1)*150));   
    }

    playerWin(xWins)
    {
      var winMessage 
      let { width, height } = this.sys.game.canvas;

      if(xWins)
      {
        winMessage = this.add.image(width/2, height/2, 'ui_win');
      }
      else
      {
        winMessage = this.add.image(width/2, height/2, 'ui_lose');

      }

      const timeline = this.add.timeline([
        {
          at: 0,

          run: () => {
            winMessage.setAlpha(1);
            if(xWins == (this.playerSide =='x'))
              {
                this.playerScore += 1
                this.playerScoreText.text = this.playerScore.toString();
                console.log('Player wins');
              }
              else
              {
                this.opponentScore += 1
                this.opponentScoreText.text = this.opponentScore.toString();
                console.log('AI wins');
              }          
            },


        },
        {
            at: 1000,

            run: () => {
              winMessage.destroy()
              this.resetBoard()
            }
        }
      ]);

      timeline.play();
    }

    resetBoard()
    {
      for(let i = 0; i<3; i++)
      {
        for (let j =0; j<3; j++)
        {
          this.board[i][j] = "";
        }
      }

      this.boardPieces.forEach(element => {
        element.destroy();
      });

    }

    PlaySceneAction(actionKey)
    {
        switch(actionKey)
        {
          case "johnEntry":
            this.JohnEntry();
            break;
          case "davidEntry":
            this.DavidEntry();
            break;
          case "johnReturn":
            this.JohnReturn();
            break;
          case "michaelEntry":
            this.MichaelEntry();
            break;
          case "endOfScene":
            this.EndOfScene()
            break;
        }
    }

    JohnEntry()
    {
      let { width, height } = this.sys.game.canvas;

      const timeline = this.add.timeline([
        {
          at: 0,

          tween: {
            targets: this.ui_opponent,
            x: width- 150,
            tween: 'Cubic.InOut',
            duration: 1000,
            ease: 'Linear',
          }


        },

      ]);

      timeline.play();
    }

    DavidEntry()
    {
      let { width, height } = this.sys.game.canvas;

      const timeline = this.add.timeline([
        {
          at: 0,

          tween: {
            targets: this.ui_opponent,
            x: width+ 150,
            tween: 'Cubic.InOut',
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            repeat: 0
          }


        },
        {
          at: 1000,

          run: () => {
            this.ui_opponent.setTexture('ui_david');
          }


        },

      ]);

      timeline.play();
    }

    MichaelEntry()
    {
      let { width, height } = this.sys.game.canvas;

      const timeline = this.add.timeline([
        {
          at: 0,

          tween: {
            targets: this.ui_opponent,
            x: width+ 150,
            tween: 'Cubic.InOut',
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            repeat: 0
          }


        },
        {
          at: 1000,

          run: () => {
            this.ui_opponent.setTexture('ui_michael');
          }


        },

      ]);

      timeline.play();
    }

    JohnReturn()
    {
      let { width, height } = this.sys.game.canvas;

      const timeline = this.add.timeline([
        {
          at: 0,

          tween: {
            targets: this.ui_opponent,
            x: width+ 150,
            tween: 'Cubic.InOut',
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            repeat: 0
          }


        },
        {
          at: 1000,

          run: () => {
            this.ui_opponent.setTexture('ui_john');
          }


        },

      ]);

      timeline.play();
    }


    EndOfScene()
    {
        const timeline = this.add.timeline([
            {
                at: 4000,

                run: () => {
                  this.scene.launch('TransitionScene')
                  this.scene.get('TransitionScene').nextScene = 'ResultsScene'
          
                    this.scene.get('NarrationManager').scene.stop();
                    //this.scene.start('ResultsScene');
                    this.scene.stop();
                }
            }
        ]);

        timeline.play();

    }
}