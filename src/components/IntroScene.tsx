import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";
import { ArrowDownIcon, KnotMark } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const WORD_A = "MACRA";
const WORD_B = "MARI";
const TOTAL_KNOTS = 3412;

function IntroMandala({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
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
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={`d${i}`} cx="200" cy="66" r="4" fill="currentColor" transform={`rotate(${i * 30 + 15} 200 200)`} />
      ))}
    </svg>
  );
}

/* Introdução cinematográfica: o scroll é o operador da cena.
   Fase 1 — letras gigantes sobem como fios + contador de nós;
   Fase 2 — letras se desfiam, entra wordmark, tagline e mandala;
   Fase 3 — cortina de papel revela o atelier (hero). */
export default function IntroScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const counter = { v: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=2800",
          scrub: 0.6,
          pin: true,
        },
      });

      /* fase 1 — as letras sobem, o fio se tece, os nós são contados */
      tl.from(".mchar", {
        yPercent: 135,
        rotate: 10,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.05,
      }, 0.1);
      tl.from(".ithread", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 5.1,
        ease: "none",
      }, 0);
      tl.to(counter, {
        v: TOTAL_KNOTS,
        duration: 2.3,
        ease: "none",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.v).toLocaleString("pt-BR");
          }
        },
      }, 0);

      /* fase 2 — as letras se desfiam para cima */
      tl.to(".mchar", {
        yPercent: -135,
        opacity: 0,
        duration: 0.65,
        ease: "power2.in",
        stagger: 0.028,
      }, 2.05);
      tl.to(".iside", { opacity: 0, duration: 0.35 }, 2.05);

      /* wordmark + tagline + mandala girando para dentro */
      tl.from(".iword-inner", { yPercent: 120, duration: 0.7, ease: "power3.out" }, 2.6);
      tl.from(".itag", {
        yPercent: 125,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.1,
      }, 2.8);
      tl.from(".imandala", {
        scale: 0.5,
        rotate: -150,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      }, 2.7);
      /* fase 3 — saída + cortina de papel */
      tl.to(".iword, .tline, .itag, .icue, .icounter", {
        opacity: 0,
        y: -44,
        duration: 0.45,
        stagger: 0.04,
      }, 4.25);
      tl.to(".imandala", { opacity: 0, scale: 1.3, rotate: 45, duration: 0.6 }, 4.25);
      tl.to(".icurtain", { yPercent: 0, duration: 0.75, ease: "power2.inOut" }, 4.55);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  /* versão estática (movimento reduzido): uma tela só, sem pin */
  if (reduced) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink text-cream">
        <IntroMandala className="pointer-events-none absolute left-1/2 top-1/2 h-[88vmin] w-[88vmin] -translate-x-1/2 -translate-y-1/2 text-cream/[0.13]" />
        <div className="relative z-10 px-6 text-center">
          <p className="mb-4 inline-block border-2 border-cream/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.26em] text-cream/80">
            atelier de macramê · florianópolis · desde 2011
          </p>
          <h1 className="font-display text-[clamp(3rem,14vw,9rem)] font-extrabold leading-[0.9] tracking-tight">
            Macra<span className="text-ocre">Mari</span>
          </h1>
          <p className="mt-4 font-display text-xl font-semibold text-cream/85 sm:text-2xl">
            feito devagar, nó por nó, fio por fio.
          </p>
          <a
            href="#pecas"
            className="mt-8 inline-flex items-center gap-2 border-2 border-cream px-6 py-3 font-mono text-sm uppercase tracking-wider transition-colors hover:bg-cream hover:text-ink"
          >
            entrar no atelier <ArrowDownIcon className="h-4 w-4" />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-ink text-cream"
      aria-label="Introdução — Macra Mari, atelier de macramê"
    >
      {/* mandala que gira para dentro na fase 2 */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <IntroMandala className="imandala h-[94vmin] w-[94vmin] text-cream/[0.14]" />
      </div>

      {/* fase 1 — letras gigantes */}
      <div className="absolute inset-0 grid place-items-center px-4">
        <h1 className="select-none text-center font-display font-extrabold leading-[0.85] tracking-tight">
          <span className="mline text-[clamp(3.4rem,16.5vw,12.5rem)]">
            {WORD_A.split("").map((ch, i) => (
              <span key={`a${i}`} className="mchar">{ch}</span>
            ))}
          </span>
          <span className="mline outline-text-cream text-[clamp(3.4rem,16.5vw,12.5rem)]">
            {WORD_B.split("").map((ch, i) => (
              <span key={`b${i}`} className="mchar">{ch}</span>
            ))}
          </span>
        </h1>
      </div>

      {/* fase 2 — wordmark + tagline */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
        <div className="text-center">
          <p className="tline font-mono text-[12px] uppercase tracking-[0.3em] text-ocre">
            <span className="iword-inner">atelier de macramê — florianópolis</span>
          </p>
          <p className="iword mt-3 overflow-hidden font-display text-[clamp(2.6rem,9vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight">
            <span className="iword-inner">
              Macra<span className="text-ocre">Mari</span>
            </span>
          </p>
          <div className="mt-5 font-display text-[clamp(1.15rem,3vw,1.9rem)] font-semibold text-cream/85">
            <span className="tline"><span className="itag">feito devagar,</span></span>
            <span className="tline"><span className="itag">nó por nó, fio por fio.</span></span>
          </div>
        </div>
      </div>

      {/* rótulos laterais */}
      <p className="iside absolute left-5 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] uppercase tracking-[0.42em] text-cream/45 [writing-mode:vertical-rl] md:block">
        algodão orgânico · tingimento natural
      </p>
      <p className="iside absolute right-5 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.42em] text-cream/45 [writing-mode:vertical-rl] md:block">
        desde 2011 · peças numeradas à mão
      </p>

      {/* contador de nós */}
      <div className="icounter absolute bottom-14 left-5 flex items-baseline gap-3 sm:left-8">
        <span ref={counterRef} className="font-display text-4xl font-extrabold tabular-nums text-ocre sm:text-5xl">
          0
        </span>
        <span className="max-w-[9rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-cream/60">
          nós tecidos enquanto você desce
        </span>
      </div>

      {/* dica de scroll */}
      <div className="icue absolute bottom-14 right-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/70 sm:right-8">
        role para entrar no atelier
        <ArrowDownIcon className="h-4 w-4 animate-bob text-ocre" />
      </div>

      {/* fio de progresso — a linha que se tece com o scroll */}
      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-cream/10">
        <div className="ithread h-full w-full origin-left bg-ocre" />
      </div>

      {/* cortina de papel que revela o atelier */}
      <div className="icurtain absolute inset-0 z-30 grid translate-y-[101%] place-items-center bg-paper">
        <span className="flex items-center gap-3 text-ink">
          <KnotMark className="h-9 w-9 text-clay" />
          <span className="font-display text-3xl font-extrabold tracking-tight">
            Macra<span className="text-clay">Mari</span>
          </span>
        </span>
      </div>
    </section>
  );
}
