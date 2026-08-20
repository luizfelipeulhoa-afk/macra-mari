import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const MOTION_KEY = "mm-motion";

function readOverride(): "on" | "off" | null {
  try {
    const v = window.localStorage.getItem(MOTION_KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null;
  }
}

export function systemPrefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Deve reduzir movimento? O visitante pode sobrepor o sistema
   pelo controle "movimento" (canto inferior direito). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const override = readOverride();
  if (override === "on") return false;
  if (override === "off") return true;
  return systemPrefersReducedMotion();
}

export function isCoarsePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/* true apenas quando há ponteiro fino E movimento é permitido */
export function useFineMotion(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(!prefersReducedMotion() && !isCoarsePointer());
  }, []);
  return ok;
}

export function applyMotionClass() {
  try {
    document.documentElement.classList.toggle(
      "motion-on",
      readOverride() === "on"
    );
  } catch {
    /* noop */
  }
}

/* alterna a preferência e recarrega para o tear abrir de novo */
export function cycleMotion(): "on" | "off" {
  const next = prefersReducedMotion() ? "on" : "off";
  try {
    window.localStorage.setItem(MOTION_KEY, next);
  } catch {
    /* noop */
  }
  applyMotionClass();
  return next;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, {
      offset: -68,
      duration: 1.35,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  } else {
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }
}
