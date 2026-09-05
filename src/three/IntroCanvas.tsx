import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadGlbSmart, normalize } from "./loadModel";
import { MODELS } from "../data/atelier";
import { prefersReducedMotion } from "../lib/motion";
import { sample } from "../lib/choreo";

interface IntroCanvasProps {
  sectionRef: RefObject<HTMLElement>;
  len: number;
  onReady?: () => void;
  onFail?: () => void;
}

/* ————————————————————————————————————————————————
   Camada 3D do showroom: o GLB segue a MESMA coreografia
   da peça 2D — giro de 360° com pausas nos capítulos e
   zoom in/out entre eles, tudo dirigido pelo scroll.
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
  useEffect(() => {
    onReadyRef.current = onReady;
    onFailRef.current = onFail;
  });

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

    /* nitidez máxima + luz de vitrine */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2c1e13, 1.5));
    const key = new THREE.DirectionalLight(0xffe3c0, 3);
    key.position.set(3.5, 4.5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc489, 1.5);
    rim.position.set(-3, 1.5, -4);
    scene.add(rim);
    const front = new THREE.DirectionalLight(0xfff6e8, 1.1);
    front.position.set(0, 1, 8);
    scene.add(front);

    const holder = new THREE.Group();
    scene.add(holder);

    let disposed = false;
    let modelOn = false;
    let base = 1; /* escala que faz o modelo caber na vitrine */

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vpWorldH = 2 * Math.tan((36 * Math.PI) / 360) * 8;
      base = (vpWorldH * 0.62);
    };

    const renderAt = (p: number) => {
      if (!modelOn) return;
      const pose = sample(p);
      holder.rotation.y = (pose.deg * Math.PI) / 180;
      holder.rotation.x = pose.y * 0.5;
      holder.position.y = pose.y * 1.6;
      holder.scale.setScalar(Math.max(base * pose.zoom, 0.001));
      renderer.render(scene, camera);
    };

    /* o modelo real (local primeiro, Drive como reserva) */
    loadGlbSmart(MODELS.wallLocal, MODELS.wallDrive)
      .then((model) => {
        if (disposed) return;
        holder.add(normalize(model, 1));
        modelOn = true;
        resize();
        if (reduced) renderAt(0.5);
        onReadyRef.current?.();
      })
      .catch(() => {
        if (!disposed) onFailRef.current?.();
      });

    /* progresso do scroll na seção pinada */
    let target = reduced ? 0.5 : 0;
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
      if (modelOn) holder.rotation.y += Math.sin(t * 0.5) * 0.0012;
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
