import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import Shop from "./components/Shop";
import Atelier from "./components/Atelier";
import Sustainability from "./components/Sustainability";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { CheckIcon } from "./components/Icons";
import { useStore } from "./store/useStore";
import { isMobileViewport, prefersReducedMotion, setLenis } from "./lib/scroll";

gsap.registerPlugin(ScrollTrigger);

function Toast() {
  const toast = useStore((s) => s.toast);
  const toastKey = useStore((s) => s.toastKey);
  const clearToast = useStore((s) => s.clearToast);
  const setCartOpen = useStore((s) => s.setCartOpen);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, toastKey, clearToast]);

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[80] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 sm:left-8 sm:translate-x-0"
      role="status"
      aria-live="polite"
    >
      {toast && (
        <div
          key={toastKey}
          className="animate-toast-in pointer-events-auto flex h-14 items-center gap-3 rounded-full border border-cream-50/10 bg-bark-950 pr-3 pl-5 text-cream-50 shadow-2xl"
        >
          <CheckIcon className="h-5 w-5 shrink-0 text-olive-300" />
          <span className="text-sm font-semibold">{toast}</span>
          <button
            type="button"
            onClick={() => {
              clearToast();
              setCartOpen(true);
            }}
            className="ml-1 h-10 shrink-0 rounded-full bg-olive-700 px-4 text-xs font-bold tracking-wide text-cream-50 uppercase transition-colors duration-300 hover:bg-olive-600"
          >
            Ver
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const motionOn = useStore((s) => s.motionOn);
  const setMotionOn = useStore((s) => s.setMotionOn);

  // respeita prefers-reduced-motion do sistema operacional
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMotionOn(false);
    const onChange = (e: MediaQueryListEvent) => setMotionOn(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setMotionOn]);

  // espelha o estado de animação no <html> para as animações CSS
  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? "on" : "off";
  }, [motionOn]);

  // rolagem suave (Lenis) sincronizada com o GSAP ScrollTrigger
  useEffect(() => {
    if (!motionOn || isMobileViewport() || prefersReducedMotion()) {
      setLenis(null);
      ScrollTrigger.refresh();
      return;
    }
    const lenis = new Lenis({ duration: 1.15 });
    lenis.on("scroll", () => ScrollTrigger.update());
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
      ScrollTrigger.refresh();
    };
  }, [motionOn]);

  return (
    <div className="relative">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-bark-900 focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:text-cream-50"
      >
        Pular para o conteúdo
      </a>

      <div className="grain" aria-hidden="true" />

      <Header />

      <main id="conteudo">
        <Hero />
        <Collections />
        <Shop />
        <Atelier />
        <Sustainability />
      </main>

      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}
