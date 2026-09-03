import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND, formatBRL } from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import { prefersReducedMotion } from "../lib/motion";
import { ArrowDownIcon, BagIcon } from "./Icons";

/* o canvas 3D entra como chunk separado */
const IntroCanvas = lazy(() => import("../three/IntroCanvas"));

gsap.registerPlugin(ScrollTrigger);

const LEN = 2600;
const PRICE = 420;
const NAME = "Wall Hanging Trança";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ————————————————————————————————————————————————
   Transição de entrada em duas camadas, à prova de falha:
   1) a FOTO real da peça é o plano de fundo — e é ela que o
      scroll conduz para dentro da moldura (funciona sempre);
   2) o MODELO 3D (GLB do Drive) baixa por cima; quando chega,
      a foto se dissolve e o modelo assume a coreografia.
   ———————————————————————————————————————————————— */
export default function ModelIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const modelReady = useRef(false);
  const addItem = useStore((s) => s.addItem);
  const setDrawer = useStore((s) => s.setDrawer);
  const [glbStatus, setGlbStatus] = useState<"loading" | "ready" | "off">("loading");

  /* limite de espera pelo modelo: nunca fica "baixando…" para sempre */
  useEffect(() => {
    const t = window.setTimeout(
      () => setGlbStatus((s) => (s === "loading" ? "off" : s)),
      20000
    );
    return () => window.clearTimeout(t);
  }, []);

  /* morfologia da foto: tela cheia → janela da moldura */
  const morphPhoto = (p: number) => {
    const el = photoRef.current;
    const win = windowRef.current;
    if (!el || !win || modelReady.current) return;
    const r = win.getBoundingClientRect();
    if (r.width < 10) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const e = smooth(0.28, 0.78, p);
    el.style.transform = `translate(${(r.left * e).toFixed(1)}px, ${(
      r.top * e
    ).toFixed(1)}px) scale(${(1 + (r.width / vw - 1) * e).toFixed(4)}, ${(
      1 + (r.height / vh - 1) * e
    ).toFixed(4)})`;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      /* sem pin: a foto já aparece emoldurada */
      gsap.set(".mi-title", { autoAlpha: 0 });
      gsap.set(".mi-cue", { autoAlpha: 0 });
      morphPhoto(1);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(".mi-overlay", { opacity: 0.9 });
      gsap.set(".mi-frame", { autoAlpha: 0, scale: 1.5, transformOrigin: "50% 40%" });
      gsap.set(".mi-info", { autoAlpha: 0, y: 70 });
      gsap.set(".mi-info > *", { autoAlpha: 0, y: 24 });
      gsap.set(".mi-tag", { autoAlpha: 0, scale: 0.3, rotate: -40 });
      gsap.set(".mi-cue2", { autoAlpha: 0, y: 16 });
      gsap.set(".mi-tline-inner", { yPercent: 120 });
      gsap.set(".mi-kicker", { autoAlpha: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${LEN}`,
          scrub: 0.6,
          pin: true,
          onUpdate: (self) => morphPhoto(self.progress),
        },
      });

      /* 1 — o título sobe por cima da peça em tamanho gigante */
      tl.to(".mi-kicker", { autoAlpha: 1, y: 0, duration: 0.35 }, 0.05);
      tl.to(".mi-tline-inner", { yPercent: 0, duration: 0.6, stagger: 0.12, ease: "power4.out" }, 0.15);

      /* 2 — o título sai de cena */
      tl.to(".mi-title", { autoAlpha: 0, yPercent: -14, duration: 0.5, ease: "power2.in" }, 1.0);
      tl.to(".mi-cue", { autoAlpha: 0, duration: 0.3 }, 0.95);
      tl.to(".mi-overlay", { opacity: 0.45, duration: 0.7 }, 1.05);

      /* 3 — a moldura entra e o cordão se pendura */
      tl.to(".mi-frame", { autoAlpha: 1, scale: 1, duration: 0.75, ease: "power3.out" }, 1.25);
      tl.fromTo(".mi-cord-path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "none" }, 1.3);
      tl.fromTo(".mi-cord-knot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 1.78);

      /* 4 — a etiqueta de preço salta na lateral */
      tl.to(".mi-tag", { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2.2)" }, 2.0);

      /* 5 — a ficha de venda sobe, item a item */
      tl.to(".mi-info", { autoAlpha: 1, y: 0, duration: 0.4 }, 2.05);
      tl.to(".mi-info > *", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07 }, 2.15);

      /* 6 — convite para entrar no varal */
      tl.to(".mi-cue2", { autoAlpha: 1, y: 0, duration: 0.35 }, 2.75);
      tl.to(".mi-overlay", { opacity: 0.28, duration: 0.4 }, 2.8);
    }, section);

    const onResize = () => {
      if (photoRef.current) morphPhoto(1);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* o modelo 3D chegou: dissolve as fotos e deixa o GLB brilhar */
  const onModelReady = () => {
    modelReady.current = true;
    setGlbStatus("ready");
    const el = photoRef.current;
    if (el) gsap.to(el, { autoAlpha: 0, duration: 0.8, ease: "power2.out" });
  };

  const addToBag = () => {
    addItem({
      key: "wall-hanging-3d",
      name: `${NAME} — peça única`,
      price: PRICE,
      img: BRAND.catPaineis,
      meta: "Algodão cru e terracota · 62 × 84 cm",
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
          "radial-gradient(120% 90% at 50% 20%, #332214 0%, #241812 45%, #180f09 100%)",
      }}
    >
      {/* camada 1 — a foto real: plano de fundo garantido */}
      <img
        ref={photoRef}
        src={BRAND.catPaineisXL}
        alt="Peça de macramê da Macra Mari ocupando a tela inteira"
        className="absolute inset-0 z-0 h-full w-full origin-top-left object-cover will-change-transform"
        draggable={false}
      />

      {/* camada 2 — o modelo 3D por cima, quando o Drive entrega */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <Suspense fallback={null}>
          <IntroCanvas
            sectionRef={sectionRef}
            windowRef={windowRef}
            len={LEN}
            onReady={onModelReady}
            onFail={() => setGlbStatus("off")}
          />
        </Suspense>
      </div>

      {/* véu de contraste */}
      <div
        className="mi-overlay pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,12,7,0.5) 0%, rgba(20,12,7,0.68) 55%, rgba(20,12,7,0.86) 100%)",
        }}
      />

      {/* selo de status do modelo */}
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
          {glbStatus === "ready"
            ? "modelo 3d ativo"
            : glbStatus === "off"
              ? "exposição 2d"
              : "baixando modelo 3d…"}
        </span>
      </div>

      {/* fase 1 — título sobre a peça gigante */}
      <div className="mi-title pointer-events-none absolute inset-0 z-30 grid place-items-center px-6">
        <div className="text-center text-cream">
          <p className="mi-kicker mb-5 inline-block border border-cream/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-cream/85">
            direto do tear · peça nº 001
          </p>
          <h1 className="font-display font-extrabold leading-[0.94] tracking-tight">
            <span className="mi-tline block overflow-hidden pb-[0.08em] text-[clamp(2.6rem,8vw,6.2rem)]">
              <span className="mi-tline-inner block">A primeira peça</span>
            </span>
            <span className="mi-tline block overflow-hidden pb-[0.08em] text-[clamp(2.6rem,8vw,6.2rem)]">
              <span className="mi-tline-inner block text-ocre">nasce assim.</span>
            </span>
          </h1>
          <p className="mi-kicker mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-cream/75">
            Role devagar: o scroll pendura, emoldura e coloca preço no que a
            Mariana acabou de tecer.
          </p>
        </div>
      </div>

      {/* fase 2/3 — cordão + moldura + etiqueta + ficha de venda */}
      <div className="mi-stage absolute inset-0 z-30 grid place-items-center px-4">
        <div className="flex flex-col items-center">
          {/* cordão de pendurar */}
          <svg viewBox="0 0 240 52" className="mi-cord -mb-1 h-9 w-[min(46vw,220px)]" aria-hidden="true">
            <path className="mi-cord-path" d="M14 48 L120 6" pathLength={1} strokeDasharray="1" fill="none" stroke="#d89b3d" strokeWidth="3.5" strokeLinecap="round" />
            <path className="mi-cord-path" d="M226 48 L120 6" pathLength={1} strokeDasharray="1" fill="none" stroke="#d89b3d" strokeWidth="3.5" strokeLinecap="round" />
            <circle className="mi-cord-knot" cx="120" cy="6" r="6" fill="#c2512b" stroke="#180f09" strokeWidth="2" />
          </svg>

          {/* moldura de madeira + passe-partout (a janela recebe a peça) */}
          <div
            className="mi-frame relative p-[13px] shadow-[0_24px_60px_rgba(0,0,0,0.55)] sm:p-[15px]"
            style={{
              background:
                "linear-gradient(135deg, #8a5a33 0%, #5d3a20 38%, #8a5a33 62%, #4e2f18 100%)",
              border: "2px solid #180f09",
            }}
          >
            <div className="border border-ink/25 bg-cream p-3 sm:p-3.5">
              <div
                ref={windowRef}
                className="relative aspect-[4/5] w-[min(64vw,300px)] overflow-hidden bg-ink/20 sm:w-[320px]"
              >
                {/* profundidade da janela sobre a peça (foto ou 3D) */}
                <div className="pointer-events-none absolute inset-0 z-10 border border-ink/30 shadow-[inset_0_0_28px_rgba(0,0,0,0.55)]" />
              </div>
            </div>

            {/* etiqueta de preço pendurada */}
            <div className="mi-tag absolute -right-7 top-[38%] z-10 sm:-right-9">
              <svg viewBox="0 0 40 40" className="absolute -left-4 -top-6 h-8 w-8 text-ocre" aria-hidden="true">
                <path d="M38 2 C 24 8, 14 20, 10 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="block rotate-0 border-2 border-ink bg-ocre px-3 py-1.5 shadow-[3px_4px_0_rgba(0,0,0,0.35)]">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-ink/70">à vista</span>
                <span className="block font-display text-lg font-extrabold leading-none text-ink">
                  {formatBRL(PRICE)}
                </span>
              </span>
            </div>
          </div>

          {/* ficha de venda */}
          <div className="mi-info mt-4 w-[min(78vw,392px)] border-2 border-ink bg-cream px-5 py-4 text-ink shadow-[6px_8px_0_rgba(0,0,0,0.4)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">
              peça única · saiu do tear hoje
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
                {NAME}
              </h2>
              <span className="whitespace-nowrap font-display text-xl font-extrabold text-clay">
                {formatBRL(PRICE)}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-snug text-bark">
              Algodão cru e fios tingidos com urucum · vara de demolição ·
              62 × 84 cm
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
      </div>

      {/* dicas de scroll */}
      <div className="mi-cue absolute inset-x-0 bottom-6 z-30 flex justify-center">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-cream/65">
          role para emoldurar
          <ArrowDownIcon className="h-4 w-4 animate-bob" />
        </span>
      </div>
      <div className="mi-cue2 absolute inset-x-0 bottom-6 z-30 flex justify-center">
        <a href="#pecas" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-ocre transition-colors hover:text-cream">
          entrar no varal
          <ArrowDownIcon className="h-4 w-4 animate-bob" />
        </a>
      </div>
    </section>
  );
}
