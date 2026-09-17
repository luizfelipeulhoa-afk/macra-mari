import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { loadGlbSmart, normalize } from "./loadModel";
import { MODELS } from "../data/atelier";
import { prefersReducedMotion } from "../lib/motion";
import { sample, sampleCamera } from "../lib/choreo";

interface IntroCanvasProps {
  progressRef: MutableRefObject<number>;
  onReady?: () => void;
  onFail?: () => void;
}

function release(object: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  object.traverse(o => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      materials.add(mat);
      for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  textures.forEach(t => t.dispose());
  materials.forEach(m => m.dispose());
}

export default function IntroCanvas({ progressRef, onReady, onFail }: IntroCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({onReady, onFail});
  callbacks.current = {onReady, onFail};
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = prefersReducedMotion();
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:"high-performance"}); }
    catch { callbacks.current.onFail?.(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.75 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .88;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.append(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .05, 50);
    const holder = new THREE.Group();
    scene.add(holder);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const studio = new RoomEnvironment();
    const environment = pmrem.fromScene(studio, .04).texture;
    scene.environment = environment;
    pmrem.dispose();
    studio.dispose();
    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2c1e13, .82));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.35);
    key.position.set(-2.8, 4.2, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(innerWidth < 700 ? 1024 : 2048, innerWidth < 700 ? 1024 : 2048);
    Object.assign(key.shadow.camera, {left:-1.25, right:1.25, top:1.25, bottom:-1.25, near:.1, far:9});
    key.shadow.bias = -.00015;
    key.shadow.normalBias = .012;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffb66f, 1.3);
    rim.position.set(3.2, 1.8, -3); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xfff6e8, .48);
    fill.position.set(1.4, -.4, 4); scene.add(fill);
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.ShadowMaterial({color:0x080401, opacity:.17, transparent:true}),
    );
    wall.position.z = -.34;
    wall.receiveShadow = true;
    scene.add(wall);
    let disposed=false, loaded=false, visible=true, raf=0, dirty=true;
    let shownProgress = reduced ? 0 : progressRef.current;
    let previousTime = performance.now();
    let pointerX=0, pointerY=0, lookX=0, lookY=0;
    const target = new THREE.Vector3();
    const draw = (time = performance.now()) => {
      raf=0;
      if (disposed || !visible || document.hidden || !loaded) return;
      const delta = Math.min(Math.max((time - previousTime) / 1000, 0), .05);
      previousTime = time;
      const requestedProgress = reduced ? 0 : progressRef.current;
      shownProgress = reduced
        ? 0
        : THREE.MathUtils.damp(shownProgress, requestedProgress, 14, delta);
      lookX = THREE.MathUtils.damp(lookX, pointerX, 9, delta);
      lookY = THREE.MathUtils.damp(lookY, pointerY, 9, delta);
      const moving = Math.abs(requestedProgress-shownProgress)>.00004;
      const looking = Math.abs(pointerX-lookX)+Math.abs(pointerY-lookY)>.0001;
      if (dirty || moving || looking) {
        const p = shownProgress;
        const pose=sample(p), shot=sampleCamera(p), mobile=mount.clientWidth<700;
        holder.rotation.set(
          pose.y*.3 + Math.sin(p*Math.PI)*.012,
          THREE.MathUtils.degToRad(pose.deg),
          Math.sin(p*Math.PI*2)*.006,
        );
        holder.position.set(0, pose.y*.1, 0);
        // Camera framing leaves room for each chapter; the object's rotation stays exactly 360°.
        const cinematicDolly = mobile ? Math.min(shot.dolly, 1.2) : shot.dolly;
        const cinematicFov = mobile ? Math.max(29, shot.fov) : shot.fov;
        const fit = mobile ? Math.max(2.25, 1.02/(2*Math.tan(THREE.MathUtils.degToRad(cinematicFov/2))*camera.aspect)) : 2.35;
        camera.fov = cinematicFov;
        camera.updateProjectionMatrix();
        camera.position.set((mobile?0:shot.offset*.42)+lookX*.045, (mobile?.12:shot.focus*.22)+lookY*.035, fit/cinematicDolly);
        target.set(mobile?0:shot.offset, mobile?.07:shot.focus, 0);
        camera.lookAt(target);
        camera.rotation.z += THREE.MathUtils.degToRad(mobile ? shot.roll*.35 : shot.roll);
        key.position.x = -2.8 + Math.sin(p*Math.PI*2)*.7;
        rim.position.x = 3.2 - Math.sin(p*Math.PI*2)*.55;
        rim.intensity=.9+Math.sin(p*Math.PI)*.35;
        renderer.render(scene,camera);
        mount.dataset.angle=pose.deg.toFixed(2);
        mount.dataset.progress=p.toFixed(4);
        dirty=false;
      }
      if (!reduced) raf=requestAnimationFrame(draw);
    };
    const wake=()=>{dirty=true;if(!raf)raf=requestAnimationFrame(draw);};
    const resize=()=>{const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();wake();};
    const ro=new ResizeObserver(resize);ro.observe(mount);resize();
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}});io.observe(mount);
    const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();};
    const onPointer=(e:PointerEvent)=>{if(reduced||e.pointerType!=="mouse")return;pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5;};
    const onLost=(e:Event)=>{e.preventDefault();loaded=false;mount.style.opacity="0";callbacks.current.onFail?.();};
    document.addEventListener("visibilitychange",onVisibility);
    window.addEventListener("pointermove",onPointer,{passive:true});
    renderer.domElement.addEventListener("webglcontextlost",onLost);
    loadGlbSmart(MODELS.wallLocal,MODELS.wallDrive).then(model=>{
      if(disposed){release(model);return;}
      model.traverse(o=>{const mesh=o as THREE.Mesh;if(!mesh.isMesh)return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
          const m=material as THREE.MeshStandardMaterial;
          m.metalness=0;
          m.roughness=Math.min(.92, Math.max(.82, m.roughness ?? .86));
          m.envMapIntensity=.24;
          if(m.normalScale)m.normalScale.set(.68,.68);
          for(const value of Object.values(m)) {
            if(value instanceof THREE.Texture) {
              value.anisotropy=Math.min(12,renderer.capabilities.getMaxAnisotropy());
              value.needsUpdate=true;
            }
          }
          m.needsUpdate=true;
        }
      });
      holder.add(normalize(model,1));loaded=true;
      // Publish readiness only after the first frame is painted.
      cancelAnimationFrame(raf);draw();callbacks.current.onReady?.();
    }).catch(()=>{if(!disposed)callbacks.current.onFail?.();});
    return()=>{disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener("visibilitychange",onVisibility);window.removeEventListener("pointermove",onPointer);renderer.domElement.removeEventListener("webglcontextlost",onLost);environment.dispose();release(scene);renderer.dispose();renderer.domElement.remove();};
  },[progressRef]);
  return <div ref={mountRef} className="absolute inset-0" data-macrame-canvas aria-hidden="true"/>;
}
