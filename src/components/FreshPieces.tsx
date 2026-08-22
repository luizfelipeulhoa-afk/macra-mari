import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatBRL } from "../data/atelier";
import { prefersReducedMotion } from "../lib/motion";
import SmartImg from "./SmartImg";
import MaskTitle from "./MaskTitle";
import Reveal from "./Reveal";
import { BagIcon, ScissorsIcon } from "./Icons";
import { useStore, toast } from "../store/useStore";

gsap.registerPlugin(ScrollTrigger);

/* As 4 peças que acabaram de sair do tear — um varal horizontal que
   desliza sozinho e responde ao cursor com balanço físico. */
export default function FreshPieces() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const addItem = useStore((s) => s.addItem);
  const setDrawer = useStore((s) => s.setDrawer);

  /* as 4 peças mais novas do catálogo real */
  const fresh = products.slice(-4);

  const grab = (i: number) => {
    const p = fresh[i];
    addItem({
      key: p.id,
      name: p.name,
      price: p.price,
      img: p.img,
      meta: `${p.category} · ${p.size}`,
    });
    toast(`“${p.name}” foi pra sua sacola`);
    setDrawer(true);
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      /* balanço contínuo de cada peça, dessincronizado */
      gsap.utils.toArray<HTMLElement>(".fp-hang").forEach((el, i) => {
        gsap.to(el, {
          rotate: i % 2 ? 2.4 : -2.4,
          duration: 2.6 + (i % 3) * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          transformOrigin: "50% -20px",
          delay: i * 0.35,
        });
      });

      /* deriva lenta do varal inteiro — respira com o scroll */
      gsap.to(".fp-track", {
        xPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: "#novidades",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      /* cada peça entra subindo, como se fosse pendurada */
      gsap.from(".fp-card", {
        y: 90,
        opacity: 0,
        rotate: 6,
        duration: 0.9,
        ease: "back.out(1.5)",
        stagger: 0.14,
        scrollTrigger: { trigger: "#novidades", start: "top 78%", once: true },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="novidades" className="relative overflow-hidden bg-moss-deep py-20 text-cream">
      {/* fios de fundo correndo na diagonal */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-cream/[0.05]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={i * 13 - 6} y1="110" x2={i * 13 + 18} y2="-10" stroke="currentColor" strokeWidth="0.4" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Reveal>
              <p className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-ocre">
                <ScissorsIcon className="h-4 w-4" /> ainda quentes do tear
              </p>
              <MaskTitle
                lines={[
                  { text: "Recém-saídas" },
                  { text: "do tear", className: "outline-text-cream" },
                ]}
                className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight"
              />
            </Reveal>
          </div>
          <Reveal delay={150}>
            <p className="max-w-xs text-[15px] leading-relaxed text-cream/70">
              Quatro peças que a Mariana pendurou essa semana. Quando uma sai do
              varal, não volta — cada uma é única.
            </p>
          </Reveal>
        </div>
      </div>

      {/* varal horizontal */}
      <div className="relative mt-14 overflow-hidden">
        {/* corda */}
        <svg
          className="pointer-events-none absolute left-0 top-2 z-10 h-6 w-[140%] text-ocre"
          preserveAspectRatio="none"
          viewBox="0 0 1400 24"
          aria-hidden="true"
        >
          <path d="M0 6 C 350 20, 1050 20, 1400 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div ref={trackRef} className="fp-track flex w-max gap-10 px-[8vw] pb-6 pt-10">
          {fresh.map((p, i) => (
            <button
              key={p.id}
              onClick={() => grab(i)}
              className="fp-hang group relative block w-[240px] shrink-0 text-left sm:w-[300px]"
              aria-label={`Adicionar ${p.name} à sacola`}
            >
              {/* prendedor */}
              <span className="relative z-20 -mb-2 block h-7 w-5">
                <span className="absolute left-1/2 top-0 h-4 w-1 -translate-x-1/2 rounded-full bg-ocre" />
                <span className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rotate-45 border-2 border-ink bg-clay" />
              </span>

              <span className="fp-card breathe img-zoom group relative block overflow-hidden border-2 border-cream/90 bg-cream shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <span className="block aspect-[4/5] overflow-hidden">
                  <SmartImg
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </span>

                {/* selo */}
                <span className="absolute left-3 top-3 rotate-[-6deg] border-2 border-ink bg-ocre px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink shadow-[3px_3px_0_rgba(44,30,19,0.25)]">
                  recém tecida
                </span>

                {/* legenda que sobe no hover */}
                <span className="absolute inset-x-0 bottom-0 translate-y-full border-t-2 border-ink bg-ink/95 px-4 py-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-bold text-cream">{p.name}</span>
                    <span className="font-mono text-sm font-semibold text-ocre">
                      {formatBRL(p.price)}
                    </span>
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-cream/70">
                    <BagIcon className="h-3.5 w-3.5" /> tocar p/ guardar
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        <Reveal delay={100}>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream/45">
            ✳ o varal anda sozinho — acompanhe o balanço ✳
          </p>
        </Reveal>
      </div>
    </section>
  );
}
