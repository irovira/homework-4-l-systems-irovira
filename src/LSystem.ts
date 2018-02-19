import * as CameraControls from '3d-view-controls';
import {vec3, mat4} from 'gl-matrix';
import DrawableRule from './DrawableRule';
import Turtle from './Turtle';





//dictionary referenced from KeyCollection Interface at
//https://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript

// export interface IKeyedCollection<T> {
//     Add(key: string, value: T);
//     ContainsKey(key: string): boolean;
//     Count(): number;
//     Item(key: string): T;
//     Keys(): string[];
//     Remove(key: string): T;
//     Values(): T[];
// }

export class Dictionary {
    private items: { [index: string]: string } = {};
 
    private count: number = 0;

    public Add(key: string, value: string) {
        if(!this.items.hasOwnProperty(key))
             this.count++;
 
        this.items[key] = value;
    }
 
    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }
 
    public Count(): number {
        return this.count;
    }
 
    
 
    public Remove(key: string): string {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }
 
    public Item(key: string): string {
        return this.items[key];
    }
 
    public Keys(): string[] {
        var keySet: string[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
 
        return keySet;
    }
 
    public Values(): string[] {
        var values: string[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
 
        return values;
    }
}

//Fractal Plant rules referenced from: https://en.wikipedia.org/wiki/L-system
//(X → F[−X][X]F[−X]+FX), (F → FF)
var rulebook = new Dictionary();
rulebook.Add('X','F[−X][X]F[−X]+FX');
rulebook.Add('F', 'FF');



class LSystem {
  controls: any;
  currentRule: string;
  constructor(seed: string) {
      this.currentRule = seed;
  }
  
  

expandRule(seed:string): string {
    var curr  = "";
    for (var i = 0; i < seed.length; i++) {
        if(rulebook.ContainsKey(seed.charAt(i).toString())){
            //console.log("Contains Key + " + seed.charAt(i).toString());
            curr = curr + rulebook.Item(seed.charAt(i).toString());
        }
    }
    
    return curr;
}

 expand(iter: number): string{
    for(var i = 0; i < iter; i++){
        this.currentRule = this.expandRule(this.currentRule);
    }
    return this.currentRule;
 }

 draw(){
    var dR = new DrawableRule(this.currentRule);
    dR.draw();
 }
 

  update() {
    this.controls.tick();
  }
};

export default LSystem;