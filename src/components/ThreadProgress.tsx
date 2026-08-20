import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* Fio da página: um fio vertical fixo na lateral que se preenche
   conforme a leitura avança, com um nó de argila na ponta. */
export default function ThreadProgress() {
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const knotRef = useRef<HTMLSpanElement | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setEnabled(false);
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        onUpdate: (self) => {
          if (fillRef.current) {
            fillRef.current.style.transform = `scaleY(${self.progress.toFixed(4)})`;
          }
          if (knotRef.current) {
            knotRef.current.style.top = `${(self.progress * 100).toFixed(2)}%`;
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      aria-hidden="true"
    >
      <span className="rotate-180 font-mono text-[9px] uppercase tracking-[0.34em] text-bark/70 [writing-mode:vertical-rl]">
        fio da leitura
      </span>
      <span className="relative block h-[34vh] w-px bg-ink/15">
        <span ref={fillRef} className="thread-progress-fill absolute inset-0 bg-clay" />
        <span
          ref={knotRef}
          className="absolute -left-[4.5px] top-0 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border border-ink bg-clay shadow-[1px_1px_0_rgba(44,30,19,0.3)]"
        />
      </span>
      <KnotGlyph className="h-5 w-5 text-bark/70" />
    </div>
  );
}

function KnotGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M7 4c5 2 5 5 5 8s0 6-5 8M17 4c-5 2-5 5-5 8s0 6 5 8" />
    </svg>
  );
}
