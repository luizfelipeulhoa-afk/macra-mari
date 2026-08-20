import { useEffect, useRef, useState } from "react";

/*
 * Cursor-vivo do atelier + rastro de fio.
 * — ponto de argila instantâneo + anel com atraso elástico
 * — um rastro de "fio" (SVG) que serpenteia atrás do ponteiro,
 *   como linha de macramê sendo puxada
 * — anel cresce e exibe rótulo contextual sobre [data-cursor]
 * — elementos [data-magnetic] são atraídos pelo cursor
 * Renderiza apenas com ponteiro fino e movimento permitido.
 */

const TRAIL_LEN = 22;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const trailRef = useRef<SVGPolylineElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const trail = trailRef.current;
    if (!dot || !ring || !label || !trail) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    /* rastro: pontos que seguem o cursor com atraso progressivo */
    const pts: { x: number; y: number }[] = Array.from({ length: TRAIL_LEN }, () => ({
      x: -100,
      y: -100,
    }));

    const magnetics = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    );
    const RADIUS = 96;
    const PULL = 0.3;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;

      const el = e.target as HTMLElement;
      const labelled = el.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        label.textContent = labelled.dataset.cursor || "";
        ring.classList.add("has-label");
      } else {
        ring.classList.remove("has-label");
      }

      const hot = !!(labelled || el.closest("a, button, [data-magnetic]"));
      ring.classList.toggle("cursor-hot", hot && !labelled);

      for (const m of magnetics) {
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS) {
          const k = (1 - dist / RADIUS) * PULL;
          m.style.transform = `translate(${(dx * k).toFixed(1)}px, ${(dy * k).toFixed(1)}px)`;
        } else if (m.style.transform) {
          m.style.transform = "";
        }
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;

      /* o primeiro ponto do rastro é o cursor; os demais perseguem o anterior */
      pts[0].x = x;
      pts[0].y = y;
      for (let i = 1; i < TRAIL_LEN; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.34;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.34;
      }
      trail.setAttribute(
        "points",
        pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
      );

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      magnetics.forEach((m) => (m.style.transform = ""));
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <svg className="pointer-events-none fixed inset-0 z-[95] h-full w-full" aria-hidden="true">
        <polyline
          ref={trailRef}
          fill="none"
          stroke="var(--color-clay)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
          strokeDasharray="1 7"
        />
      </svg>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
