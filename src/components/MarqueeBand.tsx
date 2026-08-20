const knots = [
  "nó quadrado",
  "meio-nó",
  "nó festonê",
  "espiral",
  "cabeça de cotovia",
  "trança de três",
  "ponto de cruz trançado",
];

/* Letreiro de nós em direção contrária ao do hero —
   tipografia gigante contornada sobre banda de ocre. */
export default function MarqueeBand() {
  return (
    <div className="relative z-20 -my-4 rotate-1 overflow-hidden border-y-2 border-ink bg-ocre py-4">
      <div className="marquee-track-reverse gap-0">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {knots.map((k) => (
              <span key={`${copy}-${k}`} className="flex items-center whitespace-nowrap">
                <span className="outline-text px-7 font-display text-3xl font-extrabold uppercase leading-none tracking-tight md:text-5xl">
                  {k}
                </span>
                <span className="inline-block h-3 w-3 rotate-45 border-2 border-ink bg-clay" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
