import { GameData } from '../GameData';
import { Target } from '../shootingScene/Target';


export class ShootingScene extends Phaser.Scene {

	constructor() {
		super("ShootingScene");

    this.targets = [];
    }

    preload() {

    }

    create(){
      this.keyDown = false;

      console.log('Test registry ' + GameData.testBool);
      GameData.testBool = true;
      console.log('Test registry 2' + GameData.testBool);
    }

    update(time: number, delta: number): void {

      if(this.input.keyboard.addKey('A').isDown && !this.keyDown) {
        this.keyDown = true;
        this.CreateTarget();
      }

      if(this.input.keyboard.addKey('A').isUp) {
        this.keyDown = false;
      }

    }

    CreateTarget(){
      var newTarget = new Target(this, 100, 100);
      this.targets.push(newTarget);
    }

    



}