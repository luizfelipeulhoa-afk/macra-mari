import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadZipModel, normalize } from "./loadModel";
import { buildWallHanging } from "./proceduralPieces";
import { MODELS } from "../data/atelier";
import { prefersReducedMotion } from "../lib/motion";

interface IntroCanvasProps {
  sectionRef: RefObject<HTMLElement>;
  windowRef: RefObject<HTMLDivElement>;
  len: number;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ————————————————————————————————————————————————
   Canvas da transição de entrada: o wall hanging
   começa gigante, como plano de fundo do app, e o
   scroll o conduz para dentro da moldura até virar
   a peça em exposição (tamanho da janela do quadro).
   ———————————————————————————————————————————————— */
export default function IntroCanvas({ sectionRef, windowRef, len }: IntroCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const section = sectionRef.current;
    if (!mount || !section) return;
    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();
    const FOV = 36;
    const CAM_Z = 8;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, 0, CAM_Z);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2c1e13, 1.35));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.7);
    key.position.set(3.5, 4.5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc489, 1.1);
    rim.position.set(-3, 1.5, -4);
    scene.add(rim);

    const holder = new THREE.Group();
    scene.add(holder);

    /* geometria de medidas (recalculada no resize) */
    const m = {
      startScale: 6,
      endScale: 2,
      endY: 0,
      worldPerPx: 0.01,
    };
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const vpWorldH = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z;
      m.worldPerPx = vpWorldH / h;
      m.startScale = vpWorldH * 1.32; /* fundo: ocupa 132% da tela */

      const win = windowRef.current;
      if (win) {
        const r = win.getBoundingClientRect();
        if (r.width > 10) {
          /* 88% da janela: margem p/ o balanço não vazar da moldura */
          m.endScale = r.height * m.worldPerPx * 0.88;
          m.endY = (h / 2 - (r.top + r.height / 2)) * m.worldPerPx;
        }
      }
      if (reduced) renderAt(1);
    };

    /* o modelo (Drive) com reserva procedural imediata */
    holder.add(normalize(buildWallHanging(), 1));
    const fallback = holder.children[0];
    loadZipModel(MODELS.wallZip)
      .then((model) => {
        holder.remove(fallback);
        holder.add(normalize(model, 1));
        resize();
        if (reduced) renderAt(1);
      })
      .catch(() => undefined);

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

    const renderAt = (prog: number) => {
      const e = smooth(0.28, 0.78, prog);
      const s = m.startScale + (m.endScale - m.startScale) * e;
      holder.scale.setScalar(Math.max(s, 0.001));
      holder.position.y = m.endY * e;
      /* começa angulada como cenário, termina de frente na moldura */
      holder.rotation.y = (1 - e) * 0.85 + Math.sin(prog * Math.PI) * 0.12;
      holder.rotation.x = (1 - e) * 0.06;
      renderer.render(scene, camera);
    };

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
      holder.rotation.y += Math.sin(t * 0.5) * 0.0015;
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

    if (reduced) {
      renderAt(1);
    } else {
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
        stop();
        st?.kill();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", resize);
        ro.disconnect();
        scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.geometry.dispose();
        });
        renderer.dispose();
        if (renderer.domElement.parentElement === mount)
          mount.removeChild(renderer.domElement);
      };
    }

    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [sectionRef, windowRef, len]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
