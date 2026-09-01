import { useEffect, useRef } from "react";
import * as THREE from "three";
import { loadGlb, loadZipModel, normalize } from "./loadModel";
import { buildKnitBag, buildWallHanging } from "./proceduralPieces";
import { MODELS } from "../data/atelier";

export type StagePiece = "wall" | "bag";
export type StageStatus = "loading" | "ready" | "error";

interface Stage3DProps {
  active: StagePiece;
  className?: string;
  onStatus?: (s: StageStatus) => void;
}

/* ————————————————————————————————————————————————
   Palco 3D do hero: o wall hanging pendurado na vara
   e a blue knitted bag no pedestal. O scroll gira as
   peças em 360°, o cursor as inclina e o arraste as
   faz rodar com inércia — um showroom de verdade.

   As peças procedurais garantem que o palco nunca fique
   vazio; os modelos reais do Drive são carregados em
   segundo plano e substituem as procedurais quando prontos.
   ———————————————————————————————————————————————— */
export default function Stage3D({ active, className = "", onStatus }: Stage3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<StagePiece>(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0.1, 8.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";

    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x3a2a1a, 1.25));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.6);
    key.position.set(3.5, 4.5, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9db3c8, 0.6);
    fill.position.set(-4, -2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc489, 0.9);
    rim.position.set(-3, 2, -4);
    scene.add(rim);

    /* vara de pendurar e pedestal (sempre visíveis) */
    const matWood = new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.62 });
    const dowel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.6, 14), matWood);
    dowel.rotation.z = Math.PI / 2;
    dowel.position.y = 2.55;
    scene.add(dowel);
    [-1, 1].forEach((s) => {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), matWood);
      cap.position.set(s * 2.32, 2.55, 0);
      scene.add(cap);
    });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.14, 0.16, 28), matWood);
    pedestal.position.set(0, -2.5, 0);
    scene.add(pedestal);

    /* peças procedurais — base garantida */
    const wallHolder = new THREE.Group();
    const bagHolder = new THREE.Group();
    wallHolder.add(buildWallHanging());
    bagHolder.add(buildKnitBag());
    scene.add(wallHolder, bagHolder);

    /* upgrade silencioso com os modelos reais do Drive */
    const upgrade = (holder: THREE.Group, real: THREE.Object3D, targetH: number) => {
      if (disposed) return;
      holder.clear();
      holder.add(normalize(real, targetH));
    };
    loadZipModel(MODELS.wallZip)
      .then((m) => upgrade(wallHolder, m, 3.0))
      .catch(() => undefined);
    loadGlb(MODELS.blueBag)
      .then((m) => upgrade(bagHolder, m, 2.0))
      .catch(() => undefined);

    /* posições/alvo conforme a peça em destaque */
    const targets: Record<StagePiece, Record<StagePiece, { p: THREE.Vector3; s: number }>> = {
      wall: {
        wall: { p: new THREE.Vector3(0, 0.35, 0), s: 1 },
        bag: { p: new THREE.Vector3(2.05, -1.62, 0.15), s: 0.5 },
      },
      bag: {
        wall: { p: new THREE.Vector3(-2.15, 0.75, -0.4), s: 0.55 },
        bag: { p: new THREE.Vector3(0, -0.9, 0), s: 1.05 },
      },
    };
    const cur = {
      wall: { p: new THREE.Vector3(0, 0.35, 0), s: 0.001 },
      bag: { p: new THREE.Vector3(2.05, -1.62, 0.15), s: 0.001 },
    };

    /* interação: cursor inclina, arraste gira com inércia */
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const drag = { wall: 0, bag: 0 };
    let vel = 0;
    let dragging = false;
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        vel = dx * 0.008;
        drag[activeRef.current] += vel;
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.style.cursor = "grabbing";
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onUp = () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };
    window.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    /* scroll = giro 360° */
    let scroll = 0;
    let scrollTarget = 0;
    const onScroll = () => {
      const hero = document.getElementById("inicio");
      const span = hero ? hero.offsetHeight * 0.85 : window.innerHeight;
      scrollTarget = Math.min(window.scrollY / span, 1.15) * Math.PI * 2;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let visible = true;

    const tick = () => {
      const t = clock.getElapsedTime();
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      scroll += (scrollTarget - scroll) * 0.08;
      if (!dragging) {
        drag.wall += vel;
        drag.bag += vel;
        vel *= 0.94;
      }

      const act = activeRef.current;
      (["wall", "bag"] as StagePiece[]).forEach((k) => {
        const tgt = targets[act][k];
        cur[k].p.lerp(tgt.p, 0.07);
        cur[k].s += (tgt.s - cur[k].s) * 0.08;
      });

      wallHolder.position.copy(cur.wall.p);
      wallHolder.scale.setScalar(Math.max(cur.wall.s, 0.001));
      wallHolder.rotation.y = scroll + drag.wall + mouse.x * 0.35;
      wallHolder.rotation.z = Math.sin(t * 0.9) * 0.045;
      wallHolder.rotation.x = -mouse.y * 0.12;

      bagHolder.position.copy(cur.bag.p);
      bagHolder.scale.setScalar(Math.max(cur.bag.s, 0.001));
      bagHolder.rotation.y = t * 0.35 + scroll * 0.7 + drag.bag + mouse.x * 0.4;
      bagHolder.rotation.x = -mouse.y * 0.1;

      camera.position.x = mouse.x * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
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

    const cleanup = () => {
      disposed = true;
      stop();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      matWood.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };

    if (reduced) {
      renderer.render(scene, camera);
      onStatus?.("ready");
      return cleanup;
    }

    /* render só quando visível e com a aba ativa */
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
    onStatus?.("ready");

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cleanup();
    };
  }, [onStatus]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
