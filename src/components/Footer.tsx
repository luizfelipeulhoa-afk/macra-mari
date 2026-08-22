import { useState, type FormEvent } from "react";
import { CONTACT } from "../data/atelier";
import Reveal from "./Reveal";
import {
  ArrowIcon,
  CheckIcon,
  ClockIcon,
  InstagramIcon,
  KnotMark,
  MailIcon,
  PinIcon,
  WhatsIcon,
} from "./Icons";

const hours = [
  { d: "segunda", h: "fechado — dia de tingir" },
  { d: "terça a sexta", h: "10h – 18h" },
  { d: "sábado", h: "10h – 14h" },
  { d: "domingo", h: "fechado — dia de praia" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      {/* franja de fios no topo */}
      <div className="flex justify-between border-b border-cream/10 px-1" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="w-px bg-cream/25"
            style={{ height: `${14 + ((i * 13) % 22)}px` }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* clube do nó */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-ocre">
                clube do nó
              </p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl">
                O varal novo
                <br />
                chega primeiro
                <br />
                no seu e-mail.
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-cream/70">
                Uma carta por mês: peças novas antes de irem pro site, bastidor
                do tingimento e 10% off na primeira encomenda.
              </p>

              {state === "done" ? (
                <p className="mt-6 flex items-center gap-3 border-2 border-moss bg-moss/20 px-4 py-3.5 text-[15px] font-semibold text-cream">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-moss">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  Bem-vinda(o) ao clube — a primeira carta já está no tear.
                </p>
              ) : (
                <form onSubmit={subscribe} className="mt-6" noValidate>
                  <div className="flex max-w-md border-2 border-cream/80 bg-ink focus-within:border-ocre">
                    <span className="flex items-center pl-3 text-cream/50">
                      <MailIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="seu@email.com"
                      aria-label="Seu e-mail"
                      className="w-full bg-transparent px-3 py-3.5 font-mono text-sm text-cream placeholder:text-cream/35 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="btn-knot flex items-center gap-2 bg-cream px-4 font-mono text-[12px] uppercase tracking-wider text-ink hover:text-cream"
                      style={{ "--fill": "var(--color-clay)" } as React.CSSProperties}
                    >
                      entrar
                      <ArrowIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {state === "error" && (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ocre">
                      ✳ esse e-mail não parece certo — confere pra gente?
                    </p>
                  )}
                </form>
              )}
            </Reveal>
          </div>

          {/* navegação + contato */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            <Reveal delay={120}>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.24em] text-cream/50">
                atalhos
              </p>
              <ul className="space-y-3">
                {[
                  ["#pecas", "Peças do varal"],
                  ["#colecoes", "Coleções"],
                  ["#sob-medida", "Sob medida"],
                  ["#atelier", "O atelier"],
                  ["#inicio", "Voltar ao topo"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="group inline-flex items-center gap-2 text-[15px] font-semibold text-cream/85 transition-colors hover:text-ocre"
                    >
                      <span className="h-1.5 w-1.5 rotate-45 bg-clay transition-transform duration-300 group-hover:rotate-[225deg]" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={200}>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.24em] text-cream/50">
                horários
              </p>
              <ul className="space-y-2.5">
                {hours.map((h) => (
                  <li key={h.d} className="flex items-start gap-2.5 text-[14px]">
                    <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-ocre" />
                    <span>
                      <span className="block font-semibold capitalize text-cream/90">{h.d}</span>
                      <span className="font-mono text-[12px] uppercase tracking-wider text-cream/55">
                        {h.h}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* endereço */}
          <div className="lg:col-span-3">
            <Reveal delay={280}>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.24em] text-cream/50">
                o endereço
              </p>
              <p className="flex items-start gap-2.5 text-[15px] leading-relaxed text-cream/85">
                <PinIcon className="mt-1 h-5 w-5 shrink-0 text-clay" />
                Setor Bueno
                <br />
                Goiânia — GO
              </p>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 font-mono text-[13px] text-cream/85 transition-colors hover:text-moss"
              >
                <WhatsIcon className="h-4 w-4 text-moss" />
                {CONTACT.whatsappLabel}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-1.5 flex items-center gap-2 font-mono text-[13px] text-cream/85 transition-colors hover:text-ocre"
              >
                <MailIcon className="h-4 w-4 text-ocre" />
                {CONTACT.email}
              </a>
              <div className="mt-6 flex gap-3">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram do atelier"
                  className="flex h-11 w-11 items-center justify-center border-2 border-cream/40 text-cream/80 transition-all duration-200 hover:-translate-y-1 hover:border-ocre hover:text-ocre"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp do atelier"
                  className="flex h-11 w-11 items-center justify-center border-2 border-cream/40 text-cream/80 transition-all duration-200 hover:-translate-y-1 hover:border-moss hover:text-moss"
                >
                  <WhatsIcon className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-cream/45">
                {CONTACT.instagramLabel} · pedidos pelo whatsapp · envio p/ todo o Brasil
              </p>
            </Reveal>
          </div>
        </div>

        {/* wordmark gigante */}
        <Reveal delay={100}>
          <div className="mt-16 select-none border-t border-cream/10 pt-8" aria-hidden="true">
            <p className="outline-text-cream text-center font-display text-[clamp(3rem,12.5vw,11rem)] font-extrabold leading-none tracking-tight opacity-70">
              MACRA&nbsp;MARI
            </p>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-6 font-mono text-[11px] uppercase tracking-wider text-cream/40">
          <span className="flex items-center gap-2">
            <KnotMark className="h-4 w-4 text-clay" />
            © 2026 Macra Mari — tecida com paciência em Goiânia por Mariana Ulhoa
          </span>
          <span>algodão orgânico · tingimento natural · zero pressa</span>
          <span className="text-ocre">v2.3 · tecelagem nº 3.412</span>
        </div>
      </div>
    </footer>
  );
}
