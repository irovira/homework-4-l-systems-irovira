import * as CameraControls from '3d-view-controls';
import {vec3, mat4} from 'gl-matrix';
import Turtle from './Turtle';


//Fractal Plant rules referenced from: https://en.wikipedia.org/wiki/L-system
//(X → F[−X][X]F[−X]+FX), (F → FF)
//var fnMap = newLocal
const degree = Math.PI / 180;
class DrawableRule {
  controls: any;
  instructions: string;
  fnMap: any;
  turtle: Turtle;
  constructor(instructions: string) {
    this.instructions = instructions;
    this.fnMap["X"] = this.X;
    this.fnMap["F"] = this.F;
    this.fnMap["["] = this.push;
    this.fnMap["]"] = this.pop;
    this.fnMap["-"] = this.rotateLeft; //rotate left 25 degrees
    this.fnMap["+"] = this.rotateRight; //rotate right 25 degrees
    this.turtle = new Turtle(vec3.fromValues(0,0,0), mat4.create());
  }

  X(){
    var r = 2;
  }
  F(){
    this.turtle.move(vec3.fromValues(0,1,0));
  }
  push(){
    this.turtle.push();
  }
  pop(){
    this.turtle.pop();
  }
  rotateLeft(){
    var rot = mat4.create();

    mat4.rotateY(rot, rot, 25 * degree);
    this.turtle.rotate(rot);
  }
  rotateRight(){
    var rot = mat4.create();
    mat4.rotateY(rot, rot, -25 * degree);
    this.turtle.rotate(rot);
  }

  

  draw(){
    for(var i = 0; i < this.instructions.length; i++){
      this.fnMap[this.instructions.charAt(i).toString()];
    }
  }


  update() {
    this.controls.tick();
  }


};

export default DrawableRule;