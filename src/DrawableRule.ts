import * as CameraControls from '3d-view-controls';
import {vec3, mat4} from 'gl-matrix';
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
  baseIndices: Uint16Array;
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
    
    this.basePositions = new Float32Array(mesh.positions);
    //console.log(mesh.currPositions[0]);
    this.baseNormals = new Float32Array(mesh.normals);
    this.baseIndices = new Uint16Array(mesh.indices);
    //console.log(this.baseIndices.toString());
    this.turtle = new Turtle(this.basePositions, this.baseNormals, this.baseIndices);
  }

  X(){
    var r = 2;
    
  }
  F(){
    console.log('f is called lol');
    this.turtle.move(vec3.fromValues(1,1,0));
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
    // for(var i = 0; i < this.instructions.length; i++){
    //   this.fnMap[this.instructions.charAt(i).toString()];
    // }
    this.F();
    //this.F();
  }


  update() {
    this.controls.tick();
  }


};

export default DrawableRule;