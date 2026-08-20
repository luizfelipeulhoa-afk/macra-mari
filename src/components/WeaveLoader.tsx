import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion";

/*
 * O Tear — abertura da página.
 * Antes de qualquer conteúdo, a própria tela é tecida:
 * 1) os fios de urdidura descem no tear
 * 2) o wordmark sobe fio a fio
 * 3) a lançadeira cruza a tela 15 vezes, deixando a trama colorida
 *    enquanto o contador tece até o nó 3.412
 * 4) a trama se solta, os fios recolhem e o painel inteiro sobe,
 *    entregando a página ao scroll.
 */

const WARP_COUNT = 26;
const WEFT_COUNT = 15;
const WEFT_COLORS = [
  "var(--color-clay)",
  "var(--color-ocre)",
  "var(--color-cream)",
  "var(--color-moss)",
  "var(--color-ocre)",
  "var(--color-clay)",
];

export default function WeaveLoader() {
  const [done, setDone] = useState(false);
  const countRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    /* movimento reduzido: abertura curta e estática, entra sozinha */
    if (prefersReducedMotion()) {
      const t = window.setTimeout(() => setDone(true), 2200);
      return () => window.clearTimeout(t);
    }

    document.body.style.overflow = "hidden";

    /* à prova de falhas: a página sempre abre, aconteça o que for */
    const failsafe = window.setTimeout(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 7000);

    const ctx = gsap.context(() => {
      const warp = gsap.utils.toArray<HTMLElement>(".wl-warp");
      const weft = gsap.utils.toArray<HTMLElement>(".wl-weft");
      const shuttle = document.querySelector<HTMLElement>(".wl-shuttle");
      const counter = { v: 0 };
      const fmt = (v: number) =>
        `nó ${Math.round(v).toLocaleString("pt-BR").padStart(5, "0")} / 3.412`;

      if (countRef.current) countRef.current.textContent = fmt(0);

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      /* 1 — urdidura desce no tear */
      tl.from(warp, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.016,
      });

      /* 2 — wordmark fio a fio */
      tl.from(
        ".wl-letter",
        { y: 46, opacity: 0, rotate: 7, duration: 0.5, ease: "power3.out", stagger: 0.045 },
        0.22
      );
      tl.from(".wl-meta", { opacity: 0, y: 16, duration: 0.4, stagger: 0.1 }, 0.5);

      /* 3 — lançadeira tece a trama + contador */
      tl.to(
        counter,
        {
          v: 3412,
          duration: 1.85,
          ease: "power1.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = fmt(counter.v);
          },
        },
        0.6
      );

      const weftStart = 0.7;
      const step = 0.112;
      weft.forEach((w, i) => {
        const pos = weftStart + i * step;
        const y = ((i + 1) / (weft.length + 1)) * 100;
        if (shuttle) {
          tl.set(shuttle, { top: `${y}%` }, pos);
          tl.fromTo(
            shuttle,
            { x: "-16vw" },
            { x: "108vw", duration: step, ease: "none" },
            pos
          );
        }
        tl.fromTo(
          w,
          { scaleX: 0 },
          { scaleX: 1, duration: step, ease: "none" },
          pos
        );
      });

      const end = weftStart + WEFT_COUNT * step;

      /* 4 — a trama se solta e o tear entrega a página */
      tl.call(() => {
        if (countRef.current) countRef.current.textContent = "3.412 nós — pronta p/ sair do tear ✂";
      }, undefined, end + 0.05);
      tl.to(shuttle ?? "", { opacity: 0, duration: 0.18 }, end);
      tl.to(
        weft,
        {
          x: (i: number) => (i % 2 ? "112vw" : "-112vw"),
          duration: 0.5,
          ease: "power2.in",
          stagger: 0.013,
        },
        end + 0.18
      );
      tl.to(
        ".wl-letter",
        { y: -84, opacity: 0, rotate: -9, duration: 0.45, ease: "power2.in", stagger: 0.028 },
        end + 0.22
      );
      tl.to(
        warp,
        { scaleY: 0, transformOrigin: "top center", duration: 0.4, ease: "power2.in", stagger: 0.01 },
        end + 0.3
      );
      tl.to(".wl-panel", { yPercent: -101, duration: 0.8, ease: "expo.inOut" }, end + 0.78);
    });

    return () => {
      window.clearTimeout(failsafe);
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div className="wl-root" role="status" aria-label="O atelier está tecendo a página">
      <div className="wl-panel absolute inset-0">
        {/* urdidura */}
        {Array.from({ length: WARP_COUNT }).map((_, i) => (
          <span
            key={`warp-${i}`}
            className="wl-warp"
            style={{ left: `${((i + 1) / (WARP_COUNT + 1)) * 100}%` }}
          />
        ))}

        {/* trama */}
        {Array.from({ length: WEFT_COUNT }).map((_, i) => (
          <span
            key={`weft-${i}`}
            className="wl-weft"
            style={{
              top: `${((i + 1) / (WEFT_COUNT + 1)) * 100}%`,
              background: WEFT_COLORS[i % WEFT_COLORS.length],
              opacity: 0.75,
              transform: "scaleX(0)",
              transformOrigin: i % 2 ? "100% 50%" : "0% 50%",
            }}
          />
        ))}

        {/* lançadeira */}
        <span className="wl-shuttle" />

        {/* centro */}
        <div className="relative grid h-full place-items-center px-6">
          <div className="text-center">
            <p className="wl-meta mb-4 inline-block border border-cream/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/70">
              atelier macramari · florianópolis
            </p>
            <p className="font-display text-[clamp(3rem,11vw,8.5rem)] font-extrabold leading-none tracking-tight text-cream">
              {"MacraMari".split("").map((ch, i) => (
                <span
                  key={i}
                  className={`wl-letter inline-block ${i === 5 ? "text-clay" : ""}`}
                >
                  {ch}
                </span>
              ))}
            </p>
            <p className="wl-meta mt-5 font-mono text-[12px] uppercase tracking-[0.24em] text-ocre">
              <span ref={countRef}>nó 00.000 / 3.412</span>
            </p>
          </div>
        </div>

        {/* fio de arremate na borda */}
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-clay" />
      </div>
    </div>
  );
}
