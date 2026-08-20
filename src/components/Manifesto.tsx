import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    kicker: "capítulo 01 — a fibra",
    title: "Antes de ser decoração, é planta.",
    caption:
      "Algodão orgânico colhido no sertão, sem irrigação artificial. A cor crua já vem pronta da terra — a gente só acrescenta o tempo.",
  },
  {
    kicker: "capítulo 02 — o tempo",
    title: "Antes de ser peça, é paciência.",
    caption:
      "Uma mandala leva cerca de 40 horas de nós. A pressa é o único material que não entra no atelier — nem de encomenda.",
  },
  {
    kicker: "capítulo 03 — a casa",
    title: "Antes de chegar até você, é história.",
    caption:
      "Cada peça é numerada à mão e viaja com um bilhete de quem teceu. A sua parede termina o trabalho.",
  },
];

/* seção pinada: o scroll vira operador de câmera — a mandala gigante
   gira e a paleta do fundo muda a cada capítulo da história. */
export default function Manifesto() {
  const rootRef = useRef<HTMLElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const linesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const linesEl = linesRef.current;
    if (!root || !svg || !linesEl) return;

    const lines = Array.from(
      linesEl.querySelectorAll<HTMLDivElement>(".mani-line")
    );
    const reduced = prefersReducedMotion();

    gsap.set(lines, { autoAlpha: reduced ? 0 : 0, y: 60 });
    if (reduced) {
      gsap.set(lines[0], { autoAlpha: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=2300",
        scrub: 0.6,
        pin: true,
      },
    });

    tl.to(svg, { rotate: 170, ease: "none" }, 0);

    tl.to(lines[0], { autoAlpha: 1, y: 0, duration: 1 }, 0.15);
    tl.to(root, { backgroundColor: "#24402a", ease: "none" }, 0.6);
    tl.to(lines[0], { autoAlpha: 0, y: -60, duration: 1 }, 1.7);

    tl.to(lines[1], { autoAlpha: 1, y: 0, duration: 1 }, 2.0);
    tl.to(root, { backgroundColor: "#8a3a1c", ease: "none" }, 2.4);
    tl.to(lines[1], { autoAlpha: 0, y: -60, duration: 1 }, 3.5);

    tl.to(lines[2], { autoAlpha: 1, y: 0, duration: 1 }, 3.8);
    tl.to(root, { backgroundColor: "#a03d1d", ease: "none" }, 4.0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      id="manifesto"
      ref={rootRef}
      className="relative h-screen overflow-hidden text-cream"
      style={{ backgroundColor: "#2b1d12" }}
    >
      {/* mandala gigante que gira com o scroll */}
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-[18vmin] top-1/2 h-[95vmin] w-[95vmin] -translate-y-1/2 text-cream/[0.16]"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 10" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="96" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 7" />
        <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M200 50 C 216 92, 216 122, 200 150 C 184 122, 184 92, 200 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            transform={`rotate(${i * 30} 200 200)`}
          />
        ))}
      </svg>

      {/* contador de capítulos */}
      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[11px] uppercase tracking-[0.4em] text-cream/50 [writing-mode:vertical-rl] md:block">
        o fio da história — role para tecer
      </div>

      <div
        ref={linesRef}
        className="relative z-10 grid h-full place-items-center px-6"
      >
        {chapters.map((c) => (
          <div
            key={c.kicker}
            className="mani-line absolute inset-0 grid place-items-center px-6"
          >
            <div className="max-w-2xl">
              <p className="mb-4 inline-block border-2 border-cream/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.26em] text-cream/80">
                {c.kicker}
              </p>
              <h2 className="font-display text-[clamp(2rem,6vw,4.6rem)] font-extrabold leading-[0.98] tracking-tight">
                {c.title}
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-cream/80">
                {c.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
