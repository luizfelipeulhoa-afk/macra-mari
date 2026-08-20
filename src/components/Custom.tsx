import { lazy, Suspense, useMemo, useState } from "react";
import { formatBRL, products } from "../data/atelier";
import { useFineMotion } from "../lib/motion";

/* o porta-vaso 3D só entra quando for renderizar */
const Hanger3D = lazy(() => import("../three/Hanger3D"));
import { useStore, toast } from "../store/useStore";
import Reveal from "./Reveal";
import {
  BagIcon,
  CheckIcon,
  ClockIcon,
  RulerIcon,
  ThreadIcon,
} from "./Icons";

const types = [
  { id: "quadro", label: "Quadro de parede", base: 180, hint: "o clássico do atelier" },
  { id: "mandala", label: "Mandala", base: 140, hint: "círculo meditativo" },
  { id: "porta-vaso", label: "Porta-vaso", base: 70, hint: "pra planta pendurada" },
  { id: "cortina", label: "Cortina / divisor", base: 320, hint: "parede que respira" },
] as const;

const dyes = [
  { id: "cru", label: "Cru natural", hex: "#e9dfc8" },
  { id: "terracota", label: "Terracota (urucum)", hex: "#c2512b" },
  { id: "verde-musgo", label: "Verde-musgo (goiabeira)", hex: "#35573b" },
  { id: "mostarda", label: "Mostarda (açafrão)", hex: "#d89b3d" },
  { id: "carvao", label: "Carvão (casca de jabuticaba)", hex: "#3a322b" },
];

const extras = [
  { id: "franjas", label: "Franjas longas penteada", price: 25 },
  { id: "varao", label: "Varão de madeira de demolição", price: 40 },
  { id: "contas", label: "Contas de madeira torneada", price: 18 },
];

type TypeId = (typeof types)[number]["id"];

export default function Custom() {
  const addItem = useStore((s) => s.addItem);
  const setDrawer = useStore((s) => s.setDrawer);
  const [type, setType] = useState<TypeId>("quadro");
  const [width, setWidth] = useState(60);
  const [dye, setDye] = useState("terracota");
  const [sel, setSel] = useState<string[]>(["franjas"]);

  const { price, days } = useMemo(() => {
    const base = types.find((t) => t.id === type)!.base;
    const raw = base * Math.pow(width / 60, 1.25);
    const extraSum = extras
      .filter((e) => sel.includes(e.id))
      .reduce((a, e) => a + e.price, 0);
    return {
      price: Math.round((raw + extraSum) / 5) * 5,
      days: 10 + Math.round(width / 12) + (type === "cortina" ? 6 : 0),
    };
  }, [type, width, sel]);

  const toggleExtra = (id: string) =>
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const dyeName = dyes.find((d) => d.id === dye)!.label;
  const typeName = types.find((t) => t.id === type)!.label;
  const fineMotion = useFineMotion();
  const selHex = dyes.find((d) => d.id === dye)?.hex ?? "#e9dcc0";
  const hangerScale = 0.55 + ((width - 30) / 130) * 0.8;

  const order = () => {
    addItem({
      key: `sob-medida-${type}-${width}-${dye}-${sel.slice().sort().join("-")}`,
      name: `${typeName} sob medida`,
      price,
      img: products[0].img,
      meta: `${width} cm · fio ${dyeName} · ${sel.length} extra(s)`,
    });
    toast("Pedido sob medida adicionado — a Mari te chama no WhatsApp");
    setDrawer(true);
  };

  return (
    <section id="sob-medida" className="relative scroll-mt-24 border-b-2 border-ink bg-sand">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <p className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-moss">
            <RulerIcon className="h-4 w-4" /> encomenda · do seu jeito, do seu tamanho
          </p>
          <h2 className="max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight">
            Não achou no varal?
            <br />
            <span className="text-clay">A gente tece pra você.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* formulário de encomenda */}
          <Reveal delay={120} className="lg:col-span-3">
            <div className="border-2 border-ink bg-cream p-6 shadow-[8px_10px_0_rgba(44,30,19,0.14)] sm:p-8">
              <p className="mb-5 border-b-2 border-dashed border-bark/40 pb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-bark">
                ficha de encomenda nº 2026-{String(140 + width).padStart(3, "0")}
              </p>

              {/* tipo */}
              <fieldset>
                <legend className="mb-3 font-display text-lg font-bold">
                  1 · que peça é essa?
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`border-2 border-ink px-4 py-3 text-left transition-all duration-200 ${
                        type === t.id
                          ? "-translate-y-0.5 bg-ink text-cream shadow-[4px_4px_0_var(--color-clay)]"
                          : "bg-paper hover:-translate-y-0.5 hover:bg-sand"
                      }`}
                    >
                      <span className="block font-display text-[15px] font-bold leading-tight">
                        {t.label}
                      </span>
                      <span className={`mt-0.5 block font-mono text-[10px] uppercase tracking-wider ${type === t.id ? "text-cream/70" : "text-bark"}`}>
                        {t.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* largura */}
              <div className="mt-7">
                <label htmlFor="largura" className="mb-3 flex items-center justify-between font-display text-lg font-bold">
                  2 · largura
                  <span className="border-2 border-ink bg-ocre px-2.5 py-0.5 font-mono text-sm font-semibold">
                    {width} cm
                  </span>
                </label>
                <input
                  id="largura"
                  type="range"
                  min={30}
                  max={160}
                  step={5}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full cursor-pointer accent-clay"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-bark">
                  <span>30 cm · cantinho</span>
                  <span>160 cm · parede inteira</span>
                </div>
              </div>

              {/* fio */}
              <div className="mt-7">
                <p className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
                  3 · cor do fio
                  <ThreadIcon className="h-5 w-5 text-clay" />
                </p>
                <div className="flex flex-wrap gap-3">
                  {dyes.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDye(d.id)}
                      title={d.label}
                      className={`group flex flex-col items-center gap-1.5 ${dye === d.id ? "" : "opacity-80 hover:opacity-100"}`}
                    >
                      <span
                        className={`block h-11 w-11 rounded-full border-2 border-ink transition-transform duration-200 group-hover:scale-110 ${dye === d.id ? "ring-4 ring-clay ring-offset-2 ring-offset-cream" : ""}`}
                        style={{ background: d.hex }}
                      />
                      <span className={`max-w-20 text-center font-mono text-[9px] uppercase leading-tight tracking-wider ${dye === d.id ? "font-semibold text-clay" : "text-bark"}`}>
                        {d.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* extras */}
              <div className="mt-7">
                <p className="mb-3 font-display text-lg font-bold">4 · acabamentos</p>
                <div className="space-y-2.5">
                  {extras.map((e) => {
                    const on = sel.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() => toggleExtra(e.id)}
                        className={`flex w-full items-center justify-between gap-3 border-2 px-4 py-3 text-left transition-all duration-200 ${
                          on ? "border-ink bg-moss text-cream" : "border-dashed border-bark/50 bg-paper hover:border-ink"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 items-center justify-center border-2 ${on ? "border-cream bg-ocre text-ink" : "border-bark bg-cream"}`}>
                            {on && <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.6} />}
                          </span>
                          <span className="font-body text-[14px] font-semibold">{e.label}</span>
                        </span>
                        <span className={`font-mono text-[12px] ${on ? "text-cream/80" : "text-bark"}`}>
                          +{formatBRL(e.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* resumo vivo */}
          <Reveal delay={240} className="lg:col-span-2">
            <div className="border-2 border-ink bg-ink p-6 text-cream shadow-[8px_10px_0_var(--color-clay)] sm:p-8 lg:sticky lg:top-28">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
                resumo da encomenda
              </p>

              {/* prévia 3D ao vivo: cor do fio e tamanho atualizam o modelo */}
              {fineMotion && (
                <div className="mt-4 overflow-hidden border-2 border-dashed border-cream/30 bg-cream/[0.05]">
                  <div className="flex items-center justify-between border-b border-dashed border-cream/25 px-3 py-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/55">
                      prévia da tecelagem
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ocre">
                      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ocre" />
                      3d ao vivo
                    </span>
                  </div>
                  <Suspense
                    fallback={
                      <div className="grid aspect-square place-items-center font-mono text-[10px] uppercase tracking-widest text-cream/40">
                        tecendo a prévia…
                      </div>
                    }
                  >
                    <Hanger3D
                      cordHex={selHex}
                      scale={hangerScale}
                      className="aspect-square w-full"
                    />
                  </Suspense>
                </div>
              )}

              <ul className="mt-5 space-y-3 font-mono text-[13px] uppercase tracking-wider">
                <li className="flex justify-between gap-3 border-b border-dashed border-cream/25 pb-2">
                  <span className="text-cream/60">peça</span>
                  <span className="text-right">{typeName}</span>
                </li>
                <li className="flex justify-between gap-3 border-b border-dashed border-cream/25 pb-2">
                  <span className="text-cream/60">largura</span>
                  <span>{width} cm</span>
                </li>
                <li className="flex items-center justify-between gap-3 border-b border-dashed border-cream/25 pb-2">
                  <span className="text-cream/60">fio</span>
                  <span className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-cream/50"
                      style={{ background: dyes.find((d) => d.id === dye)!.hex }}
                    />
                    {dyeName.split(" ")[0]}
                  </span>
                </li>
                <li className="flex justify-between gap-3">
                  <span className="text-cream/60">acabamentos</span>
                  <span className="text-right">
                    {sel.length === 0
                      ? "nenhum"
                      : extras.filter((e) => sel.includes(e.id)).map((e) => e.label.split(" ")[0]).join(" + ")}
                  </span>
                </li>
              </ul>

              <div className="mt-7 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
                    estimativa
                  </p>
                  <p key={price} className="animate-bump font-display text-5xl font-extrabold tracking-tight text-ocre">
                    {formatBRL(price)}
                  </p>
                </div>
                <p className="flex items-center gap-2 pb-1.5 font-mono text-[11px] uppercase tracking-wider text-cream/70">
                  <ClockIcon className="h-4 w-4" />
                  pronta em ~{days} dias
                </p>
              </div>

              <button
                onClick={order}
                className="btn-knot mt-7 flex w-full items-center justify-center gap-2 border-2 border-cream bg-cream px-6 py-4 font-mono text-sm uppercase tracking-wider text-ink hover:text-cream"
                style={{ "--fill": "var(--color-clay)" } as React.CSSProperties}
              >
                <BagIcon className="h-5 w-5" />
                colocar na sacola
              </button>

              <p className="mt-4 text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider text-cream/50">
                valor final confirmado pela Mari · 50% na encomenda · fotos do tear a cada etapa
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
