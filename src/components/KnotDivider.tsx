import Reveal from "./Reveal";

/* Divisória-nó: dois fios de algodão que se cruzam e se amarram
   sozinhos quando o capítulo entra na tela — o mesmo gesto de
   amarrar um nó quadrado no começo de cada carreira. */
export default function KnotDivider({ label }: { label?: string }) {
  return (
    <div className="relative z-10 -my-px flex justify-center bg-paper py-5" aria-hidden="true">
      <Reveal className="flex items-center gap-4">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-bark/70 sm:block">
          {label ?? "amarra aqui"}
        </span>
        <svg viewBox="0 0 300 64" className="h-14 w-[280px] text-ink">
          {/* fios que chegam */}
          <path
            className="draw-path"
            d="M2 30 C 40 22, 70 40, 108 32"
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="draw-path"
            d="M2 44 C 44 50, 74 28, 110 36"
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* o nó se amarrando */}
          <path
            className="draw-path"
            d="M108 32 C 128 8, 158 8, 152 32 C 147 52, 175 56, 192 36"
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="draw-path"
            d="M110 36 C 128 60, 160 58, 154 34 C 149 14, 176 10, 192 32"
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle className="draw-dot" cx="151" cy="33" r="4.5" fill="var(--color-ocre)" stroke="var(--color-ink)" strokeWidth="1.5" />
          {/* fios que seguem */}
          <path
            className="draw-path"
            d="M192 36 C 226 44, 252 26, 298 34"
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            className="draw-path"
            d="M192 32 C 230 24, 258 46, 298 40"
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M6 16 l5 5 M6 21 l5 -5 M289 48 l5 5 M289 53 l5 -5" stroke="var(--color-bark)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-bark/70 sm:block">
          e continua
        </span>
      </Reveal>
    </div>
  );
}
