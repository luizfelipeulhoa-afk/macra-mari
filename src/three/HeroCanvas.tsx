import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildModel, disposeObject, PALETTE } from "./models";
import { hasFinePointer, isMobileViewport } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  motionOn: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Cena 3D do hero: uma mandala de macramê procedural.
 * O scroll "mergulha" a câmera na trama (GSAP ScrollTrigger com scrub).
 * Em telas pequenas ou com animações pausadas, renderiza um único quadro estático.
 */
export default function HeroCanvas({ motionOn, triggerRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const trigger = triggerRef.current;
    if (!wrap) return;

    const mobile = isMobileViewport();
    const animate = motionOn && !mobile;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

    const mandala = buildModel("mandala");
    mandala.scale.setScalar(mobile ? 1.05 : 1.3);
    mandala.position.set(mobile ? 0.85 : 1.15, mobile ? -0.9 : 0.15, 0);
    scene.add(mandala);

    // cortina de cordões ao fundo
    const backdrop = new THREE.Group();
    const backdropMat = new THREE.MeshStandardMaterial({
      color: PALETTE.sand,
      roughness: 1,
      transparent: true,
      opacity: 0.4,
    });
    const knotMat = new THREE.MeshStandardMaterial({ color: PALETTE.clay, roughness: 1, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 34; i++) {
      const len = 5 + Math.random() * 5;
      const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 5), backdropMat);
      strand.position.set(-10 + Math.random() * 20, 3.5, -3.5 - Math.random() * 3);
      backdrop.add(strand);
      if (i % 3 === 0) {
        const bead = new THREE.Mesh(new THREE.IcosahedronGeometry(0.06, 1), knotMat);
        bead.position.set(strand.position.x, 2 - Math.random() * 4, strand.position.z + 0.2);
        backdrop.add(bead);
      }
    }
    scene.add(backdrop);

    // poeira dourada flutuando
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 130;
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -6 + Math.random() * 8;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xc6ab7c, size: 0.035, transparent: true, opacity: 0.6 })
    );
    scene.add(dust);

    scene.add(new THREE.HemisphereLight(0xf7efdd, 0x6b4f35, 1.15));
    const key = new THREE.DirectionalLight(0xffe9c4, 1.9);
    key.position.set(4, 6, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9c48a, 0.55);
    rim.position.set(-6, 2, -4);
    scene.add(rim);

    // estado da câmera controlado pelo scrub
    const cam = {
      x: 0,
      y: 0,
      z: mobile ? 11.5 : 9.5,
      roll: 0,
    };
    camera.position.set(cam.x, cam.y, cam.z);
    camera.lookAt(0, 0.1, 0);

    const ctx = gsap.context(() => {
      if (animate && trigger) {
        const END = "+=100%";
        gsap.to(cam, {
          z: 3.4,
          x: -0.65,
          y: 0.5,
          roll: 0.05,
          ease: "none",
          scrollTrigger: { trigger, start: "top top", end: END, scrub: 1.1 },
        });
        gsap.to(mandala.rotation, {
          y: Math.PI * 0.6,
          z: 0.28,
          ease: "none",
          scrollTrigger: { trigger, start: "top top", end: END, scrub: 1.1 },
        });
        gsap.to(backdrop.position, {
          y: 2.4,
          ease: "none",
          scrollTrigger: { trigger, start: "top top", end: END, scrub: 1.1 },
        });
        gsap.to(dust.rotation, {
          y: 0.25,
          ease: "none",
          scrollTrigger: { trigger, start: "top top", end: END, scrub: 1.1 },
        });
      }
    }, wrap);

    // paralaxe suave do ponteiro
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
    const usePointer = animate && hasFinePointer();
    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    if (usePointer) window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!animate) renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let raf = 0;
    const clock = new THREE.Clock();
    let t = 0;
    if (animate) {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(clock.getDelta(), 0.05);
        t += dt;
        mandala.rotation.y += dt * 0.06;
        mandala.position.y = (mobile ? -0.9 : 0.15) + Math.sin(t * 0.6) * 0.05;
        dust.rotation.y += dt * 0.012;
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        camera.position.set(cam.x + pointer.x * 0.45, cam.y - pointer.y * 0.3, cam.z);
        camera.lookAt(0, 0.15, 0);
        camera.rotation.z = cam.roll;
        renderer.render(scene, camera);
      };
      loop();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      ro.disconnect();
      if (usePointer) window.removeEventListener("pointermove", onPointer);
      disposeObject(scene);
      dustGeo.dispose();
      (dust.material as THREE.Material).dispose();
      backdropMat.dispose();
      knotMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === wrap) wrap.removeChild(renderer.domElement);
    };
  }, [motionOn, triggerRef]);

  return <div ref={wrapRef} aria-hidden="true" className="absolute inset-0" />;
}
