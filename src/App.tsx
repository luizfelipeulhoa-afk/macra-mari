import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Header from "./components/Header";
import IntroScene from "./components/IntroScene";
import Hero from "./components/Hero";
import Shop from "./components/Shop";
import Collections from "./components/Collections";
import Manifesto from "./components/Manifesto";
import Custom from "./components/Custom";
import Atelier from "./components/Atelier";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Cursor from "./components/Cursor";

/* chunk do Three.js compartilhado pelas experiências 3D */
const ThreadCurtain = lazy(() => import("./three/ThreadCurtain"));
import { onToast } from "./store/useStore";
import { isCoarsePointer, prefersReducedMotion, scrollToId } from "./lib/motion";
import { KnotMark } from "./components/Icons";

gsap.registerPlugin(ScrollTrigger);

interface ToastMsg {
  id: number;
  msg: string;
}

export default function App() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  /* rolagem cinematográfica (Lenis) — desktop sem movimento reduzido */
  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  /* âncoras navegam pela rolagem suave */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!a) return;
      const href = a.getAttribute("href");
      if (href && href.length > 1) {
        e.preventDefault();
        scrollToId(href.slice(1));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* recalcula pinagens após fontes/imagens carregarem */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  /* toasts */
  useEffect(() => {
    let seq = 0;
    return onToast((msg) => {
      const id = Date.now() + seq++;
      setToasts((t) => [...t.slice(-2), { id, msg }]);
      window.setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        2600
      );
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="noise-overlay" aria-hidden="true" />
      <Cursor />
      <Suspense fallback={null}>
        <ThreadCurtain />
      </Suspense>

      <Header />

      <main>
        <Hero />
        <Shop />
        <Collections />
        <Manifesto />
        <Custom />
        <Atelier />
      </main>

      <Footer />
      <CartDrawer />

      {/* toasts */}
      <div className="pointer-events-none fixed bottom-5 left-5 z-[80] flex flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -40, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="flex items-center gap-3 border-2 border-ink bg-ink px-4 py-3 text-cream shadow-[4px_5px_0_rgba(44,30,19,0.25)]"
            >
              <KnotMark className="h-6 w-6 shrink-0 text-ocre" />
              <p className="font-mono text-[12px] uppercase tracking-wider">{t.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
