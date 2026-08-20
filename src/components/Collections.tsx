import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collections, type Collection } from "../data/atelier";
import { useStore } from "../store/useStore";
import { prefersReducedMotion, scrollToId } from "../lib/motion";
import Reveal from "./Reveal";
import SmartImg from "./SmartImg";
import MaskTitle from "./MaskTitle";
import { ArrowIcon, ThreadIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const toneBg: Record<Collection["tone"], string> = {
  clay: "bg-clay",
  moss: "bg-moss-deep",
  ocre: "bg-ocre",
};

const toneText: Record<Collection["tone"], string> = {
  clay: "text-cream",
  moss: "text-cream",
  ocre: "text-ink",
};

/* Coleções como cartões empilhados: cada carta fica presa (sticky)
   enquanto a próxima desliza por cima — a de baixo encolhe e escurece,
   no mesmo gesto dos projetos da Unseen. */
export default function Collections() {
  const setFilter = useStore((s) => s.setFilter);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".stack-item");
      items.forEach((item, i) => {
        if (i === items.length - 1) return;
        const next = items[i + 1];
        gsap.to(item.querySelector(".stack-card"), {
          scale: 0.9,
          filter: "brightness(0.55) saturate(0.8)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top 12%",
            scrub: true,
          },
        });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const goShop = (c: Collection) => {
    setFilter(c.category);
    scrollToId("pecas");
  };

  return (
    <section
      id="colecoes"
      className="relative scroll-mt-24 overflow-x-clip border-b-2 border-ink bg-moss-deep text-cream"
    >
      {/* fios decorativos */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full text-cream/15"
        preserveAspectRatio="none"
        viewBox="0 0 1200 60"
        aria-hidden="true"
      >
        <path d="M0 10 C 200 50, 400 10, 600 34 S 1000 50, 1200 12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M0 26 C 240 56, 480 20, 720 42 S 1040 52, 1200 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
      </svg>

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-ocre">
                <ThreadIcon className="h-4 w-4" /> tingimento natural · séries limitadas
              </p>
              <MaskTitle
                lines={[
                  { text: "Coleções que nascem" },
                  { text: "do tacho de tinta", className: "outline-text-cream" },
                ]}
                className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight"
              />
            </Reveal>
          </div>
          <Reveal delay={150}>
            <p className="max-w-sm text-[15px] leading-relaxed text-cream/75">
              Urucum, casca de cebola, açafrão e folhas de goiabeira. As cores
              mudam conforme a estação — e cada tingida rende uma série pequena,
              numerada à mão. <strong className="text-ocre">Role: as cartas se empilham.</strong>
            </p>
          </Reveal>
        </div>

        {/* pilha de cartas */}
        <div ref={wrapRef} className="mt-16">
          {collections.map((c, i) => (
            <div key={c.id} className="stack-item mb-10" style={{ zIndex: i + 1 }}>
              <button
                onClick={() => goShop(c)}
                className={`stack-card group block w-full overflow-hidden border-2 border-ink text-left shadow-[0_-8px_30px_rgba(0,0,0,0.35)] ${toneBg[c.tone]} ${toneText[c.tone]}`}
              >
                <div className="grid md:grid-cols-2">
                  {/* imagem */}
                  <span
                    className={`wipe img-zoom relative block aspect-[16/10] overflow-hidden border-b-2 border-ink md:aspect-auto md:min-h-[420px] md:border-b-0 ${
                      i % 2 === 1 ? "md:order-2 md:border-l-2" : "md:border-r-2"
                    }`}
                  >
                    <SmartImg
                      src={c.img}
                      alt={`Coleção ${c.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 border-2 border-ink bg-cream px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                      série nº {String(i + 1).padStart(2, "0")} · {c.category}
                    </span>
                  </span>

                  {/* conteúdo */}
                  <span className="relative flex flex-col justify-center gap-4 p-7 sm:p-10 md:p-12">
                    <span
                      className="pointer-events-none absolute -top-4 right-4 select-none font-display text-[7rem] font-extrabold leading-none opacity-[0.14] sm:text-[9rem]"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="font-mono text-[11px] uppercase tracking-[0.26em] opacity-80">
                      capítulo {["um", "dois", "três"][i]} — {c.pieces} peças na série
                    </span>
                    <span className="font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[0.95] tracking-tight">
                      {c.name}
                    </span>
                    <span className="max-w-md text-[15px] leading-relaxed opacity-85">
                      {c.desc}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 border-t-2 border-dashed border-current/30 pt-5 font-mono text-[12px] uppercase tracking-[0.18em]">
                      ver peças da coleção
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50">
          ✳ cada carta é uma tingida — quando acaba, só na próxima estação
        </p>
      </div>
    </section>
  );
}
