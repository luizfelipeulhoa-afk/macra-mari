import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, cartCount } from "../store/useStore";
import {
  BagIcon,
  CloseIcon,
  InstagramIcon,
  KnotMark,
  MailIcon,
  WhatsIcon,
} from "./Icons";

const navLinks: { label: string; href: string; id: string }[] = [
  { label: "O varal", href: "#pecas", id: "pecas" },
  { label: "Coleções", href: "#colecoes", id: "colecoes" },
  { label: "Sob medida", href: "#sob-medida", id: "sob-medida" },
  { label: "Atelier", href: "#atelier", id: "atelier" },
  { label: "Contato", href: "#contato", id: "contato" },
];

const overlayVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 46, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const },
  },
};

export default function Header() {
  const items = useStore((s) => s.items);
  const setDrawer = useStore((s) => s.setDrawer);
  const count = cartCount(items);

  const [scrolled, setScrolled] = useState(false);
  const [overIntro, setOverIntro] = useState(true);
  const [active, setActive] = useState("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  /* header reage ao scroll: encolhe, ganha corpo e sabe quando
     ainda está sobre o intro escuro (para trocar a cor do texto) */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const hero = document.getElementById("inicio");
      const heroTop = hero ? hero.offsetTop : 0;
      setScrolled(y > 30);
      setOverIntro(y < heroTop - 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* scroll-spy: destaca o capítulo visível */
  useEffect(() => {
    const ids = ["inicio", ...navLinks.map((l) => l.id)];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* badge da sacola "pula" quando ganha peça */
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 450);
      prevCount.current = count;
      return () => window.clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  /* Esc fecha o menu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b-2 transition-all duration-300 ${
          overIntro
            ? "border-transparent bg-transparent py-4 text-cream"
            : scrolled
              ? "border-ink bg-cream/95 py-2 text-ink shadow-[0_3px_0_rgba(44,30,19,0.12)]"
              : "border-transparent bg-transparent py-4 text-ink"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#inicio" className="group flex items-center gap-2.5">
            <KnotMark className={`h-8 w-8 transition-transform duration-500 group-hover:rotate-180 ${overIntro ? "text-ocre" : "text-clay"}`} />
            <span className="font-display text-[22px] font-extrabold leading-none tracking-tight">
              Macra<span className={overIntro ? "text-ocre" : "text-clay"}>Mari</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className={`group relative font-mono text-[12px] uppercase tracking-[0.16em] transition-colors ${
                  active === l.id
                    ? overIntro
                      ? "text-ocre"
                      : "text-clay"
                    : overIntro
                      ? "text-cream hover:text-ocre"
                      : "text-ink hover:text-clay"
                }`}
              >
                <span
                  className={`absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-clay transition-all duration-300 ${
                    active === l.id ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawer(true)}
              className={`relative flex h-11 items-center gap-2 border-2 px-3.5 transition-all duration-200 ${
                overIntro
                  ? "border-cream bg-transparent hover:bg-cream hover:text-ink"
                  : "border-ink bg-cream hover:bg-ink hover:text-cream"
              }`}
              aria-label={`Abrir sacola (${count} itens)`}
            >
              <BagIcon className="h-5 w-5" />
              <span className="hidden font-mono text-[12px] uppercase tracking-wider sm:inline">
                Sacola
              </span>
              {count > 0 && (
                <span
                  className={`absolute -right-2.5 -top-2.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-ink bg-clay px-1 font-mono text-[11px] font-bold text-cream ${
                    bump ? "animate-bump" : ""
                  }`}
                >
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 border-2 transition-colors ${
                overIntro
                  ? "border-cream bg-transparent hover:bg-cream hover:text-ink"
                  : "border-ink bg-cream hover:bg-ink hover:text-cream"
              }`}
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <span className="h-0.5 w-5 bg-current" />
              <span className="h-0.5 w-3.5 self-center bg-current" style={{ marginLeft: "-6px" }} />
              <span className="h-0.5 w-5 bg-current" />
            </button>
          </div>
        </div>
      </header>

      {/* menu de tela cheia — a navegação vira parte da experiência */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            className="weave fixed inset-0 z-[65] flex flex-col bg-moss-deep text-cream"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <svg
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -bottom-40 -right-40 h-[62vmin] w-[62vmin] animate-spin-slow text-cream/10"
              aria-hidden="true"
            >
              <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 10" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={i}
                  d="M200 60 C 214 96, 214 124, 200 150 C 186 124, 186 96, 200 60 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  transform={`rotate(${i * 30} 200 200)`}
                />
              ))}
            </svg>

            <div className="flex items-center justify-between border-b-2 border-cream/20 px-5 py-4 sm:px-8">
              <span className="flex items-center gap-2.5">
                <KnotMark className="h-8 w-8 text-ocre" />
                <span className="font-display text-[22px] font-extrabold tracking-tight">
                  Macra<span className="text-ocre">Mari</span>
                </span>
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center border-2 border-cream/40 transition-colors hover:border-ocre hover:text-ocre"
                aria-label="Fechar menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <motion.nav
              className="flex flex-1 flex-col justify-center gap-1 px-6 sm:px-14"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              aria-label="Menu"
            >
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  variants={itemVariants}
                  className="group flex items-baseline gap-4 border-b border-dashed border-cream/15 py-3.5 transition-transform duration-300 hover:translate-x-3 sm:py-5"
                >
                  <span className="font-mono text-[12px] text-ocre">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(2rem,7vw,4rem)] font-extrabold leading-none tracking-tight transition-colors group-hover:text-ocre">
                    {l.label}
                  </span>
                  <span
                    className={`ml-auto h-3 w-3 rotate-45 border-2 border-ocre transition-all duration-300 ${
                      active === l.id ? "bg-ocre" : "bg-transparent opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </motion.a>
              ))}
            </motion.nav>

            <motion.div
              className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-cream/20 px-5 py-5 sm:px-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse-dot rounded-full bg-ocre align-middle" />
                atelier aberto · ter–sex 10h–18h · florianópolis
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: WhatsIcon, label: "WhatsApp" },
                  { icon: InstagramIcon, label: "Instagram" },
                  { icon: MailIcon, label: "E-mail" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-cream/40 transition-colors hover:border-ocre hover:text-ocre"
                    title={s.label}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
