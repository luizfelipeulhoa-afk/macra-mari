import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Mandala Solar — réplica procedural da peça em Three.js.
 * Simetria radial: aro de madeira, raios de fio cru, anéis de nós
 * coloridos (terracota / mostarda / musgo), centro em nó decorativo
 * e franjas penduradas que balançam. O scroll atua como operador de
 * câmera (rotação + aproximação) e o cursor inclina a peça.
 */
export default function Mandala3D({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.15, 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    /* luz quente de atelier */
    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x3a2a1a, 1.2));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.4);
    key.position.set(3, 4, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9db3c8, 0.55);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    const matCream = new THREE.MeshStandardMaterial({ color: 0xf1e3c6, roughness: 0.9 });
    const matTerra = new THREE.MeshStandardMaterial({ color: 0xc2512b, roughness: 0.82 });
    const matMustard = new THREE.MeshStandardMaterial({ color: 0xd89b3d, roughness: 0.8 });
    const matMoss = new THREE.MeshStandardMaterial({ color: 0x35573b, roughness: 0.85 });
    const matWood = new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.62 });

    const group = new THREE.Group();
    scene.add(group);

    const R = 2.45;

    /* aro de madeira */
    group.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.075, 20, 110), matWood));

    /* centro: nó decorativo */
    const center = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.42, 0.14, 150, 18),
      matTerra
    );
    group.add(center);
    group.add(new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.05, 12, 72), matCream));

    /* raios de fio cru */
    const spokeGeo = new THREE.CylinderGeometry(0.032, 0.032, R - 1.0, 8);
    const spokeCount = 22;
    for (let i = 0; i < spokeCount; i++) {
      const a = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeo, matCream);
      const mid = (R + 1.0) / 2;
      spoke.position.set(Math.cos(a) * mid, Math.sin(a) * mid, 0);
      spoke.rotation.z = a - Math.PI / 2;
      group.add(spoke);
    }

    /* anéis de nós */
    const knotGeo = new THREE.TorusGeometry(0.085, 0.055, 10, 18);
    const rings: { r: number; n: number; mats: THREE.MeshStandardMaterial[] }[] = [
      { r: 1.5, n: 11, mats: [matTerra, matMustard] },
      { r: 2.0, n: 16, mats: [matCream, matMoss, matMustard] },
    ];
    rings.forEach((ring, ri) => {
      for (let i = 0; i < ring.n; i++) {
        const a = (i / ring.n) * Math.PI * 2 + ri * 0.18;
        const k = new THREE.Mesh(knotGeo, ring.mats[i % ring.mats.length]);
        k.position.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0.05);
        group.add(k);
      }
    });

    /* franjas na base, cada uma com pivô próprio p/ balanço */
    const fringes: THREE.Group[] = [];
    const fringeCount = 17;
    for (let i = 0; i < fringeCount; i++) {
      const t = i / (fringeCount - 1);
      const a = Math.PI * 1.08 + t * Math.PI * 0.84; /* arco inferior */
      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      const len = 0.72 + Math.sin(t * Math.PI) * 0.42;
      const strand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.011, len, 6),
        i % 3 === 0 ? matMustard : matCream
      );
      strand.position.y = -len / 2 - 0.03;
      pivot.add(strand);
      pivot.rotation.z = (Math.random() - 0.5) * 0.12;
      group.add(pivot);
      fringes.push(pivot);
    }

    /* cordão de pendurar em V */
    const apex = new THREE.Vector3(0, R + 1.0, 0);
    [-1, 1].forEach((s) => {
      const ang = Math.PI / 2 + s * 0.62;
      const p = new THREE.Vector3(Math.cos(ang) * R, Math.sin(ang) * R, 0);
      const dir = new THREE.Vector3().subVectors(p, apex);
      const len = dir.length();
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, len, 6),
        matWood
      );
      cord.position.copy(apex).addScaledVector(dir, 0.5);
      cord.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      group.add(cord);
    });
    const topKnot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), matTerra);
    topKnot.position.copy(apex);
    group.add(topKnot);

    /* interação: cursor inclina, scroll gira e aproxima (operador de câmera) */
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let scroll = 0;
    let scrollTarget = 0;

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollTarget = Math.min(window.scrollY / window.innerHeight, 1.4);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;
      scroll += (scrollTarget - scroll) * 0.08;

      group.rotation.y = mouse.x * 0.45 + scroll * 1.15;
      group.rotation.x = -mouse.y * 0.26 + Math.sin(t * 0.5) * 0.03;
      center.rotation.z = t * 0.35;
      camera.position.z = 8.2 - scroll * 1.5;

      fringes.forEach((f, i) => {
        f.rotation.z = Math.sin(t * 1.6 + i * 0.7) * 0.075;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      group.rotation.y = 0.5;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      [matCream, matTerra, matMustard, matMoss, matWood].forEach((m) =>
        m.dispose()
      );
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
