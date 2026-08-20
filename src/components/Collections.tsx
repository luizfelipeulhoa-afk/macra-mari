import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useStore } from "../store/useStore";
import { scrollToId } from "../lib/scroll";
import { ArrowUpRight } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * Navegação secundária em linha do tempo: coluna esquerda fixa (sticky)
 * com os capítulos; os painéis rolam à direita e o capítulo ativo cresce,
 * revelando subcategorias que filtram a loja.
 */
export default function Collections() {
  const rootRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const motionOn = useStore((s) => s.motionOn);
  const setFilter = useStore((s) => s.setFilter);

  const countFor = (id: string) => PRODUCTS.filter((p) => p.category === id).length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!rootRef.current) return;

      // trilho de progresso da linha do tempo
      if (railRef.current && rightRef.current) {
        const fill = railRef.current.querySelector<HTMLSpanElement>("[data-fill]");
        ScrollTrigger.create({
          trigger: rightRef.current,
          start: "top 60%",
          end: "bottom 55%",
          onUpdate: (self) => {
            if (fill) fill.style.transform = `scaleY(${self.progress})`;
          },
        });
      }

      // detecção do capítulo ativo
      CATEGORIES.forEach((_, i) => {
        const panel = document.getElementById(`colecao-${CATEGORIES[i].id}`);
        if (!panel) return;
        ScrollTrigger.create({
          trigger: panel,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      if (motionOn) {
        gsap.utils.toArray<HTMLElement>("[data-col-panel]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-reveal]"), {
            y: 54,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 74%", once: true },
          });
          const img = panel.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: "none",
                scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
              }
            );
          }
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [motionOn]);

  return (
    <section ref={rootRef} id="colecoes" aria-labelledby="colecoes-titulo" className="relative bg-cream-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* coluna sticky: linha do tempo */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] font-bold tracking-[0.32em] text-olive-600 uppercase">Coleções</p>
            <h2 id="colecoes-titulo" className="font-display mt-4 text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.04] font-light text-bark-900">
              Uma linha do tempo
              <br />
              tecida <em className="text-olive-700 italic">capítulo a capítulo.</em>
            </h2>
            <p className="mt-5 max-w-sm text-walnut-600">
              Cinco famílias de peças, cada uma com seu ritmo de trama. Escolha um capítulo — a loja
              inteira se organiza em volta dele.
            </p>

            <nav aria-label="Capítulos das coleções" className="mt-10 flex gap-6">
              <div ref={railRef} aria-hidden="true" className="relative hidden w-px bg-walnut-600/15 sm:block">
                <span
                  data-fill
                  className="absolute inset-0 origin-top bg-olive-600 transition-transform duration-150 ease-out"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <ol className="space-y-1">
                {CATEGORIES.map((cat, i) => {
                  const isActive = active === i;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => scrollToId(`colecao-${cat.id}`)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group flex min-h-[52px] w-full items-baseline gap-4 text-left transition-all duration-400 ${
                          isActive ? "translate-x-2" : "opacity-70 hover:translate-x-1 hover:opacity-100"
                        }`}
                      >
                        <span className={`text-xs font-bold tracking-[0.2em] ${isActive ? "text-clay-500" : "text-walnut-500"}`}>
                          {cat.num}
                        </span>
                        <span
                          className={`font-display text-[26px] leading-tight transition-colors md:text-3xl ${
                            isActive ? "font-medium text-olive-700 italic" : "font-light text-walnut-700"
                          }`}
                        >
                          {cat.label}
                        </span>
                        <span className="text-[11px] font-semibold text-walnut-500">
                          {countFor(cat.id)} {countFor(cat.id) === 1 ? "peça" : "peças"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <p className="mt-10 hidden text-sm text-walnut-500 lg:block">
              Capítulo <strong className="font-display text-2xl text-bark-900">0{active + 1}</strong>
              <span className="mx-2 text-sand-400">/</span>05 — {CATEGORIES[active].label}
            </p>
          </div>

          {/* painéis que rolam */}
          <div ref={rightRef} className="space-y-24 lg:space-y-36">
            {CATEGORIES.map((cat, i) => (
              <article
                key={cat.id}
                id={`colecao-${cat.id}`}
                data-col-panel
                aria-labelledby={`colecao-titulo-${cat.id}`}
                className="relative scroll-mt-28 pt-8 lg:min-h-[72vh] lg:pt-0"
              >
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -top-14 -left-4 text-[8rem] leading-none font-light text-sand-200/80 select-none lg:-left-10 lg:text-[11rem]"
                >
                  {cat.num}
                </span>

                <div className="relative grid items-center gap-8 md:grid-cols-2">
                  <div data-reveal className="overflow-hidden rounded-lg shadow-[0_24px_60px_-24px_rgba(78,55,31,0.45)]">
                    <img
                      src={cat.image}
                      alt={cat.alt}
                      width={1024}
                      height={1280}
                      loading="lazy"
                      decoding="async"
                      className="h-[380px] w-full scale-110 object-cover md:h-[460px]"
                    />
                  </div>

                  <div>
                    <p data-reveal className="text-[11px] font-bold tracking-[0.3em] text-clay-500 uppercase">
                      Capítulo {cat.num}
                    </p>
                    <h3 data-reveal id={`colecao-titulo-${cat.id}`} className="font-display mt-3 text-4xl font-light text-bark-900 md:text-5xl">
                      {cat.label}
                    </h3>
                    <p data-reveal className="mt-4 leading-relaxed text-walnut-600">
                      {cat.description}
                    </p>

                    <div data-reveal className="mt-6 flex flex-wrap gap-2.5">
                      {cat.subs.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setFilter(cat.id);
                            scrollToId("loja");
                          }}
                          className="h-12 rounded-full border border-walnut-600/25 bg-white/40 px-5 text-sm font-semibold text-walnut-600 backdrop-blur-sm transition-all duration-300 hover:border-olive-600 hover:bg-olive-600 hover:text-cream-50"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>

                    <button
                      data-reveal
                      type="button"
                      onClick={() => {
                        setFilter(cat.id);
                        scrollToId("loja");
                      }}
                      className="group mt-7 inline-flex min-h-[48px] items-center gap-2 text-sm font-bold tracking-wide text-olive-700 uppercase"
                    >
                      Ver {cat.label.toLowerCase()} na loja
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
