import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sample,sampleCamera} from '../src/lib/choreo.ts';
import {normalize} from '../src/three/loadModel.ts';
import * as T from 'three';
let previous=-1;
let previousShot=sampleCamera(0);
for(let i=0;i<=1000;i++){
 const p=i/1000,pose=sample(p),shot=sampleCamera(p);
 assert(pose.deg>=previous,'The revolution must not reverse');
 assert(Object.values(shot).every(Number.isFinite));
 assert(Math.abs(shot.dolly-previousShot.dolly)<.02,'Camera dolly must stay continuous');
 assert(Math.abs(shot.offset-previousShot.offset)<.02,'Camera lateral move must stay continuous');
 previous=pose.deg;previousShot=shot;
}
assert.equal(sample(0).deg,0);assert.equal(sample(.9).deg,360);assert.equal(sample(1).deg,360);
assert(sampleCamera(.29).dolly>1.35,'First detail shot must visibly zoom in');
assert(sampleCamera(.65).dolly>1.4,'Second detail shot must visibly zoom in');
const turnStep=sample(.1).deg-sample(0).deg;
for(let i=1;i<9;i++){
 const delta=sample((i+1)/10).deg-sample(i/10).deg;
 assert(Math.abs(delta-turnStep)<1e-9,'The 3D revolution must keep a constant speed');
}
const mesh=new T.Mesh(new T.BoxGeometry(2,4,.3));mesh.position.set(3,5,1);
const normalized=normalize(mesh,1);normalized.updateMatrixWorld(true);
const box=new T.Box3().setFromObject(normalized);
assert(box.getCenter(new T.Vector3()).length()<1e-6,'Rotation pivot must be the actual center');
assert(Math.abs(box.getSize(new T.Vector3()).y-1)<1e-6);
const glb=readFileSync(new URL('../public/models/wall-hanging.glb',import.meta.url));
assert.equal(glb.readUInt32LE(0),0x46546c67);assert.equal(glb.readUInt32LE(8),glb.length);
console.log('PASS: continuous 360 degree revolution, cinematic camera path, centered normalization, local GLB.');
