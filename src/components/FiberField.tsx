import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/* ————————————————————————————————————————————————
   Fundo vivo da abertura: fios de algodão balançando
   devagar + poeira de luz quente subindo, como o ar de
   um atelier. Desenhado em canvas, pausa fora da tela e
   com a aba oculta; com movimento reduzido vira um quadro
   estático.
   ———————————————————————————————————————————————— */
export default function FiberField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = prefersReducedMotion();

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const palette = ["243,236,221", "216,155,61", "194,81,43", "230,217,191"];

    type Fiber = {
      x: number; y: number; len: number; amp: number;
      phase: number; speed: number; alpha: number; c: string; drift: number;
    };
    const fibers: Fiber[] = [];
    const bokeh: { x: number; y: number; r: number; a: number; vy: number; vx: number; c: string }[] = [];

    const seed = () => {
      fibers.length = 0;
      bokeh.length = 0;
      const nf = Math.max(22, Math.min(44, Math.floor(w / 32)));
      for (let i = 0; i < nf; i++) {
        fibers.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: 70 + Math.random() * 170,
          amp: 14 + Math.random() * 34,
          phase: Math.random() * Math.PI * 2,
          speed: 0.18 + Math.random() * 0.45,
          alpha: 0.05 + Math.random() * 0.1,
          c: palette[i % palette.length],
          drift: 6 + Math.random() * 20,
        });
      }
      for (let i = 0; i < 26; i++) {
        bokeh.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.5 + Math.random() * 3.6,
          a: 0.05 + Math.random() * 0.13,
          vy: -(0.08 + Math.random() * 0.24),
          vx: (Math.random() - 0.5) * 0.12,
          c: palette[i % palette.length],
        });
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const f of fibers) {
        const sway = Math.sin(t * f.speed + f.phase) * f.amp;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.quadraticCurveTo(
          f.x + sway,
          f.y + f.len * 0.5,
          f.x + Math.sin(t * f.speed * 0.7 + f.phase) * f.drift,
          f.y + f.len
        );
        ctx.strokeStyle = `rgba(${f.c},${f.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      for (const b of bokeh) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.c},${b.a})`;
        ctx.fill();
      }
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0);
    };

    const step = (ms: number) => {
      const t = ms / 1000;
      for (const b of bokeh) {
        b.y += b.vy;
        b.x += b.vx;
        if (b.y < -12) { b.y = h + 12; b.x = Math.random() * w; }
        if (b.x < -12) b.x = w + 12;
        if (b.x > w + 12) b.x = -12;
      }
      draw(t);
      raf = requestAnimationFrame(step);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(step); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      draw(0);
      return () => window.removeEventListener("resize", resize);
    }

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; visible && !document.hidden ? start() : stop(); },
      { threshold: 0 }
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : visible && start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
