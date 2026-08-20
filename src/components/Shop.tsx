import { useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, formatBRL, type Category, type Product } from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import { useFineMotion } from "../lib/motion";
import Reveal from "./Reveal";
import { BagIcon, CheckIcon } from "./Icons";

const cats: (Category | "Todas")[] = [
  "Todas",
  "Quadros",
  "Mandalas",
  "Porta-vasos",
  "Bolsas",
  "Casa",
];

type Sort = "destaque" | "menor" | "maior" | "nome";

const badgeStyle: Record<NonNullable<Product["badge"]>, string> = {
  nova: "bg-moss text-cream",
  "última peça": "bg-clay text-cream",
  "mais tecida": "bg-ocre text-ink",
};

/* cartão com inclinação 3D que segue o cursor (somente ponteiro fino) */
function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fine = useFineMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(780px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}

function ProductCard({ p, index }: { p: Product; index: number }) {
  const addItem = useStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      key: p.id,
      name: p.name,
      price: p.price,
      img: p.img,
      meta: `${p.category} · ${p.size}`,
    });
    toast(`“${p.name}” foi pra sua sacola`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      className="h-full"
    >
      <Tilt className="h-full">
        <div className="tilt-inner group relative flex h-full flex-col border-2 border-ink bg-cream shadow-[5px_7px_0_rgba(44,30,19,0.12)]">
          <div className="img-zoom relative aspect-[4/5] overflow-hidden border-b-2 border-ink bg-sand">
            <img
              src={p.img}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {p.badge && (
              <span
                className={`absolute left-3 top-3 border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${badgeStyle[p.badge]}`}
              >
                {p.badge}
              </span>
            )}
            <span className="absolute right-3 top-3 border-2 border-ink bg-cream px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-bark">
              {p.category}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-bold leading-tight tracking-tight">
                {p.name}
              </h3>
              <span className="whitespace-nowrap font-display text-lg font-extrabold text-clay">
                {formatBRL(p.price)}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-bark">{p.material}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-bark/80">
              {p.size} · tingido: {p.dye}
            </p>

            <button
              onClick={handleAdd}
              className={`btn-knot mt-4 flex w-full items-center justify-center gap-2 border-2 border-ink px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.16em] ${
                added ? "bg-moss text-cream" : "bg-ink text-cream hover:text-ink"
              }`}
              style={{ "--fill": added ? "var(--color-moss)" : "var(--color-ocre)" } as React.CSSProperties}
            >
              {added ? (
                <>
                  <CheckIcon className="h-4 w-4" strokeWidth={2.4} /> na sacola!
                </>
              ) : (
                <>
                  <BagIcon className="h-4 w-4" /> adicionar — peça nº {String(index + 1).padStart(2, "0")}
                </>
              )}
            </button>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}

export default function Shop() {
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const [sort, setSort] = useState<Sort>("destaque");

  const list = useMemo(() => {
    let l = products.filter((p) => filter === "Todas" || p.category === filter);
    if (sort === "menor") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "maior") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "nome") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [filter, sort]);

  return (
    <section id="pecas" className="relative scroll-mt-24 border-b-2 border-ink bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.24em] text-clay">
                ✳ direto do varal do atelier
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
                As peças <span className="outline-text">disponíveis</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-bark">
              Tirou do varal, levou. Quando uma peça sai, outra entra no tear —
              por isso o estoque vive mudando.
            </p>
          </div>
        </Reveal>

        {/* filtros + ordenação */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`border-2 border-ink px-4 py-2 font-mono text-[12px] uppercase tracking-wider transition-all duration-200 ${
                    filter === c
                      ? "-translate-y-0.5 bg-ink text-cream shadow-[3px_4px_0_rgba(44,30,19,0.2)]"
                      : "bg-cream text-ink hover:bg-sand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-bark">
              ordenar
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="cursor-pointer border-2 border-ink bg-cream px-3 py-2 font-mono text-[12px] uppercase tracking-wider text-ink outline-none transition-colors hover:bg-sand"
              >
                <option value="destaque">destaque</option>
                <option value="menor">menor preço</option>
                <option value="maior">maior preço</option>
                <option value="nome">nome</option>
              </select>
            </label>
          </div>
        </Reveal>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bark" aria-live="polite">
          {list.length} {list.length === 1 ? "peça no varal" : "peças no varal"}
          {filter !== "Todas" && ` · capítulo: ${filter}`}
        </p>

        {/* grade com transição de layout entre filtros */}
        <motion.div layout className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <p className="mt-10 border-2 border-dashed border-bark/50 px-6 py-10 text-center font-mono text-sm uppercase tracking-wider text-bark">
            esse capítulo do varal está vazio — escolha outra trama
          </p>
        )}

        <Reveal delay={100}>
          <p className="mt-10 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-bark">
            não achou o que procurava?{" "}
            <a href="#sob-medida" className="text-clay underline decoration-2 underline-offset-4 transition-colors hover:text-clay-deep">
              a gente tece sob medida →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
