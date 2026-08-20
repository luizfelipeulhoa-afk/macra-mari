import { collections, type Collection } from "../data/atelier";
import { useStore } from "../store/useStore";
import { scrollToId } from "../lib/motion";
import Reveal from "./Reveal";
import SmartImg from "./SmartImg";
import { ArrowIcon, ThreadIcon } from "./Icons";

const toneBg: Record<Collection["tone"], string> = {
  clay: "bg-clay",
  moss: "bg-moss",
  ocre: "bg-ocre",
};

const toneText: Record<Collection["tone"], string> = {
  clay: "text-cream",
  moss: "text-cream",
  ocre: "text-ink",
};

export default function Collections() {
  const setFilter = useStore((s) => s.setFilter);

  const goShop = (c: Collection) => {
    setFilter(c.category);
    scrollToId("pecas");
  };

  return (
    <section id="colecoes" className="relative scroll-mt-24 overflow-hidden border-b-2 border-ink bg-moss-deep text-cream">
      {/* fios decorativos */}
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full text-cream/15" preserveAspectRatio="none" viewBox="0 0 1200 60" aria-hidden="true">
        <path d="M0 10 C 200 50, 400 10, 600 34 S 1000 50, 1200 12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M0 26 C 240 56, 480 20, 720 42 S 1040 52, 1200 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
      </svg>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-ocre">
                <ThreadIcon className="h-4 w-4" /> tingimento natural · séries limitadas
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
                Coleções que nascem
                <br />
                <span className="outline-text-cream">do tacho de tinta</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <p className="max-w-sm text-[15px] leading-relaxed text-cream/75">
              Urucum, casca de cebola, açafrão e folhas de goiabeira. As cores
              mudam conforme a estação — e cada tingida rende uma série pequena,
              numerada à mão.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal
              key={c.id}
              delay={i * 130}
              rot={i % 2 === 0 ? -2 : 2}
              className="h-full"
            >
              <button
                onClick={() => goShop(c)}
                className={`card-lift group flex h-full w-full flex-col border-2 border-ink text-left shadow-[6px_8px_0_rgba(0,0,0,0.35)] ${toneBg[c.tone]} ${toneText[c.tone]}`}
                style={{ rotate: `${i % 2 === 0 ? -1 : 1.2}deg` }}
              >
                <span className="img-zoom relative block aspect-[16/10] overflow-hidden border-b-2 border-ink">
                  <SmartImg src={c.img} alt={`Coleção ${c.name}`} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 border-2 border-ink bg-cream px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                    série nº {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-3xl font-extrabold tracking-tight">
                      {c.name}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider opacity-80">
                      {c.pieces} peças
                    </span>
                  </span>
                  <span className="mt-2 flex-1 text-[14px] leading-relaxed opacity-85">
                    {c.desc}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 border-t-2 border-dashed border-current/30 pt-4 font-mono text-[12px] uppercase tracking-[0.18em]">
                    ver peças da coleção
                    <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
