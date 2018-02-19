
import {vec3, mat4} from 'gl-matrix';
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
  position: vec3;
  rotation: mat4;
  scale: mat4;

  turtleStack: Stack;
  
  constructor(position: vec3, rotation:mat4) {
    this.position = position;
    this.rotation = rotation;
  }

  rotate(rot:mat4){
    mat4.multiply(this.rotation, this.rotation,rot);
  }

  move(dir:vec3){
    vec3.add(this.position, dir, this.position);
  }

  push(){
    this.turtleStack.push(this);
  }

  pop(){
    var p = this.turtleStack.pop();
    this.position = p.position;
    this.rotation = p.rotation;
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