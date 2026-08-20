import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";
import MaskTitle from "./MaskTitle";
import Reveal from "./Reveal";
import { ScissorsIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

/* geometria da peça que se constrói */
const CORD_XS = Array.from({ length: 11 }, (_, i) => 110 + i * 30);
const ROWS = [
  { y: 168, xs: [125, 185, 245, 305, 365], color: "var(--color-clay)" },
  { y: 238, xs: [155, 215, 275, 335, 395], color: "var(--color-ocre)" },
  { y: 308, xs: [125, 185, 245, 305, 365], color: "var(--color-clay)" },
  { y: 378, xs: [155, 215, 275, 335, 395], color: "var(--color-moss)" },
];
const knotPath = (x: number, y: number) =>
  `M ${x - 14} ${y} Q ${x} ${y - 17} ${x + 14} ${y} M ${x - 14} ${y} Q ${x} ${y + 17} ${x + 14} ${y}`;
const fringeY2 = (i: number) => 500 + ((i * 37) % 46) - 23;

const captions = [
  {
    n: "01",
    title: "A cabeça de cotovia",
    text: "Tudo começa pendurando a vara: cada fio dá uma laçada e se prende com o mesmo nó de sempre — a cabeça de cotovia.",
  },
  {
    n: "02",
    title: "Os fios de trabalho",
    text: "Algodão cru cortado no dobro do tamanho. Metade do fio vira nó; a outra metade vira franja.",
  },
  {
    n: "03",
    title: "Os nós, um a um",
    text: "Nó quadrado em cima, meio-nó embaixo, carreira por carreira. É daqui que nasce o desenho — sem molde, só memória de mão.",
  },
  {
    n: "04",
    title: "Pentear & cortar",
    text: "A franja é penteada até abrir, aparada na régua e a peça sai do tear, pronta pra sua parede.",
  },
];

/* A peça nascendo: o scroll amarra a peça etapa por etapa —
   a vara, os fios, as carreiras de nós, o pente e a tesoura. */
export default function MacrameBuild() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const caps = gsap.utils.toArray<HTMLElement>(".mb-cap");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=2600",
          scrub: 0.6,
          pin: true,
        },
      });

      /* 01 — pendurar a vara */
      tl.from(".mb-hang", { strokeDashoffset: 1, duration: 0.65, stagger: 0.12 }, 0);
      tl.from(".mb-apex", { scale: 0, transformOrigin: "50% 50%", duration: 0.3 }, 0.05);
      tl.from(".mb-dowel", { scaleX: 0, transformOrigin: "50% 50%", duration: 0.5 }, 0.3);

      /* 02 — fios de trabalho descem */
      tl.from(".mb-cord", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.5, stagger: 0.05 }, 1.0);

      /* 03 — carreiras de nós se amarram */
      ROWS.forEach((_, r) => {
        const t = 1.95 + r * 0.66;
        tl.from(`.mb-knot-${r}`, { strokeDashoffset: 1, duration: 0.42, stagger: 0.085 }, t);
        /* puxadinha de tensão ao fechar a carreira */
        tl.fromTo(".mb-piece", { y: 0 }, { y: 3.5, duration: 0.09, yoyo: true, repeat: 1 }, t + 0.46);
      });

      /* 04 — franja cresce, pente passa, tesoura apara */
      tl.from(".mb-fringe", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.45, stagger: 0.035 }, 4.7);
      tl.fromTo(".mb-comb", { x: -150 }, { x: 560, duration: 0.95, ease: "none" }, 5.25);
      tl.fromTo(".mb-cut", { x: -130 }, { x: 610, duration: 0.75, ease: "none" }, 5.6);
      tl.to(".mb-fringe", { attr: { y2: 508 }, duration: 0.3, stagger: 0.02 }, 5.95);
      tl.from(".mb-stamp", { autoAlpha: 0, scale: 0.3, rotate: -26, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2)" }, 6.3);

      /* legendas sincronizadas */
      tl.from(caps[0], { autoAlpha: 0, y: 36, duration: 0.3 }, 0.05);
      tl.to(caps[0], { autoAlpha: 0, y: -30, duration: 0.25 }, 0.9);
      tl.from(caps[1], { autoAlpha: 0, y: 36, duration: 0.3 }, 1.05);
      tl.to(caps[1], { autoAlpha: 0, y: -30, duration: 0.25 }, 1.8);
      tl.from(caps[2], { autoAlpha: 0, y: 36, duration: 0.3 }, 1.95);
      tl.to(caps[2], { autoAlpha: 0, y: -30, duration: 0.25 }, 4.55);
      tl.from(caps[3], { autoAlpha: 0, y: 36, duration: 0.3 }, 4.7);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="processo" className="relative overflow-x-clip border-b-2 border-ink bg-husk/40">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.24em] text-clay">
              ✳ do fio à peça — role para amarrar
            </p>
            <MaskTitle
              lines={[
                { text: "Como uma peça" },
                { text: "nasce no tear", className: "outline-text" },
              ]}
              className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight"
            />
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-sm text-[15px] leading-relaxed text-bark">
              O macramê não se imprime, não se molda, não se cola. Ele se{" "}
              <strong className="text-clay">amarra</strong> — e é exatamente isso
              que o seu scroll faz aqui embaixo.
            </p>
          </Reveal>
        </div>
      </div>

      {/* cena pinada: o scroll constrói a peça */}
      <div ref={rootRef} className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:min-h-screen md:grid-cols-2 md:py-10">
        <div className="relative mx-auto w-full max-w-[480px] border-2 border-ink bg-cream p-4 shadow-[10px_12px_0_rgba(44,30,19,0.14)]" style={{ rotate: "-1.2deg" }}>
          <div className="flex items-center justify-between border-b-2 border-dashed border-bark/40 px-1 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bark">
              bancada da Mari · peça nº 104
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-clay">ao vivo</span>
          </div>

          <svg viewBox="0 0 520 620" className="w-full" role="img" aria-label="Peça de macramê sendo construída: vara, fios, nós e franjas">
            <g className="mb-piece">
              {/* cordão de pendurar */}
              <path className="mb-hang" d="M260 26 L122 94" pathLength={1} strokeDasharray="1" fill="none" stroke="#8a5a33" strokeWidth="3.5" strokeLinecap="round" />
              <path className="mb-hang" d="M260 26 L398 94" pathLength={1} strokeDasharray="1" fill="none" stroke="#8a5a33" strokeWidth="3.5" strokeLinecap="round" />
              <circle className="mb-apex" cx="260" cy="24" r="6" fill="var(--color-clay)" stroke="var(--color-ink)" strokeWidth="1.5" />

              {/* vara */}
              <line className="mb-dowel" x1="84" y1="96" x2="436" y2="96" stroke="#8a5a33" strokeWidth="9" strokeLinecap="round" />

              {/* fios de trabalho */}
              {CORD_XS.map((x) => (
                <line key={`c${x}`} className="mb-cord" x1={x} y1="96" x2={x} y2="380" stroke="#efe3c8" strokeWidth="3" />
              ))}

              {/* carreiras de nós */}
              {ROWS.map((row, r) =>
                row.xs.map((x) => (
                  <path
                    key={`k${r}-${x}`}
                    className={`mb-knot-${r}`}
                    d={knotPath(x, row.y)}
                    pathLength={1}
                    strokeDasharray="1"
                    fill="none"
                    stroke={row.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                ))
              )}

              {/* franjas */}
              {CORD_XS.map((x, i) => (
                <line
                  key={`f${x}`}
                  className="mb-fringe"
                  x1={x}
                  y1="380"
                  x2={x}
                  y2={fringeY2(i)}
                  stroke="#efe3c8"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              ))}

              {/* pente */}
              <g className="mb-comb" transform="translate(0,452)">
                <rect x="-50" y="0" width="52" height="9" rx="2" fill="var(--color-ocre)" stroke="var(--color-ink)" strokeWidth="1.5" />
                {[0, 1, 2, 3, 4, 5].map((t) => (
                  <line key={t} x1={-44 + t * 8} y1="9" x2={-44 + t * 8} y2="22" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
                ))}
              </g>

              {/* tesoura */}
              <g className="mb-cut" transform="translate(0,514)">
                <line x1="-6" y1="-11" x2="16" y2="11" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" />
                <line x1="-6" y1="11" x2="16" y2="-11" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="-11" cy="-14" r="4.5" fill="none" stroke="var(--color-clay)" strokeWidth="2.4" />
                <circle cx="-11" cy="14" r="4.5" fill="none" stroke="var(--color-clay)" strokeWidth="2.4" />
              </g>

              {/* carimbo final */}
              <g className="mb-stamp" transform="translate(392,560)">
                <rect x="-78" y="-22" width="156" height="44" fill="var(--color-moss)" stroke="var(--color-ink)" strokeWidth="2" transform="rotate(-7)" />
                <text
                  transform="rotate(-7)"
                  textAnchor="middle"
                  y="6"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="13"
                  fontWeight="600"
                  letterSpacing="2"
                  fill="var(--color-cream)"
                >
                  PEÇA PRONTA ✂
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* legendas da construção */}
        <div className="relative mx-auto w-full max-w-md md:h-[440px]">
          {reduced ? (
            <ol className="space-y-5">
              {captions.map((c) => (
                <li key={c.n} className="border-2 border-ink bg-cream p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">{c.n} · {c.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-bark">{c.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            captions.map((c, i) => (
              <div key={c.n} className={`mb-cap absolute inset-0 grid content-center ${i > 0 ? "opacity-100" : ""}`}>
                <p className="font-display text-6xl font-extrabold text-clay/25">{c.n}</p>
                <h3 className="-mt-4 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{c.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-bark">{c.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bark">
                  <ScissorsIcon className="h-4 w-4 text-clay" />
                  {i < 3 ? "continue rolando para amarrar" : "e assim ela vai pra sua casa"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
