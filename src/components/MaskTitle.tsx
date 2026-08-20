import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

export interface TitleLine {
  text: string;
  className?: string;
}

/* Título com revelação por máscara de linha: cada linha sobe de
   dentro do próprio recorte quando entra na viewport — a mesma
   assinatura tipográfica do hero, aplicada ao site inteiro. */
export default function MaskTitle({
  lines,
  className = "",
  stagger = 0.1,
}: {
  lines: TitleLine[];
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.to(el.querySelectorAll(".tline-inner"), {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      }, el);
    } catch {
      el.querySelectorAll<HTMLElement>(".tline-inner").forEach(
        (n) => (n.style.transform = "none")
      );
    }

    return () => ctx?.revert();
  }, [stagger]);

  return (
    <h2 ref={ref} className={`mask-title ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="tline block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span className={`tline-inner ${l.className ?? ""}`}>{l.text}</span>
        </span>
      ))}
    </h2>
  );
}
