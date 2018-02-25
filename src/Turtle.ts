
import {vec3, vec4, mat4} from 'gl-matrix';
//Fractal Plant rules referenced from: https://en.wikipedia.org/wiki/L-system
//(X → F[−X][X]F[−X]+FX), (F → FF)
class Stack{
    items: Turtle[];
    constructor(){
        this.items = [];
    }

    push(t: Turtle){
        this.items.push(t);
    }
    pop(): Turtle{
        return this.items.pop();
    }
    peek(): Turtle{
        return this.items[this.items.length - 1];
    }
    isEmpty(): boolean{
        return this.items.length === 0;
    }
    // printStack()
}
class Turtle {
  controls: any;
  baseIndices: Uint16Array;
  basePositions: Float32Array;
  baseNormals: Float32Array;
  positions: Array<number>;
  normals: Array<number>;
  indices: Array<number>;
  scale: mat4;
  iter: number;
  size:number;
  index:number;

  turtleStack: Stack;
  
  constructor(pos: Float32Array, normals:Float32Array, indices: Uint16Array) {
    this.basePositions = new Float32Array(pos);
    this.baseNormals = new Float32Array(normals);
    this.baseIndices = new Uint16Array(indices);

    this.positions = new Array<number>();
    this.normals = new Array<number>();
    this.indices = new Array<number>();
    this.iter = 1;
    this.size = this.basePositions.length;
    this.index = this.baseIndices.length;
    console.log('size is ' + this.size);
    
    
    
    //append base to positions array
    var position =  Array.prototype.slice.call(this.basePositions);
    this.positions = this.positions.concat(position);
    //norms
    var nor =  Array.prototype.slice.call(this.baseNormals);
    this.normals = this.normals.concat(nor);
    //indices
    var ind =  Array.prototype.slice.call(this.baseIndices);
    this.indices =  this.indices.concat(ind);

    console.log('positions buffer is ' + this.positions.length);
    console.log('indices buffer is ' + this.indices.length);
  }

  rotate(rot:mat4){
    //mat4.multiply(this.rotation, this.rotation,rot);
  }

  move(dir:vec3){
    var translation = vec3.create();
    vec3.set (translation, dir[0],dir[1], dir[2]);
    console.log(translation);
    var m = mat4.create();
    mat4.translate (m, m, translation);
    console.log(m);
    //var m = mat4.fromTranslation(m, vec3.fromValues(0,1,0));
    // for(var i = 0; i < this.instructions.length; i++){
    //   this.fnMap[this.instructions.charAt(i).toString()];
    // }
    for(var i = 0;i < this.size;i = i + 3){
      //positions
      var pos = vec4.fromValues(this.basePositions[i], this.basePositions[i+1], this.basePositions[i+2], 1.0);
      pos = vec4.transformMat4(pos,pos,m);
      this.basePositions[i] = pos[0];
      console.log(this.basePositions[i]);
      this.basePositions[i+1] = pos[1];
      this.basePositions[i+2] = pos[2];
      this.positions = this.positions.concat(pos[0], pos[1], pos[2]);

      // //normals
      var nor = vec4.fromValues(this.baseNormals[i], this.baseNormals[i+1], this.baseNormals[i+2], 0.0);
      nor = vec4.transformMat4(nor, nor,m);
      this.baseNormals[i] = nor[0];
      this.baseNormals[i+1] = nor[1];
      this.baseNormals[i+2] = nor[2];
      this.normals = this.normals.concat(nor[0], nor[1], nor[2]);
      // this.normals.push(nor[0]);
      // this.normals.push(nor[1]);
      // this.normals.push(nor[2]);
    }

    for(var j = 0;j < this.index;j = j + 3){
      // //indices
      console.log('index' + this.baseIndices[j]);
      this.baseIndices[j] = this.baseIndices[j] + (this.iter * this.index);
      console.log('index' + this.baseIndices[j]);
      this.baseIndices[j+1] = this.baseIndices[j+1]  + (this.iter * this.index);
      this.baseIndices[j+2] = this.baseIndices[j+2] + (this.iter * this.index);
      this.indices = this.indices.concat(this.baseIndices[j], this.baseIndices[j+1], this.baseIndices[j+2]);
      // this.indices.push(this.baseIndices[i]);
      // this.indices.push(this.baseIndices[i+1]);
      // this.indices.push(this.baseIndices[i+2]);

    }
    console.log('positions buffer is ' + this.positions.length);
    console.log('normals buffer is ' + this.normals.length);
    console.log('indices buffer is ' + this.indices.length);
    this.iter++;

  }

  push(){
    this.turtleStack.push(this);
  }

  pop(){
    var p = this.turtleStack.pop();
    this.positions = p.positions;
    this.normals = p.normals;
  }

  draw(){
    // for(var i = 0; i < this.instructions.length; i++){
    //   this.fnMap[this.instructions.charAt(i).toString()];
    // }
  }

  update() {
    this.controls.tick();
  }


};

export default Turtle;