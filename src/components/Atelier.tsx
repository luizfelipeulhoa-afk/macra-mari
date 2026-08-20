import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG, TESTIMONIALS } from "../data/products";
import { useStore } from "../store/useStore";
import { HandHeartIcon, KnotMark, StarIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const STATS: Array<{ value: number; suffix: string; label: string }> = [
  { value: 12, suffix: " anos", label: "de ofício diário" },
  { value: 4800, suffix: "+", label: "peças tecidas e numeradas" },
  { value: 32, suffix: " km", label: "de fio por mês, reciclado" },
];

export default function Atelier() {
  const rootRef = useRef<HTMLElement>(null);
  const motionOn = useStore((s) => s.motionOn);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!rootRef.current) return;

      // contadores
      rootRef.current.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        const render = (v: number) => {
          el.textContent = Math.round(v).toLocaleString("pt-BR");
        };
        if (motionOn) {
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => render(proxy.v),
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        } else {
          render(target);
        }
      });

      if (motionOn) {
        gsap.fromTo(
          "[data-atelier-main]",
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
        gsap.from("[data-reveal-a]", {
          y: 48,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true },
        });
        gsap.from("[data-testimonial]", {
          y: 44,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-testimonial-grid]", start: "top 82%", once: true },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [motionOn]);

  return (
    <section ref={rootRef} id="atelier" aria-labelledby="atelier-titulo" className="relative overflow-hidden bg-cream-50 py-24 lg:py-36">
      <KnotMark
        aria-hidden="true"
        className="animate-spin-slower pointer-events-none absolute -top-16 left-[-70px] h-64 w-64 text-sand-200"
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* colagem de imagens */}
          <div className="relative lg:col-span-6">
            <div data-reveal-a className="overflow-hidden rounded-lg shadow-[0_30px_70px_-28px_rgba(78,55,31,0.5)]">
              <img
                data-atelier-main
                src={IMG.atelier}
                alt="Mãos de artesã tecendo nós de macramê sobre mesa de madeira, com cordões de algodão cru ao redor"
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full scale-110 object-cover"
              />
            </div>
            <div data-reveal-a className="absolute -bottom-12 -right-4 hidden w-[46%] rotate-3 overflow-hidden rounded-lg border-8 border-cream-50 shadow-2xl sm:block">
              <img
                src={IMG.materiais}
                alt="Novelos de algodão reciclado, contas de madeira e tintura natural de plantas sobre linho"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>

          {/* narrativa */}
          <div className="lg:col-span-6 lg:pl-8">
            <p data-reveal-a className="text-[11px] font-bold tracking-[0.32em] text-olive-600 uppercase">O atelier</p>
            <h2 id="atelier-titulo" data-reveal-a className="font-display mt-4 text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.04] font-light text-bark-900">
              Mãos que transformam
              <br />
              fio em <em className="text-olive-700 italic">memória.</em>
            </h2>
            <p data-reveal-a className="mt-6 max-w-xl leading-relaxed text-walnut-600">
              A Macra Mari nasceu numa varanda em Tiradentes, com dois novelos herdados da avó de Mari
              e uma parede vazia. Doze anos depois, o atelier continua do mesmo tamanho — porque o
              luxo aqui nunca foi produzir muito, e sim produzir com tempo.
            </p>
            <p data-reveal-a className="mt-4 max-w-xl leading-relaxed text-walnut-600">
              Cada peça sai com etiqueta numerada à mão e uma carta contando quantas horas de nó ela
              carrega. Se um dia ela voltar para um conserto — e algumas voltam, dez anos depois —, a
              gente reata a trama e a história.
            </p>

            <blockquote data-reveal-a className="mt-9 max-w-xl border-l-2 border-clay-500 pl-6">
              <p className="font-display text-2xl leading-snug font-light text-bark-800 italic">
                “Eu não teço decoração. Eu teço o tempo que a gente não tem mais — e penduro na parede.”
              </p>
              <footer className="mt-5 flex items-center gap-4">
                <img
                  src={IMG.fundadora}
                  alt="Retrato de Mariana Alves, fundadora da Macra Mari, sorrindo em seu atelier"
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-full border-2 border-sand-300 object-cover"
                />
                <div>
                  <cite className="text-sm font-bold text-bark-900 not-italic">Mariana Alves</cite>
                  <span className="block text-xs tracking-wide text-walnut-500 uppercase">fundadora & única tecelã</span>
                </div>
              </footer>
            </blockquote>

            <dl data-reveal-a className="mt-12 grid grid-cols-3 gap-6 border-t border-walnut-600/15 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 mt-2 text-[11px] leading-snug font-semibold tracking-[0.14em] text-walnut-500 uppercase">
                    {stat.label}
                  </dt>
                  <dd className="font-display order-1 text-4xl font-light text-bark-900 md:text-5xl">
                    <span data-count={stat.value}>0</span>
                    <span className="text-clay-500">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* depoimentos */}
        <div className="mt-28 lg:mt-36">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.32em] text-olive-600 uppercase">Cartas de volta</p>
              <h3 className="font-display mt-3 text-3xl font-light text-bark-900 md:text-4xl">
                Quem já levou um nó <em className="text-olive-700 italic">para casa.</em>
              </h3>
            </div>
            <p className="flex items-center gap-2 text-sm font-semibold text-walnut-500">
              <HandHeartIcon className="h-5 w-5 text-clay-500" /> 4,9 de 5 · 312 avaliações
            </p>
          </div>

          <div data-testimonial-grid className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                data-testimonial
                className={`rounded-lg border border-walnut-600/10 bg-white/50 p-7 backdrop-blur-sm ${
                  i === 1 ? "md:translate-y-10" : i === 2 ? "md:translate-y-4" : ""
                }`}
              >
                <div className="flex gap-1 text-clay-400" aria-label="Avaliação: 5 de 5 estrelas">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4">
                  <p className="font-display text-xl leading-snug font-light text-bark-800 italic">
                    “{t.quote}”
                  </p>
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <strong className="text-bark-900">{t.name}</strong>
                  <span className="block text-walnut-500">
                    {t.place} · comprou <em className="font-display italic">{t.product}</em>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
