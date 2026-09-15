import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sample,sampleCamera} from '../src/lib/choreo.ts';
import {normalize} from '../src/three/loadModel.ts';
import * as T from 'three';
let previous=-1;
for(let i=0;i<=1000;i++){
 const p=i/1000,pose=sample(p),shot=sampleCamera(p);
 assert(pose.deg>=previous,'The revolution must not reverse');
 assert(Object.values(shot).every(Number.isFinite));previous=pose.deg;
}
assert.equal(sample(0).deg,0);assert.equal(sample(.9).deg,360);assert.equal(sample(1).deg,360);
const mesh=new T.Mesh(new T.BoxGeometry(2,4,.3));mesh.position.set(3,5,1);
const normalized=normalize(mesh,1);normalized.updateMatrixWorld(true);
const box=new T.Box3().setFromObject(normalized);
assert(box.getCenter(new T.Vector3()).length()<1e-6,'Rotation pivot must be the actual center');
assert(Math.abs(box.getSize(new T.Vector3()).y-1)<1e-6);
const glb=readFileSync(new URL('../public/models/wall-hanging.glb',import.meta.url));
assert.equal(glb.readUInt32LE(0),0x46546c67);assert.equal(glb.readUInt32LE(8),glb.length);
console.log('PASS: continuous 360 degree revolution, camera samples, centered normalization, local GLB.');
