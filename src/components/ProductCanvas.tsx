import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildModel, disposeObject, type ModelId } from "../three/models";
import { isMobileViewport } from "../lib/scroll";
import { useStore } from "../store/useStore";

interface Props {
  model: ModelId;
  alt: string;
  /** gira continuamente; quando desligado, renderiza quadro estático */
  spin?: boolean;
}

/**
 * Renderiza o modelo 3D procedural do produto dentro do cartão.
 * Gira devagar; acelera no hover. Com animações pausadas (ou no mobile),
 * exibe um único quadro estático — leve e acessível.
 */
export default function ProductCanvas({ model, alt, spin = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const motionOn = useStore((s) => s.motionOn);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const animate = motionOn && spin && !isMobileViewport();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0.15, model === "portaCopos" ? 3.6 : 4.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xf7efdd, 0x6b4f35, 1.1));
    const key = new THREE.DirectionalLight(0xffe9c4, 1.7);
    key.position.set(3, 5, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xc9c48a, 0.5);
    fill.position.set(-5, 1, -3);
    scene.add(fill);

    const group = buildModel(model);
    scene.add(group);

    let hover = false;
    const onEnter = () => {
      hover = true;
    };
    const onLeave = () => {
      hover = false;
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "160px" }
    );
    io.observe(wrap);

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
    if (animate) {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        group.rotation.y += dt * (hover ? 1.15 : 0.32);
        renderer.render(scene, camera);
      };
      loop();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      disposeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentElement === wrap) wrap.removeChild(renderer.domElement);
    };
  }, [model, motionOn, spin]);

  return <div ref={wrapRef} role="img" aria-label={alt} className="absolute inset-0" />;
}
