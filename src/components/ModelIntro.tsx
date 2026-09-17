import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND, PIECE_ART, formatBRL } from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import { prefersReducedMotion } from "../lib/motion";
import { sample, HOLDS, MOVES, FINAL_AT } from "../lib/choreo";
import FiberField from "./FiberField";
import { ArrowDownIcon, BagIcon } from "./Icons";

/* o canvas 3D entra como chunk separado */
const IntroCanvas = lazy(() => import("../three/IntroCanvas"));

gsap.registerPlugin(ScrollTrigger);

const LEN = 3000; /* viagem mais direta, mantendo os quatro capítulos */
const DUR = 6; /* unidades da timeline = 100% do scroll */
const PRICE = 420;
const NAME = "Wall Hanging Trança";
const pos = (p: number) => p * DUR;

const chapters = [
  {
    n: "01",
    kicker: "capítulo 01 · a matéria",
    title: "Fibra que respira",
    subtitle: "Textura macia. Presença sem pesar.",
    text: "O algodão cru deixa cada torção visível; o azul-petróleo desenha profundidade e muda de tom conforme a luz do ambiente.",
    side: "left",
  },
  {
    n: "02",
    kicker: "capítulo 02 · a técnica",
    title: "Tensão precisa",
    subtitle: "Nós firmes. Desenho leve.",
    text: "Cada nó é apertado à mão para manter a trama alinhada, preservar o relevo e fazer a peça cair reta na parede.",
    side: "right",
  },
  {
    n: "03",
    kicker: "capítulo 03 · o tempo",
    title: "Feita devagar",
    subtitle: "O acabamento aparece de perto.",
    text: "Trança, franjas e encontros recebem o mesmo cuidado. É esse ritmo manual que evita a aparência repetida de uma peça industrial.",
    side: "left",
  },
  {
    n: "04",
    kicker: "capítulo 04 · na sua casa",
    title: "Ponto focal",
    subtitle: "62 × 84 cm de presença artesanal.",
    text: "A proporção ocupa a parede sem dominar o espaço. Funciona sobre aparador, cabeceira ou naquele canto que ainda pede identidade.",
    side: "right",
  },
];

/* palavras mascaradas p/ revelação linha a linha */
function MaskWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="wline inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
          <span className="wline-inner inline-block">{w}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

/* ————————————————————————————————————————————————
   Abertura-showroom: a peça gira 360° pelo scroll, com
   pausas leves em cada capítulo e zoom in/out entre eles.
   ———————————————————————————————————————————————— */
export default function ModelIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const spinRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGSVGElement | null>(null);
  const needleRef = useRef<SVGGElement | null>(null);
  const degRef = useRef<HTMLSpanElement | null>(null);
  const threadFillRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLImageElement | null>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const modelReady = useRef(false);
  const progressRef = useRef(0);

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

  /* aplica a pose da coreografia à peça 2D + mostrador + fio contador */
  const onProgress = (p: number) => {
    progressRef.current = p;
    const pose = sample(p);
    if (!modelReady.current && spinRef.current) {
      spinRef.current.style.transform =
        `translateY(${(pose.y * 100).toFixed(2)}%) ` +
        `scale(${pose.zoom.toFixed(4)}) ` +
        `rotate(${Math.sin(p * Math.PI) * 2}deg)`;
    }
    if (ringRef.current)
      ringRef.current.style.transform = `rotate(${(-pose.deg * 0.4).toFixed(1)}deg)`;
    if (needleRef.current)
      needleRef.current.style.transform = `rotate(${pose.deg.toFixed(1)}deg)`;
    if (degRef.current) degRef.current.textContent = `${Math.round(pose.deg)}°`;

    /* fio contador: preenchimento + nó ativo */
    if (threadFillRef.current)
      threadFillRef.current.style.height = `${(p * 100).toFixed(1)}%`;
    const marks = [...HOLDS.map((h) => (h.from + h.to) / 2), FINAL_AT + 0.04];
    nodeRefs.current.forEach((n, i) => {
      if (!n) return;
      const mp = marks[i];
      n.classList.toggle("is-done", p > mp);
      n.classList.toggle("is-active", Math.abs(p - mp) < 0.055);
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      /* composição estática: peça em pose intermediária + ficha visível */
      const pose = sample(0);
      if (spinRef.current)
        spinRef.current.style.transform =
          `translateY(${pose.y * 100}%) scale(${pose.zoom}) rotate(0deg)`;
      gsap.set(".mi-head, .mi-chap, .mi-cue, .mi-slice, .mi-thread", { display: "none" });
      gsap.set(".mi-final", { autoAlpha: 1, y: 0 });
      gsap.set(".mi-handoff", { autoAlpha: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(".mi-head > *", { autoAlpha: 1, y: 0 });
      gsap.set(".mi-chap", { autoAlpha: 0 });
      gsap.set(".mi-chap .wline-inner", { yPercent: 118 });
      gsap.set(".mi-chap .mi-chap-detail", { autoAlpha: 0, y: 22 });
      gsap.set(".mi-chap .mi-chap-kick", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".mi-final", { autoAlpha: 0, y: 52 });
      gsap.set(".mi-cue", { autoAlpha: 1 });
      gsap.set(".mi-slice", { scaleX: 0, autoAlpha: 0 });
      gsap.set(".mi-handoff", { autoAlpha: 0 });
      gsap.set(".mi-handoff-copy", { autoAlpha: 0, y: 28 });

      const playhead = { value: 0 };
      const tl = gsap.timeline({
        onUpdate: () => onProgress(playhead.value),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${LEN}`,
          scrub: 0.28,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(playhead, {value: 1, duration: DUR, ease: "none"}, 0);
      /* janela 0 — nome + convite */
      tl.to(".mi-head > *", { autoAlpha: 0, y: -22, duration: 0.32, stagger: 0.04, ease: "power2.inOut" }, pos(0.062));
      tl.to(".mi-cue", { autoAlpha: 0, duration: 0.28, ease: "power1.inOut" }, pos(0.062));

      /* capítulos nas pausas; linhas de corte nas rampas */
      const chaps = gsap.utils.toArray<HTMLElement>(".mi-chap");
      chaps.forEach((el, i) => {
        const hold = HOLDS[i];
        const at = pos(hold.from + 0.012);

        tl.to(el, { autoAlpha: 1, duration: 0.2, ease: "power1.out" }, at);
        tl.to(el.querySelector(".mi-chap-kick"), { scaleX: 1, duration: 0.38, ease: "power2.inOut" }, at);
        tl.to(
          el.querySelectorAll(".wline-inner"),
          { yPercent: 0, duration: 0.5, stagger: 0.065, ease: "power3.out" },
          at + 0.06
        );
        tl.to(el.querySelectorAll(".mi-chap-detail"), { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.055, ease: "power2.out" }, at + 0.14);

        const outAt = pos(hold.to - 0.012);
        tl.to(el.querySelectorAll(".wline-inner"), { yPercent: -112, duration: 0.38, stagger: 0.035, ease: "power2.inOut" }, outAt);
        tl.to(el.querySelectorAll(".mi-chap-detail"), { autoAlpha: 0, y: -12, duration: 0.34, stagger: 0.025, ease: "power2.inOut" }, outAt);
        tl.to(el, { autoAlpha: 0, duration: 0.18, ease: "power1.in" }, outAt + 0.22);
      });

      /* cortes minimalistas entre capítulos */
      const slices = gsap.utils.toArray<HTMLElement>(".mi-slice");
      slices.forEach((el, i) => {
        const mv = MOVES[i];
        const mid = pos((mv.from + mv.to) / 2);
        tl.fromTo(
          el,
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: 0.32, ease: "power2.inOut", transformOrigin: i % 2 ? "right center" : "left center" },
          mid - 0.26
        );
        tl.to(el, { autoAlpha: 0, duration: 0.28, ease: "power1.inOut" }, mid + 0.08);
      });

      /* janela final — a ficha de venda entra e fica */
      tl.to(".mi-final", { autoAlpha: 1, y: 0, duration: 0.46, ease: "power2.out" }, pos(FINAL_AT - 0.03));

      /* Dissolução contínua: a luz do próximo hero invade o estúdio sem corte. */
      tl.to(".mi-handoff", { autoAlpha: 1, duration: 1.08, ease: "sine.inOut" }, pos(0.79));
      tl.to(".mi-handoff-glow", { scale: 1.08, duration: 1.18, ease: "sine.inOut" }, pos(0.79));
      tl.to(".mi-handoff-copy", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, pos(0.88));
    }, section);

    const onResize = () => {
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

  /* o modelo 3D chegou: dissolve o PNG e deixa o GLB seguir a coreografia */
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
      className="mi-showroom relative h-screen overflow-hidden"
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

      {/* anel gigante: contraponto ao giro da peça */}
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

      {/* linhas de corte minimalistas entre capítulos */}
      <div className="mi-slice pointer-events-none absolute left-0 right-0 top-[30%] z-[6] mx-auto h-px w-[86vw] max-w-5xl bg-ocre/70" />
      <div className="mi-slice pointer-events-none absolute left-0 right-0 top-[64%] z-[6] mx-auto h-px w-[70vw] max-w-4xl bg-clay/80" />
      <div className="mi-slice pointer-events-none absolute left-0 right-0 top-[38%] z-[6] mx-auto h-px w-[78vw] max-w-4xl bg-cream/50" />
      <div className="mi-slice pointer-events-none absolute left-0 right-0 top-[58%] z-[6] mx-auto h-px w-[64vw] max-w-3xl bg-ocre/60" />

      {/* A PEÇA — PNG recortado seguindo a coreografia */}
      <div ref={spinRef} className="absolute inset-0 z-10 will-change-transform">
        <div className="mi-float absolute inset-0" style={{ "--bob-amp": 1 } as React.CSSProperties}>
          <img
            ref={heroRef}
            src={heroSrc}
            onError={() => setHeroSrc(BRAND.catPaineisXL)}
            alt={`${NAME} — peça de macramê em exposição 360°`}
            draggable={false}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain [filter:drop-shadow(0_30px_40px_rgba(0,0,0,0.55))]"
            style={{
              height: "min(58vh, 520px)",
              maxWidth: "min(80vw, 470px)",
              transformOrigin: "50% 50%",
            }}
          />
        </div>
      </div>

      {/* camada 3D por cima, quando o GLB chega */}
      <div className="pointer-events-none absolute inset-0 z-[12]">
        <Suspense fallback={null}>
          <IntroCanvas
            progressRef={progressRef}
            onReady={onModelReady}
            onFail={() => { modelReady.current = false; setGlbStatus("off"); if (heroRef.current) gsap.set(heroRef.current, {autoAlpha: 1}); }}
          />
        </Suspense>
      </div>

      {/* fio contador à direita — preenche e acende o nó do capítulo */}
      <div className="mi-thread absolute right-5 top-1/2 z-30 hidden h-[44vh] -translate-y-1/2 flex-col items-center sm:flex">
        <div className="relative w-px flex-1 bg-cream/15">
          <div ref={threadFillRef} className="absolute left-0 top-0 w-px bg-ocre" style={{ height: "0%" }} />
          {[...HOLDS.map((h) => (h.from + h.to) / 2), FINAL_AT + 0.04].map((mp, i) => (
            <span
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="chap-node absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cream/40 bg-ink transition-all duration-300"
              style={{ top: `${mp * 100}%` }}
            />
          ))}
        </div>
        <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-cream/40 [writing-mode:vertical-rl]">
          a volta completa
        </span>
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
          {glbStatus === "ready" ? "Explore cada ângulo" : glbStatus === "off" ? "Vista em fotografia" : "Preparando a peça…"}
        </span>
      </div>

      <a href="#inicio" className="mi-skip absolute left-5 top-24 z-30 border-b border-cream/40 pb-1 font-mono text-[10px] uppercase tracking-widest text-cream/70 hover:text-ocre">Ir direto ao atelier ↗</a>

      {/* janela 0 — abertura */}
      <div className="mi-head pointer-events-none absolute inset-x-0 top-[8%] z-30 px-6 text-center text-cream">
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

      {/* capítulos — entram na pausa, saem antes da próxima rampa */}
      {chapters.map((c) => (
        <div
          key={c.n}
          className={`mi-chap pointer-events-none absolute z-30 ${
            c.side === "left"
              ? "left-0 pl-5 text-left sm:pl-12 sm:top-1/2 sm:w-[min(38vw,430px)] sm:-translate-y-1/2"
              : "right-0 pr-5 text-right sm:pr-12 sm:top-1/2 sm:w-[min(38vw,430px)] sm:-translate-y-1/2"
          } bottom-[9%] w-full text-center sm:bottom-auto`}
        >
          <div className={`mi-chap-kick h-px w-14 bg-ocre ${c.side === "right" ? "ml-auto" : ""}`} />
          <p className="mi-chap-detail mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ocre">
            {c.kicker}
          </p>
          <h2 className="mt-1 font-display text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-cream">
            <MaskWords text={c.title} />
          </h2>
          <p className={`mi-chap-detail mt-3 font-display text-[17px] font-semibold leading-snug text-cream sm:text-[19px] ${c.side === "right" ? "sm:ml-auto" : ""}`}>
            {c.subtitle}
          </p>
          <p className={`mi-chap-detail mt-2 max-w-xs text-[13px] leading-relaxed text-cream/65 sm:max-w-none sm:text-[14px] ${c.side === "right" ? "sm:ml-auto" : ""}`}>
            {c.text}
          </p>
        </div>
      ))}

      {/* janela final — a ficha de venda */}
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

      {/* mostrador de giro */}
      <div className="absolute bottom-6 left-5 z-30 hidden items-center gap-3 sm:flex">
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

      {/* A luz do atelier dissolve o fundo escuro antes do próximo hero. */}
      <div className="mi-handoff pointer-events-none absolute inset-0 z-40 overflow-hidden bg-paper/95">
        <div
          className="mi-handoff-glow absolute inset-[-12%]"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(251,246,234,1) 0%, rgba(243,236,221,.96) 42%, rgba(230,217,191,.9) 72%, rgba(243,236,221,1) 100%)",
          }}
        />
        <div className="weave absolute inset-0 opacity-55" />
        <div className="mi-handoff-copy absolute inset-0 grid place-content-center px-6 text-center text-ink">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-clay sm:text-[11px]">
            do detalhe ao ambiente
          </p>
          <p className="mt-4 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight">
            Uma peça muda
            <span className="block text-clay">todo o espaço.</span>
          </p>
          <span className="mx-auto mt-7 h-px w-20 bg-ocre" />
        </div>
      </div>
    </section>
  );
}
