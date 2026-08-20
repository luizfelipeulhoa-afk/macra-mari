import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Shop from "./components/Shop";
import Collections from "./components/Collections";
import Custom from "./components/Custom";
import Atelier from "./components/Atelier";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { onToast } from "./store/useStore";
import { KnotMark } from "./components/Icons";

interface ToastMsg {
  id: number;
  msg: string;
}

export default function App() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

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

      <Header />

      <main>
        <Hero />
        <Shop />
        <Collections />
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
