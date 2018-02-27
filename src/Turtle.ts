
import {vec3, vec4, mat4,quat} from 'gl-matrix';
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
  baseIndices: Array<number>;
  basePositions: Array<number>;
  baseNormals: Array<number>;
  positions: Array<number>;
  normals: Array<number>;
  indices: Array<number>;
  scale: mat4;
  iter: number;
  size:number;
  index:number;
  

  pos:vec3;
  orientation:vec4;
  rot:quat;
  rotTransMat:mat4;

  posStack:Array<vec3>;
  rotStack:Array<quat>;
  orientationStack:Array<vec4>;
  matStack:Array<mat4>;


  turtleStack: Stack;
  
  constructor(pos: Array<number>, normals:Array<number>, indices: Array<number>) {
    this.basePositions = pos;
    this.baseNormals = normals;
    this.baseIndices = indices;
    this.turtleStack = new Stack();

    this.positions = new Array<number>();
    this.normals = new Array<number>();
    this.indices = new Array<number>();
    this.iter = 1;
    this.size = this.basePositions.length;
    this.index = this.baseIndices.length;

    this.pos = vec3.create();
    this.orientation = vec4.fromValues(0,1,0,0);
    this.rot = quat.create();
    this.rotTransMat = mat4.create();
    
    //this.rotTransMat = mat4.fromRotationTranslation(this.rotTransMat, this.rot,this.pos);

    this.posStack = new Array<vec3>();
    this.rotStack = new Array<quat>();
    this.orientationStack = new Array<vec4>();
    this.matStack = new Array<mat4>();
    

  }

  rotate(rot:quat){
    //mat4.multiply(this.rotation, this.rotation,rot);
    this.rot = quat.multiply(this.rot, this.rot, rot);
    var m = mat4.create();
    mat4.fromQuat(m,this.rot);
    this.orientation = vec4.transformMat4(this.orientation,this.orientation,m);
    this.rotTransMat = mat4.fromRotationTranslation(this.rotTransMat, this.rot,this.pos);
    //var m = mat4.create();
    //mat4.fromQuat(m,rot);
    //fromRotationTranslation(m, rot, translation) 
    //this.rotTransMat = mat4.multiply(this.rotTransMat, this.rotTransMat,m);
    this.draw();
  }

  move(dir:vec3){
    var weh = vec3.fromValues(this.orientation[0],this.orientation[1],this.orientation[2]);
    vec3.scale(weh,weh,3);
    // var translation = vec3.create();
    // vec3.multiply(translation, dir, weh);
    
    this.pos = vec3.add(this.pos, this.pos, weh);

    this.rotTransMat = mat4.fromRotationTranslation(this.rotTransMat, this.rot,this.pos);

    // var m = mat4.create();
    // mat4.translate (m, m, translation);
    
    // this.rotTransMat = mat4.multiply(this.rotTransMat, this.rotTransMat,m);

    this.draw();
  }

  push(){

    //var t = new Turtle(this.basePositions, this.baseNormals, this.baseIndices);
    var pRot = quat.create();
    quat.copy(pRot,this.rot);
    this.rotStack.push(pRot);

    var pPos = vec3.create();
    vec3.copy(pPos,this.pos);
    this.posStack.push(pPos);

    var pOr = vec4.create();
    pOr = vec4.copy(pOr, this.orientation);
    this.orientationStack.push(pOr);

    var mat = mat4.create();
    mat4.copy(mat, this.rotTransMat);
    this.matStack.push(mat);

  }

  pop(){

    this.rot = quat.copy(this.rot,this.rotStack.pop());
    this.pos = vec3.copy(this.pos,this.posStack.pop());
    this.orientation = vec4.copy(this.orientation, this.orientationStack.pop());
    this.rotTransMat = mat4.copy(this.rotTransMat,this.matStack.pop());
  }

  draw(){
    for(var i = 0;i < this.size;i = i + 4){
      //positions
      var pos = vec4.fromValues(this.basePositions[i], this.basePositions[i+1], this.basePositions[i+2], this.basePositions[i+3]);
      pos = vec4.transformMat4(pos,pos,this.rotTransMat);

      // this.basePositions[i] = pos[0];
      // this.basePositions[i+1] = pos[1];
      // this.basePositions[i+2] = pos[2];
      // this.basePositions[i+3] = pos[3];

      this.positions = this.positions.concat(pos[0], pos[1], pos[2],pos[3]);

      // //normals
      var nor = vec4.fromValues(this.baseNormals[i], this.baseNormals[i+1], this.baseNormals[i+2], this.baseNormals[i+3]);
      nor = vec4.transformMat4(nor, nor,this.rotTransMat);
      // this.baseNormals[i] = nor[0];
      // this.baseNormals[i+1] = nor[1];
      // this.baseNormals[i+2] = nor[2];
      // this.baseNormals[i+3] = nor[3];

      this.normals = this.normals.concat(nor[0], nor[1], nor[2],nor[3]);
    }

    var offset = Math.floor(this.positions.length / 4.0);
    for(var j = 0;j < this.index; j++){
      // //indices
      
      this.baseIndices[j] = this.baseIndices[j] + offset;
      this.indices.push(this.baseIndices[j]);
    }
  }

  update() {
    this.controls.tick();
  }


};

export default Turtle;