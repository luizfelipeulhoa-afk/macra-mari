import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

/*
 * Cortina de Fios — transição cinematográfica em GLSL.
 * 14 fios verticais de algodão (terracota / tinta / ocre) varrem a tela
 * em ondas, cobrem tudo no ponto médio (onde o estado da UI troca)
 * e seguem varrendo até revelar a nova cena. Um único plano, um
 * único fragment shader — barato o bastante para rodar em mobile.
 */

const FRAG = `
precision highp float;
uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  /* cobertura em triângulo: pico total no meio da transição */
  float cov = uProgress <= 0.5 ? uProgress * 2.0 : (1.0 - uProgress) * 2.0;
  cov = smoothstep(0.0, 1.0, cov);

  float threads = 14.0;
  float x = uv.x * aspect;
  float idx = floor(x * threads);
  float fx = fract(x * threads);

  /* cada fio entra com stagger da esquerda p/ direita */
  float stagger = idx / threads;
  float local = smoothstep(stagger * 0.72, stagger * 0.72 + 0.42, cov);

  /* borda ondulada, como fio solto ao vento */
  float wave = sin(uv.y * (6.0 + hash(idx) * 7.0) + uTime * 2.0 + idx * 1.7) * 0.22;
  float edge = local + wave * local * (1.0 - local) * 4.0;
  float covered = smoothstep(0.42, 0.58, edge);

  /* textura de fibra: estrias verticais + ruído fino */
  float stripe = smoothstep(0.25, 0.5, fx) * smoothstep(1.0, 0.78, fx);
  vec3 clay = vec3(0.761, 0.318, 0.169);
  vec3 ink  = vec3(0.165, 0.112, 0.071);
  vec3 ocre = vec3(0.847, 0.608, 0.239);
  vec3 col = mix(clay, ink, step(0.70, hash(idx + 3.0)));
  col = mix(col, ocre, step(0.86, hash(idx + 7.0)));
  col *= 0.82 + stripe * 0.32;
  col += sin(uv.y * 240.0 + idx) * 0.014;

  gl_FragColor = vec4(col, covered);
}
`;

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export default function ThreadCurtain() {
  const mountRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = mountRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let busy = false;
    let tween: gsap.core.Timeline | null = null;

    const play = (midpoint: () => void) => {
      if (busy || reduced) {
        midpoint();
        return;
      }
      busy = true;
      const t0 = performance.now();
      tween = gsap
        .timeline({
          onUpdate: () => {
            uniforms.uTime.value = (performance.now() - t0) / 1000;
            renderer.render(scene, camera);
          },
          onComplete: () => {
            busy = false;
            uniforms.uProgress.value = 0;
            renderer.render(scene, camera);
          },
        })
        .to(uniforms.uProgress, { value: 0.5, duration: 0.55, ease: "power2.in" })
        .call(() => midpoint())
        .to(uniforms.uProgress, { value: 1, duration: 0.55, ease: "power2.out" });
    };

    const handler = (e: Event) => {
      const mid = (e as CustomEvent<() => void>).detail;
      play(typeof mid === "function" ? mid : () => undefined);
    };
    window.addEventListener("mm-curtain", handler);

    return () => {
      window.removeEventListener("mm-curtain", handler);
      window.removeEventListener("resize", resize);
      tween?.kill();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-[75] h-full w-full"
      aria-hidden="true"
    />
  );
}
