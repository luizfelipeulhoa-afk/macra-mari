import { useMemo, useState } from "react";
import {
  products,
  formatBRL,
  type Category,
  type Product,
} from "../data/atelier";
import { useStore, toast } from "../store/useStore";
import Reveal from "./Reveal";
import { BagIcon, CheckIcon, ScissorsIcon } from "./Icons";

const cats: (Category | "Todas")[] = [
  "Todas",
  "Quadros",
  "Mandalas",
  "Porta-vasos",
  "Bolsas",
  "Casa",
];

const badgeStyle: Record<string, string> = {
  nova: "bg-moss text-cream",
  "última peça": "bg-clay text-cream",
  "mais tecida": "bg-ocre text-ink",
};

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
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Reveal
      delay={(index % 3) * 90}
      rot={index % 2 === 0 ? -1.5 : 1.5}
      className="h-full"
    >
      <article className="card-lift group flex h-full flex-col border-2 border-ink bg-paper">
        <div className="img-zoom relative aspect-[4/5] overflow-hidden border-b-2 border-ink bg-sand">
          <img
            src={p.img}
            alt={`${p.name} — macramê feito à mão`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {p.badge && (
            <span
              className={`absolute left-3 top-3 -rotate-6 border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] shadow-[2px_2px_0_rgba(44,30,19,0.25)] ${badgeStyle[p.badge]}`}
            >
              {p.badge}
            </span>
          )}
          <span className="absolute bottom-3 right-3 border border-ink/20 bg-cream/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bark">
            {p.size}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-clay">
            {p.category}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold leading-tight">
            {p.name}
          </h3>
          <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-bark">
            {p.material}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-bark/40 pt-3.5">
            <span className="font-display text-2xl font-extrabold tracking-tight">
              {formatBRL(p.price)}
            </span>
            <button
              onClick={handleAdd}
              className={`btn-knot flex items-center gap-1.5 border-2 border-ink px-3.5 py-2 font-mono text-[12px] uppercase tracking-wider transition-colors ${
                added ? "bg-moss text-cream" : "bg-ink text-cream"
              }`}
              style={{ "--fill": "var(--color-clay)" } as React.CSSProperties}
            >
              {added ? (
                <>
                  <CheckIcon className="h-4 w-4" /> na sacola
                </>
              ) : (
                <>
                  <BagIcon className="h-4 w-4" /> adicionar
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Shop() {
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const [sort, setSort] = useState<"ordem" | "preco-asc" | "preco-desc" | "nome">("ordem");

  const list = useMemo(() => {
    let l = filter === "Todas" ? [...products] : products.filter((p) => p.category === filter);
    if (sort === "preco-asc") l.sort((a, b) => a.price - b.price);
    if (sort === "preco-desc") l.sort((a, b) => b.price - a.price);
    if (sort === "nome") l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [filter, sort]);

  return (
    <section id="pecas" className="relative scroll-mt-24 border-b-2 border-ink bg-cream">
      <div className="weave mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-clay">
                <ScissorsIcon className="h-4 w-4" /> peças prontas · tecidas esta semana
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
                O varal
                <br />
                da <span className="outline-text">semana</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <p className="max-w-sm text-[15px] leading-relaxed text-bark">
              Cada peça é única — quando vai, vai. O que está no varal hoje foi
              tecido nos últimos dias, fio por fio, aqui no atelier.
            </p>
          </Reveal>
        </div>

        {/* filtros */}
        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`border-2 border-ink px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-wider transition-all duration-200 ${
                    filter === c
                      ? "-rotate-1 bg-ink text-cream shadow-[3px_3px_0_var(--color-clay)]"
                      : "bg-cream text-ink hover:-translate-y-0.5 hover:bg-sand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-bark">
              ordenar
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="cursor-pointer border-2 border-ink bg-cream px-2.5 py-1.5 font-mono text-[12px] uppercase tracking-wider text-ink focus:border-clay"
              >
                <option value="ordem">do tear</option>
                <option value="preco-asc">menor preço</option>
                <option value="preco-desc">maior preço</option>
                <option value="nome">nome A–Z</option>
              </select>
            </label>
          </div>
        </Reveal>

        {/* grade */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-12 border-2 border-dashed border-bark/50 bg-paper px-5 py-4 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-bark">
            não achou o que procura?{" "}
            <a href="#sob-medida" className="font-semibold text-clay underline decoration-wavy underline-offset-4 hover:text-clay-deep">
              a gente tece sob medida
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
