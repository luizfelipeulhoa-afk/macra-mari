import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { loadGlb, loadZipModel, normalize } from "./loadModel";
import { MODELS } from "../data/atelier";
import Mandala3D from "./Mandala3D";

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
   ———————————————————————————————————————————————— */
export default function Stage3D({ active, className = "", onStatus }: Stage3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<StagePiece>(active);
  const [failed, setFailed] = useState(false);

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

    /* luz quente de ateliê */
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

    const matWood = new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.62 });

    /* vara de pendurar */
    const dowel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.6, 14), matWood);
    dowel.rotation.z = Math.PI / 2;
    dowel.position.y = 2.55;
    scene.add(dowel);
    [-1, 1].forEach((s) => {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), matWood);
      cap.position.set(s * 2.32, 2.55, 0);
      scene.add(cap);
    });

    /* pedestal da bolsa */
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.14, 0.16, 28), matWood);
    pedestal.position.set(0, -2.5, 0);
    scene.add(pedestal);

    const wallGroup = new THREE.Group();
    const bagGroup = new THREE.Group();
    scene.add(wallGroup, bagGroup);

    const loaded: Record<StagePiece, boolean> = { wall: false, bag: false };

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

    /* carregamento das duas peças */
    const report = () => {
      if (loaded.wall || loaded.bag) onStatus?.("ready");
    };

    loadZipModel(MODELS.wallZip)
      .then((m) => {
        if (disposed) return;
        wallGroup.add(normalize(m, 3.4));
        loaded.wall = true;
        report();
      })
      .catch(() => undefined);

    loadGlb(MODELS.blueBag)
      .then((m) => {
        if (disposed) return;
        bagGroup.add(normalize(m, 2.0));
        loaded.bag = true;
        report();
      })
      .catch(() => undefined);

    /* se as duas falharem, o palco avisa e mostra a mandala reserva */
    const failTimer = window.setTimeout(() => {
      if (!loaded.wall && !loaded.bag && !disposed) {
        onStatus?.("error");
        setFailed(true);
      }
    }, 12000);

    /* interação: cursor inclina, arraste gira com inércia */
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let drag = { wall: 0, bag: 0 };
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

    /* render só quando visível */
    let raf = 0;
    let running = false;
    let visible = true;
    const clock = new THREE.Clock();

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

      wallGroup.position.copy(cur.wall.p);
      wallGroup.scale.setScalar(Math.max(cur.wall.s, 0.001));
      wallGroup.rotation.y = scroll + drag.wall + mouse.x * 0.35;
      wallGroup.rotation.z = Math.sin(t * 0.9) * 0.045;
      wallGroup.rotation.x = -mouse.y * 0.12;

      bagGroup.position.copy(cur.bag.p);
      bagGroup.scale.setScalar(Math.max(cur.bag.s, 0.001));
      bagGroup.rotation.y = t * 0.35 + scroll * 0.7 + drag.bag + mouse.x * 0.4;
      bagGroup.rotation.x = -mouse.y * 0.1;

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

    if (reduced) {
      renderer.render(scene, camera);
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
        disposed = true;
        window.clearTimeout(failTimer);
        stop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("scroll", onScroll);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        ro.disconnect();
        scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) m.geometry.dispose();
        });
        [matWood].forEach((m) => m.dispose());
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    }

    return () => {
      disposed = true;
      window.clearTimeout(failTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      [matWood].forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, [onStatus]);

  /* reserva: se o Drive não entregar os modelos, a mandala assume o palco */
  if (failed) {
    return <Mandala3D className={className} />;
  }

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
