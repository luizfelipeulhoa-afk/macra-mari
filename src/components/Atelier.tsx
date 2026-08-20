import { testimonials, atelierImg } from "../data/atelier";
import Reveal from "./Reveal";
import MaskTitle from "./MaskTitle";
import {
  HandIcon,
  LeafIcon,
  ScissorsIcon,
  StarIcon,
  ThreadIcon,
} from "./Icons";

const steps = [
  {
    n: "01",
    title: "A escolha do fio",
    icon: LeafIcon,
    text: "Algodão orgânico de cooperativa do sertão, tingido aqui no tacho com urucum, açafrão e casca de cebola. Nenhum rolo é igual ao outro.",
    tone: "text-moss",
  },
  {
    n: "02",
    title: "A urdidura",
    icon: ThreadIcon,
    text: "Fios medidos um a um e presos no tear de madeira da família. A tensão certa é o segredo que nenhuma máquina copia.",
    tone: "text-clay",
  },
  {
    n: "03",
    title: "Milhares de nós",
    icon: HandIcon,
    text: "Nó quadrado, meio-nó, nó festonê — repetidos milhares de vezes, em sessões de duas horas com rádio ligada e café passado na hora.",
    tone: "text-ocre",
  },
  {
    n: "04",
    title: "Franjas & despedida",
    icon: ScissorsIcon,
    text: "Franjas penteadas, vapor pra assentar, etiqueta numerada à mão e um bilhete de despedida. A peça sai do varal direto pra sua parede.",
    tone: "text-moss",
  },
];

export default function Atelier() {
  return (
    <section id="atelier" className="relative scroll-mt-24 border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* coluna fixa */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-clay">
                <HandIcon className="h-4 w-4" /> por dentro do atelier
              </p>
              <MaskTitle
                lines={[
                  { text: "Devagar é" },
                  { text: "o nosso ritmo", className: "outline-text" },
                ]}
                className="font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-tight"
              />
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-bark">
                Há 3 anos, a Mariana Ulhoa trocou o escritório por uma casa com
                quintal no Setor Bueno, em Goiânia — varal na varanda, tacho de
                tingimento no fogão e mais de 100 clientes que viraram amigos.
                Tudo o que sai daqui passou pelas mãos dela — e pelas suas,
                quando pendura.
              </p>
            </Reveal>

            <Reveal delay={180} rot={-2} rotFinal={-1}>
              <figure className="wipe img-zoom relative mt-8 overflow-hidden border-2 border-ink shadow-[8px_10px_0_rgba(44,30,19,0.14)]">
                <img
                  src={atelierImg}
                  alt="Mãos tecendo nós de macramê no atelier"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 border-t-2 border-ink bg-cream/95 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bark">
                  bancada nº 1 · ter. a sex., 10h–18h · visita com hora marcada
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* passos */}
          <div className="space-y-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100} rot={i % 2 ? 1.5 : -1.5}>
                <article className="card-lift group flex gap-5 border-2 border-ink bg-cream p-6 sm:p-7">
                  <span className={`font-display text-5xl font-extrabold leading-none ${s.tone} transition-transform duration-300 group-hover:-rotate-6`}>
                    {s.n}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight">
                      <s.icon className={`h-6 w-6 ${s.tone}`} />
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-bark">{s.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}

            {/* depoimentos — cartões postais */}
            <div className="pt-10">
              <Reveal>
                <p className="mb-6 font-mono text-[12px] uppercase tracking-[0.24em] text-bark">
                  ✳ cartões que chegam pelo correio
                </p>
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2">
                {testimonials.map((t, i) => (
                  <Reveal
                    key={t.name}
                    delay={i * 110}
                    rot={i % 2 ? 3 : -3}
                    rotFinal={i % 2 ? 1.5 : -1.5}
                  >
                    <figure className="relative border-2 border-ink bg-paper p-5 shadow-[5px_6px_0_rgba(44,30,19,0.12)] transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:!rotate-0">
                      {/* selo */}
                      <span className="absolute -right-2.5 -top-2.5 flex h-9 w-9 rotate-12 items-center justify-center border-2 border-ink bg-ocre">
                        <KnotStamp />
                      </span>
                      <span className="flex gap-0.5 text-clay">
                        {[...Array(5)].map((_, k) => (
                          <StarIcon key={k} className="h-3.5 w-3.5" />
                        ))}
                      </span>
                      <blockquote className="mt-3 text-[14px] leading-relaxed text-ink">
                        “{t.quote}”
                      </blockquote>
                      <figcaption className="mt-4 border-t border-dashed border-bark/40 pt-3">
                        <span className="block font-display text-sm font-bold">{t.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-bark">
                          {t.city} · levou: {t.piece}
                        </span>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KnotStamp() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 5c5 1.8 5 4.5 5 7s0 5.2-5 7M17 5c-5 1.8-5 4.5-5 7s0 5.2 5 7" />
    </svg>
  );
}
