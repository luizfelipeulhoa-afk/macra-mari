import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";

/*
 * Texto que se "entrelaça" ao entrar na tela: os caracteres embaralham
 * entre símbolos de nó (✳, ─, │, ╲, ╱) antes de assentar — como fios se
 * cruzando até formar a palavra.
 */

const GLYPHS = "─│╲╱╳✳·×+";

export default function ScrambleText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(prefersReducedMotion() ? text : "");
  const done = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    if (!el || done.current) return;

    let frame = 0;
    let raf = 0;
    let started = false;

    const scramble = () => {
      frame++;
      const progress = Math.min(frame / 46, 1);
      const settled = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i < settled) {
          out += text[i];
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (progress < 1) {
        raf = requestAnimationFrame(scramble);
      } else {
        setDisplay(text);
        done.current = true;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          window.setTimeout(() => {
            raf = requestAnimationFrame(scramble);
          }, delay);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display || "\u00A0"}
    </span>
  );
}
