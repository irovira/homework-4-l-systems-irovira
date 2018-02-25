import * as CameraControls from '3d-view-controls';
import {vec3, mat4, quat} from 'gl-matrix';
import Turtle from './Turtle';
import MeshDrawable from './geometry/MeshDrawable';


//Fractal Plant rules referenced from: https://en.wikipedia.org/wiki/L-system
//(X → F[−X][X]F[−X]+FX), (F → FF)
//var fnMap = newLocal
const degree = Math.PI / 180;
class DrawableRule {
  controls: any;
  instructions: string;
  fnMap: any;
  baseIndices: Uint32Array;
  basePositions: Float32Array;
  baseNormals: Float32Array;
  turtle: Turtle;
  mesh:MeshDrawable
  constructor(instructions: string, mesh:MeshDrawable) {
    this.fnMap = {};
    this.instructions = instructions;
    //this.fnMap["X"] = this.X();
    this.fnMap["F"] = this.F;
    this.fnMap["["] = this.push;
    this.fnMap["]"] = this.pop;
    this.fnMap["-"] = this.rotateLeft; //rotate left 25 degrees
    this.fnMap["+"] = this.rotateRight; //rotate right 25 degrees
    this.mesh = mesh;
    
    this.basePositions = new Float32Array(mesh.currPositions);
    this.baseNormals = new Float32Array(mesh.currNormals);
    this.baseIndices = new Uint32Array(mesh.currIndices);
    //console.log(this.baseIndices.toString());
    this.turtle = new Turtle(mesh.currPositions, mesh.currNormals, mesh.currIndices);
  }

  X(){
    var r = 2;
    this.turtle.move(vec3.fromValues(1.5,0,0));
    
  }
  F(){
    console.log('f is called lol');
    this.turtle.move(vec3.fromValues(0,2,0));
    
  }
  push(){
    this.turtle.push();
  }
  pop(){
    this.turtle.pop();
  }
  rotateLeft(){
    console.log('rotate left called');
    var rot = quat.create();
    quat.rotateZ(rot,rot,25*degree);
    this.turtle.rotate(rot);
    //this.turtle.rotate(rot);
  }
  rotateRight(){
    console.log('rotate right called');
    var rot = quat.create();
    quat.rotateZ(rot,rot,-25*degree);
    this.turtle.rotate(rot);
  }

  getPos() : Array<number>{
    return this.turtle.positions;
  }

  getNor() : Array<number>{
    return this.turtle.normals;
  }

  getInd() : Array<number>{
    return this.turtle.indices;
  }

  

  draw(){
    //this.X();
    console.log(this.instructions);
    for(var i = 0; i < this.instructions.length; i++){
      var rule = this.instructions.charAt(i).toString();
      if( rule == 'F'){
        this.F();
      } else if ( rule == 'X'){
        this.X();
      } else if ( rule == '+'){
        this.rotateRight();
      } else if (rule == '-'){
        this.rotateLeft();
      } else if (rule == '['){
        this.push();
      } else if (rule == ']'){
        this.pop();
      }
      this.mesh.appendInd(this.getInd());
      this.mesh.appendPos(this.getPos());
      this.mesh.appendNor(this.getNor());

    }
    // this.F();
    // this.mesh.appendInd(this.getInd());
    // this.mesh.appendPos(this.getPos());
    // this.mesh.appendNor(this.getNor());
    // this.X();
    // this.mesh.appendInd(this.getInd());
    // this.mesh.appendPos(this.getPos());
    // this.mesh.appendNor(this.getNor());
    //this.F();
  }


  update() {
    this.controls.tick();
  }


};

export default DrawableRule;