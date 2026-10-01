import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatBRL } from "../data/atelier";
import { prefersReducedMotion, scrollToId } from "../lib/motion";
import { constructionChapter } from "../lib/cordConstruction";
import { useStore, toast } from "../store/useStore";
import { ArrowDownIcon, BagIcon } from "./Icons";

const Canvas = lazy(() => import("../three/CordConstructionCanvas"));
gsap.registerPlugin(ScrollTrigger);
const sculpture = products.find(p => p.id === "wix-escultura-ondas")!;
const chapters = [
  { label: "01 · a matéria", title: "Tudo começa\ncom um fio.", copy: "Algodão cru. Textura viva. O começo de uma peça feita à mão." },
  { label: "02 · o encontro", title: "Um fio encontra\no outro.", copy: "Os cordões se aproximam, cruzam caminhos e começam a desenhar a forma." },
  { label: "03 · o gesto", title: "O movimento\nvira desenho.", copy: "Curvas, tensão e encontros. A trama ganha presença a cada novo gesto." },
  { label: "04 · a peça", title: "Nasce uma\nnova onda.", copy: "Escultura Ondas. Cordão de algodão de 8 mm e fio de cetim, com acabamento artesanal." },
];

export default function ConstructionHero() {
  const section = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const progressBar = useRef<HTMLDivElement>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const [chapter, setChapter] = useState(reduced ? 3 : 0);
  const activeChapter = useRef(reduced ? 3 : 0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const addItem = useStore(s => s.addItem);
  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      const cursor = { p: 0 };
      gsap.to(cursor, { p: 1, ease: "none", scrollTrigger: {
        trigger: section.current, start: "top top", end: () => `+=${innerWidth < 700 ? 2200 : 2900}`,
        pin: true, scrub: 0.35, anticipatePin: 1, invalidateOnRefresh: true,
      }, onUpdate: () => {
        progressRef.current = cursor.p;
        if (progressBar.current) progressBar.current.style.transform = `scaleX(${cursor.p})`;
        const next = constructionChapter(cursor.p);
        if (next !== activeChapter.current) { activeChapter.current = next; setChapter(next); }
      } });
    }, section);
    return () => ctx.revert();
  }, [reduced]);
  const add = () => {
    addItem({ key: sculpture.id, name: sculpture.name, price: sculpture.price, img: sculpture.img,
      meta: `${sculpture.category} · ${sculpture.size}` });
    toast(`“${sculpture.name}” foi pra sua sacola`);
  };
  return (
    <section id="abertura" ref={section} data-construction-hero data-header-theme="light"
      className="relative h-[100svh] min-h-[660px] overflow-hidden border-b-2 border-ink bg-paper text-ink"
      aria-label="Do fio à peça — construção da Escultura Ondas">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,#fffaf0_0%,#f3ecdd_55%,#e5d6bb_100%)]" />
      <div className="absolute inset-x-0 top-24 z-20 mx-auto flex max-w-7xl justify-between px-5 font-mono text-[10px] uppercase tracking-[0.18em] text-bark sm:px-8">
        <span>MacraMari · do fio à peça</span><span className="hidden sm:inline">Uma história tecida à mão</span>
      </div>
      <div className="absolute inset-x-0 bottom-[250px] top-[210px] sm:bottom-16 sm:left-[36%] sm:right-0 sm:top-20">
        {!failed && <Suspense fallback={null}><Canvas progressRef={progressRef} reduced={reduced}
          onReady={() => setReady(true)} onFail={() => setFailed(true)} /></Suspense>}
        {(!ready || failed) && <img src={sculpture.img} alt="Escultura Ondas em algodão cru"
          className="absolute inset-0 h-full w-full object-contain p-4" />}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[135px] z-20 mx-auto max-w-7xl px-5 sm:top-1/2 sm:-translate-y-1/2 sm:px-8">
        <div className="max-w-md sm:w-[37%]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay sm:text-xs">{chapters[chapter].label}</p>
          <h1 className="mt-3 whitespace-pre-line font-display text-[clamp(2rem,4.6vw,4.4rem)] font-extrabold leading-[0.98] tracking-tight">{chapters[chapter].title}</h1>
          <p className="mt-5 hidden max-w-[290px] text-[15px] leading-relaxed text-bark sm:block">{chapters[chapter].copy}</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-28 z-20 mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 sm:bottom-14 sm:flex-row sm:items-end sm:px-8">
        <div className="max-w-[250px]">
          <p className="max-w-[285px] text-[13px] leading-relaxed text-bark sm:hidden">{chapters[chapter].copy}</p>
          <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bark">
            <ArrowDownIcon className="h-4 w-4" />{reduced ? "Do atelier para a sua casa" : "Role para entrelaçar"}
          </p>
        </div>
        <div className={`flex flex-wrap items-center gap-3 transition-opacity duration-300 ${chapter === 3 ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={chapter !== 3}>
          <span className="font-display text-xl font-bold">{formatBRL(sculpture.price)}</span>
          <button onClick={add} tabIndex={chapter === 3 ? 0 : -1}
            className="flex items-center gap-2 border-2 border-ink bg-ink px-3 py-3 font-mono text-[10px] uppercase tracking-wider text-cream hover:bg-clay">
            <BagIcon className="h-4 w-4" />Adicionar à sacola
          </button>
          <button onClick={() => scrollToId("pecas")} tabIndex={chapter === 3 ? 0 : -1}
            className="font-mono text-[10px] uppercase tracking-wider underline underline-offset-4">Ver catálogo</button>
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-6 z-20 h-px bg-bark/20 sm:inset-x-8" aria-hidden="true">
        <div ref={progressBar} className="h-full origin-left bg-clay" style={{ transform: reduced ? "scaleX(1)" : "scaleX(0)" }} />
      </div>
    </section>
  );
}
