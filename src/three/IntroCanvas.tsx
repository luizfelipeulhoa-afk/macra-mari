import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadGlb, normalize } from "./loadModel";
import { MODELS } from "../data/atelier";
import { prefersReducedMotion } from "../lib/motion";

interface IntroCanvasProps {
  sectionRef: RefObject<HTMLElement>;
  windowRef: RefObject<HTMLDivElement>;
  len: number;
  onReady?: () => void;
  onFail?: () => void;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ————————————————————————————————————————————————
   Camada 3D da transição de entrada: renderiza o GLB
   real do Drive sobre a foto de fundo. Quando o modelo
   chega, ele assume a coreografia — gigante no fundo,
   conduzido pelo scroll até caber na janela da moldura.
   ———————————————————————————————————————————————— */
export default function IntroCanvas({
  sectionRef,
  windowRef,
  len,
  onReady,
  onFail,
}: IntroCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const section = sectionRef.current;
    if (!mount || !section) return;
    const reduced = prefersReducedMotion();

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
      camera.position.set(0, 0, 8);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      /* sem WebGL: a foto de fundo já garante o intro */
      onFail?.();
      return;
    }

    const FOV = 36;
    const CAM_Z = 8;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2c1e13, 1.45));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.9);
    key.position.set(3.5, 4.5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc489, 1.2);
    rim.position.set(-3, 1.5, -4);
    scene.add(rim);

    const holder = new THREE.Group();
    scene.add(holder);

    const m = {
      startScale: 6,
      endScale: 2,
      endY: 0,
      worldPerPx: 0.01,
    };

    let modelOn = false;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const vpWorldH = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z;
      const vpWorldW = vpWorldH * (w / h);
      m.worldPerPx = vpWorldH / h;
      /* cobre a tela inteira mesmo em monitores largos */
      m.startScale = Math.max(vpWorldH, vpWorldW) * 1.3;

      const win = windowRef.current;
      if (win) {
        const r = win.getBoundingClientRect();
        if (r.width > 10) {
          m.endScale = r.height * m.worldPerPx * 0.9;
          m.endY = (h / 2 - (r.top + r.height / 2)) * m.worldPerPx;
        }
      }
      if (reduced && modelOn) renderAt(1);
    };

    const renderAt = (prog: number) => {
      if (!modelOn) return;
      const e = smooth(0.28, 0.78, prog);
      const s = m.startScale + (m.endScale - m.startScale) * e;
      holder.scale.setScalar(Math.max(s, 0.001));
      holder.position.y = m.endY * e;
      holder.rotation.y = (1 - e) * 0.4 + Math.sin(prog * Math.PI) * 0.1;
      holder.rotation.x = (1 - e) * 0.05;
      renderer.render(scene, camera);
    };

    /* o modelo real, exatamente como saiu do arquivo */
    loadGlb(MODELS.wallV2)
      .then((model) => {
        holder.add(normalize(model, 1));
        modelOn = true;
        resize();
        if (reduced) renderAt(1);
        onReady?.();
      })
      .catch(() => onFail?.());

    /* progresso do scroll na seção pinada */
    let target = reduced ? 1 : 0;
    let p = target;
    const st = reduced
      ? null
      : ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${len}`,
          onUpdate: (self) => {
            target = self.progress;
          },
        });

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = false;
    let visible = true;
    const clock = new THREE.Clock();

    const tick = () => {
      const t = clock.getElapsedTime();
      p += (target - p) * 0.09;
      renderAt(p);
      if (modelOn) holder.rotation.y += Math.sin(t * 0.5) * 0.0015;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const dispose = () => {
      stop();
      st?.kill();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount)
        mount.removeChild(renderer.domElement);
    };

    if (reduced) {
      return dispose;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(mount);
    const onVis = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      dispose();
    };
  }, [sectionRef, windowRef, len, onReady, onFail]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
