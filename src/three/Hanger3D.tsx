import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * Porta-vaso Suspenso — réplica procedural em Three.js.
 * Argola de latão, seis fios trançados até a boca do vaso,
 * vaso de cerâmica com folhagem, nó de fechamento e franjas.
 * A cor do fio e a escala respondem ao vivo ao configurador.
 */
interface Hanger3DProps {
  cordHex: string;
  scale: number;
  className?: string;
}

export default function Hanger3D({ cordHex, scale, className = "" }: Hanger3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<{ cord: THREE.MeshStandardMaterial; group: THREE.Group } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, 7.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff2dd, 0x3a2a1a, 1.25));
    const key = new THREE.DirectionalLight(0xffe3c0, 2.3);
    key.position.set(3, 4, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9db3c8, 0.5);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    const matCord = new THREE.MeshStandardMaterial({ color: new THREE.Color(cordHex), roughness: 0.9 });
    const matBrass = new THREE.MeshStandardMaterial({ color: 0xc9a24b, roughness: 0.35, metalness: 0.7 });
    const matPot = new THREE.MeshStandardMaterial({ color: 0xb0603a, roughness: 0.7 });
    const matLeaf = new THREE.MeshStandardMaterial({ color: 0x3f6b45, roughness: 0.8 });
    const matLeafDark = new THREE.MeshStandardMaterial({ color: 0x2f5236, roughness: 0.85 });

    const group = new THREE.Group();
    scene.add(group);
    apiRef.current = { cord: matCord, group };

    /* argola de latão + gancho */
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.045, 12, 40), matBrass);
    ring.position.y = 2.15;
    group.add(ring);
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), matBrass);
    hook.position.y = 2.55;
    group.add(hook);

    /* vaso de cerâmica (tronco-cônico) */
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.42, 0.72, 26), matPot);
    pot.position.y = -0.15;
    group.add(pot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 10, 40), matPot);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.21;
    group.add(rim);

    /* folhagem */
    const foliage: [number, number, number, number, THREE.MeshStandardMaterial][] = [
      [0, 0.62, 0, 0.42, matLeaf],
      [-0.34, 0.5, 0.1, 0.3, matLeafDark],
      [0.32, 0.52, -0.08, 0.3, matLeaf],
      [0.05, 0.85, 0.05, 0.26, matLeafDark],
    ];
    foliage.forEach(([x, y, z, r, m]) => {
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), m);
      leaf.position.set(x, y, z);
      group.add(leaf);
    });

    /* seis fios: argola → boca do vaso → nó inferior */
    const cordCount = 6;
    const top = new THREE.Vector3(0, 2.0, 0);
    const bottom = new THREE.Vector3(0, -1.15, 0);
    for (let i = 0; i < cordCount; i++) {
      const a = (i / cordCount) * Math.PI * 2;
      const rimPt = new THREE.Vector3(Math.cos(a) * 0.58, 0.2, Math.sin(a) * 0.58);

      [
        [top, rimPt],
        [rimPt, bottom],
      ].forEach(([from, to]) => {
        const dir = new THREE.Vector3().subVectors(to, from);
        const len = dir.length();
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, len, 7), matCord);
        cord.position.copy(from).addScaledVector(dir, 0.5);
        cord.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        group.add(cord);
      });

      /* nó na boca do vaso */
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), matCord);
      knot.position.copy(rimPt);
      group.add(knot);
    }

    /* nó de fechamento + franjas */
    const closeKnot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), matCord);
    closeKnot.position.copy(bottom);
    group.add(closeKnot);

    const fringes: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.01, 0.42, 6), matCord);
      f.position.set(Math.cos(a) * 0.07, -1.42, Math.sin(a) * 0.07);
      f.rotation.z = Math.cos(a) * 0.22;
      f.rotation.x = Math.sin(a) * 0.22;
      group.add(f);
      fringes.push(f);
    }

    group.scale.setScalar(scale);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

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

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      mouse.x += (target.x - mouse.x) * 0.07;
      mouse.y += (target.y - mouse.y) * 0.07;
      group.rotation.y = t * 0.35 + mouse.x * 0.5;
      group.rotation.z = Math.sin(t * 0.9) * 0.04;
      group.position.y = Math.sin(t * 1.1) * 0.05;
      fringes.forEach((f, i) => {
        f.rotation.z += Math.sin(t * 2 + i) * 0.0009;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      group.rotation.y = 0.6;
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      [matCord, matBrass, matPot, matLeaf, matLeafDark].forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* resposta ao vivo ao configurador */
  useEffect(() => {
    apiRef.current?.cord.color.set(cordHex);
  }, [cordHex]);

  useEffect(() => {
    if (apiRef.current) apiRef.current.group.scale.setScalar(scale);
  }, [scale]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
