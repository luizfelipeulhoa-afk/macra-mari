import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion";

/*
 * Fios de algodão soltos, flutuando devagar pelo fundo — como se o
 * atelier tivesse fios pendurados por toda parte, respirando.
 * Camada decorativa e leve (SVG + GSAP, sem canvas).
 */

const THREADS = [
  { x: "8%", h: "34%", c: "var(--color-clay)", d: 7, delay: 0 },
  { x: "16%", h: "22%", c: "var(--color-ocre)", d: 9, delay: 1.2 },
  { x: "27%", h: "42%", c: "var(--color-moss)", d: 8, delay: 0.5 },
  { x: "38%", h: "18%", c: "var(--color-clay)", d: 10, delay: 2 },
  { x: "52%", h: "30%", c: "var(--color-ocre)", d: 7.5, delay: 0.8 },
  { x: "63%", h: "24%", c: "var(--color-moss)", d: 9.5, delay: 1.6 },
  { x: "74%", h: "38%", c: "var(--color-clay)", d: 8.5, delay: 0.3 },
  { x: "85%", h: "20%", c: "var(--color-ocre)", d: 7, delay: 2.4 },
  { x: "94%", h: "32%", c: "var(--color-moss)", d: 10, delay: 1 },
];

export default function AmbientThreads({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".amb-thread").forEach((t, i) => {
        const cfg = THREADS[i % THREADS.length];
        /* cada fio balança no topo, com fase e duração próprias */
        gsap.to(t, {
          rotate: 4,
          duration: cfg.d,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          transformOrigin: "50% 0%",
          delay: cfg.delay,
        });
        /* e deriva levemente na vertical */
        gsap.to(t, {
          y: 14,
          duration: cfg.d * 0.7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: cfg.delay * 0.5,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {THREADS.map((t, i) => (
        <span
          key={i}
          className="amb-thread absolute top-0 block w-[2px] opacity-[0.16]"
          style={{ left: t.x, height: t.h, background: t.c, borderRadius: "0 0 2px 2px" }}
        >
          {/* o nozinho na ponta do fio */}
          <span
            className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
            style={{ background: t.c }}
          />
        </span>
      ))}
    </div>
  );
}
