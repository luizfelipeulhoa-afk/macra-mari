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
      className={`fixed left-0 top-1/2 z-[66] flex -translate-x-[calc(100%-22px)] -translate-y-1/2 cursor-pointer items-center gap-2.5 border-2 border-l-0 py-3.5 pl-1.5 pr-2.5 font-mono text-[11px] uppercase tracking-[0.18em] shadow-[3px_4px_0_rgba(0,0,0,0.25)] transition-transform duration-300 hover:translate-x-0 focus-visible:translate-x-0 ${
        reduced
          ? "border-cream bg-clay text-cream"
          : "border-ink bg-cream text-ink hover:bg-sand"
      }`}
    >
      <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
        {reduced
          ? sysReduced
            ? "ativar movimento"
            : "movimento: desligado"
          : "movimento"}
      </span>
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          reduced ? "bg-cream" : "animate-pulse-dot bg-moss"
        }`}
      />
    </button>
  );
}
