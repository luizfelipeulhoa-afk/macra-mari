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
const shots=Array.from({length:1001},(_,i)=>sampleCamera(i/1000));
assert(Math.max(...shots.map(s=>s.dolly))-Math.min(...shots.map(s=>s.dolly))>.7,'Wide and detail shots must have distinct magnifications');
assert(Math.min(...shots.map(s=>s.azimuth))<-15 && Math.max(...shots.map(s=>s.azimuth))>15,'Orbit must explore both sides');
let reversals=0,previousDirection=0;
for(let i=1;i<shots.length;i++){
 const direction=Math.sign(shots[i].azimuth-shots[i-1].azimuth);
 if(direction && previousDirection && direction!==previousDirection)reversals++;
 if(direction)previousDirection=direction;
}
assert(reversals>=4,'Camera must change orbit direction independently of the product revolution');
for(const p of [.085,.21,.345,.43,.565,.705,.805,.92]){
 const epsilon=.000001,b=sampleCamera(p),a=sampleCamera(p-epsilon),c=sampleCamera(p+epsilon);
 for(const field of ['dolly','offset','focus','fov','roll','azimuth','elevation']){
  const left=(b[field]-a[field])/epsilon,right=(c[field]-b[field])/epsilon;
  assert(Math.abs(left-right)<.08,`${field} velocity must remain continuous at ${p}`);
 }
}
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
