import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
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
    try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:"low-power"}); }
    catch { callbacks.current.onFail?.(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.03;
    mount.append(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .05, 50);
    const holder = new THREE.Group();
    scene.add(holder);
    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2c1e13, 1.5));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.5);
    key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc489, 1.8);
    rim.position.set(3, 2, -4); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xfff6e8, .65);
    fill.position.set(1, 0, 5); scene.add(fill);
    let disposed=false, loaded=false, visible=true, raf=0, last=-1, dirty=true;
    let pointerX=0, pointerY=0, lookX=0, lookY=0;
    const target = new THREE.Vector3();
    const draw = () => {
      raf=0;
      if (disposed || !visible || document.hidden || !loaded) return;
      const p = reduced ? 0 : progressRef.current;
      lookX += (pointerX-lookX)*.065;
      lookY += (pointerY-lookY)*.065;
      if (dirty || p!==last || Math.abs(pointerX-lookX)+Math.abs(pointerY-lookY)>.0001) {
        const pose=sample(p), shot=sampleCamera(p), mobile=mount.clientWidth<700;
        holder.rotation.set(pose.y*.3, THREE.MathUtils.degToRad(pose.deg), 0);
        holder.position.set(0, pose.y*.1, 0);
        // Camera framing leaves room for each chapter; the object's rotation stays exactly 360°.
        const fit = mobile ? Math.max(2.25, 1.02/(2*Math.tan(THREE.MathUtils.degToRad(16))*camera.aspect)) : 2.35;
        camera.position.set(lookX*.045, (mobile?.12:0)+lookY*.035, fit/shot.dolly);
        target.set(mobile?0:shot.offset, mobile?.07:shot.focus, 0);
        camera.lookAt(target);
        rim.intensity=1.5+Math.sin(p*Math.PI)*.7;
        renderer.render(scene,camera);
        mount.dataset.angle=pose.deg.toFixed(2);
        mount.dataset.progress=p.toFixed(4);
        last=p;dirty=false;
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
        for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
          const m=material as THREE.MeshStandardMaterial;m.metalness=0;m.roughness=.92;
          if(m.map)m.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
        }
      });
      holder.add(normalize(model,1));loaded=true;
      // Publish readiness only after the first frame is painted.
      cancelAnimationFrame(raf);draw();callbacks.current.onReady?.();
    }).catch(()=>{if(!disposed)callbacks.current.onFail?.();});
    return()=>{disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener("visibilitychange",onVisibility);window.removeEventListener("pointermove",onPointer);renderer.domElement.removeEventListener("webglcontextlost",onLost);release(scene);renderer.dispose();renderer.domElement.remove();};
  },[progressRef]);
  return <div ref={mountRef} className="absolute inset-0" data-macrame-canvas aria-hidden="true"/>;
}
