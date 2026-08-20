import { lazy, Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, marqueeWords, formatBRL } from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import { prefersReducedMotion, useFineMotion } from "../lib/motion";
import SmartImg from "./SmartImg";
import { ArrowDownIcon, PlusIcon, StarIcon } from "./Icons";

/* Three.js entra como chunk separado: só baixa quando a peça 3D vai renderizar */
const Mandala3D = lazy(() => import("../three/Mandala3D"));

gsap.registerPlugin(ScrollTrigger);

/* fallback 2D da mandala (mobile / movimento reduzido) */
function MandalaSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 10" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="200" cy="200" r="96" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 7" />
      <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="2.5" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path
          key={i}
          d="M200 50 C 216 92, 216 122, 200 150 C 184 122, 184 92, 200 50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform={`rotate(${i * 30} 200 200)`}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={`d${i}`} cx="200" cy="66" r="4" fill="currentColor" transform={`rotate(${i * 30 + 15} 200 200)`} />
      ))}
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
      className={`hang-card group absolute ${slow ? "hang-slow" : "hang"} ${className ?? ""}`}
      style={{ rotate: `${tilt}deg` }}
      aria-label={`Adicionar ${name} à sacola`}
    >
      <svg viewBox="0 0 24 30" className="mx-auto -mb-1 h-7 w-6 text-bark" aria-hidden="true">
        <path d="M12 2v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M6 14h12l-1.6 13a1.8 1.8 0 0 1-3.5.2L12 18l-.9 9.2a1.8 1.8 0 0 1-3.5-.2L6 14Z"
          fill="var(--color-ocre)"
          stroke="var(--color-ink)"
          strokeWidth="1.4"
        />
      </svg>
      <span className="block w-28 border-2 border-ink bg-cream p-2 pb-3 shadow-[4px_6px_0_rgba(44,30,19,0.14)] transition-transform duration-300 group-hover:scale-105 sm:w-40 md:w-44">
        <span className="img-zoom block aspect-[4/5] overflow-hidden border border-ink/15 bg-sand">
          <SmartImg src={img} alt={name} loading="eager" className="h-full w-full object-cover" />
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
  const fineMotion = useFineMotion();
  const scopeRef = useRef<HTMLElement | null>(null);

  /* timeline de entrada + parallax de saída: o scroll já começa narrando */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".hline-inner", {
        yPercent: 118,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.09,
        delay: 0.15,
      });
      gsap.from(".hero-fade", {
        opacity: 0,
        y: 26,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.55,
      });
      /* as peças despencam na corda e balançam até assentar */
      gsap.from(".hang-card", {
        y: -140,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.6)",
        stagger: 0.13,
        delay: 0.8,
      });
      gsap.to(".hero-mandala", {
        yPercent: 14,
        rotate: 3,
        ease: "none",
        scrollTrigger: {
          trigger: "#inicio",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-copy", {
        yPercent: -8,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: "#inicio",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* os números do ofício se tecem ao entrar na tela */
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const prefix = el.dataset.prefix ?? "";
        const suffix = el.dataset.suffix ?? "";
        const fmt = (v: number) =>
          `${prefix}${Math.round(v).toLocaleString("pt-BR")}${suffix}`;
        el.textContent = fmt(0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = fmt(obj.v);
          },
        });
      });
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={scopeRef} className="relative overflow-hidden">
      <div className="weave relative mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* texto — linhas mascaradas que sobem como fios */}
          <div className="hero-copy lg:col-span-7">
            <div className="hero-fade">
              <p className="mb-5 inline-flex items-center gap-2 border-2 border-ink bg-cream px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                <span className="h-2 w-2 rotate-45 bg-clay" />
                ateliê de macramê · goiânia · por Mariana Ulhoa
              </p>
            </div>

            <h1 className="font-display font-extrabold leading-[0.92] tracking-tight">
              <span className="hline text-[clamp(2.9rem,8.5vw,6.8rem)]">
                <span className="hline-inner">Cada nó,</span>
              </span>
              <span className="hline text-[clamp(2.9rem,8.5vw,6.8rem)]">
                <span className="hline-inner outline-text">uma história</span>
              </span>
              <span className="hline text-[clamp(2.9rem,8.5vw,6.8rem)]">
                <span className="hline-inner">
                  tecida à{" "}
                  <span className="relative inline-block text-clay">
                    mão.
                    <svg viewBox="0 0 120 14" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                      <path d="M3 9 C 30 3, 60 12, 117 5" fill="none" stroke="var(--color-ocre)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </h1>

            <div className="hero-fade">
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-bark">
                Quadros, mandalas, porta-vasos e bolsas feitos devagar — fio de
                algodão orgânico, madeira de reaproveitamento e milhares de nós
                quadrados, um de cada vez.
              </p>
            </div>

            <div className="hero-fade mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#pecas"
                data-magnetic
                className="btn-knot inline-flex items-center gap-2 border-2 border-ink bg-ink px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-cream hover:text-ink"
                style={{ "--fill": "var(--color-ocre)" } as React.CSSProperties}
              >
                Ver o varal
                <ArrowDownIcon className="h-4 w-4" />
              </a>
              <a
                href="#sob-medida"
                data-magnetic
                className="btn-knot inline-flex items-center gap-2 stitch bg-transparent px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-ink hover:text-cream"
                style={{ "--fill": "var(--color-moss)" } as React.CSSProperties}
              >
                Peça sob medida
              </a>
            </div>

            <div className="hero-fade">
              <p className="mt-7 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bark">
                <span className="flex text-ocre">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </span>
                4,9 de avaliação · 100+ clientes pelo Brasil
              </p>
            </div>
          </div>

          {/* a peça-em-3D: Mandala Solar reproduzida em Three.js */}
          <div className="hero-mandala lg:col-span-5">
            <div
              className="relative border-2 border-ink bg-cream/70 p-3 shadow-[10px_12px_0_rgba(44,30,19,0.14)]"
              style={{ rotate: "1.6deg" }}
            >
              <div className="flex items-center justify-between border-b-2 border-dashed border-bark/40 px-2 pb-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bark">
                  exposição viva · mandala solar
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-moss">
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-moss" />
                  {fineMotion ? "3d ativo" : "modo 2d"}
                </span>
              </div>

              {fineMotion ? (
                <Suspense
                  fallback={
                    <div className="grid aspect-[4/5] w-full place-items-center text-clay">
                      <MandalaSVG className="h-[82%] w-[82%] animate-spin-slow" />
                    </div>
                  }
                >
                  <Mandala3D className="aspect-[4/5] w-full" />
                </Suspense>
              ) : (
                <div className="grid aspect-[4/5] w-full place-items-center text-clay">
                  <MandalaSVG className="h-[82%] w-[82%] animate-spin-slow" />
                </div>
              )}

              {/* etiquetas flutuantes */}
              <span className="absolute -left-4 top-[30%] hidden animate-bob border-2 border-ink bg-ocre px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink shadow-[3px_4px_0_rgba(44,30,19,0.18)] sm:block">
                nó nº 3.412
              </span>
              <span
                className="absolute -right-3 bottom-[26%] hidden animate-bob border-2 border-ink bg-moss px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-cream shadow-[3px_4px_0_rgba(44,30,19,0.18)] sm:block"
                style={{ animationDelay: "1.2s" }}
              >
                fio: algodão 3 mm
              </span>

              <p className="border-t-2 border-dashed border-bark/40 px-2 pb-1 pt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-bark">
                {fineMotion
                  ? "mova o cursor · role para girar a peça"
                  : "mandala solar · série terral nº 01"}
              </p>
            </div>
          </div>
        </div>

        {/* varal de peças */}
        <div className="relative mt-12 h-[300px] sm:h-[330px] md:mt-16 md:h-[380px]">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute left-0 top-0 h-14 w-full text-ink" aria-hidden="true">
            <path d="M0 14 C 300 54, 900 54, 1200 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="10" cy="14" r="5" fill="var(--color-clay)" stroke="currentColor" strokeWidth="2" />
            <circle cx="1190" cy="12" r="5" fill="var(--color-clay)" stroke="currentColor" strokeWidth="2" />
          </svg>

          <div className="hang-wrap absolute inset-0">
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
        </div>

        {/* estatísticas do ofício */}
        <div className="hero-fade mt-6 grid grid-cols-2 gap-px border-2 border-ink bg-ink md:grid-cols-4">
          {[
            { t: 3400, pre: "≈ ", suf: "", l: "nós num quadro grande" },
            { t: 120, pre: "", suf: " m", l: "de fio por peça" },
            { t: 3, pre: "", suf: " anos", l: "de ateliê e café" },
            { t: 100, pre: "", suf: "+", l: "clientes felizes" },
          ].map((s) => (
            <div key={s.l} className="group bg-paper px-5 py-5 transition-colors duration-300 hover:bg-cream">
              <p className="font-display text-3xl font-extrabold tracking-tight text-clay transition-colors group-hover:text-clay-deep md:text-4xl">
                <span
                  className="stat-num"
                  data-target={s.t}
                  data-prefix={s.pre}
                  data-suffix={s.suf}
                >
                  {s.pre}
                  {s.t.toLocaleString("pt-BR")}
                  {s.suf}
                </span>
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-bark">{s.l}</p>
            </div>
          ))}
        </div>
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
