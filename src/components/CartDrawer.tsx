import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { formatBRL } from "../data/atelier";
import { useStore, cartTotal, cartCount } from "../store/useStore";
import {
  BagIcon,
  CheckIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "./Icons";

const FREE_SHIPPING = 250;

type Phase = "cart" | "processing" | "done";

export default function CartDrawer() {
  const items = useStore((s) => s.items);
  const open = useStore((s) => s.drawerOpen);
  const setDrawer = useStore((s) => s.setDrawer);
  const inc = useStore((s) => s.inc);
  const dec = useStore((s) => s.dec);
  const remove = useStore((s) => s.remove);
  const clear = useStore((s) => s.clear);

  const [phase, setPhase] = useState<Phase>("cart");
  const [orderCode, setOrderCode] = useState("");

  const total = cartTotal(items);
  const count = cartCount(items);
  const missing = Math.max(0, FREE_SHIPPING - total);
  const progress = Math.min(100, (total / FREE_SHIPPING) * 100);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) setPhase("cart");
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const checkout = () => {
    setPhase("processing");
    window.setTimeout(() => {
      const code = `MM-${Date.now().toString(36).slice(-5).toUpperCase()}`;
      setOrderCode(code);
      setPhase("done");
      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#c2512b", "#35573b", "#d89b3d", "#fbf6ea", "#2c1e13"],
      });
    }, 1500);
  };

  const finish = () => {
    clear();
    setDrawer(false);
    setPhase("cart");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l-2 border-ink bg-paper shadow-[-10px_0_0_rgba(44,30,19,0.15)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            role="dialog"
            aria-label="Sacola de compras"
          >
            {/* cabeçalho */}
            <div className="flex items-center justify-between border-b-2 border-ink bg-cream px-5 py-4">
              <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight">
                <BagIcon className="h-6 w-6 text-clay" />
                Sua sacola
                {count > 0 && (
                  <span className="border-2 border-ink bg-ocre px-2 py-0.5 font-mono text-[12px] font-semibold">
                    {count}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setDrawer(false)}
                className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper transition-colors hover:bg-clay hover:text-cream"
                aria-label="Fechar sacola"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {phase === "done" ? (
              /* ——— pedido confirmado ——— */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-ink bg-moss text-cream"
                >
                  <CheckIcon className="h-10 w-10" strokeWidth={2.4} />
                </motion.span>
                <h3 className="font-display text-3xl font-extrabold tracking-tight">
                  Encomenda no tear!
                </h3>
                <p className="text-[15px] leading-relaxed text-bark">
                  Seu pedido <strong className="font-mono text-clay">{orderCode}</strong> foi
                  recebido. A Mari te chama no WhatsApp pra combinar pagamento e envio —
                  e manda foto de cada etapa.
                </p>
                <button
                  onClick={finish}
                  className="btn-knot mt-2 border-2 border-ink bg-ink px-6 py-3 font-mono text-sm uppercase tracking-wider text-cream hover:text-ink"
                  style={{ "--fill": "var(--color-ocre)" } as React.CSSProperties}
                >
                  continuar tecendo
                </button>
              </div>
            ) : items.length === 0 ? (
              /* ——— sacola vazia ——— */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center border-2 border-dashed border-bark/50 text-bark">
                  <BagIcon className="h-9 w-9" />
                </span>
                <h3 className="font-display text-2xl font-extrabold">Sacola vazia…</h3>
                <p className="text-[15px] text-bark">
                  O varal está cheio de peças esperando um lugar pra morar.
                </p>
                <a
                  href="#pecas"
                  onClick={() => setDrawer(false)}
                  className="btn-knot mt-2 border-2 border-ink bg-clay px-6 py-3 font-mono text-sm uppercase tracking-wider text-cream hover:text-clay"
                  style={{ "--fill": "var(--color-ink)" } as React.CSSProperties}
                >
                  ver o varal
                </a>
              </div>
            ) : (
              /* ——— itens ——— */
              <>
                {/* frete grátis */}
                <div className="border-b-2 border-dashed border-bark/40 bg-cream px-5 py-4">
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-bark">
                    <TruckIcon className="h-4 w-4 text-moss" />
                    {missing > 0 ? (
                      <>
                        faltam <strong className="text-clay">{formatBRL(missing)}</strong> pro frete grátis
                      </>
                    ) : (
                      <span className="font-semibold text-moss">✓ frete grátis garantido!</span>
                    )}
                  </p>
                  <div className="mt-2 h-2.5 border border-ink bg-paper">
                    <div
                      className="h-full bg-moss transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y-2 divide-dashed divide-bark/30 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.key}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, transition: { duration: 0.22 } }}
                        className="flex gap-3.5 py-4"
                      >
                        <span className="img-zoom block h-20 w-16 shrink-0 overflow-hidden border-2 border-ink bg-sand">
                          <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
                        </span>
                        <span className="flex flex-1 flex-col">
                          <span className="flex items-start justify-between gap-2">
                            <span className="font-display text-[16px] font-bold leading-tight">{it.name}</span>
                            <button
                              onClick={() => remove(it.key)}
                              className="text-bark transition-colors hover:text-clay"
                              aria-label={`Remover ${it.name}`}
                            >
                              <CloseIcon className="h-4 w-4" />
                            </button>
                          </span>
                          <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-bark">
                            {it.meta}
                          </span>
                          <span className="mt-auto flex items-center justify-between pt-2">
                            <span className="flex items-center border-2 border-ink">
                              <button
                                onClick={() => dec(it.key)}
                                className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-sand"
                                aria-label="Diminuir quantidade"
                              >
                                <MinusIcon className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center font-mono text-[13px] font-semibold">{it.qty}</span>
                              <button
                                onClick={() => inc(it.key)}
                                className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-sand"
                                aria-label="Aumentar quantidade"
                              >
                                <PlusIcon className="h-3.5 w-3.5" />
                              </button>
                            </span>
                            <span className="font-display text-lg font-extrabold">
                              {formatBRL(it.price * it.qty)}
                            </span>
                          </span>
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* rodapé */}
                <div className="border-t-2 border-ink bg-cream px-5 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-bark">
                      subtotal
                    </span>
                    <span key={total} className="animate-bump font-display text-3xl font-extrabold tracking-tight">
                      {formatBRL(total)}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-bark/70">
                    frete calculado no whatsapp · embalado em papel de seda
                  </p>
                  <button
                    onClick={checkout}
                    disabled={phase === "processing"}
                    className="btn-knot mt-4 flex w-full items-center justify-center gap-2 border-2 border-ink bg-clay px-6 py-4 font-mono text-sm uppercase tracking-wider text-cream hover:text-clay disabled:opacity-70"
                    style={{ "--fill": "var(--color-cream)" } as React.CSSProperties}
                  >
                    {phase === "processing" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
                        passando o fio…
                      </>
                    ) : (
                      <>finalizar encomenda</>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
