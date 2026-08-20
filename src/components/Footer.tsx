import { useState } from "react";
import { CATEGORIES } from "../data/products";
import { useStore } from "../store/useStore";
import { scrollToId } from "../lib/scroll";
import { CheckIcon, InstagramIcon, KnotMark, PinterestIcon, WhatsAppIcon } from "./Icons";

const NAV_LINKS = [
  { id: "inicio", label: "Início" },
  { id: "colecoes", label: "Coleções" },
  { id: "loja", label: "Loja" },
  { id: "atelier", label: "Atelier" },
  { id: "sustentabilidade", label: "Sustentabilidade" },
];

export default function Footer() {
  const setFilter = useStore((s) => s.setFilter);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "erro">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setStatus("erro");
      return;
    }
    setStatus("ok");
    setEmail("");
  };

  return (
    <footer id="contato" className="bg-bark-950 text-cream-100">
      {/* newsletter */}
      <div className="border-b border-cream-50/10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 lg:py-20">
          <div>
            <p className="text-[11px] font-bold tracking-[0.32em] text-olive-300 uppercase">Cartas do atelier</p>
            <h2 className="font-display mt-3 text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.05] font-light text-cream-50">
              Receba as próximas tramas <em className="text-sand-300 italic">antes de todo mundo.</em>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-100/65">
              Uma carta por mês: peças novas, bastidores do tingimento natural e o código de desconto
              que a Mari só manda por lá.
            </p>
          </div>

          {status === "ok" ? (
            <p role="status" className="flex items-center gap-4 rounded-lg border border-olive-600/50 bg-olive-800/60 px-6 py-5">
              <CheckIcon className="h-8 w-8 shrink-0 text-olive-300" />
              <span className="text-sm leading-relaxed">
                <strong className="font-display text-lg text-cream-50 italic">Obrigada!</strong>
                <br />
                Sua primeira carta chega com a próxima fornada de nós.
              </span>
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Seu melhor e-mail
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "erro") setStatus("idle");
                  }}
                  placeholder="seu@melhoremail.com"
                  className="h-13 min-h-[52px] flex-1 rounded-full border border-cream-50/15 bg-bark-900 px-6 text-cream-50 placeholder:text-cream-100/35 focus:border-olive-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-13 min-h-[52px] rounded-full bg-cream-50 px-8 text-sm font-bold tracking-wide text-bark-900 uppercase transition-colors duration-300 hover:bg-sand-300"
                >
                  Assinar
                </button>
              </div>
              {status === "erro" && (
                <p role="alert" className="mt-3 pl-4 text-sm font-semibold text-clay-300">
                  Hmm, esse e-mail não parece certo. Confere e tenta de novo?
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* rodapé */}
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <p className="flex items-center gap-3">
              <KnotMark className="h-9 w-9 text-olive-400" />
              <span className="font-display text-3xl font-medium tracking-tight text-cream-50">
                Macra <em className="text-sand-300 italic">Mari</em>
              </span>
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-100/60">
              Atelier de macramê autoral em Tiradentes — MG. Quadros, mandalas, porta-vasos, bolsas e
              porta-copos tecidos à mão, um nó de cada vez, desde 2013.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { label: "Instagram da Macra Mari", Icon: InstagramIcon },
                { label: "Pinterest da Macra Mari", Icon: PinterestIcon },
                { label: "Falar com a Macra Mari no WhatsApp", Icon: WhatsAppIcon },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-cream-50/15 text-cream-100/70 transition-all duration-300 hover:border-olive-400 hover:bg-olive-700 hover:text-cream-50"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <nav aria-label="Rodapé — navegação">
            <h3 className="text-[11px] font-bold tracking-[0.28em] text-olive-300 uppercase">Navegação</h3>
            <ul className="mt-5 space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => scrollToId(l.id)}
                    className="inline-flex min-h-[44px] items-center text-sm text-cream-100/70 transition-colors hover:text-cream-50"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Rodapé — coleções">
            <h3 className="text-[11px] font-bold tracking-[0.28em] text-olive-300 uppercase">Coleções</h3>
            <ul className="mt-5 space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setFilter(c.id);
                      scrollToId("loja");
                    }}
                    className="inline-flex min-h-[44px] items-center text-sm text-cream-100/70 transition-colors hover:text-cream-50"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-[11px] font-bold tracking-[0.28em] text-olive-300 uppercase">Cuidados & contato</h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-cream-100/70">
              <li>Como cuidar do seu macramê: penteie a franja a cada lua cheia e lave à mão, com sabão de coco.</li>
              <li>Trocas em até 30 dias — peças sob medida, em 7.</li>
              <li>
                <a
                  href="mailto:ola@macramari.com.br"
                  className="font-semibold text-sand-300 underline decoration-sand-300/40 underline-offset-4 transition-colors hover:text-cream-50"
                >
                  ola@macramari.com.br
                </a>
              </li>
              <li>Prazo de produção: 5 a 10 dias úteis de nós.</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream-50/10 pt-6 text-xs text-cream-100/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Macra Mari — todos os nós reservados.</p>
          <p className="flex items-center gap-2">
            <KnotMark className="h-3.5 w-3.5" />
            Cores e medidas podem variar: cada peça é única, como toda coisa feita à mão.
          </p>
        </div>
      </div>
    </footer>
  );
}
