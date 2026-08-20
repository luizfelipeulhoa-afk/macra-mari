import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rot?: number;
  rotFinal?: number;
  style?: CSSProperties;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  rot = 0,
  rotFinal = 0,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={
        {
          "--rot": `${rot}deg`,
          "--rot-final": `${rotFinal}deg`,
          transitionDelay: `${delay}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
