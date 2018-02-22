import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as fs from 'fs';
var OBJ = require('webgl-obj-loader');

class MeshDrawable extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.isMesh = true;
  }

  createMesh(name:string) {

    var objStr = document.getElementById(name).innerHTML;
    var opt = { encoding: 'utf8' };

    var mesh = new OBJ.Mesh(objStr);
    OBJ.initMeshBuffers(gl, mesh);
    console.log(mesh.normalBuffer.numItems);

    this.idxBound = true;
    this.bufIdx = mesh.indexBuffer;

    this.posBound = true;
    this.bufPos = mesh.vertexBuffer;

    this.norBound = true;
    this.bufNor = mesh.normalBuffer;


    this.count = mesh.indices.length;
    // console.log("Indices " + this.count);
    // console.log(mesh.indices);

    // console.log("VertexNormals " + mesh.vertexNormals.length);
    // console.log(mesh.vertexNormals);

    // console.log("Positions " + mesh.vertices.length);
    // console.log(mesh.vertices);
      

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    

    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);


    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);



    console.log(`Created mesh`);
  }

  create(){}
};

export default MeshDrawable;