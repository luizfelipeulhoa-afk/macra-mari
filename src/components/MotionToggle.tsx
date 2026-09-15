import { useState } from "react";
import { cycleMotion, prefersReducedMotion, systemPrefersReducedMotion } from "../lib/motion";

/*
 * Controle de movimento — sempre visível.
 * Se o sistema do visitante pede movimento reduzido, o site inteiro
 * fica estático por respeito; este botão permite ligar as animações
 * (e vice-versa). A escolha fica salva e o tear toca de novo.
 */
export default function MotionToggle() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  const onClick = () => {
    const next = cycleMotion();
    setReduced(next === "off");
    window.setTimeout(() => window.location.reload(), 120);
  };

  const sysReduced = systemPrefersReducedMotion();

  return (
    <button
      onClick={onClick}
      aria-pressed={!reduced}
      title={
        reduced
          ? "Ligar as animações do atelier"
          : "Desligar as animações (movimento reduzido)"
      }
      className={`fixed right-4 bottom-16 sm:bottom-6 z-[66] flex cursor-pointer items-center gap-2 border px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 ${
        reduced
          ? "border-cream bg-clay text-cream"
          : "border-ink bg-cream text-ink hover:bg-sand"
      }`}
    >
      <span className="whitespace-nowrap">
        {reduced
          ? sysReduced
            ? "ativar movimento"
            : "movimento: desligado"
          : "pausar movimento"}
      </span>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          reduced ? "bg-cream" : "animate-pulse-dot bg-moss"
        }`}
      />
    </button>
  );
}
