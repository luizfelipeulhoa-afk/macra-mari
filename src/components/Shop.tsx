import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES, formatBRL, PRODUCTS, type Product } from "../data/products";
import { useStore } from "../store/useStore";
import { hasFinePointer, scrollToId } from "../lib/scroll";
import ProductCanvas from "./ProductCanvas";
import { BagIcon, SpoolIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLElement>(null);
  const addItem = useStore((s) => s.addItem);
  const showToast = useStore((s) => s.showToast);
  const motionOn = useStore((s) => s.motionOn);

  const tiltEnabled = motionOn && hasFinePointer();

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!tiltEnabled || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
    const rx = -((e.clientY - r.top) / r.height - 0.5) * 7;
    gsap.to(cardRef.current, {
      rotationY: ry,
      rotationX: rx,
      transformPerspective: 950,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!tiltEnabled || !cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto",
    });
  };

  const handleAdd = () => {
    addItem(product.id);
    showToast(`${product.name} foi para o carrinho`);
  };

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null;

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d" }}
      className="product-card group relative rounded-xl border border-white/70 bg-white/45 shadow-[0_24px_60px_-24px_rgba(78,55,31,0.4)] backdrop-blur-md"
    >
      <div className="card-inner flex h-full flex-col overflow-hidden rounded-xl">
        <div className="texture-weave relative h-72 bg-gradient-to-b from-sand-100/90 to-cream-100/60">
          <ProductCanvas model={product.model} alt={product.alt} />
          {product.badge && (
            <span className="absolute top-4 left-4 rounded-full bg-olive-700 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] text-cream-50 uppercase">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="absolute top-4 right-4 rounded-full bg-clay-500 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-cream-50 uppercase">
              −{discount}%
            </span>
          )}
          <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] text-walnut-500 uppercase">
            <SpoolIcon className="h-3.5 w-3.5" /> modelo 3D · passe o mouse
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <span className="text-[10px] font-bold tracking-[0.24em] text-olive-600 uppercase">
            {CATEGORIES.find((c) => c.id === product.category)?.label}
          </span>
          <h3 className="font-display mt-2 text-2xl leading-tight font-medium text-bark-900">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-walnut-600">{product.description}</p>

          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Materiais">
            {product.materials.map((m) => (
              <li key={m} className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-walnut-600">
                {m}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <p>
              {product.compareAt && (
                <s className="block text-sm text-walnut-500">{formatBRL(product.compareAt)}</s>
              )}
              <span className="font-display text-[26px] font-medium text-bark-900">{formatBRL(product.price)}</span>
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-bark-900 px-5 text-[13px] font-bold tracking-wide text-cream-50 uppercase transition-colors duration-300 hover:bg-olive-700"
            >
              <BagIcon className="h-4.5 w-4.5" />
              Adicionar
            </button>
          </div>
        </div>

        {/* detalhe artesanal revelado no hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-bark-950/92 px-6 py-4 text-cream-100 transition-transform duration-500 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:translate-y-0">
          <p className="text-sm">
            <strong className="font-display text-base italic">Tecida em {product.daysToMake}{" "}
            {product.daysToMake === 1 ? "dia" : "dias"}</strong>{" "}
            — {product.materials.join(" · ")}. Peça numerada e assinada.
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Shop() {
  const gridRef = useRef<HTMLDivElement>(null);
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const motionOn = useStore((s) => s.motionOn);

  const visible = filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!motionOn || !gridRef.current) return;

      // revelação em cascata dos cartões
      gsap.from(".product-card", {
        y: 58,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 84%", once: true },
      });

      // profundidade em camadas durante o scroll
      gsap.utils.toArray<HTMLElement>(".product-card").forEach((card, i) => {
        const inner = card.querySelector(".card-inner");
        if (!inner) return;
        const depth = [-2.5, -5, -1.5][i % 3];
        gsap.to(inner, {
          yPercent: depth,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filter, motionOn]);

  return (
    <section id="loja" aria-labelledby="loja-titulo" className="texture-weave relative bg-cream-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="text-[11px] font-bold tracking-[0.32em] text-olive-600 uppercase">A loja</p>
            <h2 id="loja-titulo" className="font-display mt-4 max-w-2xl text-[clamp(2.1rem,4.5vw,3.7rem)] leading-[1.03] font-light text-bark-900">
              Peças prontas para <em className="text-olive-700 italic">morar com você.</em>
            </h2>
          </div>
          <p className="max-w-xs pb-1 text-sm leading-relaxed text-walnut-500">
            Estúdio pequeno, estoque menor ainda: quando uma peça sai, a próxima só fica pronta no
            tempo do fio.
          </p>
        </div>

        <div role="group" aria-label="Filtrar peças por categoria" className="mt-10 flex flex-wrap gap-3">
          {[{ id: "todos", label: "Todas" }, ...CATEGORIES].map((cat) => {
            const isActive = filter === cat.id;
            const count = cat.id === "todos" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                aria-pressed={isActive}
                className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-bark-900 text-cream-50 shadow-lg"
                    : "border border-walnut-600/25 bg-white/50 text-walnut-600 hover:border-olive-600 hover:text-olive-700"
                }`}
              >
                {cat.label}
                <span className={`text-xs font-semibold ${isActive ? "text-sand-300" : "text-walnut-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-walnut-500" role="status">
          Exibindo <strong className="text-bark-900">{visible.length}</strong>{" "}
          {visible.length === 1 ? "peça" : "peças"}
          {filter !== "todos" && (
            <>
              {" "}em <strong className="text-olive-700">{CATEGORIES.find((c) => c.id === filter)?.label}</strong>
            </>
          )}
        </p>

        <div ref={gridRef} className="mt-8 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <p className="mt-14 text-center text-sm text-walnut-500">
          Não achou o tamanho da sua parede?{" "}
          <button
            type="button"
            onClick={() => scrollToId("contato")}
            className="font-bold text-olive-700 underline decoration-clay-400 decoration-2 underline-offset-4 transition-colors hover:text-olive-600"
          >
            Encomende uma peça sob medida
          </button>{" "}
          — respondemos em até 2 dias úteis.
        </p>
      </div>
    </section>
  );
}
