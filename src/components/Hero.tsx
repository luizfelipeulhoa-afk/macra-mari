import { products, marqueeWords, formatBRL } from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import Reveal from "./Reveal";
import { ArrowDownIcon, PlusIcon, StarIcon } from "./Icons";

/* mandala decorativa que gira lentamente ao fundo */
function Mandala({ className }: { className?: string }) {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 10" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="96" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 7" />
      <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
      {petals.map((_, i) => (
        <path
          key={i}
          d="M200 50 C 216 92, 216 122, 200 150 C 184 122, 184 92, 200 50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${i * 30} 200 200)`}
        />
      ))}
      {petals.map((_, i) => (
        <circle
          key={`d${i}`}
          cx="200"
          cy="66"
          r="4"
          fill="currentColor"
          transform={`rotate(${i * 30 + 15} 200 200)`}
        />
      ))}
    </svg>
  );
}

/* diagrama de nó quadrado — desenhado quando entra na tela */
function KnotDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden="true">
      <path className="draw-path" d="M20 40 C 70 10, 120 70, 200 42" fill="none" stroke="var(--color-clay)" strokeWidth="5" strokeLinecap="round" />
      <path className="draw-path" d="M20 105 C 90 130, 140 60, 200 100" fill="none" stroke="var(--color-moss)" strokeWidth="5" strokeLinecap="round" />
      <path className="draw-path" d="M85 20 C 80 70, 130 80, 125 132" fill="none" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 12" />
      <circle cx="108" cy="73" r="24" fill="none" stroke="var(--color-ocre)" strokeWidth="3" strokeDasharray="6 6" />
      <text x="150" y="142" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--color-bark)">
        nó quadrado — o começo de tudo
      </text>
    </svg>
  );
}

function HangCard({
  img,
  name,
  price,
  id,
  className,
  slow,
  tilt,
}: {
  img: string;
  name: string;
  price: number;
  id: string;
  className?: string;
  slow?: boolean;
  tilt: number;
}) {
  const addItem = useStore((s) => s.addItem);
  const setDrawer = useStore((s) => s.setDrawer);
  const p = products.find((x) => x.id === id)!;

  return (
    <button
      onClick={() => {
        addItem({
          key: p.id,
          name: p.name,
          price: p.price,
          img: p.img,
          meta: `${p.category} · ${p.size}`,
        });
        toast(`“${p.name}” foi pra sua sacola`);
        setDrawer(true);
      }}
      className={`group absolute ${slow ? "hang-slow" : "hang"} ${className ?? ""}`}
      style={{ rotate: `${tilt}deg` }}
      aria-label={`Adicionar ${name} à sacola`}
    >
      {/* prendedor de varal */}
      <svg viewBox="0 0 24 30" className="mx-auto -mb-1 h-7 w-6 text-bark" aria-hidden="true">
        <path d="M12 2v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M6 14h12l-1.6 13a1.8 1.8 0 0 1-3.5.2L12 18l-.9 9.2a1.8 1.8 0 0 1-3.5-.2L6 14Z" fill="var(--color-ocre)" stroke="var(--color-ink)" strokeWidth="1.4" />
      </svg>
      <span className="block w-28 border-2 border-ink bg-cream p-2 pb-3 shadow-[4px_6px_0_rgba(44,30,19,0.14)] transition-transform duration-300 group-hover:scale-105 sm:w-40 md:w-44">
        <span className="img-zoom block aspect-[4/5] overflow-hidden border border-ink/15 bg-sand">
          <img src={img} alt={name} loading="eager" className="h-full w-full object-cover" />
        </span>
        <span className="mt-2 flex items-end justify-between gap-2">
          <span className="text-left font-display text-sm font-bold leading-tight">{name}</span>
          <span className="font-mono text-[11px] font-semibold text-clay">{formatBRL(price)}</span>
        </span>
        <span className="mt-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-bark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <PlusIcon className="h-3 w-3" /> tocar p/ adicionar
        </span>
      </span>
    </button>
  );
}

export default function Hero() {
  const featured = [products[0], products[2], products[1], products[3]];

  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* mandala girando ao fundo */}
      <div className="pointer-events-none absolute -right-40 -top-40 hidden text-ink/[0.09] md:block">
        <Mandala className="h-[560px] w-[560px] animate-spin-slow" />
      </div>
      <div className="pointer-events-none absolute -left-24 top-[62%] hidden text-clay/[0.12] lg:block">
        <Mandala className="h-72 w-72 animate-spin-slow" />
      </div>

      <div className="weave relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 md:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* texto principal */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-5 inline-flex items-center gap-2 border-2 border-ink bg-cream px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                <span className="h-2 w-2 rotate-45 bg-clay" />
                atelier de macramê · florianópolis · desde 2011
              </p>
            </Reveal>

            <h1 className="font-display font-extrabold leading-[0.92] tracking-tight">
              <Reveal delay={80}>
                <span className="block text-[clamp(3rem,8.5vw,6.8rem)]">
                  Cada nó,
                </span>
              </Reveal>
              <Reveal delay={180}>
                <span className="outline-text block text-[clamp(3rem,8.5vw,6.8rem)]">
                  uma história
                </span>
              </Reveal>
              <Reveal delay={280}>
                <span className="block text-[clamp(3rem,8.5vw,6.8rem)]">
                  tecida à{" "}
                  <span className="relative inline-block text-clay">
                    mão.
                    <svg viewBox="0 0 120 14" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                      <path d="M3 9 C 30 3, 60 12, 117 5" fill="none" stroke="var(--color-ocre)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </Reveal>
            </h1>

            <Reveal delay={380}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-bark">
                Quadros, mandalas, porta-vasos e bolsas feitos devagar — fio de
                algodão orgânico, madeira de reaproveitamento e milhares de nós
                quadrados, um de cada vez.
              </p>
            </Reveal>

            <Reveal delay={470}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#pecas"
                  className="btn-knot inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-cream hover:text-ink"
                  style={{ "--fill": "var(--color-ocre)" } as React.CSSProperties}
                >
                  Ver o varal
                  <ArrowDownIcon className="h-4 w-4" />
                </a>
                <a
                  href="#sob-medida"
                  className="btn-knot inline-flex items-center gap-2 stitch bg-transparent px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-ink hover:text-cream"
                  style={{ "--fill": "var(--color-moss)" } as React.CSSProperties}
                >
                  Peça sob medida
                </a>
              </div>
            </Reveal>

            <Reveal delay={560}>
              <p className="mt-7 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bark">
                <span className="flex text-ocre">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </span>
                4,9 de avaliação · 1.240+ peças enviadas pelo Brasil
              </p>
            </Reveal>
          </div>

          {/* diagrama de nó */}
          <Reveal delay={300} className="hidden lg:col-span-5 lg:block" rot={3} rotFinal={0}>
            <div className="relative ml-auto mt-6 max-w-md border-2 border-ink bg-cream p-6 shadow-[8px_10px_0_rgba(44,30,19,0.12)]" style={{ rotate: "2deg" }}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bark">
                caderno da Mari — pág. 01
              </p>
              <KnotDiagram className="w-full" />
              <p className="mt-4 border-t border-dashed border-bark/40 pt-4 text-sm leading-relaxed text-bark">
                “Antes da primeira peça, foram 217 nós de treino. O macramê não
                aceita pressa — e é exatamente por isso que ele acalma.”
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-clay">
                — Mariana, fundadora
              </p>
            </div>
          </Reveal>
        </div>

        {/* varal de peças */}
        <div className="relative mt-10 h-[300px] sm:h-[330px] md:mt-14 md:h-[380px]">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute left-0 top-0 h-14 w-full text-ink" aria-hidden="true">
            <path d="M0 14 C 300 54, 900 54, 1200 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="10" cy="14" r="5" fill="var(--color-clay)" stroke="currentColor" strokeWidth="2" />
            <circle cx="1190" cy="12" r="5" fill="var(--color-clay)" stroke="currentColor" strokeWidth="2" />
          </svg>

          <HangCard
            {...{ img: featured[0].img, name: featured[0].name, price: featured[0].price, id: featured[0].id }}
            className="left-[2%] top-[7%] sm:left-[4%] md:top-[9%]"
            tilt={-4}
          />
          <HangCard
            {...{ img: featured[1].img, name: featured[1].name, price: featured[1].price, id: featured[1].id }}
            className="left-[26%] top-[16%] sm:left-[27%] md:top-[19%]"
            tilt={2}
            slow
          />
          <HangCard
            {...{ img: featured[2].img, name: featured[2].name, price: featured[2].price, id: featured[2].id }}
            className="left-[50%] top-[17%] sm:left-[52%] md:top-[20%]"
            tilt={-2}
          />
          <HangCard
            {...{ img: featured[3].img, name: featured[3].name, price: featured[3].price, id: featured[3].id }}
            className="left-[74%] top-[9%] sm:left-[75%] md:top-[11%]"
            tilt={4}
            slow
          />
        </div>

        {/* estatísticas do ofício */}
        <Reveal delay={150}>
          <div className="mt-6 grid grid-cols-2 gap-px border-2 border-ink bg-ink md:grid-cols-4">
            {[
              { n: "≈ 3.400", l: "nós num quadro grande" },
              { n: "120 m", l: "de fio por peça" },
              { n: "14 anos", l: "de tear e café" },
              { n: "100%", l: "algodão orgânico" },
            ].map((s) => (
              <div key={s.l} className="group bg-paper px-5 py-5 transition-colors duration-300 hover:bg-cream">
                <p className="font-display text-3xl font-extrabold tracking-tight text-clay transition-colors group-hover:text-clay-deep md:text-4xl">
                  {s.n}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-bark">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* letreiro */}
      <div className="relative mt-10 -rotate-1 border-y-2 border-ink bg-clay py-3 text-cream">
        <div className="marquee-track gap-0">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marqueeWords.map((w) => (
                <span key={`${copy}-${w}`} className="flex items-center whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.2em]">
                  <span className="px-6">{w}</span>
                  <span className="inline-block h-2 w-2 rotate-45 bg-cream" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
