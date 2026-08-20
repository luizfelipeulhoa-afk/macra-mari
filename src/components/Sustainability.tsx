import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MATERIAL_VALUES, PROCESS_STEPS } from "../data/products";
import { useStore } from "../store/useStore";
import { CottonIcon, DyeIcon, KnotMark, LeafIcon, ParcelIcon, WoodIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  cotton: CottonIcon,
  dye: DyeIcon,
  wood: WoodIcon,
  parcel: ParcelIcon,
} as const;

export default function Sustainability() {
  const rootRef = useRef<HTMLElement>(null);
  const motionOn = useStore((s) => s.motionOn);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!motionOn || !rootRef.current) return;
      gsap.from("[data-sus-row]", {
        x: -40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 68%", once: true },
      });
      gsap.from("[data-sus-step]", {
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-sus-steps]", start: "top 85%", once: true },
      });
      gsap.fromTo(
        "[data-sus-badge]",
        { rotate: 0 },
        {
          rotate: 360,
          duration: 26,
          repeat: -1,
          ease: "none",
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [motionOn]);

  return (
    <section
      ref={rootRef}
      id="sustentabilidade"
      aria-labelledby="sus-titulo"
      className="texture-weave-dark relative bg-olive-800 py-24 text-cream-100 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.32em] text-olive-300 uppercase">
              <LeafIcon className="h-5 w-5" />
              Sustentabilidade
            </p>
            <h2 id="sus-titulo" className="font-display mt-4 text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.04] font-light text-cream-50">
              Devagar, como
              <br />
              a natureza <em className="text-sand-300 italic">faz.</em>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-cream-100/75">
              Macramê já nasceu sustentável: é só fio, nó e tempo. A gente cuida para continuar assim
              — da origem do algodão ao carimbo da caixa que chega na sua porta.
            </p>

            <ul className="mt-10 divide-y divide-cream-50/10 border-t border-cream-50/10">
              {MATERIAL_VALUES.map((mv) => {
                const Icon = ICONS[mv.icon];
                return (
                  <li key={mv.title} data-sus-row className="flex gap-5 py-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream-50/25 text-olive-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-medium text-cream-50">{mv.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-cream-100/70">{mv.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* selo giratório + números */}
          <div className="flex flex-col items-center justify-center gap-12">
            <div className="relative h-56 w-56">
              <svg data-sus-badge viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                <defs>
                  <path id="selo-circulo" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
                </defs>
                <text className="fill-cream-100" style={{ fontSize: 12.5, letterSpacing: 3.2, fontWeight: 700 }}>
                  <textPath href="#selo-circulo">
                    FEITO COM RESPEITO · FEITO PARA DURAR · FEITO À MÃO ·
                  </textPath>
                </text>
              </svg>
              <KnotMark className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-sand-300" />
            </div>

            <dl className="w-full max-w-sm space-y-5">
              {[
                ["100%", "fibras naturais e recicladas"],
                ["0", "plástico em toda a cadeia"],
                ["72h", "de tingimento em cada banho natural"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-6 border-b border-cream-50/10 pb-4"
                >
                  <dt className="order-2 text-right text-sm font-semibold text-cream-100/70">{label}</dt>
                  <dd className="font-display order-1 text-5xl font-light text-sand-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* processo */}
        <div data-sus-steps className="mt-24 border-t border-cream-50/10 pt-14">
          <h3 className="font-display text-2xl font-light text-cream-50 md:text-3xl">
            Do fio ao nó, <em className="text-sand-300 italic">em quatro gestos.</em>
          </h3>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.title} data-sus-step className="relative border-t border-dashed border-cream-50/25 pt-6">
                <span aria-hidden="true" className="font-display absolute -top-5 left-0 bg-olive-800 pr-3 text-4xl font-light text-olive-300/70">
                  {i + 1}
                </span>
                <h4 className="text-lg font-bold text-cream-50">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-cream-100/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
