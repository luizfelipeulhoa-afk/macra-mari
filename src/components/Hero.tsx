import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroCanvas from "../three/HeroCanvas";
import { useStore } from "../store/useStore";
import { scrollToId } from "../lib/scroll";
import { ArrowRight, KnotMark } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_WORDS = [
  "Quadros",
  "Mandalas",
  "Porta-vasos",
  "Bolsas",
  "Porta-copos",
  "Feito à mão",
  "Fibras naturais",
  "Peça única",
];

function MarqueeRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MARQUEE_WORDS.map((word) => (
        <span key={word} className="flex items-center">
          <span className="font-display px-6 text-xl font-light text-cream-100 italic md:text-2xl">{word}</span>
          <KnotMark className="h-4 w-4 text-clay-400" />
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const motionOn = useStore((s) => s.motionOn);

  // o conteúdo do hero se dissolve enquanto a câmera mergulha na mandala
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (motionOn && contentRef.current && sectionRef.current) {
        gsap.to(contentRef.current, {
          yPercent: -16,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "62% top", scrub: true },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [motionOn]);

  return (
    <>
      <section
        ref={sectionRef}
        id="inicio"
        aria-label="Apresentação da Macra Mari"
        className="texture-weave relative h-[100svh] min-h-[640px] overflow-hidden bg-cream-50"
      >
        <HeroCanvas motionOn={motionOn} triggerRef={sectionRef} />

        {/* anel decorativo girando atrás da cena */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="animate-spin-slower pointer-events-none absolute top-1/2 right-[-120px] hidden h-[560px] w-[560px] -translate-y-1/2 text-sand-300/60 lg:block"
        >
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 7" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1 9" />
        </svg>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 md:px-8">
          <div ref={contentRef} className="max-w-2xl pt-16">
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.32em] text-olive-600 uppercase">
              <KnotMark className="h-5 w-5" />
              Macramê autoral · desde 2013
            </p>
            <h1 className="font-display mt-6 text-[clamp(2.9rem,7.5vw,6.3rem)] leading-[0.98] font-light tracking-tight text-bark-900">
              Cada nó
              <br />
              guarda uma
              <br />
              <em className="font-normal text-olive-700 italic">história.</em>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-walnut-600">
              Quadros, mandalas, porta-vasos e bolsas tecidos à mão com algodão reciclado — decoração
              boho-chic que chega na sua casa ainda com cheiro de atelier.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => scrollToId("loja")}
                className="group inline-flex h-13 min-h-[52px] items-center gap-3 rounded-full bg-bark-900 px-8 text-sm font-bold tracking-wide text-cream-50 uppercase transition-colors duration-300 hover:bg-olive-700"
              >
                Explorar a loja
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId("atelier")}
                className="inline-flex min-h-[52px] items-center text-sm font-bold tracking-wide text-walnut-700 uppercase underline decoration-clay-400 decoration-2 underline-offset-8 transition-colors hover:text-olive-700 hover:decoration-olive-600"
              >
                Nossa história
              </button>
            </div>

            <dl className="mt-14 flex max-w-md flex-wrap gap-x-10 gap-y-4 border-t border-walnut-600/15 pt-6">
              {[
                ["Peça única", "numerada à mão"],
                ["Fibras 100% naturais", "algodão reciclado"],
                ["Envio p/ todo Brasil", "sem plástico"],
              ].map(([strong, sub]) => (
                <div key={strong}>
                  <dt className="sr-only">{strong}</dt>
                  <dd>
                    <span className="font-display block text-lg font-medium text-bark-900">{strong}</span>
                    <span className="text-[11px] font-semibold tracking-[0.16em] text-walnut-500 uppercase">{sub}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="absolute right-7 bottom-28 z-10 hidden text-[10px] font-bold tracking-[0.4em] text-walnut-500 uppercase [writing-mode:vertical-rl] lg:block"
        >
          feito à mão — tiradentes, mg
        </p>

        <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex">
          <span className="relative block h-12 w-7 overflow-hidden rounded-full border-2 border-walnut-600/40">
            <span className="animate-cue absolute inset-x-0 top-0 h-full w-0.5 mx-auto bg-olive-600" />
          </span>
          <span className="text-[10px] font-bold tracking-[0.3em] text-walnut-500 uppercase">
            role para entrar na trama
          </span>
        </div>
      </section>

      {/* letreiro contínuo */}
      <div role="marquee" aria-label="Categorias da Macra Mari" className="overflow-hidden border-y border-bark-800 bg-bark-950 py-4">
        <div className="animate-marquee flex w-max">
          <MarqueeRow />
          <MarqueeRow hidden />
        </div>
      </div>
    </>
  );
}
