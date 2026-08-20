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
      className={`fixed bottom-4 right-4 z-[66] flex items-center gap-2 border-2 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[3px_4px_0_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5 ${
        reduced
          ? "border-cream bg-clay text-cream"
          : "border-ink bg-cream text-ink hover:bg-sand"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          reduced ? "bg-cream" : "animate-pulse-dot bg-moss"
        }`}
      />
      {reduced
        ? sysReduced
          ? "ativar movimento"
          : "movimento: desligado"
        : "movimento: ligado"}
    </button>
  );
}
