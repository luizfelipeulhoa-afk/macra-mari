import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadGlbSmart, normalize } from "./loadModel";
import { MODELS } from "../data/atelier";
import { prefersReducedMotion } from "../lib/motion";

interface IntroCanvasProps {
  sectionRef: RefObject<HTMLElement>;
  len: number;
  onReady?: () => void;
  onFail?: () => void;
}

/* ————————————————————————————————————————————————
   Camada 3D da abertura-showroom: o GLB real gira 360°
   conforme o scroll avança na seção pinada — a mesma
   coreografia do PNG 2D, só que em três dimensões.
   ———————————————————————————————————————————————— */
export default function IntroCanvas({
  sectionRef,
  len,
  onReady,
  onFail,
}: IntroCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const onReadyRef = useRef(onReady);
  const onFailRef = useRef(onFail);
  onReadyRef.current = onReady;
  onFailRef.current = onFail;

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
      onFailRef.current?.();
      return;
    }

    const FOV = 36;
    const CAM_Z = 8;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    /* luz quente de ateliê */
    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2c1e13, 1.5));
    const key = new THREE.DirectionalLight(0xffe3c0, 3);
    key.position.set(3.5, 4.5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc489, 1.6);
    rim.position.set(-3, 1.5, -4);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xfff6e8, 1.2);
    front.position.set(0, 1, 8);
    scene.add(front);

    const holder = new THREE.Group();
    scene.add(holder);

    let modelOn = false;
    let disposed = false;
    let baseScale = 3;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vpWorldH = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z;
      baseScale = vpWorldH * 0.66;
      if (reduced && modelOn) renderAt(0);
    };

    const renderAt = (prog: number) => {
      if (!modelOn) return;
      holder.scale.setScalar(baseScale);
      holder.rotation.y = prog * Math.PI * 2;
      renderer.render(scene, camera);
    };

    /* o modelo real, exatamente como saiu do arquivo */
    loadGlbSmart(MODELS.wallLocal, MODELS.wallDrive)
      .then((model) => {
        if (disposed) return;
        holder.add(normalize(model, 1));
        modelOn = true;
        resize();
        if (reduced) renderAt(0);
        onReadyRef.current?.();
      })
      .catch(() => {
        if (!disposed) onFailRef.current?.();
      });

    /* progresso do scroll → giro */
    let target = reduced ? 0 : 0;
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

    /* inclinação sutil pelo cursor */
    const mouse = { x: 0, y: 0 };
    const mTarget = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

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
      mouse.x += (mTarget.x - mouse.x) * 0.05;
      mouse.y += (mTarget.y - mouse.y) * 0.05;
      if (modelOn) {
        holder.scale.setScalar(baseScale);
        holder.rotation.y = p * Math.PI * 2 + mouse.x * 0.25;
        holder.rotation.x = mouse.y * 0.12 + Math.sin(t * 0.6) * 0.02;
        holder.position.y = Math.sin(t * 0.9) * 0.05;
        renderer.render(scene, camera);
      }
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
      disposed = true;
      stop();
      st?.kill();
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
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
  }, [sectionRef, len]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
