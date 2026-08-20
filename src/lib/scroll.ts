import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function hasFinePointer(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Rolagem até uma seção — usa Lenis quando disponível, com fallback nativo. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -68, duration: 1.25 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export function stopScroll() {
  if (lenisInstance) lenisInstance.stop();
  document.documentElement.style.overflow = "hidden";
}

export function startScroll() {
  if (lenisInstance) lenisInstance.start();
  document.documentElement.style.overflow = "";
}
