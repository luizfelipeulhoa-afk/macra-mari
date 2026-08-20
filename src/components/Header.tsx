import { useEffect, useState } from "react";
import { useStore, cartCount } from "../store/useStore";
import { KnotMark, BagIcon, CloseIcon } from "./Icons";

const navLinks = [
  { href: "#pecas", label: "Peças" },
  { href: "#colecoes", label: "Coleções" },
  { href: "#sob-medida", label: "Sob medida" },
  { href: "#atelier", label: "Atelier" },
];

function openState(): { open: boolean; label: string } {
  const now = new Date();
  const day = now.getDay(); // 0 dom … 6 sáb
  const h = now.getHours() + now.getMinutes() / 60;
  if (day >= 2 && day <= 5 && h >= 10 && h < 18)
    return { open: true, label: "atelier aberto · até 18h" };
  if (day === 6 && h >= 10 && h < 14)
    return { open: true, label: "atelier aberto · até 14h" };
  return { open: false, label: "fechado agora · respondo no próximo turno" };
}

export default function Header() {
  const items = useStore((s) => s.items);
  const setDrawer = useStore((s) => s.setDrawer);
  const count = cartCount(items);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const status = openState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 border-ink bg-paper transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_0_rgba(44,30,19,0.12)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* marca */}
        <a href="#inicio" className="group flex items-center gap-2.5">
          <KnotMark className="h-9 w-9 text-clay transition-transform duration-500 group-hover:rotate-180" />
          <span className="leading-none">
            <span className="block font-display text-xl font-extrabold tracking-tight">
              Macra&nbsp;Mari
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-bark">
              atelier de macramê
            </span>
          </span>
        </a>

        {/* nav desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-mono text-[13px] uppercase tracking-[0.14em] text-ink transition-colors hover:text-clay"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-clay transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* status */}
          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-bark md:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                status.open ? "bg-moss animate-pulse-dot" : "bg-clay"
              }`}
            />
            {status.label}
          </span>

          {/* sacola */}
          <button
            onClick={() => setDrawer(true)}
            className="btn-knot relative flex items-center gap-2 border-2 border-ink bg-cream px-3.5 py-2 font-mono text-[13px] uppercase tracking-wider hover:text-cream"
            style={{ "--fill": "var(--color-clay)" } as React.CSSProperties}
            aria-label="Abrir sacola de compras"
          >
            <BagIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Sacola</span>
            {count > 0 && (
              <span
                key={count}
                className="animate-bump absolute -right-2.5 -top-2.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-clay px-1 font-mono text-[12px] font-semibold text-cream shadow-[2px_2px_0_rgba(44,30,19,0.3)]"
              >
                {count}
              </span>
            )}
          </button>

          {/* menu mobile */}
          <button
            onClick={() => setMenu(!menu)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border-2 border-ink bg-cream lg:hidden"
            aria-label="Abrir menu"
          >
            {menu ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <>
                <span className="h-[2px] w-5 bg-ink" />
                <span className="h-[2px] w-5 bg-ink" />
                <span className="h-[2px] w-3.5 self-start ml-2.5 bg-ink" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* menu mobile aberto */}
      {menu && (
        <nav className="border-t-2 border-ink bg-cream px-6 py-4 lg:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              className="flex items-center justify-between border-b border-dashed border-bark/30 py-3 font-display text-2xl font-bold hover:text-clay"
            >
              {l.label}
              <span className="font-mono text-xs text-bark">→</span>
            </a>
          ))}
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-bark">
            {status.label}
          </p>
        </nav>
      )}
    </header>
  );
}
