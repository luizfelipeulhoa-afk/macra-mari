import { useEffect, useRef, type MutableRefObject } from "react";
import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { cordAssembly, smooth } from "../lib/cordConstruction";

const SEGMENTS = 260;
const SIDES = 12;
const points = [
  [0.08, 0.58, -0.06], [0.08, 1.03, -0.02], [-0.12, 1.12, 0], [-0.32, 0.94, 0.025],
  [-0.4, 0.7, 0.035], [-0.32, 0.43, 0.065], [-0.02, 0.31, 0.075],
  [0.29, 0.38, 0.08], [0.31, 0.55, 0.06], [0.13, 0.65, 0],
  [-0.07, 0.51, -0.085], [-0.06, 0.15, -0.075], [0.22, -0.03, 0.07],
  [0.36, 0.12, 0.085], [0.24, 0.27, 0.06], [-0.02, 0.18, 0],
  [-0.3, -0.05, -0.08], [-0.27, -0.25, -0.06], [-0.02, -0.34, 0.065],
  [0.21, -0.23, 0.085], [0.2, -0.08, 0.06], [-0.07, -0.15, -0.05],
  [-0.18, -0.43, -0.065], [0.03, -0.59, 0],
];

class Strand extends T.Curve<T.Vector3> {
  constructor(private center: T.CatmullRomCurve3, private index: number, private loose: boolean) { super(); }
  getPoint(t: number, target = new T.Vector3()) {
    if (this.loose) {
      return target.set((this.index - 2.5) * 0.09 + Math.sin(t * 5 + this.index) * 0.045,
        1.2 - t * 2.4, Math.sin(t * 4 + this.index * 0.2) * 0.035);
    }
    if (t > 0.84) {
      const tail = (t - 0.84) / 0.16;
      return target.set(0.03 + (this.index - 2.5) * (0.024 + tail * 0.065),
        -0.59 - tail * (0.44 + this.index * 0.035), Math.sin(tail * 3 + this.index) * 0.025);
    }
    const u = t / 0.84;
    this.center.getPoint(u, target);
    const tangent = this.center.getTangent(u);
    const offset = (this.index - 2.5) * 0.026;
    target.x += -tangent.y * offset;
    target.y += tangent.x * offset;
    return target;
  }
}

function fiberTexture() {
  const width = 512, height = 128;
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const ply = Math.sin((x / width * 70 + y / height * 3) * Math.PI * 2);
    const fiber = Math.sin((x / width * 210 + y / height * 19) * Math.PI * 2);
    const value = Math.round(146 + ply * 48 + fiber * 15);
    const i = (y * width + x) * 4;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
    pixels[i + 3] = 255;
  }
  const texture = new T.DataTexture(pixels, width, height);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export default function CordConstructionCanvas({ progressRef, reduced, onReady, onFail }: {
  progressRef: MutableRefObject<number>; reduced: boolean; onReady: () => void; onFail: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onFail });
  callbacks.current = { onReady, onFail };
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: T.WebGLRenderer;
    try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch { callbacks.current.onFail(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    mount.append(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(31, 1, 0.05, 30);
    const holder = new T.Group();
    scene.add(holder);
    const environmentScene = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(environmentScene).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.35;
    environmentScene.dispose(); pmrem.dispose();
    scene.add(new T.HemisphereLight(0xfff8eb, 0xb1a086, 0.9));
    const light = new T.DirectionalLight(0xfff4df, 2.2);
    light.position.set(-3, 4, 5);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    Object.assign(light.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.1, far: 12 });
    light.shadow.normalBias = 0.008;
    scene.add(light);
    const fill = new T.DirectionalLight(0xffffff, 0.65); fill.position.set(3, 0, 3); scene.add(fill);
    const texture = fiberTexture();
    const cotton = new T.MeshStandardMaterial({ color: 0xc9b38e, roughness: 0.94,
      bumpMap: texture, bumpScale: 0.003, metalness: 0, envMapIntensity: 0.4 });
    const wood = new T.MeshStandardMaterial({ color: 0x9b7436, roughness: 0.65, metalness: 0 });
    const center = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)), false, "centripetal");
    const strands = Array.from({ length: 6 }, (_, index) => {
      const finalCurve = new Strand(center, index, false);
      const finalGeometry = new T.TubeGeometry(finalCurve, SEGMENTS, 0.011, SIDES, false);
      const geometry = new T.TubeGeometry(new Strand(center, index, true), SEGMENTS, 0.011, SIDES, false);
      const mesh = new T.Mesh(geometry, cotton);
      mesh.castShadow = true; mesh.receiveShadow = true; holder.add(mesh);
      const bead = new T.Mesh(new T.SphereGeometry(0.037, 20, 16), wood);
      bead.castShadow = true; holder.add(bead);
      const item = { geometry, loose: Float32Array.from(geometry.attributes.position.array),
        final: Float32Array.from(finalGeometry.attributes.position.array),
        looseNormals: Float32Array.from(geometry.attributes.normal.array),
        finalNormals: Float32Array.from(finalGeometry.attributes.normal.array), bead, finalCurve };
      finalGeometry.dispose();
      return item;
    });
    const tieGeometry = new T.TorusGeometry(0.081, 0.013, 8, 32);
    const ties = Array.from({ length: 6 }, (_, i) => {
      const mesh = new T.Mesh(tieGeometry, cotton);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(0.03, -0.55 - i * 0.018, 0);
      mesh.castShadow = true; holder.add(mesh); return mesh;
    });
    const wall = new T.Mesh(new T.PlaneGeometry(8, 8), new T.ShadowMaterial({ opacity: 0.09, color: 0x493727 }));
    wall.position.z = -0.24; wall.receiveShadow = true; scene.add(wall);
    let visible = true, disposed = false, raf = 0, shown = reduced ? 1 : progressRef.current;
    let previous = performance.now(), lastProgress = -1;
    function paint(now: number) {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.05); previous = now;
      const target = reduced ? 1 : progressRef.current;
      shown = reduced ? 1 : T.MathUtils.damp(shown, target, 15, dt);
      if (Math.abs(shown - lastProgress) > 0.00002) {
        const p = shown;
        strands.forEach((strand, index) => {
          const positions = strand.geometry.attributes.position;
          const normals = strand.geometry.attributes.normal;
          const entry = (1 - smooth((p + 0.08 - index * 0.008) / 0.25));
          for (let vertex = 0; vertex < positions.count; vertex++) {
            const along = Math.floor(vertex / (SIDES + 1)) / SEGMENTS;
            const blend = cordAssembly(p, along, index);
            const offset = vertex * 3;
            for (let axis = 0; axis < 3; axis++) {
              positions.array[offset + axis] = T.MathUtils.lerp(strand.loose[offset + axis], strand.final[offset + axis], blend);
              normals.array[offset + axis] = T.MathUtils.lerp(strand.looseNormals[offset + axis], strand.finalNormals[offset + axis], blend);
            }
            positions.array[offset] += (index % 2 ? 1 : -1) * entry * 0.75;
            positions.array[offset + 1] += entry * 0.55;
          }
          positions.needsUpdate = normals.needsUpdate = true;
          const beadScale = smooth((p - 0.76 - index * 0.012) / 0.12);
          strand.bead.position.copy(strand.finalCurve.getPoint(0.97 - index * 0.015));
          strand.bead.scale.setScalar(beadScale);
          strand.bead.visible = beadScale > 0;
        });
        ties.forEach(tie => { const scale = smooth((p - 0.73) / 0.15); tie.scale.setScalar(scale); tie.visible = scale > 0; });
        holder.rotation.y = Math.sin(p * Math.PI) * 0.18 - 0.07;
        const mobile = mount!.clientWidth < 700;
        const detail = smooth((p - 0.2) / 0.2) * (1 - smooth((p - 0.55) / 0.25));
        const fit = Math.max(mobile ? 5.25 : 4.75, 1.55 / camera.aspect);
        const distance = fit * (1 - detail * (mobile ? 0.12 : 0.28));
        camera.position.set(Math.sin(p * Math.PI * 2) * 0.13, 0.04, distance);
        camera.lookAt(0, -0.02 + detail * 0.3, 0);
        renderer.render(scene, camera);
        mount!.dataset.progress = p.toFixed(4);
        mount!.dataset.assembled = String(p > 0.92);
        lastProgress = shown;
      }
      if (!reduced) raf = requestAnimationFrame(paint);
    }
    const wake = () => { if (!raf) { previous = performance.now(); lastProgress = -1; raf = requestAnimationFrame(paint); } };
    const resize = () => { const w = mount.clientWidth, h = mount.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); wake(); };
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting;
      if (visible) wake(); else { cancelAnimationFrame(raf); raf = 0; } }); intersection.observe(mount);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else wake(); };
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(raf); callbacks.current.onFail(); };
    document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    callbacks.current.onReady();
    return () => {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect(); intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility); renderer.domElement.removeEventListener("webglcontextlost", lost);
      strands.forEach(s => { s.geometry.dispose(); s.bead.geometry.dispose(); });
      tieGeometry.dispose(); wall.geometry.dispose(); (wall.material as T.Material).dispose();
      cotton.dispose(); wood.dispose(); texture.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [progressRef, reduced]);
  return <div ref={mountRef} data-cord-construction className="absolute inset-0" aria-hidden="true" />;
}
