import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND, PIECE_ART, formatBRL } from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import { prefersReducedMotion } from "../lib/motion";
import FiberField from "./FiberField";
import { ArrowDownIcon, BagIcon } from "./Icons";

/* o canvas 3D entra como chunk separado */
const IntroCanvas = lazy(() => import("../three/IntroCanvas"));

gsap.registerPlugin(ScrollTrigger);

const LEN = 4400;
const PRICE = 420;
const NAME = "Wall Hanging Trança";

/* capítulos da história — cada janela de scroll conta um pedaço */
const chapters = [
  {
    kicker: "capítulo 01 · a matéria",
    title: "O fio",
    text: "Algodão orgânico que chegou do sertão ainda com cheiro de sol. Metade do fio, a Mariana tingiu com urucum; a outra metade, deixou da cor da terra.",
    side: "left",
  },
  {
    kicker: "capítulo 02 · a técnica",
    title: "O nó",
    text: "3.412 nós quadrados, um de cada vez — cada um puxado com a mesma tensão. A medida exata só a memória das mãos dela conhece.",
    side: "right",
  },
  {
    kicker: "capítulo 03 · a duração",
    title: "O tempo",
    text: "Quarenta horas entre o tear, o café passado e a rádio ligada. Pressa é o único material que nunca entrou neste ateliê.",
    side: "left",
  },
  {
    kicker: "capítulo 04 · a autora",
    title: "A mão",
    text: "Três anos de ateliê cabem nesta trança. Cada franja penteada até abrir, cada sobra de fio guardada pra próxima peça.",
    side: "right",
  },
];

/* ————————————————————————————————————————————————
   Abertura-showroom: a peça (PNG recortado, ou o GLB
   quando chega) flutua no centro e gira 360° conforme
   o scroll — a cada volta, um capítulo da história.
   ———————————————————————————————————————————————— */
export default function ModelIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGSVGElement | null>(null);
  const needleRef = useRef<SVGGElement | null>(null);
  const degRef = useRef<HTMLSpanElement | null>(null);
  const heroRef = useRef<HTMLImageElement | null>(null);
  const modelReady = useRef(false);

  const addItem = useStore((s) => s.addItem);
  const setDrawer = useStore((s) => s.setDrawer);
  const [glbStatus, setGlbStatus] = useState<"loading" | "ready" | "off">("loading");
  const [heroSrc, setHeroSrc] = useState(PIECE_ART.pngDrive);

  /* limite de espera pelo modelo 3D */
  useEffect(() => {
    const t = window.setTimeout(
      () => setGlbStatus((s) => (s === "loading" ? "off" : s)),
      20000
    );
    return () => window.clearTimeout(t);
  }, []);

  /* o scroll gira a peça, o anel e o mostrador */
  const onProgress = (p: number) => {
    if (modelReady.current) return; /* o GLB gira por conta própria */
    const deg = p * 360;
    if (spinRef.current)
      spinRef.current.style.transform = `perspective(1100px) rotateY(${deg.toFixed(1)}deg)`;
    if (ringRef.current)
      ringRef.current.style.transform = `rotate(${(-p * 140).toFixed(1)}deg)`;
    if (needleRef.current)
      needleRef.current.style.transform = `rotate(${deg.toFixed(1)}deg)`;
    if (degRef.current) degRef.current.textContent = `${Math.round(deg)}°`;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      /* composição estática: peça + ficha, sem pin nem giro */
      gsap.set(".mi-head", { autoAlpha: 1 });
      gsap.set(".mi-chap, .mi-cue, .mi-dial", { autoAlpha: 0, display: "none" });
      gsap.set(".mi-final", { autoAlpha: 1, y: 0 });
      gsap.set(".mi-exit", { yPercent: 103 });
      if (spinRef.current)
        spinRef.current.style.transform = "perspective(1100px) rotateY(-16deg)";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(".mi-head > *", { autoAlpha: 0, y: 30 });
      gsap.set(".mi-chap, .mi-final", { autoAlpha: 0, y: 44 });
      gsap.set(".mi-cue", { autoAlpha: 0 });
      gsap.set(".mi-dial", { autoAlpha: 0 });
      gsap.set(".mi-exit", { yPercent: 103 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${LEN}`,
          scrub: 0.55,
          pin: true,
          onUpdate: (self) => onProgress(self.progress),
        },
      });

      /* janela 0 — nome da peça + convite ao giro */
      tl.to(".mi-head > *", { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.08 }, 0.02);
      tl.to(".mi-cue", { autoAlpha: 1, duration: 0.2 }, 0.15);
      tl.to(".mi-dial", { autoAlpha: 1, duration: 0.25 }, 0.2);
      tl.to(".mi-head > *", { autoAlpha: 0, y: -24, duration: 0.22, stagger: 0.04 }, 0.78);
      tl.to(".mi-cue", { autoAlpha: 0, duration: 0.15 }, 0.78);

      /* janelas 1–4 — os capítulos, alternando lados */
      const chaps = gsap.utils.toArray<HTMLElement>(".mi-chap");
      chaps.forEach((el, i) => {
        const at = 1 + i; /* janela começa em at, termina em at+1 */
        tl.to(el, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }, at + 0.06);
        tl.to(el, { autoAlpha: 0, y: -30, duration: 0.22, ease: "power2.in" }, at + 0.74);
      });

      /* janela 5 — o destino: a ficha de venda entra e fica */
      tl.to(".mi-final", { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" }, 5.12);
      tl.to(".mi-dial", { autoAlpha: 0, duration: 0.2 }, 5.3);

      /* onda de papel entregando a página ao varal */
      tl.to(".mi-exit", { yPercent: 0, duration: 0.5, ease: "power3.inOut" }, 5.55);
    }, section);

    const onResize = () => {
      /* mantém o giro correto após redimensionar */
      const st = ScrollTrigger.getAll().find((s) => s.trigger === section);
      if (st) onProgress(st.progress);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* o modelo 3D chegou: dissolve o PNG e deixa o GLB girar */
  const onModelReady = () => {
    modelReady.current = true;
    setGlbStatus("ready");
    const el = heroRef.current;
    if (el) gsap.to(el, { autoAlpha: 0, duration: 0.8, ease: "power2.out" });
  };

  const addToBag = () => {
    addItem({
      key: "wall-hanging-tranca",
      name: `${NAME} — peça única`,
      price: PRICE,
      img: BRAND.catPaineis,
      meta: "Algodão cru e urucum · 62 × 84 cm",
    });
    toast(`“${NAME}” foi pra sua sacola`);
    setDrawer(true);
  };

  return (
    <section
      id="entrada"
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 18%, #332214 0%, #241812 45%, #160e08 100%)",
      }}
    >
      {/* fundo vivo: fios de algodão + poeira de luz */}
      <FiberField className="absolute inset-0 z-0 h-full w-full" />

      {/* halo quente atrás da peça */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(46% 42% at 50% 46%, rgba(216,155,61,0.22) 0%, rgba(194,81,43,0.1) 48%, rgba(0,0,0,0) 75%)",
        }}
      />

      {/* anel gigante: gira em sentido contrário ao scroll */}
      <svg
        ref={ringRef}
        viewBox="0 0 600 600"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[118vmin] w-[118vmin] -translate-x-1/2 -translate-y-1/2 text-cream/[0.13]"
        aria-hidden="true"
      >
        <circle cx="300" cy="300" r="292" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 14" />
        <circle cx="300" cy="300" r="238" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="300" r="182" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 9" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="300"
            y1="12"
            x2="300"
            y2={i % 6 === 0 ? "34" : "24"}
            stroke="currentColor"
            strokeWidth={i % 6 === 0 ? 2.5 : 1.2}
            transform={`rotate(${i * 15} 300 300)`}
          />
        ))}
      </svg>

      {/* A PEÇA — PNG recortado girando no centro */}
      <div ref={spinRef} className="absolute inset-0 z-10 will-change-transform">
        <div className="mi-float absolute inset-0" style={{ "--bob-amp": 1 } as React.CSSProperties}>
          <img
            ref={heroRef}
            src={heroSrc}
            onError={() => setHeroSrc(BRAND.catPaineisXL)}
            alt={`${NAME} — peça de macramê girando em exposição`}
            draggable={false}
            className="absolute left-1/2 top-1/2 object-contain [filter:drop-shadow(0_30px_40px_rgba(0,0,0,0.55))]"
            style={{
              height: "min(62vh, 560px)",
              maxWidth: "min(82vw, 500px)",
              transformOrigin: "50% 50%",
            }}
          />
        </div>
      </div>

      {/* camada 3D por cima, quando o GLB chega */}
      <div className="pointer-events-none absolute inset-0 z-[12]">
        <Suspense fallback={null}>
          <IntroCanvas
            sectionRef={sectionRef}
            len={LEN}
            onReady={onModelReady}
            onFail={() => setGlbStatus((s) => (s === "ready" ? s : "off"))}
          />
        </Suspense>
      </div>

      {/* selo de status */}
      <div className="absolute right-4 top-20 z-30 sm:right-6 sm:top-24">
        <span
          className={`flex items-center gap-2 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-sm ${
            glbStatus === "ready"
              ? "border-moss/60 bg-moss/20 text-cream"
              : glbStatus === "off"
                ? "border-cream/30 bg-ink/40 text-cream/70"
                : "border-ocre/60 bg-ink/40 text-ocre"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              glbStatus === "ready"
                ? "animate-pulse-dot bg-moss"
                : glbStatus === "off"
                  ? "bg-cream/50"
                  : "animate-pulse-dot bg-ocre"
            }`}
          />
          {glbStatus === "ready" ? "3d real ativo" : glbStatus === "off" ? "giro 2d" : "baixando modelo 3d…"}
        </span>
      </div>

      {/* janela 0 — abertura: nome + convite */}
      <div className="mi-head pointer-events-none absolute inset-x-0 top-[9%] z-30 px-6 text-center text-cream">
        <p className="mb-3 inline-block border border-ocre/50 bg-ink/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-ocre">
          peça única · nº 001 · saiu do tear hoje
        </p>
        <h1 className="font-display text-[clamp(2.5rem,7.5vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight">
          Wall Hanging
          <span className="block text-ocre">Trança</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-cream/70 sm:text-[15px]">
          Gire a peça com o scroll — cada volta conta um pedaço de como ela nasceu.
        </p>
      </div>

      {/* janelas 1–4 — capítulos da história */}
      {chapters.map((c) => (
        <div
          key={c.title}
          className={`mi-chap pointer-events-none absolute z-30 px-5 sm:px-10 ${
            c.side === "left"
              ? "left-0 text-left sm:top-1/2 sm:w-[min(40vw,420px)] sm:-translate-y-1/2"
              : "right-0 text-right sm:top-1/2 sm:w-[min(40vw,420px)] sm:-translate-y-1/2"
          } bottom-[7%] w-full text-center sm:bottom-auto`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ocre">{c.kicker}</p>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-none tracking-tight text-cream">
            {c.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-cream/75 sm:mx-0 sm:max-w-none">
            {c.text}
          </p>
        </div>
      ))}

      {/* janela 5 — o destino: ficha de venda */}
      <div className="mi-final absolute inset-x-0 bottom-[5%] z-30 flex justify-center px-4">
        <div className="w-[min(92vw,430px)] border-2 border-ink bg-cream px-5 py-4 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">
                capítulo final · o destino
              </p>
              <h2 className="mt-0.5 font-display text-2xl font-extrabold leading-tight tracking-tight">
                A sua parede.
              </h2>
            </div>
            <span className="whitespace-nowrap border-2 border-ink bg-ocre px-3 py-1.5 font-display text-lg font-extrabold leading-none">
              {formatBRL(PRICE)}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-snug text-bark">
            Algodão cru e fios tingidos com urucum · vara de demolição · 62 × 84 cm
          </p>
          <div className="mt-3.5 flex items-center gap-3">
            <button
              onClick={addToBag}
              data-magnetic
              className="btn-knot flex flex-1 items-center justify-center gap-2 border-2 border-ink bg-clay px-4 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-cream hover:text-clay"
              style={{ "--fill": "var(--color-cream)" } as React.CSSProperties}
            >
              <BagIcon className="h-4 w-4" />
              adicionar à sacola
            </button>
            <a
              href="#pecas"
              className="stitch px-3.5 py-3 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:bg-sand"
            >
              ver o varal
            </a>
          </div>
        </div>
      </div>

      {/* mostrador de giro — o conta-graus da vitrine */}
      <div className="mi-dial absolute bottom-6 left-5 z-30 hidden items-center gap-3 sm:flex">
        <svg viewBox="0 0 64 64" className="h-14 w-14 text-cream/70">
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 6" />
          <circle cx="32" cy="32" r="21" fill="rgba(24,15,9,0.5)" stroke="currentColor" strokeWidth="1" />
          <g ref={needleRef} style={{ transformOrigin: "32px 32px" }}>
            <line x1="32" y1="32" x2="32" y2="13" stroke="#d89b3d" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="32" r="3" fill="#c2512b" />
          </g>
        </svg>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/60">
          <span ref={degRef} className="block text-[15px] font-semibold tracking-normal text-ocre">
            0°
          </span>
          de 360° do giro
        </div>
      </div>

      {/* convite inicial */}
      <div className="mi-cue pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-cream/65">
          role para girar a peça
          <ArrowDownIcon className="h-4 w-4 animate-bob" />
        </span>
      </div>

      {/* onda de papel: entrega a página ao varal sem corte de cor */}
      <div className="mi-exit pointer-events-none absolute inset-0 z-40">
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="absolute -top-[88px] h-[90px] w-full text-paper"
          aria-hidden="true"
        >
          <path
            d="M0 90 L0 46 C 240 10, 480 74, 720 40 C 960 8, 1200 66, 1440 34 L1440 90 Z"
            fill="currentColor"
          />
          <path
            d="M0 52 C 240 16, 480 80, 720 46 C 960 14, 1200 72, 1440 40"
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="2.5"
            strokeDasharray="7 9"
          />
        </svg>
        <div className="weave h-full w-full bg-paper" />
      </div>
    </section>
  );
}
