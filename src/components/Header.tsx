import { useEffect, useState } from "react";
import { selectCartCount, useStore } from "../store/useStore";
import { scrollToId } from "../lib/scroll";
import { CATEGORIES } from "../data/products";
import { BagIcon, KnotMark, MenuIcon, PauseIcon, PlayIcon, XIcon } from "./Icons";

const NAV = [
  { id: "colecoes", label: "Coleções" },
  { id: "loja", label: "Loja" },
  { id: "atelier", label: "Atelier" },
  { id: "sustentabilidade", label: "Sustentabilidade" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useStore(selectCartCount);
  const motionOn = useStore((s) => s.motionOn);
  const setMotionOn = useStore((s) => s.setMotionOn);
  const setCartOpen = useStore((s) => s.setCartOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <p className="bg-bark-950 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-cream-100 uppercase">
        Frete grátis acima de R$ 249 · cada peça é tecida à mão em Tiradentes — MG
      </p>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-sand-100/95 py-2 shadow-[0_2px_28px_rgba(78,55,31,0.12)] backdrop-blur-md"
            : "bg-white/65 py-4 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <button
            type="button"
            onClick={() => go("inicio")}
            className="group flex min-h-[48px] items-center gap-2.5"
            aria-label="Macra Mari — voltar ao início"
          >
            <KnotMark className="h-8 w-8 text-olive-600 transition-transform duration-500 group-hover:rotate-90" />
            <span className="text-left leading-none">
              <span className="font-display block text-[22px] font-medium tracking-tight text-bark-900">
                Macra <em className="text-olive-700 italic">Mari</em>
              </span>
              <span className="mt-1 hidden text-[9px] font-bold tracking-[0.34em] text-walnut-500 uppercase sm:block">
                macramê autoral
              </span>
            </span>
          </button>

          <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className="min-h-[48px] px-4 text-[13px] font-bold tracking-[0.14em] text-walnut-600 uppercase transition-colors hover:text-olive-700"
              >
                <span className="border-b-2 border-transparent pb-1 transition-colors duration-300 hover:border-olive-600">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMotionOn(!motionOn)}
              aria-pressed={!motionOn}
              aria-label={motionOn ? "Pausar animações do site" : "Retomar animações do site"}
              title={motionOn ? "Pausar animações" : "Retomar animações"}
              className="flex h-12 w-12 items-center justify-center rounded-full text-walnut-600 transition-colors hover:bg-sand-200/70 hover:text-olive-700"
            >
              {motionOn ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </button>

            <button
              type="button"
              id="cart-button"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
              className="relative flex h-12 w-12 items-center justify-center rounded-full text-walnut-600 transition-colors hover:bg-sand-200/70 hover:text-olive-700"
            >
              <BagIcon className="h-6 w-6" />
              {count > 0 && (
                <span
                  key={count}
                  className="animate-badge-pop absolute top-0.5 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-bark-900 px-1 text-[11px] font-bold text-cream-50"
                >
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="flex h-12 w-12 items-center justify-center rounded-full text-walnut-600 transition-colors hover:bg-sand-200/70 hover:text-olive-700 lg:hidden"
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* menu mobile */}
        <div
          id="menu-mobile"
          className={`overflow-hidden border-walnut-600/10 transition-all duration-500 lg:hidden ${
            menuOpen ? "max-h-[560px] border-t" : "max-h-0"
          } bg-cream-100/98 backdrop-blur-md`}
        >
          <nav aria-label="Navegação móvel" className="px-6 py-6">
            <ul className="space-y-1">
              {NAV.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="flex min-h-[52px] w-full items-baseline gap-4 text-left"
                  >
                    <span className="text-[11px] font-bold tracking-[0.2em] text-clay-500">0{i + 1}</span>
                    <span className="font-display text-3xl font-light text-bark-900 transition-colors hover:text-olive-700">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-walnut-600/10 pt-5 text-xs font-semibold tracking-[0.14em] text-walnut-500 uppercase">
              Coleções
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    useStore.getState().setFilter(c.id);
                    go("loja");
                  }}
                  className="h-11 rounded-full border border-walnut-600/25 px-5 text-sm font-semibold text-walnut-600 transition-colors hover:border-olive-600 hover:text-olive-700"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
