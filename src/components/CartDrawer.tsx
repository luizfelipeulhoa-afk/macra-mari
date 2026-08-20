import { useEffect, useRef } from "react";
import { selectCartCount, useStore } from "../store/useStore";
import { FREE_SHIPPING_THRESHOLD, formatBRL, getProduct } from "../data/products";
import { scrollToId, startScroll, stopScroll } from "../lib/scroll";
import { BagIcon, CheckIcon, KnotMark, MinusIcon, PlusIcon, TruckIcon, XIcon } from "./Icons";

export default function CartDrawer() {
  const cartOpen = useStore((s) => s.cartOpen);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const items = useStore((s) => s.items);
  const setQty = useStore((s) => s.setQty);
  const removeItem = useStore((s) => s.removeItem);
  const clearCart = useStore((s) => s.clearCart);
  const ordered = useStore((s) => s.ordered);
  const setOrdered = useStore((s) => s.setOrdered);
  const count = useStore(selectCartCount);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const subtotal = items.reduce((acc, l) => acc + (getProduct(l.id)?.price ?? 0) * l.qty, 0);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  useEffect(() => {
    if (cartOpen) {
      restoreRef.current = (document.activeElement as HTMLElement) ?? null;
      stopScroll();
      // dá tempo da transição começar antes de mover o foco
      const t = setTimeout(() => closeRef.current?.focus(), 60);
      return () => {
        clearTimeout(t);
        startScroll();
        restoreRef.current?.focus?.();
      };
    }
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  const closeAndGoShop = () => {
    setCartOpen(false);
    setTimeout(() => scrollToId("loja"), 80);
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[70] bg-bark-950/55 backdrop-blur-[2px] transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrinho-titulo"
        className={`fixed top-0 right-0 z-[75] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          cartOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-walnut-600/10 px-6 py-5">
          <h2 id="carrinho-titulo" className="font-display text-2xl font-medium text-bark-900">
            Seu carrinho
            {count > 0 && <span className="ml-2 text-base text-walnut-500">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Fechar carrinho"
            className="flex h-12 w-12 items-center justify-center rounded-full text-walnut-600 transition-colors hover:bg-sand-200/70 hover:text-olive-700"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </header>

        {ordered ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-olive-600 text-cream-50">
              <CheckIcon className="h-10 w-10" />
            </span>
            <h3 className="font-display text-3xl font-light text-bark-900">Pedido confirmado!</h3>
            <p className="text-sm leading-relaxed text-walnut-600">
              Este é um pedido de demonstração — mas a vontade de tecer para você é de verdade. Em uma
              loja real, você receberia a confirmação por e-mail agora.
            </p>
            <button
              type="button"
              onClick={() => {
                clearCart();
                setCartOpen(false);
              }}
              className="mt-2 inline-flex h-12 items-center rounded-full bg-bark-900 px-7 text-sm font-bold tracking-wide text-cream-50 uppercase transition-colors hover:bg-olive-700"
            >
              Voltar para a loja
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-walnut-600/25 text-sand-400">
              <KnotMark className="h-12 w-12" />
            </span>
            <h3 className="font-display text-2xl font-light text-bark-900">Seu carrinho está vazio</h3>
            <p className="text-sm text-walnut-600">
              Cada peça daqui saiu de um novelo com história. Que tal escolher a sua?
            </p>
            <button
              type="button"
              onClick={closeAndGoShop}
              className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-bark-900 px-7 text-sm font-bold tracking-wide text-cream-50 uppercase transition-colors hover:bg-olive-700"
            >
              <BagIcon className="h-4 w-4" />
              Ver as peças
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-walnut-600/10 px-6 py-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-walnut-600">
                <TruckIcon className="h-5 w-5 text-olive-600" />
                {missing > 0 ? (
                  <span>
                    Faltam <strong className="text-bark-900">{formatBRL(missing)}</strong> para frete grátis
                  </span>
                ) : (
                  <span className="text-olive-700">
                    <CheckIcon className="mr-1 inline h-4 w-4" /> Frete grátis garantido!
                  </span>
                )}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand-200" role="presentation">
                <div
                  className="h-full rounded-full bg-olive-600 transition-all duration-700 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-walnut-600/10 overflow-y-auto px-6">
              {items.map((line) => {
                const product = getProduct(line.id);
                if (!product) return null;
                return (
                  <li key={line.id} className="flex gap-4 py-5">
                    <span className="texture-weave flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-walnut-600/15 bg-sand-100 text-clay-500">
                      <KnotMark className="h-8 w-8" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-lg leading-tight font-medium text-bark-900">{product.name}</h3>
                      <p className="text-sm text-walnut-500">{formatBRL(product.price)} cada</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty - 1)}
                          aria-label={`Diminuir quantidade de ${product.name}`}
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-walnut-600/25 text-walnut-600 transition-colors hover:border-olive-600 hover:text-olive-700"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-lg font-bold text-bark-900" aria-live="polite">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty + 1)}
                          aria-label={`Aumentar quantidade de ${product.name}`}
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-walnut-600/25 text-walnut-600 transition-colors hover:border-olive-600 hover:text-olive-700"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between py-1">
                      <p className="font-display text-lg font-medium text-bark-900">
                        {formatBRL(product.price * line.qty)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        className="inline-flex min-h-[48px] items-center text-xs font-bold tracking-wide text-walnut-500 uppercase underline decoration-walnut-500/40 underline-offset-4 transition-colors hover:text-clay-600"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-walnut-600/10 bg-cream-100 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold tracking-wide text-walnut-600 uppercase">Subtotal</span>
                <span className="font-display text-3xl font-medium text-bark-900">{formatBRL(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-walnut-500">
                Produção artesanal: envio em até 10 dias úteis, com embalagem de papel-semente.
              </p>
              <button
                type="button"
                onClick={() => setOrdered(true)}
                className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-bark-900 text-sm font-bold tracking-[0.14em] text-cream-50 uppercase transition-colors duration-300 hover:bg-olive-700"
              >
                <CheckIcon className="h-5 w-5" />
                Finalizar pedido
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-2 flex min-h-[48px] w-full items-center justify-center text-sm font-bold text-walnut-600 underline decoration-clay-400 decoration-2 underline-offset-4 transition-colors hover:text-olive-700"
              >
                Continuar olhando as tramas
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
